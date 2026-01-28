/**
 * Login Screen
 * Email/password login with Google and Apple SSO
 */

import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
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

// Check if Google OAuth is configured
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const HAS_GOOGLE_CONFIG = !!GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'placeholder';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const { login, isLoading, error, clearError } = useAuthStore();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Google token exchange
    const handleGoogleToken = async (idToken: string) => {
        setGoogleLoading(true);
        try {
            const result = await api.post<any>('/api/v1/oauth/google/token', { idToken });

            if (result.data) {
                await TokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
                router.replace('/(tabs)');
            } else {
                setLocalError(result.error || 'Google sign in failed');
            }
        } catch (err) {
            setLocalError('Failed to sign in with Google');
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

            // Send to backend
            const result = await api.post<any>('/api/v1/auth/apple/token', {
                identityToken: credential.identityToken,
                fullName: credential.fullName,
            });

            if (result.data) {
                await TokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
                router.replace('/(tabs)');
            } else {
                setLocalError(result.error || 'Apple sign in failed');
            }
        } catch (err: any) {
            if (err.code !== 'ERR_CANCELED') {
                setLocalError('Failed to sign in with Apple');
            }
        }
    };

    // Email/password login
    const handleLogin = async () => {
        clearError();
        setLocalError(null);

        if (!email.trim()) {
            setLocalError('Please enter your email');
            return;
        }
        if (!password) {
            setLocalError('Please enter your password');
            return;
        }

        const success = await login(email.trim(), password);
        if (success) {
            router.replace('/(tabs)');
        }
    };

    const displayError = localError || error;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo & Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoEmoji}>🌍</Text>
                    </View>
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.subtitle}>Sign in to continue your adventures</Text>
                </View>

                {/* Error Message */}
                {displayError && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color={Colors.status.error} />
                        <Text style={styles.errorText}>{displayError}</Text>
                    </View>
                )}

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
                    placeholder="Enter your password"
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

                {/* Forgot Password */}
                <Link href="/(auth)/forgot-password" asChild>
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                </Link>

                {/* Login Button */}
                <Button
                    title="Sign In"
                    onPress={handleLogin}
                    loading={isLoading}
                    style={styles.loginButton}
                />

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login Buttons */}
                <View style={styles.socialButtons}>
                    {/* Google - only show if configured */}
                    {HAS_GOOGLE_CONFIG && (
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => {
                                // Google OAuth not yet configured
                                setLocalError('Google sign-in is not configured yet');
                            }}
                            disabled={googleLoading}
                        >
                            {googleLoading ? (
                                <ActivityIndicator size="small" color={Colors.text.primary} />
                            ) : (
                                <>
                                    <Image
                                        source={{ uri: 'https://www.google.com/favicon.ico' }}
                                        style={styles.socialIcon}
                                    />
                                    <Text style={styles.socialButtonText}>Google</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* Apple (iOS only) */}
                    {Platform.OS === 'ios' && (
                        <TouchableOpacity
                            style={[styles.socialButton, styles.appleButton]}
                            onPress={handleAppleSignIn}
                        >
                            <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                            <Text style={[styles.socialButtonText, styles.appleButtonText]}>Apple</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Sign Up Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/(auth)/signup" asChild>
                        <TouchableOpacity>
                            <Text style={styles.signupLink}>Sign up</Text>
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
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.tag.teal,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    logoEmoji: {
        fontSize: 40,
    },
    title: {
        ...Typography.h1,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -Spacing.sm,
        marginBottom: Spacing.lg,
    },
    forgotPasswordText: {
        ...Typography.bodySmall,
        color: Colors.primary.main,
    },
    loginButton: {
        marginBottom: Spacing.xl,
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
    socialButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xxl,
    },
    socialButton: {
        flex: 1,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        ...Typography.body,
        color: Colors.text.secondary,
    },
    signupLink: {
        ...Typography.body,
        color: Colors.primary.main,
        fontWeight: '600',
    },
});
