/**
 * Create Event Screen
 * Post events like "Happening Now" with photos
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const EVENT_TYPES = [
    { id: 'coworking', label: 'Coworking', emoji: '💻' },
    { id: 'coffee', label: 'Coffee Chat', emoji: '☕' },
    { id: 'dinner', label: 'Dinner', emoji: '🍽️' },
    { id: 'drinks', label: 'Drinks', emoji: '🍹' },
    { id: 'adventure', label: 'Adventure', emoji: '🏄' },
    { id: 'explore', label: 'Explore', emoji: '🚶' },
];

const MOCK_PHOTOS = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=400',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
];

export default function CreateEventScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState('coworking');
    const [spots, setSpots] = useState('5');
    const [photos, setPhotos] = useState<string[]>([]);
    const [isPosting, setIsPosting] = useState(false);

    const handleAddPhoto = () => {
        if (photos.length < 3) {
            setPhotos([...photos, MOCK_PHOTOS[photos.length]]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        setIsPosting(true);
        // Simulate posting
        setTimeout(() => {
            setIsPosting(false);
            router.back();
        }, 1000);
    };

    const canPost = title.trim() && location.trim();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Event</Text>
                    <TouchableOpacity
                        style={[styles.postButton, !canPost && styles.postButtonDisabled]}
                        onPress={handlePost}
                        disabled={!canPost || isPosting}
                    >
                        <Text style={[styles.postButtonText, !canPost && styles.postButtonTextDisabled]}>
                            {isPosting ? 'Posting...' : 'Post'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Photo Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Event Photo</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosRow}>
                            {photos.map((photo, index) => (
                                <View key={index} style={styles.photoWrapper}>
                                    <Image source={{ uri: photo }} style={styles.photo} />
                                    <TouchableOpacity
                                        style={styles.removePhotoBtn}
                                        onPress={() => removePhoto(index)}
                                    >
                                        <Ionicons name="close" size={14} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {photos.length < 3 && (
                                <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
                                    <Ionicons name="camera-outline" size={28} color="#94A3B8" />
                                    <Text style={styles.addPhotoText}>Add Photo</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>

                    {/* Title */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>What's happening?</Text>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="e.g., Coworking deep work sesh at Dojo 💻"
                            placeholderTextColor="#94A3B8"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={80}
                        />
                        <Text style={styles.charCount}>{title.length}/80</Text>
                    </View>

                    {/* Event Type */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Event Type</Text>
                        <View style={styles.typesGrid}>
                            {EVENT_TYPES.map(type => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.typeChip,
                                        selectedType === type.id && styles.typeChipActive
                                    ]}
                                    onPress={() => setSelectedType(type.id)}
                                >
                                    <Text style={styles.typeEmoji}>{type.emoji}</Text>
                                    <Text style={[
                                        styles.typeLabel,
                                        selectedType === type.id && styles.typeLabelActive
                                    ]}>{type.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Location</Text>
                        <View style={styles.inputWithIcon}>
                            <Ionicons name="location-outline" size={20} color="#94A3B8" />
                            <TextInput
                                style={styles.inputField}
                                placeholder="e.g., Canggu, Bali"
                                placeholderTextColor="#94A3B8"
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </View>

                    {/* Spots Available */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Spots Available</Text>
                        <View style={styles.spotsRow}>
                            {['3', '5', '10', '∞'].map(num => (
                                <TouchableOpacity
                                    key={num}
                                    style={[
                                        styles.spotBtn,
                                        spots === num && styles.spotBtnActive
                                    ]}
                                    onPress={() => setSpots(num)}
                                >
                                    <Text style={[
                                        styles.spotBtnText,
                                        spots === num && styles.spotBtnTextActive
                                    ]}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Description (optional) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Description (optional)</Text>
                        <TextInput
                            style={styles.descInput}
                            placeholder="Add more details about your event..."
                            placeholderTextColor="#94A3B8"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Preview Card */}
                    {(title || photos.length > 0) && (
                        <View style={styles.previewSection}>
                            <Text style={styles.previewLabel}>Preview</Text>
                            <View style={styles.previewCard}>
                                {photos[0] ? (
                                    <Image source={{ uri: photos[0] }} style={styles.previewImage} />
                                ) : (
                                    <View style={[styles.previewImage, { backgroundColor: '#E2E8F0' }]} />
                                )}
                                <View style={styles.previewOverlay}>
                                    <View style={styles.previewBadge}>
                                        <Text style={styles.previewBadgeText}>{spots} SPOTS LEFT</Text>
                                    </View>
                                    <View style={styles.previewBottom}>
                                        <View style={styles.previewTags}>
                                            <View style={styles.previewTag}>
                                                <Ionicons name="location" size={10} color="#FFF" />
                                                <Text style={styles.previewTagText}>{location || 'Location'}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.previewTitle}>{title || 'Your event title'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    postButton: {
        backgroundColor: '#EC4899',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonDisabled: {
        backgroundColor: '#F1F5F9',
    },
    postButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    postButtonTextDisabled: {
        color: '#94A3B8',
    },
    scrollContent: {
        padding: 20,
    },

    // Sections
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 12,
    },

    // Photos
    photosRow: {
        gap: 12,
    },
    photoWrapper: {
        position: 'relative',
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 16,
        backgroundColor: '#E2E8F0',
    },
    removePhotoBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoBtn: {
        width: 120,
        height: 120,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    addPhotoText: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },

    // Title
    titleInput: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingVertical: 12,
    },
    charCount: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'right',
        marginTop: 4,
    },

    // Event Types
    typesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    typeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    typeChipActive: {
        backgroundColor: '#FCE7F3',
        borderColor: '#EC4899',
    },
    typeEmoji: {
        fontSize: 16,
    },
    typeLabel: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    typeLabelActive: {
        color: '#EC4899',
    },

    // Location Input
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: '#F8FAFC',
    },
    inputField: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1E293B',
    },

    // Spots
    spotsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    spotBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spotBtnActive: {
        backgroundColor: '#EC4899',
        borderColor: '#EC4899',
    },
    spotBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#64748B',
    },
    spotBtnTextActive: {
        color: '#FFF',
    },

    // Description
    descInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#1E293B',
        backgroundColor: '#F8FAFC',
        minHeight: 80,
        textAlignVertical: 'top',
    },

    // Preview
    previewSection: {
        marginTop: 8,
    },
    previewLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 12,
    },
    previewCard: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    previewOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 16,
        justifyContent: 'space-between',
    },
    previewBadge: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    previewBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1E293B',
    },
    previewBottom: {},
    previewTags: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    previewTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    previewTagText: {
        fontSize: 11,
        color: '#FFF',
    },
    previewTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
});
