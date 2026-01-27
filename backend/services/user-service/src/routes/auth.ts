/**
 * Auth Routes - User Service
 * Email/password authentication
 */

import bcrypt from 'bcryptjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(2).max(50).optional(),
    phone: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const refreshSchema = z.object({
    refreshToken: z.string().uuid(),
});

// Types
interface AuthenticatedRequest extends FastifyRequest {
    user: { userId: string; email: string };
}

export default async function authRoutes(fastify: FastifyInstance) {
    const { prisma, redis } = fastify;

    /**
     * POST /register
     */
    fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
        const body = registerSchema.parse(request.body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingUser) {
            return reply.status(409).send({ error: 'User already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(body.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: body.email,
                passwordHash,
                displayName: body.displayName || body.email.split('@')[0],
                phone: body.phone,
                authProvider: 'email',
                trustLevel: 'new',
            },
        });

        // Generate tokens
        const accessToken = fastify.jwt.sign(
            { userId: user.id, email: user.email },
            { expiresIn: '15m' }
        );

        const refreshToken = uuid();
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await prisma.userSession.create({
            data: {
                userId: user.id,
                refreshTokenHash,
                deviceInfo: {},
                ipAddress: request.ip,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // Publish user.created event
        await redis.publish('nomadly:events', JSON.stringify({
            specversion: '1.0',
            type: 'nomadly.user.created',
            source: '/services/user',
            id: uuid(),
            time: new Date().toISOString(),
            data: {
                userId: user.id,
                email: user.email,
                displayName: user.displayName,
                authProvider: 'email',
            },
        }));

        reply.status(201).send({
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
            },
            accessToken,
            refreshToken,
            expiresIn: 900,
        });
    });

    /**
     * POST /login
     */
    fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const body = loginSchema.parse(request.body);

        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (!user || !user.passwordHash) {
            return reply.status(401).send({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(body.password, user.passwordHash);
        if (!validPassword) {
            return reply.status(401).send({ error: 'Invalid credentials' });
        }

        if (user.bannedUntil && user.bannedUntil > new Date()) {
            return reply.status(403).send({ error: 'Account suspended' });
        }

        const accessToken = fastify.jwt.sign(
            { userId: user.id, email: user.email },
            { expiresIn: '15m' }
        );

        const refreshToken = uuid();
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await prisma.userSession.create({
            data: {
                userId: user.id,
                refreshTokenHash,
                deviceInfo: {},
                ipAddress: request.ip,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() },
        });

        reply.send({
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
                trustLevel: user.trustLevel,
            },
            accessToken,
            refreshToken,
            expiresIn: 900,
        });
    });

    /**
     * POST /refresh
     */
    fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
        const body = refreshSchema.parse(request.body);

        const sessions = await prisma.userSession.findMany({
            where: {
                expiresAt: { gt: new Date() },
                revokedAt: null,
            },
            include: { user: true },
        });

        let validSession = null;
        for (const session of sessions) {
            if (await bcrypt.compare(body.refreshToken, session.refreshTokenHash)) {
                validSession = session;
                break;
            }
        }

        if (!validSession) {
            return reply.status(401).send({ error: 'Invalid refresh token' });
        }

        const accessToken = fastify.jwt.sign(
            { userId: validSession.user.id, email: validSession.user.email },
            { expiresIn: '15m' }
        );

        reply.send({ accessToken, expiresIn: 900 });
    });

    /**
     * POST /logout
     */
    fastify.post(
        '/logout',
        { preHandler: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const userId = (request as AuthenticatedRequest).user.userId;
            const { refreshToken } = request.body as { refreshToken?: string };

            if (refreshToken) {
                const sessions = await prisma.userSession.findMany({
                    where: { userId, revokedAt: null },
                });

                for (const session of sessions) {
                    if (await bcrypt.compare(refreshToken, session.refreshTokenHash)) {
                        await prisma.userSession.update({
                            where: { id: session.id },
                            data: { revokedAt: new Date() },
                        });
                        break;
                    }
                }
            } else {
                await prisma.userSession.updateMany({
                    where: { userId, revokedAt: null },
                    data: { revokedAt: new Date() },
                });
            }

            reply.send({ success: true });
        }
    );

    /**
     * GET /me
     */
    fastify.get(
        '/me',
        { preHandler: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const userId = (request as AuthenticatedRequest).user.userId;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    displayName: true,
                    avatarUrl: true,
                    bio: true,
                    travelStyle: true,
                    languages: true,
                    trustLevel: true,
                    rating: true,
                    tripCount: true,
                    countriesVisited: true,
                    emailVerified: true,
                    isVerified: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            reply.send({ user: { ...user, rating: Number(user.rating) } });
        }
    );

    /**
     * POST /validate-token (gRPC-compatible endpoint)
     * Used by other services to validate tokens
     */
    fastify.post('/validate-token', async (request: FastifyRequest, reply: FastifyReply) => {
        const { token } = request.body as { token: string };

        if (!token) {
            return reply.status(400).send({ valid: false, error: 'Token required' });
        }

        try {
            const decoded = fastify.jwt.verify<{ userId: string; email: string; exp: number }>(token);
            return reply.send({
                valid: true,
                userId: decoded.userId,
                email: decoded.email,
                expiresAt: decoded.exp,
            });
        } catch (error) {
            return reply.send({ valid: false });
        }
    });
}
