import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FriendshipStatus, useFriendsStore } from '../../store/friendsStore';

const { width } = Dimensions.get('window');

interface TravelerMatchCardProps {
    userId?: string; // For navigation
    name: string;
    age: number;
    image: string;
    rating: number;
    trips: number;
    bio: string;
    tags: string[];
    dateRange: string;
    timeLeft?: string; // e.g. "4 Days left"
    isVerified?: boolean;
    persona: string; // e.g. "DIGITAL NOMAD"
    personaColor?: string;
    onConnect?: () => void;
}

export const TravelerMatchCard: React.FC<TravelerMatchCardProps> = ({
    userId,
    name,
    age,
    image,
    rating,
    trips,
    bio,
    tags,
    dateRange,
    timeLeft,
    isVerified = true,
    persona,
    personaColor = '#FFE4E6', // Default soft pink
    onConnect,
}) => {
    const router = useRouter();
    const { getConnectionStatus, sendFriendRequest, acceptRequest, receivedRequests, friends, sentRequests } = useFriendsStore();
    const [connectionStatus, setConnectionStatus] = useState<FriendshipStatus>('none');

    // Derive status from store state (synchronous fallback)
    useEffect(() => {
        if (!userId) return;

        // Check local state first
        if (friends.some(f => f.userId === userId)) {
            setConnectionStatus('friends');
        } else if (sentRequests.some(r => r.toUserId === userId)) {
            setConnectionStatus('pending_sent');
        } else if (receivedRequests.some(r => r.fromUserId === userId)) {
            setConnectionStatus('pending_received');
        } else {
            setConnectionStatus('none');
        }
    }, [userId, friends, sentRequests, receivedRequests]);

    const handleConnect = async () => {
        if (!userId) {
            onConnect?.();
            return;
        }

        if (connectionStatus === 'none') {
            await sendFriendRequest(userId);
        } else if (connectionStatus === 'pending_received') {
            const request = receivedRequests.find((r) => r.fromUserId === userId);
            if (request) {
                await acceptRequest(request.id);
            }
        }
    };

    const handlePress = () => {
        router.push(`/profile/${userId || 'sarah-chen'}`);
    };

    const renderConnectButton = () => {
        switch (connectionStatus) {
            case 'friends':
                return (
                    <View style={[styles.connectButton, styles.friendsButton]}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={[styles.connectText, styles.friendsText]}>Friends</Text>
                    </View>
                );
            case 'pending_sent':
                return (
                    <View style={[styles.connectButton, styles.pendingButton]}>
                        <Ionicons name="time-outline" size={16} color="#64748B" />
                        <Text style={[styles.connectText, styles.pendingText]}>Pending</Text>
                    </View>
                );
            case 'pending_received':
                return (
                    <TouchableOpacity style={[styles.connectButton, styles.acceptButton]} onPress={handleConnect}>
                        <Ionicons name="checkmark" size={16} color="#FFF" />
                        <Text style={styles.connectText}>Accept Request</Text>
                    </TouchableOpacity>
                );
            default:
                return (
                    <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
                        <Ionicons name="person-add" size={16} color="#FFF" />
                        <Text style={styles.connectText}>Request to Connect</Text>
                    </TouchableOpacity>
                );
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.9}>
            {/* Image Overlay */}
            <ImageBackground
                source={{ uri: image }}
                style={styles.image}
                imageStyle={{ borderRadius: 20 }}
            >
                <View style={styles.overlayHeader}>
                    <View style={styles.likeButton}>
                        <Ionicons name="heart-outline" size={20} color="#FFF" />
                    </View>
                </View>

                <View style={styles.overlayFooter}>
                    <View style={[styles.dateBadge, timeLeft ? styles.warningBadge : null]}>
                        <Ionicons name={timeLeft ? "alert-circle" : "calendar"} size={12} color={timeLeft ? "#F59E0B" : "#FFF"} />
                        <Text style={styles.dateText}>{dateRange}</Text>
                    </View>
                </View>
            </ImageBackground>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.name}>{name}, {age}</Text>
                        {isVerified && <Ionicons name="checkmark-circle" size={16} color="#10B981" />}
                    </View>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.ratingText}>{rating}</Text>
                    </View>
                </View>

                <View style={styles.subHeaderRow}>
                    <View style={[styles.personaPill, { backgroundColor: personaColor }]}>
                        <Text style={styles.personaText}>{persona}</Text>
                    </View>
                    <Text style={styles.tripsText}>{trips} Trips</Text>
                </View>

                <Text style={styles.bio} numberOfLines={2}>
                    {bio}
                </Text>

                <View style={styles.tagsRow}>
                    {tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>

                {renderConnectButton()}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 220,
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    overlayHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 12,
    },
    likeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    overlayFooter: {
        padding: 12,
        alignItems: 'flex-start',
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    warningBadge: {
        backgroundColor: 'rgba(30, 20, 10, 0.8)', // Darker warning bg
    },
    dateText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB', // Light amber
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
    },
    subHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    personaPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    personaText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#9D5E66', // Muted punchy color
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tripsText: {
        fontSize: 10,
        color: '#94A3B8',
    },
    bio: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
        marginBottom: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 16,
    },
    tag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '600',
    },
    connectButton: {
        backgroundColor: '#2DD4BF', // Teal-400ish
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#2DD4BF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    connectText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    friendsButton: {
        backgroundColor: '#F0FDF4',
        shadowOpacity: 0,
    },
    friendsText: {
        color: '#10B981',
    },
    pendingButton: {
        backgroundColor: '#F1F5F9',
        shadowOpacity: 0,
    },
    pendingText: {
        color: '#64748B',
    },
    acceptButton: {
        backgroundColor: '#10B981',
    },
});
