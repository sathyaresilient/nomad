/**
 * Group Map View
 * Displays all pinned locations from the group on a map
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../design/colors';
import { GroupPost } from '../../types/groups';

interface GroupMapViewProps {
    posts: GroupPost[];
    groupName: string;
}

export const GroupMapView: React.FC<GroupMapViewProps> = ({ posts, groupName }) => {
    const [selectedPin, setSelectedPin] = useState<GroupPost | null>(null);

    // Filter only pin posts with locations
    const pinPosts = posts.filter((p) => p.type === 'pin' && p.location);

    const openInMaps = (lat: number, lng: number, name: string) => {
        const url = `https://maps.google.com/?q=${lat},${lng}`;
        Linking.openURL(url).catch(() => {
            Alert.alert('Open Maps', `View ${name} on Google Maps?`);
        });
    };

    if (pinPosts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyContent}>
                    <Ionicons name="map-outline" size={64} color={Colors.text.muted} />
                    <Text style={styles.emptyTitle}>No places pinned yet</Text>
                    <Text style={styles.emptyText}>
                        Members can pin their favorite spots to share with the group
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Map Preview (placeholder - would use react-native-maps in production) */}
            <View style={styles.mapPreview}>
                <View style={styles.mapGrid}>
                    {/* Decorative map pins */}
                    {pinPosts.slice(0, 6).map((pin, idx) => (
                        <TouchableOpacity
                            key={pin.id}
                            style={[
                                styles.mapPin,
                                {
                                    top: 20 + (idx % 3) * 60,
                                    left: 30 + (idx % 2) * 120 + (idx * 15),
                                },
                            ]}
                            onPress={() => setSelectedPin(pin)}
                        >
                            <Ionicons
                                name="location"
                                size={32}
                                color={selectedPin?.id === pin.id ? Colors.primary.main : '#3B82F6'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.mapOverlay}>
                    <View style={styles.mapBadge}>
                        <Ionicons name="location" size={14} color="#FFF" />
                        <Text style={styles.mapBadgeText}>{pinPosts.length} places</Text>
                    </View>
                </View>
            </View>

            {/* Pin List */}
            <ScrollView style={styles.pinList}>
                <Text style={styles.sectionTitle}>PINNED PLACES</Text>

                {pinPosts.map((pin) => (
                    <TouchableOpacity
                        key={pin.id}
                        style={[styles.pinCard, selectedPin?.id === pin.id && styles.pinCardSelected]}
                        onPress={() => {
                            if (pin.location) {
                                openInMaps(pin.location.latitude, pin.location.longitude, pin.location.name);
                            }
                        }}
                    >
                        <View style={styles.pinIcon}>
                            <Ionicons name="location" size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.pinInfo}>
                            <Text style={styles.pinName}>{pin.location?.name}</Text>
                            {pin.location?.address && (
                                <Text style={styles.pinAddress}>{pin.location.address}</Text>
                            )}
                            <View style={styles.pinMeta}>
                                <Image
                                    source={{ uri: pin.authorAvatar || `https://i.pravatar.cc/150?u=${pin.authorId}` }}
                                    style={styles.authorAvatar}
                                />
                                <Text style={styles.authorName}>by {pin.authorName}</Text>
                            </View>
                        </View>
                        <Ionicons name="open-outline" size={18} color={Colors.text.muted} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyContent: {
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.text.muted,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    mapPreview: {
        height: 200,
        backgroundColor: '#E0F2FE',
        borderBottomWidth: 1,
        borderBottomColor: '#BAE6FD',
        position: 'relative',
    },
    mapGrid: {
        flex: 1,
        position: 'relative',
    },
    mapPin: {
        position: 'absolute',
        zIndex: 1,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 12,
    },
    mapBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    mapBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
    },
    pinList: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.text.muted,
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    pinCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    pinCardSelected: {
        borderColor: Colors.primary.main,
        backgroundColor: '#F0FDFA',
    },
    pinIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    pinInfo: {
        flex: 1,
    },
    pinName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    pinAddress: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    pinMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    authorAvatar: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    authorName: {
        fontSize: 11,
        color: Colors.text.muted,
    },
});
