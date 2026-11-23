/**
 * Redis Client
 */

import Redis from 'ioredis';
import { config } from '../config';

const redisUrl = config.redis.url || 'redis://localhost:6379';
const isLocal = redisUrl.includes('localhost') || redisUrl.includes('127.0.0.1');
const isTls = redisUrl.startsWith('rediss://');

// Prefer actual Redis, but fall back to Mock if running on Cloud Run without REDIS_URL configured
let RedisClient = Redis;

// @ts-ignore
if (process.env.K_SERVICE && isLocal && !process.env.REDIS_URL) {  // K_SERVICE is set in Cloud Run
    console.warn('⚠️ Cloud Run detected with localhost Redis URL and no REDIS_URL secret. Switching to Mock Redis.');
    try {
        const MockRedis = require('ioredis-mock');
        RedisClient = MockRedis;
    } catch (e) {
        console.error('Failed to load ioredis-mock', e);
    }
}

export const redis = new RedisClient(redisUrl, {
    tls: isTls ? { rejectUnauthorized: false } : undefined,
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    retryStrategy: (times: number) => {
        if (times > 10) {
            console.error('Redis reconnection aborted after 10 retries');
            return null;
        }
        return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
});

redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
    // Suppress unhandled rejections; log as warning to keep API Gateway operational
    console.warn('Redis connection alert:', err.message);
});

export default redis;

// Cache helpers with fail-safe error handling
export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redis.get(key);
            if (!data) return null;
            return JSON.parse(data) as T;
        } catch (err) {
            console.warn(`Redis get failed for key "${key}":`, (err as any)?.message || err);
            return null;
        }
    },

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        try {
            const data = JSON.stringify(value);
            if (ttlSeconds) {
                await redis.setex(key, ttlSeconds, data);
            } else {
                await redis.set(key, data);
            }
        } catch (err) {
            console.warn(`Redis set failed for key "${key}":`, (err as any)?.message || err);
        }
    },

    async del(key: string): Promise<void> {
        try {
            await redis.del(key);
        } catch (err) {
            console.warn(`Redis del failed for key "${key}":`, (err as any)?.message || err);
        }
    },

    async exists(key: string): Promise<boolean> {
        try {
            const result = await redis.exists(key);
            return result === 1;
        } catch (err) {
            return false;
        }
    },

    // Rate limiting helper with fail-open behavior so users aren't locked out if Redis blips
    async rateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
        try {
            const current = await redis.incr(key);
            if (current === 1) {
                await redis.expire(key, windowSeconds);
            }
            return {
                allowed: current <= limit,
                remaining: Math.max(0, limit - current),
            };
        } catch (err) {
            console.warn('Redis rateLimit check failed, failing open:', (err as any)?.message || err);
            return { allowed: true, remaining: limit };
        }
    },
};
