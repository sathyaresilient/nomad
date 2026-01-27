/**
 * App Configuration
 */

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    appUrl: process.env.APP_URL || 'http://localhost:8081',

    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:8081,http://localhost:3000').split(','),

    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-chars-long',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    },

    database: {
        url: process.env.DATABASE_URL || 'postgresql://nomadly:nomadly_dev@localhost:5432/nomadly_dev',
    },

    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
};
