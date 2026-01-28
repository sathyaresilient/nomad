import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { MapFilters } from '../../src/components/map/MapFilters';
import { MapPin } from '../../src/components/map/MapPin';
import { PinCallout } from '../../src/components/map/PinCallout';
import { useMapStore } from '../../src/store/mapStore';

// Constants for simulation
const MAP_WIDTH = 400; // Mock width of container
const MAP_HEIGHT = 700;

const convertCoords = (lat: number, lng: number) => {
    // Center point approx for Lisbon: 38.71, -9.15
    const centerLat = 38.71;
    const centerLng = -9.15;
    const scale = 4000;
    const x = (lng - centerLng) * scale + (MAP_WIDTH / 2);
    const y = -(lat - centerLat) * scale + (MAP_HEIGHT / 2); // Invert Y
    return { x, y };
};

export default function MapScreen() {
    const router = useRouter();
    const { pins, selectedPinId, selectPin, filters } = useMapStore();
    const selectedPin = pins.find(p => p.id === selectedPinId);

    // Filter logic
    const visiblePins = pins.filter(p => {
        if (p.type === 'user' && !filters.showUsers && !filters.showGuides) return false;
        if (p.type === 'event' && !filters.showEvents) return false;
        return true;
    });

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1577083165350-16c9f88b4a25?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.mapBackground}
                resizeMode="cover"
            >
                <SafeAreaView pointerEvents="box-none" style={{ flex: 1 }}>

                    {/* Search Bar Header */}
                    <View style={styles.headerContainer}>
                        <View style={styles.searchBar}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={20} color="#94A3B8" />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Lisbon..."
                                placeholderTextColor="#94A3B8"
                            />
                            <TouchableOpacity style={styles.settingsBtn}>
                                <Ionicons name="options" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Filters */}
                    <MapFilters />

                    {/* Pins Layer (Manual Positioning) */}
                    <View style={styles.pinLayer} pointerEvents="box-none">
                        {visiblePins.map(pin => {
                            const { x, y } = convertCoords(pin.latitude, pin.longitude);
                            if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) return null;

                            return (
                                <View key={pin.id} style={[styles.pinWrapper, { top: y, left: x }]}>
                                    <MapPin
                                        pin={pin}
                                        onPress={() => selectPin(pin.id)}
                                        isSelected={selectedPinId === pin.id}
                                    />
                                </View>
                            );
                        })}
                    </View>

                    {/* Interactions Layer */}
                    <View style={{ flex: 1 }} pointerEvents="box-none" />

                    {/* Bottom Sheet Callout */}
                    {selectedPin && (
                        <PinCallout
                            pin={selectedPin}
                            onClose={() => selectPin(null)}
                        />
                    )}
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2E8F0',
    },
    mapBackground: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B', // Dark theme matching mockup
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
    },
    settingsBtn: {
        padding: 4,
    },
    pinLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0, // Behind callouts
        marginTop: 60, // approximate, to offset map coordinates if needed
    },
    pinWrapper: {
        position: 'absolute',
        marginTop: -25,
        marginLeft: -20,
    },
});
