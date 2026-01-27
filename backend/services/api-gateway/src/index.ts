/**
 * Nomadly API Gateway
 * Central entry point for all API requests
 */

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';
import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import type { Redis } from 'ioredis';

import { config } from './config/index.js';
import { flushSentry, initSentry, sentryPlugin } from './lib/sentry.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import { authRoutes } from './routes/auth.js';
import { chatRoutes } from './routes/chat.js';
import { eventsRoutes } from './routes/events.js';
import { friendsRoutes } from './routes/friends.js';
import { groupsRoutes } from './routes/groups.js';
import { healthRoutes } from './routes/health.js';
import { listingsRoutes } from './routes/listings.js';
import { locationsRoutes } from './routes/locations.js';
import mediaRoutes from './routes/media.js';
import notificationRoutes from './routes/notifications.js';
import { oauthRoutes } from './routes/oauth.js';
import { safetyRoutes } from './routes/safety.js';
import searchRoutes from './routes/search.js';
import { tripsRoutes } from './routes/trips.js';
import { usersRoutes } from './routes/users.js';
import { verificationRoutes } from './routes/verification.js';

// Initialize Sentry first
initSentry();

// Initialize Prisma and Redis
// Initialize Prisma
const prisma = new PrismaClient();
// Use shared Redis client (with Mock support)
import { redis } from './lib/redis.js';

// Extend Fastify types
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
        redis: Redis;
        authenticate: (request: any, reply: any) => Promise<void>;
    }
}

// Initialize Fastify
const app: FastifyInstance = Fastify({
    logger: true,
    trustProxy: true,
});

// Decorate with Prisma and Redis
app.decorate('prisma', prisma);
app.decorate('redis', redis);

// Authentication decorator
app.decorate('authenticate', async function (request: any, reply: any) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ error: 'Unauthorized' });
    }
});

// Register plugins
async function registerPlugins() {
    // Sentry integration
    await app.register(sentryPlugin);

    // Security
    await app.register(helmet, {
        contentSecurityPolicy: false,
    });

    // CORS
    await app.register(cors, {
        origin: config.corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    // Rate limiting with Redis backend for distributed environments
    await app.register(rateLimit, {
        global: true,
        max: config.rateLimit.max,
        timeWindow: config.rateLimit.windowMs,
        redis,
        keyGenerator: (request) => {
            // Use user ID if authenticated, otherwise use IP
            const user = (request as any).user;
            return user?.userId || request.ip;
        },
        errorResponseBuilder: () => ({
            statusCode: 429,
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
        }),
    });

    // JWT authentication
    await app.register(jwt, {
        secret: config.jwt.secret,
        sign: {
            expiresIn: config.jwt.expiresIn,
        },
    });

    // Swagger documentation
    await app.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Nomadly API',
                description: 'Travel social network API',
                version: '1.0.0',
            },
            servers: [
                {
                    url: config.apiUrl,
                    description: config.env === 'production' ? 'Production' : 'Development',
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            tags: [
                { name: 'Health', description: 'Health check endpoints' },
                { name: 'Auth', description: 'Authentication endpoints' },
                { name: 'Users', description: 'User management' },
                { name: 'Groups', description: 'Groups and communities' },
                { name: 'Trips', description: 'Travel planning' },
                { name: 'Chat', description: 'Messaging' },
                { name: 'Media', description: 'File uploads and media' },
                { name: 'Search', description: 'Discovery and search' },
                { name: 'Notifications', description: 'Push and in-app notifications' },
            ],
        },
    });

    await app.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    });

    // WebSocket support
    await app.register(websocket);
}

// Register routes
async function registerRoutes() {
    // Health check (no auth)
    await app.register(healthRoutes, { prefix: '/health' });

    // Root route (Fix for 404)
    app.get('/', async (request, reply) => {
        return {
            name: 'Nomadly API Gateway',
            status: 'running',
            serverTime: new Date().toISOString(),
            docs: '/docs'
        };
    });

    // Auth routes (no auth required)
    await app.register(authRoutes, { prefix: '/api/v1/auth' });
    await app.register(oauthRoutes, { prefix: '/api/v1/auth' });

    // Protected routes
    await app.register(usersRoutes, { prefix: '/api/v1/users' });
    await app.register(groupsRoutes, { prefix: '/api/v1/groups' });
    await app.register(tripsRoutes, { prefix: '/api/v1/trips' });
    await app.register(chatRoutes, { prefix: '/api/v1/chat' });

    // New Phase 9-10 routes
    await app.register(mediaRoutes, { prefix: '/api/v1/media' });
    await app.register(searchRoutes, { prefix: '/api/v1/search' });
    await app.register(notificationRoutes, { prefix: '/api/v1/notifications' });
    await app.register(friendsRoutes);

    // Phase 11 routes
    await app.register(listingsRoutes);
    await app.register(verificationRoutes);
    await app.register(eventsRoutes);
    await app.register(safetyRoutes);
    await app.register(locationsRoutes);
}

// Global error handler
app.setErrorHandler(errorHandler);

// Start server
async function start() {
    try {
        await registerPlugins();
        await registerRoutes();

        await app.listen({
            port: config.port,
            host: config.host,
        });

        console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🌍 Nomadly API Gateway                                ║
║                                                          ║
║   Server running at: http://${config.host}:${config.port}          ║
║   API Docs: http://${config.host}:${config.port}/docs              ║
║   Environment: ${config.env.padEnd(38)}║
║                                                          ║
║   Features:                                              ║
║   ✅ Rate Limiting (Redis-backed)                        ║
║   ✅ Sentry Error Tracking                               ║
║   ✅ Media Upload (GCS)                                  ║
║   ✅ Search & Discovery                                  ║
║   ✅ Push Notifications                                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
    process.on(signal, async () => {
        console.log(`\n${signal} received. Shutting down gracefully...`);

        // Flush Sentry events
        await flushSentry();

        // Close Redis connection
        await redis.quit();

        // Disconnect Prisma
        await prisma.$disconnect();

        // Close Fastify
        await app.close();

        process.exit(0);
    });
});

start();

export { app };
