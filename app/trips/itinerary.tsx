import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockUsers } from '../../src/data/mockUsers';

export default function SmartItineraryScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1599824425751-b8e3a876855b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} // Map of Medellin
                style={styles.mapBg}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.locationBadge}>
                            <Ionicons name="location" size={14} color="#FFF" />
                            <Text style={styles.locationText}>Medellin, CO</Text>
                        </View>
                        <View style={styles.bellBtn}>
                            <Ionicons name="notifications" size={20} color="#EF4444" />
                        </View>
                    </View>

                    {/* Trip Details */}
                    <View style={styles.tripInfo}>
                        <Text style={styles.label}>Current Trip</Text>
                        <Text style={styles.dates}>Oct 12 — Nov 15</Text>

                        {/* Avatar Stack */}
                        <View style={styles.avatarStack}>
                            <Image source={{ uri: mockUsers[1].avatarUrl }} style={[styles.avatar, { left: 0 }]} />
                            <Image source={{ uri: mockUsers[2].avatarUrl }} style={[styles.avatar, { left: 24 }]} />
                            <View style={[styles.avatar, styles.moreAvatar, { left: 48 }]}>
                                <Text style={styles.moreText}>+3</Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        {/* Social Alert Card */}
                        <View style={styles.alertCard}>
                            <View style={styles.alertHeader}>
                                <View style={styles.trustedTag}>
                                    <Ionicons name="lock-closed" size={10} color="#0EA5E9" />
                                    <Text style={styles.trustedText}>TRUSTED ONLY</Text>
                                </View>
                                <Text style={styles.timestamp}>Just now</Text>
                            </View>

                            <Text style={styles.alertTitle}>
                                Social Alert: <Text style={{ color: '#0EA5E9' }}>3 trusted friends</Text> are overlapping with you next Tuesday.
                            </Text>
                            <Text style={styles.alertBody}>
                                You, Sarah, and Mike are all free in the evening. This is a rare overlap!
                            </Text>

                            <TouchableOpacity style={styles.primaryBtn}>
                                <Ionicons name="megaphone-outline" size={18} color="#FFF" />
                                <Text style={styles.btnText}>Host a Meetup</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Overlap Intensity Graph */}
                        <View style={styles.graphCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Overlap Intensity</Text>
                                <TouchableOpacity>
                                    <Text style={styles.linkText}>View Calendar</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Dummy Graph Visualization */}
                            <View style={styles.graphContainer}>
                                <View style={styles.graphBarContainer}>
                                    <View style={[styles.graphBar, { height: 20 }]} />
                                    <Text style={styles.dayText}>12</Text>
                                </View>
                                <View style={styles.graphBarContainer}>
                                    <View style={[styles.graphBar, { height: 35 }]} />
                                    <Text style={styles.dayText}>13</Text>
                                </View>
                                <View style={styles.graphBarContainer}>
                                    <View style={[styles.graphBar, { height: 30 }]} />
                                    <Text style={styles.dayText}>14</Text>
                                </View>
                                <View style={styles.graphBarContainer}>
                                    <View style={[styles.graphBar, { height: 60 }]} />
                                    <Text style={styles.dayText}>15</Text>
                                </View>
                                <View style={styles.graphBarContainer}>
                                    <View style={styles.graphBubble}>
                                        <Text style={styles.bubbleText}>5 Friends</Text>
                                    </View>
                                    <View style={[styles.graphBar, { height: 100, backgroundColor: '#FFF' }]} />
                                    <Text style={[styles.dayText, { color: '#FFF', fontWeight: '700' }]}>16</Text>
                                </View>
                                <View style={styles.graphBarContainer}>
                                    <View style={[styles.graphBar, { height: 40 }]} />
                                    <Text style={styles.dayText}>17</Text>
                                </View>
                                <View style={styles.graphBarContainer}>
                                    <View style={[styles.graphBar, { height: 20 }]} />
                                    <Text style={styles.dayText}>18</Text>
                                </View>
                            </View>
                        </View>

                        {/* In Town Now */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>In Town Now</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>12</Text>
                            </View>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRow}>
                            {mockUsers.map(user => (
                                <View key={user.id} style={styles.avatarItem}>
                                    <Image source={{ uri: user.avatarUrl }} style={styles.gridAvatar} />
                                    <Text style={styles.avatarName}>{user.displayName.split(' ')[0]}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Suggested Agenda */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Suggested for Tuesday</Text>
                        </View>

                        <View style={styles.agendaItem}>
                            <View style={styles.iconBox}>
                                <Ionicons name="laptop-outline" size={24} color="#0EA5E9" />
                            </View>
                            <View style={styles.agendaContent}>
                                <Text style={styles.agendaTitle}>Deep Work Session</Text>
                                <Text style={styles.agendaSub}>At Selina Cowork • <Text style={{ color: '#0EA5E9' }}>2 friends attending</Text></Text>
                            </View>
                            <Text style={styles.timeText}>10:00 AM</Text>
                        </View>

                        <View style={styles.agendaItem}>
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                <Ionicons name="beer-outline" size={24} color="#F59E0B" />
                            </View>
                            <View style={styles.agendaContent}>
                                <Text style={styles.agendaTitle}>Post-Work Drinks</Text>
                                <Text style={styles.agendaSub}>At El Social • <Text style={{ color: '#0EA5E9' }}>4 friends attending</Text></Text>
                            </View>
                            <Text style={styles.timeText}>07:00 PM</Text>
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    mapBg: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        alignItems: 'center',
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    locationBadge: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    locationText: {
        color: '#FFF',
        fontWeight: '600',
    },
    bellBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    tripInfo: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    dates: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
    },
    avatarStack: {
        flexDirection: 'row',
        height: 36,
        position: 'relative',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#0F172A',
        position: 'absolute',
    },
    moreAvatar: {
        backgroundColor: '#1E293B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    scrollContent: {
        backgroundColor: '#0F172A',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        minHeight: 500,
    },
    alertCard: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#334155',
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    trustedTag: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    trustedText: {
        color: '#0EA5E9',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    timestamp: {
        color: '#64748B',
        fontSize: 12,
    },
    alertTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 26,
        marginBottom: 8,
    },
    alertBody: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    primaryBtn: {
        backgroundColor: '#0F766E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 24,
        gap: 8,
    },
    btnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
    graphCard: {
        backgroundColor: '#172033',
        borderRadius: 24,
        padding: 20,
        marginBottom: 32,
        minHeight: 200,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    linkText: {
        color: '#0EA5E9',
        fontSize: 14,
        fontWeight: '600',
    },
    graphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 100,
        marginBottom: 10,
    },
    graphBarContainer: {
        alignItems: 'center',
        gap: 8,
    },
    graphBar: {
        width: 4,
        backgroundColor: '#334155',
        borderRadius: 2,
    },
    dayText: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '600',
    },
    graphBubble: {
        position: 'absolute',
        top: -30,
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bubbleText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#0F172A',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    badge: {
        backgroundColor: '#334155',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '600',
    },
    avatarRow: {
        marginBottom: 32,
    },
    avatarItem: {
        alignItems: 'center',
        marginRight: 16,
        gap: 6,
    },
    gridAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#334155',
    },
    avatarName: {
        color: '#94A3B8',
        fontSize: 12,
    },
    agendaItem: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    agendaContent: {
        flex: 1,
    },
    agendaTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    agendaSub: {
        color: '#94A3B8',
        fontSize: 13,
    },
    timeText: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Courier', // Monospace vibe
    },
});
