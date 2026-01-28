import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChatRow } from '../../src/components/chat/ChatRow';
import { Colors } from '../../src/design/colors';
import { useChatStore } from '../../src/store/chatStore';

export default function ChatListScreen() {
    const router = useRouter();
    const { conversations } = useChatStore();

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Messages</Text>
                <TouchableOpacity style={styles.composeButton}>
                    <Ionicons name="create-outline" size={24} color={Colors.primary.main} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ChatRow conversation={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={64} color={Colors.text.muted} />
                        <Text style={styles.emptyText}>No messages yet</Text>
                        <Text style={styles.emptySubtext}>Connect with travelers to start chatting!</Text>
                    </View>
                }
                contentContainerStyle={conversations.length === 0 && styles.listEmpty}
            />
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
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    composeButton: {
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    listEmpty: {
        flexGrow: 1,
    },
    emptyText: {
        marginTop: 24,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});
