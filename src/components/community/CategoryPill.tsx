import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../design/colors';

interface Props {
    label: string;
    isActive: boolean;
    onPress: () => void;
}

export const CategoryPill = ({ label, isActive, onPress }: Props) => {
    return (
        <TouchableOpacity
            style={[styles.container, isActive && styles.activeContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, isActive && styles.activeText]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeContainer: {
        backgroundColor: '#E0F2FE', // Light blue
        borderColor: Colors.primary.main,
    },
    text: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    activeText: {
        color: Colors.primary.dark,
    },
});
