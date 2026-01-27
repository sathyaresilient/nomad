/**
 * WebSocket Handler
 * Real-time messaging infrastructure
 */

import { FastifyInstance, FastifyRequest } from 'fastify';
import { v4 as uuid } from 'uuid';
import { WebSocket } from 'ws';
import { prisma } from '../lib/prisma';
import { cache, redis } from '../lib/redis';

// Types
interface WebSocketClient {
    socket: WebSocket;
    userId: string;
    connectionId: string;
    subscribedChannels: Set<string>;
}

interface ChatMessage {
    type: 'message' | 'typing' | 'read' | 'presence';
    conversationId?: string;
    content?: string;
    messageType?: string;
    metadata?: Record<string, unknown>;
}

interface ServerMessage {
    type: 'message' | 'typing' | 'read' | 'presence' | 'error' | 'ack';
    data?: unknown;
    error?: string;
    timestamp: string;
}

// Connection store
const connections = new Map<string, WebSocketClient>();
const userConnections = new Map<string, Set<string>>(); // userId -> connectionIds

// Redis pub/sub channels
const CHAT_CHANNEL = 'nomadly:chat';
const PRESENCE_CHANNEL = 'nomadly:presence';

export async function setupWebSocket(fastify: FastifyInstance): Promise<void> {
    // Subscribe to Redis pub/sub for cross-instance messaging
    const subscriber = redis.duplicate();

    await subscriber.subscribe(CHAT_CHANNEL, PRESENCE_CHANNEL);

    subscriber.on('message', (channel: string, message: string) => {
        try {
            const parsed = JSON.parse(message);
            handlePubSubMessage(channel, parsed);
        } catch (error) {
            fastify.log.error({ err: error }, 'Failed to parse pub/sub message');
        }
    });

    // WebSocket connection handler
    fastify.get('/ws', { websocket: true }, async (connection, request: FastifyRequest) => {
        const socket = connection.socket as unknown as WebSocket;
        const connectionId = uuid();
        let userId: string | null = null;

        // Authenticate connection
        try {
            const token = extractToken(request);
            if (!token) {
                sendError(socket, 'Authentication required');
                socket.close(4001, 'Unauthorized');
                return;
            }

            const payload = await fastify.jwt.verify<{ userId: string }>(token);
            userId = payload.userId;

            // Register connection
            const client: WebSocketClient = {
                socket,
                userId,
                connectionId,
                subscribedChannels: new Set(),
            };

            connections.set(connectionId, client);

            if (!userConnections.has(userId)) {
                userConnections.set(userId, new Set());
            }
            userConnections.get(userId)!.add(connectionId);

            // Update presence
            await updatePresence(userId, 'online');
            await broadcastPresence(userId, 'online');

            // Send connection acknowledgment
            send(socket, { type: 'ack', data: { connectionId }, timestamp: new Date().toISOString() });

            fastify.log.info({ userId, connectionId }, 'WebSocket connected');
        } catch (error) {
            sendError(socket, 'Invalid token');
            socket.close(4001, 'Unauthorized');
            return;
        }

        // Message handler
        socket.on('message', async (data: Buffer) => {
            try {
                const message = JSON.parse(data.toString()) as ChatMessage;
                if (userId) {
                    await handleClientMessage(fastify, connectionId, userId, message);
                }
            } catch (error) {
                fastify.log.error({ err: error }, 'WebSocket message error');
                sendError(socket, 'Invalid message format');
            }
        });

        // Ping/pong for connection health
        socket.on('pong', () => {
            // Connection is alive
        });

        // Disconnect handler
        socket.on('close', async () => {
            connections.delete(connectionId);

            if (userId) {
                const userConns = userConnections.get(userId);
                if (userConns) {
                    userConns.delete(connectionId);

                    if (userConns.size === 0) {
                        userConnections.delete(userId);
                        await updatePresence(userId, 'offline');
                        await broadcastPresence(userId, 'offline');
                    }
                }
            }

            fastify.log.info({ userId, connectionId }, 'WebSocket disconnected');
        });

        socket.on('error', (error: Error) => {
            fastify.log.error({ err: error }, 'WebSocket error');
        });
    });

    // Heartbeat interval to detect dead connections
    const heartbeatInterval = setInterval(() => {
        connections.forEach((client, connectionId) => {
            if (client.socket.readyState === WebSocket.OPEN) {
                client.socket.ping();
            } else {
                connections.delete(connectionId);
            }
        });
    }, 30000);

    // Cleanup on shutdown
    fastify.addHook('onClose', async () => {
        clearInterval(heartbeatInterval);
        await subscriber.unsubscribe();
        await subscriber.quit();

        connections.forEach((client) => {
            client.socket.close(1001, 'Server shutting down');
        });
        connections.clear();
    });
}

/**
 * Handle incoming client message
 */
async function handleClientMessage(
    fastify: FastifyInstance,
    connectionId: string,
    userId: string,
    message: ChatMessage
): Promise<void> {
    const client = connections.get(connectionId);
    if (!client) return;

    switch (message.type) {
        case 'message':
            await handleChatMessage(userId, message);
            break;

        case 'typing':
            await handleTypingIndicator(userId, message);
            break;

        case 'read':
            await handleReadReceipt(userId, message);
            break;

        default:
            sendError(client.socket, 'Unknown message type');
    }
}

/**
 * Handle chat message
 */
async function handleChatMessage(
    userId: string,
    message: ChatMessage
): Promise<void> {
    if (!message.conversationId || !message.content) {
        return;
    }

    // Verify user is member of conversation
    const membership = await prisma.conversationMember.findUnique({
        where: {
            conversationId_userId: {
                conversationId: message.conversationId,
                userId,
            },
        },
    });

    if (!membership) {
        return;
    }

    // Save message to database
    const savedMessage = await prisma.message.create({
        data: {
            conversationId: message.conversationId,
            senderId: userId,
            content: message.content,
            messageType: message.messageType || 'text',
            metadata: message.metadata ? JSON.parse(JSON.stringify(message.metadata)) : {},
        },
        include: {
            sender: {
                select: {
                    id: true,
                    displayName: true,
                    avatarUrl: true,
                },
            },
        },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
        where: { id: message.conversationId },
        data: { updatedAt: new Date() },
    });

    // Broadcast to all conversation members
    const members = await prisma.conversationMember.findMany({
        where: { conversationId: message.conversationId },
        select: { userId: true },
    });

    const payload = {
        type: 'message' as const,
        data: {
            conversationId: message.conversationId,
            message: savedMessage,
        },
        recipientIds: members.map((m) => m.userId),
    };

    // Publish to Redis for cross-instance delivery
    await redis.publish(CHAT_CHANNEL, JSON.stringify(payload));
}

/**
 * Handle typing indicator
 */
async function handleTypingIndicator(
    userId: string,
    message: ChatMessage
): Promise<void> {
    if (!message.conversationId) return;

    // Get conversation members
    const members = await prisma.conversationMember.findMany({
        where: { conversationId: message.conversationId },
        select: { userId: true },
    });

    const payload = {
        type: 'typing' as const,
        data: {
            conversationId: message.conversationId,
            userId,
            isTyping: true,
        },
        recipientIds: members.filter((m) => m.userId !== userId).map((m) => m.userId),
    };

    await redis.publish(CHAT_CHANNEL, JSON.stringify(payload));
}

/**
 * Handle read receipt
 */
async function handleReadReceipt(
    userId: string,
    message: ChatMessage
): Promise<void> {
    if (!message.conversationId) return;

    // Update last read timestamp
    await prisma.conversationMember.update({
        where: {
            conversationId_userId: {
                conversationId: message.conversationId,
                userId,
            },
        },
        data: { lastReadAt: new Date() },
    });

    // Get conversation members
    const members = await prisma.conversationMember.findMany({
        where: { conversationId: message.conversationId },
        select: { userId: true },
    });

    const payload = {
        type: 'read' as const,
        data: {
            conversationId: message.conversationId,
            userId,
            readAt: new Date().toISOString(),
        },
        recipientIds: members.filter((m) => m.userId !== userId).map((m) => m.userId),
    };

    await redis.publish(CHAT_CHANNEL, JSON.stringify(payload));
}

/**
 * Handle Redis pub/sub message
 */
function handlePubSubMessage(_channel: string, message: { recipientIds?: string[]; type: string; data: unknown }): void {
    const recipientIds = message.recipientIds || [];

    recipientIds.forEach((userId) => {
        const userConns = userConnections.get(userId);
        if (userConns) {
            userConns.forEach((connectionId) => {
                const client = connections.get(connectionId);
                if (client && client.socket.readyState === WebSocket.OPEN) {
                    send(client.socket, {
                        type: message.type as ServerMessage['type'],
                        data: message.data,
                        timestamp: new Date().toISOString(),
                    });
                }
            });
        }
    });
}

/**
 * Update user presence in cache
 */
async function updatePresence(userId: string, status: 'online' | 'offline'): Promise<void> {
    const key = `presence:${userId}`;

    if (status === 'online') {
        await cache.set(key, { status, lastSeen: new Date().toISOString() }, 300);
    } else {
        await cache.set(key, { status, lastSeen: new Date().toISOString() }, 86400);
    }
}

/**
 * Broadcast presence change to user's connections
 */
async function broadcastPresence(userId: string, status: 'online' | 'offline'): Promise<void> {
    // Get user's friends
    const friends = await prisma.connection.findMany({
        where: {
            OR: [{ fromUserId: userId }, { toUserId: userId }],
            status: 'accepted',
        },
    });

    const friendIds = friends.map((f) =>
        f.fromUserId === userId ? f.toUserId : f.fromUserId
    );

    const payload = {
        type: 'presence' as const,
        data: {
            userId,
            status,
            lastSeen: new Date().toISOString(),
        },
        recipientIds: friendIds,
    };

    await redis.publish(PRESENCE_CHANNEL, JSON.stringify(payload));
}

/**
 * Extract token from request
 */
function extractToken(request: FastifyRequest): string | null {
    // Check query parameter (for WebSocket connections)
    const queryToken = (request.query as Record<string, string>)?.token;
    if (queryToken) return queryToken;

    // Check Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    return null;
}

/**
 * Send message to WebSocket client
 */
function send(socket: WebSocket, message: ServerMessage): void {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
}

/**
 * Send error to WebSocket client
 */
function sendError(socket: WebSocket, error: string): void {
    send(socket, { type: 'error', error, timestamp: new Date().toISOString() });
}

/**
 * Get online status for users
 */
export async function getOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};

    await Promise.all(
        userIds.map(async (userId) => {
            const presence = await cache.get<{ status: string }>(`presence:${userId}`);
            result[userId] = presence?.status === 'online';
        })
    );

    return result;
}
