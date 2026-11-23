import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';

// Demo data with consistent, realistic avatars
const ONLINE_USERS = [
    { id: '1', name: 'Sarah', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
    { id: '2', name: 'Mark', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '3', name: 'Elaine', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    { id: '4', name: 'Jonas', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    { id: '5', name: 'Priya', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
    { id: '6', name: 'Carlos', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
];

export const OnlineUsersRow = () => {
    const router = useRouter();

    const handleAvatarPress = (userId: string) => {
        router.push(`/profile/${userId}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>TRAVELERS NEARBY ({ONLINE_USERS.length})</Text>
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
        color: Colors.primary.main,
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
        borderColor: '#FCA5A5',
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
        backgroundColor: '#22C55E',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.primary,
    },
});
