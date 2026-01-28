import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { SocialLinkRow } from '../../src/components/verification/SocialLinkRow';
import { VerificationBenefitCard } from '../../src/components/verification/VerificationBenefitCard';
import { Colors } from '../../src/design/colors';
import { useVerificationStore } from '../../src/store/verificationStore';

export default function NomadPassScreen() {
    const router = useRouter();
    const { status, socials, linkSocial } = useVerificationStore();

    const isVerified = status === 'verified';

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    // We use a custom header or SafeAreaView for this modal-like flow
                }}
            />
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="close" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nomad Pass</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                    {/* Hero Status */}
                    <View style={styles.heroSection}>
                        <View style={[styles.shieldContainer, isVerified && styles.shieldVerified]}>
                            <Ionicons
                                name={isVerified ? "shield-checkmark" : "shield-checkmark-outline"}
                                size={64}
                                color={isVerified ? "#FFF" : Colors.primary.main}
                            />
                            {isVerified && (
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedText}>VERIFIED</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.heroTitle}>
                            {isVerified ? "You're Verified!" : "Unlock Your Nomad Pass"}
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            Build trust with the community and unlock full access to exclusive events.
                        </Text>
                    </View>

                    {/* Benefits Row */}
                    <View style={styles.benefitsRow}>
                        <VerificationBenefitCard
                            icon="diamond-outline"
                            title="Higher Trust"
                            description="Get a badge that signals trust to travelers."
                        />
                        <View style={{ width: 12 }} />
                        <VerificationBenefitCard
                            icon="ticket-outline"
                            title="Exclusive Access"
                            description="Unlock local meetups and nomad events."
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Level 1: Core Verification */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>LEVEL 1: CORE VERIFICATION</Text>
                        <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedText}>RECOMMENDED</Text>
                        </View>
                    </View>

                    <View style={[styles.card, isVerified && styles.cardVerified]}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardIcon}>
                                <Ionicons name="id-card-outline" size={24} color={Colors.text.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>Government ID</Text>
                                <Text style={styles.cardSubtitle}>
                                    Scan your passport or ID card to receive the verified Blue Checkmark.
                                </Text>
                            </View>
                        </View>

                        {isVerified ? (
                            <View style={styles.successRow}>
                                <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
                                <Text style={styles.successText}>Verification Complete</Text>
                            </View>
                        ) : (
                            <Button
                                title="Start ID Scan"
                                onPress={() => router.push('/verification/scan')}
                                variant="primary"
                                icon="scan-outline"
                            />
                        )}

                        <View style={styles.secureFooter}>
                            <Ionicons name="lock-closed" size={12} color={Colors.text.muted} />
                            <Text style={styles.secureText}>Encrypted & never shared without permission</Text>
                        </View>
                    </View>

                    {/* Level 2: Social Proof */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>LEVEL 2: SOCIAL PROOF</Text>
                    </View>

                    <SocialLinkRow
                        icon="logo-linkedin"
                        label="LinkedIn"
                        subLabel="Connect your professional profile"
                        isConnected={socials.linkedin}
                        brandColor="#0077B5"
                        onPress={() => linkSocial('linkedin')}
                    />
                    <SocialLinkRow
                        icon="logo-instagram"
                        label="Instagram"
                        subLabel="Share your travel moments"
                        isConnected={socials.instagram}
                        brandColor="#E4405F"
                        onPress={() => linkSocial('instagram')}
                    />
                    <SocialLinkRow
                        icon="logo-github"
                        label="GitHub"
                        subLabel="Show verification for devs"
                        isConnected={socials.github}
                        brandColor="#333"
                        onPress={() => linkSocial('github')}
                    />

                    <Text style={styles.disclaimer}>
                        By verifying, you agree to Nomadly's Terms of Service. Your details are processed securely for identity verification purposes only.
                    </Text>

                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    skipText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.muted,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    shieldContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0F2F1', // Light teal
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    shieldVerified: {
        backgroundColor: Colors.status.success,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: '80%',
    },
    benefitsRow: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.text.muted,
        letterSpacing: 1,
    },
    recommendedBadge: {
        backgroundColor: '#E0F2F1', // Light teal
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    recommendedText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.primary.dark,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 32,
    },
    cardVerified: {
        borderColor: Colors.status.success,
        backgroundColor: '#F0FDF4', // Light green bg
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: Colors.text.secondary,
        lineHeight: 18,
    },
    secureFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 6,
    },
    secureText: {
        fontSize: 11,
        color: Colors.text.muted,
    },
    successRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    successText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.status.success,
    },
    disclaimer: {
        fontSize: 11,
        color: Colors.text.muted,
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 16,
        paddingHorizontal: 20,
    },
});
