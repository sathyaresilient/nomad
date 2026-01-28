import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AMENITIES = [
    { id: 'plant', label: 'Plant-filled', icon: 'leaf' },
    { id: 'wifi', label: 'Fast WiFi', icon: 'wifi' },
    { id: 'monitor', label: 'Monitor Setup', icon: 'desktop' },
    { id: 'light', label: 'Natural Light', icon: 'sunny' },
    { id: 'quiet', label: 'Quiet Zone', icon: 'volume-mute' },
    { id: 'coffee', label: 'Coffee Bar', icon: 'cafe' },
    { id: 'pet', label: 'Pet Friendly', icon: 'paw' },
];

export default function CreateListingScreen() {
    const router = useRouter();
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [reputationScore, setReputationScore] = useState(4.5);

    const toggleAmenity = (id: string) => {
        if (selectedAmenities.includes(id)) {
            setSelectedAmenities(selectedAmenities.filter(a => a !== id));
        } else {
            setSelectedAmenities([...selectedAmenities, id]);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#64748B" />
                    </TouchableOpacity>
                    <View style={styles.steps}>
                        <View style={[styles.step, styles.stepActive]} />
                        <View style={[styles.step, styles.stepActive]} />
                        <View style={[styles.step, styles.stepInactive]} />
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.saveDraft}>Save Draft</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.heading}>Define your space's character.</Text>
                    <Text style={styles.subHeading}>Select the amenities and vibes that best describe your workspace for nomads.</Text>

                    {/* Amenities Grid */}
                    <View style={styles.amenityGrid}>
                        {AMENITIES.map(item => {
                            const isSelected = selectedAmenities.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.amenityChip, isSelected && styles.amenitySelected]}
                                    onPress={() => toggleAmenity(item.id)}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={16}
                                        color={isSelected ? '#065F46' : '#64748B'}
                                    />
                                    <Text style={[styles.amenityLabel, isSelected && styles.amenityLabelSelected]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.heading}>Show off where they'll work.</Text>
                    <Text style={styles.subHeading}>Upload at least 3 photos. Listings with workspace photos get 40% more bookings.</Text>

                    {/* Photo Upload Area */}
                    <View style={styles.photoContainer}>
                        <View style={styles.dropZone}>
                            <View style={styles.cameraIconBg}>
                                <Ionicons name="camera" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.dropTitle}>Tap to upload</Text>
                            <Text style={styles.dropSub}>or drag and drop</Text>
                        </View>

                        <View style={styles.previewRow}>
                            {/* Mock previews */}
                            <View style={styles.previewBox}>
                                <Text style={styles.coverLabel}>COVER</Text>
                            </View>
                            <View style={styles.previewBox} />
                            <TouchableOpacity style={styles.addMoreBox}>
                                <Ionicons name="add" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Who can book? */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
                        <Text style={styles.headingSmall}>Who can book?</Text>
                    </View>
                    <Text style={styles.subHeading}>Set minimum reputation requirements for instant booking.</Text>

                    <View style={styles.reputationCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={styles.repLabel}>Min. Reputation Score</Text>
                            <View style={styles.repBadge}>
                                <Text style={styles.repBadgeText}>4.5+</Text>
                            </View>
                        </View>
                        {/* Visual Slider Mock */}
                        <View style={styles.sliderTrack}>
                            <View style={styles.sliderFill} />
                            <View style={styles.sliderThumb} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                            <Text style={styles.sliderLabel}>Newbie</Text>
                            <Text style={styles.sliderLabel}>Pro</Text>
                        </View>
                    </View>

                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.continueBtn} onPress={() => Alert.alert("Listing Created", "Your trusted quarters are live!")}>
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    steps: {
        flexDirection: 'row',
        gap: 4,
    },
    step: {
        width: 30,
        height: 4,
        borderRadius: 2,
    },
    stepActive: {
        backgroundColor: '#10B981',
    },
    stepInactive: {
        backgroundColor: '#E2E8F0',
    },
    saveDraft: {
        color: '#10B981',
        fontWeight: '600',
        fontSize: 12,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    headingSmall: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    subHeading: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 24,
        lineHeight: 20,
    },
    amenityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    amenityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFF',
    },
    amenitySelected: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
    },
    amenityLabel: {
        color: '#64748B',
        fontWeight: '600',
        fontSize: 12,
    },
    amenityLabelSelected: {
        color: '#064E3B',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 32,
    },
    photoContainer: {
        marginBottom: 16,
    },
    dropZone: {
        height: 180,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#F8FAFC',
    },
    cameraIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    dropTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    dropSub: {
        fontSize: 12,
        color: '#94A3B8',
    },
    previewRow: {
        flexDirection: 'row',
        gap: 12,
    },
    previewBox: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 4,
    },
    addMoreBox: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    coverLabel: {
        fontSize: 8,
        fontWeight: '700',
        color: '#FFF',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    reputationCard: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
        marginTop: 12,
    },
    repLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E293B',
    },
    repBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    repBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#059669',
    },
    sliderTrack: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        position: 'relative',
        marginVertical: 12,
    },
    sliderFill: {
        position: 'absolute',
        left: 0,
        width: '70%',
        height: 6,
        backgroundColor: '#D1FAE5',
        borderRadius: 3,
    },
    sliderThumb: {
        position: 'absolute',
        right: '30%',
        top: -7,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sliderLabel: {
        fontSize: 10,
        color: '#94A3B8',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    continueBtn: {
        backgroundColor: '#1E293B',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    continueText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
