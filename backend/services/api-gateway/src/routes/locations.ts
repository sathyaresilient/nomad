/**
 * Locations/Map Routes
 * Map pins, nearby users, places
 */

import { FastifyInstance, FastifyRequest } from 'fastify';

export async function locationsRoutes(app: FastifyInstance) {
    // Get nearby pins (users, events, places)
    app.get('/api/v1/locations/nearby', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const { latitude, longitude, radiusKm = 10, types } = request.query as any;

        if (!latitude || !longitude) {
            return [];
        }

        // Would query geospatial data
        // For now return empty - would need PostGIS or similar

        return [];
    });

    // Get users in a city
    app.get('/api/v1/locations/city/:city/users', async (request: FastifyRequest) => {
        const { city } = request.params as { city: string };
        const { limit = 20, offset = 0 } = request.query as any;

        // Query users with current city matching
        const users = await app.prisma.trip.findMany({
            where: {
                city: { contains: city, mode: 'insensitive' },
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
            include: {
                user: {
                    select: { id: true, displayName: true, avatarUrl: true, bio: true },
                },
            },
            take: parseInt(limit as string),
            skip: parseInt(offset as string),
        });

        return users.map((t) => ({
            userId: t.user.id,
            displayName: t.user.displayName,
            avatarUrl: t.user.avatarUrl,
            city: t.city,
            country: t.country,
            startDate: t.startDate,
            endDate: t.endDate,
        }));
    });

    // Update my location
    app.post('/api/v1/locations/update', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const { latitude, longitude } = request.body as any;

        // Store in Redis for real-time queries
        await app.redis.setex(
            `location:${userId}`,
            1800, // 30 min expiry
            JSON.stringify({ latitude, longitude, updatedAt: new Date() })
        );

        return { success: true };
    });

    // Get saved places
    app.get('/api/v1/locations/saved', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        return [];
    });

    // Save a place
    app.post('/api/v1/locations/saved', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const { name, latitude, longitude, category, notes } = request.body as any;

        return {
            id: `place_${Date.now()}`,
            userId,
            name,
            latitude,
            longitude,
            category,
            notes,
            createdAt: new Date(),
        };
    });

    // Delete saved place
    app.delete('/api/v1/locations/saved/:id', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const { id } = request.params as { id: string };
        return { success: true };
    });
}
