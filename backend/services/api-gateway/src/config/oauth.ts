/**
 * OAuth Configuration
 * Google and Apple OAuth provider setup
 */

import { z } from 'zod';

// OAuth configuration schema
const oauthConfigSchema = z.object({
    google: z.object({
        clientId: z.string(),
        clientSecret: z.string(),
        redirectUri: z.string(),
        scopes: z.array(z.string()).default(['openid', 'email', 'profile']),
    }),
    apple: z.object({
        clientId: z.string(),
        teamId: z.string(),
        keyId: z.string(),
        privateKey: z.string(),
        redirectUri: z.string(),
        scopes: z.array(z.string()).default(['name', 'email']),
    }),
});

// Parse from environment
const rawOAuthConfig = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/google/callback',
        scopes: ['openid', 'email', 'profile'],
    },
    apple: {
        clientId: process.env.APPLE_CLIENT_ID || '',
        teamId: process.env.APPLE_TEAM_ID || '',
        keyId: process.env.APPLE_KEY_ID || '',
        privateKey: process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
        redirectUri: process.env.APPLE_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/apple/callback',
        scopes: ['name', 'email'],
    },
};

export const oauthConfig = rawOAuthConfig;

// Google OAuth URLs
export const googleOAuth = {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',

    getAuthUrl(state: string): string {
        const params = new URLSearchParams({
            client_id: oauthConfig.google.clientId,
            redirect_uri: oauthConfig.google.redirectUri,
            response_type: 'code',
            scope: oauthConfig.google.scopes.join(' '),
            state,
            access_type: 'offline',
            prompt: 'consent',
        });
        return `${this.authUrl}?${params.toString()}`;
    },
};

// Apple OAuth URLs
export const appleOAuth = {
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',

    getAuthUrl(state: string): string {
        const params = new URLSearchParams({
            client_id: oauthConfig.apple.clientId,
            redirect_uri: oauthConfig.apple.redirectUri,
            response_type: 'code',
            scope: oauthConfig.apple.scopes.join(' '),
            state,
            response_mode: 'form_post',
        });
        return `${this.authUrl}?${params.toString()}`;
    },
};

export type OAuthConfig = z.infer<typeof oauthConfigSchema>;
