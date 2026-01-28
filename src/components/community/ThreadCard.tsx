import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { Thread } from '../../store/communityStore';

interface Props {
    thread: Thread;
    onPress: () => void;
}

export const ThreadCard = ({ thread, onPress }: Props) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.header}>
                <View style={styles.authorRow}>
                    <Image source={{ uri: thread.author.avatarUrl }} style={styles.avatar} />
                    <Text style={styles.authorName}>{thread.author.displayName}</Text>
                    <Text style={styles.timeAccting}>• 2h ago</Text>
                </View>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{thread.category}</Text>
                </View>
            </View>

            <Text style={styles.title}>{thread.title}</Text>
            <Text style={styles.content} numberOfLines={2}>{thread.content}</Text>

            <View style={styles.footer}>
                <View style={styles.stat}>
                    <Ionicons name="heart-outline" size={16} color={Colors.text.muted} />
                    <Text style={styles.statText}>{thread.likes}</Text>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="chatbubble-outline" size={16} color={Colors.text.muted} />
                    <Text style={styles.statText}>{thread.replies.length} replies</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
    },
    authorName: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    timeAccting: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.text.secondary,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: Colors.text.muted,
        fontWeight: '500',
    },
});
