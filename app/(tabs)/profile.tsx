/**
 * Profile Screen - Passport Style
 * "Republic of Nomadly" Trust Document Design
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { VisaStamp } from '../../src/components/passport/VisaStamp';
import { currentUser } from '../../src/data/mockUsers';

// Extract user name parts
const getNameParts = (displayName: string) => {
    const parts = displayName.split(' ');
    return {
        surname: parts[parts.length - 1]?.toUpperCase() || 'SMITH',
        givenNames: parts.slice(0, -1).join(' ').toUpperCase() || 'ALEXANDER',
    };
};

export default function ProfileScreen() {
    const router = useRouter();
    const { surname, givenNames } = getNameParts(currentUser.displayName);

    // Generate MRZ-like code
    const mrzLine1 = `P<ROAM${surname}<<${givenNames.replace(/ /g, '<')}${'<'.repeat(20)}`.substring(0, 44);
    const mrzLine2 = `RM8821X340ROAM${'0'.repeat(6)}2810123M2810123${'<'.repeat(6)}98`;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#4B5563" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>PASSPORT</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity onPress={() => router.push('/settings')}>
                            <Ionicons name="settings-outline" size={22} color="#4B5563" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/profile/share')}>
                            <Ionicons name="share-outline" size={22} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Passport Document Card */}
                    <View style={styles.passportCard}>
                        {/* Document Header */}
                        <View style={styles.docHeader}>
                            <View>
                                <Text style={styles.republicTitle}>REPUBLIC OF NOMADLY</Text>
                                <Text style={styles.docSubtitle}>NOMAD PASS • TRUST DOCUMENT</Text>
                            </View>
                            <View style={styles.verifiedSeal}>
                                <Ionicons name="shield-checkmark" size={18} color="#4B8A6E" />
                            </View>
                        </View>

                        {/* Personal Info Section */}
                        <View style={styles.personalSection}>
                            <View style={styles.photoFrame}>
                                <Image
                                    source={{ uri: currentUser.avatarUrl }}
                                    style={styles.passportPhoto}
                                />
                            </View>
                            <View style={styles.infoColumn}>
                                <Text style={styles.fieldLabel}>SURNAME / NOM</Text>
                                <Text style={styles.fieldValue}>{surname}</Text>

                                <Text style={styles.fieldLabel}>GIVEN NAMES / PRÉNOMS</Text>
                                <Text style={styles.fieldValue}>{givenNames || 'ALEXANDER'}</Text>

                                <View style={styles.infoRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.fieldLabel}>ISSUE DATE</Text>
                                        <Text style={styles.fieldValueSmall}>12 OCT 23</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.fieldLabel}>ID NO.</Text>
                                        <Text style={styles.fieldValueSmall}>RM-8821</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Reputation Score */}
                        <View style={styles.reputationSection}>
                            <Text style={styles.reputationLabel}>GLOBAL REPUTATION SCORE</Text>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreBig}>98</Text>
                                <Text style={styles.scoreSmall}>/100</Text>
                            </View>
                        </View>

                        {/* Visa Stamps Section */}
                        <View style={styles.visaSection}>
                            <Text style={styles.sectionLabel}>VISAS & ENDORSEMENTS</Text>
                            <View style={styles.stampGrid}>
                                <VisaStamp
                                    country="INDONESIA"
                                    city="BALI"
                                    date="14 FEB 24"
                                    style="circle"
                                    color="#6B7280"
                                />
                                <VisaStamp
                                    country="EU"
                                    city="LISBON"
                                    date="ENTRY 2021"
                                    style="rectangle"
                                    color="#DC2626"
                                />
                                <VisaStamp
                                    country="COLOMBIA"
                                    city="MEDELLÍN"
                                    date=""
                                    style="circle"
                                    color="#16A34A"
                                />
                                <VisaStamp
                                    country="JAPAN"
                                    city="KYOTO"
                                    date=""
                                    style="faded"
                                />
                            </View>
                        </View>

                        {/* MRZ Zone */}
                        <View style={styles.mrzZone}>
                            <Text style={styles.mrzText}>{mrzLine1}</Text>
                            <Text style={styles.mrzText}>{mrzLine2}</Text>
                        </View>
                    </View>

                    {/* Get Verified Section */}
                    <TouchableOpacity
                        style={styles.verifyCard}
                        onPress={() => router.push('/verification/start')}
                    >
                        <View style={styles.verifyIconContainer}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="#2A9D8F" />
                        </View>
                        <View style={styles.verifyContent}>
                            <Text style={styles.verifyTitle}>Get Verified</Text>
                            <Text style={styles.verifySubtitle}>Complete verification to unlock all features</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Persona Badges Section */}
                    <View style={styles.badgesSection}>
                        <Text style={styles.badgesSectionLabel}>Persona Badges</Text>
                        <Text style={styles.verifiedByAI}>VERIFIED BY AI</Text>
                    </View>
                    <View style={styles.badgeRow}>
                        <View style={styles.personaBadge}>
                            <View style={[styles.badgeIcon, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="compass" size={16} color="#10B981" />
                            </View>
                            <View>
                                <Text style={styles.badgeName}>Navigator</Text>
                                <Text style={styles.badgeLevel}>Expert Level</Text>
                            </View>
                        </View>
                        <View style={styles.personaBadge}>
                            <View style={[styles.badgeIcon, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="git-network" size={16} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={styles.badgeName}>Connector</Text>
                                <Text style={styles.badgeLevel}>Top 5%</Text>
                            </View>
                        </View>
                    </View>

                    {/* Share Button */}
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={() => router.push('/profile/share')}
                    >
                        <Ionicons name="share-social" size={18} color="#FFF" />
                        <Text style={styles.shareButtonText}>Share Trust Card</Text>
                    </TouchableOpacity>

                    {/* Debug Links */}
                    <View style={styles.debugLinks}>
                        <TouchableOpacity
                            style={styles.debugRow}
                            onPress={() => router.push('/verification/meetup-success')}
                        >
                            <Text style={styles.debugText}>View Meetup Success (Debug)</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.debugRow}
                            onPress={() => router.push('/trips/itinerary')}
                        >
                            <Text style={styles.debugText}>View Smart Itinerary (Debug)</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E4DF', // Cream/passport background
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
        color: '#374151',
        letterSpacing: 2,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },

    // Passport Card
    passportCard: {
        backgroundColor: '#FAF9F6', // Off-white paper
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    docHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 16,
    },
    republicTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#374151',
        letterSpacing: 1,
    },
    docSubtitle: {
        fontSize: 9,
        color: '#9CA3AF',
        marginTop: 2,
        letterSpacing: 0.5,
    },
    verifiedSeal: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#4B8A6E',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Personal Info
    personalSection: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    photoFrame: {
        width: 90,
        height: 110,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderStyle: 'dashed',
        padding: 4,
        borderRadius: 4,
    },
    passportPhoto: {
        width: '100%',
        height: '100%',
        borderRadius: 2,
    },
    infoColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    fieldLabel: {
        fontSize: 8,
        color: '#9CA3AF',
        letterSpacing: 0.5,
        marginBottom: 2,
        marginTop: 8,
    },
    fieldValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    fieldValueSmall: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    infoRow: {
        flexDirection: 'row',
        marginTop: 8,
    },

    // Reputation
    reputationSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 20,
    },
    reputationLabel: {
        fontSize: 10,
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    scoreBig: {
        fontSize: 32,
        fontWeight: '700',
        color: '#4B8A6E',
    },
    scoreSmall: {
        fontSize: 14,
        color: '#9CA3AF',
        marginLeft: 2,
    },

    // Visa Stamps
    visaSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 9,
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 16,
    },
    stampGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },

    // MRZ
    mrzZone: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 4,
        marginTop: 16,
    },
    mrzText: {
        fontFamily: 'monospace',
        fontSize: 9,
        color: '#374151',
        letterSpacing: 1,
    },

    // Badges Section
    badgesSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    badgesSectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    verifiedByAI: {
        fontSize: 9,
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    personaBadge: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    badgeIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
    },
    badgeLevel: {
        fontSize: 10,
        color: '#9CA3AF',
    },

    // Share Button
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2A9D8F',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    shareButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },

    // Debug
    debugLinks: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 4,
    },
    debugRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
    },
    debugText: {
        fontSize: 14,
        color: '#4B5563',
    },

    // Verify Card
    verifyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDFA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#99F6E4',
    },
    verifyIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#CCFBF1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    verifyContent: {
        flex: 1,
    },
    verifyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F766E',
        marginBottom: 2,
    },
    verifySubtitle: {
        fontSize: 13,
        color: '#5EEAD4',
    },
});
