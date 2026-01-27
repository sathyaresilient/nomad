/**
 * Shared Types
 * Common TypeScript types used across backend services
 */

// =====================================================
// USER TYPES
// =====================================================

export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    travelStyle?: TravelStyle;
    languages: string[];
    trustLevel: TrustLevel;
    rating: number;
    tripCount: number;
    feedbackCount: number;
    countriesVisited: number;
    favoriteDestinations: string[];
    isVerified: boolean;
    createdAt: Date;
    lastActiveAt: Date;
}

export type TravelStyle =
    | 'backpacker'
    | 'digitalNomad'
    | 'explorer'
    | 'social'
    | 'luxury'
    | 'slowTravel';

export type TrustLevel = 'new' | 'rated' | 'trusted';

// =====================================================
// TRIP TYPES
// =====================================================

export interface Trip {
    id: string;
    userId: string;
    city: string;
    country: string;
    startDate: Date;
    endDate: Date;
    status: TripStatus;
    openTo: OpenTo[];
    notes?: string;
    visibility: Visibility;
    createdAt: Date;
    updatedAt: Date;
}

export type TripStatus = 'planning' | 'active' | 'completed';
export type OpenTo = 'meetups' | 'coTravel' | 'coLiving';
export type Visibility = 'public' | 'friends' | 'private';

export interface TravelerMatch {
    user: User;
    trip: Trip;
    overlapDays: number;
    matchScore: number;
}

// =====================================================
// GROUP TYPES
// =====================================================

export interface Group {
    id: string;
    name: string;
    type: GroupType;
    emoji?: string;
    description?: string;
    coverImageUrl?: string;
    destination?: string;
    country?: string;
    startDate?: Date;
    endDate?: Date;
    privacy: GroupPrivacy;
    memberCount: number;
    postCount: number;
    isVerified: boolean;
    createdBy: string;
    createdAt: Date;
}

export type GroupType = 'trip' | 'city' | 'interest' | 'private';
export type GroupPrivacy = 'public' | 'request' | 'invite';

export interface GroupMember {
    id: string;
    groupId: string;
    userId: string;
    role: MemberRole;
    joinedAt: Date;
    muted: boolean;
    user?: User;
}

export type MemberRole = 'admin' | 'moderator' | 'member';

// =====================================================
// POST TYPES
// =====================================================

export interface Post {
    id: string;
    groupId: string;
    authorId: string;
    type: PostType;
    content?: string;
    mediaUrls: string[];
    metadata: PostMetadata;
    reactionCount: number;
    commentCount: number;
    isPinned: boolean;
    createdAt: Date;
    author?: User;
}

export type PostType = 'update' | 'poll' | 'pin' | 'event' | 'split' | 'question';

export interface PostMetadata {
    // Poll
    options?: PollOption[];
    // Event
    eventDate?: string;
    eventLocation?: string;
    // Pin
    latitude?: number;
    longitude?: number;
    placeName?: string;
    placeAddress?: string;
    // Split
    splitAmount?: number;
    splitCurrency?: string;
}

export interface PollOption {
    id: string;
    text: string;
    votes: string[];
}

export interface Reaction {
    id: string;
    postId: string;
    userId: string;
    emoji: string;
    createdAt: Date;
}

export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
    likeCount: number;
    replyCount: number;
    createdAt: Date;
    author?: User;
}

// =====================================================
// CHAT TYPES
// =====================================================

export interface Conversation {
    id: string;
    type: 'direct' | 'group';
    groupId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ConversationWithDetails extends Conversation {
    otherUsers: User[];
    lastMessage?: Message;
    unreadCount: number;
    muted: boolean;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content?: string;
    messageType: MessageType;
    mediaUrls: string[];
    metadata: Record<string, unknown>;
    createdAt: Date;
    sender?: User;
}

export type MessageType = 'text' | 'image' | 'voice' | 'location';

// =====================================================
// API TYPES
// =====================================================

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

export interface ApiError {
    statusCode: number;
    error: string;
    message: string;
    details?: unknown;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
