import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../design/colors';
import { useLocalModeStore } from '../store/localModeStore';

const SUPERPOWERS = [
    { id: 'coffee', label: 'Coffee Spots', emoji: '☕' },
    { id: 'street_food', label: 'Street Food', emoji: '🌮' },
    { id: 'nightlife', label: 'Nightlife', emoji: '🍸' },
    { id: 'history', label: 'History', emoji: '🏛️' },
    { id: 'hiking', label: 'Hidden Hikes', emoji: '🥾' },
    { id: 'photography', label: 'Photo Ops', emoji: '📸' },
];

export const SuperpowerSelector = () => {
    const { superpowers, toggleSuperpower } = useLocalModeStore();

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Your Local Superpowers</Text>
                <Text style={styles.count}>{superpowers.length}/5 selected</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.grid}>
                    {SUPERPOWERS.map((power) => {
                        const isSelected = superpowers.includes(power.id);
                        return (
                            <TouchableOpacity
                                key={power.id}
                                style={[
                                    styles.chip,
                                    isSelected && styles.chipSelected,
                                ]}
                                onPress={() => toggleSuperpower(power.id)}
                            >
                                <Text style={styles.emoji}>{power.emoji}</Text>
                                <Text style={[
                                    styles.label,
                                    isSelected && styles.labelSelected
                                ]}>{power.label}</Text>
                                {isSelected && (
                                    <Text style={styles.close}>×</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    count: {
        fontSize: 14,
        color: Colors.text.muted,
    },
    scrollContent: {
        paddingRight: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipSelected: {
        backgroundColor: '#E6FFFA', // Light teal bg
        borderColor: '#99F6E4', // Lighter teal border
    },
    emoji: {
        fontSize: 16,
        marginRight: 6,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    labelSelected: {
        color: '#0D9488', // Darker teal text
    },
    close: {
        marginLeft: 8,
        fontSize: 18,
        color: '#0D9488',
        opacity: 0.6,
    },
});
