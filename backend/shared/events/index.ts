/**
 * CloudEvents Schema Definitions
 * Standard event types for async messaging between services
 */

// Base CloudEvents envelope
export interface CloudEvent<T = unknown> {
    specversion: '1.0';
    type: string;
    source: string;
    id: string;
    time: string;
    datacontenttype?: string;
    data: T;
}

// =============================================================
// User Events
// =============================================================

export interface UserCreatedData {
    userId: string;
    email: string;
    displayName: string;
    authProvider: string;
}

export interface UserVerifiedData {
    userId: string;
    verificationType: 'email' | 'phone' | 'identity';
}

export interface UserUpdatedData {
    userId: string;
    updatedFields: string[];
}

export interface UserDeletedData {
    userId: string;
    deletedAt: string;
}

export type UserCreatedEvent = CloudEvent<UserCreatedData>;
export type UserVerifiedEvent = CloudEvent<UserVerifiedData>;
export type UserUpdatedEvent = CloudEvent<UserUpdatedData>;
export type UserDeletedEvent = CloudEvent<UserDeletedData>;

// =============================================================
// Trip Events
// =============================================================

export interface TripCreatedData {
    tripId: string;
    userId: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string;
}

export interface TripUpdatedData {
    tripId: string;
    userId: string;
    updatedFields: string[];
}

export interface TripMatchFoundData {
    tripId: string;
    userId: string;
    matchedUserId: string;
    matchScore: number;
    overlapDays: number;
}

export type TripCreatedEvent = CloudEvent<TripCreatedData>;
export type TripUpdatedEvent = CloudEvent<TripUpdatedData>;
export type TripMatchFoundEvent = CloudEvent<TripMatchFoundData>;

// =============================================================
// Group Events
// =============================================================

export interface GroupCreatedData {
    groupId: string;
    createdBy: string;
    name: string;
    type: string;
}

export interface GroupJoinedData {
    groupId: string;
    userId: string;
    role: string;
}

export interface GroupLeftData {
    groupId: string;
    userId: string;
}

export type GroupCreatedEvent = CloudEvent<GroupCreatedData>;
export type GroupJoinedEvent = CloudEvent<GroupJoinedData>;
export type GroupLeftEvent = CloudEvent<GroupLeftData>;

// =============================================================
// Message Events
// =============================================================

export interface MessageSentData {
    messageId: string;
    conversationId: string;
    senderId: string;
    recipientIds: string[];
    messageType: string;
}

export interface MessageReadData {
    conversationId: string;
    userId: string;
    lastReadMessageId: string;
}

export type MessageSentEvent = CloudEvent<MessageSentData>;
export type MessageReadEvent = CloudEvent<MessageReadData>;

// =============================================================
// Event Type Constants
// =============================================================

export const EventTypes = {
    // User
    USER_CREATED: 'nomadly.user.created',
    USER_VERIFIED: 'nomadly.user.verified',
    USER_UPDATED: 'nomadly.user.updated',
    USER_DELETED: 'nomadly.user.deleted',

    // Trip
    TRIP_CREATED: 'nomadly.trip.created',
    TRIP_UPDATED: 'nomadly.trip.updated',
    TRIP_MATCH_FOUND: 'nomadly.trip.match_found',

    // Group
    GROUP_CREATED: 'nomadly.group.created',
    GROUP_JOINED: 'nomadly.group.joined',
    GROUP_LEFT: 'nomadly.group.left',

    // Message
    MESSAGE_SENT: 'nomadly.message.sent',
    MESSAGE_READ: 'nomadly.message.read',
} as const;

// =============================================================
// Helper Functions
// =============================================================

export function createEvent<T>(
    type: string,
    source: string,
    data: T
): CloudEvent<T> {
    return {
        specversion: '1.0',
        type,
        source,
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        datacontenttype: 'application/json',
        data,
    };
}
