import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMapStore } from '../../store/mapStore';

export const MapFilters = () => {
    const { filters, toggleFilter } = useMapStore();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            style={styles.scroll}
        >
            <TouchableOpacity
                style={[styles.chip, styles.chipGreen, filters.showUsers && styles.active]}
                onPress={() => toggleFilter('showUsers')}
            >
                <Ionicons name="compass" size={16} color={filters.showUsers ? "#FFF" : "#10B981"} />
                <Text style={[styles.text, filters.showUsers && styles.activeText]}>Travelers</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.chip, styles.chipYellow, filters.showGuides && styles.active]}
                onPress={() => toggleFilter('showGuides')}
            >
                <Ionicons name="star" size={16} color={filters.showGuides ? "#FFF" : "#F59E0B"} />
                <Text style={[styles.text, filters.showGuides && styles.activeText]}>Local Guides</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.chip, styles.chipRed, filters.showEvents && styles.active]}
                onPress={() => toggleFilter('showEvents')}
            >
                <Ionicons name="calendar" size={16} color={filters.showEvents ? "#FFF" : "#EF4444"} />
                <Text style={[styles.text, filters.showEvents && styles.activeText]}>Events</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        position: 'absolute',
        top: 110, // Below search bar
        left: 0,
        right: 0,
        height: 50,
    },
    container: {
        paddingHorizontal: 20,
        gap: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // Dark semi-transparent
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipGreen: {
        // base style
    },
    chipYellow: {

    },
    chipRed: {

    },
    active: {
        backgroundColor: '#1E293B', // Fully opaque dark
        borderColor: '#334155',
    },
    text: {
        color: '#E2E8F0',
        fontSize: 13,
        fontWeight: '600',
    },
    activeText: {
        color: '#FFF',
    },
});
