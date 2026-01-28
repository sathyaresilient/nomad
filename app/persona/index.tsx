import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PersonaBadge } from '../../src/components/persona/PersonaBadge';
import { TraitBar } from '../../src/components/persona/TraitBar';
import { Colors } from '../../src/design/colors';
import { useAuthStore } from '../../src/store';
import { usePersonaStore } from '../../src/store/personaStore';

export default function PersonaScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { archetype, traits, isLoading, generatePersona } = usePersonaStore();

    useEffect(() => {
        if (user) {
            generatePersona(user);
        }
    }, [user]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={styles.loadingText}>Analyzing your travel DNA...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Travel DNA</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Badge */}
                <PersonaBadge archetype={archetype} />

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{user?.countriesVisited || 12}</Text>
                        <Text style={styles.statLabel}>Countries</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>42k</Text>
                        <Text style={styles.statLabel}>Km Traveled</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>14d</Text>
                        <Text style={styles.statLabel}>Avg Trip</Text>
                    </View>
                </View>

                {/* Traits Analysis */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personality Traits</Text>
                    <TraitBar label="Social Battery" value={traits.social} color="#F472B6" />
                    <TraitBar label="Adventure Seeking" value={traits.adventure} color="#38BDF8" />
                    <TraitBar label="Chill Factor" value={traits.relaxation} color="#4ADE80" />
                    <TraitBar label="Cultural Immersion" value={traits.culture} color="#FB923C" />
                </View>

                {/* Recommendations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recommended Next Stops</Text>
                    <Text style={styles.subtitle}>Based on your {archetype} persona</Text>

                    <View style={styles.recCard}>
                        <View style={styles.recIcon}>
                            <Ionicons name="location-outline" size={24} color={Colors.primary.main} />
                        </View>
                        <View>
                            <Text style={styles.recCity}>Kyoto, Japan</Text>
                            <Text style={styles.recReason}>Perfect mix of culture & zen.</Text>
                        </View>
                    </View>
                    <View style={[styles.recCard, { marginTop: 12 }]}>
                        <View style={styles.recIcon}>
                            <Ionicons name="location-outline" size={24} color={Colors.primary.main} />
                        </View>
                        <View>
                            <Text style={styles.recCity}>Medellín, Colombia</Text>
                            <Text style={styles.recReason}>High energy social scene.</Text>
                        </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    content: {
        padding: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.text.muted,
        fontWeight: '600',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 16,
        marginTop: -12,
    },
    recCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },
    recIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recCity: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    recReason: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
});
