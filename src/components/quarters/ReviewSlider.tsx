import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ReviewSliderProps {
    label: string;
    value: number;
    minLabel: string;
    maxLabel: string;
    verifiedBadge?: string; // Optional text for verified badge
    showIcon?: boolean;
}

export const ReviewSlider: React.FC<ReviewSliderProps> = ({
    label,
    value,
    minLabel,
    maxLabel,
    verifiedBadge,
    showIcon
}) => {
    // Calculate percentage for slider position (1 to 5 scale assumed)
    const percentage = ((value - 1) / 4) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                {verifiedBadge && (
                    <View style={styles.badge}>
                        <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                        <Text style={styles.badgeText}>{verifiedBadge}</Text>
                    </View>
                )}
                {!verifiedBadge && (
                    <Text style={styles.valueText}>{value.toFixed(1)}</Text>
                )}
            </View>

            <View style={styles.sliderContainer}>
                <View style={styles.track} />
                <View style={[styles.fill, { width: `${percentage}%` }]} />
                <View style={[styles.thumb, { left: `${percentage}%` }]} />
            </View>

            <View style={styles.labelsRow}>
                <Text style={styles.limitLabel}>{minLabel}</Text>
                <Text style={[styles.limitLabel, { textAlign: 'right' }]}>{maxLabel}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#10B981',
    },
    valueText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    sliderContainer: {
        height: 4,
        backgroundColor: '#F1F5F9', // Track color
        borderRadius: 2,
        position: 'relative',
        marginBottom: 8,
        justifyContent: 'center',
    },
    track: {
        flex: 1,
        borderRadius: 2,
    },
    fill: {
        position: 'absolute',
        left: 0,
        height: 4,
        backgroundColor: '#D1FAE5', // Light Teal Fill
        borderRadius: 2,
    },
    thumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981', // Solid Teal Thumb
        top: -8,
        marginLeft: -10, // Center thumb
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    limitLabel: {
        fontSize: 10,
        color: '#94A3B8',
    },
});
