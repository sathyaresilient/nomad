import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    onPress: () => void;
    status: 'idle' | 'countdown' | 'active';
    countdownValue?: number;
}

export const SignalButton = ({ onPress, status, countdownValue }: Props) => {
    // Animation logic would go here (e.g., scale/opacity loop)

    return (
        <TouchableOpacity
            style={[
                styles.container,
                status === 'active' && styles.activeContainer,
                status === 'countdown' && styles.countdownContainer,
            ]}
            activeOpacity={0.8}
            onPress={onPress}
            disabled={status === 'countdown'}
        >
            <View style={[
                styles.innerCircle,
                status === 'active' && styles.activeInner,
                status === 'countdown' && styles.countdownInner,
            ]}>
                {status === 'idle' && (
                    <>
                        <Ionicons name="shield" size={48} color="#FFF" />
                        <Text style={styles.label}>TAP FOR SOS</Text>
                    </>
                )}

                {status === 'countdown' && (
                    <>
                        <Text style={styles.countdownText}>{countdownValue}</Text>
                        <Text style={styles.subLabel}>Sending in...</Text>
                    </>
                )}

                {status === 'active' && (
                    <>
                        <Ionicons name="warning" size={48} color="#FFF" />
                        <Text style={styles.label}>ALERT SENT</Text>
                        <Text style={styles.subLabel}>Help is on the way</Text>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FFE4E6', // Light red ring
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 40,
    },
    activeContainer: {
        backgroundColor: '#FEF2F2', // Even lighter red
    },
    countdownContainer: {
        backgroundColor: '#FFF7ED', // Orange ring
    },
    innerCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#EF4444', // Red
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    activeInner: {
        backgroundColor: '#DC2626', // Darker Red
    },
    countdownInner: {
        backgroundColor: '#F97316', // Orange
    },
    label: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        marginTop: 8,
        letterSpacing: 1,
    },
    subLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    countdownText: {
        fontSize: 64,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 70,
    },
});
