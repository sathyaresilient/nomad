/**
 * Auth Index - Redirects to Login
 */

import { Redirect } from 'expo-router';

export default function AuthIndex() {
    return <Redirect href="/login" />;
}

export { default as ForgotPasswordScreen } from './forgot-password';
export { default as LoginScreen } from './login';
export { default as SignupScreen } from './signup';
