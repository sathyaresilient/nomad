import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/design/colors';
import { useTripStore } from '../../src/store/tripStore';

const cityImages: Record<string, string> = {
    'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
};

export default function TripDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { myTrips } = useTripStore();

    const trip = myTrips.find(t => t.id === id);

    if (!trip) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trip Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyState}>
                    <Ionicons name="airplane-outline" size={48} color="#94A3B8" />
                    <Text style={styles.emptyText}>Trip not found</Text>
                </View>
            </View>
        );
    }

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Trip Details</Text>
                <TouchableOpacity onPress={() => {
                    Alert.alert('Trip Options', trip.city, [
                        { text: 'Share Trip', onPress: () => Share.share({ message: `I'm traveling to ${trip.city} on Nomadly! Check out my trip.` }) },
                        { text: 'Cancel', style: 'cancel' },
                    ]);
                }}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Image
                    source={{ uri: cityImages[trip.city] || cityImages['Bali'] }}
                    style={styles.heroImage}
                />

                <View style={styles.content}>
                    <Text style={styles.cityName}>{trip.city}</Text>
                    <View style={styles.dateRow}>
                        <Ionicons name="calendar-outline" size={16} color="#64748B" />
                        <Text style={styles.dateText}>
                            {startDate.toLocaleDateString('en-US', options)} - {endDate.toLocaleDateString('en-US', options)}
                        </Text>
                    </View>

                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: trip.status === 'active' ? '#22C55E' : '#F59E0B' }]} />
                        <Text style={styles.statusText}>{trip.status === 'active' ? 'Active' : 'Upcoming'}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nearby Travelers</Text>
                        <Text style={styles.sectionSub}>5 matches found for your dates</Text>
                        <TouchableOpacity style={styles.viewMatchesBtn} onPress={() => router.push('/discover')}>
                            <Text style={styles.viewMatchesBtnText}>View Matches</Text>
                            <Ionicons name="chevron-forward" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trip Board</Text>
                        <TouchableOpacity
                            style={styles.boardBtn}
                            onPress={() => router.push(`/trip-board/${trip.id}`)}
                        >
                            <Ionicons name="clipboard-outline" size={20} color={Colors.primary.main} />
                            <Text style={styles.boardBtnText}>Open Trip Board</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroImage: {
        width: '100%',
        height: 220,
    },
    content: {
        padding: 20,
    },
    cityName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#64748B',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    section: {
        marginTop: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    sectionSub: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
    },
    viewMatchesBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: Colors.primary.main,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 12,
    },
    viewMatchesBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },
    boardBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 16,
        backgroundColor: '#F0FDFA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CCFBF1',
        marginTop: 12,
    },
    boardBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.primary.main,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#94A3B8',
    },
});
