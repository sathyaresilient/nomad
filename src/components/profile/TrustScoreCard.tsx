import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    score: number;
}

export const TrustScoreCard = ({ score }: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>TRUST SCORE</Text>
            <View style={styles.scoreRow}>
                <Text style={styles.score}>{score}</Text>
                <Text style={styles.total}>/10</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
    },
    label: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    score: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '700',
    },
    total: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 2,
    },
});
