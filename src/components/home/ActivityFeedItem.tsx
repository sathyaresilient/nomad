import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';

export const ActivityFeedItem = () => {
    // Mock Data based on "Sunset drinks at The Lawn"
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=mark' }} style={styles.avatar} />
                        <View style={styles.onlineDot} />
                    </View>
                    <View>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>Mark</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.time}>15m ago</Text>
                        </View>
                        <Text style={styles.subtext}>Digital Nomad • London</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text.muted} />
                </TouchableOpacity>
            </View>

            <Text style={styles.content}>
                Sunset drinks at The Lawn? Looking for a squad for 2-for-1s! 🍹
            </Text>

            <View style={styles.tagsRow}>
                <View style={styles.tag}>
                    <Text>🍸</Text>
                    <Text style={styles.tagText}>Social</Text>
                </View>
                <View style={styles.locationTag}>
                    <Text style={styles.locationText}>The Lawn, Canggu</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <Text style={styles.interestedText}>5 people interested</Text>
                <TouchableOpacity style={styles.joinBtn}>
                    <Text style={styles.joinBtnText}>Join Group</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginHorizontal: 20, // inset
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#eee',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.status.success,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    dot: {
        color: Colors.text.muted,
    },
    time: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    subtext: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    content: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
        lineHeight: 22,
        marginBottom: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED', // Light orange
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    tagText: {
        color: '#F97316',
        fontSize: 12,
        fontWeight: '600',
    },
    locationTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    locationText: {
        color: '#4B5563',
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    interestedText: {
        fontSize: 12,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
    joinBtn: {
        backgroundColor: '#111827', // Dark/Black button
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
});
