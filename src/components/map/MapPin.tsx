import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { MapPin as MapPinType } from '../../store/mapStore';

interface Props {
    pin: MapPinType;
    onPress: () => void;
    isSelected: boolean;
}

export const MapPin = ({ pin, onPress, isSelected }: Props) => {
    const isUser = pin.type === 'user';

    return (
        <TouchableOpacity
            style={[styles.container, isSelected && styles.selected]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {isUser ? (
                <View style={[styles.avatarContainer, isSelected && styles.selectedAvatar]}>
                    <Image source={{ uri: pin.data?.avatarUrl }} style={styles.avatar} />
                </View>
            ) : (
                <View style={[styles.eventPin, isSelected && styles.selectedEvent]}>
                    <Ionicons name="calendar" size={16} color="#FFF" />
                </View>
            )}

            <View style={styles.triangle} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 40,
        height: 50,
    },
    selected: {
        transform: [{ scale: 1.2 }],
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#FFF',
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    selectedAvatar: {
        borderColor: Colors.primary.dark,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    eventPin: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F59E0B', // Orange for events
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    selectedEvent: {
        backgroundColor: '#D97706',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 0,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFF', // Make it match the border or shadow if possible, simple approach here
        marginTop: -2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
});
