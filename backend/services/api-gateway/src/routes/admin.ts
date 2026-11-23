/**
 * Admin Routes & Embedded Operations Console
 * Permanent production endpoints for user tracking, moderation, and platform metrics
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { config } from '../config/index.js';

export async function adminRoutes(fastify: FastifyInstance) {
    /**
     * Admin Authorization Guard
     * Verifies either 'x-admin-key' header OR authenticated admin JWT
     */
    const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
        const adminKeyHeader = request.headers['x-admin-key'];
        
        // 1. Direct Secret API Key auth (for CLI, Retool, curl, or Web Console)
        if (adminKeyHeader && adminKeyHeader === config.admin.apiKey) {
            return;
        }

        // 2. JWT bearer token auth
        try {
            await request.jwtVerify();
            const tokenUser = (request as any).user;
            if (tokenUser?.userId) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: tokenUser.userId },
                    select: { email: true, trustLevel: true },
                });

                if (dbUser) {
                    const isEmailAdmin = config.admin.adminEmails.includes(dbUser.email.toLowerCase());
                    const isRoleAdmin = dbUser.trustLevel === 'admin';
                    if (isEmailAdmin || isRoleAdmin) {
                        return;
                    }
                }
            }
        } catch {
            // Not a valid JWT or no token provided
        }

        return reply.status(403).send({
            error: 'Forbidden',
            message: 'Admin access required. Provide a valid x-admin-key or admin credentials.',
        });
    };

    /**
     * GET /api/v1/admin/metrics
     * Live platform health, capacity, and activity stats
     */
    fastify.get('/metrics', { preHandler: requireAdmin }, async (_request: FastifyRequest, reply: FastifyReply) => {
        const now = new Date();
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const last30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        let redisStatus = 'offline';
        try {
            await redis.ping();
            redisStatus = 'connected';
        } catch {
            redisStatus = 'mock/error';
        }

        const [
            totalUsers,
            activeUsers24h,
            activeUsers7d,
            newUsers7d,
            bannedUsers,
            verifiedUsers,
            totalTrips,
            upcomingTrips,
            totalMessages,
            totalGroups,
            pendingReports,
        ] = await Promise.all([
            prisma.user.count({ where: { deletedAt: null } }),
            prisma.user.count({ where: { lastActiveAt: { gte: last24h } } }),
            prisma.user.count({ where: { lastActiveAt: { gte: last7d } } }),
            prisma.user.count({ where: { createdAt: { gte: last7d } } }),
            prisma.user.count({ where: { bannedUntil: { gt: now } } }),
            prisma.user.count({ where: { isVerified: true } }),
            prisma.trip.count(),
            prisma.trip.count({ where: { startDate: { gte: now } } }),
            prisma.message.count(),
            prisma.group.count({ where: { deletedAt: null } }),
            prisma.feedback.count({ where: { vibeRating: 'REPORT' } }),
        ]);

        reply.send({
            success: true,
            timestamp: now.toISOString(),
            services: {
                database: 'connected',
                redis: redisStatus,
            },
            users: {
                total: totalUsers,
                active24h: activeUsers24h,
                active7d: activeUsers7d,
                new7d: newUsers7d,
                banned: bannedUsers,
                verified: verifiedUsers,
            },
            content: {
                tripsTotal: totalTrips,
                tripsUpcoming: upcomingTrips,
                messagesTotal: totalMessages,
                groupsTotal: totalGroups,
            },
            moderation: {
                pendingReports,
            },
        });
    });

    /**
     * GET /api/v1/admin/users
     * Searchable and filterable user directory
     */
    fastify.get('/users', { preHandler: requireAdmin }, async (request: FastifyRequest, reply: FastifyReply) => {
        const query = (request.query as {
            page?: string;
            limit?: string;
            search?: string;
            filter?: string;
        }) || {};

        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;
        const now = new Date();

        const where: any = { deletedAt: null };

        if (query.search) {
            where.OR = [
                { email: { contains: query.search, mode: 'insensitive' } },
                { displayName: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        if (query.filter === 'banned') {
            where.bannedUntil = { gt: now };
        } else if (query.filter === 'verified') {
            where.isVerified = true;
        } else if (query.filter === 'active') {
            where.isActive = true;
            where.OR = [{ bannedUntil: null }, { bannedUntil: { lte: now } }];
        }

        const [total, users] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    displayName: true,
                    avatarUrl: true,
                    travelStyle: true,
                    trustLevel: true,
                    rating: true,
                    tripCount: true,
                    isVerified: true,
                    isActive: true,
                    bannedUntil: true,
                    createdAt: true,
                    lastActiveAt: true,
                },
            }),
        ]);

        reply.send({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            users,
        });
    });

    /**
     * POST /api/v1/admin/users/:id/ban
     * Ban a user, revoke all active sessions, and boot them off
     */
    fastify.post('/users/:id/ban', { preHandler: requireAdmin }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const body = (request.body as { days?: number; reason?: string }) || {};
        const days = body.days && body.days > 0 ? body.days : 30;
        const bannedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        // Update user status
        const user = await prisma.user.update({
            where: { id },
            data: {
                bannedUntil,
                isActive: false,
            },
        });

        // Revoke all sessions immediately
        await prisma.userSession.deleteMany({
            where: { userId: id },
        });

        // Invalidate Redis caches
        try {
            await redis.del(`user:${id}`);
            await redis.del(`token:blacklist:${id}`);
        } catch {
            // Ignore Redis errors
        }

        fastify.log.warn({ userId: id, bannedUntil, reason: body.reason }, 'User banned by admin');

        reply.send({
            success: true,
            message: `User ${user.displayName || user.email} banned until ${bannedUntil.toISOString()}`,
            bannedUntil,
        });
    });

    /**
     * POST /api/v1/admin/users/:id/unban
     * Unban user and restore active status
     */
    fastify.post('/users/:id/unban', { preHandler: requireAdmin }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };

        const user = await prisma.user.update({
            where: { id },
            data: {
                bannedUntil: null,
                isActive: true,
            },
        });

        reply.send({
            success: true,
            message: `User ${user.displayName || user.email} unbanned successfully`,
        });
    });

    /**
     * POST /api/v1/admin/users/:id/verify
     * Toggle verified badge and ambassador trust level
     */
    fastify.post('/users/:id/verify', { preHandler: requireAdmin }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const body = (request.body as { verified?: boolean; trustLevel?: string }) || {};
        const isVerified = body.verified !== undefined ? body.verified : true;

        const user = await prisma.user.update({
            where: { id },
            data: {
                isVerified,
                trustLevel: body.trustLevel || (isVerified ? 'verified' : 'standard'),
            },
        });

        reply.send({
            success: true,
            message: `User verification updated to ${isVerified}`,
            user: {
                id: user.id,
                isVerified: user.isVerified,
                trustLevel: user.trustLevel,
            },
        });
    });

    /**
     * GET /api/v1/admin/reports
     * Retrieve all UGC reports from PostgreSQL and Redis
     */
    fastify.get('/reports', { preHandler: requireAdmin }, async (_request: FastifyRequest, reply: FastifyReply) => {
        const rawReports = await prisma.feedback.findMany({
            where: { vibeRating: 'REPORT' },
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: {
                fromUser: {
                    select: { id: true, email: true, displayName: true, avatarUrl: true },
                },
                toUser: {
                    select: { id: true, email: true, displayName: true, avatarUrl: true, bannedUntil: true, isVerified: true },
                },
            },
        });

        const reports = rawReports.map((r) => {
            let parsedNote: any = {};
            try {
                parsedNote = JSON.parse(r.anonymousNote || '{}');
            } catch {
                parsedNote = { reason: r.anonymousNote || 'Unspecified' };
            }

            return {
                id: r.id,
                reportId: parsedNote.reportId || r.id,
                createdAt: r.createdAt,
                reason: parsedNote.reason || 'General violation',
                details: parsedNote.details || '',
                status: parsedNote.status || 'pending',
                reporter: r.fromUser,
                targetUser: r.toUser,
            };
        });

        reply.send({
            success: true,
            total: reports.length,
            reports,
        });
    });

    /**
     * POST /api/v1/admin/reports/:id/resolve
     * Resolve report and optionally ban target user
     */
    fastify.post('/reports/:id/resolve', { preHandler: requireAdmin }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const body = (request.body as { action?: 'dismiss' | 'ban'; banDays?: number }) || {};

        const report = await prisma.feedback.findUnique({
            where: { id },
            include: { toUser: true },
        });

        if (!report) {
            return reply.status(404).send({ error: 'Report not found' });
        }

        if (body.action === 'ban' && report.toUserId) {
            const days = body.banDays || 30;
            const bannedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            await prisma.user.update({
                where: { id: report.toUserId },
                data: { bannedUntil, isActive: false },
            });
            await prisma.userSession.deleteMany({ where: { userId: report.toUserId } });
        }

        // Update report status in note
        let noteData: any = {};
        try {
            noteData = JSON.parse(report.anonymousNote || '{}');
        } catch {
            noteData = {};
        }
        noteData.status = body.action === 'ban' ? 'banned' : 'dismissed';
        noteData.resolvedAt = new Date().toISOString();

        await prisma.feedback.update({
            where: { id },
            data: { anonymousNote: JSON.stringify(noteData) },
        });

        reply.send({
            success: true,
            message: `Report marked as ${noteData.status}`,
        });
    });
}
