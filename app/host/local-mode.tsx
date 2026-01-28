/**
 * Local Mode Screen
 * Become a local guide and host travelers
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Availability options
const AVAILABILITY_OPTIONS = [
    { id: 'weekends', label: 'Weekends', icon: 'calendar-outline' },
    { id: 'evenings', label: 'Evenings', icon: 'moon-outline' },
    { id: 'lunch', label: 'Lunch Breaks', icon: 'cafe-outline' },
    { id: 'flexible', label: 'Flexible', icon: 'grid-outline' },
];

// Superpower options
const SUPERPOWER_OPTIONS = [
    { id: 'coffee', label: 'Coffee Spots', emoji: '☕' },
    { id: 'food', label: 'Street Food', emoji: '🥘' },
    { id: 'nightlife', label: 'Nightlife', emoji: '🍸' },
    { id: 'history', label: 'History', emoji: '🏛️' },
    { id: 'hiking', label: 'Hiking', emoji: '🥾' },
];

// Room type options
const ROOM_TYPES = [
    { id: 'private', label: 'Private Room', description: 'Guest has their own room' },
    { id: 'shared', label: 'Shared Room', description: 'Guest shares a room with others' },
];

export default function LocalModeScreen() {
    const router = useRouter();
    const [localModeEnabled, setLocalModeEnabled] = useState(true);
    const [hostingEnabled, setHostingEnabled] = useState(true);
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const [selectedSuperpowers, setSelectedSuperpowers] = useState<string[]>([]);
    const [selectedRoomType, setSelectedRoomType] = useState<string>('private');
    const [propertyPhotos, setPropertyPhotos] = useState<string[]>([]);

    const toggleAvailability = (id: string) => {
        if (selectedAvailability.includes(id)) {
            setSelectedAvailability(selectedAvailability.filter(a => a !== id));
        } else {
            setSelectedAvailability([...selectedAvailability, id]);
        }
    };

    const toggleSuperpower = (id: string) => {
        if (selectedSuperpowers.includes(id)) {
            setSelectedSuperpowers(selectedSuperpowers.filter(s => s !== id));
        } else if (selectedSuperpowers.length < 5) {
            setSelectedSuperpowers([...selectedSuperpowers, id]);
        }
    };

    const handleAddPhoto = () => {
        // Mock adding a photo - in real app would use ImagePicker
        const mockPhotos = [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        ];
        if (propertyPhotos.length < 6) {
            setPropertyPhotos([...propertyPhotos, mockPhotos[propertyPhotos.length % 3]]);
        }
    };

    const removePhoto = (index: number) => {
        setPropertyPhotos(propertyPhotos.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Local Mode</Text>
                    <TouchableOpacity style={styles.helpButton}>
                        <Ionicons name="help-circle-outline" size={24} color="#64748B" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Hero Banner */}
                    <View style={styles.heroBanner}>
                        <View style={styles.hostBadge}>
                            <Text style={styles.hostBadgeText}>HOST MODE</Text>
                        </View>
                        <Text style={styles.heroTitle}>Share your world.</Text>
                    </View>

                    {/* Enable Local Mode */}
                    <View style={styles.card}>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleContent}>
                                <Text style={styles.toggleTitle}>Enable Local Mode</Text>
                                <Text style={styles.toggleSubtitle}>
                                    Become a guide in your city. Make new friends.
                                </Text>
                            </View>
                            <Switch
                                value={localModeEnabled}
                                onValueChange={setLocalModeEnabled}
                                trackColor={{ false: '#E2E8F0', true: '#2A9D8F' }}
                                thumbColor="#FFF"
                            />
                        </View>

                        <View style={styles.infoRow}>
                            <Ionicons name="globe-outline" size={20} color="#2A9D8F" />
                            <Text style={styles.infoText}>
                                Visiting nomads will see you're open for coffee, tours, or advice. You set the rules.
                            </Text>
                        </View>
                    </View>

                    {/* Host a Room Section */}
                    <View style={styles.card}>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleContent}>
                                <View style={styles.sectionTitleRow}>
                                    <Ionicons name="home-outline" size={20} color="#1E293B" />
                                    <Text style={styles.toggleTitle}>Host a Room</Text>
                                </View>
                                <Text style={styles.toggleSubtitle}>
                                    Offer accommodation to fellow nomads
                                </Text>
                            </View>
                            <Switch
                                value={hostingEnabled}
                                onValueChange={setHostingEnabled}
                                trackColor={{ false: '#E2E8F0', true: '#2A9D8F' }}
                                thumbColor="#FFF"
                            />
                        </View>

                        {hostingEnabled && (
                            <>
                                {/* Room Type Selection */}
                                <View style={styles.roomTypeSection}>
                                    <Text style={styles.subsectionTitle}>Room Type</Text>
                                    <View style={styles.roomTypeRow}>
                                        {ROOM_TYPES.map(type => (
                                            <TouchableOpacity
                                                key={type.id}
                                                style={[
                                                    styles.roomTypeOption,
                                                    selectedRoomType === type.id && styles.roomTypeOptionActive
                                                ]}
                                                onPress={() => setSelectedRoomType(type.id)}
                                            >
                                                <View style={styles.radioCircle}>
                                                    {selectedRoomType === type.id && (
                                                        <View style={styles.radioFill} />
                                                    )}
                                                </View>
                                                <View>
                                                    <Text style={[
                                                        styles.roomTypeLabel,
                                                        selectedRoomType === type.id && styles.roomTypeLabelActive
                                                    ]}>
                                                        {type.label}
                                                    </Text>
                                                    <Text style={styles.roomTypeDesc}>{type.description}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Property Photos */}
                                <View style={styles.photosSection}>
                                    <View style={styles.photosSectionHeader}>
                                        <Text style={styles.subsectionTitle}>Property Photos</Text>
                                        <Text style={styles.photoCount}>{propertyPhotos.length}/6</Text>
                                    </View>

                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosRow}>
                                        {propertyPhotos.map((photo, index) => (
                                            <View key={index} style={styles.photoWrapper}>
                                                <Image source={{ uri: photo }} style={styles.propertyPhoto} />
                                                <TouchableOpacity
                                                    style={styles.removePhotoBtn}
                                                    onPress={() => removePhoto(index)}
                                                >
                                                    <Ionicons name="close" size={14} color="#FFF" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                        {propertyPhotos.length < 6 && (
                                            <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
                                                <Ionicons name="camera-outline" size={24} color="#64748B" />
                                                <Text style={styles.addPhotoText}>Add Photo</Text>
                                            </TouchableOpacity>
                                        )}
                                    </ScrollView>
                                </View>
                            </>
                        )}
                    </View>

                    {/* When are you free? */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>When are you free?</Text>
                        <View style={styles.optionsGrid}>
                            {AVAILABILITY_OPTIONS.map(option => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionChip,
                                        selectedAvailability.includes(option.id) && styles.optionChipActive
                                    ]}
                                    onPress={() => toggleAvailability(option.id)}
                                >
                                    <Ionicons
                                        name={option.icon as any}
                                        size={18}
                                        color={selectedAvailability.includes(option.id) ? '#2A9D8F' : '#64748B'}
                                    />
                                    <Text style={[
                                        styles.optionChipText,
                                        selectedAvailability.includes(option.id) && styles.optionChipTextActive
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Your Local Superpowers */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your Local Superpowers</Text>
                            <Text style={styles.selectionCount}>{selectedSuperpowers.length}/5 selected</Text>
                        </View>
                        <View style={styles.superpowersRow}>
                            {SUPERPOWER_OPTIONS.map(option => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.superpowerChip,
                                        selectedSuperpowers.includes(option.id) && styles.superpowerChipActive
                                    ]}
                                    onPress={() => toggleSuperpower(option.id)}
                                >
                                    <Text style={styles.superpowerEmoji}>{option.emoji}</Text>
                                    <Text style={[
                                        styles.superpowerText,
                                        selectedSuperpowers.includes(option.id) && styles.superpowerTextActive
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Privacy Note */}
                    <View style={styles.privacyNote}>
                        <Ionicons name="lock-closed-outline" size={14} color="#94A3B8" />
                        <Text style={styles.privacyText}>
                            Your exact home location is never shared. We only show your general city or neighborhood area.
                        </Text>
                    </View>

                    {/* Activate Button */}
                    <TouchableOpacity style={styles.activateButton}>
                        <Text style={styles.activateButtonText}>Activate Local Profile</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    helpButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },

    // Hero Banner
    heroBanner: {
        backgroundColor: '#9CA3AF',
        borderRadius: 20,
        padding: 24,
        paddingTop: 60,
        paddingBottom: 28,
        marginBottom: 20,
    },
    hostBadge: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 12,
    },
    hostBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFF',
    },

    // Card
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    toggleContent: {
        flex: 1,
        marginRight: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    toggleSubtitle: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },

    // Room Type Section
    roomTypeSection: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    subsectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    roomTypeRow: {
        gap: 10,
    },
    roomTypeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    roomTypeOptionActive: {
        borderColor: '#2A9D8F',
        backgroundColor: '#F0FDFA',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioFill: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2A9D8F',
    },
    roomTypeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    roomTypeLabelActive: {
        color: '#2A9D8F',
    },
    roomTypeDesc: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },

    // Photos Section
    photosSection: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    photosSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    photoCount: {
        fontSize: 12,
        color: '#94A3B8',
    },
    photosRow: {
        gap: 10,
    },
    photoWrapper: {
        position: 'relative',
    },
    propertyPhoto: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
    },
    removePhotoBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoBtn: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    addPhotoText: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 4,
    },

    // Section
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
    },
    selectionCount: {
        fontSize: 12,
        color: '#94A3B8',
    },

    // Options Grid
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFF',
        width: (width - 50) / 2,
    },
    optionChipActive: {
        borderColor: '#2A9D8F',
        backgroundColor: '#F0FDFA',
    },
    optionChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
    optionChipTextActive: {
        color: '#2A9D8F',
    },

    // Superpowers
    superpowersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    superpowerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFF',
    },
    superpowerChipActive: {
        borderColor: '#2A9D8F',
        backgroundColor: '#F0FDFA',
    },
    superpowerEmoji: {
        fontSize: 14,
    },
    superpowerText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
    superpowerTextActive: {
        color: '#2A9D8F',
    },

    // Privacy Note
    privacyNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    privacyText: {
        flex: 1,
        fontSize: 12,
        color: '#94A3B8',
        lineHeight: 16,
        textAlign: 'center',
    },

    // Activate Button
    activateButton: {
        backgroundColor: '#2A9D8F',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
    },
    activateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
