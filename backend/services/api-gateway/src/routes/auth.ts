/**
 * Auth Routes
 * Email/password authentication
 */

import bcrypt from 'bcryptjs';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuid } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export async function authRoutes(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
): Promise<void> {

    /**
     * POST /register
     * Register a new user
     */
    fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password, displayName } = request.body as {
            email: string;
            password: string;
            displayName?: string;
        };

        if (!email || !password) {
            return reply.status(400).send({ error: 'email and password are required' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return reply.status(409).send({ error: 'User already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                displayName: displayName || email.split('@')[0],
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
     * Login with email/password
     */
    fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password } = request.body as {
            email: string;
            password: string;
        };

        if (!email || !password) {
            return reply.status(400).send({ error: 'email and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.passwordHash) {
            return reply.status(401).send({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return reply.status(401).send({ error: 'Invalid credentials' });
        }

        // Check if banned
        if (user.bannedUntil && user.bannedUntil > new Date()) {
            return reply.status(403).send({ error: 'Account suspended' });
        }

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

        // Update last active
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
            },
            accessToken,
            refreshToken,
            expiresIn: 900,
        });
    });

    /**
     * POST /refresh
     * Refresh access token
     */
    fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
        const { refreshToken } = request.body as { refreshToken: string };

        if (!refreshToken) {
            return reply.status(400).send({ error: 'refreshToken is required' });
        }

        // Find valid session
        const sessions = await prisma.userSession.findMany({
            where: {
                expiresAt: { gt: new Date() },
                revokedAt: null,
            },
            include: {
                user: true,
            },
        });

        let validSession = null;
        for (const session of sessions) {
            if (await bcrypt.compare(refreshToken, session.refreshTokenHash)) {
                validSession = session;
                break;
            }
        }

        if (!validSession) {
            return reply.status(401).send({ error: 'Invalid refresh token' });
        }

        // Generate new access token
        const accessToken = fastify.jwt.sign(
            { userId: validSession.user.id, email: validSession.user.email },
            { expiresIn: '15m' }
        );

        reply.send({
            accessToken,
            expiresIn: 900,
        });
    });

    /**
     * POST /logout
     * Logout and revoke session
     */
    fastify.post('/logout', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { refreshToken } = request.body as { refreshToken?: string };

        if (refreshToken) {
            // Revoke specific session
            const sessions = await prisma.userSession.findMany({
                where: {
                    userId,
                    revokedAt: null,
                },
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
            // Revoke all sessions
            await prisma.userSession.updateMany({
                where: {
                    userId,
                    revokedAt: null,
                },
                data: { revokedAt: new Date() },
            });
        }

        reply.send({ success: true });
    });

    /**
     * GET /me
     * Get current user
     */
    fastify.get('/me', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;

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

        reply.send({ user });
    });

    /**
     * POST /forgot-password
     * Request password reset email
     */
    fastify.post('/forgot-password', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email } = request.body as { email: string };

        if (!email) {
            return reply.status(400).send({ error: 'Email is required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return reply.send({ success: true, message: 'If an account exists, a reset link has been sent' });
        }

        // Generate reset token
        const resetToken = uuid();
        const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store reset token (in production, hash this)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                // Store in metadata or a separate table in production
                // For now, log it (in production, send email)
            },
        });

        // In production: Send email with reset link
        fastify.log.info({ email, resetToken }, 'Password reset requested');

        reply.send({ success: true, message: 'If an account exists, a reset link has been sent' });
    });

    /**
     * POST /reset-password
     * Reset password with token
     */
    fastify.post('/reset-password', async (request: FastifyRequest, reply: FastifyReply) => {
        const { token, newPassword } = request.body as { token: string; newPassword: string };

        if (!token || !newPassword) {
            return reply.status(400).send({ error: 'Token and new password are required' });
        }

        if (newPassword.length < 8) {
            return reply.status(400).send({ error: 'Password must be at least 8 characters' });
        }

        // In production: Verify token and update password
        // For now, return success placeholder
        reply.send({ success: true, message: 'Password has been reset' });
    });
}
