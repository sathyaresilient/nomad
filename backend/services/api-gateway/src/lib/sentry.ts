/**
 * Sentry Error Tracking Integration
 * Captures and reports errors to Sentry for monitoring
 */

import * as Sentry from '@sentry/node';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Initialize Sentry
export function initSentry() {
    const dsn = process.env.SENTRY_DSN;

    if (!dsn) {
        console.log('⚠️  Sentry DSN not configured - error tracking disabled');
        return;
    }

    Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || 'development',
        release: process.env.APP_VERSION || '1.0.0',

        // Performance monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        // Filter out health check spam
        beforeSend(event) {
            const url = event.request?.url || '';
            if (url.includes('/health')) {
                return null;
            }
            return event;
        },

        // Integrations
        integrations: [
            Sentry.httpIntegration(),
        ],
    });

    console.log('✅ Sentry error tracking initialized');
}

// Fastify plugin for Sentry integration
export async function sentryPlugin(fastify: FastifyInstance) {
    // Add request context to Sentry
    fastify.addHook('onRequest', async (request: FastifyRequest) => {
        Sentry.setContext('request', {
            method: request.method,
            url: request.url,
            headers: request.headers,
        });

        // Add user context if authenticated
        const user = (request as any).user;
        if (user) {
            Sentry.setUser({
                id: user.userId,
                email: user.email,
            });
        }
    });

    // Capture errors
    fastify.addHook('onError', async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
        Sentry.captureException(error, {
            extra: {
                method: request.method,
                url: request.url,
                body: request.body,
                params: request.params,
                query: request.query,
            },
        });
    });

    // Clear user on response
    fastify.addHook('onResponse', async () => {
        Sentry.setUser(null);
    });
}

// Manual error capture utility
export function captureError(error: Error, context?: Record<string, unknown>) {
    Sentry.captureException(error, { extra: context });
}

// Manual message capture utility
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    Sentry.captureMessage(message, level);
}

// Flush pending events (for graceful shutdown)
export async function flushSentry() {
    await Sentry.close(2000);
}
