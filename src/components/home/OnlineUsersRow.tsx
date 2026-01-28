import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';

// Mock Data
const ONLINE_USERS = [
    { id: 'sarah-chen', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '2', name: 'Mark', image: 'https://i.pravatar.cc/150?u=mark' },
    { id: '3', name: 'Elaine', image: 'https://i.pravatar.cc/150?u=elaine' },
    { id: '4', name: 'Jonas', image: 'https://i.pravatar.cc/150?u=jonas' },
    { id: '5', name: 'Mike', image: 'https://i.pravatar.cc/150?u=mike' },
    { id: '6', name: 'Alina', image: 'https://i.pravatar.cc/150?u=alina' },
];

export const OnlineUsersRow = () => {
    const router = useRouter();

    const handleAvatarPress = (userId: string) => {
        router.push(`/profile/${userId}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>ONLINE IN CANGGU ({ONLINE_USERS.length})</Text>
                <TouchableOpacity onPress={() => router.push('/discover')}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {ONLINE_USERS.map((user) => (
                    <TouchableOpacity key={user.id} style={styles.userContainer} onPress={() => handleAvatarPress(user.id)}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: user.image }} style={styles.avatar} />
                            <View style={styles.indicator} />
                        </View>
                        <Text style={styles.userName}>{user.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.text.secondary,
        letterSpacing: 0.5,
    },
    viewAll: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary.main, // Pinkish red from design or primary teal
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    userContainer: {
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 8,
        padding: 3,
        borderWidth: 2,
        borderColor: '#FCA5A5', // Light pink border like design
        borderRadius: 36,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E2E8F0',
    },
    indicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#22D3EE', // Cyan indicator
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.primary,
    },
});
