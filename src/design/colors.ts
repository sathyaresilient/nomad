/**
 * Nomadly Color Palette
 * Light theme with teal/mint primary and warm accents
 * Matching the reference design
 */

export const Colors = {
  // Primary brand colors - Teal/Mint
  primary: {
    main: '#14B8A6',      // Teal - primary actions
    light: '#5EEAD4',     // Lighter teal
    dark: '#0D9488',      // Darker teal
  },

  // Accent colors
  accent: {
    main: '#F97316',      // Orange - highlights
    coral: '#FF6B6B',     // Coral for alerts
    light: '#FDBA74',     // Light orange
    gold: '#F59E0B',      // Gold for premium/badges
  },

  // Background & surfaces (Light theme)
  background: {
    primary: '#FFFFFF',   // Pure white - main background
    secondary: '#F8FAFC', // Very light gray
    elevated: '#FFFFFF',  // Cards
    muted: '#F1F5F9',     // Muted sections
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
  },

  // Text colors
  text: {
    primary: '#1E293B',   // Dark slate - main text
    secondary: '#64748B', // Medium gray - secondary text
    muted: '#94A3B8',     // Light gray - muted/placeholder
    disabled: '#CBD5E1',  // Very light - disabled text
    inverse: '#FFFFFF',   // Text on dark backgrounds
  },

  // Status colors
  status: {
    success: '#10B981',   // Green for positive
    warning: '#F59E0B',   // Amber for warnings
    error: '#EF4444',     // Red for errors
    info: '#3B82F6',      // Blue for info
  },

  // Semantic colors
  travelerStyles: {
    backpacker: '#10B981',    // Green
    digitalNomad: '#14B8A6',  // Teal
    explorer: '#F59E0B',      // Amber
    social: '#EC4899',        // Pink
    luxury: '#8B5CF6',        // Purple
    slowTravel: '#06B6D4',    // Cyan
  },

  // Trust levels
  trust: {
    new: '#94A3B8',           // New Explorer - gray
    rated: '#14B8A6',         // Well Rated - teal
    trusted: '#10B981',       // Highly Trusted - green
  },

  // Card & borders
  border: {
    light: '#E2E8F0',         // Light border
    medium: '#CBD5E1',        // Medium border
  },

  // Tag/chip backgrounds
  tag: {
    teal: 'rgba(20, 184, 166, 0.1)',
    orange: 'rgba(249, 115, 22, 0.1)',
    green: 'rgba(16, 185, 129, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)',
    gray: '#F1F5F9',
  },
};

// Gradient definitions
export const Gradients = {
  primary: ['#14B8A6', '#5EEAD4'],
  accent: ['#F97316', '#FDBA74'],
  card: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)'], // For photo overlays
  premium: ['#F59E0B', '#FBBF24'],
};
