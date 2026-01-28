import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../../store/communityStore';

interface Props {
    event: Event;
    onPress: () => void;
}

export const EventCard = ({ event, onPress }: Props) => {
    const spotsLeft = event.spotsTotal - event.attendees.length;

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPress}>
            <ImageBackground
                source={{ uri: event.imageUrl }}
                style={styles.bgImage}
                imageStyle={{ borderRadius: 16 }}
            >
                <View style={styles.overlay}>
                    {/* Top Row */}
                    <View style={styles.header}>
                        <View style={styles.hostTag}>
                            <Image
                                source={{ uri: event.host.avatarUrl }}
                                style={styles.hostAvatar}
                            />
                            <View>
                                <Text style={styles.hostName}>{event.host.displayName}</Text>
                                <Text style={styles.timeAgo}>2m ago</Text>
                            </View>
                        </View>
                        <View style={styles.spotsTag}>
                            <Text style={styles.spotsText}>{spotsLeft} SPOTS LEFT</Text>
                        </View>
                    </View>

                    {/* Bottom Content */}
                    <View style={styles.content}>
                        <View style={styles.tagsRow}>
                            <View style={styles.blurTag}>
                                <Ionicons name="location" size={12} color="#FFF" />
                                <Text style={styles.tagText}>{event.location}</Text>
                            </View>
                            <View style={styles.blurTag}>
                                <Ionicons name="briefcase" size={12} color="#FFF" />
                                <Text style={styles.tagText}>{event.category}</Text>
                            </View>
                        </View>

                        <Text style={styles.eventTitle}>{event.title}</Text>

                        <View style={styles.footerRow}>
                            <View style={styles.attendees}>
                                {event.attendees.slice(0, 2).map((attendee, index) => (
                                    <Image
                                        key={attendee.id}
                                        source={{ uri: attendee.avatarUrl }}
                                        style={[
                                            styles.attendeeAvatar,
                                            { marginLeft: index > 0 ? -12 : 0, zIndex: 3 - index }
                                        ]}
                                    />
                                ))}
                                {event.attendees.length > 2 && (
                                    <View style={[styles.attendeeAvatar, styles.moreAttendees, { marginLeft: -12, zIndex: 0 }]}>
                                        <Text style={styles.moreText}>+{event.attendees.length - 2}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.joinButton}>
                                <Text style={styles.joinText}>Tap to Join</Text>
                                <Ionicons name="arrow-forward" size={16} color="#FFF" />
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 280,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    bgImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 16,
        padding: 14,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    hostTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 4,
        paddingRight: 12,
        borderRadius: 20,
        gap: 8,
    },
    hostAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    hostName: {
        fontSize: 11,
        fontWeight: '700',
        color: '#000',
    },
    timeAgo: {
        fontSize: 9,
        color: '#666',
    },
    spotsTag: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    spotsText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    content: {},
    tagsRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 10,
    },
    blurTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 6,
        gap: 4,
    },
    tagText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 14,
        lineHeight: 24,
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
        width: 32,
        height: 32,
        borderRadius: 16,
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
        fontSize: 10,
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F91880',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 4,
    },
    joinText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
});
