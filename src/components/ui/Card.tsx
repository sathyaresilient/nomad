/**
 * Card Component
 * Clean card with multiple variants for light theme
 */

import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { BorderRadius, Colors, Spacing } from '../../design';

type CardVariant = 'default' | 'elevated' | 'glass';

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    style?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    style,
    onPress,
    disabled = false,
}) => {
    const getCardStyles = (): ViewStyle => {
        const base: ViewStyle = {
            ...styles.base,
        };

        switch (variant) {
            case 'elevated':
                return {
                    ...base,
                    backgroundColor: Colors.background.elevated,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                };
            case 'glass':
                return {
                    ...base,
                    backgroundColor: Colors.background.elevated,
                    borderWidth: 1,
                    borderColor: Colors.border.light,
                };
            default:
                return {
                    ...base,
                    backgroundColor: Colors.background.elevated,
                };
        }
    };

    if (onPress) {
        return (
            <TouchableOpacity
                style={[getCardStyles(), style]}
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.8}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[getCardStyles(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
    base: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        overflow: 'hidden',
    },
});
