/**
 * Nomadly Analytics Service
 * Zero-dependency, permanent behavioral tracking with PostHog REST API support.
 * Works out-of-the-box across iOS, Android, and Web.
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const ANALYTICS_EVENTS = {
    // Auth & Onboarding
    USER_SIGNED_UP: 'user_signed_up',
    USER_LOGGED_IN: 'user_logged_in',
    USER_LOGGED_OUT: 'user_logged_out',
    PROFILE_UPDATED: 'profile_updated',

    // Travel & Trips
    TRIP_CREATED: 'trip_created',
    TRIP_VIEWED: 'trip_viewed',
    TRIP_SEARCHED: 'trip_searched',
    MATCH_VIEWED: 'match_viewed',

    // Social & Messaging
    CONNECTION_REQUESTED: 'connection_requested',
    CONNECTION_ACCEPTED: 'connection_accepted',
    MESSAGE_SENT: 'message_sent',
    GROUP_JOINED: 'group_joined',

    // Safety & Moderation
    USER_REPORTED: 'user_reported',
    USER_BLOCKED: 'user_blocked',
    USER_UNBLOCKED: 'user_unblocked',

    // Screen tracking
    SCREEN_VIEWED: '$screen',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS] | string;

class AnalyticsService {
    private apiKey: string = process.env.EXPO_PUBLIC_POSTHOG_API_KEY || '';
    private host: string = (process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/+$/, '');
    private distinctId: string = 'anonymous_' + Math.random().toString(36).substring(2, 9);
    private userProperties: Record<string, any> = {};

    constructor() {
        if (!this.apiKey && __DEV__) {
            console.log('ℹ️ [Analytics] No EXPO_PUBLIC_POSTHOG_API_KEY provided. Running in dev mock mode.');
        }
    }

    /**
     * Identify an authenticated user
     */
    public identify(userId: string, properties?: Record<string, any>) {
        if (!userId) return;
        this.distinctId = userId;
        if (properties) {
            this.userProperties = { ...this.userProperties, ...properties };
        }

        this.track('$identify', {
            $set: properties || {},
        });
    }

    /**
     * Reset identity on logout
     */
    public reset() {
        this.distinctId = 'anonymous_' + Math.random().toString(36).substring(2, 9);
        this.userProperties = {};
    }

    /**
     * Track a screen view
     */
    public screen(screenName: string, properties?: Record<string, any>) {
        this.track(ANALYTICS_EVENTS.SCREEN_VIEWED, {
            $screen_name: screenName,
            ...properties,
        });
    }

    /**
     * Track an event
     */
    public track(event: AnalyticsEventName, properties: Record<string, any> = {}) {
        const payloadProperties = {
            distinct_id: this.distinctId,
            $os: Platform.OS,
            $os_version: Platform.Version,
            $app_version: Constants.expoConfig?.version || '1.0.0',
            $device_name: Constants.deviceName || 'unknown',
            ...this.userProperties,
            ...properties,
        };

        if (__DEV__) {
            console.log(`📊 [Analytics Event] ${event}:`, payloadProperties);
        }

        // If no API key configured, fail silently without making requests
        if (!this.apiKey) {
            return;
        }

        // Fire-and-forget asynchronous POST to PostHog Capture endpoint
        try {
            fetch(`${this.host}/capture/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    event,
                    properties: payloadProperties,
                    timestamp: new Date().toISOString(),
                }),
            }).catch((err) => {
                if (__DEV__) {
                    console.warn('[Analytics Capture Error]:', err?.message || err);
                }
            });
        } catch {
            // Fail silently; analytics must never disrupt app operations
        }
    }
}

export const analytics = new AnalyticsService();
export default analytics;
