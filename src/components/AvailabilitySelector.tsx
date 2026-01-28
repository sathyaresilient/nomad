import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../design/colors';
import { useLocalModeStore } from '../store/localModeStore';

const options = [
    { key: 'weekends', label: 'Weekends', icon: 'briefcase-outline' },
    { key: 'evenings', label: 'Evenings', icon: 'moon-outline' },
    { key: 'lunchWithLocals', label: 'Lunch Breaks', icon: 'fast-food-outline' },
    { key: 'flexible', label: 'Flexible', icon: 'calendar-outline' },
] as const;

export const AvailabilitySelector = () => {
    const { availability, toggleAvailability } = useLocalModeStore();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>When are you free?</Text>
            <View style={styles.grid}>
                {options.map((option) => {
                    const isSelected = availability[option.key];
                    return (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.option,
                                isSelected && styles.optionSelected,
                            ]}
                            onPress={() => toggleAvailability(option.key)}
                        >
                            <Ionicons
                                name={option.icon as any}
                                size={20}
                                color={isSelected ? '#FFFFFF' : Colors.text.secondary}
                                style={styles.icon}
                            />
                            <Text style={[
                                styles.label,
                                isSelected && styles.labelSelected
                            ]}>
                                {option.label}
                            </Text>
                            {isSelected && (
                                <Ionicons
                                    name="checkmark"
                                    size={16}
                                    color="#FFFFFF"
                                    style={styles.check}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border.light,
        minWidth: '45%',
        flexGrow: 1,
    },
    optionSelected: {
        backgroundColor: 'rgba(20, 184, 166, 0.9)', // slightly transparent primary
        borderColor: Colors.primary.main,
    },
    icon: {
        marginRight: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.secondary,
        flex: 1,
    },
    labelSelected: {
        color: '#FFFFFF',
    },
    check: {
        marginLeft: 8,
    },
});
