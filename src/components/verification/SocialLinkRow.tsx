import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';

interface Props {
    icon: string; // ionicons name
    label: string;
    subLabel: string;
    isConnected: boolean;
    onPress: () => void;
    brandColor?: string;
}

export const SocialLinkRow = ({ icon, label, subLabel, isConnected, onPress, brandColor = Colors.text.primary }: Props) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: isConnected ? Colors.status.success : '#F1F5F9' }]}>
                <Ionicons
                    name={isConnected ? 'checkmark' : (icon as any)}
                    size={22}
                    color={isConnected ? '#FFF' : brandColor}
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.subLabel}>
                    {isConnected ? 'Connected' : subLabel}
                </Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.muted}
                style={{ opacity: isConnected ? 0 : 1 }}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    subLabel: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
});
