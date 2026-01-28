/**
 * GroupCard Component
 * Displays a group in the groups list
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { Group } from '../../types/groups';

interface GroupCardProps {
    group: Group;
}

const TYPE_CONFIG = {
    trip: { icon: 'airplane', color: '#F59E0B', bg: '#FEF3C7' },
    city: { icon: 'location', color: '#3B82F6', bg: '#DBEAFE' },
    interest: { icon: 'heart', color: '#EC4899', bg: '#FCE7F3' },
    private: { icon: 'lock-closed', color: '#6B7280', bg: '#F3F4F6' },
};

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    const router = useRouter();
    const config = TYPE_CONFIG[group.type];

    const formatDate = (date?: Date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/groups/${group.id}`)}
            activeOpacity={0.7}
        >
            {/* Left: Cover or Emoji */}
            <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
                {group.coverImage ? (
                    <Image source={{ uri: group.coverImage }} style={styles.coverImage} />
                ) : (
                    <Ionicons name={config.icon as any} size={24} color={config.color} />
                )}
            </View>

            {/* Center: Info */}
            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{group.name}</Text>
                    {group.unreadCount && group.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{group.unreadCount}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.description} numberOfLines={1}>
                    {group.description}
                </Text>

                <View style={styles.metaRow}>
                    {/* Member count */}
                    <View style={styles.metaItem}>
                        <Ionicons name="people-outline" size={12} color={Colors.text.muted} />
                        <Text style={styles.metaText}>{group.memberCount}</Text>
                    </View>

                    {/* Active now */}
                    {group.activeNow > 0 && (
                        <View style={styles.metaItem}>
                            <View style={styles.activeDot} />
                            <Text style={styles.activeText}>{group.activeNow} active</Text>
                        </View>
                    )}

                    {/* Trip dates */}
                    {group.type === 'trip' && group.startDate && group.endDate && (
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={12} color={Colors.text.muted} />
                            <Text style={styles.metaText}>
                                {formatDate(group.startDate)} - {formatDate(group.endDate)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Right: Member avatars */}
            <View style={styles.avatars}>
                {group.memberPreview.slice(0, 3).map((member, index) => (
                    <Image
                        key={member.userId}
                        source={{ uri: member.avatarUrl || 'https://i.pravatar.cc/150?u=' + member.userId }}
                        style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]}
                    />
                ))}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    info: {
        flex: 1,
        marginRight: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text.primary,
        flex: 1,
    },
    unreadBadge: {
        backgroundColor: Colors.primary.main,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    unreadText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFF',
    },
    description: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        color: Colors.text.muted,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    activeText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '500',
    },
    avatars: {
        flexDirection: 'row',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#FFF',
    },
});
