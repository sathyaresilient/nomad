/**
 * Friends Store
 * Manages friend requests, connections, and friend list with real API
 */

import { create } from 'zustand';
import { mockUsers } from '../data/mockUsers';
import { FriendsAPI, type Friend, type FriendRequest } from '../lib/api';

export type FriendshipStatus = 'none' | 'pending_sent' | 'pending_received' | 'friends';

interface FriendsState {
    friends: Friend[];
    sentRequests: FriendRequest[];
    receivedRequests: FriendRequest[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadFriends: () => Promise<void>;
    loadRequests: () => Promise<void>;
    sendFriendRequest: (toUserId: string, message?: string) => Promise<boolean>;
    acceptRequest: (requestId: string) => Promise<boolean>;
    declineRequest: (requestId: string) => Promise<boolean>;
    cancelRequest: (requestId: string) => Promise<boolean>;
    removeFriend: (userId: string) => Promise<boolean>;

    // Helpers
    getConnectionStatus: (userId: string) => Promise<FriendshipStatus>;
    getFriend: (userId: string) => Friend | undefined;
}

// Fallback mock data
const MOCK_FRIENDS: Friend[] = [
    {
        id: 'friend-1',
        userId: mockUsers[1]?.id || 'user-2',
        displayName: mockUsers[1]?.displayName || 'Sarah Jenkins',
        avatarUrl: mockUsers[1]?.avatarUrl,
        connectedAt: new Date('2024-10-01').toISOString(),
    },
];

export const useFriendsStore = create<FriendsState>((set, get) => ({
    friends: MOCK_FRIENDS,
    sentRequests: [],
    receivedRequests: [],
    isLoading: false,
    error: null,

    loadFriends: async () => {
        set({ isLoading: true, error: null });

        const result = await FriendsAPI.list();

        if (result.error) {
            // Keep mock data on error
            set({ isLoading: false });
            return;
        }

        set({ friends: result.data || MOCK_FRIENDS, isLoading: false });
    },

    loadRequests: async () => {
        const [received, sent] = await Promise.all([
            FriendsAPI.getReceivedRequests(),
            FriendsAPI.getSentRequests(),
        ]);

        set({
            receivedRequests: received.data || [],
            sentRequests: sent.data || [],
        });
    },

    sendFriendRequest: async (toUserId, message) => {
        set({ isLoading: true, error: null });

        const result = await FriendsAPI.sendRequest(toUserId, message);

        if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
        }

        if (result.data) {
            set((state) => ({
                sentRequests: [...state.sentRequests, result.data!],
                isLoading: false,
            }));
            return true;
        }

        set({ isLoading: false });
        return false;
    },

    acceptRequest: async (requestId) => {
        const result = await FriendsAPI.acceptRequest(requestId);

        if (result.error) {
            set({ error: result.error });
            return false;
        }

        // Refresh lists
        await Promise.all([get().loadFriends(), get().loadRequests()]);
        return true;
    },

    declineRequest: async (requestId) => {
        const result = await FriendsAPI.declineRequest(requestId);

        if (result.error) {
            return false;
        }

        set((state) => ({
            receivedRequests: state.receivedRequests.filter((r) => r.id !== requestId),
        }));
        return true;
    },

    cancelRequest: async (requestId) => {
        const result = await FriendsAPI.cancelRequest(requestId);

        if (result.error) {
            return false;
        }

        set((state) => ({
            sentRequests: state.sentRequests.filter((r) => r.id !== requestId),
        }));
        return true;
    },

    removeFriend: async (userId) => {
        const result = await FriendsAPI.remove(userId);

        if (result.error) {
            return false;
        }

        set((state) => ({
            friends: state.friends.filter((f) => f.userId !== userId),
        }));
        return true;
    },

    getConnectionStatus: async (userId) => {
        const result = await FriendsAPI.getStatus(userId);

        if (result.error || !result.data) {
            // Fallback to local check
            const state = get();
            if (state.friends.some((f) => f.userId === userId)) return 'friends';
            if (state.sentRequests.some((r) => r.toUserId === userId)) return 'pending_sent';
            if (state.receivedRequests.some((r) => r.fromUserId === userId)) return 'pending_received';
            return 'none';
        }

        return result.data.status as FriendshipStatus;
    },

    getFriend: (userId) => {
        return get().friends.find((f) => f.userId === userId);
    },
}));
