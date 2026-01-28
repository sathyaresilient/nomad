/**
 * Friends Hub
 * View friends list and manage friend requests
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { mockUsers } from '../../src/data/mockUsers';
import { Colors } from '../../src/design/colors';
import { useFriendsStore } from '../../src/store/friendsStore';

type Tab = 'friends' | 'requests';

export default function FriendsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('friends');

    const {
        friends,
        sentRequests,
        receivedRequests,
        acceptRequest,
        declineRequest,
        cancelRequest,
        removeFriend,
    } = useFriendsStore();

    const handleRemoveFriend = (userId: string, name: string) => {
        Alert.alert(
            'Remove Friend',
            `Are you sure you want to remove ${name} from your friends?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeFriend(userId),
                },
            ]
        );
    };

    const getUserInfo = (userId: string) => {
        return mockUsers.find((u) => u.id === userId) || {
            displayName: 'Unknown User',
            avatarUrl: 'https://i.pravatar.cc/150?u=' + userId,
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Friends</Text>
                <TouchableOpacity onPress={() => router.push('/discover')}>
                    <Ionicons name="person-add-outline" size={24} color={Colors.primary.main} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
                    onPress={() => setActiveTab('friends')}
                >
                    <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
                        Friends ({friends.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
                    onPress={() => setActiveTab('requests')}
                >
                    <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
                        Requests ({receivedRequests.length + sentRequests.length})
                    </Text>
                    {receivedRequests.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{receivedRequests.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'friends' ? (
                    <>
                        {friends.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyTitle}>No friends yet</Text>
                                <Text style={styles.emptyText}>
                                    Discover travelers and send connection requests
                                </Text>
                                <TouchableOpacity
                                    style={styles.discoverBtn}
                                    onPress={() => router.push('/discover')}
                                >
                                    <Text style={styles.discoverBtnText}>Find Travelers</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            friends.map((friend) => (
                                <View key={friend.userId} style={styles.friendCard}>
                                    <TouchableOpacity
                                        style={styles.friendInfo}
                                        onPress={() => router.push(`/profile/${friend.userId}`)}
                                    >
                                        <Image
                                            source={{ uri: friend.avatarUrl || 'https://i.pravatar.cc/150?u=' + friend.userId }}
                                            style={styles.avatar}
                                        />
                                        <View>
                                            <Text style={styles.friendName}>{friend.displayName}</Text>
                                            <Text style={styles.connectedDate}>
                                                Connected {new Date(friend.connectedAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.friendActions}>
                                        <TouchableOpacity
                                            style={styles.chatBtn}
                                            onPress={() => router.push(`/chat/${friend.userId}`)}
                                        >
                                            <Ionicons name="chatbubble-outline" size={18} color={Colors.primary.main} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.moreBtn}
                                            onPress={() => handleRemoveFriend(friend.userId, friend.displayName)}
                                        >
                                            <Ionicons name="ellipsis-horizontal" size={18} color={Colors.text.muted} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </>
                ) : (
                    <>
                        {/* Received Requests */}
                        {receivedRequests.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Incoming Requests</Text>
                                {receivedRequests.map((request) => {
                                    const user = getUserInfo(request.fromUserId);
                                    return (
                                        <View key={request.id} style={styles.requestCard}>
                                            <Image
                                                source={{ uri: user.avatarUrl }}
                                                style={styles.avatar}
                                            />
                                            <View style={styles.requestInfo}>
                                                <Text style={styles.friendName}>{user.displayName}</Text>
                                                {request.message && (
                                                    <Text style={styles.requestMessage} numberOfLines={2}>
                                                        "{request.message}"
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={styles.requestActions}>
                                                <TouchableOpacity
                                                    style={styles.acceptBtn}
                                                    onPress={() => acceptRequest(request.id)}
                                                >
                                                    <Ionicons name="checkmark" size={18} color="#FFF" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.declineBtn}
                                                    onPress={() => declineRequest(request.id)}
                                                >
                                                    <Ionicons name="close" size={18} color={Colors.text.muted} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* Sent Requests */}
                        {sentRequests.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Sent Requests</Text>
                                {sentRequests.map((request) => {
                                    const user = getUserInfo(request.toUserId);
                                    return (
                                        <View key={request.id} style={styles.requestCard}>
                                            <Image
                                                source={{ uri: user.avatarUrl }}
                                                style={styles.avatar}
                                            />
                                            <View style={styles.requestInfo}>
                                                <Text style={styles.friendName}>{user.displayName}</Text>
                                                <Text style={styles.pendingText}>Pending...</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.cancelBtn}
                                                onPress={() => cancelRequest(request.id)}
                                            >
                                                <Text style={styles.cancelBtnText}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {receivedRequests.length === 0 && sentRequests.length === 0 && (
                            <View style={styles.emptyState}>
                                <Ionicons name="mail-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyTitle}>No pending requests</Text>
                                <Text style={styles.emptyText}>
                                    Send connection requests to travelers you'd like to meet
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        gap: 6,
    },
    activeTab: {
        backgroundColor: Colors.primary.main,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    activeTabText: {
        color: '#FFF',
    },
    badge: {
        backgroundColor: '#EF4444',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFF',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    friendCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E2E8F0',
    },
    friendName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    connectedDate: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    friendActions: {
        flexDirection: 'row',
        gap: 8,
    },
    chatBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    requestInfo: {
        flex: 1,
        marginLeft: 12,
    },
    requestMessage: {
        fontSize: 12,
        color: Colors.text.secondary,
        fontStyle: 'italic',
        marginTop: 2,
    },
    pendingText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    requestActions: {
        flexDirection: 'row',
        gap: 8,
    },
    acceptBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
    },
    cancelBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EF4444',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.text.muted,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
    discoverBtn: {
        marginTop: 20,
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    discoverBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
});
