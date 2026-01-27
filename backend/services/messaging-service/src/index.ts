/**
 * Nomadly Messaging Service
 * Real-time chat, presence, WebSocket
 */

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import Redis from 'ioredis';
import { WebSocket } from 'ws';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const redisSub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Connection map for WebSocket
const connections = new Map<string, Set<WebSocket>>();

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
app.get('/health', async () => ({ status: 'ok', service: 'messaging-service' }));

// ============= CONVERSATIONS =============

app.post('/api/v1/conversations', { preHandler: [app.authenticate] }, async (request) => {
    const creatorId = (request as any).user.userId;
    const { memberIds, type } = request.body as any;

    const conversation = await prisma.conversation.create({
        data: { type: type || 'direct' },
    });

    const allMembers = [...new Set([creatorId, ...memberIds])];
    await prisma.conversationMember.createMany({
        data: allMembers.map((userId) => ({ conversationId: conversation.id, userId })),
    });

    return conversation;
});

app.get('/api/v1/conversations', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;

    const memberships = await prisma.conversationMember.findMany({
        where: { userId },
        include: {
            conversation: {
                include: {
                    messages: { orderBy: { createdAt: 'desc' }, take: 1 },
                    members: { include: { user: { select: { id: true, displayName: true, avatarUrl: true } } } },
                },
            },
        },
        orderBy: { conversation: { updatedAt: 'desc' } },
    });

    return memberships.map((m: any) => m.conversation);
});

app.get('/api/v1/conversations/:id', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    return prisma.conversation.findUnique({
        where: { id },
        include: { members: { include: { user: { select: { id: true, displayName: true, avatarUrl: true } } } } },
    });
});

// ============= MESSAGES =============

app.get('/api/v1/conversations/:id/messages', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    const { limit = 50, before } = request.query as any;

    const where: any = { conversationId: id };
    if (before) where.createdAt = { lt: new Date(before) };

    return prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        include: { sender: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
});

app.post('/api/v1/conversations/:id/messages', { preHandler: [app.authenticate] }, async (request) => {
    const senderId = (request as any).user.userId;
    const { id: conversationId } = request.params as { id: string };
    const { content, messageType, mediaUrls } = request.body as any;

    const message = await prisma.message.create({
        data: { conversationId, senderId, content, messageType: messageType || 'text', mediaUrls: mediaUrls || [] },
        include: { sender: { select: { id: true, displayName: true, avatarUrl: true } } },
    });

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });

    // Publish to Redis for real-time delivery
    await redis.publish('nomadly:chat', JSON.stringify({ conversationId, message }));

    return message;
});

// ============= PRESENCE =============

app.post('/api/v1/presence', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { status } = request.body as any;

    await redis.setex(`presence:${userId}`, 300, JSON.stringify({ status, lastSeen: new Date() }));
    await redis.publish('nomadly:presence', JSON.stringify({ userId, status }));

    return { success: true };
});

app.get('/api/v1/presence', async (request) => {
    const { userIds } = request.query as { userIds: string };
    const ids = userIds.split(',');

    const presence: Record<string, any> = {};
    for (const id of ids) {
        const data = await redis.get(`presence:${id}`);
        presence[id] = data ? JSON.parse(data) : { status: 'offline' };
    }

    return presence;
});

// ============= WEBSOCKET =============

app.register(async (fastify) => {
    fastify.get('/ws', { websocket: true }, (socket, request) => {
        const ws = socket as unknown as WebSocket;
        let userId: string | null = null;

        ws.on('message', async (data) => {
            try {
                const msg = JSON.parse(data.toString());

                if (msg.type === 'auth') {
                    const decoded = fastify.jwt.verify<{ userId: string }>(msg.token);
                    userId = decoded.userId;

                    if (!connections.has(userId)) connections.set(userId, new Set());
                    connections.get(userId)!.add(ws);

                    ws.send(JSON.stringify({ type: 'auth_success' }));
                }

                if (msg.type === 'typing' && userId) {
                    await redis.publish('nomadly:chat', JSON.stringify({
                        type: 'typing',
                        conversationId: msg.conversationId,
                        userId,
                    }));
                }
            } catch (err) {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }));
            }
        });

        ws.on('close', () => {
            if (userId && connections.has(userId)) {
                connections.get(userId)!.delete(ws);
                if (connections.get(userId)!.size === 0) connections.delete(userId);
            }
        });
    });
});

// Subscribe to Redis for cross-instance delivery
redisSub.subscribe('nomadly:chat', 'nomadly:presence');
redisSub.on('message', (channel, message) => {
    const data = JSON.parse(message);

    if (channel === 'nomadly:chat' && data.conversationId) {
        // Broadcast to conversation members (simplified)
        connections.forEach((sockets, userId) => {
            sockets.forEach((ws) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'message', ...data }));
                }
            });
        });
    }
});

async function start() {
    await app.register(helmet);
    await app.register(cors, { origin: true, credentials: true });
    await app.register(jwt, { secret: process.env.JWT_SECRET || 'secret' });
    await app.register(websocket);

    const port = parseInt(process.env.PORT || '3006');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`💬 Messaging Service running on port ${port}`);
}

process.on('SIGTERM', async () => {
    await redisSub.unsubscribe();
    await app.close();
    process.exit(0);
});

start();
