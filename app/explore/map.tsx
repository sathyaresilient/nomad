/**
 * Map-First Exploration Screen
 * Discover travelers, local guides, and events on a map
 * Uses static map on web, react-native-maps on native
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Lisbon coordinates
const LISBON_REGION = {
    latitude: 38.7223,
    longitude: -9.1393,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

// Filter types
type FilterType = 'travelers' | 'guides' | 'events';

// Mock traveler data
const TRAVELERS_ON_MAP = [
    {
        id: 'sarah-jenkins',
        name: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?u=sarah-j',
        location: 'San Francisco, CA',
        badge: 'NIGHT OWL',
        badgeColor: '#10B981',
        tags: ['NOMAD', 'Digital Nomad', 'Foodie'],
        overlapDays: 12,
        distance: '0.8 km',
        coordinate: { latitude: 38.7169, longitude: -9.1399 },
        positionTop: 55,
        positionLeft: 45,
    },
    {
        id: 'marco',
        name: 'Marco Rivera',
        avatar: 'https://i.pravatar.cc/150?u=marco',
        location: 'Barcelona, Spain',
        badge: 'EARLY BIRD',
        badgeColor: '#F59E0B',
        tags: ['Remote Worker', 'Surfer'],
        overlapDays: 8,
        distance: '1.2 km',
        coordinate: { latitude: 38.7256, longitude: -9.1503 },
        positionTop: 35,
        positionLeft: 30,
    },
    {
        id: 'emma',
        name: 'Emma Chen',
        avatar: 'https://i.pravatar.cc/150?u=emma-c',
        location: 'Tokyo, Japan',
        badge: null,
        badgeColor: null,
        tags: ['Photographer', 'Vegan'],
        overlapDays: 5,
        distance: '2.1 km',
        coordinate: { latitude: 38.7290, longitude: -9.1280 },
        positionTop: 40,
        positionLeft: 65,
    },
];

// Filter chip component
const FilterChip: React.FC<{
    label: string;
    icon: string;
    isActive: boolean;
    onPress: () => void;
    activeColor?: string;
}> = ({ label, icon, isActive, onPress, activeColor = '#2A9D8F' }) => (
    <TouchableOpacity
        style={[
            styles.filterChip,
            isActive && { backgroundColor: activeColor, borderColor: activeColor }
        ]}
        onPress={onPress}
    >
        <Ionicons
            name={icon as any}
            size={14}
            color="#FFF"
        />
        <Text style={[styles.filterChipText, isActive && { color: '#FFF' }]}>
            {label}
        </Text>
    </TouchableOpacity>
);

// Map Pin component (for web static map)
const MapPin: React.FC<{
    traveler: typeof TRAVELERS_ON_MAP[0];
    isSelected: boolean;
    onPress: () => void;
}> = ({ traveler, isSelected, onPress }) => (
    <TouchableOpacity
        style={[
            styles.mapPin,
            { top: `${traveler.positionTop}%`, left: `${traveler.positionLeft}%` },
            isSelected && styles.mapPinSelected
        ]}
        onPress={onPress}
    >
        <Image source={{ uri: traveler.avatar }} style={styles.mapPinAvatar} />
        {isSelected && (
            <View style={styles.mapPinLabel}>
                <Text style={styles.mapPinName}>{traveler.name.split(' ')[0]}</Text>
            </View>
        )}
    </TouchableOpacity>
);

export default function MapExploreScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<FilterType[]>(['travelers']);
    const [selectedTraveler, setSelectedTraveler] = useState<typeof TRAVELERS_ON_MAP[0] | null>(TRAVELERS_ON_MAP[0]);

    const toggleFilter = (filter: FilterType) => {
        if (activeFilters.includes(filter)) {
            setActiveFilters(activeFilters.filter(f => f !== filter));
        } else {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    const handleConnect = () => {
        if (selectedTraveler) {
            router.push(`/profile/${selectedTraveler.id}`);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Map Background - Embedded OpenStreetMap via iframe for web */}
            {Platform.OS === 'web' ? (
                <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-9.18%2C38.69%2C-9.10%2C38.75&layer=mapnik"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                />
            ) : (
                <View style={[styles.mapBackground, { backgroundColor: '#E5E3DF' }]} />
            )}

            {/* Map Pins */}
            {activeFilters.includes('travelers') && TRAVELERS_ON_MAP.map(traveler => (
                <MapPin
                    key={traveler.id}
                    traveler={traveler}
                    isSelected={selectedTraveler?.id === traveler.id}
                    onPress={() => setSelectedTraveler(traveler)}
                />
            ))}

            {/* Dark Overlay for Top */}
            <View style={styles.topOverlay}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Lisbon..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersRow}
                >
                    <FilterChip
                        label="Travelers"
                        icon="people"
                        isActive={activeFilters.includes('travelers')}
                        onPress={() => toggleFilter('travelers')}
                        activeColor="#2A9D8F"
                    />
                    <FilterChip
                        label="Local Guides"
                        icon="star"
                        isActive={activeFilters.includes('guides')}
                        onPress={() => toggleFilter('guides')}
                        activeColor="#F59E0B"
                    />
                    <FilterChip
                        label="Events"
                        icon="calendar"
                        isActive={activeFilters.includes('events')}
                        onPress={() => toggleFilter('events')}
                        activeColor="#8B5CF6"
                    />
                </ScrollView>
            </View>

            {/* Bottom Card */}
            {selectedTraveler && (
                <View style={styles.bottomCard}>
                    <View style={styles.cardHeader}>
                        <Image source={{ uri: selectedTraveler.avatar }} style={styles.cardAvatar} />
                        <View style={styles.cardInfo}>
                            <View style={styles.cardNameRow}>
                                <Text style={styles.cardName}>{selectedTraveler.name}</Text>
                                {selectedTraveler.badge && (
                                    <View style={[styles.badge, { backgroundColor: `${selectedTraveler.badgeColor}20` }]}>
                                        <Ionicons name="moon" size={10} color={selectedTraveler.badgeColor || '#64748B'} />
                                        <Text style={[styles.badgeText, { color: selectedTraveler.badgeColor || '#64748B' }]}>
                                            {selectedTraveler.badge}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.cardLocation}>{selectedTraveler.location}</Text>
                        </View>
                    </View>

                    {/* Tags */}
                    <View style={styles.tagsRow}>
                        {selectedTraveler.tags.map((tag, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tag,
                                    index === 0 && { backgroundColor: '#2A9D8F', borderColor: '#2A9D8F' }
                                ]}
                            >
                                <Text style={[styles.tagText, index === 0 && { color: '#FFF' }]}>{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Ionicons name="sync" size={14} color="#64748B" />
                            <Text style={styles.statText}>
                                Overlaps for <Text style={styles.statBold}>{selectedTraveler.overlapDays} days</Text>
                            </Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="location" size={14} color="#64748B" />
                            <Text style={styles.statText}>{selectedTraveler.distance} away</Text>
                        </View>
                    </View>

                    {/* Connect Button */}
                    <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
                        <Ionicons name="person-add" size={16} color="#FFF" />
                        <Text style={styles.connectButtonText}>
                            Connect with {selectedTraveler.name.split(' ')[0]}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E293B',
    },
    mapBackground: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },

    // Map Pins
    mapPin: {
        position: 'absolute',
        alignItems: 'center',
        zIndex: 5,
    },
    mapPinSelected: {
        zIndex: 10,
        transform: [{ scale: 1.15 }],
    },
    mapPinAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: '#2A9D8F',
        backgroundColor: '#FFF',
    },
    mapPinLabel: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
    },
    mapPinName: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },

    // Top Overlay
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Filters
    filtersRow: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFF',
    },

    // Bottom Card
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 34,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 14,
    },
    cardInfo: {
        flex: 1,
    },
    cardNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    cardName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    cardLocation: {
        fontSize: 13,
        color: '#64748B',
    },

    // Tags
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 13,
        color: '#64748B',
    },
    statBold: {
        fontWeight: '700',
        color: '#1E293B',
    },

    // Connect Button
    connectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2A9D8F',
        paddingVertical: 16,
        borderRadius: 14,
    },
    connectButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
