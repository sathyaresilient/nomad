import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type SocialVibe = 'solo' | 'meetups' | 'cotravel';

interface SocialVibeSelectorProps {
    value: SocialVibe;
    onChange: (value: SocialVibe) => void;
}

const VIBE_OPTIONS = [
    { id: 'solo', label: 'Solo', subLabel: 'Just me', icon: 'person-outline' },
    { id: 'meetups', label: 'Meetups', subLabel: 'Open for coffee', icon: 'cafe-outline' },
    { id: 'cotravel', label: 'Co-travel', subLabel: 'Looking for pals', icon: 'people-outline' },
];

export const SocialVibeSelector: React.FC<SocialVibeSelectorProps> = ({ value, onChange }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.label}>SOCIAL VIBE</Text>
                <View style={styles.visibilityBadge}>
                    <Text style={styles.visibilityText}>Visible to Members</Text>
                </View>
            </View>

            <View style={styles.optionsRow}>
                {VIBE_OPTIONS.map((option) => {
                    const isSelected = value === option.id;
                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                isSelected && styles.selectedCard
                            ]}
                            onPress={() => onChange(option.id as SocialVibe)}
                        >
                            <View style={[styles.iconCircle, isSelected && styles.selectedIconCircle]}>
                                <Ionicons
                                    name={option.icon as any}
                                    size={20}
                                    color={isSelected ? '#2A9D8F' : '#64748B'}
                                />
                            </View>
                            <Text style={[styles.optionLabel, isSelected && styles.selectedText]}>{option.label}</Text>
                            <Text style={styles.optionSubLabel}>{option.subLabel}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    visibilityBadge: {
        backgroundColor: '#E0F2F1', // Light teal bg
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    visibilityText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#2A9D8F',
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    optionCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
        height: 120,
        justifyContent: 'center',
    },
    selectedCard: {
        borderColor: '#2A9D8F',
        backgroundColor: '#F0FDFA', // Super light teal
        borderWidth: 2,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    selectedIconCircle: {
        backgroundColor: '#CCFBF1',
    },
    optionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    selectedText: {
        color: '#0F1F2C',
    },
    optionSubLabel: {
        fontSize: 10,
        color: '#94A3B8',
        textAlign: 'center',
    },
});
