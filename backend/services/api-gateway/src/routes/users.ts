/**
 * Users Routes
 * User profiles and connections
 */

import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma.js';
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
