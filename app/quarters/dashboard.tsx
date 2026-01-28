import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockUsers } from '../../src/data/mockUsers';

const currentUser = mockUsers[0]; // Alex

export default function HostDashboardScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
                            <Text style={styles.headerTitle}>Host Mode Active</Text>
                        </View>
                        <View style={styles.notifBtn}>
                            <Ionicons name="notifications" size={20} color="#1E293B" />
                            <View style={styles.notifDot} />
                        </View>
                    </View>

                    {/* Persona Card */}
                    <View style={styles.personaCard}>
                        <View style={styles.personaIcon}>
                            <Ionicons name="leaf" size={20} color="#064E3B" />
                        </View>
                        <View>
                            <Text style={styles.personaLabel}>CURRENT AI PERSONA</Text>
                            <Text style={styles.personaValue}>The Zen Host 🌿</Text>
                        </View>
                    </View>

                    {/* My Quarters Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Quarters</Text>
                        <TouchableOpacity onPress={() => router.push('/quarters/review')}>
                            <Text style={[styles.seeAll, { color: '#F59E0B' }]}>Write Review (Dev)</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.quarterCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                            style={styles.quarterImage}
                        />
                        <View style={styles.listedBadge}>
                            <Text style={styles.listedText}>Listed</Text>
                        </View>
                        <View style={styles.quarterContent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.quarterName}>Downtown Loft - Guest Room</Text>
                                <Text style={styles.quarterLoc}>Downtown, San Francisco</Text>
                            </View>
                            <View style={styles.priceCol}>
                                <Text style={styles.price}>$85</Text>
                                <Text style={styles.perNight}>/night</Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Ionicons name="star" size={14} color="#1E293B" />
                                <Text style={styles.statText}>4.92</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="eye" size={14} color="#64748B" />
                                <Text style={styles.statText}>142 views</Text>
                            </View>
                            <View style={styles.boostBtn}>
                                <Text style={styles.boostText}>Boost</Text>
                                <Ionicons name="flash" size={12} color="#10B981" />
                            </View>
                        </View>
                    </View>

                    {/* Smart Availability Mockup */}
                    <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Smart Availability</Text>
                    <View style={styles.calendarCard}>
                        <View style={styles.calHeader}>
                            <Text style={styles.calMonth}>October 2023</Text>
                            <View style={styles.calArrows}>
                                <Ionicons name="chevron-back" size={16} color="#64748B" />
                                <Ionicons name="chevron-forward" size={16} color="#64748B" />
                            </View>
                        </View>
                        {/* Simplified Calendar Days Row */}
                        <View style={styles.daysRow}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <Text key={i} style={styles.dayLabel}>{d}</Text>
                            ))}
                        </View>
                        <View style={styles.datesRow}>
                            <View style={[styles.dateBubble, styles.dateSelected]}><Text style={styles.dateTextSel}>6</Text></View>
                            <View style={[styles.dateBubble, styles.dateSelected]}><Text style={styles.dateTextSel}>7</Text></View>
                            <View style={[styles.dateBubble, styles.dateSelected]}><Text style={styles.dateTextSel}>8</Text></View>
                            <Text style={styles.dateText}>9</Text>
                            <Text style={styles.dateText}>10</Text>
                            <Text style={styles.dateText}>11</Text>
                            <View style={[styles.dateBubble, styles.dateBlocked]}><Text style={styles.dateTextSel}>12</Text></View>
                        </View>
                    </View>

                    {/* Interested Travelers */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Interested Travelers</Text>
                        <View style={styles.matchBadge}>
                            <Text style={styles.matchText}>High Match</Text>
                        </View>
                    </View>

                    <View style={styles.requestCard}>
                        <View style={styles.reqHeader}>
                            <Image source={{ uri: mockUsers[1].avatarUrl }} style={styles.reqAvatar} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.reqName}>{mockUsers[1].displayName}</Text>
                                <Text style={styles.reqRole}>Digital Nomad • UX Designer</Text>
                                <View style={styles.overlapTag}>
                                    <Ionicons name="airplane" size={12} color="#3B82F6" />
                                    <Text style={styles.overlapText}>Overlaps with your Lisbon trip</Text>
                                </View>
                            </View>
                            <Text style={styles.timeAgo}>2h ago</Text>
                        </View>
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.declineBtn}>
                                <Text style={styles.declineText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn}>
                                <Text style={styles.acceptText}>Accept Request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom Nav Mockup (Within Screen for Visual Completeness) */}
                    <View style={styles.mockNav}>
                        <View style={styles.navItem}>
                            <Ionicons name="grid-outline" size={20} color="#94A3B8" />
                            <Text style={styles.navLabel}>Dash</Text>
                        </View>
                        <View style={styles.navItem}>
                            <Ionicons name="home" size={20} color="#10B981" />
                            <Text style={[styles.navLabel, { color: '#10B981' }]}>Quarters</Text>
                        </View>
                        <View style={styles.addItem}>
                            <Ionicons name="add" size={24} color="#FFF" />
                        </View>
                        <View style={styles.navItem}>
                            <Ionicons name="chatbubble-outline" size={20} color="#94A3B8" />
                            <Text style={styles.navLabel}>Inbox</Text>
                        </View>
                        <View style={styles.navItem}>
                            <Ionicons name="person-outline" size={20} color="#94A3B8" />
                            <Text style={styles.navLabel}>Profile</Text>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Slate 50
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    notifBtn: {
        position: 'relative',
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    notifDot: {
        position: 'absolute',
        top: 8,
        right: 10,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F97316',
    },
    personaCard: {
        backgroundColor: '#ECFDF5', // Mint 50
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    personaIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    personaLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#064E3B',
        opacity: 0.7,
        marginBottom: 2,
    },
    personaValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#064E3B',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    seeAll: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '600',
    },
    quarterCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    quarterImage: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        marginBottom: 12,
    },
    listedBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    listedText: {
        color: '#10B981',
        fontWeight: '700',
        fontSize: 10,
    },
    quarterContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    quarterName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    quarterLoc: {
        fontSize: 12,
        color: '#64748B',
    },
    priceCol: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    perNight: {
        fontSize: 10,
        color: '#94A3B8',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: '#1E293B',
        fontWeight: '600',
    },
    boostBtn: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    boostText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '600',
    },
    calendarCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    calHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    calMonth: {
        fontWeight: '700',
        color: '#1E293B',
    },
    calArrows: {
        flexDirection: 'row',
        gap: 12,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    dayLabel: {
        fontSize: 10,
        color: '#94A3B8',
        width: 24,
        textAlign: 'center',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    dateBubble: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateSelected: {
        backgroundColor: '#D1FAE5',
    },
    dateBlocked: {
        backgroundColor: '#F97316',
    },
    dateText: {
        width: 28,
        textAlign: 'center',
        color: '#64748B',
        paddingTop: 4,
    },
    dateTextSel: {
        fontWeight: '700',
        color: '#064E3B',
        fontSize: 12,
    },
    matchBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    matchText: {
        fontSize: 10,
        color: '#D97706',
        fontWeight: '700',
    },
    requestCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    reqHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    reqAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    reqName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    reqRole: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 6,
    },
    overlapTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EFF6FF',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    overlapText: {
        fontSize: 10,
        color: '#3B82F6',
        fontWeight: '500',
    },
    timeAgo: {
        fontSize: 10,
        color: '#94A3B8',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    declineBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    declineText: {
        color: '#64748B',
        fontWeight: '600',
    },
    acceptBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: '#065F46', // Dark Green
        alignItems: 'center',
    },
    acceptText: {
        color: '#FFF',
        fontWeight: '600',
    },
    mockNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginTop: 32,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignSelf: 'center',
        width: '90%',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: 10,
        color: '#94A3B8',
    },
    addItem: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#065F46',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
});
