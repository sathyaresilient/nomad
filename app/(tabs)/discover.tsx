import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TravelerMatchCard } from '../../src/components/discovery/TravelerMatchCard';
import { mockUsers } from '../../src/data/mockUsers';

const { width } = Dimensions.get('window');

const FILTER_CHIPS = [
    { label: 'Oct 15 - Nov 1', icon: 'calendar-outline' },
    { label: 'Travel Style', icon: 'briefcase-outline' },
    { label: 'Reputation', icon: 'star-outline' },
];

export default function DiscoverFeedScreen() {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <View style={[{ flex: 1 }, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.locationLabel}>CURRENT LOCATION</Text>
                        <View style={styles.locationRow}>
                            <Text style={styles.locationTitle}>Exploring Lisbon, Portugal</Text>
                            <Ionicons name="chevron-down" size={16} color="#1E293B" />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Ionicons name="options" size={20} color="#1E293B" />
                    </TouchableOpacity>
                </View>

                {/* Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                    style={{ maxHeight: 50 }}
                >
                    {FILTER_CHIPS.map((chip, i) => (
                        <TouchableOpacity key={i} style={styles.chip}>
                            <Ionicons name={chip.icon as any} size={14} color="#64748B" />
                            <Text style={styles.chipText}>{chip.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Scrollable Content */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Matches in Lisbon</Text>
                        <Text style={styles.sectionCount}>24 travelers nearby</Text>
                    </View>

                    {/* Sarah Chen Card */}
                    <TravelerMatchCard
                        userId={mockUsers[0].id}
                        name="Sarah Chen"
                        age={28}
                        image={mockUsers[0].avatarUrl!}
                        rating={4.9}
                        trips={24}
                        bio="Coffee lover ☕️ and amateur photographer looking for hidden gems in Alfama. Usually found in coworking cafes."
                        tags={['Photography', 'Hiking', 'Foodie']}
                        dateRange="Oct 15 - Nov 01 (17 Days)"
                        persona="DIGITAL NOMAD"
                        personaColor="#FFDED6" // Light Peach
                    />

                    {/* Marcus Card */}
                    <TravelerMatchCard
                        userId={mockUsers[3].id}
                        name="Marcus Thorne"
                        age={31}
                        image={mockUsers[3].avatarUrl!}
                        rating={5.0}
                        trips={8}
                        bio="Hiking enthusiast 🏔️. Always down for a sunrise trek to Miradouro da Senhora do Monte."
                        tags={['Trekking', 'Nature']}
                        dateRange="Oct 18 - Oct 22"
                        timeLeft="4 Days left"
                        persona="ADVENTURE SEEKER"
                        personaColor="#DBEAFE" // Light Blue
                    />

                    {/* Minimal List Item Backup */}
                    <View style={styles.minimalCard}>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={styles.minimalAvatar} />
                            <View>
                                <Text style={styles.minimalName}>Elena Rodriguez</Text>
                                <Text style={styles.minimalSub}>Backpacker • Overlaps 2 days</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Slate 50
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    locationLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    filterBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipsScroll: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 8,
        backgroundColor: '#FFF',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFF',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    sectionCount: {
        fontSize: 12,
        color: '#64748B',
    },
    minimalCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    minimalAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E2E8F0',
    },
    minimalName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    minimalSub: {
        fontSize: 12,
        color: '#94A3B8',
    },
});
