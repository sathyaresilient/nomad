/**
 * Community Store
 * Manages events and threads with real API
 */

import { create } from 'zustand';
import { currentUser, mockUsers } from '../data/mockUsers';
import { EventsAPI, ThreadsAPI } from '../lib/api';
import { User } from '../types';

export interface Reply {
    id: string;
    author: User;
    content: string;
    timestamp: Date;
}

export interface Thread {
    id: string;
    title: string;
    content: string;
    author: User;
    category: string;
    likes: number;
    replies: Reply[];
    createdAt: Date;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    category: string;
    host: User;
    attendees: User[];
    spotsTotal: number;
    createdAt: Date;
}

interface CommunityState {
    threads: Thread[];
    events: Event[];
    pendingJoinRequests: string[];
    selectedThreadId: string | null;
    selectedEventId: string | null;
    categories: string[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadEvents: (location?: string) => Promise<void>;
    loadThreads: (category?: string) => Promise<void>;
    createThread: (title: string, content: string, category: string, author: User) => Promise<boolean>;
    likeThread: (id: string) => Promise<void>;
    selectThread: (id: string | null) => void;
    selectEvent: (id: string | null) => void;
    joinEvent: (eventId: string) => Promise<boolean>;
    requestToJoinEvent: (eventId: string) => Promise<boolean>;
    hasPendingRequest: (eventId: string) => boolean;
}

// Fallback mock data
const MOCK_THREADS: Thread[] = [
    {
        id: 't1',
        title: 'Best coworking space in Lisbon?',
        content: 'Looking for a place with good wifi and ergonomic chairs. Any recommendations?',
        author: mockUsers[1] as User,
        category: 'Coworking',
        likes: 12,
        replies: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
];

const MOCK_EVENTS: Event[] = [
    {
        id: 'cowork-dojo-1',
        title: 'Coworking deep work sesh at Dojo 💻',
        description: 'Join us for a focused coworking session.',
        imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800',
        location: 'Canggu',
        category: 'Coworking',
        host: mockUsers[0] as User,
        attendees: [mockUsers[3], mockUsers[2]] as User[],
        spotsTotal: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
    },
];

export const useCommunityStore = create<CommunityState>((set, get) => ({
    threads: MOCK_THREADS,
    events: MOCK_EVENTS,
    pendingJoinRequests: [],
    selectedThreadId: null,
    selectedEventId: null,
    categories: ['All', 'Events', 'General', 'Coworking', 'Visas', 'Housing', 'Meetups', 'Food'],
    isLoading: false,
    error: null,

    loadEvents: async (location) => {
        set({ isLoading: true });

        const result = await EventsAPI.list({ location });

        // API returns { data: events[], pagination: ... }
        const responseData = result.data as any;
        const events = responseData?.data || responseData;
        if (Array.isArray(events) && events.length) {
            set({ events: events as Event[], isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    loadThreads: async (category) => {
        set({ isLoading: true });

        const result = await ThreadsAPI.list({ category });

        // API returns { data: threads[], pagination: ... }
        const responseData = result.data as any;
        const threads = responseData?.data || responseData;
        if (Array.isArray(threads) && threads.length) {
            set({ threads: threads as Thread[], isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    createThread: async (title, content, category, author) => {
        const result = await ThreadsAPI.create({ title, content, category });

        if (result.data) {
            set((state) => ({
                threads: [{
                    ...result.data,
                    author,
                    likes: 0,
                    replies: [],
                    createdAt: new Date(),
                } as Thread, ...state.threads]
            }));
            return true;
        }
        return false;
    },

    likeThread: async (id) => {
        await ThreadsAPI.like(id);
        set((state) => ({
            threads: state.threads.map(t =>
                t.id === id ? { ...t, likes: t.likes + 1 } : t
            )
        }));
    },

    selectThread: (id) => set({ selectedThreadId: id }),

    selectEvent: (id) => set({ selectedEventId: id }),

    joinEvent: async (eventId) => {
        const result = await EventsAPI.join(eventId);

        if (!result.error) {
            set((state) => ({
                events: state.events.map(e =>
                    e.id === eventId && !e.attendees.find(a => a.id === currentUser.id)
                        ? { ...e, attendees: [...e.attendees, currentUser as User] }
                        : e
                ),
                pendingJoinRequests: state.pendingJoinRequests.filter(id => id !== eventId),
            }));
            return true;
        }
        return false;
    },

    requestToJoinEvent: async (eventId) => {
        const result = await EventsAPI.requestJoin(eventId);

        if (!result.error) {
            set((state) => ({
                pendingJoinRequests: state.pendingJoinRequests.includes(eventId)
                    ? state.pendingJoinRequests
                    : [...state.pendingJoinRequests, eventId]
            }));
            return true;
        }
        return false;
    },

    hasPendingRequest: (eventId) => get().pendingJoinRequests.includes(eventId),
}));
