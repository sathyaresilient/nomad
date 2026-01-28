/**
 * API Client
 * Centralized API communication with authentication
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// ============================================================
// Configuration
// ============================================================

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.nomadly.app';

const TOKEN_KEY = 'nomadly_access_token';
const REFRESH_KEY = 'nomadly_refresh_token';

// ============================================================
// Token Management (Web + Native)
// ============================================================

// Web storage fallback
const webStorage = {
    getItem: (key: string): string | null => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItem: (key: string, value: string): void => {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(key, value);
        }
    },
    removeItem: (key: string): void => {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(key);
        }
    },
};

export const TokenStorage = {
    async getAccessToken(): Promise<string | null> {
        try {
            if (Platform.OS === 'web') {
                return webStorage.getItem(TOKEN_KEY);
            }
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } catch {
            return null;
        }
    },

    async setAccessToken(token: string): Promise<void> {
        if (Platform.OS === 'web') {
            webStorage.setItem(TOKEN_KEY, token);
        } else {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
    },

    async getRefreshToken(): Promise<string | null> {
        try {
            if (Platform.OS === 'web') {
                return webStorage.getItem(REFRESH_KEY);
            }
            return await SecureStore.getItemAsync(REFRESH_KEY);
        } catch {
            return null;
        }
    },

    async setRefreshToken(token: string): Promise<void> {
        if (Platform.OS === 'web') {
            webStorage.setItem(REFRESH_KEY, token);
        } else {
            await SecureStore.setItemAsync(REFRESH_KEY, token);
        }
    },

    async clearTokens(): Promise<void> {
        if (Platform.OS === 'web') {
            webStorage.removeItem(TOKEN_KEY);
            webStorage.removeItem(REFRESH_KEY);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_KEY);
        }
    },

    async setTokens(accessToken: string, refreshToken: string): Promise<void> {
        await Promise.all([
            this.setAccessToken(accessToken),
            this.setRefreshToken(refreshToken),
        ]);
    },
};

// ============================================================
// API Client
// ============================================================

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

class ApiClient {
    private baseUrl: string;
    private isRefreshing = false;
    private refreshPromise: Promise<boolean> | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async getHeaders(): Promise<HeadersInit> {
        const token = await TokenStorage.getAccessToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }

    private async refreshToken(): Promise<boolean> {
        if (this.isRefreshing) {
            return this.refreshPromise!;
        }

        this.isRefreshing = true;
        this.refreshPromise = (async () => {
            try {
                const refreshToken = await TokenStorage.getRefreshToken();
                if (!refreshToken) return false;

                const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (!response.ok) {
                    await TokenStorage.clearTokens();
                    return false;
                }

                const data = await response.json();
                await TokenStorage.setAccessToken(data.accessToken);
                return true;
            } catch {
                return false;
            } finally {
                this.isRefreshing = false;
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders();

        try {
            let response = await fetch(url, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            // Handle 401 - try refresh
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    const newHeaders = await this.getHeaders();
                    response = await fetch(url, {
                        ...options,
                        headers: { ...newHeaders, ...options.headers },
                    });
                } else {
                    return { data: null, error: 'Session expired', status: 401 };
                }
            }

            const data = await response.json();

            if (!response.ok) {
                return {
                    data: null,
                    error: data.error || data.message || 'Request failed',
                    status: response.status,
                };
            }

            return { data, error: null, status: response.status };
        } catch (error) {
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Network error',
                status: 0,
            };
        }
    }

    // Convenience methods
    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    post<T>(endpoint: string, body: unknown) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    patch<T>(endpoint: string, body: unknown) {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient(API_URL);

// ============================================================
// Auth API
// ============================================================

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        displayName: string;
        avatarUrl?: string;
        trustLevel: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export const AuthAPI = {
    async login(email: string, password: string) {
        const result = await api.post<AuthResponse>('/api/v1/auth/login', {
            email,
            password,
        });

        if (result.data) {
            await TokenStorage.setTokens(
                result.data.accessToken,
                result.data.refreshToken
            );
        }

        return result;
    },

    async register(email: string, password: string, displayName?: string) {
        const result = await api.post<AuthResponse>('/api/v1/auth/register', {
            email,
            password,
            displayName,
        });

        if (result.data) {
            await TokenStorage.setTokens(
                result.data.accessToken,
                result.data.refreshToken
            );
        }

        return result;
    },

    async logout() {
        const refreshToken = await TokenStorage.getRefreshToken();
        if (refreshToken) {
            await api.post('/api/v1/auth/logout', { refreshToken });
        }
        await TokenStorage.clearTokens();
    },

    async getMe() {
        return api.get<{ user: AuthResponse['user'] }>('/api/v1/auth/me');
    },

    async googleSignIn(idToken: string) {
        const result = await api.post<AuthResponse>('/api/v1/oauth/google/token', { idToken });

        if (result.data) {
            await TokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
        }

        return result;
    },

    async appleSignIn(identityToken: string, fullName?: { firstName?: string; lastName?: string }) {
        const result = await api.post<AuthResponse>('/api/v1/auth/apple/token', {
            identityToken,
            fullName,
        });

        if (result.data) {
            await TokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
        }

        return result;
    },

    async forgotPassword(email: string) {
        return api.post<{ success: boolean }>('/api/v1/auth/forgot-password', { email });
    },
};

// ============================================================
// Trips API
// ============================================================

export interface Trip {
    id: string;
    userId: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string;
    status: string;
    openTo: string[];
    createdAt?: string;
    updatedAt?: string;
}

export const TripsAPI = {
    list() {
        return api.get<Trip[]>('/api/v1/trips');
    },

    get(id: string) {
        return api.get<Trip>(`/api/v1/trips/${id}`);
    },

    create(trip: Omit<Trip, 'id' | 'userId'>) {
        return api.post<Trip>('/api/v1/trips', trip);
    },

    update(id: string, updates: Partial<Trip>) {
        return api.patch<Trip>(`/api/v1/trips/${id}`, updates);
    },

    delete(id: string) {
        return api.delete(`/api/v1/trips/${id}`);
    },

    getMatches(tripId: string) {
        return api.get<{ matches: any[] }>(`/api/v1/trips/${tripId}/matches`);
    },
};

// ============================================================
// Users API
// ============================================================

export const UsersAPI = {
    get(id: string) {
        return api.get<{ user: any }>(`/api/v1/users/${id}`);
    },

    update(id: string, updates: any) {
        return api.patch<{ user: any }>(`/api/v1/users/${id}`, updates);
    },

    getTrustScore(id: string) {
        return api.get<any>(`/api/v1/users/${id}/trust-score`);
    },
};

// ============================================================
// Groups API
// ============================================================

export const GroupsAPI = {
    list(params?: { type?: string; destination?: string }) {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return api.get<any[]>(`/api/v1/groups${query}`);
    },

    get(id: string) {
        return api.get<any>(`/api/v1/groups/${id}`);
    },

    create(group: any) {
        return api.post<any>('/api/v1/groups', group);
    },

    join(id: string) {
        return api.post<any>(`/api/v1/groups/${id}/join`, {});
    },

    leave(id: string) {
        return api.post<any>(`/api/v1/groups/${id}/leave`, {});
    },
};

// ============================================================
// Messaging API
// ============================================================

export const MessagingAPI = {
    listConversations() {
        return api.get<any[]>('/api/v1/conversations');
    },

    getMessages(conversationId: string, params?: { limit?: number; before?: string }) {
        const query = params ? `?${new URLSearchParams(params as any)}` : '';
        return api.get<any[]>(`/api/v1/conversations/${conversationId}/messages${query}`);
    },

    sendMessage(conversationId: string, content: string, messageType = 'text') {
        return api.post<any>(`/api/v1/conversations/${conversationId}/messages`, {
            content,
            messageType,
        });
    },
};

// ============================================================
// Friends API
// ============================================================

export interface Friend {
    id: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    connectedAt: string;
}

export interface FriendRequest {
    id: string;
    fromUserId: string;
    toUserId: string;
    message?: string;
    createdAt: string;
    fromUser?: { id: string; displayName: string; avatarUrl?: string };
    toUser?: { id: string; displayName: string; avatarUrl?: string };
}

export const FriendsAPI = {
    // Get all friends
    list() {
        return api.get<Friend[]>('/api/v1/friends');
    },

    // Get connection status with user
    getStatus(userId: string) {
        return api.get<{ status: string; connectionId?: string }>(`/api/v1/friends/status/${userId}`);
    },

    // Friend requests
    sendRequest(toUserId: string, message?: string) {
        return api.post<FriendRequest>('/api/v1/friends/request', { toUserId, message });
    },

    getReceivedRequests() {
        return api.get<FriendRequest[]>('/api/v1/friends/requests/received');
    },

    getSentRequests() {
        return api.get<FriendRequest[]>('/api/v1/friends/requests/sent');
    },

    acceptRequest(requestId: string) {
        return api.post<any>(`/api/v1/friends/request/${requestId}/accept`, {});
    },

    declineRequest(requestId: string) {
        return api.post<any>(`/api/v1/friends/request/${requestId}/decline`, {});
    },

    cancelRequest(requestId: string) {
        return api.delete(`/api/v1/friends/request/${requestId}`);
    },

    // Remove friend
    remove(userId: string) {
        return api.delete(`/api/v1/friends/${userId}`);
    },
};

// ============================================================
// Listings (Housing) API
// ============================================================

export const ListingsAPI = {
    list(params?: { city?: string; type?: string; minPrice?: number; maxPrice?: number }) {
        const query = params ? `?${new URLSearchParams(params as any)}` : '';
        return api.get<any[]>(`/api/v1/listings${query}`);
    },

    get(id: string) {
        return api.get<any>(`/api/v1/listings/${id}`);
    },

    create(listing: any) {
        return api.post<any>('/api/v1/listings', listing);
    },

    update(id: string, updates: any) {
        return api.patch<any>(`/api/v1/listings/${id}`, updates);
    },

    delete(id: string) {
        return api.delete(`/api/v1/listings/${id}`);
    },

    getMy() {
        return api.get<any[]>('/api/v1/listings/my');
    },
};

// ============================================================
// Verification API
// ============================================================

export const VerificationAPI = {
    getStatus() {
        return api.get<{ status: string; socials: Record<string, boolean> }>('/api/v1/verification/status');
    },

    startIdVerification() {
        return api.post<{ sessionId: string; redirectUrl?: string; status: string }>('/api/v1/verification/id/start', {});
    },

    completeIdVerification(sessionId: string, result: string) {
        return api.post<{ success: boolean }>('/api/v1/verification/id/complete', { sessionId, result });
    },

    linkSocial(platform: string, accessToken: string) {
        return api.post<{ platform: string; linked: boolean }>(`/api/v1/verification/social/${platform}`, { accessToken });
    },

    unlinkSocial(platform: string) {
        return api.delete(`/api/v1/verification/social/${platform}`);
    },
};

// ============================================================
// Events API
// ============================================================

export const EventsAPI = {
    list(params?: { location?: string; category?: string }) {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return api.get<any[]>(`/api/v1/events${query}`);
    },

    get(id: string) {
        return api.get<any>(`/api/v1/events/${id}`);
    },

    create(event: any) {
        return api.post<any>('/api/v1/events', event);
    },

    join(id: string) {
        return api.post<any>(`/api/v1/events/${id}/join`, {});
    },

    requestJoin(id: string) {
        return api.post<any>(`/api/v1/events/${id}/request`, {});
    },

    leave(id: string) {
        return api.post<any>(`/api/v1/events/${id}/leave`, {});
    },
};

// ============================================================
// Threads API
// ============================================================

export const ThreadsAPI = {
    list(params?: { category?: string }) {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return api.get<any[]>(`/api/v1/threads${query}`);
    },

    get(id: string) {
        return api.get<any>(`/api/v1/threads/${id}`);
    },

    create(thread: { title: string; content: string; category: string }) {
        return api.post<any>('/api/v1/threads', thread);
    },

    like(id: string) {
        return api.post<any>(`/api/v1/threads/${id}/like`, {});
    },

    reply(id: string, content: string) {
        return api.post<any>(`/api/v1/threads/${id}/reply`, { content });
    },
};

// ============================================================
// Safety API
// ============================================================

export const SafetyAPI = {
    getContacts() {
        return api.get<any[]>('/api/v1/safety/contacts');
    },

    addContact(contact: { name: string; phone: string; relation: string }) {
        return api.post<any>('/api/v1/safety/contacts', contact);
    },

    removeContact(id: string) {
        return api.delete(`/api/v1/safety/contacts/${id}`);
    },

    updateLocationSharing(enabled: boolean, latitude?: number, longitude?: number) {
        return api.post<any>('/api/v1/safety/location', { enabled, latitude, longitude });
    },

    getSharedLocations() {
        return api.get<any[]>('/api/v1/safety/locations');
    },

    triggerAlert(latitude: number, longitude: number, message?: string) {
        return api.post<any>('/api/v1/safety/alert', { latitude, longitude, message });
    },

    cancelAlert(alertId: string) {
        return api.post<any>(`/api/v1/safety/alert/${alertId}/cancel`, {});
    },

    checkin(latitude: number, longitude: number, note?: string) {
        return api.post<any>('/api/v1/safety/checkin', { latitude, longitude, note });
    },
};

// ============================================================
// Locations API
// ============================================================

export const LocationsAPI = {
    getNearby(latitude: number, longitude: number, radiusKm = 10, types?: string) {
        const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), radiusKm: String(radiusKm) });
        if (types) params.set('types', types);
        return api.get<any[]>(`/api/v1/locations/nearby?${params}`);
    },

    getUsersInCity(city: string) {
        return api.get<any[]>(`/api/v1/locations/city/${encodeURIComponent(city)}/users`);
    },

    updateMyLocation(latitude: number, longitude: number) {
        return api.post<any>('/api/v1/locations/update', { latitude, longitude });
    },

    getSavedPlaces() {
        return api.get<any[]>('/api/v1/locations/saved');
    },

    savePlace(place: { name: string; latitude: number; longitude: number; category?: string; notes?: string }) {
        return api.post<any>('/api/v1/locations/saved', place);
    },

    deletePlace(id: string) {
        return api.delete(`/api/v1/locations/saved/${id}`);
    },
};
