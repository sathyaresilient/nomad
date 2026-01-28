/**
 * Badge Component
 * Travel style tags and status badges
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../design';
import type { TravelStyle, TrustLevel } from '../../types';

type BadgeVariant = 'travel' | 'trust' | 'status' | 'custom';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    travelStyle?: TravelStyle;
    trustLevel?: TrustLevel;
    color?: string;
    backgroundColor?: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

const getTravelStyleColors = (style: TravelStyle): { bg: string; text: string } => {
    const color = Colors.travelerStyles[style];
    return {
        bg: color + '20', // 20% opacity
        text: color,
    };
};

const getTrustColors = (level: TrustLevel): { bg: string; text: string } => {
    const color = Colors.trust[level];
    return {
        bg: color + '20',
        text: color,
    };
};

const getTravelStyleLabel = (style: TravelStyle): string => {
    const labels: Record<TravelStyle, string> = {
        backpacker: '🎒 Backpacker',
        digitalNomad: '💻 Digital Nomad',
        explorer: '🗺️ Explorer',
        social: '🍻 Social',
        luxury: '✨ Luxury',
        slowTravel: '🧘 Slow Travel',
    };
    return labels[style];
};

const getTrustLabel = (level: TrustLevel): string => {
    const labels: Record<TrustLevel, string> = {
        new: 'New Explorer',
        rated: 'Well Rated',
        trusted: 'Highly Trusted',
    };
    return labels[level];
};

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'custom',
    travelStyle,
    trustLevel,
    color,
    backgroundColor,
    icon,
    style,
}) => {
    let bgColor = backgroundColor || Colors.background.elevated;
    let textColor = color || Colors.text.secondary;
    let displayLabel = label;

    if (variant === 'travel' && travelStyle) {
        const colors = getTravelStyleColors(travelStyle);
        bgColor = colors.bg;
        textColor = colors.text;
        displayLabel = getTravelStyleLabel(travelStyle);
    } else if (variant === 'trust' && trustLevel) {
        const colors = getTrustColors(trustLevel);
        bgColor = colors.bg;
        textColor = colors.text;
        displayLabel = getTrustLabel(trustLevel);
    }

    return (
        <View style={[styles.container, { backgroundColor: bgColor }, style]}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={[styles.label, { color: textColor }]}>{displayLabel}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    icon: {
        marginRight: Spacing.xs,
    },
    label: {
        ...Typography.labelSmall,
    },
});
