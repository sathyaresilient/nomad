import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../design/colors';

interface Props {
    icon: string; // Ionicons name
    title: string;
    description: string;
}

export const VerificationBenefitCard = ({ icon, title, description }: Props) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon as any} size={24} color={Colors.primary.main} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        flex: 1, // To share width equally if in a row
        // Shadow
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(20, 184, 166, 0.1)', // Teal with opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 6,
    },
    description: {
        fontSize: 12,
        color: Colors.text.secondary,
        lineHeight: 18,
    },
});
