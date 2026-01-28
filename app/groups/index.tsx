/**
 * Groups List Page
 * Browse all groups the user is part of + discover new ones
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GroupCard } from '../../src/components/groups/GroupCard';
import { Colors } from '../../src/design/colors';
import { useGroupsStore } from '../../src/store/groupsStore';

type FilterTab = 'all' | 'trip' | 'city' | 'interest';

export default function GroupsScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { groups, loadGroups } = useGroupsStore();

    useEffect(() => {
        loadGroups();
    }, []);

    // Filter by type first, then by search query
    const filteredGroups = groups
        .filter((g) => activeFilter === 'all' || g.type === activeFilter)
        .filter((g) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                g.name.toLowerCase().includes(query) ||
                g.description.toLowerCase().includes(query) ||
                g.destination?.toLowerCase().includes(query)
            );
        });

    const filters: { key: FilterTab; label: string; icon: string }[] = [
        { key: 'all', label: 'All', icon: 'grid-outline' },
        { key: 'trip', label: 'Trips', icon: 'airplane-outline' },
        { key: 'city', label: 'Cities', icon: 'location-outline' },
        { key: 'interest', label: 'Interests', icon: 'heart-outline' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Groups</Text>
                <TouchableOpacity onPress={() => router.push('/groups/create')}>
                    <Ionicons name="add-circle-outline" size={26} color={Colors.primary.main} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color={Colors.text.muted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search groups..."
                        placeholderTextColor={Colors.text.muted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={Colors.text.muted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[
                                styles.filterTab,
                                activeFilter === filter.key && styles.activeFilterTab,
                            ]}
                            onPress={() => setActiveFilter(filter.key)}
                        >
                            <Ionicons
                                name={filter.icon as any}
                                size={16}
                                color={activeFilter === filter.key ? '#FFF' : Colors.text.secondary}
                            />
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === filter.key && styles.activeFilterText,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Your Groups */}
                <Text style={styles.sectionTitle}>Your Groups</Text>

                {filteredGroups.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color={Colors.text.muted} />
                        <Text style={styles.emptyTitle}>No groups yet</Text>
                        <Text style={styles.emptyText}>
                            Create a trip squad or join a community
                        </Text>
                        <TouchableOpacity
                            style={styles.createBtn}
                            onPress={() => router.push('/groups/create')}
                        >
                            <Ionicons name="add" size={18} color="#FFF" />
                            <Text style={styles.createBtnText}>Create Group</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    filteredGroups.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))
                )}

                {/* Discover Section */}
                <View style={styles.discoverSection}>
                    <View style={styles.discoverHeader}>
                        <Text style={styles.sectionTitle}>Discover</Text>
                        <TouchableOpacity onPress={() => router.push('/groups/discover')}>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.discoverCard}
                        onPress={() => router.push('/groups/discover')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="search" size={24} color={Colors.primary.main} />
                        <View style={styles.discoverInfo}>
                            <Text style={styles.discoverTitle}>Find your tribe</Text>
                            <Text style={styles.discoverText}>
                                Groups at your next destination, with your friends, matching your interests
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
                    </TouchableOpacity>

                    {/* Suggested group highlight */}
                    <View style={styles.suggestionCard}>
                        <View style={styles.suggestionBadge}>
                            <Ionicons name="sparkles" size={12} color="#F59E0B" />
                            <Text style={styles.suggestionBadgeText}>3 friends are members</Text>
                        </View>
                        <Text style={styles.suggestionName}>Tokyo Digital Nomads 🇯🇵</Text>
                        <Text style={styles.suggestionDesc}>
                            You're going to Tokyo - join 234 nomads already there
                        </Text>
                        <TouchableOpacity
                            style={styles.joinBtn}
                            onPress={() => {
                                // Show alert for demo - in production would send join request
                                alert('Join request sent to Tokyo Digital Nomads!');
                            }}
                        >
                            <Text style={styles.joinBtnText}>Request to Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
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
        paddingVertical: 0,
    },
    filterContainer: {
        backgroundColor: '#FFF',
        paddingBottom: 12,
    },
    filterScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
    },
    activeFilterTab: {
        backgroundColor: Colors.primary.main,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    activeFilterText: {
        color: '#FFF',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFF',
        borderRadius: 16,
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
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 16,
    },
    createBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
    },
    discoverSection: {
        marginTop: 24,
    },
    discoverHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 13,
        color: Colors.primary.main,
        fontWeight: '600',
    },
    discoverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    discoverInfo: {
        flex: 1,
        marginLeft: 12,
    },
    discoverTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    discoverText: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    suggestionCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    suggestionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    suggestionBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#B45309',
    },
    suggestionName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    suggestionDesc: {
        fontSize: 13,
        color: Colors.text.secondary,
        marginTop: 4,
    },
    joinBtn: {
        backgroundColor: Colors.primary.main,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
    },
    joinBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
    },
});
