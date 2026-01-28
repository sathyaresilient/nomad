import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacySettingsScreen() {
    const router = useRouter();
    const [radius, setRadius] = useState(0.75); // 0 to 1
    const [stealthMode, setStealthMode] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(true);
    const [mutualOnly, setMutualOnly] = useState(false);

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Privacy & Stealth</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Map Section */}
                <View style={styles.mapSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={18} color="#0EA5E9" />
                        <Text style={styles.sectionTitle}>LOCATION OBFUSCATION</Text>
                    </View>

                    <View style={styles.mapCard}>
                        <ImageBackground
                            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} // Dark map
                            style={styles.mapImage}
                            imageStyle={{ borderRadius: 16, opacity: 0.6 }}
                        >
                            {/* Blue Circle Overlay */}
                            <View style={styles.radiusCircle}>
                                <View style={styles.centerDot} />
                                <View style={styles.publicLabel}>
                                    <Text style={styles.publicText}>PUBLIC</Text>
                                </View>
                            </View>
                        </ImageBackground>

                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderLabelRow}>
                                <Text style={styles.sliderTitle}>Safety Radius Shift</Text>
                                <Text style={styles.sliderValue}>750m</Text>
                            </View>
                            <Text style={styles.sliderDesc}>Offset your location by up to 1km.</Text>

                            {/* Mock Slider Visual */}
                            <View style={styles.sliderTrack}>
                                <View style={[styles.sliderFill, { width: '75%' }]} />
                                <View style={[styles.sliderThumb, { left: '75%' }]} />
                            </View>
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderTick}>PRECISE</Text>
                                <Text style={styles.sliderTick}>500M</Text>
                                <Text style={styles.sliderTick}>1KM</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Visibility Mode */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="eye-off-outline" size={18} color="#0EA5E9" />
                        <Text style={styles.sectionTitle}>VISIBILITY MODE</Text>
                    </View>

                    <View style={styles.toggleCard}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.row}>
                                <Text style={styles.cardTitle}>Stealth Mode</Text>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>INCOGNITO</Text>
                                </View>
                            </View>
                            <Text style={styles.cardDesc}>
                                Browse the map without appearing to others. You remain invisible until you interact.
                            </Text>
                        </View>
                        <Switch
                            value={stealthMode}
                            onValueChange={setStealthMode}
                            trackColor={{ false: '#334155', true: '#0EA5E9' }}
                            thumbColor="#FFF"
                        />
                    </View>
                </View>

                {/* Trusted Circles */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="people-outline" size={18} color="#0EA5E9" />
                        <Text style={styles.sectionTitle}>TRUSTED CIRCLES ONLY</Text>
                    </View>

                    <View style={styles.settingsGroup}>
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.row}>
                                    <Text style={styles.settingLabel}>Verified & 4.5+ Rated Users</Text>
                                    <Ionicons name="star" size={14} color="#F59E0B" />
                                </View>
                                <Text style={styles.settingDesc}>Restrict visibility to highly-rated nomads.</Text>
                            </View>
                            <Switch
                                value={verifiedOnly}
                                onValueChange={setVerifiedOnly}
                                trackColor={{ false: '#334155', true: '#0EA5E9' }}
                                thumbColor="#FFF"
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.row}>
                                    <Text style={styles.settingLabel}>Mutual Connections</Text>
                                    <Ionicons name="git-network-outline" size={14} color="#0EA5E9" />
                                </View>
                                <View style={styles.visiblePill}>
                                    <View style={styles.greenDot} />
                                    <Text style={styles.visibleText}>Visible to Trusted Circles</Text>
                                </View>
                                <Text style={styles.settingDesc}>Only friends of friends can see you.</Text>
                            </View>
                            <Switch
                                value={mutualOnly}
                                onValueChange={setMutualOnly}
                                trackColor={{ false: '#334155', true: '#0EA5E9' }}
                                thumbColor="#FFF"
                            />
                        </View>
                    </View>
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
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    mapSection: {
        padding: 20,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    mapCard: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 16,
    },
    mapImage: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    radiusCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: 'rgba(14, 165, 233, 0.5)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0EA5E9',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    publicLabel: {
        position: 'absolute',
        top: 20,
        backgroundColor: '#0F172A',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    publicText: {
        color: '#94A3B8',
        fontSize: 8,
        fontWeight: '700',
    },
    sliderContainer: {
        marginTop: 8,
    },
    sliderLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    sliderTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    sliderValue: {
        color: '#0EA5E9',
        fontSize: 16,
        fontWeight: '700',
    },
    sliderDesc: {
        color: '#64748B',
        fontSize: 13,
        marginBottom: 16,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#334155',
        borderRadius: 2,
        marginBottom: 8,
        position: 'relative',
    },
    sliderFill: {
        height: 4,
        backgroundColor: '#0EA5E9',
        borderRadius: 2,
    },
    sliderThumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#0F172A',
        borderWidth: 3,
        borderColor: '#0EA5E9',
        top: -8,
        marginLeft: -10,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderTick: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: '600',
    },
    toggleCard: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    tag: {
        backgroundColor: '#334155',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    tagText: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: '700',
    },
    cardDesc: {
        color: '#94A3B8',
        fontSize: 13,
        marginTop: 4,
        paddingRight: 16,
    },
    settingsGroup: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    settingLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 6,
    },
    settingDesc: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    visiblePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
        marginBottom: 2,
    },
    greenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    visibleText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '500',
    },
});
