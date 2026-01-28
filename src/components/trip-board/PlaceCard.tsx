import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { BoardPlace, useTripBoardStore } from '../../store/tripBoardStore';

interface Props {
    place: BoardPlace;
}

export const PlaceCard = ({ place }: Props) => {
    const { votePlace } = useTripBoardStore();

    return (
        <View style={styles.card}>
            <Image source={{ uri: place.imageUrl }} style={styles.image} resizeMode="cover" />

            {/* Vote Badge */}
            <TouchableOpacity
                style={styles.voteBadge}
                onPress={() => votePlace(place.id)}
                activeOpacity={0.8}
            >
                <View style={styles.voteDot} />
                <Text style={styles.voteCount}>{place.votes}</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.rating}>★ {place.rating}</Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
                <Text style={styles.category} numberOfLines={1}>{place.category}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '48%', // Approx for 2 columns
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
        backgroundColor: '#F1F5F9',
    },
    voteBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    voteDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.accent.main,
    },
    voteCount: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    rating: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.text.primary,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    category: {
        fontSize: 11,
        color: Colors.text.secondary,
    }
});
