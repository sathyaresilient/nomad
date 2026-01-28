/**
 * Auth Store
 * Manages user authentication state with real API
 */

import { create } from 'zustand';
import { AuthAPI, TokenStorage } from '../lib/api';
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
            set({
                user: result.data.user as AuthUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
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
            set({
                user: result.data.user as AuthUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            return true;
        }

        set({ isLoading: false });
        return false;
    },

    logout: async () => {
        set({ isLoading: true });
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
            set({
                user: result.data.user as AuthUser,
                isAuthenticated: true,
                isLoading: false,
            });
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
