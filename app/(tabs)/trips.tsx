/**
 * My Trips Screen - Light Theme
 * Matching reference design with Active/Upcoming tabs and photo cards
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../../src/design';
import { useAuthStore } from '../../src/store/authStore';
import { useTripStore, Trip } from '../../src/store/tripStore';

// City images for demo
const cityImages: Record<string, string> = {
    'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
};

const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
};

const getDaysUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
};

// Trip Photo Card Component
const TripPhotoCard = ({ trip, isActive }: { trip: Trip; isActive?: boolean }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.tripPhotoCard}
            onPress={() => router.push(`/trips/${trip.id}`)}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: cityImages[trip.city] || cityImages['Bali'] }}
                style={styles.tripImage}
            />
            <View style={styles.tripImageOverlay}>
                {isActive && (
                    <View style={styles.activeNowBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeNowText}>Active Now</Text>
                    </View>
                )}
                <View style={styles.tripInfoOverlay}>
                    <Text style={styles.tripCity}>{trip.city}</Text>
                    <View style={styles.tripDateRow}>
                        <Ionicons name="calendar-outline" size={14} color="white" />
                        <Text style={styles.tripDateText}>
                            {formatDateRange(trip.startDate, trip.endDate)}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.tripFooter}>
                <View style={styles.companionsSection}>
                    <Text style={styles.companionsLabel}>COMPANIONS</Text>
                    <View style={styles.companionAvatars}>
                        {[1, 2, 3].map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.companionAvatar,
                                    { marginLeft: i > 0 ? -8 : 0 },
                                ]}
                            >
                                <View style={styles.companionPlaceholder} />
                            </View>
                        ))}
                        <View style={[styles.companionAvatar, styles.companionCount, { marginLeft: -8 }]}>
                            <Text style={styles.companionCountText}>+5</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewMatchesButton}>
                    <Text style={styles.viewMatchesText}>View Matches</Text>
                    <Ionicons name="chevron-forward" size={16} color={Colors.text.inverse} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

// Upcoming Trip Row Component
const UpcomingTripRow = ({ trip }: { trip: Trip }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.upcomingRow}
            onPress={() => router.push(`/trips/${trip.id}`)}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: cityImages[trip.city] || cityImages['Bali'] }}
                style={styles.upcomingImage}
            />
            <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingCity}>{trip.city}</Text>
                <View style={styles.upcomingDateRow}>
                    <Ionicons name="calendar-outline" size={12} color={Colors.text.muted} />
                    <Text style={styles.upcomingDateText}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
                </View>
                <View style={styles.upcomingMeta}>
                    <View style={styles.matchesBadge}>
                        <Ionicons name="heart" size={12} color={Colors.primary.main} />
                        <Text style={styles.matchesText}>5 Matches</Text>
                    </View>
                    <Text style={styles.daysUntil}>In {getDaysUntil(trip.startDate)} days</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function TripsScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { myTrips, loadMyTrips } = useTripStore();
    const [activeTab, setActiveTab] = useState<'active' | 'upcoming'>('active');

    useEffect(() => {
        if (user) {
            loadMyTrips();
        }
    }, [user]);

    const activeTrips = myTrips.filter(t => t.status === 'active');
    const upcomingTrips = myTrips.filter(t => t.status === 'planning');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My Trips</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => router.push('/trips/new')}
                >
                    <Ionicons name="add" size={18} color={Colors.primary.main} />
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabSwitcher}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentInner}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'active' && (
                    <>
                        {/* Current Adventure */}
                        {activeTrips.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="airplane-outline" size={16} color={Colors.primary.main} />
                                    <Text style={styles.sectionTitle}>CURRENT ADVENTURE</Text>
                                </View>
                                {activeTrips.map(trip => (
                                    <TripPhotoCard key={trip.id} trip={trip} isActive />
                                ))}
                            </View>
                        )}

                        {/* Upcoming Section */}
                        {upcomingTrips.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="calendar-outline" size={16} color={Colors.primary.main} />
                                    <Text style={styles.sectionTitle}>UPCOMING</Text>
                                </View>
                                {upcomingTrips.map(trip => (
                                    <UpcomingTripRow key={trip.id} trip={trip} />
                                ))}
                            </View>
                        )}
                    </>
                )}

                {activeTab === 'upcoming' && (
                    <View style={styles.section}>
                        {upcomingTrips.map(trip => (
                            <UpcomingTripRow key={trip.id} trip={trip} />
                        ))}
                        {upcomingTrips.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No upcoming trips planned</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Plan CTA */}
                <View style={styles.planCta}>
                    <Ionicons name="search-outline" size={24} color={Colors.text.muted} />
                    <Text style={styles.planCtaTitle}>Plan your next adventure</Text>
                    <Text style={styles.planCtaText}>Start matching with travelers early</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Layout.screenPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.text.primary,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.primary.main,
        gap: Spacing.xs,
    },
    createButtonText: {
        ...Typography.label,
        color: Colors.primary.main,
    },
    tabSwitcher: {
        flexDirection: 'row',
        marginHorizontal: Layout.screenPadding,
        backgroundColor: Colors.background.muted,
        borderRadius: BorderRadius.full,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderRadius: BorderRadius.full,
    },
    activeTab: {
        backgroundColor: Colors.background.primary,
    },
    tabText: {
        ...Typography.label,
        color: Colors.text.muted,
    },
    activeTabText: {
        color: Colors.primary.main,
    },
    content: {
        flex: 1,
    },
    contentInner: {
        paddingHorizontal: Layout.screenPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.labelSmall,
        color: Colors.text.muted,
        letterSpacing: 1,
    },

    // Trip Photo Card
    tripPhotoCard: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginBottom: Spacing.lg,
        backgroundColor: Colors.background.elevated,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    tripImage: {
        width: '100%',
        height: 200,
    },
    tripImageOverlay: {
        ...StyleSheet.absoluteFillObject,
        height: 200,
        padding: Spacing.md,
        justifyContent: 'space-between',
    },
    activeNowBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary.main,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
        gap: Spacing.xs,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.text.inverse,
    },
    activeNowText: {
        ...Typography.caption,
        color: Colors.text.inverse,
        fontWeight: '600',
    },
    tripMenuButton: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tripMenuDots: {
        color: Colors.text.primary,
        fontSize: 16,
    },
    tripInfoOverlay: {
        position: 'absolute',
        bottom: Spacing.md,
        left: Spacing.md,
    },
    tripCity: {
        ...Typography.h2,
        color: Colors.text.inverse,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    tripDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    tripDateText: {
        ...Typography.bodySmall,
        color: Colors.text.inverse,
    },
    tripFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    companionsSection: {},
    companionsLabel: {
        ...Typography.caption,
        color: Colors.text.muted,
        marginBottom: Spacing.xs,
        letterSpacing: 0.5,
    },
    companionAvatars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    companionAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.background.primary,
        overflow: 'hidden',
    },
    companionPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background.muted,
    },
    companionCount: {
        backgroundColor: Colors.background.muted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    companionCountText: {
        ...Typography.caption,
        color: Colors.text.secondary,
        fontWeight: '600',
        lineHeight: 28,
        textAlign: 'center',
    },
    viewMatchesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary.main,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        gap: Spacing.xs,
    },
    viewMatchesText: {
        ...Typography.label,
        color: Colors.text.inverse,
    },

    // Upcoming Trip Row
    upcomingRow: {
        flexDirection: 'row',
        padding: Spacing.md,
        backgroundColor: Colors.background.elevated,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    upcomingImage: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.lg,
    },
    upcomingInfo: {
        flex: 1,
        marginLeft: Spacing.md,
        justifyContent: 'center',
    },
    upcomingCity: {
        ...Typography.h4,
        color: Colors.text.primary,
    },
    upcomingDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: 2,
    },
    upcomingDateText: {
        ...Typography.caption,
        color: Colors.text.muted,
    },
    upcomingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
        gap: Spacing.md,
    },
    matchesBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    matchesText: {
        ...Typography.caption,
        color: Colors.primary.main,
        fontWeight: '500',
    },
    daysUntil: {
        ...Typography.caption,
        color: Colors.text.muted,
    },

    // Empty & CTA
    emptyState: {
        alignItems: 'center',
        paddingVertical: Spacing['3xl'],
    },
    emptyText: {
        ...Typography.body,
        color: Colors.text.muted,
    },
    planCta: {
        alignItems: 'center',
        paddingVertical: Spacing['3xl'],
        marginTop: Spacing.xl,
    },
    planCtaTitle: {
        ...Typography.h4,
        color: Colors.text.primary,
        marginTop: Spacing.md,
    },
    planCtaText: {
        ...Typography.bodySmall,
        color: Colors.text.muted,
        marginTop: Spacing.xs,
    },
});
