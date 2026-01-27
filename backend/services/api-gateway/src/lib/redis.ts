/**
 * Redis Client
 */

import Redis from 'ioredis';
import { config } from '../config';

const redisUrl = config.redis.url || 'redis://localhost:6379';
const isLocal = redisUrl.includes('localhost') || redisUrl.includes('127.0.0.1');

// Prefer actual Redis, but fall back to Mock if running on Cloud Run without config
// Cloud Run services often don't have local Redis access
let RedisClient = Redis;

// @ts-ignore
if (process.env.K_SERVICE && isLocal) {  // K_SERVICE is set in Cloud Run
    console.warn('⚠️ Cloud Run detected with localhost Redis URL. Switching to Mock Redis.');
    try {
        const MockRedis = require('ioredis-mock');
        RedisClient = MockRedis;
    } catch (e) {
        console.error('Failed to load ioredis-mock', e);
    }
}

export const redis = new RedisClient(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
        if (times > 3) {
            console.error('Redis connection failed after 3 retries');
            return null;
        }
        return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
});

redis.on('connect', () => {
    console.log('✅ Redis connected');
});

redis.on('error', (err) => {
    console.error('Redis error:', err.message);
});

export default redis;

// Cache helpers
export const cache = {
    async get<T>(key: string): Promise<T | null> {
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    },

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const data = JSON.stringify(value);
        if (ttlSeconds) {
            await redis.setex(key, ttlSeconds, data);
        } else {
            await redis.set(key, data);
        }
    },

    async del(key: string): Promise<void> {
        await redis.del(key);
    },

    async exists(key: string): Promise<boolean> {
        const result = await redis.exists(key);
        return result === 1;
    },

    // Rate limiting helper
    async rateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }
        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
        };
    },
};
