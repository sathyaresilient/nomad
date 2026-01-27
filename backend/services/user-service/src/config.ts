/**
 * User Service Configuration
 */

import 'dotenv/config';

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    grpcPort: parseInt(process.env.GRPC_PORT || '50051', 10),
    host: process.env.HOST || '0.0.0.0',
    logLevel: process.env.LOG_LEVEL || 'info',

    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],

    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    database: {
        url: process.env.DATABASE_URL || 'postgresql://localhost:5432/nomadly',
    },

    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },

    // Trust score calculation weights
    trustScore: {
        tripWeight: 10,
        positiveReviewWeight: 15,
        negativeReviewWeight: -20,
        verificationBonus: 50,
        thresholds: {
            bronze: 50,
            silver: 150,
            gold: 400,
            platinum: 1000,
        },
    },
};
