/**
 * Trip Card Component
 * Displays a trip intent with location, dates, and status
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Colors, Spacing, Typography } from '../design';
import type { OpenTo, Trip } from '../types';
import { Badge, Card } from './ui';

interface TripCardProps {
    trip: Trip;
    onPress?: () => void;
    showUser?: boolean;
    compact?: boolean;
}

const formatDateRange = (start: Date, end: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = new Date(start).toLocaleDateString('en-US', options);
    const endStr = new Date(end).toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}`;
};

const getOpenToLabel = (openTo: OpenTo): string => {
    const labels: Record<OpenTo, string> = {
        meetups: '☕ Meetups',
        coTravel: '✈️ Co-travel',
        coLiving: '🏠 Co-living',
    };
    return labels[openTo];
};

export const TripCard: React.FC<TripCardProps> = ({
    trip,
    onPress,
    showUser = false,
    compact = false,
}) => {
    return (
        <Card variant="glass" onPress={onPress} style={compact ? styles.compactCard : undefined}>
            {/* Location */}
            <View style={styles.header}>
                <View style={styles.locationContainer}>
                    <View style={styles.locationIcon}>
                        <Ionicons name="location" size={20} color={Colors.primary.main} />
                    </View>
                    <View>
                        <Text style={styles.city}>{trip.city}</Text>
                        <Text style={styles.country}>{trip.country}</Text>
                    </View>
                </View>

                {/* Status badge */}
                <Badge
                    label={trip.status === 'active' ? 'Now' : trip.status}
                    backgroundColor={trip.status === 'active' ? Colors.status.success + '20' : undefined}
                    color={trip.status === 'active' ? Colors.status.success : undefined}
                />
            </View>

            {/* Dates */}
            <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color={Colors.text.muted} />
                <Text style={styles.dateText}>
                    {formatDateRange(trip.startDate, trip.endDate)}
                </Text>
            </View>

            {/* Open to */}
            {!compact && trip.openTo.length > 0 && (
                <View style={styles.openToContainer}>
                    <View style={styles.openToHeader}>
                        <Ionicons name="people-outline" size={14} color={Colors.text.muted} />
                        <Text style={styles.openToLabel}>Open to:</Text>
                    </View>
                    <View style={styles.tagsContainer}>
                        {trip.openTo.map((item) => (
                            <Badge
                                key={item}
                                label={getOpenToLabel(item)}
                                style={styles.tag}
                            />
                        ))}
                    </View>
                </View>
            )}

            {/* Notes */}
            {!compact && trip.notes && (
                <Text style={styles.notes} numberOfLines={2}>
                    {trip.notes}
                </Text>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    compactCard: {
        padding: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary.main + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    city: {
        ...Typography.h4,
        color: Colors.text.primary,
    },
    country: {
        ...Typography.bodySmall,
        color: Colors.text.muted,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    dateText: {
        ...Typography.bodySmall,
        color: Colors.text.secondary,
        marginLeft: Spacing.sm,
    },
    openToContainer: {
        marginBottom: Spacing.md,
    },
    openToHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    openToLabel: {
        ...Typography.caption,
        color: Colors.text.muted,
        marginLeft: Spacing.xs,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    tag: {
        marginRight: Spacing.xs,
        marginTop: Spacing.xs,
    },
    notes: {
        ...Typography.bodySmall,
        color: Colors.text.secondary,
        fontStyle: 'italic',
    },
});
