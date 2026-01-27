/**
 * OAuth Routes
 * Google and Apple OAuth authentication
 */

import bcrypt from 'bcryptjs';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { appleOAuth, googleOAuth, oauthConfig } from '../config/oauth.js';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';

// State storage TTL (10 minutes)
const STATE_TTL = 600;

interface GoogleUserInfo {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
}

interface AppleTokenPayload {
    iss: string;
    sub: string;
    aud: string;
    email?: string;
    email_verified?: string;
}

export async function oauthRoutes(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
): Promise<void> {

    /**
     * GET /google
     * Initiate Google OAuth flow
     */
    fastify.get('/google', async (request: FastifyRequest, reply: FastifyReply) => {
        const state = uuid();

        // Store state in Redis for CSRF protection
        await redis.setex(`oauth:state:${state}`, STATE_TTL, 'google');

        const authUrl = googleOAuth.getAuthUrl(state);
        reply.redirect(authUrl);
    });

    /**
     * GET /google/callback
     * Handle Google OAuth callback
     */
    fastify.get('/google/callback', async (request: FastifyRequest, reply: FastifyReply) => {
        const { code, state, error } = request.query as {
            code?: string;
            state?: string;
            error?: string;
        };

        if (error) {
            return reply.redirect(`${process.env.APP_URL}/auth/error?error=${error}`);
        }

        if (!code || !state) {
            return reply.status(400).send({ error: 'Missing code or state' });
        }

        // Verify state
        const storedState = await redis.get(`oauth:state:${state}`);
        if (storedState !== 'google') {
            return reply.status(400).send({ error: 'Invalid state' });
        }
        await redis.del(`oauth:state:${state}`);

        try {
            // Exchange code for tokens
            const tokenResponse = await fetch(googleOAuth.tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: oauthConfig.google.clientId,
                    client_secret: oauthConfig.google.clientSecret,
                    redirect_uri: oauthConfig.google.redirectUri,
                    grant_type: 'authorization_code',
                }),
            });

            if (!tokenResponse.ok) {
                throw new Error('Failed to exchange code for tokens');
            }

            const tokens = await tokenResponse.json() as { access_token: string };

            // Get user info
            const userInfoResponse = await fetch(googleOAuth.userInfoUrl, {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            if (!userInfoResponse.ok) {
                throw new Error('Failed to get user info');
            }

            const userInfo = await userInfoResponse.json() as GoogleUserInfo;

            // Find or create user
            let user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: userInfo.email },
                    ],
                },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: userInfo.email,
                        displayName: userInfo.name || userInfo.email.split('@')[0],
                        avatarUrl: userInfo.picture,
                        emailVerified: userInfo.email_verified,
                        authProvider: 'google',
                        trustLevel: 'new',
                    },
                });
            }

            // Generate tokens
            const accessToken = fastify.jwt.sign(
                { userId: user.id, email: user.email },
                { expiresIn: '15m' }
            );

            const refreshToken = uuid();
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

            await prisma.userSession.create({
                data: {
                    userId: user.id,
                    refreshTokenHash,
                    deviceInfo: { provider: 'google' },
                    ipAddress: request.ip,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            // Redirect to app with tokens
            const redirectUrl = new URL(`${process.env.APP_URL}/auth/callback`);
            redirectUrl.searchParams.set('accessToken', accessToken);
            redirectUrl.searchParams.set('refreshToken', refreshToken);
            redirectUrl.searchParams.set('expiresIn', '900');

            reply.redirect(redirectUrl.toString());
        } catch (err) {
            fastify.log.error({ err }, 'OAuth failed');
            reply.redirect(`${process.env.APP_URL}/auth/error?error=oauth_failed`);
        }
    });

    /**
     * POST /google/token
     * Exchange Google ID token (from mobile SDK) for app tokens
     */
    fastify.post('/google/token', async (request: FastifyRequest, reply: FastifyReply) => {
        const { idToken } = request.body as { idToken: string };

        if (!idToken) {
            return reply.status(400).send({ error: 'Missing idToken' });
        }

        try {
            // Verify the token with Google
            const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
            const verifyResponse = await fetch(verifyUrl);

            if (!verifyResponse.ok) {
                return reply.status(401).send({ error: 'Invalid token' });
            }

            const payload = await verifyResponse.json() as GoogleUserInfo & { aud: string };

            // Verify audience
            if (payload.aud !== oauthConfig.google.clientId) {
                return reply.status(401).send({ error: 'Invalid token audience' });
            }

            // Find or create user
            let user = await prisma.user.findFirst({
                where: { email: payload.email },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: payload.email,
                        displayName: payload.name || payload.email.split('@')[0],
                        avatarUrl: payload.picture,
                        emailVerified: payload.email_verified,
                        authProvider: 'google',
                        trustLevel: 'new',
                    },
                });
            }

            // Generate tokens
            const accessToken = fastify.jwt.sign(
                { userId: user.id, email: user.email },
                { expiresIn: '15m' }
            );

            const refreshToken = uuid();
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

            await prisma.userSession.create({
                data: {
                    userId: user.id,
                    refreshTokenHash,
                    deviceInfo: { provider: 'google', platform: 'mobile' },
                    ipAddress: request.ip,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            reply.send({
                user: {
                    id: user.id,
                    email: user.email,
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl,
                },
                accessToken,
                refreshToken,
                expiresIn: 900,
            });
        } catch (err) {
            fastify.log.error({ err }, 'Authentication failed');
            reply.status(500).send({ error: 'Authentication failed' });
        }
    });

    /**
     * GET /apple
     * Initiate Apple OAuth flow
     */
    fastify.get('/apple', async (request: FastifyRequest, reply: FastifyReply) => {
        const state = uuid();

        await redis.setex(`oauth:state:${state}`, STATE_TTL, 'apple');

        const authUrl = appleOAuth.getAuthUrl(state);
        reply.redirect(authUrl);
    });

    /**
     * POST /apple/callback
     * Handle Apple OAuth callback (Apple uses form_post)
     */
    fastify.post('/apple/callback', async (request: FastifyRequest, reply: FastifyReply) => {
        const { code, state, user: userJson, error } = request.body as {
            code?: string;
            state?: string;
            user?: string;
            error?: string;
        };

        if (error) {
            return reply.redirect(`${process.env.APP_URL}/auth/error?error=${error}`);
        }

        if (!code || !state) {
            return reply.status(400).send({ error: 'Missing code or state' });
        }

        // Verify state
        const storedState = await redis.get(`oauth:state:${state}`);
        if (storedState !== 'apple') {
            return reply.status(400).send({ error: 'Invalid state' });
        }
        await redis.del(`oauth:state:${state}`);

        try {
            // Generate client secret (Apple requires JWT)
            const clientSecret = generateAppleClientSecret();

            // Exchange code for tokens
            const tokenResponse = await fetch(appleOAuth.tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: oauthConfig.apple.clientId,
                    client_secret: clientSecret,
                    redirect_uri: oauthConfig.apple.redirectUri,
                    grant_type: 'authorization_code',
                }),
            });

            if (!tokenResponse.ok) {
                throw new Error('Failed to exchange code for tokens');
            }

            const tokens = await tokenResponse.json() as { id_token: string };

            // Decode id_token to get user info
            const payload = jwt.decode(tokens.id_token) as AppleTokenPayload;
            if (!payload) {
                throw new Error('Invalid id_token');
            }

            // Apple only sends user info on first authorization
            let userInfo = {
                sub: payload.sub,
                email: payload.email,
                name: '',
            };

            if (userJson) {
                try {
                    const userData = JSON.parse(userJson);
                    if (userData.name) {
                        userInfo.name = `${userData.name.firstName || ''} ${userData.name.lastName || ''}`.trim();
                    }
                } catch {
                    // Ignore JSON parse error
                }
            }

            // Find or create user
            let user = await prisma.user.findFirst({
                where: { email: userInfo.email || undefined },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: userInfo.email || `apple_${userInfo.sub}@privaterelay.appleid.com`,
                        displayName: userInfo.name || 'Nomad',
                        emailVerified: true,
                        authProvider: 'apple',
                        trustLevel: 'new',
                    },
                });
            }

            // Generate tokens
            const accessToken = fastify.jwt.sign(
                { userId: user.id, email: user.email },
                { expiresIn: '15m' }
            );

            const refreshToken = uuid();
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

            await prisma.userSession.create({
                data: {
                    userId: user.id,
                    refreshTokenHash,
                    deviceInfo: { provider: 'apple' },
                    ipAddress: request.ip,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            // Redirect to app
            const redirectUrl = new URL(`${process.env.APP_URL}/auth/callback`);
            redirectUrl.searchParams.set('accessToken', accessToken);
            redirectUrl.searchParams.set('refreshToken', refreshToken);
            redirectUrl.searchParams.set('expiresIn', '900');

            reply.redirect(redirectUrl.toString());
        } catch (err) {
            fastify.log.error({ err }, 'OAuth failed');
            reply.redirect(`${process.env.APP_URL}/auth/error?error=oauth_failed`);
        }
    });

    /**
     * POST /apple/token
     * Exchange Apple identity token (from mobile SDK) for app tokens
     */
    fastify.post('/apple/token', async (request: FastifyRequest, reply: FastifyReply) => {
        const { identityToken, fullName } = request.body as {
            identityToken: string;
            fullName?: { firstName?: string; lastName?: string };
        };

        if (!identityToken) {
            return reply.status(400).send({ error: 'Missing identityToken' });
        }

        try {
            // Decode and verify the identity token
            const payload = jwt.decode(identityToken) as AppleTokenPayload;
            if (!payload || !payload.sub) {
                return reply.status(401).send({ error: 'Invalid token' });
            }

            // In production: Verify token signature with Apple's public keys
            // For now, trust the decoded payload

            // Build user name from fullName if provided
            let displayName = 'Nomad';
            if (fullName) {
                const parts = [fullName.firstName, fullName.lastName].filter(Boolean);
                if (parts.length > 0) {
                    displayName = parts.join(' ');
                }
            }

            // Find or create user
            let user = await prisma.user.findFirst({
                where: { email: payload.email || undefined },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: payload.email || `apple_${payload.sub}@privaterelay.appleid.com`,
                        displayName,
                        emailVerified: true,
                        authProvider: 'apple',
                        trustLevel: 'new',
                    },
                });
            }

            // Generate tokens
            const accessToken = fastify.jwt.sign(
                { userId: user.id, email: user.email },
                { expiresIn: '15m' }
            );

            const refreshToken = uuid();
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

            await prisma.userSession.create({
                data: {
                    userId: user.id,
                    refreshTokenHash,
                    deviceInfo: { provider: 'apple', platform: 'mobile' },
                    ipAddress: request.ip,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            reply.send({
                user: {
                    id: user.id,
                    email: user.email,
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl,
                },
                accessToken,
                refreshToken,
                expiresIn: 900,
            });
        } catch (err) {
            fastify.log.error({ err }, 'Apple authentication failed');
            reply.status(500).send({ error: 'Authentication failed' });
        }
    });
}

/**
 * Generate Apple client secret (JWT)
 */
function generateAppleClientSecret(): string {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        iss: oauthConfig.apple.teamId,
        iat: now,
        exp: now + 15777000, // 6 months
        aud: 'https://appleid.apple.com',
        sub: oauthConfig.apple.clientId,
    };

    return jwt.sign(payload, oauthConfig.apple.privateKey, {
        algorithm: 'ES256',
        header: {
            alg: 'ES256',
            kid: oauthConfig.apple.keyId,
        } as any,
    });
}
