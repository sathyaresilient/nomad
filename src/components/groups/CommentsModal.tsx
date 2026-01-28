/**
 * Comments Modal
 * Display and add comments to posts
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../design/colors';
import { Comment } from '../../types/groups';

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    comments: Comment[];
    onAddComment: (content: string) => void;
    postAuthor: string;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
    visible,
    onClose,
    comments,
    onAddComment,
    postAuthor,
}) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = () => {
        if (!newComment.trim()) return;
        onAddComment(newComment.trim());
        setNewComment('');
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return new Date(date).toLocaleDateString();
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <Image
                source={{ uri: item.authorAvatar || `https://i.pravatar.cc/150?u=${item.authorId}` }}
                style={styles.avatar}
            />
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.authorName}>{item.authorName}</Text>
                    <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{item.content}</Text>
                <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="heart-outline" size={14} color={Colors.text.muted} />
                        <Text style={styles.actionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="chatbubble-outline" size={14} color={Colors.text.muted} />
                        <Text style={styles.actionText}>Reply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Comments</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Comments List */}
                {comments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubble-outline" size={48} color={Colors.text.muted} />
                        <Text style={styles.emptyTitle}>No comments yet</Text>
                        <Text style={styles.emptyText}>Be the first to comment!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={renderComment}
                        contentContainerStyle={styles.listContent}
                    />
                )}

                {/* Comment Input */}
                <View style={styles.inputContainer}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=current-user' }}
                        style={styles.inputAvatar}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={`Reply to ${postAuthor}...`}
                        placeholderTextColor={Colors.text.muted}
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !newComment.trim() && styles.sendBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={!newComment.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={18}
                            color={newComment.trim() ? '#FFF' : Colors.text.muted}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    listContent: {
        padding: 16,
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    timeText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    commentText: {
        fontSize: 14,
        color: Colors.text.primary,
        lineHeight: 20,
        marginTop: 4,
    },
    commentActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 12,
        color: Colors.text.muted,
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 10,
    },
    inputAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 80,
        color: Colors.text.primary,
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
});
