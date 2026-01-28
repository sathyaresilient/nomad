/**
 * Feedback Routes
 * POST/GET feedback for trips and user interactions
 */

import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

interface CreateFeedbackBody {
    toUserId: string;
    tripId?: string;
    wouldTravelAgain?: boolean;
    vibeRating?: 'great' | 'good' | 'okay' | 'not_great';
    anonymousNote?: string;
}

export default async function feedbackRoutes(app: FastifyInstance) {
    // Create feedback
    app.post<{ Body: CreateFeedbackBody }>(
        '/',
        { preHandler: [authenticate] },
        async (request, reply) => {
            const userId = (request as any).user.userId;
            const { toUserId, tripId, wouldTravelAgain, vibeRating, anonymousNote } = request.body;

            // Validate that user isn't giving feedback to themselves
            if (userId === toUserId) {
                return reply.status(400).send({ error: 'Cannot give feedback to yourself' });
            }

            // Check if feedback already exists for this trip
            if (tripId) {
                const existing = await prisma.feedback.findFirst({
                    where: {
                        fromUserId: userId,
                        toUserId,
                        tripId,
                    },
                });

                if (existing) {
                    return reply.status(400).send({ error: 'Feedback already submitted for this trip' });
                }
            }

            const feedback = await prisma.feedback.create({
                data: {
                    fromUserId: userId,
                    toUserId,
                    tripId,
                    wouldTravelAgain,
                    vibeRating,
                    anonymousNote,
                },
            });

            // Update user's feedback count
            await prisma.user.update({
                where: { id: toUserId },
                data: {
                    feedbackCount: { increment: 1 },
                },
            });

            return { feedback };
        }
    );

    // Get feedback received by current user
    app.get(
        '/received',
        { preHandler: [authenticate] },
        async (request, reply) => {
            const userId = (request as any).user.userId;

            const feedback = await prisma.feedback.findMany({
                where: { toUserId: userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    fromUser: {
                        select: {
                            id: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            // Calculate stats
            const stats = {
                total: feedback.length,
                wouldTravelAgain: feedback.filter(f => f.wouldTravelAgain).length,
                vibeRatings: {
                    great: feedback.filter(f => f.vibeRating === 'great').length,
                    good: feedback.filter(f => f.vibeRating === 'good').length,
                    okay: feedback.filter(f => f.vibeRating === 'okay').length,
                    not_great: feedback.filter(f => f.vibeRating === 'not_great').length,
                },
            };

            return { feedback, stats };
        }
    );

    // Get feedback given by current user
    app.get(
        '/given',
        { preHandler: [authenticate] },
        async (request, reply) => {
            const userId = (request as any).user.userId;

            const feedback = await prisma.feedback.findMany({
                where: { fromUserId: userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    toUser: {
                        select: {
                            id: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            return { feedback };
        }
    );

    // Get feedback for a specific user (public view - limited info)
    app.get<{ Params: { userId: string } }>(
        '/user/:userId',
        { preHandler: [authenticate] },
        async (request, reply) => {
            const { userId } = request.params;

            const feedback = await prisma.feedback.findMany({
                where: { toUserId: userId },
            });

            // Only return aggregated stats, not individual feedback
            const stats = {
                total: feedback.length,
                wouldTravelAgainPercent: feedback.length > 0
                    ? Math.round((feedback.filter(f => f.wouldTravelAgain).length / feedback.length) * 100)
                    : 0,
                vibeRatings: {
                    great: feedback.filter(f => f.vibeRating === 'great').length,
                    good: feedback.filter(f => f.vibeRating === 'good').length,
                    okay: feedback.filter(f => f.vibeRating === 'okay').length,
                    not_great: feedback.filter(f => f.vibeRating === 'not_great').length,
                },
            };

            return { stats };
        }
    );
}
