/**
 * Users Routes
 * User profiles and connections
 */

import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

export async function usersRoutes(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
): Promise<void> {

    /**
     * GET /:id
     * Get user profile
     */
    fastify.get('/:id', { preHandler: optionalAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const currentUserId = (request as any).user?.userId;

        const user = await prisma.user.findUnique({
            where: { id },
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

        // Check connection status if logged in
        let connectionStatus = null;
        if (currentUserId && currentUserId !== id) {
            const connection = await prisma.connection.findFirst({
                where: {
                    OR: [
                        { fromUserId: currentUserId, toUserId: id },
                        { fromUserId: id, toUserId: currentUserId },
                    ],
                },
            });
            connectionStatus = connection?.status || null;
        }

        reply.send({
            user: {
                ...user,
                connectionStatus,
            },
        });
    });

    /**
     * PATCH /me
     * Update current user's profile
     */
    fastify.patch('/me', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const updates = request.body as Record<string, any>;

        // Only allow certain fields to be updated
        const allowedFields = ['displayName', 'bio', 'avatarUrl', 'travelStyle', 'languages', 'favoriteDestinations'];
        const filteredUpdates: Record<string, any> = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: filteredUpdates,
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                travelStyle: true,
                languages: true,
            },
        });

        reply.send({ user });
    });

    /**
     * DELETE /me
     * Delete current user account and revoke active sessions
     */
    fastify.delete('/me', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;

        // Revoke all active sessions
        await prisma.userSession.updateMany({
            where: { userId },
            data: { revokedAt: new Date() },
        });

        // Delete user (cascade removes sessions, trips, etc.)
        await prisma.user.delete({
            where: { id: userId },
        });

        reply.send({ success: true, message: 'Account deleted successfully' });
    });

    /**
     * POST /:id/report
     * Report an abusive user or objectionable content (Apple Guideline 1.2)
     */
    fastify.post('/:id/report', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const reporterId = (request as any).user.userId;
        const { id: targetUserId } = request.params as { id: string };
        const { reason, details } = (request.body as { reason?: string; details?: string }) || {};

        if (!reason) {
            return reply.status(400).send({ error: 'Reason is required' });
        }

        const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const reportData = JSON.stringify({
            id: reportId,
            reporterId,
            targetUserId,
            reason,
            details: details || '',
            createdAt: new Date().toISOString(),
            status: 'pending',
        });

        // 1. Fast distributed cache in Redis (30 days)
        try {
            await redis.setex(`report:${reportId}`, 60 * 60 * 24 * 30, reportData);
            await redis.sadd('reports:all', reportId);
            await redis.sadd(`reports:user:${targetUserId}`, reportId);
        } catch (rErr) {
            fastify.log.warn({ rErr }, 'Redis cache failed for report');
        }

        // 2. Permanent storage in PostgreSQL (Survives Redis flushes & restarts)
        try {
            await prisma.feedback.create({
                data: {
                    fromUserId: reporterId,
                    toUserId: targetUserId,
                    vibeRating: 'REPORT',
                    wouldTravelAgain: false,
                    anonymousNote: JSON.stringify({
                        reportId,
                        reason,
                        details: details || '',
                        status: 'pending',
                    }),
                },
            });
        } catch (dbErr) {
            fastify.log.warn({ dbErr }, 'PostgreSQL feedback persist failed for report');
        }

        fastify.log.info({ reportId, reporterId, targetUserId, reason }, 'User report submitted');

        reply.status(201).send({
            success: true,
            reportId,
            message: 'Report submitted successfully. Our safety team will review it within 24 hours.',
        });
    });

    /**
     * POST /:id/block
     * Block an abusive user (Apple Guideline 1.2) - Persisted in PostgreSQL
     */
    fastify.post('/:id/block', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUserId = (request as any).user.userId;
        const { id: targetUserId } = request.params as { id: string };

        if (currentUserId === targetUserId) {
            return reply.status(400).send({ error: 'Cannot block yourself' });
        }

        // Cache in Redis for quick access
        await redis.sadd(`blocked:${currentUserId}`, targetUserId);

        // Delete inverse connection if any
        await prisma.connection.deleteMany({
            where: { fromUserId: targetUserId, toUserId: currentUserId },
        });

        // Upsert block record in PostgreSQL
        await prisma.connection.upsert({
            where: {
                fromUserId_toUserId: { fromUserId: currentUserId, toUserId: targetUserId },
            },
            create: {
                fromUserId: currentUserId,
                toUserId: targetUserId,
                status: 'blocked',
            },
            update: {
                status: 'blocked',
            },
        });

        reply.send({ success: true, message: 'User blocked successfully' });
    });

    /**
     * DELETE /:id/block
     * Unblock a user
     */
    fastify.delete('/:id/block', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUserId = (request as any).user.userId;
        const { id: targetUserId } = request.params as { id: string };

        await redis.srem(`blocked:${currentUserId}`, targetUserId);

        await prisma.connection.deleteMany({
            where: {
                fromUserId: currentUserId,
                toUserId: targetUserId,
                status: 'blocked',
            },
        });

        reply.send({ success: true, message: 'User unblocked successfully' });
    });

    /**
     * GET /me/blocked
     * Get list of blocked user IDs from PostgreSQL
     */
    fastify.get('/me/blocked', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUserId = (request as any).user.userId;

        const blockedConnections = await prisma.connection.findMany({
            where: { fromUserId: currentUserId, status: 'blocked' },
            select: { toUserId: true },
        });

        const blockedUserIds = blockedConnections.map((c) => c.toUserId);
        reply.send({ data: blockedUserIds });
    });

    /**
     * POST /:id/connect
     * Send connection request
     */
    fastify.post('/:id/connect', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUserId = (request as any).user.userId;
        const { id: targetUserId } = request.params as { id: string };
        const { icebreaker } = request.body as { icebreaker?: string };

        if (currentUserId === targetUserId) {
            return reply.status(400).send({ error: 'Cannot connect with yourself' });
        }

        // Check if connection already exists
        const existingConnection = await prisma.connection.findFirst({
            where: {
                OR: [
                    { fromUserId: currentUserId, toUserId: targetUserId },
                    { fromUserId: targetUserId, toUserId: currentUserId },
                ],
            },
        });

        if (existingConnection) {
            return reply.status(400).send({
                error: 'Connection already exists',
                status: existingConnection.status
            });
        }

        // Create connection request
        const connection = await prisma.connection.create({
            data: {
                fromUserId: currentUserId,
                toUserId: targetUserId,
                status: 'pending',
                icebreaker,
            },
        });

        reply.status(201).send({ connection });
    });

    /**
     * POST /:id/accept
     * Accept connection request
     */
    fastify.post('/:id/accept', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUserId = (request as any).user.userId;
        const { id: fromUserId } = request.params as { id: string };

        const connection = await prisma.connection.findFirst({
            where: {
                fromUserId,
                toUserId: currentUserId,
                status: 'pending',
            },
        });

        if (!connection) {
            return reply.status(404).send({ error: 'Connection request not found' });
        }

        await prisma.connection.update({
            where: { id: connection.id },
            data: { status: 'accepted' },
        });

        reply.send({ success: true, status: 'accepted' });
    });

    /**
     * DELETE /:id/connection
     * Remove connection
     */
    fastify.delete('/:id/connection', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUserId = (request as any).user.userId;
        const { id: otherUserId } = request.params as { id: string };

        const connection = await prisma.connection.findFirst({
            where: {
                OR: [
                    { fromUserId: currentUserId, toUserId: otherUserId },
                    { fromUserId: otherUserId, toUserId: currentUserId },
                ],
            },
        });

        if (!connection) {
            return reply.status(404).send({ error: 'Connection not found' });
        }

        await prisma.connection.delete({
            where: { id: connection.id },
        });

        reply.send({ success: true });
    });

    /**
     * GET /me/connections
     * Get user's connections
     */
    fastify.get('/me/connections', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { status = 'accepted' } = request.query as { status?: string };

        const connections = await prisma.connection.findMany({
            where: {
                OR: [
                    { fromUserId: userId, status },
                    { toUserId: userId, status },
                ],
            },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
                toUser: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        const users = connections.map((c) => {
            const otherUser = c.fromUserId === userId ? c.toUser : c.fromUser;
            return {
                ...otherUser,
                connectionId: c.id,
                connectedAt: c.updatedAt,
            };
        });

        reply.send({ data: users });
    });
}
