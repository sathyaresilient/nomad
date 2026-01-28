/**
 * Forgot Password Screen
 * Request password reset via email
 */

import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../src/design';
import { api } from '../../src/lib/api';

export default function ForgotPasswordScreen() {
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async () => {
        setError(null);

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const result = await api.post('/api/v1/auth/forgot-password', {
                email: email.trim(),
            });

            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Ionicons name="mail-outline" size={48} color={Colors.primary.main} />
                    </View>
                    <Text style={styles.successTitle}>Check your email</Text>
                    <Text style={styles.successText}>
                        We've sent a password reset link to{'\n'}
                        <Text style={styles.emailHighlight}>{email}</Text>
                    </Text>
                    <Text style={styles.successHint}>
                        Didn't receive the email? Check your spam folder or try again.
                    </Text>

                    <Button
                        title="Back to Login"
                        onPress={() => router.replace('/(auth)/login')}
                        style={styles.backButton}
                    />

                    <TouchableOpacity onPress={() => setSuccess(false)}>
                        <Text style={styles.retryLink}>Try a different email</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[
                styles.content,
                { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
            ]}>
                {/* Header */}
                <View style={styles.header}>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity style={styles.backArrow}>
                            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                        </TouchableOpacity>
                    </Link>

                    <View style={styles.iconContainer}>
                        <Ionicons name="key-outline" size={40} color={Colors.primary.main} />
                    </View>

                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        No worries! Enter your email address and we'll send you a link to reset your password.
                    </Text>
                </View>

                {/* Error Message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color={Colors.status.error} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* Email Input */}
                <Input
                    label="Email Address"
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoFocus
                    leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.text.muted} />}
                />

                {/* Submit Button */}
                <Button
                    title="Send Reset Link"
                    onPress={handleResetPassword}
                    loading={isLoading}
                    style={styles.submitButton}
                />

                {/* Back to Login */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Remember your password? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.loginLink}>Sign in</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    header: {
        marginBottom: Spacing.xxl,
    },
    backArrow: {
        marginBottom: Spacing.lg,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.tag.teal,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h1,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.text.secondary,
        lineHeight: 22,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.lg,
    },
    errorText: {
        ...Typography.body,
        color: Colors.status.error,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    submitButton: {
        marginTop: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.xxl,
    },
    footerText: {
        ...Typography.body,
        color: Colors.text.secondary,
    },
    loginLink: {
        ...Typography.body,
        color: Colors.primary.main,
        fontWeight: '600',
    },
    // Success state
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.tag.teal,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    successTitle: {
        ...Typography.h1,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    successText: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    emailHighlight: {
        color: Colors.text.primary,
        fontWeight: '600',
    },
    successHint: {
        ...Typography.caption,
        color: Colors.text.muted,
        textAlign: 'center',
        marginBottom: Spacing.xxl,
    },
    backButton: {
        width: '100%',
        marginBottom: Spacing.lg,
    },
    retryLink: {
        ...Typography.body,
        color: Colors.primary.main,
    },
});
