/**
 * Traveler Card Component
 * Shows a matched traveler with their trip and overlap info
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../design';
import type { TravelerMatch } from '../types';
import { Avatar, Badge, Card, StarRating } from './ui';

interface TravelerCardProps {
    match: TravelerMatch;
    onPress?: () => void;
}

export const TravelerCard: React.FC<TravelerCardProps> = ({
    match,
    onPress,
}) => {
    const { user, trip, overlapDays } = match;

    const formatDateRange = (start: Date, end: Date): string => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        const startStr = new Date(start).toLocaleDateString('en-US', options);
        const endStr = new Date(end).toLocaleDateString('en-US', options);
        return `${startStr} - ${endStr}`;
    };

    return (
        <Card variant="glass" onPress={onPress}>
            {/* Header with avatar and name */}
            <View style={styles.header}>
                <Avatar
                    imageUrl={user.avatarUrl}
                    name={user.displayName}
                    size="md"
                    trustLevel={user.trustLevel}
                />

                <View style={styles.headerInfo}>
                    <Text style={styles.name}>{user.displayName}</Text>

                    {user.tripCount >= 3 && (
                        <StarRating
                            rating={user.rating}
                            size={14}
                            showLabel
                            tripCount={user.tripCount}
                        />
                    )}

                    {user.tripCount < 3 && (
                        <Badge
                            variant="trust"
                            trustLevel="new"
                            label=""
                        />
                    )}
                </View>

                {/* Overlap badge */}
                <View style={styles.overlapBadge}>
                    <Text style={styles.overlapDays}>{overlapDays}</Text>
                    <Text style={styles.overlapLabel}>days</Text>
                </View>
            </View>

            {/* Travel style */}
            <View style={styles.tagRow}>
                <Badge
                    variant="travel"
                    travelStyle={user.travelStyle}
                    label=""
                />
            </View>

            {/* Bio */}
            <Text style={styles.bio} numberOfLines={2}>
                {user.bio}
            </Text>

            {/* Trip info */}
            <View style={styles.tripInfo}>
                <View style={styles.tripRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.text.muted} />
                    <Text style={styles.tripText}>
                        {trip.city}, {trip.country}
                    </Text>
                </View>
                <View style={styles.tripRow}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.text.muted} />
                    <Text style={styles.tripText}>
                        {formatDateRange(trip.startDate, trip.endDate)}
                    </Text>
                </View>
            </View>

            {/* Languages */}
            {user.languages.length > 0 && (
                <View style={styles.languagesRow}>
                    <Ionicons name="globe-outline" size={14} color={Colors.text.muted} />
                    <Text style={styles.languagesText}>
                        {user.languages.join(', ')}
                    </Text>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    headerInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    name: {
        ...Typography.h4,
        color: Colors.text.primary,
        marginBottom: 2,
    },
    overlapBadge: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary.main + '20',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    overlapDays: {
        ...Typography.h3,
        color: Colors.primary.main,
    },
    overlapLabel: {
        ...Typography.caption,
        color: Colors.primary.main,
        marginTop: -2,
    },
    tagRow: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
    },
    bio: {
        ...Typography.body,
        color: Colors.text.secondary,
        marginBottom: Spacing.md,
    },
    tripInfo: {
        backgroundColor: Colors.background.primary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    tripRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    tripText: {
        ...Typography.bodySmall,
        color: Colors.text.secondary,
        marginLeft: Spacing.sm,
    },
    languagesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    languagesText: {
        ...Typography.caption,
        color: Colors.text.muted,
        marginLeft: Spacing.sm,
    },
});
