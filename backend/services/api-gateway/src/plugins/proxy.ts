/**
 * Proxy Plugin
 * Forwards requests to appropriate microservices
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getServiceForRoute, ServiceConfig, services } from '../config/services.js';

interface ProxyOptions {
    enableProxy: boolean;
}

async function proxyRequest(
    request: FastifyRequest,
    reply: FastifyReply,
    service: ServiceConfig
): Promise<void> {
    const targetUrl = `${service.url}${request.url}`;

    try {
        const headers: Record<string, string> = {};

        // Forward relevant headers
        if (request.headers.authorization) {
            headers['Authorization'] = request.headers.authorization as string;
        }
        if (request.headers['content-type']) {
            headers['Content-Type'] = request.headers['content-type'] as string;
        }
        headers['X-Forwarded-For'] = request.ip;
        headers['X-Request-ID'] = request.id;

        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body: ['POST', 'PUT', 'PATCH'].includes(request.method)
                ? JSON.stringify(request.body)
                : undefined,
        });

        const data = await response.json();

        reply.status(response.status).send(data);
    } catch (error) {
        request.log.error({ error, service: service.name, url: targetUrl }, 'Proxy request failed');
        reply.status(503).send({
            error: 'Service Unavailable',
            message: `${service.name} is temporarily unavailable`,
        });
    }
}

export async function proxyPlugin(
    fastify: FastifyInstance,
    options: ProxyOptions = { enableProxy: false }
) {
    if (!options.enableProxy) {
        fastify.log.info('Proxy mode disabled - using local routes');
        return;
    }

    fastify.log.info('Proxy mode enabled - forwarding to microservices');

    // Add proxy handler for all API routes
    fastify.addHook('onRequest', async (request, reply) => {
        // Skip non-API routes
        if (!request.url.startsWith('/api/')) {
            return;
        }

        // Skip health checks
        if (request.url.startsWith('/health')) {
            return;
        }

        const service = getServiceForRoute(request.url);

        if (service) {
            await proxyRequest(request, reply, service);
        }
    });

    // Health check that includes all services
    fastify.get('/health/services', async (request, reply) => {
        const results: Record<string, { status: string; latency?: number }> = {};

        for (const [name, service] of Object.entries(services)) {
            const start = Date.now();
            try {
                const response = await fetch(`${service.url}${service.healthPath}`, {
                    signal: AbortSignal.timeout(3000),
                });
                results[name] = {
                    status: response.ok ? 'healthy' : 'unhealthy',
                    latency: Date.now() - start,
                };
            } catch {
                results[name] = { status: 'unreachable' };
            }
        }

        const allHealthy = Object.values(results).every(r => r.status === 'healthy');

        return reply.status(allHealthy ? 200 : 503).send({
            status: allHealthy ? 'healthy' : 'degraded',
            services: results,
            timestamp: new Date().toISOString(),
        });
    });
}
