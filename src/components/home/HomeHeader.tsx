import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { useAuthStore } from '../../store/authStore';

export const HomeHeader = () => {
    const router = useRouter();
    const { user } = useAuthStore();

    const displayName = user?.displayName || 'Traveler';
    const avatarUrl = user?.avatarUrl;
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {/* Profile Avatar */}
                <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileSection}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarInitials}>{initials}</Text>
                        </View>
                    )}
                    <View style={styles.locationInfo}>
                        <Text style={styles.userName}>{displayName}</Text>
                        <View style={styles.locationRow}>
                            <View style={styles.statusDot} />
                            <Text style={styles.locationText}>Online</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* App Logo + Action Buttons */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#F0FDF4' }]}
                        onPress={() => router.push('/explore/map')}
                    >
                        <Ionicons name="map-outline" size={20} color={Colors.primary.main} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#F0F9FF' }]}
                        onPress={() => router.push('/friends')}
                    >
                        <Ionicons name="people-outline" size={20} color={Colors.primary.main} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#FCE7F3' }]}
                        onPress={() => router.push('/chat')}
                    >
                        <Ionicons name="chatbubble-outline" size={20} color="#EC4899" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: Colors.primary.main,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    locationInfo: {
        gap: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
    },
    locationText: {
        fontSize: 12,
        color: '#64748B',
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    actionBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
