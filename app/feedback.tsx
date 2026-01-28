/**
 * Post-Trip Feedback Screen
 * Modal for rating travelers after trip overlap
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BorderRadius, Colors, Layout, Spacing, Typography } from '../src/design';

export default function FeedbackScreen() {
    const [wouldTravelAgain, setWouldTravelAgain] = useState<boolean | null>(null);
    const [vibe, setVibe] = useState<string | null>(null);
    const [note, setNote] = useState('');

    const vibeOptions = [
        { id: 'chill', label: 'Chill', emoji: '😌' },
        { id: 'awesome', label: 'Awesome', emoji: '🎉' },
        { id: 'flaky', label: 'Flaky', emoji: '😕' },
        { id: 'pushy', label: 'Pushy', emoji: '😤' },
    ];

    const handleSubmit = () => {
        // Submit feedback logic
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>POST-TRIP REVIEW</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userSection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop' }}
                        style={styles.avatar}
                    />
                    <View style={styles.verifiedBadge}>
                        <Text>✓</Text>
                    </View>
                </View>
                <Text style={styles.tripTitle}>Trip with Sarah</Text>
                <View style={styles.tripMeta}>
                    <Text style={styles.tripLocation}>📍 Canggu, Bali</Text>
                    <Text style={styles.tripDates}>• Oct 12-15</Text>
                </View>
            </View>

            {/* Would Travel Again */}
            <View style={styles.section}>
                <Text style={styles.questionTitle}>Would you travel with Sarah again?</Text>
                <View style={styles.yesNoRow}>
                    <TouchableOpacity
                        style={[
                            styles.yesNoCard,
                            wouldTravelAgain === true && styles.yesNoCardSelected
                        ]}
                        onPress={() => setWouldTravelAgain(true)}
                    >
                        <Ionicons
                            name="thumbs-up"
                            size={32}
                            color={wouldTravelAgain === true ? Colors.primary.main : Colors.text.muted}
                        />
                        <Text style={[
                            styles.yesNoText,
                            wouldTravelAgain === true && styles.yesNoTextSelected
                        ]}>
                            Yes, for sure
                        </Text>
                        {wouldTravelAgain === true && (
                            <View style={styles.checkBadge}>
                                <Text style={styles.checkMark}>✓</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.yesNoCard,
                            wouldTravelAgain === false && styles.yesNoCardSelected
                        ]}
                        onPress={() => setWouldTravelAgain(false)}
                    >
                        <Ionicons
                            name="thumbs-down"
                            size={32}
                            color={wouldTravelAgain === false ? Colors.accent.coral : Colors.text.muted}
                        />
                        <Text style={[
                            styles.yesNoText,
                            wouldTravelAgain === false && styles.yesNoTextSelected
                        ]}>
                            Probably not
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Vibe Rating */}
            <View style={styles.section}>
                <Text style={styles.questionTitle}>How was the vibe?</Text>
                <View style={styles.vibeGrid}>
                    {vibeOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.vibeChip,
                                vibe === option.id && styles.vibeChipSelected
                            ]}
                            onPress={() => setVibe(option.id)}
                        >
                            <Text style={styles.vibeEmoji}>{option.emoji}</Text>
                            <Text style={[
                                styles.vibeLabel,
                                vibe === option.id && styles.vibeLabelSelected
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.submitText}>Submit Feedback</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.text.inverse} />
            </TouchableOpacity>

            {/* Anonymous Note */}
            <View style={styles.noteSection}>
                <TextInput
                    style={styles.noteInput}
                    placeholder="Share details for our safety team. Only Nomadly sees this..."
                    placeholderTextColor={Colors.text.muted}
                    value={note}
                    onChangeText={setNote}
                    multiline
                />
                <Ionicons name="lock-closed-outline" size={16} color={Colors.text.muted} style={styles.lockIcon as any} />
            </View>

            {/* Privacy Notice */}
            <View style={styles.privacyNotice}>
                <View style={styles.privacyDot} />
                <Text style={styles.privacyText}>
                    This note is 100% anonymous. It helps our algorithm keep the community safe and will never be shared with Sarah.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Layout.screenPadding,
        paddingVertical: Spacing.md,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...Typography.labelSmall,
        color: Colors.text.muted,
        letterSpacing: 1,
    },
    skipText: {
        ...Typography.label,
        color: Colors.primary.main,
    },

    // User Section
    userSection: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.background.primary,
    },
    tripTitle: {
        ...Typography.h3,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    tripMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tripLocation: {
        ...Typography.body,
        color: Colors.primary.main,
    },
    tripDates: {
        ...Typography.body,
        color: Colors.text.muted,
        marginLeft: Spacing.xs,
    },

    // Sections
    section: {
        paddingHorizontal: Layout.screenPadding,
        marginBottom: Spacing.xl,
    },
    questionTitle: {
        ...Typography.h4,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
    },

    // Yes/No Cards
    yesNoRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    yesNoCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
        backgroundColor: Colors.background.elevated,
        borderRadius: BorderRadius.xl,
        borderWidth: 2,
        borderColor: Colors.border.light,
        position: 'relative',
    },
    yesNoCardSelected: {
        borderColor: Colors.primary.main,
        backgroundColor: Colors.tag.teal,
    },
    yesNoText: {
        ...Typography.label,
        color: Colors.text.secondary,
        marginTop: Spacing.sm,
    },
    yesNoTextSelected: {
        color: Colors.primary.main,
    },
    checkBadge: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        color: Colors.text.inverse,
        fontWeight: '600',
    },

    // Vibe Grid
    vibeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    vibeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border.light,
        backgroundColor: Colors.background.elevated,
        gap: Spacing.xs,
    },
    vibeChipSelected: {
        backgroundColor: Colors.primary.main,
        borderColor: Colors.primary.main,
    },
    vibeEmoji: {
        fontSize: 16,
    },
    vibeLabel: {
        ...Typography.label,
        color: Colors.text.secondary,
    },
    vibeLabelSelected: {
        color: Colors.text.inverse,
    },

    // Submit Button
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Layout.screenPadding,
        backgroundColor: Colors.primary.main,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xl,
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    submitText: {
        ...Typography.button,
        color: Colors.text.inverse,
    },

    // Note Section
    noteSection: {
        marginHorizontal: Layout.screenPadding,
        backgroundColor: Colors.background.muted,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        position: 'relative',
        marginBottom: Spacing.lg,
    },
    noteInput: {
        ...Typography.body,
        color: Colors.text.primary,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    lockIcon: {
        position: 'absolute',
        bottom: Spacing.md,
        right: Spacing.md,
    },

    // Privacy Notice
    privacyNotice: {
        flexDirection: 'row',
        marginHorizontal: Layout.screenPadding,
        padding: Spacing.md,
        backgroundColor: Colors.tag.teal,
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },
    privacyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary.main,
        marginTop: 6,
    },
    privacyText: {
        ...Typography.bodySmall,
        color: Colors.text.secondary,
        flex: 1,
        lineHeight: 20,
    },
});
