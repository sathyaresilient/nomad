/**
 * Health Check Routes
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function healthRoutes(fastify: FastifyInstance) {
    // Basic liveness probe
    fastify.get('/live', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send({ status: 'ok', service: 'user-service' });
    });

    // Readiness probe with dependency checks
    fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
        const checks = {
            database: false,
            redis: false,
        };

        try {
            // Check database
            await fastify.prisma.$queryRaw`SELECT 1`;
            checks.database = true;
        } catch (error) {
            fastify.log.error({ err: error }, 'Database health check failed');
        }

        try {
            // Check Redis
            await fastify.redis.ping();
            checks.redis = true;
        } catch (error) {
            fastify.log.error({ err: error }, 'Redis health check failed');
        }

        const allHealthy = Object.values(checks).every((v) => v);

        return reply.status(allHealthy ? 200 : 503).send({
            status: allHealthy ? 'ok' : 'degraded',
            service: 'user-service',
            checks,
            timestamp: new Date().toISOString(),
        });
    });

    // Root health endpoint
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send({
            status: 'ok',
            service: 'user-service',
            version: process.env.npm_package_version || '0.1.0',
            uptime: process.uptime(),
        });
    });
}
