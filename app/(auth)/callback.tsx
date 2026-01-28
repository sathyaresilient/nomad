/**
 * OAuth Callback Screen
 * Handles deep link callbacks from OAuth providers
 */

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from '../../src/components/ui';
import { Colors, Spacing, Typography } from '../../src/design';
import { TokenStorage } from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';

export default function AuthCallbackScreen() {
    const params = useLocalSearchParams<{
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: string;
        error?: string;
    }>();

    const { checkAuth } = useAuthStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        if (params.error) {
            setStatus('error');
            setErrorMessage(getErrorMessage(params.error));
            return;
        }

        if (params.accessToken && params.refreshToken) {
            try {
                // Store tokens
                await TokenStorage.setTokens(params.accessToken, params.refreshToken);

                // Refresh auth state
                await checkAuth();

                setStatus('success');

                // Navigate to main app
                setTimeout(() => {
                    router.replace('/(tabs)');
                }, 500);
            } catch (err) {
                setStatus('error');
                setErrorMessage('Failed to complete authentication');
            }
        } else {
            setStatus('error');
            setErrorMessage('Invalid authentication response');
        }
    };

    const getErrorMessage = (error: string): string => {
        switch (error) {
            case 'access_denied':
                return 'You cancelled the sign in process';
            case 'oauth_failed':
                return 'Authentication failed. Please try again.';
            default:
                return 'An error occurred during sign in';
        }
    };

    return (
        <View style={styles.container}>
            {status === 'loading' && (
                <View style={styles.content}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={styles.loadingText}>Completing sign in...</Text>
                </View>
            )}

            {status === 'success' && (
                <View style={styles.content}>
                    <Text style={styles.successEmoji}>✅</Text>
                    <Text style={styles.successText}>Successfully signed in!</Text>
                    <Text style={styles.redirectText}>Redirecting...</Text>
                </View>
            )}

            {status === 'error' && (
                <View style={styles.content}>
                    <Text style={styles.errorEmoji}>❌</Text>
                    <Text style={styles.errorTitle}>Sign In Failed</Text>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                    <Button
                        title="Try Again"
                        onPress={() => router.replace('/(auth)/login')}
                        style={styles.retryButton}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    loadingText: {
        ...Typography.body,
        color: Colors.text.secondary,
        marginTop: Spacing.lg,
    },
    successEmoji: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    successText: {
        ...Typography.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    redirectText: {
        ...Typography.body,
        color: Colors.text.muted,
    },
    errorEmoji: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    errorTitle: {
        ...Typography.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    errorMessage: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xxl,
    },
    retryButton: {
        minWidth: 200,
    },
});
