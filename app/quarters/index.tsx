import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHousingStore } from '../../src/store/housingStore';

export default function NomadQuartersScreen() {
    const router = useRouter();
    const { listings } = useHousingStore();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>

                {/* Header Title */}
                <View style={styles.topHeader}>
                    <View>
                        <Text style={styles.exploreLabel}>EXPLORE</Text>
                        <Text style={styles.pageTitle}>Find trusted quarters</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity style={styles.filterBtn} onPress={() => router.push('/quarters/dashboard')}>
                            <Ionicons name="home" size={20} color="#1E293B" />
                        </TouchableOpacity>
                        <View style={styles.filterBtn}>
                            <Ionicons name="options" size={20} color="#1E293B" />
                        </View>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#F97316" />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.searchMain}>Anywhere</Text>
                            <Text style={styles.searchSub}>Any week • Add guests</Text>
                        </View>
                        <View style={styles.goBtn}>
                            <Ionicons name="arrow-forward" size={16} color="#FFF" />
                        </View>
                    </View>
                </View>

                {/* Vibe Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    <TouchableOpacity style={styles.pillBtn}>
                        <Text style={styles.pillText}>Dates</Text>
                        <Ionicons name="chevron-down" size={12} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pillBtn}>
                        <Text style={styles.pillText}>Guests</Text>
                        <Ionicons name="chevron-down" size={12} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.vibePill}>
                        <Text style={styles.vibeText}>Vibe: Creative</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pillBtn}>
                        <Text style={styles.pillText}>Verified</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Listings Feed */}
                <ScrollView contentContainerStyle={styles.feed}>
                    {listings.map(listing => (
                        <View key={listing.id} style={styles.card}>
                            {/* Image */}
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: listing.images[0] }} style={styles.cardImage} />
                                <View style={styles.tagBadge}>
                                    <Ionicons name="laptop-outline" size={12} color="#FFF" />
                                    <Text style={styles.tagText}>TECH NOMAD</Text>
                                </View>
                                <TouchableOpacity style={styles.heartBtn}>
                                    <Ionicons name="heart" size={16} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            {/* Content */}
                            <View style={styles.cardContent}>
                                <View style={styles.hostRow}>
                                    <Image source={{ uri: `https://i.pravatar.cc/150?u=${listing.hostId}` }} style={styles.hostAvatar} />
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            <Text style={styles.hostName}>Marcus D.</Text>
                                            <Text style={styles.superHost}>• Superhost</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            <Ionicons name="star" size={10} color="#F97316" />
                                            <Text style={styles.rating}>4.9 (12 reviews)</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.listingTitle}>Co-work with a Local Techie</Text>
                                <Text style={styles.listingDesc}>
                                    Software engineer living in Lisbon. Setup includes dual monitors, fiber internet, and...
                                </Text>

                                <View style={styles.featRow}>
                                    <View style={styles.featBadge}><Text style={styles.featText}>1Gbps Fiber</Text></View>
                                    <View style={styles.featBadge}><Text style={styles.featText}>Dual Monitors</Text></View>
                                </View>

                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={12} color="#64748B" />
                                    <Text style={styles.locText}>Lisbon, PT</Text>
                                </View>

                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>${Math.floor(listing.price / 30)}<Text style={styles.night}> /night</Text></Text>
                                    <TouchableOpacity style={styles.bookBtn} onPress={() => alert(`Booking request sent! The host will respond within 24 hours.`)}>
                                        <Ionicons name="mail" size={14} color="#FFF" />
                                        <Text style={styles.bookText}>Request to Book</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    exploreLabel: {
        fontSize: 10,
        color: '#F97316',
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
    },
    filterBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginVertical: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        padding: 8,
        paddingLeft: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12, // High elevation for floating look
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    searchMain: {
        fontWeight: '700',
        color: '#1E293B',
        fontSize: 14,
    },
    searchSub: {
        color: '#94A3B8',
        fontSize: 12,
    },
    goBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterRow: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    pillBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 8,
        gap: 4,
    },
    pillText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    vibePill: {
        backgroundColor: '#FFF1F2', // Light Pink
        borderColor: '#FDA4AF',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    vibeText: {
        color: '#E11D48',
        fontSize: 12,
        fontWeight: '600',
    },
    feed: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    tagBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(234, 88, 12, 0.9)', // Orange
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tagText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    heartBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        padding: 16,
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    hostAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#F97316',
    },
    hostName: {
        fontWeight: '700',
        fontSize: 14,
        color: '#1E293B',
    },
    superHost: {
        fontSize: 10,
        color: '#64748B',
    },
    rating: {
        fontSize: 10,
        color: '#F97316',
        fontWeight: '600',
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    listingDesc: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 18,
        marginBottom: 12,
    },
    featRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    featBadge: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    featText: {
        fontSize: 10,
        color: '#64748B',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
    },
    locText: {
        fontSize: 12,
        color: '#64748B',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    night: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '400',
    },
    bookBtn: {
        backgroundColor: '#F97316',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bookText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
});
