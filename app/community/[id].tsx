import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../src/design/colors';
import { useCommunityStore } from '../../src/store/communityStore';

export default function ThreadDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { threads, likeThread } = useCommunityStore();

    const thread = threads.find(t => t.id === id);

    if (!thread) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Discussion</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Thread Header */}
                <View style={styles.mainPost}>
                    <View style={styles.authorRow}>
                        <Image source={{ uri: thread.author.avatarUrl }} style={styles.avatar} />
                        <View>
                            <Text style={styles.authorName}>{thread.author.displayName}</Text>
                            <Text style={styles.meta}>in {thread.category} • 2h ago</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{thread.title}</Text>
                    <Text style={styles.body}>{thread.content}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => likeThread(thread.id)}>
                            <Ionicons name="heart-outline" size={20} color={Colors.text.secondary} />
                            <Text style={styles.actionText}>{thread.likes} Likes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="chatbubble-outline" size={20} color={Colors.text.secondary} />
                            <Text style={styles.actionText}>Reply</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="share-outline" size={20} color={Colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Divider/Comments Header */}
                <View style={styles.commentsHeader}>
                    <Text style={styles.commentsTitle}>Replies</Text>
                </View>

                {/* Mock Comment */}
                <View style={styles.comment}>
                    <View style={styles.authorRow}>
                        <View style={[styles.avatar, { backgroundColor: '#FCD34D' }]} />
                        <Text style={styles.authorName}>Local Guide</Text>
                        <Text style={styles.meta}>• 1h ago</Text>
                    </View>
                    <Text style={styles.commentBody}>
                        Second Home Lisboa is great! Lots of plants and natural light.
                        Use code NOMAD20 for a discount.
                    </Text>
                </View>

                <View style={styles.comment}>
                    <View style={styles.authorRow}>
                        <View style={[styles.avatar, { backgroundColor: '#F87171' }]} />
                        <Text style={styles.authorName}>Ana P.</Text>
                        <Text style={styles.meta}>• 45m ago</Text>
                    </View>
                    <Text style={styles.commentBody}>
                        +1 for Second Home. Also check out Avila Spaces if you need something quieter.
                    </Text>
                </View>

            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a reply..."
                    placeholderTextColor={Colors.text.muted}
                />
                <TouchableOpacity>
                    <Text style={styles.postBtn}>Post</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    content: {
        paddingBottom: 24,
    },
    mainPost: {
        padding: 20,
        borderBottomWidth: 8,
        borderBottomColor: '#F8FAFC',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E2E8F0',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    meta: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    body: {
        fontSize: 16,
        color: Colors.text.secondary,
        lineHeight: 24,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        gap: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    commentsHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    comment: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    commentBody: {
        fontSize: 15,
        color: Colors.text.secondary,
        lineHeight: 22,
        paddingLeft: 52, // Indent to align with text above
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        backgroundColor: '#FFF',
    },
    input: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
    },
    postBtn: {
        color: Colors.primary.main,
        fontWeight: '700',
        fontSize: 16,
    },
});
