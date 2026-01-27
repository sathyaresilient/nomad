/**
 * Error Handler Middleware
 */

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
): void {
    const statusCode = error.statusCode || 500;

    request.log.error({
        err: error,
        request: {
            method: request.method,
            url: request.url,
            params: request.params,
            query: request.query,
        },
    });

    reply.status(statusCode).send({
        error: statusCode >= 500 ? 'Internal Server Error' : error.message,
        statusCode,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    });
}
