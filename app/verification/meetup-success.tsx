import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockUsers } from '../../src/data/mockUsers';

const { width } = Dimensions.get('window');

export default function MeetupSuccessScreen() {
    const router = useRouter();
    const otherUser = mockUsers[1]; // Sarah

    return (
        <View style={styles.container}>
            {/* Background Image with Blur/Overlay */}
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.bgImage}
            />
            <View style={styles.overlay} />

            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.content}>
                    {/* Success Card */}
                    <View style={styles.card}>
                        <Text style={styles.title}>Meetup Verified!</Text>

                        {/* Avatar Circle */}
                        <View style={styles.avatarContainer}>
                            <View style={styles.dashedRing} />
                            <Image source={{ uri: otherUser.avatarUrl }} style={styles.avatar} />
                            <View style={styles.checkBadge}>
                                <Ionicons name="checkmark" size={20} color="#FFF" />
                            </View>
                        </View>

                        <Text style={styles.name}>{otherUser.displayName}</Text>
                        <Text style={styles.role}>@sarah_nomad • Digital Designer</Text>

                        {/* Points Badge */}
                        <View style={styles.pointsBadge}>
                            <View style={styles.coinCircle}>
                                <Ionicons name="star" size={16} color="#0F172A" />
                            </View>
                            <View>
                                <Text style={styles.pointsTitle}>Trust Points</Text>
                                <Text style={styles.pointsSub}>Nomadly Community</Text>
                            </View>
                            <Text style={styles.pointsValue}>+50</Text>
                        </View>

                        {/* Actions */}
                        <TouchableOpacity style={styles.primaryBtn}>
                            <Ionicons name="chatbox-ellipses-outline" size={20} color="#FFF" />
                            <Text style={styles.primaryBtnText}>Leave a Review</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
                            <Text style={styles.secondaryBtnText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Navigation Mockup (Visual only) */}
                <View style={styles.bottomNav}>
                    <View style={[styles.navItem, { opacity: 0.5 }]}>
                        <Ionicons name="home" size={24} color="#FFF" />
                    </View>
                    <View style={styles.navItem}>
                        <View style={styles.scanButton}>
                            <View style={styles.scanInner} />
                        </View>
                    </View>
                    <View style={[styles.navItem, { opacity: 0.5 }]}>
                        <Ionicons name="flash" size={24} color="#FFF" />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    bgImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    closeBtn: {
        position: 'absolute',
        top: 60,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#0F172A', // Dark Slate
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 10,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 32,
        letterSpacing: 0.5,
    },
    avatarContainer: {
        position: 'relative',
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dashedRing: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#0EA5E9',
        borderStyle: 'dashed',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    checkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        backgroundColor: '#06B6D4',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#0F172A',
    },
    name: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    role: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 32,
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        padding: 16,
        borderRadius: 24,
        width: '100%',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#334155',
    },
    coinCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F59E0B', // Amber
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    pointsTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    pointsSub: {
        color: '#64748B',
        fontSize: 12,
    },
    pointsValue: {
        color: '#F59E0B',
        fontSize: 24,
        fontWeight: '700',
        marginLeft: 'auto',
    },
    primaryBtn: {
        backgroundColor: '#06B6D4', // Cyan/Teal
        width: '100%',
        paddingVertical: 16,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
        shadowColor: '#06B6D4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    primaryBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryBtn: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
        height: 80,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
    },
});
