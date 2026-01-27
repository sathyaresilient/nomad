/**
 * Nomadly Media Service
 * File uploads, processing, CDN delivery
 */

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { Storage } from '@google-cloud/storage';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import Fastify, { FastifyInstance } from 'fastify';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const storage = new Storage();
const mediaBucket = process.env.GCS_MEDIA_BUCKET || 'nomadly-media';
const uploadsBucket = process.env.GCS_UPLOADS_BUCKET || 'nomadly-uploads';
const cdnUrl = process.env.CDN_URL || '';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
        redis: typeof redis;
        authenticate: (request: any, reply: any) => Promise<void>;
    }
}

const app: FastifyInstance = Fastify({ logger: true, trustProxy: true });

app.decorate('prisma', prisma);
app.decorate('redis', redis);
app.decorate('authenticate', async function (request: any, reply: any) {
    try { await request.jwtVerify(); } catch { reply.status(401).send({ error: 'Unauthorized' }); }
});

// Health
app.get('/health', async () => ({ status: 'ok', service: 'media-service' }));

// Generate upload URL
app.post('/api/v1/media/upload-url', { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.userId;
    const { filename, contentType, size, purpose } = request.body as any;

    const uploadId = randomUUID();
    const ext = filename.split('.').pop();
    const objectPath = `uploads/${userId}/${uploadId}.${ext}`;

    const [signedUrl] = await storage.bucket(uploadsBucket).file(objectPath).getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType,
    });

    await redis.setex(`upload:${uploadId}`, 900, JSON.stringify({
        uploadId, userId, filename, contentType, size, purpose, objectPath,
    }));

    return { uploadId, signedUrl, expiresIn: 900 };
});

// Confirm upload
app.post('/api/v1/media/confirm', { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.userId;
    const { uploadId, metadata } = request.body as any;

    const uploadMeta = await redis.get(`upload:${uploadId}`);
    if (!uploadMeta) return reply.status(404).send({ error: 'Upload not found' });

    const meta = JSON.parse(uploadMeta);
    if (meta.userId !== userId) return reply.status(403).send({ error: 'Not authorized' });

    const mediaId = randomUUID();
    const ext = meta.filename.split('.').pop();
    const permanentPath = `${meta.purpose}/${userId}/${mediaId}.${ext}`;

    const sourceFile = storage.bucket(uploadsBucket).file(meta.objectPath);
    const destFile = storage.bucket(mediaBucket).file(permanentPath);
    await sourceFile.copy(destFile);
    await sourceFile.delete();

    const media = await prisma.media.create({
        data: {
            id: mediaId, userId, filename: meta.filename, contentType: meta.contentType,
            size: meta.size, purpose: meta.purpose, storagePath: permanentPath, metadata: metadata || {},
        },
    });

    await redis.del(`upload:${uploadId}`);

    return {
        id: media.id,
        url: `https://storage.googleapis.com/${mediaBucket}/${permanentPath}`,
        cdnUrl: cdnUrl ? `${cdnUrl}/${permanentPath}` : undefined,
    };
});

// Get media
app.get('/api/v1/media/:id', async (request) => {
    const { id } = request.params as { id: string };
    const media = await prisma.media.findUnique({ where: { id, deletedAt: null } });
    if (!media) return { error: 'Not found' };
    return {
        ...media,
        url: `https://storage.googleapis.com/${mediaBucket}/${media.storagePath}`,
        cdnUrl: cdnUrl ? `${cdnUrl}/${media.storagePath}` : undefined,
    };
});

// Delete media
app.delete('/api/v1/media/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return reply.status(404).send({ error: 'Not found' });
    if (media.userId !== userId) return reply.status(403).send({ error: 'Not authorized' });

    await prisma.media.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
});

async function start() {
    await app.register(helmet);
    await app.register(cors, { origin: true, credentials: true });
    await app.register(jwt, { secret: process.env.JWT_SECRET || 'secret' });

    const port = parseInt(process.env.PORT || '3003');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`📸 Media Service running on port ${port}`);
}

process.on('SIGTERM', async () => { await app.close(); process.exit(0); });
start();
