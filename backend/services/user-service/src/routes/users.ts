/**
 * Users Routes - User Service
 * Profile management and trust scores
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { config } from '../config.js';

// Validation schemas
const updateUserSchema = z.object({
    displayName: z.string().min(2).max(50).optional(),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    travelStyle: z.string().optional(),
    languages: z.array(z.string()).optional(),
    favoriteDestinations: z.array(z.string()).optional(),
});

const listUsersSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
    search: z.string().optional(),
    trustLevel: z.enum(['new', 'bronze', 'silver', 'gold', 'platinum']).optional(),
    verifiedOnly: z.coerce.boolean().default(false),
});

// Types
interface AuthenticatedRequest extends FastifyRequest {
    user: { userId: string; email: string };
}

export default async function usersRoutes(fastify: FastifyInstance) {
    const { prisma, redis } = fastify;

    /**
     * GET /:id
     * Get user by ID
     */
    fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };

        const user = await prisma.user.findUnique({
            where: { id, isActive: true },
            select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                travelStyle: true,
                languages: true,
                trustLevel: true,
                rating: true,
                tripCount: true,
                countriesVisited: true,
                favoriteDestinations: true,
                isVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        reply.send({ user: { ...user, rating: Number(user.rating) } });
    });

    /**
     * GET /
     * List users with filters
     */
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const query = listUsersSchema.parse(request.query);

        const where: any = {
            isActive: true,
            deletedAt: null,
        };

        if (query.search) {
            where.OR = [
                { displayName: { contains: query.search, mode: 'insensitive' } },
                { bio: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        if (query.trustLevel) {
            where.trustLevel = query.trustLevel;
        }

        if (query.verifiedOnly) {
            where.isVerified = true;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    displayName: true,
                    avatarUrl: true,
                    bio: true,
                    trustLevel: true,
                    rating: true,
                    isVerified: true,
                },
                orderBy: [{ rating: 'desc' }, { tripCount: 'desc' }],
                take: query.limit,
                skip: query.offset,
            }),
            prisma.user.count({ where }),
        ]);

        reply.send({
            users: users.map((u) => ({ ...u, rating: Number(u.rating) })),
            total,
            limit: query.limit,
            offset: query.offset,
        });
    });

    /**
     * PATCH /:id
     * Update user profile
     */
    fastify.patch(
        '/:id',
        { preHandler: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const userId = (request as AuthenticatedRequest).user.userId;

            if (id !== userId) {
                return reply.status(403).send({ error: 'Cannot update another user' });
            }

            const body = updateUserSchema.parse(request.body);

            const user = await prisma.user.update({
                where: { id },
                data: body,
                select: {
                    id: true,
                    email: true,
                    displayName: true,
                    avatarUrl: true,
                    bio: true,
                    travelStyle: true,
                    languages: true,
                    favoriteDestinations: true,
                    trustLevel: true,
                    rating: true,
                    updatedAt: true,
                },
            });

            // Publish user.updated event
            await redis.publish('nomadly:events', JSON.stringify({
                specversion: '1.0',
                type: 'nomadly.user.updated',
                source: '/services/user',
                id: uuid(),
                time: new Date().toISOString(),
                data: {
                    userId: user.id,
                    updatedFields: Object.keys(body),
                },
            }));

            reply.send({ user: { ...user, rating: Number(user.rating) } });
        }
    );

    /**
     * DELETE /:id
     * Soft delete user
     */
    fastify.delete(
        '/:id',
        { preHandler: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const userId = (request as AuthenticatedRequest).user.userId;

            if (id !== userId) {
                return reply.status(403).send({ error: 'Cannot delete another user' });
            }

            await prisma.user.update({
                where: { id },
                data: {
                    isActive: false,
                    deletedAt: new Date(),
                },
            });

            // Publish user.deleted event
            await redis.publish('nomadly:events', JSON.stringify({
                specversion: '1.0',
                type: 'nomadly.user.deleted',
                source: '/services/user',
                id: uuid(),
                time: new Date().toISOString(),
                data: {
                    userId: id,
                    deletedAt: new Date().toISOString(),
                },
            }));

            reply.send({ success: true });
        }
    );

    /**
     * GET /:id/trust-score
     * Get user trust score
     */
    fastify.get('/:id/trust-score', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                trustLevel: true,
                rating: true,
                tripCount: true,
                feedbackCount: true,
                isVerified: true,
            },
        });

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        // Calculate score breakdown
        const { trustScore } = config;
        const tripPoints = user.tripCount * trustScore.tripWeight;
        const verificationPoints = user.isVerified ? trustScore.verificationBonus : 0;
        const totalScore = tripPoints + verificationPoints;

        reply.send({
            userId: user.id,
            trustLevel: user.trustLevel,
            rating: Number(user.rating),
            tripCount: user.tripCount,
            feedbackCount: user.feedbackCount,
            breakdown: {
                tripPoints,
                verificationPoints,
                totalScore,
            },
            thresholds: trustScore.thresholds,
        });
    });

    /**
     * POST /:id/trust-score/recalculate
     * Recalculate and update trust score
     */
    fastify.post('/:id/trust-score/recalculate', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                tripCount: true,
                feedbackCount: true,
                isVerified: true,
            },
        });

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        // Calculate new trust level
        const { trustScore } = config;
        const tripPoints = user.tripCount * trustScore.tripWeight;
        const verificationPoints = user.isVerified ? trustScore.verificationBonus : 0;
        const totalScore = tripPoints + verificationPoints;

        let newTrustLevel = 'new';
        if (totalScore >= trustScore.thresholds.platinum) {
            newTrustLevel = 'platinum';
        } else if (totalScore >= trustScore.thresholds.gold) {
            newTrustLevel = 'gold';
        } else if (totalScore >= trustScore.thresholds.silver) {
            newTrustLevel = 'silver';
        } else if (totalScore >= trustScore.thresholds.bronze) {
            newTrustLevel = 'bronze';
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { trustLevel: newTrustLevel },
            select: {
                id: true,
                trustLevel: true,
                tripCount: true,
                feedbackCount: true,
            },
        });

        reply.send({
            userId: updatedUser.id,
            previousLevel: user.tripCount > 0 ? 'recalculated' : 'new',
            newLevel: updatedUser.trustLevel,
            totalScore,
        });
    });
}
