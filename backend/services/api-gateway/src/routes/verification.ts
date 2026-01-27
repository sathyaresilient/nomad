/**
 * Verification Routes
 * Identity verification, social linking
 */

import { FastifyInstance, FastifyRequest } from 'fastify';

export async function verificationRoutes(app: FastifyInstance) {
    // Get verification status
    app.get('/api/v1/verification/status', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;

        const user = await app.prisma.user.findUnique({
            where: { id: userId },
            select: {
                isVerified: true,
            },
        });

        return {
            status: user?.isVerified ? 'verified' : 'pending',
            socials: {
                linkedin: false,
                instagram: false,
                github: false,
            },
        };
    });

    // Start ID verification
    app.post('/api/v1/verification/id/start', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;

        // Would integrate with ID verification service (Stripe Identity, Jumio, etc.)
        return {
            sessionId: `verify_${Date.now()}`,
            redirectUrl: null, // Would be verification service URL
            status: 'pending',
        };
    });

    // Complete ID verification (webhook callback)
    app.post('/api/v1/verification/id/complete', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const { sessionId, result } = request.body as any;

        if (result === 'success') {
            await app.prisma.user.update({
                where: { id: userId },
                data: { isVerified: true },
            });
        }

        return { success: true };
    });

    // Link social account
    app.post('/api/v1/verification/social/:platform', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const { platform } = request.params as { platform: string };
        const { accessToken } = request.body as any;

        // Would validate token with platform API
        // For now, just mark as linked

        return {
            platform,
            linked: true,
            linkedAt: new Date(),
        };
    });

    // Unlink social account
    app.delete('/api/v1/verification/social/:platform', {
        preHandler: [app.authenticate],
    }, async (request: FastifyRequest) => {
        const userId = (request as any).user.userId;
        const { platform } = request.params as { platform: string };

        return { success: true };
    });
}
