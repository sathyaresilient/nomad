import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../design/colors';

interface Props {
    label: string;
    value: number; // 0-100
    color: string;
}

export const TraitBar = ({ label, value, color }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}%</Text>
            </View>
            <View style={styles.track}>
                <View
                    style={[
                        styles.fill,
                        { width: `${value}%`, backgroundColor: color }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    value: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.secondary,
    },
    track: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F1F5F9', // Light gray track
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 4,
    },
});
