/**
 * My Nomadpic Screen - Instagram-style personal profile
 * User can add photos, write about themselves, mention travel places, likes/dislikes
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../src/design/colors';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 44) / 3;

// Popular locations for selection
const POPULAR_LOCATIONS = [
    { name: 'Bali', emoji: '🇮🇩', country: 'Indonesia' },
    { name: 'Lisbon', emoji: '🇵🇹', country: 'Portugal' },
    { name: 'Tokyo', emoji: '🇯🇵', country: 'Japan' },
    { name: 'Barcelona', emoji: '🇪🇸', country: 'Spain' },
    { name: 'Medellín', emoji: '🇨🇴', country: 'Colombia' },
    { name: 'Chiang Mai', emoji: '🇹🇭', country: 'Thailand' },
    { name: 'Mexico City', emoji: '🇲🇽', country: 'Mexico' },
    { name: 'Cape Town', emoji: '🇿🇦', country: 'South Africa' },
];

// Mock data for places visited with photos
const PLACES_VISITED = [
    {
        id: '1', name: 'Bali', emoji: '🇮🇩', year: '2024', photos: [
            { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', caption: 'Rice terraces hit different 🌾' },
            { url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800', caption: 'Temple vibes ✨' },
            { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', caption: 'Sunset sessions 🌅' },
        ]
    },
    {
        id: '2', name: 'Lisbon', emoji: '🇵🇹', year: '2024', photos: [
            { url: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800', caption: 'Tram 28 adventures 🚃' },
            { url: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=800', caption: 'Pastel de nata life 🥧' },
        ]
    },
    {
        id: '3', name: 'Tokyo', emoji: '🇯🇵', year: '2023', photos: [
            { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', caption: 'Lost in translation 🗼' },
            { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', caption: 'Ramen therapy 🍜' },
        ]
    },
    {
        id: '4', name: 'Barcelona', emoji: '🇪🇸', year: '2023', photos: [
            { url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', caption: 'Gaudí was onto something 🏛️' },
        ]
    },
    {
        id: '5', name: 'Medellín', emoji: '🇨🇴', year: '2022', photos: [
            { url: 'https://images.unsplash.com/photo-1599413990234-1a99e4b72cad?w=800', caption: 'City of eternal spring 🌸' },
        ]
    },
];

// Mock photos
const MOCK_PHOTOS = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
];

export default function BiopicScreen() {
    const router = useRouter();
    const [bio, setBio] = useState("Digital nomad & remote software engineer. Love finding the perfect café to work from and exploring local food scenes. Currently slow-traveling through Europe.");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [photos, setPhotos] = useState(MOCK_PHOTOS.slice(0, 3));
    const [likes, setLikes] = useState(['Coffee shops', 'Hiking', 'Street food', 'Coworking spaces']);
    const [dislikes, setDislikes] = useState(['Tourist traps', 'Crowded hostels']);

    // Current location state
    const [currentLocation, setCurrentLocation] = useState({ name: 'Bali', emoji: '🇮🇩', country: 'Indonesia' });
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    // Instagram handle
    const [instagramHandle, setInstagramHandle] = useState('alexnomad');

    // Photo carousel state
    const [selectedLocation, setSelectedLocation] = useState<typeof PLACES_VISITED[0] | null>(null);
    const [showPhotoCarousel, setShowPhotoCarousel] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handleAddPhoto = () => {
        if (photos.length < 9) {
            setPhotos([...photos, MOCK_PHOTOS[photos.length % MOCK_PHOTOS.length]]);
        }
    };

    const stats = {
        countries: 12,
        cities: 34,
        connections: 156,
    };

    const handleInstagramRedirect = () => {
        const instagramUrl = `instagram://user?username=${instagramHandle}`;
        const webUrl = `https://instagram.com/${instagramHandle}`;

        Linking.canOpenURL(instagramUrl).then((supported) => {
            if (supported) {
                Linking.openURL(instagramUrl);
            } else {
                Linking.openURL(webUrl);
            }
        });
    };

    const handleLocationSelect = (location: typeof POPULAR_LOCATIONS[0]) => {
        setCurrentLocation(location);
        setShowLocationPicker(false);
    };

    const handlePlaceClick = (place: typeof PLACES_VISITED[0]) => {
        setSelectedLocation(place);
        setCurrentPhotoIndex(0);
        setShowPhotoCarousel(true);
    };

    // Likes/Dislikes modal state
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [addItemType, setAddItemType] = useState<'like' | 'dislike'>('like');
    const [newItemText, setNewItemText] = useState('');

    const handleOpenAddItem = (type: 'like' | 'dislike') => {
        setAddItemType(type);
        setNewItemText('');
        setShowAddItemModal(true);
    };

    const handleAddItem = () => {
        if (newItemText.trim()) {
            if (addItemType === 'like') {
                setLikes([...likes, newItemText.trim()]);
            } else {
                setDislikes([...dislikes, newItemText.trim()]);
            }
            setShowAddItemModal(false);
            setNewItemText('');
        }
    };

    const handleRemoveLike = (index: number) => {
        setLikes(likes.filter((_, i) => i !== index));
    };

    const handleRemoveDislike = (index: number) => {
        setDislikes(dislikes.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Nomadpic</Text>
                    <TouchableOpacity>
                        <Ionicons name="share-outline" size={24} color="#1E293B" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile Header - Instagram Style */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarSection}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?u=alex' }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarBtn}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.countries}</Text>
                                <Text style={styles.statLabel}>Countries</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.cities}</Text>
                                <Text style={styles.statLabel}>Cities</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.connections}</Text>
                                <Text style={styles.statLabel}>Connections</Text>
                            </View>
                        </View>
                    </View>

                    {/* Current Location Selector */}
                    <TouchableOpacity
                        style={styles.currentLocationCard}
                        onPress={() => setShowLocationPicker(true)}
                    >
                        <View style={styles.locationLeft}>
                            <Ionicons name="location" size={20} color={Colors.primary.main} />
                            <View>
                                <Text style={styles.locationLabel}>Currently in</Text>
                                <Text style={styles.locationValue}>{currentLocation.emoji} {currentLocation.name}, {currentLocation.country}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    {/* Name & Username */}
                    <View style={styles.nameSection}>
                        <Text style={styles.displayName}>Alex Thompson</Text>
                        <View style={styles.usernameRow}>
                            <Text style={styles.username}>@alexnomad • Digital Nomad since 2021</Text>
                        </View>

                        {/* Instagram CTA */}
                        <TouchableOpacity
                            style={styles.instagramBtn}
                            onPress={handleInstagramRedirect}
                        >
                            <Ionicons name="logo-instagram" size={18} color="#FFF" />
                            <Text style={styles.instagramBtnText}>@{instagramHandle}</Text>
                            <Ionicons name="open-outline" size={14} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Bio Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>About Me</Text>
                            <TouchableOpacity onPress={() => setIsEditingBio(!isEditingBio)}>
                                <Ionicons name={isEditingBio ? "checkmark" : "pencil"} size={18} color={Colors.primary.main} />
                            </TouchableOpacity>
                        </View>
                        {isEditingBio ? (
                            <TextInput
                                style={styles.bioInput}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                placeholder="Write about yourself..."
                            />
                        ) : (
                            <Text style={styles.bioText}>{bio}</Text>
                        )}
                    </View>

                    {/* Places Visited */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Places I've Traveled</Text>
                            <TouchableOpacity>
                                <Ionicons name="add-circle-outline" size={20} color={Colors.primary.main} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.placesRow}>
                            {PLACES_VISITED.map((place, index) => (
                                <TouchableOpacity
                                    key={place.id}
                                    style={styles.placeChip}
                                    onPress={() => handlePlaceClick(place)}
                                >
                                    <Text style={styles.placeEmoji}>{place.emoji}</Text>
                                    <Text style={styles.placeName}>{place.name}</Text>
                                    <Text style={styles.placeYear}>{place.year}</Text>
                                    <View style={styles.photoCount}>
                                        <Ionicons name="images" size={10} color="#64748B" />
                                        <Text style={styles.photoCountText}>{place.photos.length}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Likes */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons name="heart" size={18} color="#EF4444" />
                                <Text style={styles.sectionTitle}>What I Love</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleOpenAddItem('like')}>
                                <Ionicons name="add-circle-outline" size={20} color={Colors.primary.main} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tagsRow}>
                            {likes.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.tag, styles.likeTag]}
                                    onLongPress={() => handleRemoveLike(index)}
                                >
                                    <Text style={styles.likeTagText}>{item}</Text>
                                    <Ionicons name="close-circle" size={14} color="#EF4444" style={{ marginLeft: 4 }} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Dislikes */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons name="thumbs-down" size={18} color="#94A3B8" />
                                <Text style={styles.sectionTitle}>Not My Thing</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleOpenAddItem('dislike')}>
                                <Ionicons name="add-circle-outline" size={20} color={Colors.primary.main} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tagsRow}>
                            {dislikes.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.tag, styles.dislikeTag]}
                                    onLongPress={() => handleRemoveDislike(index)}
                                >
                                    <Text style={styles.dislikeTagText}>{item}</Text>
                                    <Ionicons name="close-circle" size={14} color="#64748B" style={{ marginLeft: 4 }} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Photo Grid */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>My Photos</Text>
                            <TouchableOpacity onPress={handleAddPhoto}>
                                <Ionicons name="add-circle-outline" size={20} color={Colors.primary.main} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.photoGrid}>
                            {photos.map((photo, index) => (
                                <Image key={index} source={{ uri: photo }} style={styles.gridPhoto} />
                            ))}
                            {photos.length < 9 && (
                                <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
                                    <Ionicons name="camera-outline" size={28} color="#94A3B8" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Travel Style */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Travel Style</Text>
                        <View style={styles.styleCard}>
                            <View style={styles.styleRow}>
                                <Text style={styles.styleLabel}>Pace</Text>
                                <Text style={styles.styleValue}>🐢 Slow Traveler</Text>
                            </View>
                            <View style={styles.styleRow}>
                                <Text style={styles.styleLabel}>Budget</Text>
                                <Text style={styles.styleValue}>💰 Mid-range</Text>
                            </View>
                            <View style={styles.styleRow}>
                                <Text style={styles.styleLabel}>Accommodation</Text>
                                <Text style={styles.styleValue}>🏠 Airbnbs & Apartments</Text>
                            </View>
                            <View style={styles.styleRow}>
                                <Text style={styles.styleLabel}>Work Style</Text>
                                <Text style={styles.styleValue}>☕ Café hopper</Text>
                            </View>
                        </View>
                    </View>

                    {/* Trust Score Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                                <Text style={styles.sectionTitle}>Trust Score</Text>
                            </View>
                        </View>
                        <View style={styles.trustCard}>
                            <View style={styles.trustScoreCircle}>
                                <Text style={styles.trustScoreNumber}>92</Text>
                                <Text style={styles.trustScoreLabel}>/ 100</Text>
                            </View>
                            <View style={styles.trustBreakdown}>
                                <View style={styles.trustItem}>
                                    <View style={styles.trustItemHeader}>
                                        <Text>🏠</Text>
                                        <Text style={styles.trustItemLabel}>Host Rating</Text>
                                    </View>
                                    <View style={styles.starsRow}>
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star-half" size={14} color="#FBBF24" />
                                        <Text style={styles.ratingText}>4.8 (12 reviews)</Text>
                                    </View>
                                </View>
                                <View style={styles.trustItem}>
                                    <View style={styles.trustItemHeader}>
                                        <Text>🧳</Text>
                                        <Text style={styles.trustItemLabel}>Traveler Rating</Text>
                                    </View>
                                    <View style={styles.starsRow}>
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Ionicons name="star" size={14} color="#FBBF24" />
                                        <Text style={styles.ratingText}>5.0 (8 reviews)</Text>
                                    </View>
                                </View>
                                <View style={styles.verificationsRow}>
                                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                    <Text style={styles.verificationsText}>4 verifications completed</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>

                {/* Location Picker Modal */}
                <Modal
                    visible={showLocationPicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowLocationPicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Current Location</Text>
                                <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                                    <Ionicons name="close" size={24} color="#1E293B" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.locationList}>
                                {POPULAR_LOCATIONS.map((location, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.locationItem,
                                            currentLocation.name === location.name && styles.locationItemActive
                                        ]}
                                        onPress={() => handleLocationSelect(location)}
                                    >
                                        <Text style={styles.locationItemEmoji}>{location.emoji}</Text>
                                        <View>
                                            <Text style={styles.locationItemName}>{location.name}</Text>
                                            <Text style={styles.locationItemCountry}>{location.country}</Text>
                                        </View>
                                        {currentLocation.name === location.name && (
                                            <Ionicons name="checkmark-circle" size={22} color={Colors.primary.main} style={{ marginLeft: 'auto' }} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Photo Carousel Modal */}
                <Modal
                    visible={showPhotoCarousel}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowPhotoCarousel(false)}
                >
                    <View style={styles.carouselOverlay}>
                        <View style={styles.carouselHeader}>
                            <TouchableOpacity onPress={() => setShowPhotoCarousel(false)}>
                                <Ionicons name="close" size={28} color="#FFF" />
                            </TouchableOpacity>
                            <Text style={styles.carouselTitle}>
                                {selectedLocation?.emoji} {selectedLocation?.name}
                            </Text>
                            <Text style={styles.carouselCount}>
                                {currentPhotoIndex + 1} / {selectedLocation?.photos.length || 0}
                            </Text>
                        </View>

                        {selectedLocation && (
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(e) => {
                                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                                    setCurrentPhotoIndex(index);
                                }}
                                style={styles.carouselScroll}
                            >
                                {selectedLocation.photos.map((photo, index) => (
                                    <View key={index} style={styles.carouselSlide}>
                                        <Image
                                            source={{ uri: photo.url }}
                                            style={styles.carouselImage}
                                            resizeMode="cover"
                                        />
                                        {photo.caption && (
                                            <View style={styles.captionContainer}>
                                                <Text style={styles.captionText}>{photo.caption}</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        <View style={styles.carouselDots}>
                            {selectedLocation?.photos.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentPhotoIndex === index && styles.dotActive
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </Modal>

                {/* Add Item Modal (Likes/Dislikes) */}
                <Modal
                    visible={showAddItemModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowAddItemModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {addItemType === 'like' ? '❤️ Add Something You Love' : '👎 Add Something You Dislike'}
                                </Text>
                                <TouchableOpacity onPress={() => setShowAddItemModal(false)}>
                                    <Ionicons name="close" size={24} color="#1E293B" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.addItemForm}>
                                <TextInput
                                    style={styles.addItemInput}
                                    value={newItemText}
                                    onChangeText={setNewItemText}
                                    placeholder={addItemType === 'like' ? "e.g., Rooftop cafés" : "e.g., Early flights"}
                                    placeholderTextColor="#94A3B8"
                                    autoFocus
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.addItemBtn,
                                        !newItemText.trim() && styles.addItemBtnDisabled
                                    ]}
                                    onPress={handleAddItem}
                                    disabled={!newItemText.trim()}
                                >
                                    <Ionicons name="add" size={20} color="#FFF" />
                                    <Text style={styles.addItemBtnText}>Add</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.suggestions}>
                                <Text style={styles.suggestionsTitle}>Suggestions:</Text>
                                <View style={styles.suggestionsRow}>
                                    {(addItemType === 'like'
                                        ? ['Beach sunsets', 'Local markets', 'Solo travel', 'Co-living']
                                        : ['Long layovers', 'Overpriced coffee', 'Slow WiFi', 'Small talk']
                                    ).map((suggestion, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.suggestionChip}
                                            onPress={() => setNewItemText(suggestion)}
                                        >
                                            <Text style={styles.suggestionText}>{suggestion}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
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

    // Profile Header
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 24,
    },
    avatarSection: {
        position: 'relative',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: Colors.primary.main,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    statsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },

    // Name Section
    nameSection: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    displayName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    username: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    usernameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    // Current Location
    currentLocationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: '#F0FDF4',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    locationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    locationLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
    },
    locationValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },

    // Instagram CTA
    instagramBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E1306C',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    instagramBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },

    // Sections
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },

    // Bio
    bioText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    bioInput: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        borderWidth: 1,
        borderColor: Colors.primary.main,
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
    },

    // Places
    placesRow: {
        gap: 10,
    },
    placeChip: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    placeEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    placeName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E293B',
    },
    placeYear: {
        fontSize: 10,
        color: '#94A3B8',
    },

    // Tags
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    likeTag: {
        backgroundColor: '#FEF2F2',
    },
    likeTagText: {
        fontSize: 13,
        color: '#EF4444',
        fontWeight: '500',
    },
    dislikeTag: {
        backgroundColor: '#F1F5F9',
    },
    dislikeTagText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },

    // Photo Grid
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
    },
    gridPhoto: {
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        backgroundColor: '#E2E8F0',
    },
    addPhotoBtn: {
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },

    // Travel Style
    styleCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    styleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    styleLabel: {
        fontSize: 13,
        color: '#64748B',
    },
    styleValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E293B',
    },

    // Photo Count Badge
    photoCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    photoCountText: {
        fontSize: 10,
        color: '#64748B',
    },

    // Trust Score Section
    trustCard: {
        backgroundColor: '#F0FDF4',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    trustScoreCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trustScoreNumber: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
    },
    trustScoreLabel: {
        fontSize: 10,
        color: '#FFF',
        opacity: 0.8,
    },
    trustBreakdown: {
        flex: 1,
        gap: 10,
    },
    trustItem: {
        gap: 4,
    },
    trustItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    trustItemLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E293B',
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        fontSize: 11,
        color: '#64748B',
        marginLeft: 6,
    },
    verificationsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    verificationsText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '500',
    },

    // Location Picker Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    locationList: {
        padding: 10,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        gap: 12,
    },
    locationItemActive: {
        backgroundColor: '#F0FDF4',
    },
    locationItemEmoji: {
        fontSize: 28,
    },
    locationItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    locationItemCountry: {
        fontSize: 12,
        color: '#64748B',
    },

    // Photo Carousel Modal
    carouselOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
    },
    carouselHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    carouselTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    carouselCount: {
        fontSize: 14,
        color: '#94A3B8',
    },
    carouselScroll: {
        flex: 1,
    },
    carouselSlide: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselImage: {
        width: width - 40,
        height: width - 40,
        borderRadius: 16,
    },
    captionContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        padding: 12,
    },
    captionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        textAlign: 'center',
    },
    carouselDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4B5563',
    },
    dotActive: {
        backgroundColor: '#FFF',
        width: 24,
    },

    // Add Item Modal
    addItemForm: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    addItemInput: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1E293B',
    },
    addItemBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 4,
    },
    addItemBtnDisabled: {
        backgroundColor: '#CBD5E1',
    },
    addItemBtnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    suggestions: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    suggestionsTitle: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 10,
    },
    suggestionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    suggestionChip: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    suggestionText: {
        fontSize: 13,
        color: '#475569',
    },
});
