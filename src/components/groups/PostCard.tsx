/**
 * PostCard Component
 * Displays a post in the group feed
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { GroupPost } from '../../types/groups';
import { CommentsModal } from './CommentsModal';

interface PostCardProps {
    post: GroupPost;
    onReact?: (emoji: string) => void;
    onVote?: (postId: string, optionId: string) => void;
    onRsvp?: (postId: string) => void;
    onComment?: (postId: string, content: string) => void;
}

const POST_TYPE_CONFIG = {
    update: { icon: 'chatbubble', color: Colors.text.secondary },
    poll: { icon: 'stats-chart', color: '#8B5CF6' },
    pin: { icon: 'location', color: '#3B82F6' },
    event: { icon: 'calendar', color: '#F59E0B' },
    split: { icon: 'wallet', color: '#10B981' },
    question: { icon: 'help-circle', color: '#EC4899' },
};

const REACTION_EMOJIS = ['👍', '❤️', '🔥', '😂', '🎉'];

export const PostCard: React.FC<PostCardProps> = ({ post, onReact, onVote, onRsvp, onComment }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [votedOption, setVotedOption] = useState<string | null>(null);
    const [isGoing, setIsGoing] = useState(false);
    const [localCommentCount, setLocalCommentCount] = useState(post.commentCount);
    const config = POST_TYPE_CONFIG[post.type];

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    const getTotalVotes = () => {
        if (!post.pollOptions) return 0;
        return post.pollOptions.reduce((sum, opt) => sum + opt.votes.length, 0);
    };

    return (
        <View style={[styles.container, post.isPinned && styles.pinnedContainer]}>
            {/* Pinned indicator */}
            {post.isPinned && (
                <View style={styles.pinnedBadge}>
                    <Ionicons name="pin" size={12} color={Colors.primary.main} />
                    <Text style={styles.pinnedText}>Pinned</Text>
                </View>
            )}

            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: post.authorAvatar || 'https://i.pravatar.cc/150?u=' + post.authorId }}
                    style={styles.avatar}
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.authorName}>{post.authorName}</Text>
                    <View style={styles.metaRow}>
                        <Ionicons name={config.icon as any} size={12} color={config.color} />
                        <Text style={styles.timeText}>{formatTime(post.createdAt)}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-horizontal" size={18} color={Colors.text.muted} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <Text style={styles.content}>{post.content}</Text>

            {/* Media */}
            {post.media && post.media.length > 0 && (
                <Image source={{ uri: post.media[0] }} style={styles.media} />
            )}

            {/* Poll Options */}
            {post.type === 'poll' && post.pollOptions && (
                <View style={styles.pollContainer}>
                    {post.pollOptions.map((option) => {
                        const totalVotes = getTotalVotes() + (votedOption ? 1 : 0);
                        const optionVotes = option.votes.length + (votedOption === option.id ? 1 : 0);
                        const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                        const isVoted = option.votes.includes('current-user') || votedOption === option.id;

                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[styles.pollOption, isVoted && styles.pollOptionVoted]}
                                onPress={() => {
                                    if (!votedOption) {
                                        setVotedOption(option.id);
                                        onVote?.(post.id, option.id);
                                        Alert.alert('Voted!', `You voted for "${option.text}"`);
                                    }
                                }}
                                disabled={!!votedOption}
                            >
                                <View style={[styles.pollBar, { width: `${percentage}%` }]} />
                                <Text style={styles.pollText}>{option.text}</Text>
                                <Text style={styles.pollVotes}>{optionVotes}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    <Text style={styles.pollTotal}>{getTotalVotes() + (votedOption ? 1 : 0)} votes</Text>
                </View>
            )}

            {/* Event Details */}
            {post.type === 'event' && post.eventDate && (
                <View style={styles.eventCard}>
                    <View style={styles.eventIcon}>
                        <Ionicons name="calendar" size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventDate}>
                            {new Date(post.eventDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                        </Text>
                        {post.eventLocation && (
                            <Text style={styles.eventLocation}>{post.eventLocation}</Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.eventRsvp, isGoing && styles.eventRsvpGoing]}
                        onPress={() => {
                            setIsGoing(!isGoing);
                            onRsvp?.(post.id);
                            Alert.alert(
                                isGoing ? 'Cancelled' : "You're going!",
                                isGoing ? 'Removed from your calendar' : 'Event added to your calendar'
                            );
                        }}
                    >
                        <Text style={[styles.eventRsvpText, isGoing && styles.eventRsvpTextGoing]}>
                            {isGoing ? '✓ Going' : 'Going'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Location Pin */}
            {post.type === 'pin' && post.location && (
                <TouchableOpacity
                    style={styles.pinCard}
                    onPress={() => {
                        const { latitude, longitude } = post.location!;
                        const url = `https://maps.google.com/?q=${latitude},${longitude}`;
                        Linking.openURL(url).catch(() => {
                            Alert.alert('Open Maps', `View ${post.location!.name} on Google Maps?`);
                        });
                    }}
                >
                    <View style={styles.pinIcon}>
                        <Ionicons name="location" size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.pinInfo}>
                        <Text style={styles.pinName}>{post.location.name}</Text>
                        {post.location.address && (
                            <Text style={styles.pinAddress}>{post.location.address}</Text>
                        )}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
                </TouchableOpacity>
            )}

            {/* Reactions & Actions */}
            <View style={styles.footer}>
                <View style={styles.reactions}>
                    {post.reactions.length > 0 && (
                        <View style={styles.reactionBubble}>
                            {[...new Set(post.reactions.map((r) => r.emoji))].slice(0, 3).map((emoji, i) => (
                                <Text key={i} style={styles.reactionEmoji}>{emoji}</Text>
                            ))}
                            <Text style={styles.reactionCount}>{post.reactions.length}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setShowReactions(!showReactions)}
                    >
                        <Ionicons name="heart-outline" size={18} color={Colors.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setShowComments(true)}
                    >
                        <Ionicons name="chatbubble-outline" size={18} color={Colors.text.secondary} />
                        {localCommentCount > 0 && (
                            <Text style={styles.commentCount}>{localCommentCount}</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => Alert.alert('Share', 'Post link copied!')}
                    >
                        <Ionicons name="share-outline" size={18} color={Colors.text.secondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Reaction Picker */}
            {showReactions && (
                <View style={styles.reactionPicker}>
                    {REACTION_EMOJIS.map((emoji) => (
                        <TouchableOpacity
                            key={emoji}
                            style={styles.reactionOption}
                            onPress={() => {
                                onReact?.(emoji);
                                setShowReactions(false);
                            }}
                        >
                            <Text style={styles.reactionOptionEmoji}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Comments Modal */}
            <CommentsModal
                visible={showComments}
                onClose={() => setShowComments(false)}
                comments={post.comments || []}
                postAuthor={post.authorName}
                onAddComment={(content) => {
                    onComment?.(post.id, content);
                    setLocalCommentCount(localCommentCount + 1);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    pinnedContainer: {
        borderWidth: 1,
        borderColor: Colors.primary.light,
    },
    pinnedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    pinnedText: {
        fontSize: 11,
        color: Colors.primary.main,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    timeText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    moreBtn: {
        padding: 4,
    },
    content: {
        fontSize: 14,
        color: Colors.text.primary,
        lineHeight: 20,
        marginBottom: 12,
    },
    media: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },

    // Poll
    pollContainer: {
        marginBottom: 12,
    },
    pollOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        overflow: 'hidden',
    },
    pollOptionVoted: {
        borderWidth: 1,
        borderColor: Colors.primary.main,
    },
    pollBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#E0F2FE',
        borderRadius: 10,
    },
    pollText: {
        flex: 1,
        fontSize: 13,
        color: Colors.text.primary,
        fontWeight: '500',
        zIndex: 1,
    },
    pollVotes: {
        fontSize: 12,
        color: Colors.text.muted,
        fontWeight: '600',
        zIndex: 1,
    },
    pollTotal: {
        fontSize: 11,
        color: Colors.text.muted,
        textAlign: 'right',
    },

    // Event
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    eventIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventDate: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    eventLocation: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    eventRsvp: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    eventRsvpGoing: {
        backgroundColor: '#10B981',
    },
    eventRsvpText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
    },
    eventRsvpTextGoing: {
        color: '#FFF',
    },

    // Pin
    pinCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    pinIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    pinInfo: {
        flex: 1,
    },
    pinName: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    pinAddress: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginTop: 2,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reactions: {
        flex: 1,
    },
    reactionBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 2,
    },
    reactionEmoji: {
        fontSize: 14,
    },
    reactionCount: {
        fontSize: 12,
        color: Colors.text.muted,
        marginLeft: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    commentCount: {
        fontSize: 12,
        color: Colors.text.secondary,
    },

    // Reaction Picker
    reactionPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    reactionOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reactionOptionEmoji: {
        fontSize: 20,
    },
});
