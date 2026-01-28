import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { ChatConversation } from '../../store/chatStore';

interface Props {
    conversation: ChatConversation;
}

export const ChatRow = ({ conversation }: Props) => {
    const router = useRouter();
    const lastMsg = conversation.messages[conversation.messages.length - 1];

    const handlePress = () => {
        router.push(`/chat/${conversation.id}`);
    };

    const handleAvatarPress = () => {
        router.push(`/profile/${conversation.otherUser.id}`);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
                <Image source={{ uri: conversation.otherUser.avatarUrl }} style={styles.avatar} />
                {/* Online indicator could go here */}
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{conversation.otherUser.displayName}</Text>
                    {lastMsg && (
                        <Text style={styles.time}>
                            {lastMsg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.preview, conversation.unreadCount > 0 && styles.previewUnread]} numberOfLines={1}>
                        {lastMsg ? lastMsg.text : 'Start a conversation'}
                    </Text>
                    {conversation.unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9', // Divider
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E2E8F0',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    time: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    preview: {
        fontSize: 14,
        color: Colors.text.secondary,
        flex: 1,
        marginRight: 8,
    },
    previewUnread: {
        color: Colors.text.primary,
        fontWeight: '600',
    },
    badge: {
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
});
