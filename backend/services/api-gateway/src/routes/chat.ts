/**
 * Chat Routes
 * Real-time messaging and conversations
 */

import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export async function chatRoutes(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
): Promise<void> {

    // All routes require authentication
    fastify.addHook('preHandler', authenticate);

    /**
     * GET /conversations
     * List user's conversations
     */
    fastify.get('/conversations', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { limit = 20, offset = 0 } = request.query as { limit?: number; offset?: number };

        const memberships = await prisma.conversationMember.findMany({
            where: { userId },
            include: {
                conversation: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                            include: {
                                sender: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                conversation: {
                    updatedAt: 'desc',
                },
            },
            take: Number(limit),
            skip: Number(offset),
        });

        const conversations = memberships.map((m) => ({
            id: m.conversation.id,
            type: m.conversation.type,
            groupId: m.conversation.groupId,
            otherUsers: m.conversation.members
                .filter((member) => member.userId !== userId)
                .map((member) => member.user),
            lastMessage: m.conversation.messages[0] || null,
            lastReadAt: m.lastReadAt,
            muted: m.muted,
            updatedAt: m.conversation.updatedAt,
        }));

        reply.send({ data: conversations });
    });

    /**
     * POST /conversations
     * Create or get direct message conversation
     */
    fastify.post('/conversations', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { recipientId } = request.body as { recipientId: string };

        if (!recipientId) {
            return reply.status(400).send({ error: 'recipientId is required' });
        }

        // Check if conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                type: 'direct',
                AND: [
                    { members: { some: { userId } } },
                    { members: { some: { userId: recipientId } } },
                ],
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        if (existingConversation) {
            return reply.send({
                conversation: {
                    id: existingConversation.id,
                    type: existingConversation.type,
                    otherUsers: existingConversation.members
                        .filter((m) => m.userId !== userId)
                        .map((m) => m.user),
                },
            });
        }

        // Create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                type: 'direct',
                members: {
                    create: [
                        { userId },
                        { userId: recipientId },
                    ],
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        reply.status(201).send({
            conversation: {
                id: conversation.id,
                type: conversation.type,
                otherUsers: conversation.members
                    .filter((m) => m.userId !== userId)
                    .map((m) => m.user),
            },
        });
    });

    /**
     * GET /conversations/:id/messages
     * Get messages in a conversation
     */
    fastify.get('/conversations/:id/messages', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };
        const { limit = 50, before } = request.query as { limit?: number; before?: string };

        // Verify membership
        const membership = await prisma.conversationMember.findUnique({
            where: {
                conversationId_userId: {
                    conversationId: id,
                    userId,
                },
            },
        });

        if (!membership) {
            return reply.status(403).send({ error: 'Not a member of this conversation' });
        }

        const whereClause: any = { conversationId: id };
        if (before) {
            whereClause.createdAt = { lt: new Date(before) };
        }

        const messages = await prisma.message.findMany({
            where: whereClause,
            include: {
                sender: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: Number(limit),
        });

        reply.send({ data: messages.reverse() });
    });

    /**
     * POST /conversations/:id/messages
     * Send a message
     */
    fastify.post('/conversations/:id/messages', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };
        const { content, messageType = 'text', metadata = {} } = request.body as {
            content: string;
            messageType?: string;
            metadata?: Record<string, unknown>;
        };

        // Verify membership
        const membership = await prisma.conversationMember.findUnique({
            where: {
                conversationId_userId: {
                    conversationId: id,
                    userId,
                },
            },
        });

        if (!membership) {
            return reply.status(403).send({ error: 'Not a member of this conversation' });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId: id,
                senderId: userId,
                content,
                messageType,
                metadata: JSON.parse(JSON.stringify(metadata)),
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id },
            data: { updatedAt: new Date() },
        });

        reply.status(201).send({ message });
    });

    /**
     * POST /conversations/:id/read
     * Mark conversation as read
     */
    fastify.post('/conversations/:id/read', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };

        await prisma.conversationMember.update({
            where: {
                conversationId_userId: {
                    conversationId: id,
                    userId,
                },
            },
            data: { lastReadAt: new Date() },
        });

        reply.send({ success: true });
    });
}
