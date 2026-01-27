/**
 * Search Routes
 * Full-text search for users, groups, and trips
 * Uses PostgreSQL full-text search (can be upgraded to Elasticsearch later)
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Types - Use type assertion instead of extending to avoid property conflicts
type AuthenticatedRequest = FastifyRequest & {
    user?: { userId: string };
};

export default async function searchRoutes(fastify: FastifyInstance) {
    const { prisma } = fastify;

    // ===================================================
    // Search Users
    // ===================================================
    fastify.get(
        '/users',
        {
            schema: {
                description: 'Search users by name, bio, or location',
                tags: ['Search'],
                querystring: {
                    type: 'object',
                    required: ['q'],
                    properties: {
                        q: { type: 'string', minLength: 1, maxLength: 100 },
                        limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
                        offset: { type: 'integer', minimum: 0, default: 0 },
                        location: { type: 'string' },
                        travelStyle: { type: 'string' },
                        minTrustLevel: { type: 'string', enum: ['new', 'bronze', 'silver', 'gold', 'platinum'] },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const query = request.query as { q: string; limit?: number; offset?: number; travelStyle?: string; minTrustLevel?: string };
            const searchTerm = query.q.toLowerCase();
            const limit = query.limit || 20;
            const offset = query.offset || 0;

            // Build where clause
            const where: any = {
                isActive: true,
                deletedAt: null,
                OR: [
                    { displayName: { contains: searchTerm, mode: 'insensitive' } },
                    { bio: { contains: searchTerm, mode: 'insensitive' } },
                ],
            };

            if (query.travelStyle) {
                where.travelStyle = query.travelStyle;
            }

            if (query.minTrustLevel) {
                const trustLevels = ['new', 'bronze', 'silver', 'gold', 'platinum'];
                const minIndex = trustLevels.indexOf(query.minTrustLevel);
                where.trustLevel = { in: trustLevels.slice(minIndex) };
            }

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    select: {
                        id: true,
                        displayName: true,
                        avatarUrl: true,
                        bio: true,
                        travelStyle: true,
                        trustLevel: true,
                        rating: true,
                        countriesVisited: true,
                        isVerified: true,
                    },
                    orderBy: [
                        { rating: 'desc' },
                        { tripCount: 'desc' },
                    ],
                    take: limit,
                    skip: offset,
                }),
                prisma.user.count({ where }),
            ]);

            return reply.send({
                results: users.map((u) => ({
                    ...u,
                    rating: Number(u.rating),
                })),
                total,
                query: query.q,
            });
        }
    );

    // ===================================================
    // Search Groups
    // ===================================================
    fastify.get(
        '/groups',
        {
            schema: {
                description: 'Search groups by name, description, or destination',
                tags: ['Search'],
                querystring: {
                    type: 'object',
                    required: ['q'],
                    properties: {
                        q: { type: 'string', minLength: 1, maxLength: 100 },
                        limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
                        offset: { type: 'integer', minimum: 0, default: 0 },
                        type: { type: 'string', enum: ['trip_squad', 'local_meetup', 'interest_group'] },
                        destination: { type: 'string' },
                        privacy: { type: 'string', enum: ['public', 'private'] },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const query = request.query as { q: string; limit?: number; offset?: number; type?: string; destination?: string; privacy?: string };
            const searchTerm = query.q.toLowerCase();
            const limit = query.limit || 20;
            const offset = query.offset || 0;

            const where: any = {
                deletedAt: null,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { destination: { contains: searchTerm, mode: 'insensitive' } },
                ],
            };

            if (query.type) {
                where.type = query.type;
            }

            if (query.destination) {
                where.destination = { contains: query.destination, mode: 'insensitive' };
            }

            if (query.privacy) {
                where.privacy = query.privacy;
            }

            const [groups, total] = await Promise.all([
                prisma.group.findMany({
                    where,
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        emoji: true,
                        description: true,
                        coverImageUrl: true,
                        destination: true,
                        country: true,
                        startDate: true,
                        endDate: true,
                        privacy: true,
                        memberCount: true,
                        isVerified: true,
                    },
                    orderBy: [
                        { memberCount: 'desc' },
                        { createdAt: 'desc' },
                    ],
                    take: limit,
                    skip: offset,
                }),
                prisma.group.count({ where }),
            ]);

            return reply.send({
                results: groups,
                total,
                query: query.q,
            });
        }
    );

    // ===================================================
    // Search Trips
    // ===================================================
    fastify.get(
        '/trips',
        {
            schema: {
                description: 'Search trips by destination or date range',
                tags: ['Search'],
                querystring: {
                    type: 'object',
                    required: ['q'],
                    properties: {
                        q: { type: 'string', minLength: 1, maxLength: 100 },
                        limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
                        offset: { type: 'integer', minimum: 0, default: 0 },
                        city: { type: 'string' },
                        country: { type: 'string' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const query = request.query as { q: string; limit?: number; offset?: number; city?: string; country?: string; startDate?: string; endDate?: string };
            const searchTerm = query.q.toLowerCase();
            const limit = query.limit || 20;
            const offset = query.offset || 0;

            const where: any = {
                visibility: 'public',
                OR: [
                    { city: { contains: searchTerm, mode: 'insensitive' } },
                    { country: { contains: searchTerm, mode: 'insensitive' } },
                    { notes: { contains: searchTerm, mode: 'insensitive' } },
                ],
            };

            if (query.city) {
                where.city = { contains: query.city, mode: 'insensitive' };
            }

            if (query.country) {
                where.country = { contains: query.country, mode: 'insensitive' };
            }

            if (query.startDate) {
                where.startDate = { gte: new Date(query.startDate) };
            }

            if (query.endDate) {
                where.endDate = { lte: new Date(query.endDate) };
            }

            const [trips, total] = await Promise.all([
                prisma.trip.findMany({
                    where,
                    select: {
                        id: true,
                        city: true,
                        country: true,
                        countryCode: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        openTo: true,
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                avatarUrl: true,
                                trustLevel: true,
                            },
                        },
                    },
                    orderBy: { startDate: 'asc' },
                    take: limit,
                    skip: offset,
                }),
                prisma.trip.count({ where }),
            ]);

            return reply.send({
                results: trips,
                total,
                query: query.q,
            });
        }
    );

    // ===================================================
    // Discovery Feed
    // ===================================================
    fastify.get(
        '/discover',
        {
            preHandler: [fastify.authenticate],
            schema: {
                description: 'Personalized discovery feed based on user preferences',
                tags: ['Search'],
                querystring: {
                    type: 'object',
                    properties: {
                        limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const user = (request as AuthenticatedRequest).user!;
            const { limit = 20 } = request.query as { limit?: number };

            // Get current user's profile for personalization
            const currentUser = await prisma.user.findUnique({
                where: { id: user.userId },
                select: {
                    travelStyle: true,
                    favoriteDestinations: true,
                    languages: true,
                },
            });

            // Get user's upcoming trips for matching
            const userTrips = await prisma.trip.findMany({
                where: {
                    userId: user.userId,
                    startDate: { gte: new Date() },
                },
                select: { city: true, country: true, startDate: true, endDate: true },
            });

            // Find overlapping travelers
            const overlappingTravelers = await Promise.all(
                userTrips.map(async (trip) => {
                    return prisma.trip.findMany({
                        where: {
                            userId: { not: user.userId },
                            city: trip.city,
                            visibility: 'public',
                            OR: [
                                {
                                    startDate: { lte: trip.endDate },
                                    endDate: { gte: trip.startDate },
                                },
                            ],
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    displayName: true,
                                    avatarUrl: true,
                                    trustLevel: true,
                                    rating: true,
                                    travelStyle: true,
                                },
                            },
                        },
                        take: 5,
                    });
                })
            );

            // Find suggested groups
            const suggestedGroups = await prisma.group.findMany({
                where: {
                    deletedAt: null,
                    privacy: 'public',
                    OR: [
                        ...(currentUser?.favoriteDestinations?.map((dest) => ({
                            destination: { contains: dest, mode: 'insensitive' as const },
                        })) || []),
                        ...userTrips.map((trip) => ({
                            destination: { contains: trip.city, mode: 'insensitive' as const },
                        })),
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    emoji: true,
                    coverImageUrl: true,
                    destination: true,
                    memberCount: true,
                },
                orderBy: { memberCount: 'desc' },
                take: Math.floor(limit / 2),
            });

            // Flatten and deduplicate travelers
            const travelers = overlappingTravelers
                .flat()
                .filter((trip, index, self) =>
                    index === self.findIndex((t) => t.user.id === trip.user.id)
                )
                .slice(0, Math.floor(limit / 2));

            return reply.send({
                travelers: travelers.map((t) => ({
                    user: {
                        ...t.user,
                        rating: Number(t.user.rating),
                    },
                    trip: {
                        city: t.city,
                        country: t.country,
                        startDate: t.startDate,
                        endDate: t.endDate,
                    },
                })),
                groups: suggestedGroups,
            });
        }
    );

    // ===================================================
    // Autocomplete
    // ===================================================
    fastify.get(
        '/autocomplete',
        {
            schema: {
                description: 'Autocomplete suggestions for search',
                tags: ['Search'],
                querystring: {
                    type: 'object',
                    required: ['q'],
                    properties: {
                        q: { type: 'string', minLength: 1, maxLength: 50 },
                        type: { type: 'string', enum: ['all', 'users', 'groups', 'destinations'], default: 'all' },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { q, type = 'all' } = request.query as { q: string; type?: string };
            const searchTerm = q.toLowerCase();
            const suggestions: Array<{ type: string; value: string; id?: string }> = [];

            if (type === 'all' || type === 'users') {
                const users = await prisma.user.findMany({
                    where: {
                        isActive: true,
                        displayName: { contains: searchTerm, mode: 'insensitive' },
                    },
                    select: { id: true, displayName: true },
                    take: 5,
                });
                suggestions.push(...users.map((u) => ({
                    type: 'user',
                    value: u.displayName,
                    id: u.id,
                })));
            }

            if (type === 'all' || type === 'groups') {
                const groups = await prisma.group.findMany({
                    where: {
                        deletedAt: null,
                        name: { contains: searchTerm, mode: 'insensitive' },
                    },
                    select: { id: true, name: true },
                    take: 5,
                });
                suggestions.push(...groups.map((g) => ({
                    type: 'group',
                    value: g.name,
                    id: g.id,
                })));
            }

            if (type === 'all' || type === 'destinations') {
                // Get unique destinations from trips
                const trips = await prisma.trip.findMany({
                    where: {
                        city: { contains: searchTerm, mode: 'insensitive' },
                    },
                    select: { city: true, country: true },
                    distinct: ['city', 'country'],
                    take: 5,
                });
                suggestions.push(...trips.map((t) => ({
                    type: 'destination',
                    value: `${t.city}, ${t.country}`,
                })));
            }

            return reply.send({ suggestions });
        }
    );
}
