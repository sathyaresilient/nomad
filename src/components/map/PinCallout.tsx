import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin } from '../../store/mapStore';

interface Props {
    pin: MapPin;
    onClose: () => void;
}

export const PinCallout = ({ pin, onClose }: Props) => {
    const isUser = pin.type === 'user';

    // Custom dark theme for this component as per design
    const DARK_BG = '#1E293B';
    const PRIMARY = '#0F766E'; // Teal

    return (
        <View style={styles.container}>
            {/* Handle */}
            <View style={styles.handleContainer}>
                <View style={styles.handle} />
            </View>

            <View style={styles.content}>
                {/* Header Row */}
                <View style={styles.row}>
                    {isUser ? (
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: pin.data?.avatarUrl }} style={styles.avatar} />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>NOMAD</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.iconBox}>
                            <Ionicons name="calendar-outline" size={24} color="#FFF" />
                        </View>
                    )}

                    <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{pin.title}</Text>
                            {pin.badges?.includes('NIGHT OWL') && (
                                <View style={styles.tag}>
                                    <Ionicons name="flash" size={10} color="#FACC15" />
                                    <Text style={styles.tagText}>NIGHT OWL</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.subtitle}>{pin.data?.location || 'San Francisco, CA'}</Text>

                        {/* Pills */}
                        <View style={styles.pills}>
                            <View style={styles.pill}>
                                <Text style={styles.pillText}>Digital Nomad</Text>
                            </View>
                            <View style={styles.pill}>
                                <Text style={styles.pillText}>Foodie</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Ionicons name="calendar" size={14} color="#94A3B8" />
                        <Text style={styles.statText}>Overlaps for <Text style={styles.statHighlight}>{pin.overlapDays || 0} days</Text></Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.stat}>
                        <Ionicons name="location" size={14} color="#94A3B8" />
                        <Text style={styles.statText}>{pin.distance || 'Unknown'} away</Text>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity style={styles.connectBtn} onPress={() => alert(`Connection request sent to ${pin.title.split(' ')[0]}! They'll be notified.`)}>
                    <Ionicons name="person-add" size={18} color="#FFF" />
                    <Text style={styles.connectText}>Connect with {pin.title.split(' ')[0]}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: '#1E293B', // Dark slate
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    handleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#334155',
    },
    content: {
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#334155',
    },
    badge: {
        position: 'absolute',
        bottom: -6,
        left: '50%',
        marginLeft: -24,
        backgroundColor: '#0F766E', // Teal
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        minWidth: 48,
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F8FAFC',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(163, 230, 53, 0.2)', // Lime transparent
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(163, 230, 53, 0.4)',
    },
    tagText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#A3E635',
    },
    subtitle: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 8,
    },
    pills: {
        flexDirection: 'row',
        gap: 6,
    },
    pill: {
        backgroundColor: '#334155',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    pillText: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F172A', // Darker bg
        padding: 12,
        borderRadius: 16,
    },
    stat: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statText: {
        color: '#94A3B8',
        fontSize: 12,
    },
    statHighlight: {
        color: '#F8FAFC',
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#334155',
    },
    connectBtn: {
        backgroundColor: '#0F766E', // Teal
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 24,
        gap: 8,
    },
    connectText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
