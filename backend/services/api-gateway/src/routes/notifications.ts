/**
 * Notification Routes
 * Push notifications (FCM), in-app notifications, device token management
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Notification types
type NotificationType =
    | 'message'
    | 'group_invite'
    | 'group_join_request'
    | 'trip_match'
    | 'connection_request'
    | 'connection_accepted'
    | 'post_reaction'
    | 'post_comment'
    | 'mention'
    | 'system';

// Types
interface AuthenticatedRequest extends FastifyRequest {
    user: { userId: string };
}

export default async function notificationRoutes(fastify: FastifyInstance) {
    const { prisma } = fastify;

    // ===================================================
    // List Notifications
    // ===================================================
    fastify.get(
        '/',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'List user notifications',
                tags: ['Notifications'],
                querystring: {
                    type: 'object',
                    properties: {
                        unreadOnly: { type: 'boolean', default: false },
                        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                        offset: { type: 'integer', minimum: 0, default: 0 },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const query = request.query as { unreadOnly?: boolean; limit?: number; offset?: number };
            const limit = query.limit || 20;
            const offset = query.offset || 0;

            const where: any = {
                userId: user.userId,
                ...(query.unreadOnly && { read: false }),
            };

            const [notifications, total, unreadCount] = await Promise.all([
                prisma.notification.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip: offset,
                }),
                prisma.notification.count({ where }),
                prisma.notification.count({
                    where: { userId: user.userId, read: false },
                }),
            ]);

            return reply.send({
                notifications,
                total,
                unreadCount,
                limit,
                offset,
            });
        }
    );

    // ===================================================
    // Mark Notifications as Read
    // ===================================================
    fastify.post(
        '/mark-read',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Mark notifications as read',
                tags: ['Notifications'],
                body: {
                    type: 'object',
                    required: ['notificationIds'],
                    properties: {
                        notificationIds: {
                            type: 'array',
                            items: { type: 'string', format: 'uuid' },
                            minItems: 1,
                            maxItems: 100,
                        },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const body = request.body as { notificationIds: string[] };

            const result = await prisma.notification.updateMany({
                where: {
                    id: { in: body.notificationIds },
                    userId: user.userId,
                },
                data: { read: true },
            });

            return reply.send({
                success: true,
                updated: result.count,
            });
        }
    );

    // ===================================================
    // Mark All as Read
    // ===================================================
    fastify.post(
        '/mark-all-read',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Mark all notifications as read',
                tags: ['Notifications'],
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;

            const result = await prisma.notification.updateMany({
                where: {
                    userId: user.userId,
                    read: false,
                },
                data: { read: true },
            });

            return reply.send({
                success: true,
                updated: result.count,
            });
        }
    );

    // ===================================================
    // Delete Notification
    // ===================================================
    fastify.delete(
        '/:id',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Delete a notification',
                tags: ['Notifications'],
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const { id } = request.params as { id: string };

            const notification = await prisma.notification.findFirst({
                where: { id, userId: user.userId },
            });

            if (!notification) {
                return reply.status(404).send({ error: 'Notification not found' });
            }

            await prisma.notification.delete({ where: { id } });

            return reply.send({ success: true });
        }
    );

    // ===================================================
    // Register Device Token (FCM)
    // ===================================================
    fastify.post(
        '/device-token',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Register device token for push notifications',
                tags: ['Notifications'],
                body: {
                    type: 'object',
                    required: ['token', 'platform'],
                    properties: {
                        token: { type: 'string', minLength: 1 },
                        platform: { type: 'string', enum: ['ios', 'android', 'web'] },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const body = request.body as { token: string; platform: string };

            // Upsert device token
            await prisma.deviceToken.upsert({
                where: { token: body.token },
                create: {
                    userId: user.userId,
                    token: body.token,
                    platform: body.platform,
                },
                update: {
                    userId: user.userId,
                    platform: body.platform,
                    updatedAt: new Date(),
                },
            });

            return reply.send({ success: true });
        }
    );

    // ===================================================
    // Remove Device Token
    // ===================================================
    fastify.delete(
        '/device-token',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Remove device token',
                tags: ['Notifications'],
                body: {
                    type: 'object',
                    required: ['token'],
                    properties: {
                        token: { type: 'string', minLength: 1 },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const { token } = request.body as { token: string };

            await prisma.deviceToken.deleteMany({
                where: {
                    userId: user.userId,
                    token,
                },
            });

            return reply.send({ success: true });
        }
    );

    // ===================================================
    // Get Notification Preferences
    // ===================================================
    fastify.get(
        '/preferences',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Get notification preferences',
                tags: ['Notifications'],
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;

            let preferences = await prisma.notificationPreference.findUnique({
                where: { userId: user.userId },
            });

            // Create default preferences if not exist
            if (!preferences) {
                preferences = await prisma.notificationPreference.create({
                    data: {
                        userId: user.userId,
                        pushEnabled: true,
                        emailEnabled: true,
                        messageNotifications: true,
                        groupNotifications: true,
                        tripNotifications: true,
                        connectionNotifications: true,
                        marketingEmails: false,
                    },
                });
            }

            return reply.send(preferences);
        }
    );

    // ===================================================
    // Update Notification Preferences
    // ===================================================
    fastify.put(
        '/preferences',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Update notification preferences',
                tags: ['Notifications'],
                body: {
                    type: 'object',
                    properties: {
                        pushEnabled: { type: 'boolean' },
                        emailEnabled: { type: 'boolean' },
                        messageNotifications: { type: 'boolean' },
                        groupNotifications: { type: 'boolean' },
                        tripNotifications: { type: 'boolean' },
                        connectionNotifications: { type: 'boolean' },
                        marketingEmails: { type: 'boolean' },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user;
            const body = request.body as Record<string, boolean>;

            const preferences = await prisma.notificationPreference.upsert({
                where: { userId: user.userId },
                create: {
                    userId: user.userId,
                    ...body,
                },
                update: body,
            });

            return reply.send(preferences);
        }
    );
}

// ===================================================
// Notification Service Helper (for other routes to use)
// ===================================================
export async function createNotification(
    prisma: any,
    redis: any,
    data: {
        userId: string;
        type: NotificationType;
        title: string;
        body: string;
        data?: Record<string, unknown>;
        actorId?: string;
        targetId?: string;
        targetType?: string;
    }
) {
    // Create notification in database
    const notification = await prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            title: data.title,
            body: data.body,
            data: data.data ? JSON.parse(JSON.stringify(data.data)) : {},
            actorId: data.actorId,
            targetId: data.targetId,
            targetType: data.targetType,
        },
    });

    // Publish to Redis for real-time delivery via WebSocket
    await redis.publish(
        'nomadly:notifications',
        JSON.stringify({
            userId: data.userId,
            notification,
        })
    );

    // TODO: Send FCM push notification
    // This would call Firebase Admin SDK to send to registered device tokens

    return notification;
}
