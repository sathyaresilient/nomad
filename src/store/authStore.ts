/**
 * Auth Store
 * Manages user authentication state with real API
 */

import { create } from 'zustand';
import { AuthAPI, TokenStorage } from '../lib/api';
import { analytics, ANALYTICS_EVENTS } from '../lib/analytics';
import type { AuthUser } from '../types';

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, displayName?: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateProfile: (updates: Partial<AuthUser>) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading to check existing auth
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const result = await AuthAPI.login(email, password);

        if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
        }

        if (result.data) {
            const user = result.data.user as AuthUser;
            set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            analytics.identify(user.id, { email: user.email, name: user.displayName });
            analytics.track(ANALYTICS_EVENTS.USER_LOGGED_IN, { provider: 'email' });
            return true;
        }

        set({ isLoading: false });
        return false;
    },

    register: async (email: string, password: string, displayName?: string) => {
        set({ isLoading: true, error: null });

        const result = await AuthAPI.register(email, password, displayName);

        if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
        }

        if (result.data) {
            const user = result.data.user as AuthUser;
            set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            analytics.identify(user.id, { email: user.email, name: user.displayName });
            analytics.track(ANALYTICS_EVENTS.USER_LOGGED_IN, { provider: 'email' });
            return true;
        }

        set({ isLoading: false });
        return false;
    },

    logout: async () => {
        set({ isLoading: true });
        analytics.track(ANALYTICS_EVENTS.USER_LOGGED_OUT);
        analytics.reset();
        await AuthAPI.logout();
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    },

    checkAuth: async () => {
        const token = await TokenStorage.getAccessToken();

        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }

        const result = await AuthAPI.getMe();

        if (result.data?.user) {
            const user = result.data.user as AuthUser;
            set({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            analytics.identify(user.id, { email: user.email, name: user.displayName });
        } else {
            // Token invalid, clear it
            await TokenStorage.clearTokens();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

    updateProfile: (updates: Partial<AuthUser>) => {
        const { user } = get();
        if (user) {
            set({ user: { ...user, ...updates } });
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
