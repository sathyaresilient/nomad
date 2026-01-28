/**
 * Getting Started Card
 * Shows progress on the onboarding journey
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STEPS = [
    { id: 'trip', icon: 'map-outline', bgColor: '#D1FAE5', iconColor: '#10B981' },
    { id: 'connect', icon: 'chatbubbles', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
    { id: 'verify', icon: 'shield-checkmark', bgColor: '#FEE2E2', iconColor: '#EF4444' },
    { id: 'meetup', icon: 'cafe', bgColor: '#FCE7F3', iconColor: '#8B5A2B' },
];

export const GettingStartedCard = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push('/onboarding/getting-started')}
            activeOpacity={0.9}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Getting Started</Text>
                <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>0/4</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>Complete your journey to unlock all features</Text>

            <View style={styles.stepsRow}>
                {STEPS.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <View style={[styles.stepCircle, { backgroundColor: step.bgColor }]}>
                            <Ionicons name={step.icon as any} size={20} color={step.iconColor} />
                        </View>
                        {index < STEPS.length - 1 && <View style={styles.connector} />}
                    </React.Fragment>
                ))}
            </View>

            <View style={styles.ctaRow}>
                <Text style={styles.ctaText}>Start your journey</Text>
                <Ionicons name="arrow-forward" size={16} color="#2A9D8F" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    progressBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    subtitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginBottom: 20,
    },
    stepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    stepCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connector: {
        width: 20,
        height: 2,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 4,
    },
    ctaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    ctaText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2A9D8F',
    },
});
