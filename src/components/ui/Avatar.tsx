/**
 * Avatar Component
 * User avatar with optional online status and trust badge
 */

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { Colors } from '../../design';
import type { TrustLevel } from '../../types';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
    imageUrl?: string;
    name: string;
    size?: AvatarSize;
    showOnline?: boolean;
    trustLevel?: TrustLevel;
    style?: ViewStyle;
}

const getSizeValue = (size: AvatarSize): number => {
    switch (size) {
        case 'sm': return 40;
        case 'md': return 56;
        case 'lg': return 80;
    }
};

const getTrustColor = (level: TrustLevel): string => {
    switch (level) {
        case 'new': return Colors.trust.new;
        case 'rated': return Colors.trust.rated;
        case 'trusted': return Colors.trust.trusted;
    }
};

export const Avatar: React.FC<AvatarProps> = ({
    imageUrl,
    name,
    size = 'md',
    showOnline = false,
    trustLevel,
    style,
}) => {
    const dimension = getSizeValue(size);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <View style={[{ width: dimension, height: dimension }, style]}>
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={[
                        styles.image,
                        {
                            width: dimension,
                            height: dimension,
                            borderRadius: dimension / 2,
                        },
                    ]}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: dimension,
                            height: dimension,
                            borderRadius: dimension / 2,
                        },
                    ]}
                >
                    <Text style={[
                        styles.initials,
                        { fontSize: dimension * 0.35 }
                    ]}>
                        {initials}
                    </Text>
                </View>
            )}

            {/* Online indicator */}
            {showOnline && (
                <View style={[
                    styles.onlineIndicator,
                    {
                        width: dimension * 0.25,
                        height: dimension * 0.25,
                        borderRadius: dimension * 0.125,
                        right: 0,
                        bottom: 0,
                    }
                ]} />
            )}

            {/* Trust badge */}
            {trustLevel && (
                <View style={[
                    styles.trustBadge,
                    {
                        backgroundColor: getTrustColor(trustLevel),
                        right: -2,
                        top: -2,
                    }
                ]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        backgroundColor: Colors.background.elevated,
    },
    placeholder: {
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: Colors.text.primary,
        fontWeight: '600',
    },
    onlineIndicator: {
        position: 'absolute',
        backgroundColor: Colors.status.success,
        borderWidth: 2,
        borderColor: Colors.background.primary,
    },
    trustBadge: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.background.primary,
    },
});
