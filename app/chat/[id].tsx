import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MessageBubble } from '../../src/components/chat/MessageBubble';
import { Colors } from '../../src/design/colors';
import { useAuthStore } from '../../src/store';
import { useChatStore } from '../../src/store/chatStore';

export default function ChatRoomScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const { getConversation, sendMessage, markAsRead } = useChatStore();

    const [inputText, setInputText] = useState('');
    const listRef = useRef<FlatList>(null);

    const conversation = getConversation(id as string);

    // Mark as read on enter
    useEffect(() => {
        if (id) {
            markAsRead(id as string);
        }
    }, [id]);

    const handleSend = () => {
        if (!inputText.trim() || !user) return;
        sendMessage(id as string, inputText.trim(), user.id);
        setInputText('');
        // Scroll to bottom
    };

    if (!conversation) return null; // Or loading/error

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Image source={{ uri: conversation.otherUser.avatarUrl }} style={styles.headerAvatar} />
                    <View>
                        <Text style={styles.headerName}>{conversation.otherUser.displayName}</Text>
                        <Text style={styles.headerStatus}>Online</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
                ref={listRef}
                data={conversation.messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageBubble
                        text={item.text}
                        timestamp={item.timestamp}
                        isMe={item.senderId === user?.id}
                    />
                )}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#FFF',
        zIndex: 10,
    },
    backBtn: {
        padding: 4,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E2E8F0',
        marginRight: 12,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    headerStatus: {
        fontSize: 12,
        color: Colors.status.success,
    },
    moreBtn: {
        padding: 4,
    },
    listContent: {
        padding: 20,
        paddingBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end', // for multiline
        padding: 12,
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
        fontSize: 15,
        maxHeight: 100,
        marginRight: 12,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: Colors.text.disabled,
    },
});
