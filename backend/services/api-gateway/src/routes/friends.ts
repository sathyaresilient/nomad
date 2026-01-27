/**
 * Friends Routes
 * Friend requests, connections, and blocking
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function friendsRoutes(app: FastifyInstance) {
    // ============= FRIEND REQUESTS =============

    // Send friend request
    app.post('/api/v1/friends/request', {
        preHandler: [app.authenticate],
        schema: {
            body: {
                type: 'object',
                required: ['toUserId'],
                properties: {
                    toUserId: { type: 'string' },
                    message: { type: 'string' },
                },
            },
        },
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { toUserId, message } = request.body as { toUserId: string; message?: string };

        // Check if already friends
        const existing = await app.prisma.connection.findFirst({
            where: {
                OR: [
                    { fromUserId: userId, toUserId },
                    { fromUserId: toUserId, toUserId: userId },
                ],
            },
        });

        if (existing) {
            return reply.status(400).send({ error: 'Connection already exists' });
        }

        const connection = await app.prisma.connection.create({
            data: {
                fromUserId: userId,
                toUserId,
                status: 'pending',
                icebreaker: message,
            },
        });

        return connection;
    });

    // Get pending requests (received)
    app.get('/api/v1/friends/requests/received', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;

        return app.prisma.connection.findMany({
            where: { toUserId: userId, status: 'pending' },
            include: {
                fromUser: {
                    select: { id: true, displayName: true, avatarUrl: true, bio: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    });

    // Get pending requests (sent)
    app.get('/api/v1/friends/requests/sent', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;

        return app.prisma.connection.findMany({
            where: { fromUserId: userId, status: 'pending' },
            include: {
                toUser: {
                    select: { id: true, displayName: true, avatarUrl: true, bio: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    });

    // Accept friend request
    app.post('/api/v1/friends/request/:id/accept', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };

        const connection = await app.prisma.connection.findFirst({
            where: { id, toUserId: userId, status: 'pending' },
        });

        if (!connection) {
            return reply.status(404).send({ error: 'Request not found' });
        }

        const updated = await app.prisma.connection.update({
            where: { id },
            data: { status: 'accepted' },
        });

        return updated;
    });

    // Decline friend request
    app.post('/api/v1/friends/request/:id/decline', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };

        await app.prisma.connection.deleteMany({
            where: { id, toUserId: userId, status: 'pending' },
        });

        return { success: true };
    });

    // Cancel sent request
    app.delete('/api/v1/friends/request/:id', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };

        await app.prisma.connection.deleteMany({
            where: { id, fromUserId: userId, status: 'pending' },
        });

        return { success: true };
    });

    // ============= FRIENDS LIST =============

    // Get all friends
    app.get('/api/v1/friends', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;

        const connections = await app.prisma.connection.findMany({
            where: {
                OR: [
                    { fromUserId: userId, status: 'accepted' },
                    { toUserId: userId, status: 'accepted' },
                ],
            },
            include: {
                fromUser: { select: { id: true, displayName: true, avatarUrl: true, bio: true } },
                toUser: { select: { id: true, displayName: true, avatarUrl: true, bio: true } },
            },
        });

        // Transform to friend list
        return connections.map((c) => {
            const friend = c.fromUserId === userId ? c.toUser : c.fromUser;
            return {
                id: c.id,
                odName: friend.displayName,
                avatarUrl: friend.avatarUrl,
                bio: friend.bio,
                connectedAt: c.createdAt,
            };
        });
    });

    // Remove friend
    app.delete('/api/v1/friends/:userId', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const currentUserId = (request as any).user.userId;
        const { userId } = request.params as { userId: string };

        await app.prisma.connection.deleteMany({
            where: {
                OR: [
                    { fromUserId: currentUserId, toUserId: userId },
                    { fromUserId: userId, toUserId: currentUserId },
                ],
                status: 'accepted',
            },
        });

        return { success: true };
    });

    // Get connection status with user
    app.get('/api/v1/friends/status/:userId', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const currentUserId = (request as any).user.userId;
        const { userId } = request.params as { userId: string };

        const connection = await app.prisma.connection.findFirst({
            where: {
                OR: [
                    { fromUserId: currentUserId, toUserId: userId },
                    { fromUserId: userId, toUserId: currentUserId },
                ],
            },
        });

        if (!connection) {
            return { status: 'none' };
        }

        if (connection.status === 'accepted') {
            return { status: 'friends', connectionId: connection.id };
        }

        if (connection.fromUserId === currentUserId) {
            return { status: 'pending_sent', connectionId: connection.id };
        }

        return { status: 'pending_received', connectionId: connection.id };
    });
}
