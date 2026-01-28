/**
 * Auth Layout
 * Stack navigator for auth screens
 */

import { Stack } from 'expo-router';
import { Colors } from '../../src/design';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background.primary },
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="callback" />
        </Stack>
    );
}
