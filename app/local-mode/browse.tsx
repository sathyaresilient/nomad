import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LocalGuide, LocalGuideCard } from '../../src/components/LocalGuideCard';
import { Colors } from '../../src/design/colors';

// Mock Data
const GUIDES: LocalGuide[] = [
    {
        id: '1',
        name: 'Ana',
        age: 28,
        profession: 'Architect',
        rating: 4.9,
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop',
        tags: [{ label: 'Coffee', icon: '☕' }, { label: 'History', icon: '🏛️' }],
        badges: ['EXPERT'],
    },
    {
        id: '2',
        name: 'Marco',
        age: 32,
        profession: 'Musician',
        rating: 0, // New logic
        isNew: true,
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2576&auto=format&fit=crop',
        tags: [{ label: 'Fado', icon: '🎵' }, { label: 'Wine', icon: '🍷' }],
        badges: [],
    },
    {
        id: '3',
        name: 'Sofia',
        age: 26,
        profession: 'Designer',
        rating: 5.0,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop',
        tags: [{ label: 'Art', icon: '🎨' }, { label: 'Fashion', icon: '👗' }],
        badges: ['EXPERT'],
    },
    {
        id: '4',
        name: 'João',
        age: 30,
        profession: 'Chef',
        rating: 4.8,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
        tags: [{ label: 'Food', icon: '🍳' }, { label: 'Markets', icon: '🥕' }],
        badges: [],
    },
];

export default function BrowseGuidesScreen() {
    const router = useRouter();

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <View style={styles.filterRow}>
                <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                    <Ionicons name="sparkles" size={14} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.filterTextActive}>All Locals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Ionicons name="cafe" size={14} color={Colors.text.secondary} style={{ marginRight: 6 }} />
                    <Text style={styles.filterText}>Coffee</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Ionicons name="walk" size={14} color={Colors.text.secondary} style={{ marginRight: 6 }} />
                    <Text style={styles.filterText}>City Walk</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Verified Locals</Text>
                <Text style={styles.viewMap}>View Map</Text>
            </View>
        </View>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#F8FAFC' },
                    headerTitle: () => (
                        <View>
                            <Text style={{ fontSize: 10, color: Colors.text.muted, fontWeight: '700', letterSpacing: 0.5 }}>EXPLORING</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text.primary, marginRight: 4 }}>Lisbon, Portugal</Text>
                                <Ionicons name="chevron-down" size={14} color={Colors.text.primary} />
                            </View>
                        </View>
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="options-outline" size={20} color={Colors.text.primary} />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerLeft: () => (
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={Colors.text.primary}
                            onPress={() => router.back()}
                            style={{ marginLeft: 0 }}
                        />
                    ),
                }}
            />
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={GUIDES}
                    renderItem={({ item }) => (
                        <View style={styles.columnWrapper}>
                            <LocalGuideCard guide={item} onPress={() => router.push(`/profile/${item.id}`)} />
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.listColumnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderHeader}
                />

                {/* Map Float Button */}
                <View style={styles.floatContainer}>
                    <TouchableOpacity style={styles.mapButton}>
                        <Ionicons name="map" size={18} color={Colors.primary.main} style={{ marginRight: 8 }} />
                        <Text style={styles.mapButtonText}>Browse on Map</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerRight: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    listHeader: {
        marginBottom: 16,
    },
    filterRow: {
        flexDirection: 'row',
        paddingBottom: 24,
        gap: 12,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterChipActive: {
        backgroundColor: '#0D9488', // Primary Teal
        borderColor: '#0D9488',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    filterTextActive: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
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
        color: Colors.text.primary,
    },
    viewMap: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0D9488',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    listColumnWrapper: {
        justifyContent: 'space-between',
        gap: 12,
    },
    columnWrapper: {
        flex: 1,
        maxWidth: '48%'
    },
    floatContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    mapButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
    },
});
