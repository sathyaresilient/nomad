/**
 * Media Routes
 * Handles file uploads via GCS signed URLs, metadata storage, and CDN delivery
 */

import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Initialize GCS client
const storage = new Storage();
const mediaBucket = process.env.GCS_MEDIA_BUCKET || 'nomadly-media';
const uploadsBucket = process.env.GCS_UPLOADS_BUCKET || 'nomadly-uploads';
const cdnUrl = process.env.CDN_URL || '';

// Types
interface AuthenticatedRequest extends FastifyRequest {
    user: { userId: string };
}

export default async function mediaRoutes(fastify: FastifyInstance) {
    const { prisma } = fastify;

    // ===================================================
    // Generate Signed Upload URL
    // ===================================================
    fastify.post(
        '/upload-url',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Generate a signed URL for direct file upload to GCS',
                tags: ['Media'],
                body: {
                    type: 'object',
                    required: ['filename', 'contentType', 'size', 'purpose'],
                    properties: {
                        filename: { type: 'string', minLength: 1, maxLength: 255 },
                        contentType: { type: 'string', pattern: '^(image|video|audio|application)/' },
                        size: { type: 'integer', minimum: 1, maximum: 52428800 },
                        purpose: { type: 'string', enum: ['avatar', 'cover', 'post', 'message', 'document'] },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const body = request.body as { filename: string; contentType: string; size: number; purpose: string };

            const uploadId = randomUUID();
            const extension = body.filename.split('.').pop() || '';
            const objectPath = `uploads/${user.userId}/${uploadId}.${extension}`;

            try {
                const bucket = storage.bucket(uploadsBucket);
                const file = bucket.file(objectPath);

                // Generate signed URL valid for 15 minutes
                const [signedUrl] = await file.getSignedUrl({
                    version: 'v4',
                    action: 'write',
                    expires: Date.now() + 15 * 60 * 1000,
                    contentType: body.contentType,
                });

                // Store pending upload metadata in Redis for confirmation
                const uploadMeta = {
                    uploadId,
                    userId: user.userId,
                    filename: body.filename,
                    contentType: body.contentType,
                    size: body.size,
                    purpose: body.purpose,
                    objectPath,
                    createdAt: new Date().toISOString(),
                };

                await fastify.redis.setex(
                    `upload:${uploadId}`,
                    900, // 15 minutes
                    JSON.stringify(uploadMeta)
                );

                return reply.send({
                    uploadId,
                    signedUrl,
                    expiresIn: 900,
                    objectPath,
                });
            } catch (error) {
                fastify.log.error(error, 'Failed to generate signed URL');
                return reply.status(500).send({
                    error: 'Failed to generate upload URL'
                });
            }
        }
    );

    // ===================================================
    // Confirm Upload & Move to Permanent Storage
    // ===================================================
    fastify.post(
        '/confirm',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Confirm upload and move file to permanent storage',
                tags: ['Media'],
                body: {
                    type: 'object',
                    required: ['uploadId', 'purpose'],
                    properties: {
                        uploadId: { type: 'string', format: 'uuid' },
                        purpose: { type: 'string', enum: ['avatar', 'cover', 'post', 'message', 'document'] },
                        metadata: { type: 'object', additionalProperties: true },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const body = request.body as { uploadId: string; purpose: string; metadata?: Record<string, unknown> };

            // Get pending upload metadata
            const uploadMetaJson = await fastify.redis.get(`upload:${body.uploadId}`);
            if (!uploadMetaJson) {
                return reply.status(404).send({
                    error: 'Upload not found or expired'
                });
            }

            const uploadMeta = JSON.parse(uploadMetaJson);

            // Verify ownership
            if (uploadMeta.userId !== user.userId) {
                return reply.status(403).send({
                    error: 'Not authorized to confirm this upload'
                });
            }

            try {
                // Move file from uploads bucket to media bucket
                const sourceFile = storage.bucket(uploadsBucket).file(uploadMeta.objectPath);

                // Check if file exists
                const [exists] = await sourceFile.exists();
                if (!exists) {
                    return reply.status(400).send({
                        error: 'File not uploaded yet'
                    });
                }

                // Generate permanent path
                const mediaId = randomUUID();
                const extension = uploadMeta.filename.split('.').pop() || '';
                const permanentPath = `${body.purpose}/${user.userId}/${mediaId}.${extension}`;

                // Copy to permanent location
                const destinationFile = storage.bucket(mediaBucket).file(permanentPath);
                await sourceFile.copy(destinationFile);

                // Delete temporary file
                await sourceFile.delete();

                // Store media metadata in database
                const media = await prisma.media.create({
                    data: {
                        id: mediaId,
                        userId: user.userId,
                        filename: uploadMeta.filename,
                        contentType: uploadMeta.contentType,
                        size: uploadMeta.size,
                        purpose: body.purpose,
                        storagePath: permanentPath,
                        metadata: body.metadata ? JSON.parse(JSON.stringify(body.metadata)) : {},
                    },
                });

                // Clean up Redis
                await fastify.redis.del(`upload:${body.uploadId}`);

                // Build URLs
                const publicUrl = `https://storage.googleapis.com/${mediaBucket}/${permanentPath}`;
                const cdnMediaUrl = cdnUrl ? `${cdnUrl}/${permanentPath}` : publicUrl;

                return reply.send({
                    id: media.id,
                    url: publicUrl,
                    cdnUrl: cdnMediaUrl,
                    filename: media.filename,
                    contentType: media.contentType,
                    size: media.size,
                    purpose: media.purpose,
                });
            } catch (error) {
                fastify.log.error(error, 'Failed to confirm upload');
                return reply.status(500).send({
                    error: 'Failed to process upload'
                });
            }
        }
    );

    // ===================================================
    // Get Media by ID
    // ===================================================
    fastify.get(
        '/:id',
        {
            schema: {
                description: 'Get media metadata by ID',
                tags: ['Media'],
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };

            const media = await prisma.media.findUnique({
                where: { id, deletedAt: null },
            });

            if (!media) {
                return reply.status(404).send({ error: 'Media not found' });
            }

            const publicUrl = `https://storage.googleapis.com/${mediaBucket}/${media.storagePath}`;
            const cdnMediaUrl = cdnUrl ? `${cdnUrl}/${media.storagePath}` : publicUrl;

            return reply.send({
                id: media.id,
                url: publicUrl,
                cdnUrl: cdnMediaUrl,
                filename: media.filename,
                contentType: media.contentType,
                size: media.size,
                purpose: media.purpose,
                createdAt: media.createdAt,
            });
        }
    );

    // ===================================================
    // Delete Media
    // ===================================================
    fastify.delete(
        '/:id',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Soft delete media',
                tags: ['Media'],
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const { id } = request.params as { id: string };

            const media = await prisma.media.findUnique({
                where: { id },
            });

            if (!media) {
                return reply.status(404).send({ error: 'Media not found' });
            }

            if (media.userId !== user.userId) {
                return reply.status(403).send({ error: 'Not authorized' });
            }

            // Soft delete
            await prisma.media.update({
                where: { id },
                data: { deletedAt: new Date() },
            });

            return reply.send({ success: true });
        }
    );

    // ===================================================
    // List User's Media
    // ===================================================
    fastify.get(
        '/my-media',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'List authenticated user\'s media',
                tags: ['Media'],
                querystring: {
                    type: 'object',
                    properties: {
                        purpose: { type: 'string', enum: ['avatar', 'cover', 'post', 'message', 'document'] },
                        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                        offset: { type: 'integer', minimum: 0, default: 0 },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const query = request.query as { purpose?: string; limit?: number; offset?: number };
            const limit = query.limit || 20;
            const offset = query.offset || 0;

            const where = {
                userId: user.userId,
                deletedAt: null,
                ...(query.purpose && { purpose: query.purpose }),
            };

            const [media, total] = await Promise.all([
                prisma.media.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip: offset,
                }),
                prisma.media.count({ where }),
            ]);

            return reply.send({
                media: media.map((m) => ({
                    id: m.id,
                    url: `https://storage.googleapis.com/${mediaBucket}/${m.storagePath}`,
                    cdnUrl: cdnUrl ? `${cdnUrl}/${m.storagePath}` : undefined,
                    filename: m.filename,
                    contentType: m.contentType,
                    size: m.size,
                    purpose: m.purpose,
                    createdAt: m.createdAt,
                })),
                total,
                limit,
                offset,
            });
        }
    );
}
