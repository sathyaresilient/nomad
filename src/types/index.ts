/**
 * Nomadly Type Definitions
 * Core domain types for the travel social network
 */

// Travel style tags
export type TravelStyle =
    | 'backpacker'
    | 'digitalNomad'
    | 'explorer'
    | 'social'
    | 'luxury'
    | 'slowTravel';

// Trust levels based on feedback
export type TrustLevel = 'new' | 'rated' | 'trusted';

// Trip status
export type TripStatus =
    | 'planning'     // Future trip
    | 'active'       // Currently on trip
    | 'completed';   // Past trip

// What user is open to
export type OpenTo =
    | 'meetups'      // Just coffee/drinks
    | 'coTravel'     // Travel together
    | 'coLiving';    // Share accommodation

// Connection status
export type ConnectionStatus =
    | 'pending'      // Request sent
    | 'accepted'     // Both connected
    | 'declined';    // Request declined

// User profile (full)
export interface User {
    id: string;
    displayName: string;
    avatarUrl?: string;
    bio: string;
    travelStyle: TravelStyle;
    languages: string[];

    // Reputation
    trustLevel: TrustLevel;
    rating: number;           // 1-5 average
    tripCount: number;        // Completed trips
    feedbackCount: number;    // Received feedback count

    // Travel stats
    countriesVisited: number;
    favoriteDestinations: string[];

    // Metadata
    joinedAt: Date;
    lastActive: Date;
}

// Auth user (subset returned from auth endpoints)
export interface AuthUser {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    trustLevel: TrustLevel;
    bio?: string;
    travelStyle?: TravelStyle;
    languages?: string[];
    rating?: number;
    tripCount?: number;
    countriesVisited?: number;
    emailVerified?: boolean;
    isVerified?: boolean;
    createdAt?: Date;
}

// Trip intent
export interface Trip {
    id: string;
    userId: string;
    user?: User;

    // Location & dates
    city: string;
    country: string;
    startDate: Date;
    endDate: Date;

    // Intent
    status: TripStatus;
    openTo: OpenTo[];
    notes?: string;

    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

// Connection between users
export interface Connection {
    id: string;
    fromUserId: string;
    toUserId: string;

    status: ConnectionStatus;
    icebreaker: string;       // Initial message
    tripId?: string;          // Associated trip

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;         // Auto-expire after trip
}

// Chat message
export interface Message {
    id: string;
    connectionId: string;
    senderId: string;

    content: string;
    read: boolean;

    createdAt: Date;
}

// Conversation (for chat list)
export interface Conversation {
    id: string;
    connectionId: string;
    otherUser: User;
    lastMessage?: Message;
    unreadCount: number;
    tripCity?: string;
}

// Post-trip feedback
export interface Feedback {
    id: string;
    fromUserId: string;
    toUserId: string;
    tripId: string;

    // Ratings (1-5)
    wouldTravelAgain: boolean;
    vibeRating: 'chill' | 'awesome' | 'flaky' | 'pushy';

    // Optional anonymous note
    anonymousNote?: string;

    createdAt: Date;
}

// Match result for discover feed
export interface TravelerMatch {
    user: User;
    trip: Trip;
    overlapDays: number;
    matchScore: number;       // Calculated compatibility
    sharedInterests: string[];
}
