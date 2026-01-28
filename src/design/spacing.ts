/**
 * Nomadly Spacing System
 * 4px grid system with border radii and layout constants
 */

// Base unit for the spacing grid
const BASE_UNIT = 4;

// Spacing scale
export const Spacing = {
    // Extra small - tight spacing
    xs: BASE_UNIT, // 4px

    // Small - minor spacing
    sm: BASE_UNIT * 2, // 8px

    // Medium - standard spacing
    md: BASE_UNIT * 3, // 12px

    // Large - generous spacing
    lg: BASE_UNIT * 4, // 16px

    // Extra large - section spacing
    xl: BASE_UNIT * 6, // 24px

    // 2X large / xxl
    '2xl': BASE_UNIT * 8, // 32px
    xxl: BASE_UNIT * 8, // 32px (alias)

    // 3X large
    '3xl': BASE_UNIT * 12, // 48px

    // 4X large
    '4xl': BASE_UNIT * 16, // 64px
};

// Border radius scale
export const BorderRadius = {
    // Subtle rounding
    xs: 4,

    // Small rounding
    sm: 8,

    // Medium rounding
    md: 12,

    // Large rounding
    lg: 16,

    // Extra large rounding
    xl: 20,

    // 2X large rounding
    '2xl': 24,

    // Full rounding (pills, circles)
    full: 9999,
};

// Z-index layers
export const ZIndex = {
    base: 1,
    dropdown: 10,
    sticky: 20,
    modal: 30,
    overlay: 40,
    toast: 50,
};

// Layout constants
export const Layout = {
    // Safe area padding
    safeAreaTop: 44,
    safeAreaBottom: 34,

    // Standard screen padding
    screenPadding: 16,

    // Card dimensions
    cardPadding: 16,
    cardMargin: 12,

    // Input heights
    inputHeight: 48,
    buttonHeight: 52,
    buttonHeightSmall: 40,

    // Tab bar
    tabBarHeight: 80,

    // Header
    headerHeight: 56,

    // Avatar sizes
    avatarSm: 32,
    avatarMd: 48,
    avatarLg: 64,
    avatarXl: 80,

    // Icon sizes
    iconSm: 16,
    iconMd: 24,
    iconLg: 32,
};

// Shadows for elevation (light theme)
export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 5,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    // Primary button glow
    glow: {
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
    },
};
