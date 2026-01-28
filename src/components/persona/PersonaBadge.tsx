import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../design/colors';
import { PersonaArchetype } from '../../store/personaStore';

interface Props {
    archetype: PersonaArchetype;
}

const ARCHETYPE_CONFIG: Record<PersonaArchetype, { icon: string; color: string; desc: string }> = {
    'The Socialite': { icon: 'people', color: '#F472B6', desc: 'You thrive in crowds and love meeting new souls.' },
    'The Explorer': { icon: 'compass', color: '#38BDF8', desc: 'Off the beaten path is your middle name.' },
    'The Zen Master': { icon: 'leaf', color: '#4ADE80', desc: 'Peace, quiet, and wellness are your priorities.' },
    'The Digital Nomad': { icon: 'laptop-outline', color: '#818CF8', desc: 'Work hard, travel harder. WiFi is life.' },
    'The Foodie': { icon: 'restaurant', color: '#FB923C', desc: 'You travel with your taste buds first.' },
};

export const PersonaBadge = ({ archetype }: Props) => {
    const config = ARCHETYPE_CONFIG[archetype];

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
                <Ionicons name={config.icon as any} size={32} color={config.color} />
            </View>
            <Text style={styles.title}>{archetype}</Text>
            <Text style={styles.description}>{config.desc}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFF',
        borderRadius: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: '80%',
    },
});
