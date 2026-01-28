/**
 * Nomadly Typography System
 * Modern, clean typography using system fonts with Inter fallbacks
 */

import { Platform } from 'react-native';

// Font family configuration
export const FontFamily = {
    // Default to system fonts for optimal performance
    regular: Platform.select({
        ios: 'System',
        android: 'Roboto',
        default: 'System',
    }),
    medium: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
        default: 'System',
    }),
    semibold: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
        default: 'System',
    }),
    bold: Platform.select({
        ios: 'System',
        android: 'Roboto-Bold',
        default: 'System',
    }),
};

// Font weights
export const FontWeight = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};

// Font sizes with line heights
export const Typography = {
    // Display headings
    h1: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: FontWeight.bold,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: FontWeight.bold,
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: FontWeight.semibold,
        letterSpacing: -0.2,
    },
    h4: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: FontWeight.semibold,
        letterSpacing: 0,
    },

    // Body text
    bodyLarge: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: FontWeight.regular,
        letterSpacing: 0,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: FontWeight.regular,
        letterSpacing: 0,
    },
    bodySmall: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: FontWeight.regular,
        letterSpacing: 0.1,
    },

    // UI elements
    label: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: FontWeight.medium,
        letterSpacing: 0.1,
    },
    labelSmall: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: FontWeight.medium,
        letterSpacing: 0.2,
    },

    // Special
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: FontWeight.regular,
        letterSpacing: 0.2,
    },
    button: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: FontWeight.semibold,
        letterSpacing: 0.3,
    },
    buttonSmall: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: FontWeight.semibold,
        letterSpacing: 0.3,
    },
};
