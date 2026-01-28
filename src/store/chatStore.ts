/**
 * Chat Store
 * Manages conversations and messages with real API
 */

import { create } from 'zustand';
import { mockUsers } from '../data/mockUsers';
import { MessagingAPI } from '../lib/api';
import type { User } from '../types';

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    read: boolean;
}

export interface ChatConversation {
    id: string;
    otherUser: User;
    messages: ChatMessage[];
    unreadCount: number;
}

interface ChatState {
    conversations: ChatConversation[];
    activeConversationId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadConversations: () => Promise<void>;
    loadMessages: (conversationId: string) => Promise<void>;
    sendMessage: (conversationId: string, text: string, senderId: string) => Promise<void>;
    getConversation: (conversationId: string) => ChatConversation | undefined;
    markAsRead: (conversationId: string) => void;
    createConversation: (otherUserId: string) => string;
}

// Fallback mock data
const MOCK_CONVERSATIONS: ChatConversation[] = [
    {
        id: 'sarah',
        otherUser: mockUsers[0],
        unreadCount: 1,
        messages: [
            { id: 'm1', senderId: 'sarah-chen', text: "Hey! I saw you're in Lisbon too. Want to grab coffee tomorrow?", timestamp: new Date(Date.now() - 1000 * 60 * 30), read: false },
        ]
    },
];

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: MOCK_CONVERSATIONS,
    activeConversationId: null,
    isLoading: false,
    error: null,

    loadConversations: async () => {
        set({ isLoading: true, error: null });

        const result = await MessagingAPI.listConversations();

        if (result.error) {
            // Keep mock data if API fails
            set({ isLoading: false });
            return;
        }

        if (result.data) {
            // Transform API response to local format
            const conversations = result.data.map((conv: any) => ({
                id: conv.id,
                otherUser: conv.members?.[0]?.user || mockUsers[0],
                messages: conv.messages?.map((m: any) => ({
                    id: m.id,
                    senderId: m.senderId,
                    text: m.content,
                    timestamp: new Date(m.createdAt),
                    read: true,
                })) || [],
                unreadCount: 0,
            }));
            set({ conversations, isLoading: false });
        }
    },

    loadMessages: async (conversationId) => {
        const result = await MessagingAPI.getMessages(conversationId, { limit: 50 });

        if (result.data) {
            set((state) => ({
                conversations: state.conversations.map((c) =>
                    c.id === conversationId
                        ? {
                            ...c,
                            messages: result.data!.map((m: any) => ({
                                id: m.id,
                                senderId: m.senderId,
                                text: m.content,
                                timestamp: new Date(m.createdAt),
                                read: true,
                            })).reverse(),
                        }
                        : c
                ),
            }));
        }
    },

    sendMessage: async (conversationId, text, senderId) => {
        // Optimistic update
        const tempMessage: ChatMessage = {
            id: `temp_${Date.now()}`,
            senderId,
            text,
            timestamp: new Date(),
            read: true,
        };

        set((state) => ({
            conversations: state.conversations.map((c) =>
                c.id === conversationId
                    ? { ...c, messages: [...c.messages, tempMessage] }
                    : c
            ),
        }));

        // Send to API
        const result = await MessagingAPI.sendMessage(conversationId, text);

        if (result.data) {
            // Replace temp message with real one
            set((state) => ({
                conversations: state.conversations.map((c) =>
                    c.id === conversationId
                        ? {
                            ...c,
                            messages: c.messages.map((m) =>
                                m.id === tempMessage.id
                                    ? { ...m, id: result.data.id }
                                    : m
                            ),
                        }
                        : c
                ),
            }));
        }
    },

    getConversation: (conversationId) => {
        return get().conversations.find((c) => c.id === conversationId);
    },

    markAsRead: (conversationId) => set((state) => ({
        conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
        ),
    })),

    createConversation: (otherUserId) => {
        const state = get();
        const existing = state.conversations.find((c) => c.otherUser.id === otherUserId);
        if (existing) return existing.id;

        const otherUser = mockUsers.find((u) => u.id === otherUserId);
        if (!otherUser) throw new Error('User not found');

        const newId = Date.now().toString();
        const newConv: ChatConversation = {
            id: newId,
            otherUser,
            messages: [],
            unreadCount: 0,
        };

        set({ conversations: [newConv, ...state.conversations] });
        return newId;
    },
}));
