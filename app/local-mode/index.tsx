import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { AvailabilitySelector } from '../../src/components/AvailabilitySelector';
import { SuperpowerSelector } from '../../src/components/SuperpowerSelector';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/design/colors';
import { useLocalModeStore } from '../../src/store/localModeStore';

export default function LocalModeScreen() {
    const router = useRouter();
    const { isEnabled, toggleLocalMode } = useLocalModeStore();
    const [hostingEnabled, setHostingEnabled] = useState(true);
    const [selectedRoomType, setSelectedRoomType] = useState<'private' | 'shared'>('private');
    const [propertyPhotos, setPropertyPhotos] = useState<string[]>([]);

    // Mock photo URLs for demo
    const mockPhotos = [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400',
    ];

    const handleAddPhoto = () => {
        if (propertyPhotos.length < 6) {
            setPropertyPhotos([...propertyPhotos, mockPhotos[propertyPhotos.length]]);
        }
    };

    const removePhoto = (index: number) => {
        setPropertyPhotos(propertyPhotos.filter((_, i) => i !== index));
    };

    const handleActivate = () => {
        if (!isEnabled) toggleLocalMode();
        router.push('/local-mode/browse');
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Local Mode",
                    headerTitleStyle: {
                        fontSize: 17,
                        fontWeight: '600',
                        color: Colors.text.primary,
                    },
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#F8FAFC' },
                    headerLeft: () => (
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={Colors.text.primary}
                            onPress={() => router.back()}
                            style={{ marginLeft: 0 }}
                        />
                    ),
                    headerRight: () => (
                        <Ionicons
                            name="help-circle-outline"
                            size={24}
                            color={Colors.text.primary}
                        />
                    ),
                }}
            />

            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

                    {/* Hero Section */}
                    <View style={styles.heroCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?q=80&w=2560&auto=format&fit=crop' }}
                            style={styles.heroImage}
                        />
                        <View style={styles.heroOverlay} />
                        <View style={styles.heroContent}>
                            <View style={styles.hostBadge}>
                                <Text style={styles.hostBadgeText}>HOST MODE</Text>
                            </View>
                            <Text style={styles.heroTitle}>Share your world.</Text>
                        </View>
                    </View>

                    {/* Toggle Section */}
                    <View style={styles.toggleCard}>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleText}>
                                <Text style={styles.toggleTitle}>Enable Local Mode</Text>
                                <Text style={styles.toggleSubtitle}>Become a guide in your city. Make new friends.</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E2E8F0', true: Colors.primary.main }}
                                thumbColor={'#FFFFFF'}
                                ios_backgroundColor="#E2E8F0"
                                onValueChange={toggleLocalMode}
                                value={isEnabled}
                            />
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="earth" size={20} color={Colors.primary.main} style={styles.infoIcon} />
                            <Text style={styles.infoText}>
                                Visiting nomads will see you're open for coffee, tours, or advice. You set the rules.
                            </Text>
                        </View>
                    </View>

                    {/* Host a Room Section */}
                    <View style={styles.toggleCard}>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleText}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Ionicons name="home-outline" size={20} color={Colors.text.primary} />
                                    <Text style={styles.toggleTitle}>Host a Room</Text>
                                </View>
                                <Text style={styles.toggleSubtitle}>Offer accommodation to fellow nomads</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#E2E8F0', true: Colors.primary.main }}
                                thumbColor={'#FFFFFF'}
                                ios_backgroundColor="#E2E8F0"
                                value={hostingEnabled}
                                onValueChange={setHostingEnabled}
                            />
                        </View>

                        {/* Room Type Selection */}
                        <View style={styles.roomTypeSection}>
                            <Text style={styles.roomTypeTitle}>Room Type</Text>
                            <View style={styles.roomTypeRow}>
                                <TouchableOpacity
                                    style={[styles.roomTypeOption, selectedRoomType === 'private' && styles.roomTypeActive]}
                                    onPress={() => setSelectedRoomType('private')}
                                >
                                    <View style={styles.radioCircle}>
                                        {selectedRoomType === 'private' && <View style={styles.radioFill} />}
                                    </View>
                                    <View>
                                        <Text style={[styles.roomTypeLabel, selectedRoomType === 'private' && { color: Colors.primary.main }]}>Private Room</Text>
                                        <Text style={styles.roomTypeDesc}>Guest has their own room</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roomTypeOption, selectedRoomType === 'shared' && styles.roomTypeActive]}
                                    onPress={() => setSelectedRoomType('shared')}
                                >
                                    <View style={styles.radioCircle}>
                                        {selectedRoomType === 'shared' && <View style={styles.radioFill} />}
                                    </View>
                                    <View>
                                        <Text style={[styles.roomTypeLabel, selectedRoomType === 'shared' && { color: Colors.primary.main }]}>Shared Room</Text>
                                        <Text style={styles.roomTypeDesc}>Guest shares a room with others</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Property Photos */}
                        <View style={styles.photosSection}>
                            <View style={styles.photosSectionHeader}>
                                <Text style={styles.roomTypeTitle}>Property Photos</Text>
                                <Text style={styles.photoCount}>{propertyPhotos.length}/6</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
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
                    </View>

                    {/* Config Sections */}
                    <AvailabilitySelector />
                    <SuperpowerSelector />

                </ScrollView>

                {/* Floating Action Button Footer */}
                <View style={styles.footer}>
                    <Text style={styles.privacyText}>
                        <Ionicons name="lock-closed" size={12} color={Colors.text.muted} />{' '}
                        Your exact home location is never shared. We only show your general city or neighborhood area.
                    </Text>
                    <Button
                        title="Activate Local Profile"
                        onPress={handleActivate}
                        variant="primary"
                        style={styles.button}
                    />
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space for footer
    },
    heroCard: {
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    hostBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)', // Note: This might need a polyfill or specific iOS view on RN, usually generic View is fine with low opacity
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    hostBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
    },
    toggleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    toggleText: {
        flex: 1,
        paddingRight: 16,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    toggleSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    infoIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: Colors.text.secondary,
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F8FAFC',
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    privacyText: {
        fontSize: 12,
        color: Colors.text.muted,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 16,
    },
    button: {
        width: '100%',
    },
    // Room Type Section
    roomTypeSection: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    roomTypeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
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
        marginBottom: 8,
    },
    roomTypeActive: {
        borderColor: Colors.primary.main,
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
        backgroundColor: Colors.primary.main,
    },
    roomTypeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    roomTypeDesc: {
        fontSize: 12,
        color: Colors.text.muted,
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
        color: Colors.text.muted,
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
});
