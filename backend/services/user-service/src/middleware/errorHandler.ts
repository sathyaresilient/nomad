/**
 * Global Error Handler
 */

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    request.log.error(error);

    // Zod validation errors
    if (error instanceof ZodError) {
        return reply.status(400).send({
            error: 'Validation Error',
            message: 'Invalid request data',
            details: error.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    // JWT errors
    if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
        return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Missing authorization header',
        });
    }

    if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
        return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Token expired',
        });
    }

    if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
        return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid token',
        });
    }

    // Default error response
    return reply.status(error.statusCode || 500).send({
        error: error.name || 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
    });
}
