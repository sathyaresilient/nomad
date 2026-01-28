import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { currentUser } from '../../../src/data/mockUsers';
import { Colors } from '../../../src/design/colors';
import { useCommunityStore } from '../../../src/store/communityStore';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { events, requestToJoinEvent, hasPendingRequest } = useCommunityStore();
    const [showModal, setShowModal] = useState(false);

    const event = events.find(e => e.id === id);

    if (!event) return null;

    const spotsLeft = event.spotsTotal - event.attendees.length;
    const isAlreadyJoined = event.attendees.some(a => a.id === currentUser.id);
    const isPending = hasPendingRequest(event.id);
    const joined = isAlreadyJoined;

    const handleJoinPress = () => {
        if (!joined && !isPending) {
            setShowModal(true);
        }
    };

    const handleConfirmJoin = () => {
        requestToJoinEvent(event.id);
        setShowModal(false);
    };

    const handleMessageHost = () => {
        // Navigate to chat with host
        router.push(`/chat/${event.host.id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                <ImageBackground
                    source={{ uri: event.imageUrl }}
                    style={styles.heroImage}
                >
                    <View style={styles.heroOverlay}>
                        {/* Back Button */}
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>

                        {/* Spots Badge */}
                        <View style={styles.spotsBadge}>
                            <Text style={styles.spotsText}>
                                {spotsLeft > 0 ? `${spotsLeft} SPOTS LEFT` : 'FULL'}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>

                {/* Content */}
                <View style={styles.content}>
                    {/* Host Info */}
                    <View style={styles.hostRow}>
                        <Image source={{ uri: event.host.avatarUrl }} style={styles.hostAvatar} />
                        <View style={styles.hostInfo}>
                            <Text style={styles.hostedBy}>Hosted by</Text>
                            <Text style={styles.hostName}>{event.host.displayName}</Text>
                        </View>
                        <View style={styles.liveTag}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>Happening Now</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{event.title}</Text>

                    {/* Tags */}
                    <View style={styles.tagsRow}>
                        <View style={styles.tag}>
                            <Ionicons name="location" size={14} color={Colors.text.secondary} />
                            <Text style={styles.tagText}>{event.location}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Ionicons name="briefcase" size={14} color={Colors.text.secondary} />
                            <Text style={styles.tagText}>{event.category}</Text>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{event.attendees.length}</Text>
                            <Text style={styles.statLabel}>Joined</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{spotsLeft}</Text>
                            <Text style={styles.statLabel}>Spots Left</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{event.spotsTotal}</Text>
                            <Text style={styles.statLabel}>Total Spots</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>{event.description}</Text>

                    {/* Attendees Section */}
                    <View style={styles.attendeesSection}>
                        <Text style={styles.sectionTitle}>Who's Joining ({event.attendees.length})</Text>
                        <View style={styles.attendeesList}>
                            {event.attendees.map((attendee) => (
                                <View key={attendee.id} style={styles.attendeeItem}>
                                    <Image source={{ uri: attendee.avatarUrl }} style={styles.attendeeAvatar} />
                                    <View style={styles.attendeeInfo}>
                                        <Text style={styles.attendeeName}>{attendee.displayName}</Text>
                                        <Text style={styles.attendeeBio} numberOfLines={1}>{attendee.bio}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Join CTA */}
            <View style={styles.ctaContainer}>
                {isPending ? (
                    // Pending approval state
                    <>
                        <View style={styles.pendingContainer}>
                            <Ionicons name="time-outline" size={24} color="#F59E0B" />
                            <View style={styles.pendingTextContainer}>
                                <Text style={styles.pendingTitle}>Request Submitted</Text>
                                <Text style={styles.pendingSubtitle}>Awaiting host's approval</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.messageHostButton} onPress={handleMessageHost}>
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" />
                            <Text style={styles.messageHostText}>Message Host</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.joinButton, joined && styles.joinedButton]}
                        onPress={handleJoinPress}
                        disabled={joined || spotsLeft <= 0}
                    >
                        {joined ? (
                            <>
                                <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                                <Text style={styles.joinButtonText}>You're In!</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="flash" size={22} color="#FFF" />
                                <Text style={styles.joinButtonText}>Tap to Join</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Confirmation Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Image source={{ uri: event.imageUrl }} style={styles.modalImage} />
                            <View style={styles.modalBadge}>
                                <Ionicons name="flash" size={20} color="#FFF" />
                            </View>
                        </View>

                        <Text style={styles.modalTitle}>Join this event?</Text>
                        <Text style={styles.modalSubtitle}>{event.title}</Text>

                        {/* Modal Stats */}
                        <View style={styles.modalStats}>
                            <View style={styles.modalStatItem}>
                                <Ionicons name="people" size={20} color="#10B981" />
                                <Text style={styles.modalStatText}>{event.attendees.length} already joined</Text>
                            </View>
                            <View style={styles.modalStatItem}>
                                <Ionicons name="ticket" size={20} color="#F59E0B" />
                                <Text style={styles.modalStatText}>{spotsLeft} spots remaining</Text>
                            </View>
                        </View>

                        {/* Attendees Preview */}
                        <View style={styles.modalAttendees}>
                            {event.attendees.slice(0, 3).map((attendee, index) => (
                                <Image
                                    key={attendee.id}
                                    source={{ uri: attendee.avatarUrl }}
                                    style={[styles.modalAvatar, { marginLeft: index > 0 ? -10 : 0, zIndex: 5 - index }]}
                                />
                            ))}
                            {event.attendees.length > 3 && (
                                <View style={[styles.modalAvatar, styles.modalAvatarMore, { marginLeft: -10 }]}>
                                    <Text style={styles.modalAvatarMoreText}>+{event.attendees.length - 3}</Text>
                                </View>
                            )}
                        </View>

                        {/* Actions */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowModal(false)}>
                                <Text style={styles.modalCancelText}>Not Now</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirmJoin}>
                                <Ionicons name="checkmark" size={20} color="#FFF" />
                                <Text style={styles.modalConfirmText}>Confirm Join</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scroll: {
        flex: 1,
    },
    heroImage: {
        height: 280,
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spotsBadge: {
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
    content: {
        padding: 20,
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    hostAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    hostInfo: {
        flex: 1,
    },
    hostedBy: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    hostName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    liveTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EC4899',
    },
    liveText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EC4899',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.text.primary,
        marginBottom: 12,
        lineHeight: 32,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    tagText: {
        fontSize: 13,
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        color: Colors.text.secondary,
        lineHeight: 24,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text.primary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#E2E8F0',
    },
    attendeesSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 12,
    },
    attendeesList: {
        gap: 12,
    },
    attendeeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    attendeeAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E2E8F0',
    },
    attendeeInfo: {
        flex: 1,
    },
    attendeeName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    attendeeBio: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    newBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    newBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    ctaContainer: {
        padding: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        backgroundColor: '#FFF',
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F91880',
        paddingVertical: 16,
        borderRadius: 28,
        gap: 8,
    },
    joinedButton: {
        backgroundColor: '#10B981',
    },
    joinButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        width: '100%',
        maxWidth: 360,
        overflow: 'hidden',
    },
    modalHeader: {
        position: 'relative',
        height: 120,
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalBadge: {
        position: 'absolute',
        bottom: -20,
        left: '50%',
        marginLeft: -24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F91880',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text.primary,
        textAlign: 'center',
        marginTop: 32,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: 20,
    },
    modalStats: {
        marginTop: 20,
        paddingHorizontal: 24,
        gap: 12,
    },
    modalStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    modalStatText: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    modalAttendees: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    modalAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    modalAvatarMore: {
        backgroundColor: '#4B5563',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalAvatarMoreText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    modalActions: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        marginTop: 12,
    },
    modalCancelBtn: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    modalConfirmBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F91880',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    modalConfirmText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },
    // Pending state styles
    pendingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        gap: 12,
    },
    pendingTextContainer: {
        flex: 1,
    },
    pendingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#92400E',
    },
    pendingSubtitle: {
        fontSize: 13,
        color: '#B45309',
        marginTop: 2,
    },
    messageHostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        borderRadius: 28,
        gap: 8,
    },
    messageHostText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

