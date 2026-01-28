import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    countries: number;
    meetups: number;
    joinedYear: string;
}

export const StatsGrid = ({ countries, meetups, joinedYear }: Props) => {
    return (
        <View style={styles.container}>
            {/* Countries Card */}
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.label}>Countries</Text>
                    <Ionicons name="globe-outline" size={16} color="#0EA5E9" />
                </View>
                <Text style={styles.value}>{countries}</Text>
                <Text style={styles.subtext}>+2 this year</Text>
            </View>

            {/* Meetups Card */}
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.label}>Safe Meetups</Text>
                    <Ionicons name="hand-left-outline" size={16} color="#C2410C" />
                </View>
                <Text style={styles.value}>{meetups}</Text>
                <View style={styles.verifiedRow}>
                    <Text style={styles.verifiedText}>Verified</Text>
                    <Ionicons name="checkmark-circle" size={12} color="#F59E0B" />
                </View>
            </View>

            {/* Since Card (Optional context or just text in design) */}
            <View style={[styles.card, styles.sinceCard]}>
                <Text style={styles.sinceLabel}>Since</Text>
                <Text style={styles.sinceValue}>{joinedYear}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    card: {
        flex: 1,
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 16,
        minHeight: 100,
        justifyContent: 'space-between',
    },
    sinceCard: {
        flex: 0.6, // Smaller width
        backgroundColor: 'transparent',
        borderWidth: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        color: '#94A3B8',
        fontSize: 12,
    },
    value: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '700',
    },
    subtext: {
        color: '#10B981',
        fontSize: 10,
        fontWeight: '500',
    },
    verifiedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verifiedText: {
        color: '#F59E0B',
        fontSize: 10,
        fontWeight: '500',
    },
    sinceLabel: {
        color: '#64748B',
        fontSize: 12,
    },
    sinceValue: {
        color: '#F8FAFC',
        fontSize: 16,
        fontWeight: '600',
    },
});
