import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PassportPage } from '../../src/components/profile/PassportPage';

export default function ShareProfileScreen() {
    const router = useRouter();

    const handleShare = () => {
        // Mock share action
        Alert.alert("Sharing Initiated", "This would generate the image and open social share sheet.");
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Export Trust Passport</Text>
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.previewText}>Preview</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* The Card Preview */}
                    <View style={styles.cardContainer}>
                        <PassportPage />
                    </View>

                    {/* Persona Badges Section (Outside Card as per image) */}
                    <View style={styles.badgesContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={styles.badgesTitle}>Persona Badges</Text>
                            <Text style={styles.verifiedAi}>VERIFIED BY AI</Text>
                        </View>
                        <View style={styles.badgeRow}>
                            {/* Badge 1 */}
                            <View style={styles.badgeCard}>
                                <View style={[styles.badgeIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <Ionicons name="compass" size={20} color="#D97706" />
                                </View>
                                <View>
                                    <Text style={styles.badgeName}>Navigator</Text>
                                    <Text style={styles.badgeLevel}>Expert Level</Text>
                                </View>
                            </View>

                            {/* Badge 2 */}
                            <View style={styles.badgeCard}>
                                <View style={[styles.badgeIcon, { backgroundColor: '#ECFCCB' }]}>
                                    <Ionicons name="people" size={20} color="#65A30D" />
                                </View>
                                <View>
                                    <Text style={styles.badgeName}>Connector</Text>
                                    <Text style={styles.badgeLevel}>Top 5%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                        <Ionicons name="share-outline" size={20} color="#FFF" />
                        <Text style={styles.shareText}>Share to Story</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.downloadBtn}>
                        <Ionicons name="download-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    closeBtn: {
        padding: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    previewText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        paddingVertical: 20,
    },
    cardContainer: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    badgesContainer: {
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    badgesTitle: {
        fontSize: 18, // Large serif-like header
        fontWeight: '700',
        color: '#FFF',
        fontFamily: 'Georgia', // Using system serif for "Persona Badges" look
    },
    verifiedAi: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 1,
        marginTop: 6,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    badgeCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    badgeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeName: {
        color: '#0F172A',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'Georgia',
    },
    badgeLevel: {
        color: '#64748B',
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#1E293B',
    },
    shareBtn: {
        flex: 1,
        backgroundColor: '#1E3A8A', // Dark Blue
        borderRadius: 24,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    shareText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    downloadBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1E293B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
});
