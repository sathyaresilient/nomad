import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';

export const HomeHeader = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {/* Profile Avatar with Location */}
                <TouchableOpacity onPress={() => router.push('/biopic')} style={styles.profileSection}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=alex' }}
                        style={styles.avatar}
                    />
                    <View style={styles.locationInfo}>
                        <Text style={styles.userName}>Alex</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={12} color={Colors.primary.main} />
                            <Text style={styles.locationText}>Lisbon, Portugal</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Quick Action Buttons */}
                <View style={styles.actionsRow}>
                    {/* Groups Button */}
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#FCE7F3' }]}
                        onPress={() => router.push('/groups')}
                    >
                        <Ionicons name="chatbubbles-outline" size={18} color="#EC4899" />
                    </TouchableOpacity>

                    {/* Friends Button */}
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#FEF3C7' }]}
                        onPress={() => router.push('/friends')}
                    >
                        <Ionicons name="people-outline" size={18} color="#F59E0B" />
                    </TouchableOpacity>

                    {/* Chat Button */}
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#F0F9FF' }]}
                        onPress={() => router.push('/chat')}
                    >
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary.main} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 16,
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
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        color: '#64748B',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFE4E6',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
