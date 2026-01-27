/**
 * Authentication Middleware
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyIdToken } from '../lib/firebase.js';
import { prisma } from '../lib/prisma.js';

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        await request.jwtVerify();
    } catch (err) {
        // If JWT fails, try Firebase
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decodedToken = await verifyIdToken(token);
                // Find user by Firebase UID
                let user = await prisma.user.findUnique({
                    where: { firebaseUid: decodedToken.uid }
                });

                // Auto-create/Sync if not found but email exists
                if (!user && decodedToken.email) {
                    // Check by email to link accounts
                    const existingUser = await prisma.user.findUnique({
                        where: { email: decodedToken.email }
                    });

                    if (existingUser) {
                        // Link existing user
                        user = await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { firebaseUid: decodedToken.uid }
                        });
                    } else {
                        // Create new user
                        user = await prisma.user.create({
                            data: {
                                email: decodedToken.email,
                                firebaseUid: decodedToken.uid,
                                displayName: decodedToken.name || decodedToken.email.split('@')[0],
                                authProvider: 'firebase',
                                trustLevel: 'new',
                                avatarUrl: decodedToken.picture
                            }
                        });
                    }
                }

                if (user) {
                    // Attach user to request (Mocking structure expected by app)
                    (request as any).user = {
                        userId: user.id,
                        email: user.email,
                        firebaseUid: decodedToken.uid
                    };
                    return; // Auth success
                }
            } catch (firebaseErr) {
                // Firebase failed too
            }
        }

        reply.status(401).send({ error: 'Unauthorized' });
    }
}

export async function optionalAuth(
    request: FastifyRequest,
    _reply: FastifyReply
): Promise<void> {
    try {
        await request.jwtVerify();
    } catch (err) {
        // Auth is optional, continue without user
    }
}
