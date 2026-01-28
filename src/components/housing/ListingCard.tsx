import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockUsers } from '../../data/mockUsers';
import { HousingListing } from '../../store/housingStore';
import { HostBadge } from './HostBadge';

interface Props {
    listing: HousingListing;
    onPress: () => void;
}

export const ListingCard = ({ listing, onPress }: Props) => {
    const host = mockUsers.find(u => u.id === listing.hostId) || mockUsers[0];

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: listing.images[0] }} style={styles.image} />
                <View style={styles.priceBadge}>
                    <Text style={styles.price}>${listing.price}</Text>
                    <Text style={styles.period}>/{listing.period}</Text>
                </View>
                <TouchableOpacity style={styles.heartBtn}>
                    <Ionicons name="heart-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
                        <Text style={styles.location}>{listing.location}</Text>
                    </View>
                    <View style={styles.ratingBox}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.rating}>{listing.rating}</Text>
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.tagRow}>
                    {listing.tags.map(tag => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* Host Trust Section */}
                <View style={styles.hostSection}>
                    <Image source={{ uri: host.avatarUrl }} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                        <View style={styles.hostRow}>
                            <Text style={styles.hostName}>Hosted by {host.displayName.split(' ')[0]}</Text>
                            <HostBadge type={listing.isVerified ? 'superhost' : 'verified'} />
                        </View>
                        <Text style={styles.mutuals}>
                            <Ionicons name="people-outline" size={12} color="#94A3B8" /> 2 mutual friends
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#334155',
    },
    imageContainer: {
        height: 180,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    priceBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
    period: {
        color: '#94A3B8',
        fontSize: 12,
        marginLeft: 2,
    },
    heartBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    location: {
        color: '#94A3B8',
        fontSize: 12,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#0F172A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    rating: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    tagRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        backgroundColor: '#334155',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        color: '#CBD5E1',
        fontSize: 10,
    },
    hostSection: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#334155',
        paddingTop: 12,
        gap: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    hostName: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    mutuals: {
        color: '#94A3B8',
        fontSize: 10,
    },
});
