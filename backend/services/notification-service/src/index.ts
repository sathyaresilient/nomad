/**
 * Nomadly Notification Service
 * Push notifications, email, in-app notifications
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

// Health routes
app.get('/health', async () => ({ status: 'ok', service: 'notification-service' }));
app.get('/health/ready', async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        await redis.ping();
        return { status: 'ok', service: 'notification-service' };
    } catch { return { status: 'degraded' }; }
});

// Notification routes
app.get('/api/v1/notifications', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { unreadOnly = false, limit = 20, offset = 0 } = request.query as any;

    const where: any = { userId };
    if (unreadOnly) where.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return { notifications, total, unreadCount };
});

app.post('/api/v1/notifications/mark-read', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { notificationIds } = request.body as { notificationIds: string[] };

    await prisma.notification.updateMany({
        where: { id: { in: notificationIds }, userId },
        data: { read: true },
    });

    return { success: true };
});

app.post('/api/v1/notifications/device-token', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { token, platform } = request.body as { token: string; platform: string };

    await prisma.deviceToken.upsert({
        where: { token },
        create: { userId, token, platform },
        update: { userId, platform },
    });

    return { success: true };
});

// Internal API - Create notification
app.post('/internal/notifications', async (request) => {
    const { userId, type, title, body, data } = request.body as any;

    const notification = await prisma.notification.create({
        data: { userId, type, title, body, data: data || {} },
    });

    await redis.publish('nomadly:notifications', JSON.stringify({ userId, notification }));
    return notification;
});

async function start() {
    await app.register(helmet);
    await app.register(cors, { origin: true, credentials: true });
    await app.register(jwt, { secret: process.env.JWT_SECRET || 'secret' });

    const port = parseInt(process.env.PORT || '3002');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🔔 Notification Service running on port ${port}`);
}

process.on('SIGTERM', async () => { await app.close(); process.exit(0); });
start();
