/**
 * Trips Routes
 * Travel itinerary and matching
 */

import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

export async function tripsRoutes(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
): Promise<void> {

    // All routes require authentication
    fastify.addHook('preHandler', authenticate);

    /**
     * GET /
     * List user's trips
     */
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { status, upcoming } = request.query as { status?: string; upcoming?: string };

        const whereClause: any = { userId };

        if (status) {
            whereClause.status = status;
        }

        if (upcoming === 'true') {
            whereClause.startDate = { gte: new Date() };
        }

        const trips = await prisma.trip.findMany({
            where: whereClause,
            orderBy: { startDate: 'asc' },
        });

        reply.send({ data: trips });
    });

    /**
     * POST /
     * Create a new trip
     */
    fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const {
            city,
            country,
            countryCode,
            latitude,
            longitude,
            startDate,
            endDate,
            openTo = [],
            notes,
            visibility = 'public',
        } = request.body as {
            city: string;
            country: string;
            countryCode?: string;
            latitude?: number;
            longitude?: number;
            startDate: string;
            endDate: string;
            openTo?: string[];
            notes?: string;
            visibility?: string;
        };

        if (!city || !country || !startDate || !endDate) {
            return reply.status(400).send({ error: 'city, country, startDate, and endDate are required' });
        }

        const trip = await prisma.trip.create({
            data: {
                userId,
                city,
                country,
                countryCode,
                latitude,
                longitude,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: 'planning',
                openTo,
                notes,
                visibility,
            },
        });

        // Update user's trip count
        await prisma.user.update({
            where: { id: userId },
            data: { tripCount: { increment: 1 } },
        });

        reply.status(201).send({ trip });
    });

    /**
     * GET /discover
     * Find travelers with overlapping trips
     */
    fastify.get('/discover', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { city, country, startDate, endDate, limit = 20 } = request.query as {
            city?: string;
            country?: string;
            startDate?: string;
            endDate?: string;
            limit?: number;
        };

        // Get user's upcoming trips
        const userTrips = await prisma.trip.findMany({
            where: {
                userId,
                startDate: { gte: new Date() },
            },
        });

        if (userTrips.length === 0 && !city) {
            return reply.send({ data: [], message: 'No upcoming trips. Add a trip or specify a destination.' });
        }

        // Build search criteria
        const searchCriteria: any = {
            visibility: 'public',
            userId: { not: userId },
        };

        if (city) {
            searchCriteria.city = { contains: city, mode: 'insensitive' };
        } else if (country) {
            searchCriteria.country = { contains: country, mode: 'insensitive' };
        } else if (userTrips.length > 0) {
            // Search based on user's trips
            const destinations = userTrips.map((t) => ({
                city: { contains: t.city, mode: 'insensitive' as const },
                OR: [
                    {
                        AND: [
                            { startDate: { lte: t.endDate } },
                            { endDate: { gte: t.startDate } },
                        ],
                    },
                ],
            }));
            searchCriteria.OR = destinations;
        }

        if (startDate && endDate) {
            searchCriteria.AND = [
                { startDate: { lte: new Date(endDate) } },
                { endDate: { gte: new Date(startDate) } },
            ];
        }

        const matchingTrips = await prisma.trip.findMany({
            where: searchCriteria,
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                        bio: true,
                        travelStyle: true,
                        rating: true,
                        trustLevel: true,
                    },
                },
            },
            take: Number(limit),
        });

        // Calculate overlap and score
        const matches = matchingTrips.map((trip) => {
            let overlapDays = 0;
            let matchScore = 50; // Base score

            // Calculate overlap with user's trips
            userTrips.forEach((userTrip) => {
                if (
                    trip.city.toLowerCase() === userTrip.city.toLowerCase() &&
                    trip.startDate <= userTrip.endDate &&
                    trip.endDate >= userTrip.startDate
                ) {
                    const overlapStart = new Date(Math.max(trip.startDate.getTime(), userTrip.startDate.getTime()));
                    const overlapEnd = new Date(Math.min(trip.endDate.getTime(), userTrip.endDate.getTime()));
                    overlapDays = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24));
                    matchScore += overlapDays * 10;
                }
            });

            // Boost score based on user rating
            const rating = trip.user.rating;
            if (rating) {
                matchScore += Number(rating) * 5;
            }

            return {
                user: trip.user,
                trip: {
                    id: trip.id,
                    city: trip.city,
                    country: trip.country,
                    startDate: trip.startDate,
                    endDate: trip.endDate,
                    openTo: trip.openTo,
                },
                overlapDays,
                matchScore: Math.min(matchScore, 100),
            };
        });

        // Sort by match score
        matches.sort((a, b) => b.matchScore - a.matchScore);

        reply.send({ data: matches });
    });

    /**
     * GET /:id
     * Get trip details
     */
    fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };

        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        if (!trip) {
            return reply.status(404).send({ error: 'Trip not found' });
        }

        // Check visibility
        if (trip.userId !== userId && trip.visibility === 'private') {
            return reply.status(403).send({ error: 'This trip is private' });
        }

        reply.send({ trip });
    });

    /**
     * PATCH /:id
     * Update a trip
     */
    fastify.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };
        const updates = request.body as Record<string, any>;

        const trip = await prisma.trip.findUnique({
            where: { id },
        });

        if (!trip) {
            return reply.status(404).send({ error: 'Trip not found' });
        }

        if (trip.userId !== userId) {
            return reply.status(403).send({ error: 'Not authorized' });
        }

        // Process date fields
        if (updates.startDate) updates.startDate = new Date(updates.startDate);
        if (updates.endDate) updates.endDate = new Date(updates.endDate);

        const updatedTrip = await prisma.trip.update({
            where: { id },
            data: updates,
        });

        reply.send({ trip: updatedTrip });
    });

    /**
     * DELETE /:id
     * Delete a trip
     */
    fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };

        const trip = await prisma.trip.findUnique({
            where: { id },
        });

        if (!trip) {
            return reply.status(404).send({ error: 'Trip not found' });
        }

        if (trip.userId !== userId) {
            return reply.status(403).send({ error: 'Not authorized' });
        }

        await prisma.trip.delete({
            where: { id },
        });

        // Update user's trip count
        await prisma.user.update({
            where: { id: userId },
            data: { tripCount: { decrement: 1 } },
        });

        reply.send({ success: true });
    });
}
