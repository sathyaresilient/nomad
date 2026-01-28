import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../design/colors';

// This would typically come from a type definition file
export interface LocalGuide {
    id: string;
    name: string;
    age: number;
    profession: string;
    isNew?: boolean;
    rating: number;
    photoUrl: string; // In a real app this would be a URL
    tags: { label: string; icon?: string }[];
    badges: string[]; // 'EXPERT', 'VERIFIED'
}

/* 
 * Assuming photos are locally available or using placeholders for now as per usual demo practices.
 * In a real scenario, Image.source would be { uri: photoUrl }.
 */

export const LocalGuideCard = ({ guide, onPress }: { guide: LocalGuide; onPress?: () => void }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                {/* Placeholder for the actual image implementation */}
                <Image
                    source={{ uri: guide.photoUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Badges Overlay */}
                <View style={styles.badgeContainer}>
                    {guide.badges.includes('EXPERT') && (
                        <View style={[styles.badge, styles.expertBadge]}>
                            <Ionicons name="checkmark-circle" size={12} color="#FFF" />
                            <Text style={styles.badgeText}>EXPERT</Text>
                        </View>
                    )}
                    {guide.isNew && (
                        <View style={[styles.badge, styles.newBadge]}>
                            <Ionicons name="flash" size={12} color="#475569" />
                            <Text style={[styles.badgeText, styles.newBadgeText]}>NEW</Text>
                        </View>
                    )}
                </View>

                {/* Bookmark Action */}
                <TouchableOpacity style={styles.bookmarkButton}>
                    <Ionicons name="bookmark" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{guide.name}, {guide.age}</Text>
                    {guide.isNew ? (
                        <View style={styles.newTag}>
                            <Text style={styles.newTagText}>New</Text>
                        </View>
                    ) : (
                        <View style={styles.rating}>
                            <Ionicons name="star" size={12} color="#D97706" />
                            <Text style={styles.ratingText}>{guide.rating.toFixed(1)}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.profession}>{guide.profession.toUpperCase()}</Text>

                <View style={styles.tags}>
                    {guide.tags.map((tag, i) => (
                        <View key={i} style={styles.tag}>
                            {tag.icon && <Text style={styles.tagIcon}>{tag.icon}</Text>}
                            <Text style={styles.tagText}>{tag.label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9', // slightly lighter than Colors.border
        // Shadow for iOS
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 3,
    },
    imageContainer: {
        height: 200,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    expertBadge: {
        backgroundColor: '#0D9488', // Teal-700
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    newBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    newBadgeText: {
        color: '#475569',
    },
    bookmarkButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 8,
        // Typically a transparent implementation or specialized icon button
    },
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF3C7', // Amber-100
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D97706', // Amber-700
    },
    newTag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    newTagText: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.text.muted,
    },
    profession: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 12,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tagIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '500',
        color: Colors.text.secondary,
    },
});
