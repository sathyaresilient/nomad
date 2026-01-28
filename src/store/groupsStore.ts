/**
 * Groups Store
 * Manages groups, posts, and membership state with real API
 */

import { create } from 'zustand';
import { mockUsers } from '../data/mockUsers';
import { GroupsAPI } from '../lib/api';
import { Group, GroupMember, GroupPost, PostType } from '../types/groups';

interface GroupsState {
    groups: Group[];
    currentGroupId: string | null;
    posts: Record<string, GroupPost[]>;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadGroups: () => Promise<void>;
    selectGroup: (groupId: string | null) => void;
    createGroup: (group: Omit<Group, 'id' | 'createdAt' | 'memberCount' | 'activeNow' | 'memberPreview'>) => Promise<string | null>;
    joinGroup: (groupId: string) => Promise<void>;
    leaveGroup: (groupId: string) => Promise<void>;
    loadPosts: (groupId: string) => void;
    createPost: (groupId: string, type: PostType, content: string, data?: Partial<GroupPost>) => void;
    addReaction: (groupId: string, postId: string, emoji: string) => void;
    createPollPost: (groupId: string, question: string, options: string[]) => void;
    createEventPost: (groupId: string, title: string, date: Date, location: string, description: string) => void;
    createPinPost: (groupId: string, name: string, address: string, latitude: number, longitude: number, note: string) => void;
    addComment: (groupId: string, postId: string, content: string) => void;

    // Helpers
    getGroup: (groupId: string) => Group | undefined;
    getGroupPosts: (groupId: string) => GroupPost[];
}

const generateId = () => `grp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const currentUser: GroupMember = {
    userId: 'current-user',
    displayName: 'Alex',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    role: 'member',
    joinedAt: new Date(),
    isOnline: true,
};

// Fallback mock data for offline/demo mode
const MOCK_GROUPS: Group[] = [
    {
        id: 'grp-1',
        name: 'Lisbon Dec Crew 🇵🇹',
        type: 'trip',
        emoji: '🎒',
        description: 'Digital nomads exploring Lisbon together this December!',
        destination: 'Lisbon',
        country: 'Portugal',
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-24'),
        privacy: 'request',
        memberCount: 8,
        activeNow: 3,
        unreadCount: 5,
        memberPreview: [
            { userId: '1', displayName: 'Sarah', avatarUrl: mockUsers[0]?.avatarUrl, role: 'admin', joinedAt: new Date() },
        ],
        createdAt: new Date('2024-10-01'),
        createdBy: '1',
        lastActivity: new Date(),
    },
];

export const useGroupsStore = create<GroupsState>((set, get) => ({
    groups: [],
    currentGroupId: null,
    posts: {},
    isLoading: false,
    error: null,

    loadGroups: async () => {
        set({ isLoading: true, error: null });

        const result = await GroupsAPI.list();

        if (result.error) {
            // Fall back to mock data if API fails
            set({ groups: MOCK_GROUPS, isLoading: false });
            return;
        }

        // API returns { data: groups[], pagination: ... }, so extract the inner data array
        const responseData = result.data as any;
        const groups = responseData?.data || responseData || MOCK_GROUPS;
        set({ groups: Array.isArray(groups) ? groups : MOCK_GROUPS, isLoading: false });
    },

    selectGroup: (groupId) => {
        set({ currentGroupId: groupId });
        if (groupId) {
            get().loadPosts(groupId);
            set((state) => ({
                groups: state.groups.map((g) =>
                    g.id === groupId ? { ...g, unreadCount: 0 } : g
                ),
            }));
        }
    },

    createGroup: async (groupData) => {
        set({ isLoading: true, error: null });

        const result = await GroupsAPI.create(groupData);

        if (result.error) {
            set({ isLoading: false, error: result.error });
            return null;
        }

        if (result.data) {
            const newGroup = result.data as Group;
            set((state) => ({
                groups: [newGroup, ...state.groups],
                isLoading: false,
            }));
            return newGroup.id;
        }

        set({ isLoading: false });
        return null;
    },

    joinGroup: async (groupId) => {
        const result = await GroupsAPI.join(groupId);

        if (result.data) {
            set((state) => ({
                groups: state.groups.map((g) =>
                    g.id === groupId
                        ? { ...g, memberCount: g.memberCount + 1 }
                        : g
                ),
            }));
        }
    },

    leaveGroup: async (groupId) => {
        const result = await GroupsAPI.leave(groupId);

        if (result.data) {
            set((state) => ({
                groups: state.groups.map((g) =>
                    g.id === groupId
                        ? { ...g, memberCount: Math.max(0, g.memberCount - 1) }
                        : g
                ),
            }));
        }
    },

    loadPosts: (groupId) => {
        // Posts are loaded from mock for now - can integrate GroupsAPI.getPosts later
        set((state) => ({
            posts: { ...state.posts, [groupId]: state.posts[groupId] || [] },
        }));
    },

    createPost: (groupId, type, content, data = {}) => {
        const newPost: GroupPost = {
            id: `post_${Date.now()}`,
            groupId,
            authorId: 'current-user',
            authorName: 'Alex',
            authorAvatar: 'https://i.pravatar.cc/150?u=alex',
            type,
            content,
            reactions: [],
            commentCount: 0,
            createdAt: new Date(),
            ...data,
        };

        set((state) => ({
            posts: {
                ...state.posts,
                [groupId]: [newPost, ...(state.posts[groupId] || [])],
            },
            groups: state.groups.map((g) =>
                g.id === groupId ? { ...g, lastActivity: new Date() } : g
            ),
        }));
    },

    addReaction: (groupId, postId, emoji) => {
        set((state) => ({
            posts: {
                ...state.posts,
                [groupId]: (state.posts[groupId] || []).map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            reactions: [
                                ...post.reactions.filter((r) => r.userId !== 'current-user'),
                                { userId: 'current-user', emoji, createdAt: new Date() },
                            ],
                        }
                        : post
                ),
            },
        }));
    },

    createPollPost: (groupId: string, question: string, options: string[]) => {
        const pollOptions = options.map((text, index) => ({
            id: `opt_${Date.now()}_${index}`,
            text,
            votes: [],
        }));
        get().createPost(groupId, 'poll', question, { pollOptions });
    },

    createEventPost: (groupId: string, title: string, date: Date, location: string, description: string) => {
        get().createPost(groupId, 'event', description || title, {
            eventDate: date,
            eventLocation: location,
        });
    },

    createPinPost: (groupId: string, name: string, address: string, latitude: number, longitude: number, note: string) => {
        get().createPost(groupId, 'pin', note || `Check out ${name}!`, {
            location: { latitude, longitude, name, address },
        });
    },

    addComment: (groupId: string, postId: string, content: string) => {
        set((state) => ({
            posts: {
                ...state.posts,
                [groupId]: (state.posts[groupId] || []).map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            commentCount: post.commentCount + 1,
                            comments: [
                                ...(post.comments || []),
                                {
                                    id: `comment_${Date.now()}`,
                                    postId,
                                    authorId: 'current-user',
                                    authorName: 'Alex',
                                    authorAvatar: 'https://i.pravatar.cc/150?u=alex',
                                    content,
                                    createdAt: new Date(),
                                },
                            ],
                        }
                        : post
                ),
            },
        }));
    },

    getGroup: (groupId) => get().groups.find((g) => g.id === groupId),
    getGroupPosts: (groupId) => get().posts[groupId] || [],
}));
