/**
 * Listings Routes (Housing)
 * Nomad housing listings, roommate finder
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function listingsRoutes(app: FastifyInstance) {
    // Get all listings
    app.get('/api/v1/listings', async (request: FastifyRequest) => {
        const { city, type, minPrice, maxPrice, limit = 20, offset = 0 } = request.query as any;

        const where: any = {};
        if (city) where.location = { contains: city, mode: 'insensitive' };
        if (type) where.type = type;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseInt(minPrice);
            if (maxPrice) where.price.lte = parseInt(maxPrice);
        }

        // For now return mock data - listings model would need to be added to Prisma
        return [];
    });

    // Get single listing
    app.get('/api/v1/listings/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };

        // Mock response
        return { id, message: 'Listing not found' };
    });

    // Create listing
    app.post('/api/v1/listings', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const body = request.body as any;

        // Would create in DB
        return {
            id: `listing_${Date.now()}`,
            hostId: userId,
            ...body,
            isVerified: false,
            createdAt: new Date(),
        };
    });

    // Update listing
    app.patch('/api/v1/listings/:id', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as any).user.userId;
        const { id } = request.params as { id: string };
        const body = request.body as any;

        return { id, ...body, updatedAt: new Date() };
    });

    // Delete listing
    app.delete('/api/v1/listings/:id', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const { id } = request.params as { id: string };
        return { success: true };
    });

    // Get my listings
    app.get('/api/v1/listings/my', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        return [];
    });
}
