/**
 * Nomadly Travel Service
 * Trips, matching, itineraries, feedback
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
app.get('/health', async () => ({ status: 'ok', service: 'travel-service' }));

// Create trip
app.post('/api/v1/trips', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { city, country, countryCode, latitude, longitude, startDate, endDate, openTo, notes } = request.body as any;

    const trip = await prisma.trip.create({
        data: {
            userId, city, country, countryCode, latitude, longitude,
            startDate: new Date(startDate), endDate: new Date(endDate),
            openTo: openTo || [], notes,
        },
    });

    await redis.publish('nomadly:events', JSON.stringify({
        type: 'nomadly.trip.created',
        source: '/services/travel',
        data: { tripId: trip.id, userId, city, country, startDate, endDate },
    }));

    return trip;
});

// Get trip
app.get('/api/v1/trips/:id', async (request) => {
    const { id } = request.params as { id: string };
    return prisma.trip.findUnique({
        where: { id },
        include: { user: { select: { id: true, displayName: true, avatarUrl: true, trustLevel: true } } },
    });
});

// Update trip
app.patch('/api/v1/trips/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };
    const updates = request.body as any;

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return reply.status(404).send({ error: 'Not found' });
    if (trip.userId !== userId) return reply.status(403).send({ error: 'Not authorized' });

    return prisma.trip.update({ where: { id }, data: updates });
});

// Delete trip
app.delete('/api/v1/trips/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip || trip.userId !== userId) return reply.status(403).send({ error: 'Not authorized' });

    await prisma.trip.delete({ where: { id } });
    return { success: true };
});

// List user trips
app.get('/api/v1/trips', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { status, upcoming } = request.query as any;

    const where: any = { userId };
    if (status) where.status = status;
    if (upcoming === 'true') where.startDate = { gte: new Date() };

    return prisma.trip.findMany({ where, orderBy: { startDate: 'asc' } });
});

// Find overlapping travelers
app.get('/api/v1/trips/:id/matches', { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.userId;
    const { id } = request.params as { id: string };

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return { matches: [] };

    const overlapping = await prisma.trip.findMany({
        where: {
            userId: { not: userId },
            city: trip.city,
            visibility: 'public',
            startDate: { lte: trip.endDate },
            endDate: { gte: trip.startDate },
        },
        include: { user: { select: { id: true, displayName: true, avatarUrl: true, trustLevel: true, rating: true } } },
        take: 20,
    });

    return {
        matches: overlapping.map((t) => {
            const overlapStart = Math.max(trip.startDate.getTime(), t.startDate.getTime());
            const overlapEnd = Math.min(trip.endDate.getTime(), t.endDate.getTime());
            const overlapDays = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24));
            return { ...t, overlapDays, rating: Number(t.user.rating) };
        }),
    };
});

// Submit feedback
app.post('/api/v1/trips/:id/feedback', { preHandler: [app.authenticate] }, async (request) => {
    const fromUserId = (request as any).user.userId;
    const { id: tripId } = request.params as { id: string };
    const { toUserId, wouldTravelAgain, vibeRating, anonymousNote } = request.body as any;

    return prisma.feedback.create({
        data: { fromUserId, toUserId, tripId, wouldTravelAgain, vibeRating, anonymousNote },
    });
});

async function start() {
    await app.register(helmet);
    await app.register(cors, { origin: true, credentials: true });
    await app.register(jwt, { secret: process.env.JWT_SECRET || 'secret' });

    const port = parseInt(process.env.PORT || '3004');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`✈️ Travel Service running on port ${port}`);
}

process.on('SIGTERM', async () => { await app.close(); process.exit(0); });
start();
