/**
 * Nomad Profile View Screen
 * Detailed view of another user's profile
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { mockUsers } from '../../src/data/mockUsers';

const { width } = Dimensions.get('window');

// Vouch badge component
const VouchBadge: React.FC<{ icon: string; label: string; color: string }> = ({ icon, label, color }) => (
    <View style={[styles.vouchBadge, { borderColor: color }]}>
        <Ionicons name={icon as any} size={12} color={color} />
        <Text style={[styles.vouchText, { color }]}>{label}</Text>
    </View>
);

export default function NomadProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Find user by id or use first mock user
    const user = mockUsers.find(u => u.id === id) || mockUsers[0];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image Section */}
                <View style={styles.heroSection}>
                    <Image
                        source={{ uri: user.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop' }}
                        style={styles.heroImage}
                    />
                    {/* Gradient overlay */}
                    <View style={styles.heroOverlay} />

                    {/* Header buttons */}
                    <View style={styles.heroHeader}>
                        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={22} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="share-outline" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Travel style badge */}
                    <View style={styles.travelBadge}>
                        <Text style={styles.travelBadgeText}>✨ Digital Slow-mad</Text>
                    </View>

                    {/* Name and location */}
                    <View style={styles.heroInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.heroName}>{user.displayName}</Text>
                            <Ionicons name="checkmark-circle" size={20} color="#2A9D8F" />
                        </View>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={14} color="#FFF" />
                            <Text style={styles.locationText}>Lisbon, Portugal</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Reputation Section */}
                    <View style={styles.reputationCard}>
                        <View style={styles.reputationHeader}>
                            <View style={styles.reputationTitleRow}>
                                <Ionicons name="shield-checkmark" size={18} color="#2A9D8F" />
                                <Text style={styles.reputationTitle}>Reputation</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.howItWorks}>How this works</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.reputationBody}>
                            <View style={styles.scoreColumn}>
                                <Text style={styles.scoreBig}>{user.rating || 4.9}</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Ionicons
                                            key={i}
                                            name={i <= Math.floor(user.rating || 4.9) ? 'star' : 'star-outline'}
                                            size={12}
                                            color="#F59E0B"
                                        />
                                    ))}
                                </View>
                                <Text style={styles.trustLabel}>TRUST SCORE</Text>
                            </View>

                            <View style={styles.vouchesColumn}>
                                <Text style={styles.vouchesLabel}>TOP VOUCHED BY PEERS</Text>
                                <View style={styles.vouchesGrid}>
                                    <VouchBadge icon="checkmark-circle" label="Reliable" color="#2A9D8F" />
                                    <VouchBadge icon="chatbubbles" label="Great Conversation" color="#6B7280" />
                                    <VouchBadge icon="sparkles" label="Clean & Tidy" color="#6B7280" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Languages & Joined */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>🗣️ LANGUAGES</Text>
                            <Text style={styles.metaValue}>English <Text style={styles.metaNote}>(Native)</Text></Text>
                            <Text style={styles.metaValue}>Spanish <Text style={styles.metaNote}>(B2)</Text></Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>📅 JOINED</Text>
                            <Text style={styles.metaValue}>September 2023</Text>
                        </View>
                    </View>

                    {/* Travel Pace Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardIcon}>🐢</Text>
                            <Text style={styles.cardTitle}>Travel Pace</Text>
                        </View>
                        <Text style={styles.cardBody}>
                            I like to work mornings (deep focus) and explore afternoons. No rushing through cities. I prefer staying 3+ weeks in one spot to really get the vibe.
                        </Text>
                    </View>

                    {/* What I Bring Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardIcon}>🎒</Text>
                            <Text style={styles.cardTitle}>What I bring to a trip</Text>
                        </View>
                        <Text style={styles.cardBody}>
                            I'm a pro photographer 📸, so I'll get great shots of us. I also know how to cook a mean pasta dish in any hostel kitchen and carry a first-aid kit everywhere.
                        </Text>
                        <View style={styles.cardImages}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop' }}
                                style={styles.cardThumb}
                            />
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=100&h=100&fit=crop' }}
                                style={styles.cardThumb}
                            />
                        </View>
                    </View>

                    {/* Map Preview */}
                    <View style={styles.mapPreview}>
                        <Image
                            source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-9.1393,38.7223,10,0/400x200@2x?access_token=pk.placeholder' }}
                            style={styles.mapImage}
                        />
                        <View style={styles.mapOverlay}>
                            <TouchableOpacity style={styles.mapButton}>
                                <Ionicons name="location" size={14} color="#2A9D8F" />
                                <Text style={styles.mapButtonText}>View {user.displayName.split(' ')[0]}'s Travel Map</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.connectButton}>
                    <Ionicons name="person-add" size={18} color="#FFF" />
                    <Text style={styles.connectButtonText}>Connect with {user.displayName.split(' ')[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // Hero
    heroSection: {
        height: 320,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    heroHeader: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    travelBadge: {
        position: 'absolute',
        top: 100,
        right: 16,
        backgroundColor: '#2A9D8F',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    travelBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    heroInfo: {
        position: 'absolute',
        bottom: 20,
        left: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heroName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFF',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.9,
    },

    // Content
    content: {
        padding: 16,
    },

    // Reputation Card
    reputationCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    reputationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    reputationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reputationTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    howItWorks: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    reputationBody: {
        flexDirection: 'row',
        gap: 20,
    },
    scoreColumn: {
        alignItems: 'center',
    },
    scoreBig: {
        fontSize: 36,
        fontWeight: '700',
        color: '#2A9D8F',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 4,
    },
    trustLabel: {
        fontSize: 9,
        color: '#9CA3AF',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    vouchesColumn: {
        flex: 1,
    },
    vouchesLabel: {
        fontSize: 9,
        color: '#9CA3AF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    vouchesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    vouchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    vouchText: {
        fontSize: 11,
        fontWeight: '500',
    },

    // Meta Row
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    metaLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    metaValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    metaNote: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '400',
    },

    // Info Cards
    infoCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderLeftWidth: 4,
        borderLeftColor: '#FCD34D',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    cardIcon: {
        fontSize: 16,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    cardBody: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    cardImages: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    cardThumb: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },

    // Map Preview
    mapPreview: {
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 100,
        backgroundColor: '#E5E7EB',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mapButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2A9D8F',
    },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        paddingBottom: 34,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    connectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2A9D8F',
        paddingVertical: 16,
        borderRadius: 12,
    },
    connectButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    moreButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
