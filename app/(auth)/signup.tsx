/**
 * Signup Screen
 * Create account with email/password or social OAuth
 */

import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '../../src/components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../src/design';
import { TokenStorage, api } from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';

export default function SignupScreen() {
    const insets = useSafeAreaInsets();
    const { register, isLoading, error, clearError } = useAuthStore();

    // Form state
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Password strength
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

    // Google OAuth
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    });

    // Handle Google response
    useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleToken(response.params.id_token);
        } else if (response?.type === 'error') {
            setLocalError('Google sign up failed. Please try again.');
        }
    }, [response]);

    // Check password strength
    useEffect(() => {
        if (!password) {
            setPasswordStrength(null);
            return;
        }

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLong = password.length >= 8;

        const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLong].filter(Boolean).length;

        if (score <= 2) setPasswordStrength('weak');
        else if (score <= 3) setPasswordStrength('medium');
        else setPasswordStrength('strong');
    }, [password]);

    // Google token exchange
    const handleGoogleToken = async (idToken: string) => {
        setGoogleLoading(true);
        try {
            const result = await api.post<any>('/api/v1/oauth/google/token', { idToken });

            if (result.data) {
                await TokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
                router.replace('/(tabs)');
            } else {
                setLocalError(result.error || 'Google sign up failed');
            }
        } catch (err) {
            setLocalError('Failed to sign up with Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    // Apple Sign In
    const handleAppleSignIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const result = await api.post<any>('/api/v1/auth/apple/token', {
                identityToken: credential.identityToken,
                fullName: credential.fullName,
            });

            if (result.data) {
                await TokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
                router.replace('/(tabs)');
            } else {
                setLocalError(result.error || 'Apple sign up failed');
            }
        } catch (err: any) {
            if (err.code !== 'ERR_CANCELED') {
                setLocalError('Failed to sign up with Apple');
            }
        }
    };

    // Email/password signup
    const handleSignup = async () => {
        clearError();
        setLocalError(null);

        // Validation
        if (!displayName.trim()) {
            setLocalError('Please enter your name');
            return;
        }
        if (!email.trim()) {
            setLocalError('Please enter your email');
            return;
        }
        if (!password) {
            setLocalError('Please enter a password');
            return;
        }
        if (password.length < 8) {
            setLocalError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        const success = await register(email.trim(), password, displayName.trim());
        if (success) {
            router.replace('/(tabs)');
        }
    };

    const displayError = localError || error;

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 'weak': return Colors.status.error;
            case 'medium': return Colors.status.warning;
            case 'strong': return Colors.status.success;
            default: return Colors.border.light;
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                        </TouchableOpacity>
                    </Link>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the global community of travelers</Text>
                </View>

                {/* Error Message */}
                {displayError && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color={Colors.status.error} />
                        <Text style={styles.errorText}>{displayError}</Text>
                    </View>
                )}

                {/* Social Login First */}
                <View style={styles.socialButtons}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => promptAsync()}
                        disabled={!request || googleLoading}
                    >
                        {googleLoading ? (
                            <ActivityIndicator size="small" color={Colors.text.primary} />
                        ) : (
                            <>
                                <Image
                                    source={{ uri: 'https://www.google.com/favicon.ico' }}
                                    style={styles.socialIcon}
                                />
                                <Text style={styles.socialButtonText}>Continue with Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {Platform.OS === 'ios' && (
                        <TouchableOpacity
                            style={[styles.socialButton, styles.appleButton]}
                            onPress={handleAppleSignIn}
                        >
                            <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                            <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                                Continue with Apple
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or sign up with email</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Name Input */}
                <Input
                    label="Full Name"
                    placeholder="Your name"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    autoComplete="name"
                    leftIcon={<Ionicons name="person-outline" size={20} color={Colors.text.muted} />}
                />

                {/* Email Input */}
                <Input
                    label="Email"
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.text.muted} />}
                />

                {/* Password Input */}
                <Input
                    label="Password"
                    placeholder="Create a strong password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.text.muted} />}
                    rightIcon={
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.text.muted}
                        />
                    }
                    onRightIconPress={() => setShowPassword(!showPassword)}
                />

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                        <View style={styles.strengthBars}>
                            <View style={[styles.strengthBar, { backgroundColor: getStrengthColor() }]} />
                            <View style={[
                                styles.strengthBar,
                                { backgroundColor: passwordStrength !== 'weak' ? getStrengthColor() : Colors.border.light }
                            ]} />
                            <View style={[
                                styles.strengthBar,
                                { backgroundColor: passwordStrength === 'strong' ? getStrengthColor() : Colors.border.light }
                            ]} />
                        </View>
                        <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                            {passwordStrength === 'weak' && 'Weak password'}
                            {passwordStrength === 'medium' && 'Medium strength'}
                            {passwordStrength === 'strong' && 'Strong password'}
                        </Text>
                    </View>
                )}

                {/* Confirm Password */}
                <Input
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.text.muted} />}
                />

                {/* Terms */}
                <Text style={styles.terms}>
                    By signing up, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>

                {/* Signup Button */}
                <Button
                    title="Create Account"
                    onPress={handleSignup}
                    loading={isLoading}
                    style={styles.signupButton}
                />

                {/* Login Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.loginLink}>Sign in</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    backButton: {
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h1,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.text.secondary,
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
    socialButtons: {
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        backgroundColor: Colors.background.secondary,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border.light,
        gap: Spacing.sm,
    },
    socialIcon: {
        width: 20,
        height: 20,
    },
    socialButtonText: {
        ...Typography.button,
        color: Colors.text.primary,
    },
    appleButton: {
        backgroundColor: '#000000',
        borderColor: '#000000',
    },
    appleButtonText: {
        color: '#FFFFFF',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border.light,
    },
    dividerText: {
        ...Typography.caption,
        color: Colors.text.muted,
        marginHorizontal: Spacing.md,
    },
    strengthContainer: {
        marginTop: -Spacing.md,
        marginBottom: Spacing.lg,
    },
    strengthBars: {
        flexDirection: 'row',
        gap: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    strengthText: {
        ...Typography.caption,
    },
    terms: {
        ...Typography.caption,
        color: Colors.text.muted,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    termsLink: {
        color: Colors.primary.main,
    },
    signupButton: {
        marginBottom: Spacing.xl,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
});
