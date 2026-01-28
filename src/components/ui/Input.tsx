/**
 * Custom Input Component
 * Text input with label, error state, and icons
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Layout, Spacing, Typography } from '../../design';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return Colors.status.error;
        if (isFocused) return Colors.primary.main;
        return Colors.border.light;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? styles.inputWithLeftIcon : undefined,
                        rightIcon ? styles.inputWithRightIcon : undefined,
                        style,
                    ]}
                    placeholderTextColor={Colors.text.muted}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity
                        style={styles.rightIcon}
                        onPress={onRightIconPress}
                        disabled={!onRightIconPress}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        ...Typography.label,
        color: Colors.text.secondary,
        marginBottom: Spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Layout.inputHeight,
        backgroundColor: Colors.background.elevated,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        paddingHorizontal: Spacing.lg,
    },
    input: {
        flex: 1,
        height: '100%',
        ...Typography.body,
        color: Colors.text.primary,
    },
    inputWithLeftIcon: {
        marginLeft: Spacing.sm,
    },
    inputWithRightIcon: {
        marginRight: Spacing.sm,
    },
    leftIcon: {
        marginRight: Spacing.xs,
    },
    rightIcon: {
        marginLeft: Spacing.xs,
    },
    error: {
        ...Typography.caption,
        color: Colors.status.error,
        marginTop: Spacing.xs,
    },
});
