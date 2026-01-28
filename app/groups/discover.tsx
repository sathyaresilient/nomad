/**
 * Groups Discover Page
 * Find and join new groups based on interests, destinations, and friends
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../src/design/colors';

interface DiscoverGroup {
    id: string;
    name: string;
    type: 'trip' | 'city' | 'interest';
    description: string;
    memberCount: number;
    coverImage?: string;
    destination?: string;
    tags: string[];
    friendsIn?: number;
    isRecommended?: boolean;
}

const DISCOVER_GROUPS: DiscoverGroup[] = [
    {
        id: 'disc-1',
        name: 'Tokyo Digital Nomads 🇯🇵',
        type: 'city',
        description: 'The largest community of remote workers in Tokyo. Coworking tips, events, and meetups.',
        memberCount: 234,
        destination: 'Tokyo',
        tags: ['Coworking', 'Meetups', 'Tech'],
        friendsIn: 3,
        isRecommended: true,
    },
    {
        id: 'disc-2',
        name: 'Bali Feb 2025 Crew 🌴',
        type: 'trip',
        description: 'Planning a month in Bali this February. Villas, coworking, and island hopping!',
        memberCount: 12,
        destination: 'Bali',
        tags: ['Beach', 'Surfing', 'Coliving'],
        friendsIn: 1,
    },
    {
        id: 'disc-3',
        name: 'Remote Work Europe',
        type: 'interest',
        description: 'For digital nomads exploring Europe. Visa tips, best cities, and community events.',
        memberCount: 567,
        tags: ['Europe', 'Visa', 'Community'],
        isRecommended: true,
    },
    {
        id: 'disc-4',
        name: 'Coffee & Code ☕',
        type: 'interest',
        description: 'Find the best cafes with wifi worldwide. Share your favorite work spots!',
        memberCount: 423,
        tags: ['Coffee', 'Coworking', 'Wifi'],
    },
    {
        id: 'disc-5',
        name: 'Lisbon Nomads',
        type: 'city',
        description: 'The hub for remote workers in Lisbon. Weekly meetups and local tips.',
        memberCount: 189,
        destination: 'Lisbon',
        tags: ['Portugal', 'Meetups', 'Local Tips'],
        friendsIn: 5,
    },
    {
        id: 'disc-6',
        name: 'Surf & Work Collective 🏄',
        type: 'interest',
        description: 'Balance laptop time with wave time. Best surf + wifi spots worldwide.',
        memberCount: 342,
        tags: ['Surfing', 'Beach', 'Adventure'],
    },
];

const TYPE_COLORS = {
    trip: { bg: '#FEF3C7', color: '#F59E0B' },
    city: { bg: '#DBEAFE', color: '#3B82F6' },
    interest: { bg: '#FCE7F3', color: '#EC4899' },
};

export default function DiscoverGroupsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'trip' | 'city' | 'interest'>('all');

    const filteredGroups = DISCOVER_GROUPS
        .filter((g) => selectedType === 'all' || g.type === selectedType)
        .filter((g) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                g.name.toLowerCase().includes(query) ||
                g.description.toLowerCase().includes(query) ||
                g.tags.some((t) => t.toLowerCase().includes(query))
            );
        });

    const handleJoinRequest = (group: DiscoverGroup) => {
        Alert.alert(
            'Request Sent!',
            `Your request to join "${group.name}" has been sent. You'll be notified when approved.`,
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Find Your Tribe</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color={Colors.text.muted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name, topic, or destination..."
                        placeholderTextColor={Colors.text.muted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={Colors.text.muted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Type Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
            >
                {[
                    { key: 'all', label: 'All', icon: 'grid-outline' },
                    { key: 'trip', label: 'Trips', icon: 'airplane-outline' },
                    { key: 'city', label: 'Cities', icon: 'location-outline' },
                    { key: 'interest', label: 'Interests', icon: 'heart-outline' },
                ].map((filter) => (
                    <TouchableOpacity
                        key={filter.key}
                        style={[
                            styles.filterChip,
                            selectedType === filter.key && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedType(filter.key as any)}
                    >
                        <Ionicons
                            name={filter.icon as any}
                            size={14}
                            color={selectedType === filter.key ? '#FFF' : Colors.text.secondary}
                        />
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedType === filter.key && styles.filterChipTextActive,
                            ]}
                        >
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Recommended Section */}
                {filteredGroups.some((g) => g.isRecommended) && (
                    <>
                        <Text style={styles.sectionLabel}>RECOMMENDED FOR YOU</Text>
                        {filteredGroups
                            .filter((g) => g.isRecommended)
                            .map((group) => (
                                <GroupDiscoverCard
                                    key={group.id}
                                    group={group}
                                    onJoin={() => handleJoinRequest(group)}
                                />
                            ))}
                    </>
                )}

                {/* All Groups */}
                <Text style={styles.sectionLabel}>EXPLORE GROUPS</Text>
                {filteredGroups
                    .filter((g) => !g.isRecommended)
                    .map((group) => (
                        <GroupDiscoverCard
                            key={group.id}
                            group={group}
                            onJoin={() => handleJoinRequest(group)}
                        />
                    ))}

                {filteredGroups.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={48} color={Colors.text.muted} />
                        <Text style={styles.emptyTitle}>No groups found</Text>
                        <Text style={styles.emptyText}>Try a different search term</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// Group Card Component
const GroupDiscoverCard: React.FC<{ group: DiscoverGroup; onJoin: () => void }> = ({
    group,
    onJoin,
}) => {
    const typeStyle = TYPE_COLORS[group.type];

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.typeIcon, { backgroundColor: typeStyle.bg }]}>
                    <Ionicons
                        name={group.type === 'trip' ? 'airplane' : group.type === 'city' ? 'location' : 'heart'}
                        size={18}
                        color={typeStyle.color}
                    />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{group.name}</Text>
                    <View style={styles.cardMeta}>
                        <Ionicons name="people-outline" size={12} color={Colors.text.muted} />
                        <Text style={styles.cardMetaText}>{group.memberCount} members</Text>
                        {group.destination && (
                            <>
                                <Text style={styles.cardMetaDot}>•</Text>
                                <Ionicons name="location-outline" size={12} color={Colors.text.muted} />
                                <Text style={styles.cardMetaText}>{group.destination}</Text>
                            </>
                        )}
                    </View>
                </View>
            </View>

            <Text style={styles.cardDesc} numberOfLines={2}>{group.description}</Text>

            <View style={styles.cardTags}>
                {group.tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.cardFooter}>
                {group.friendsIn ? (
                    <View style={styles.friendsBadge}>
                        <Ionicons name="people" size={12} color="#F59E0B" />
                        <Text style={styles.friendsBadgeText}>{group.friendsIn} friends</Text>
                    </View>
                ) : (
                    <View />
                )}
                <TouchableOpacity style={styles.joinBtn} onPress={onJoin}>
                    <Text style={styles.joinBtnText}>Request to Join</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    searchContainer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: Colors.text.primary,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
        backgroundColor: '#FFF',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        height: 40,
    },
    filterChipActive: {
        backgroundColor: Colors.primary.main,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    filterChipTextActive: {
        color: '#FFF',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.text.muted,
        letterSpacing: 0.5,
        marginBottom: 12,
        marginTop: 8,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    typeIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    cardMetaText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    cardMetaDot: {
        color: Colors.text.muted,
        marginHorizontal: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: Colors.text.secondary,
        lineHeight: 18,
        marginBottom: 10,
    },
    cardTags: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    friendsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    friendsBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#B45309',
    },
    joinBtn: {
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    joinBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFF',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginTop: 12,
    },
    emptyText: {
        fontSize: 13,
        color: Colors.text.muted,
        marginTop: 4,
    },
});
