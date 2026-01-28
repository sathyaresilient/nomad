/**
 * Custom Button Component
 * Primary, secondary, and ghost variants with loading state
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Layout, Shadows, Typography } from '../../design';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'default' | 'small';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'default',
    disabled = false,
    loading = false,
    icon,
    style,
}) => {
    const getButtonStyles = (): ViewStyle => {
        const base: ViewStyle = {
            ...styles.base,
            height: size === 'small' ? Layout.buttonHeightSmall : Layout.buttonHeight,
        };

        switch (variant) {
            case 'primary':
                return {
                    ...base,
                    backgroundColor: disabled ? Colors.background.elevated : Colors.primary.main,
                    ...(!disabled && Shadows.glow),
                };
            case 'secondary':
                return {
                    ...base,
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: disabled ? Colors.text.muted : Colors.primary.main,
                };
            case 'ghost':
                return {
                    ...base,
                    backgroundColor: 'transparent',
                };
            case 'danger':
                return {
                    ...base,
                    backgroundColor: disabled ? Colors.background.elevated : Colors.status.error,
                };
            default:
                return base;
        }
    };

    const getTextStyles = (): TextStyle => {
        const base: TextStyle = {
            ...(size === 'small' ? Typography.buttonSmall : Typography.button),
            marginLeft: icon ? 8 : 0,
        };

        if (disabled) {
            return { ...base, color: Colors.text.muted };
        }

        switch (variant) {
            case 'primary':
            case 'danger':
                return { ...base, color: Colors.text.primary };
            case 'secondary':
                return { ...base, color: Colors.primary.main };
            case 'ghost':
                return { ...base, color: Colors.text.secondary };
            default:
                return base;
        }
    };

    return (
        <TouchableOpacity
            style={[getButtonStyles(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? Colors.text.primary : Colors.primary.main}
                    size="small"
                />
            ) : (
                <>
                    {icon}
                    <Text style={getTextStyles()}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.lg,
        paddingHorizontal: 24,
    },
});
