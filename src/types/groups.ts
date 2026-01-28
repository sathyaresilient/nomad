/**
 * Groups Type Definitions
 * Types for travel groups, posts, and members
 */

// Group types
export type GroupType = 'trip' | 'city' | 'interest' | 'private';
export type GroupPrivacy = 'public' | 'request' | 'invite';
export type PostType = 'update' | 'poll' | 'pin' | 'event' | 'split' | 'question';

// Poll option for poll posts
export interface PollOption {
    id: string;
    text: string;
    votes: string[]; // User IDs who voted
}

// Location for pin posts
export interface PinLocation {
    latitude: number;
    longitude: number;
    name: string;
    address?: string;
}

// Reaction on posts
export interface Reaction {
    userId: string;
    emoji: string; // 👍 ❤️ 🔥 😂 🎉
    createdAt: Date;
}

// Comment on posts
export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: Date;
}

// Group member
export interface GroupMember {
    userId: string;
    displayName: string;
    avatarUrl?: string;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: Date;
    isOnline?: boolean;
}

// Main Group type
export interface Group {
    id: string;
    name: string;
    type: GroupType;
    coverImage?: string;
    emoji?: string; // 🎒 🏙️ 🎯 🔒
    description: string;

    // Trip-specific
    destination?: string;
    country?: string;
    startDate?: Date;
    endDate?: Date;

    // Settings
    privacy: GroupPrivacy;

    // Stats
    memberCount: number;
    activeNow: number;
    unreadCount?: number;

    // Members (preview - first few)
    memberPreview: GroupMember[];

    // Metadata
    createdAt: Date;
    createdBy: string;
    lastActivity?: Date;
}

// Group Post
export interface GroupPost {
    id: string;
    groupId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;

    type: PostType;
    content: string;
    media?: string[]; // Image URLs

    // Type-specific data
    pollOptions?: PollOption[];
    location?: PinLocation;
    eventDate?: Date;
    eventLocation?: string;
    splitAmount?: number;
    splitCurrency?: string;

    // Engagement
    reactions: Reaction[];
    commentCount: number;
    comments?: Comment[];

    // Metadata
    createdAt: Date;
    updatedAt?: Date;
    isPinned?: boolean;
}

// Group invite/request
export interface GroupInvite {
    id: string;
    groupId: string;
    groupName: string;
    inviterId: string;
    inviterName: string;
    inviteeId: string;
    message?: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Date;
}

// Join request (for request-to-join groups)
export interface JoinRequest {
    id: string;
    groupId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    message?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}
