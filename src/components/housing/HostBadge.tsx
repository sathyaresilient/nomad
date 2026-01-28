import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    type: 'superhost' | 'verified' | 'expert';
}

export const HostBadge = ({ type }: Props) => {
    const config = {
        superhost: { label: 'SUPERHOST', icon: 'medal', color: '#F59E0B' },
        verified: { label: 'VERIFIED', icon: 'shield-checkmark', color: '#0EA5E9' },
        expert: { label: 'LOCAL EXPERT', icon: 'map', color: '#10B981' },
    }[type];

    return (
        <View style={[styles.container, { borderColor: config.color, backgroundColor: `${config.color}20` }]}>
            <Ionicons name={config.icon as any} size={10} color={config.color} />
            <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
    },
    label: {
        fontSize: 8,
        fontWeight: '700',
    },
});
