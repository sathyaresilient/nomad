import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { mockUsers } from '../../data/mockUsers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export const TrustPassportCard = () => {
    const user = mockUsers[0]; // Alex

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLabel}>TRUST CREDENTIAL</Text>
                    <View style={styles.headerLine} />
                </View>
                <Ionicons name="globe-outline" size={24} color="#64748B" />
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-done" size={14} color="#000" />
                    </View>
                </View>
                <Text style={styles.name}>{user.displayName}</Text>
                <View style={styles.verifiedRow}>
                    <Text style={styles.verifiedText}>NOMAD PASS VERIFIED</Text>
                    <Ionicons name="shield-checkmark" size={12} color="#F59E0B" />
                </View>
            </View>

            {/* Stats Box */}
            <View style={styles.statsBox}>
                <View style={styles.statCol}>
                    <View style={styles.ratingRow}>
                        <Text style={styles.statValue}>4.9</Text>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                    </View>
                    <Text style={styles.statLabel}>24 REVIEWS</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.statCol}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>MEETUPS</Text>
                </View>
            </View>

            {/* Footer Stat (Cities) */}
            <View style={styles.citiesRow}>
                <Ionicons name="airplane-outline" size={14} color="#94A3B8" />
                <Text style={styles.citiesText}>
                    Visited <Text style={{ color: '#FFF' }}>4 Cities</Text> this year
                </Text>
            </View>

            {/* AI Personas */}
            <View style={styles.personaSection}>
                <Text style={styles.personaTitle}>AI TRAVEL PERSONAS</Text>
                <View style={styles.personaRow}>
                    <View style={styles.personaChip}>
                        <Text style={styles.chipText}>The Planner</Text>
                    </View>
                    <View style={styles.personaChip}>
                        <Text style={styles.chipText}>Chill Vibe</Text>
                    </View>
                    <View style={styles.personaChip}>
                        <Text style={styles.chipText}>Safety-First</Text>
                    </View>
                </View>
            </View>

            {/* Bottom Footer */}
            <View style={styles.footer}>
                <View style={styles.divider} />
                <View style={styles.footerContent}>
                    <View>
                        <Text style={styles.idLabel}>ID: RMLY-8842-X</Text>
                        <View style={styles.brandRow}>
                            <View style={styles.brandIcon}>
                                <Text style={styles.brandLetter}>R</Text>
                            </View>
                            <Text style={styles.brandName}>Nomadly</Text>
                        </View>
                    </View>
                    <Ionicons name="qr-code-outline" size={32} color="#64748B" />
                </View>
            </View>

            {/* Background Dots Pattern (Simulated) */}
            <View style={styles.dotsOverlay} pointerEvents="none">
                {/* In a real implementation, this would be an SVG or repeated image */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: '#172033',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: '#334155',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    headerLabel: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    headerLine: {
        width: 40,
        height: 2,
        backgroundColor: '#C2410C', // Orange accent
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 24, // Squircle-ish
        borderWidth: 2,
        borderColor: '#334155',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: '#F59E0B',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#172033',
    },
    name: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    verifiedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    verifiedText: {
        color: '#F59E0B',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statsBox: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    statCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#334155',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },
    statValue: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    statLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: '600',
    },
    citiesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        backgroundColor: '#0F172A',
        borderRadius: 12,
        marginBottom: 32,
    },
    citiesText: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '500',
    },
    personaSection: {
        marginBottom: 40,
    },
    personaTitle: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 12,
    },
    personaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    personaChip: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipText: {
        color: '#CBD5E1',
        fontSize: 12,
    },
    footer: {
        marginTop: 'auto',
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginBottom: 16,
        opacity: 0.5,
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    idLabel: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Courier',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandIcon: {
        width: 16,
        height: 16,
        backgroundColor: '#334155',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandLetter: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    brandName: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '700',
    },
    dotsOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.05,
        // Just a placeholder for the texture pattern
    },
});
