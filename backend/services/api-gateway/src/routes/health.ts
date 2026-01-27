/**
 * Health Routes
 */

import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';

export async function healthRoutes(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
): Promise<void> {

    /**
     * GET /
     * Basic health check
     */
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.send({
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        });
    });

    /**
     * GET /ready
     * Readiness check (includes DB and Redis)
     */
    fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
                database: 'unknown',
                redis: 'unknown',
            },
        };

        try {
            await prisma.$queryRaw`SELECT 1`;
            health.services.database = 'ok';
        } catch (error) {
            health.services.database = 'error';
            health.status = 'degraded';
        }

        try {
            await redis.ping();
            health.services.redis = 'ok';
        } catch (error) {
            health.services.redis = 'error';
            health.status = 'degraded';
        }

        const statusCode = health.status === 'ok' ? 200 : 503;
        reply.status(statusCode).send(health);
    });
}
