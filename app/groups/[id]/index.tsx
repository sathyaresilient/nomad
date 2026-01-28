/**
 * Group Detail Page
 * View group feed, members, and interact with posts
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GroupMapView } from '../../../src/components/groups/GroupMapView';
import { PostCard } from '../../../src/components/groups/PostCard';
import {
    EventCreator,
    LocationPinCreator,
    PollCreator,
} from '../../../src/components/groups/PostCreatorModals';
import { Colors } from '../../../src/design/colors';
import { useGroupsStore } from '../../../src/store/groupsStore';
import { PostType } from '../../../src/types/groups';

type Tab = 'feed' | 'members' | 'map';

export default function GroupDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<Tab>('feed');
    const [newPostText, setNewPostText] = useState('');
    const [showPostTypes, setShowPostTypes] = useState(false);

    // Modal states
    const [showPollModal, setShowPollModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);

    const { selectGroup, getGroup, getGroupPosts, createPost, addReaction, createPollPost, createEventPost, createPinPost } = useGroupsStore();

    useEffect(() => {
        if (id) {
            selectGroup(id);
        }
    }, [id]);

    const group = id ? getGroup(id) : undefined;
    const posts = id ? getGroupPosts(id) : [];

    if (!group) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Group not found</Text>
            </SafeAreaView>
        );
    }

    const handlePost = (type: PostType = 'update') => {
        if (!newPostText.trim() || !id) return;
        createPost(id, type, newPostText.trim());
        setNewPostText('');
        setShowPostTypes(false);
    };

    const handleReaction = (postId: string, emoji: string) => {
        if (id) {
            addReaction(id, postId, emoji);
        }
    };

    const handlePostTypeSelect = (type: PostType) => {
        setShowPostTypes(false);
        if (type === 'poll') {
            setShowPollModal(true);
        } else if (type === 'event') {
            setShowEventModal(true);
        } else if (type === 'pin') {
            setShowPinModal(true);
        } else {
            // For update/question, just use text input
            handlePost(type);
        }
    };

    const handleSettings = () => {
        Alert.alert(
            group.name,
            'Group Options',
            [
                { text: 'Mute Notifications', onPress: () => Alert.alert('Muted', 'Notifications muted for this group') },
                { text: 'Invite Members', onPress: () => Alert.alert('Invite', 'Share invite link copied!') },
                {
                    text: 'Leave Group', style: 'destructive', onPress: () => {
                        Alert.alert('Leave Group', 'Are you sure?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Leave', style: 'destructive', onPress: () => router.back() }
                        ]);
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleMemberMessage = (memberId: string, memberName: string) => {
        router.push(`/chat/${memberId}`);
    };

    const POST_TYPE_OPTIONS = [
        { type: 'update' as PostType, icon: 'chatbubble', label: 'Update', color: Colors.text.secondary },
        { type: 'poll' as PostType, icon: 'stats-chart', label: 'Poll', color: '#8B5CF6' },
        { type: 'event' as PostType, icon: 'calendar', label: 'Event', color: '#F59E0B' },
        { type: 'pin' as PostType, icon: 'location', label: 'Place', color: '#3B82F6' },
        { type: 'question' as PostType, icon: 'help-circle', label: 'Question', color: '#EC4899' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{group.name}</Text>
                    <Text style={styles.headerSubtitle}>
                        {group.memberCount} members • {group.activeNow} online
                    </Text>
                </View>
                <TouchableOpacity style={styles.settingsBtn} onPress={handleSettings}>
                    <Ionicons name="ellipsis-vertical" size={20} color={Colors.text.secondary} />
                </TouchableOpacity>
            </View>

            {/* Member Avatars */}
            <View style={styles.membersPreview}>
                <View style={styles.avatarsRow}>
                    {group.memberPreview.slice(0, 5).map((member, index) => (
                        <Image
                            key={member.userId}
                            source={{ uri: member.avatarUrl || 'https://i.pravatar.cc/150?u=' + member.userId }}
                            style={[styles.memberAvatar, { marginLeft: index > 0 ? -10 : 0 }]}
                        />
                    ))}
                    {group.memberCount > 5 && (
                        <View style={[styles.memberAvatar, styles.moreMembers, { marginLeft: -10 }]}>
                            <Text style={styles.moreMembersText}>+{group.memberCount - 5}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity onPress={() => setActiveTab('members')}>
                    <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {(['feed', 'members', 'map'] as Tab[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Ionicons
                            name={tab === 'feed' ? 'newspaper' : tab === 'members' ? 'people' : 'map'}
                            size={18}
                            color={activeTab === tab ? Colors.primary.main : Colors.text.muted}
                        />
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {activeTab === 'feed' ? (
                    <>
                        <ScrollView contentContainerStyle={styles.feedContent}>
                            {posts.length === 0 ? (
                                <View style={styles.emptyFeed}>
                                    <Ionicons name="chatbubbles-outline" size={48} color={Colors.text.muted} />
                                    <Text style={styles.emptyTitle}>No posts yet</Text>
                                    <Text style={styles.emptyText}>Be the first to share something!</Text>
                                </View>
                            ) : (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onReact={(emoji) => handleReaction(post.id, emoji)}
                                        onComment={(postId, content) => {
                                            if (id) {
                                                const { addComment } = useGroupsStore.getState();
                                                addComment(id, postId, content);
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </ScrollView>

                        {/* Post Composer */}
                        <View style={styles.composerContainer}>
                            {showPostTypes && (
                                <View style={styles.postTypeRow}>
                                    {POST_TYPE_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.type}
                                            style={styles.postTypeBtn}
                                            onPress={() => handlePostTypeSelect(option.type)}
                                        >
                                            <Ionicons name={option.icon as any} size={20} color={option.color} />
                                            <Text style={styles.postTypeLabel}>{option.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <View style={styles.composer}>
                                <TouchableOpacity
                                    style={styles.postTypeToggle}
                                    onPress={() => setShowPostTypes(!showPostTypes)}
                                >
                                    <Ionicons
                                        name={showPostTypes ? 'close' : 'add'}
                                        size={22}
                                        color={Colors.primary.main}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.composerInput}
                                    placeholder="Write something..."
                                    placeholderTextColor={Colors.text.muted}
                                    value={newPostText}
                                    onChangeText={setNewPostText}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={[styles.sendBtn, !newPostText.trim() && styles.sendBtnDisabled]}
                                    onPress={() => handlePost()}
                                    disabled={!newPostText.trim()}
                                >
                                    <Ionicons name="send" size={18} color={newPostText.trim() ? '#FFF' : Colors.text.muted} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                ) : activeTab === 'members' ? (
                    <ScrollView contentContainerStyle={styles.membersContent}>
                        <Text style={styles.sectionLabel}>ADMINS</Text>
                        {group.memberPreview
                            .filter((m) => m.role === 'admin')
                            .map((member) => (
                                <View key={member.userId} style={styles.memberRow}>
                                    <Image
                                        source={{ uri: member.avatarUrl || 'https://i.pravatar.cc/150?u=' + member.userId }}
                                        style={styles.memberRowAvatar}
                                    />
                                    <View style={styles.memberRowInfo}>
                                        <Text style={styles.memberRowName}>{member.displayName}</Text>
                                        <Text style={styles.memberRowRole}>Admin</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.memberAction}
                                        onPress={() => handleMemberMessage(member.userId, member.displayName)}
                                    >
                                        <Ionicons name="chatbubble-outline" size={18} color={Colors.primary.main} />
                                    </TouchableOpacity>
                                </View>
                            ))}

                        <Text style={styles.sectionLabel}>MEMBERS ({group.memberCount})</Text>
                        {group.memberPreview
                            .filter((m) => m.role !== 'admin')
                            .map((member) => (
                                <View key={member.userId} style={styles.memberRow}>
                                    <Image
                                        source={{ uri: member.avatarUrl || 'https://i.pravatar.cc/150?u=' + member.userId }}
                                        style={styles.memberRowAvatar}
                                    />
                                    <View style={styles.memberRowInfo}>
                                        <Text style={styles.memberRowName}>{member.displayName}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.memberAction}
                                        onPress={() => handleMemberMessage(member.userId, member.displayName)}
                                    >
                                        <Ionicons name="chatbubble-outline" size={18} color={Colors.primary.main} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                    </ScrollView>
                ) : (
                    <GroupMapView posts={posts} groupName={group.name} />
                )}
            </KeyboardAvoidingView>

            {/* Modals */}
            <PollCreator
                visible={showPollModal}
                onClose={() => setShowPollModal(false)}
                onSubmit={(question, options) => {
                    if (id) createPollPost(id, question, options);
                }}
            />
            <EventCreator
                visible={showEventModal}
                onClose={() => setShowEventModal(false)}
                onSubmit={(title, date, location, description) => {
                    if (id) createEventPost(id, title, date, location, description);
                }}
            />
            <LocationPinCreator
                visible={showPinModal}
                onClose={() => setShowPinModal(false)}
                onSubmit={(name, address, lat, lng, note) => {
                    if (id) createPinPost(id, name, address, lat, lng, note);
                }}
            />
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
    headerInfo: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    settingsBtn: {
        padding: 8,
    },
    membersPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    avatarsRow: {
        flexDirection: 'row',
    },
    memberAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    moreMembers: {
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreMembersText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.text.secondary,
    },
    viewAllText: {
        fontSize: 13,
        color: Colors.primary.main,
        fontWeight: '600',
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
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
    },
    activeTab: {
        backgroundColor: '#F0FDFA',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.muted,
    },
    activeTabText: {
        color: Colors.primary.main,
    },
    feedContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyFeed: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginTop: 12,
    },
    emptyText: {
        fontSize: 13,
        color: Colors.text.muted,
        marginTop: 4,
    },
    composerContainer: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    postTypeRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    postTypeBtn: {
        alignItems: 'center',
        gap: 4,
    },
    postTypeLabel: {
        fontSize: 10,
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    composer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    postTypeToggle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    composerInput: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 100,
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#F1F5F9',
    },
    membersContent: {
        padding: 16,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.text.muted,
        marginBottom: 8,
        marginTop: 16,
        letterSpacing: 0.5,
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    memberRowAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    memberRowInfo: {
        flex: 1,
    },
    memberRowName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    memberRowRole: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    memberAction: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
