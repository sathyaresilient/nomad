import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';

export const PulseHeroCard = () => {
    const router = useRouter();
    // Mock Data based on "Coworking deep work sesh at Dojo"
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Happening Now</Text>
                <View style={styles.liveDot} />
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => router.push('/community/event/cowork-dojo-1')}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                    style={styles.bgImage}
                    imageStyle={{ borderRadius: 24 }}
                >
                    <View style={styles.overlay}>
                        {/* Top Row */}
                        <View style={styles.cardHeader}>
                            <View style={styles.creatorTag}>
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }}
                                    style={styles.miniAvatar}
                                />
                                <View>
                                    <Text style={styles.creatorName}>Sarah</Text>
                                    <Text style={styles.timeAgo}>2m ago</Text>
                                </View>
                            </View>
                            <View style={styles.spotsTag}>
                                <Text style={styles.spotsText}>3 SPOTS LEFT</Text>
                            </View>
                        </View>

                        {/* Bottom Content */}
                        <View style={styles.cardContent}>
                            <View style={styles.tagsRow}>
                                <View style={styles.blurTag}>
                                    <Ionicons name="location" size={12} color="#FFF" />
                                    <Text style={styles.tagText}>Canggu</Text>
                                </View>
                                <View style={styles.blurTag}>
                                    <Ionicons name="cafe" size={12} color="#FFF" />
                                    <Text style={styles.tagText}>Focus Mode</Text>
                                </View>
                            </View>

                            <Text style={styles.eventTitle}>Coworking deep work sesh at Dojo 💻</Text>

                            <View style={styles.footerRow}>
                                <View style={styles.attendees}>
                                    <Image source={{ uri: 'https://i.pravatar.cc/150?u=mark' }} style={[styles.attendeeAvatar, { zIndex: 3 }]} />
                                    <Image source={{ uri: 'https://i.pravatar.cc/150?u=jonas' }} style={[styles.attendeeAvatar, { marginLeft: -12, zIndex: 2 }]} />
                                    <View style={[styles.attendeeAvatar, styles.moreAttendees, { marginLeft: -12, zIndex: 1 }]}>
                                        <Text style={styles.moreText}>+2</Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.joinButton} onPress={() => router.push('/community/event/cowork-dojo-1')}>
                                    <Text style={styles.joinText}>Tap to Join</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text.primary,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EC4899', // Pink dot
    },
    card: {
        height: 380,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 5,
    },
    bgImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)', // Darken
        borderRadius: 24,
        padding: 16,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    creatorTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 4,
        paddingRight: 12,
        borderRadius: 20,
        gap: 8,
    },
    miniAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    creatorName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
    },
    timeAgo: {
        fontSize: 10,
        color: '#666',
    },
    spotsTag: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    spotsText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    cardContent: {},
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    blurTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    tagText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    eventTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 20,
        lineHeight: 32,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    attendees: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    attendeeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFF',
        backgroundColor: '#ccc',
    },
    moreAttendees: {
        backgroundColor: '#4B5563',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F91880', // Hot pink
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 6,
    },
    joinText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
