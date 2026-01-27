/**
 * Nomadly User Service
 * Handles authentication, user profiles, and trust scores
 */

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import Redis from 'ioredis';

import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import usersRoutes from './routes/users.js';

// Initialize Prisma and Redis
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Extend Fastify types
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
        redis: typeof redis;
        authenticate: (request: any, reply: any) => Promise<void>;
    }
}

// Initialize Fastify
const app: FastifyInstance = Fastify({
    logger: {
        level: config.logLevel,
        transport: config.env !== 'production' ? {
            target: 'pino-pretty',
            options: { colorize: true },
        } : undefined,
    },
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
    await app.register(helmet, { contentSecurityPolicy: false });

    await app.register(cors, {
        origin: config.corsOrigins,
        credentials: true,
    });

    await app.register(jwt, {
        secret: config.jwt.secret,
        sign: { expiresIn: config.jwt.expiresIn },
    });
}

// Register routes
async function registerRoutes() {
    await app.register(healthRoutes, { prefix: '/health' });
    await app.register(authRoutes, { prefix: '/api/v1/auth' });
    await app.register(usersRoutes, { prefix: '/api/v1/users' });
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
║   👤 Nomadly User Service                               ║
║                                                          ║
║   HTTP: http://${config.host}:${config.port}                       ║
║   gRPC: ${config.host}:${config.grpcPort}                                ║
║   Environment: ${config.env.padEnd(38)}║
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
        await redis.quit();
        await prisma.$disconnect();
        await app.close();
        process.exit(0);
    });
});

start();

export { app };
