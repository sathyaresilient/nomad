/**
 * Chat Screen - Light Theme
 * Conversations with connected travelers
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Layout, Spacing, Typography } from '../../src/design';
import type { Conversation } from '../../src/types';

// Mock conversations for demo
const mockConversations: Conversation[] = [
    {
        id: '1',
        connectionId: 'conn1',
        otherUser: {
            id: '2',
            displayName: 'Maya Chen',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
            bio: 'Product designer exploring Southeast Asia',
            travelStyle: 'backpacker',
            languages: ['English', 'Mandarin'],
            trustLevel: 'rated',
            rating: 4.5,
            tripCount: 8,
            feedbackCount: 6,
            countriesVisited: 15,
            favoriteDestinations: ['Bangkok'],
            joinedAt: new Date(),
            lastActive: new Date(),
        },
        lastMessage: {
            id: 'm1',
            connectionId: 'conn1',
            senderId: '2',
            content: 'Hey! I saw you\'re in Lisbon too. Want to grab coffee tomorrow?',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
        unreadCount: 1,
        tripCity: 'Lisbon',
    },
    {
        id: '2',
        connectionId: 'conn2',
        otherUser: {
            id: '6',
            displayName: 'Sofia Martinez',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
            bio: 'Travel photographer',
            travelStyle: 'explorer',
            languages: ['Spanish', 'English'],
            trustLevel: 'trusted',
            rating: 4.9,
            tripCount: 20,
            feedbackCount: 18,
            countriesVisited: 42,
            favoriteDestinations: ['Patagonia'],
            joinedAt: new Date(),
            lastActive: new Date(),
        },
        lastMessage: {
            id: 'm2',
            connectionId: 'conn2',
            senderId: '1',
            content: 'That sounds amazing! Let me know when works for you.',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        },
        unreadCount: 0,
        tripCity: 'Lisbon',
    },
    {
        id: '3',
        connectionId: 'conn3',
        otherUser: {
            id: '3',
            displayName: 'Marcus Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
            bio: 'Startup founder on sabbatical',
            travelStyle: 'explorer',
            languages: ['English', 'German'],
            trustLevel: 'trusted',
            rating: 4.9,
            tripCount: 15,
            feedbackCount: 14,
            countriesVisited: 31,
            favoriteDestinations: ['Tokyo'],
            joinedAt: new Date(),
            lastActive: new Date(),
        },
        lastMessage: {
            id: 'm3',
            connectionId: 'conn3',
            senderId: '3',
            content: 'The hike was incredible! Thanks for the recommendation.',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        unreadCount: 0,
        tripCity: 'Sintra',
    },
];

export default function ChatScreen() {
    const router = useRouter();

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    const renderConversation = ({ item }: { item: Conversation }) => (
        <TouchableOpacity style={styles.conversationItem} onPress={() => router.push(`/chat/${item.otherUser.id}`)}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: item.otherUser.avatarUrl }}
                    style={styles.avatar}
                />
                {item.unreadCount > 0 && (
                    <View style={styles.onlineIndicator} />
                )}
            </View>

            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>{item.otherUser.displayName}</Text>
                    {item.lastMessage && (
                        <Text style={styles.conversationTime}>
                            {formatTime(item.lastMessage.createdAt)}
                        </Text>
                    )}
                </View>

                <View style={styles.conversationPreview}>
                    <Text
                        style={[
                            styles.conversationMessage,
                            item.unreadCount > 0 && styles.unreadMessage
                        ]}
                        numberOfLines={1}
                    >
                        {item.lastMessage?.content || 'Start a conversation'}
                    </Text>

                    {item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="notifications-outline" size={22} color={Colors.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="search-outline" size={22} color={Colors.text.secondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Conversations List */}
            {mockConversations.length > 0 ? (
                <FlatList
                    data={mockConversations}
                    keyExtractor={item => item.id}
                    renderItem={renderConversation}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="chatbubble-outline" size={48} color={Colors.text.muted} />
                    </View>
                    <Text style={styles.emptyTitle}>No messages yet</Text>
                    <Text style={styles.emptyText}>
                        Connect with travelers in the Discover tab to start chatting!
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Layout.screenPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
    },
    title: {
        ...Typography.h2,
        color: Colors.text.primary,
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingBottom: Spacing['3xl'],
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Layout.screenPadding,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.primary.main,
        borderWidth: 2,
        borderColor: Colors.background.primary,
    },
    conversationContent: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    conversationName: {
        ...Typography.label,
        color: Colors.text.primary,
        fontSize: 16,
    },
    conversationTime: {
        ...Typography.caption,
        color: Colors.text.muted,
    },
    conversationPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    conversationMessage: {
        ...Typography.body,
        color: Colors.text.muted,
        flex: 1,
    },
    unreadMessage: {
        color: Colors.text.primary,
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: Colors.primary.main,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        marginLeft: Spacing.sm,
    },
    unreadCount: {
        ...Typography.caption,
        color: Colors.text.inverse,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Layout.screenPadding,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.background.muted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        ...Typography.h3,
        color: Colors.text.primary,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.text.muted,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
});
