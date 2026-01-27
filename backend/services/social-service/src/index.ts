/**
 * Nomadly Social Service
 * Groups, connections, posts, comments
 */

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

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
app.get('/health', async () => ({ status: 'ok', service: 'social-service' }));

// ============= GROUPS =============

app.post('/api/v1/groups', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const body = request.body as any;

    const group = await prisma.group.create({
        data: { createdBy: userId, ...body },
    });

    await prisma.groupMember.create({
        data: { groupId: group.id, userId, role: 'admin' },
    });

    await redis.publish('nomadly:events', JSON.stringify({
        type: 'nomadly.group.created', data: { groupId: group.id, createdBy: userId },
    }));

    return group;
});

app.get('/api/v1/groups/:id', async (request) => {
    const { id } = request.params as { id: string };
    return prisma.group.findUnique({
        where: { id, deletedAt: null },
        include: { members: { include: { user: { select: { id: true, displayName: true, avatarUrl: true } } }, take: 10 } },
    });
});

app.get('/api/v1/groups', async (request) => {
    const { type, destination, limit = 20, offset = 0 } = request.query as any;
    const where: any = { deletedAt: null };
    if (type) where.type = type;
    if (destination) where.destination = { contains: destination, mode: 'insensitive' };

    return prisma.group.findMany({ where, orderBy: { memberCount: 'desc' }, take: parseInt(limit), skip: parseInt(offset) });
});

app.post('/api/v1/groups/:id/join', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };

    const member = await prisma.groupMember.create({ data: { groupId: id, userId, role: 'member' } });
    await prisma.group.update({ where: { id }, data: { memberCount: { increment: 1 } } });

    return member;
});

app.post('/api/v1/groups/:id/leave', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };

    await prisma.groupMember.deleteMany({ where: { groupId: id, userId } });
    await prisma.group.update({ where: { id }, data: { memberCount: { decrement: 1 } } });

    return { success: true };
});

// ============= CONNECTIONS =============

app.post('/api/v1/connections', { preHandler: [app.authenticate] }, async (request) => {
    const fromUserId = (request as any).user.userId;
    const { toUserId, icebreaker } = request.body as any;

    return prisma.connection.create({
        data: { fromUserId, toUserId, icebreaker, status: 'pending' },
    });
});

app.post('/api/v1/connections/:id/accept', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };

    return prisma.connection.update({
        where: { id, toUserId: userId },
        data: { status: 'accepted' },
    });
});

app.get('/api/v1/connections', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { status } = request.query as any;

    return prisma.connection.findMany({
        where: { OR: [{ fromUserId: userId }, { toUserId: userId }], status: status || 'accepted' },
        include: {
            fromUser: { select: { id: true, displayName: true, avatarUrl: true } },
            toUser: { select: { id: true, displayName: true, avatarUrl: true } },
        },
    });
});

// ============= POSTS =============

app.post('/api/v1/groups/:groupId/posts', { preHandler: [app.authenticate] }, async (request) => {
    const authorId = (request as any).user.userId;
    const { groupId } = request.params as { groupId: string };
    const { type, content, mediaUrls } = request.body as any;

    return prisma.post.create({
        data: { groupId, authorId, type: type || 'text', content, mediaUrls: mediaUrls || [] },
    });
});

app.get('/api/v1/groups/:groupId/posts', async (request) => {
    const { groupId } = request.params as { groupId: string };
    const { limit = 20, offset = 0 } = request.query as any;

    return prisma.post.findMany({
        where: { groupId, deletedAt: null },
        include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
    });
});

app.post('/api/v1/posts/:id/react', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };
    const { emoji } = request.body as any;

    await prisma.reaction.upsert({
        where: { postId_userId: { postId: id, userId } },
        create: { postId: id, userId, emoji },
        update: { emoji },
    });

    return { success: true };
});

async function start() {
    await app.register(helmet);
    await app.register(cors, { origin: true, credentials: true });
    await app.register(jwt, { secret: process.env.JWT_SECRET || 'secret' });

    const port = parseInt(process.env.PORT || '3005');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`👥 Social Service running on port ${port}`);
}

process.on('SIGTERM', async () => { await app.close(); process.exit(0); });
start();
