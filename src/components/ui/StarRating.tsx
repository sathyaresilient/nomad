/**
 * Star Rating Component
 * Display and input for 1-5 star ratings
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../design';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    showLabel?: boolean;
    tripCount?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxStars = 5,
    size = 20,
    interactive = false,
    onRatingChange,
    showLabel = false,
    tripCount,
}) => {
    const renderStar = (index: number) => {
        const filled = index < Math.floor(rating);
        const halfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;

        const StarComponent = (
            <Ionicons
                name={filled ? "star" : halfFilled ? "star-half" : "star-outline"}
                size={size}
                color={filled || halfFilled ? Colors.accent.gold : Colors.text.muted}
            />
        );

        if (interactive && onRatingChange) {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => onRatingChange(index + 1)}
                    style={styles.star}
                >
                    {StarComponent}
                </TouchableOpacity>
            );
        }

        return (
            <View key={index} style={styles.star}>
                {StarComponent}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.starsContainer}>
                {Array.from({ length: maxStars }).map((_, index) => renderStar(index))}
            </View>

            {showLabel && (
                <Text style={styles.label}>
                    {rating.toFixed(1)}
                    {tripCount !== undefined && (
                        <Text style={styles.tripCount}> ({tripCount} trips)</Text>
                    )}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    star: {
        marginRight: 2,
    },
    label: {
        ...Typography.label,
        color: Colors.text.secondary,
        marginLeft: Spacing.sm,
    },
    tripCount: {
        ...Typography.caption,
        color: Colors.text.muted,
    },
});
