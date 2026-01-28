/**
 * Groups Routes
 * Group management and posts
 */

import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

export async function groupsRoutes(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
): Promise<void> {

    /**
     * GET /
     * List groups with optional filters
     */
    fastify.get('/', { preHandler: optionalAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { type, destination, limit = 20, offset = 0 } = request.query as {
            type?: string;
            destination?: string;
            limit?: number;
            offset?: number;
        };

        const whereClause: any = {
            deletedAt: null,
            privacy: 'public',
        };

        if (type) whereClause.type = type;
        if (destination) {
            whereClause.OR = [
                { destination: { contains: destination, mode: 'insensitive' } },
                { country: { contains: destination, mode: 'insensitive' } },
            ];
        }

        const [groups, total] = await Promise.all([
            prisma.group.findMany({
                where: whereClause,
                orderBy: { memberCount: 'desc' },
                take: Number(limit),
                skip: Number(offset),
            }),
            prisma.group.count({ where: whereClause }),
        ]);

        reply.send({
            data: groups,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + groups.length < total,
            },
        });
    });

    /**
     * POST /
     * Create a new group
     */
    fastify.post('/', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const {
            name,
            type,
            emoji,
            description,
            destination,
            country,
            startDate,
            endDate,
            privacy = 'public',
        } = request.body as {
            name: string;
            type: string;
            emoji?: string;
            description?: string;
            destination?: string;
            country?: string;
            startDate?: string;
            endDate?: string;
            privacy?: string;
        };

        if (!name || !type) {
            return reply.status(400).send({ error: 'name and type are required' });
        }

        const group = await prisma.group.create({
            data: {
                name,
                type,
                emoji,
                description,
                destination,
                country,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                privacy,
                createdBy: userId,
                memberCount: 1,
                members: {
                    create: {
                        userId,
                        role: 'admin',
                    },
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

        reply.status(201).send({ group });
    });

    /**
     * GET /:id
     * Get group details
     */
    fastify.get('/:id', { preHandler: optionalAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const userId = (request as any).user?.userId;

        const group = await prisma.group.findUnique({
            where: { id },
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
                    take: 10,
                },
            },
        });

        if (!group || group.deletedAt) {
            return reply.status(404).send({ error: 'Group not found' });
        }

        // Check if user is member
        let isMember = false;
        let userRole = null;
        if (userId) {
            const membership = await prisma.groupMember.findUnique({
                where: {
                    groupId_userId: {
                        groupId: id,
                        userId,
                    },
                },
            });
            isMember = !!membership;
            userRole = membership?.role;
        }

        reply.send({
            group: {
                ...group,
                isMember,
                userRole,
            },
        });
    });

    /**
     * POST /:id/join
     * Join a group
     */
    fastify.post('/:id/join', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };

        const group = await prisma.group.findUnique({
            where: { id },
        });

        if (!group || group.deletedAt) {
            return reply.status(404).send({ error: 'Group not found' });
        }

        // Check if already member
        const existingMembership = await prisma.groupMember.findUnique({
            where: {
                groupId_userId: {
                    groupId: id,
                    userId,
                },
            },
        });

        if (existingMembership) {
            return reply.status(400).send({ error: 'Already a member' });
        }

        if (group.privacy === 'public') {
            // Direct join
            await prisma.$transaction([
                prisma.groupMember.create({
                    data: {
                        groupId: id,
                        userId,
                        role: 'member',
                    },
                }),
                prisma.group.update({
                    where: { id },
                    data: { memberCount: { increment: 1 } },
                }),
            ]);

            reply.send({ success: true, status: 'joined' });
        } else {
            // Create join request
            await prisma.joinRequest.create({
                data: {
                    groupId: id,
                    userId,
                    status: 'pending',
                },
            });

            reply.send({ success: true, status: 'pending' });
        }
    });

    /**
     * GET /:id/posts
     * Get posts in a group
     */
    fastify.get('/:id/posts', { preHandler: optionalAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const { limit = 20, offset = 0 } = request.query as { limit?: number; offset?: number };

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: {
                    groupId: id,
                    deletedAt: null,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                    reactions: {
                        take: 5,
                    },
                },
                orderBy: [
                    { isPinned: 'desc' },
                    { createdAt: 'desc' },
                ],
                take: Number(limit),
                skip: Number(offset),
            }),
            prisma.post.count({
                where: {
                    groupId: id,
                    deletedAt: null,
                },
            }),
        ]);

        reply.send({
            data: posts,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + posts.length < total,
            },
        });
    });

    /**
     * POST /:id/posts
     * Create a post in a group
     */
    fastify.post('/:id/posts', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };
        const { type, content, mediaUrls = [], metadata = {} } = request.body as {
            type: string;
            content?: string;
            mediaUrls?: string[];
            metadata?: Record<string, unknown>;
        };

        // Check membership
        const membership = await prisma.groupMember.findUnique({
            where: {
                groupId_userId: {
                    groupId: id,
                    userId,
                },
            },
        });

        if (!membership) {
            return reply.status(403).send({ error: 'Not a member of this group' });
        }

        const post = await prisma.post.create({
            data: {
                groupId: id,
                authorId: userId,
                type: type || 'update',
                content,
                mediaUrls,
                metadata: JSON.parse(JSON.stringify(metadata)),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        // Update group post count
        await prisma.group.update({
            where: { id },
            data: { postCount: { increment: 1 } },
        });

        reply.status(201).send({ post });
    });

    /**
     * POST /:groupId/posts/:postId/react
     * React to a post
     */
    fastify.post('/:groupId/posts/:postId/react', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { postId } = request.params as { groupId: string; postId: string };
        const { emoji } = request.body as { emoji: string };

        if (!emoji) {
            return reply.status(400).send({ error: 'emoji is required' });
        }

        // Check if already reacted
        const existingReaction = await prisma.reaction.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });

        if (existingReaction) {
            if (existingReaction.emoji === emoji) {
                // Remove reaction
                await prisma.$transaction([
                    prisma.reaction.delete({
                        where: { id: existingReaction.id },
                    }),
                    prisma.post.update({
                        where: { id: postId },
                        data: { reactionCount: { decrement: 1 } },
                    }),
                ]);
                return reply.send({ success: true, action: 'removed' });
            } else {
                // Update reaction
                await prisma.reaction.update({
                    where: { id: existingReaction.id },
                    data: { emoji },
                });
                return reply.send({ success: true, action: 'updated' });
            }
        }

        // Create reaction
        await prisma.$transaction([
            prisma.reaction.create({
                data: {
                    postId,
                    userId,
                    emoji,
                },
            }),
            prisma.post.update({
                where: { id: postId },
                data: { reactionCount: { increment: 1 } },
            }),
        ]);

        reply.send({ success: true, action: 'added' });
    });

    /**
     * GET /:groupId/posts/:postId/comments
     * Get comments for a post
     */
    fastify.get('/:groupId/posts/:postId/comments', { preHandler: optionalAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { postId } = request.params as { groupId: string; postId: string };
        const { limit = 20, offset = 0 } = request.query as { limit?: number; offset?: number };

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where: {
                    postId,
                    deletedAt: null,
                    parentId: null, // Only top-level comments
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                    replies: {
                        where: { deletedAt: null },
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    displayName: true,
                                    avatarUrl: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'asc' },
                        take: 3,
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
            }),
            prisma.comment.count({
                where: {
                    postId,
                    deletedAt: null,
                    parentId: null,
                },
            }),
        ]);

        reply.send({
            data: comments,
            pagination: {
                total,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + comments.length < total,
            },
        });
    });

    /**
     * POST /:groupId/posts/:postId/comments
     * Create a comment on a post
     */
    fastify.post('/:groupId/posts/:postId/comments', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { postId } = request.params as { groupId: string; postId: string };
        const { content, parentId } = request.body as { content: string; parentId?: string };

        if (!content || content.trim().length === 0) {
            return reply.status(400).send({ error: 'Content is required' });
        }

        // Verify post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post || post.deletedAt) {
            return reply.status(404).send({ error: 'Post not found' });
        }

        // If it's a reply, verify parent comment exists
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
            });
            if (!parentComment || parentComment.deletedAt) {
                return reply.status(404).send({ error: 'Parent comment not found' });
            }
        }

        const comment = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data: {
                    postId,
                    authorId: userId,
                    parentId,
                    content: content.trim(),
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            // Update comment count on post
            await tx.post.update({
                where: { id: postId },
                data: { commentCount: { increment: 1 } },
            });

            // Update reply count on parent comment if it's a reply
            if (parentId) {
                await tx.comment.update({
                    where: { id: parentId },
                    data: { replyCount: { increment: 1 } },
                });
            }

            return newComment;
        });

        reply.status(201).send({ comment });
    });

    /**
     * DELETE /:groupId/posts/:postId/comments/:commentId
     * Delete a comment
     */
    fastify.delete('/:groupId/posts/:postId/comments/:commentId', { preHandler: authenticate }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { postId, commentId } = request.params as { groupId: string; postId: string; commentId: string };

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment || comment.deletedAt) {
            return reply.status(404).send({ error: 'Comment not found' });
        }

        if (comment.authorId !== userId) {
            return reply.status(403).send({ error: 'Not authorized to delete this comment' });
        }

        await prisma.$transaction(async (tx) => {
            // Soft delete the comment
            await tx.comment.update({
                where: { id: commentId },
                data: { deletedAt: new Date() },
            });

            // Update comment count on post
            await tx.post.update({
                where: { id: postId },
                data: { commentCount: { decrement: 1 } },
            });

            // Update reply count on parent if it's a reply
            if (comment.parentId) {
                await tx.comment.update({
                    where: { id: comment.parentId },
                    data: { replyCount: { decrement: 1 } },
                });
            }
        });

        reply.send({ success: true });
    });
}
