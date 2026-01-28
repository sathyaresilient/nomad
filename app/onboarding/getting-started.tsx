/**
 * Getting Started Journey
 * Onboarding flow with 4 steps: Plan Trip, Connect, Verify, Meetup
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// Journey steps configuration
const JOURNEY_STEPS = [
    {
        id: 'trip',
        icon: 'map-outline',
        title: 'Explore the Map',
        description: 'Discover travelers, local guides, and events in your destination.',
        bgColor: '#D1FAE5',
        iconColor: '#10B981',
        action: 'Open Map',
        route: '/explore/map',
    },
    {
        id: 'connect',
        icon: 'chatbubbles',
        title: 'Connect with Travelers',
        description: 'Discover nomads in your destination and send connection requests.',
        bgColor: '#DBEAFE',
        iconColor: '#3B82F6',
        action: 'Explore',
        route: '/(tabs)/discover',
    },
    {
        id: 'verify',
        icon: 'shield-checkmark',
        title: 'Get Verified',
        description: 'Build trust by verifying your identity and linking social profiles.',
        bgColor: '#FEE2E2',
        iconColor: '#EF4444',
        action: 'Verify Now',
        route: '/verification',
    },
    {
        id: 'meetup',
        icon: 'cafe',
        title: 'Meet for Coffee',
        description: 'Schedule your first meetup and earn Trust Points!',
        bgColor: '#FCE7F3',
        iconColor: '#8B5A2B',
        action: 'View Matches',
        route: '/(tabs)/discover',
    },
];

// Step indicator component
const StepIndicator: React.FC<{
    icon: string;
    bgColor: string;
    iconColor: string;
    isActive: boolean;
    isCompleted: boolean;
}> = ({ icon, bgColor, iconColor, isActive, isCompleted }) => (
    <View style={[
        styles.stepCircle,
        { backgroundColor: bgColor },
        isActive && styles.stepCircleActive,
    ]}>
        {isCompleted ? (
            <Ionicons name="checkmark" size={24} color="#10B981" />
        ) : (
            <Ionicons name={icon as any} size={24} color={iconColor} />
        )}
    </View>
);

export default function GettingStartedScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    const handleStepAction = (step: typeof JOURNEY_STEPS[0], index: number) => {
        // Mark as completed and navigate
        if (!completedSteps.includes(step.id)) {
            setCompletedSteps([...completedSteps, step.id]);
        }
        router.push(step.route as any);
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Getting Started</Text>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Step Indicators Row */}
                <View style={styles.stepsRow}>
                    {JOURNEY_STEPS.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <TouchableOpacity onPress={() => setCurrentStep(index)}>
                                <StepIndicator
                                    icon={step.icon}
                                    bgColor={step.bgColor}
                                    iconColor={step.iconColor}
                                    isActive={currentStep === index}
                                    isCompleted={completedSteps.includes(step.id)}
                                />
                            </TouchableOpacity>
                            {index < JOURNEY_STEPS.length - 1 && (
                                <View style={[
                                    styles.connector,
                                    completedSteps.includes(step.id) && styles.connectorCompleted
                                ]} />
                            )}
                        </React.Fragment>
                    ))}
                </View>

                {/* Progress text */}
                <Text style={styles.progressText}>
                    Step {currentStep + 1} of {JOURNEY_STEPS.length}
                </Text>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Current Step Card */}
                    <View style={styles.stepCard}>
                        <View style={[styles.stepIconLarge, { backgroundColor: JOURNEY_STEPS[currentStep].bgColor }]}>
                            <Ionicons
                                name={JOURNEY_STEPS[currentStep].icon as any}
                                size={48}
                                color={JOURNEY_STEPS[currentStep].iconColor}
                            />
                        </View>

                        <Text style={styles.stepTitle}>{JOURNEY_STEPS[currentStep].title}</Text>
                        <Text style={styles.stepDescription}>{JOURNEY_STEPS[currentStep].description}</Text>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleStepAction(JOURNEY_STEPS[currentStep], currentStep)}
                        >
                            <Text style={styles.actionButtonText}>{JOURNEY_STEPS[currentStep].action}</Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Navigation Arrows */}
                    <View style={styles.navRow}>
                        <TouchableOpacity
                            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
                            onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                        >
                            <Ionicons name="chevron-back" size={24} color={currentStep === 0 ? '#CBD5E1' : '#64748B'} />
                        </TouchableOpacity>

                        <View style={styles.dotsRow}>
                            {JOURNEY_STEPS.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentStep === index && styles.dotActive
                                    ]}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.navButton, currentStep === JOURNEY_STEPS.length - 1 && styles.navButtonDisabled]}
                            onPress={() => setCurrentStep(Math.min(JOURNEY_STEPS.length - 1, currentStep + 1))}
                            disabled={currentStep === JOURNEY_STEPS.length - 1}
                        >
                            <Ionicons name="chevron-forward" size={24} color={currentStep === JOURNEY_STEPS.length - 1 ? '#CBD5E1' : '#64748B'} />
                        </TouchableOpacity>
                    </View>

                    {/* All steps preview */}
                    <View style={styles.allStepsSection}>
                        <Text style={styles.allStepsTitle}>Your Journey</Text>
                        {JOURNEY_STEPS.map((step, index) => (
                            <TouchableOpacity
                                key={step.id}
                                style={[
                                    styles.stepRow,
                                    completedSteps.includes(step.id) && styles.stepRowCompleted
                                ]}
                                onPress={() => setCurrentStep(index)}
                            >
                                <View style={[styles.stepRowIcon, { backgroundColor: step.bgColor }]}>
                                    <Ionicons name={step.icon as any} size={20} color={step.iconColor} />
                                </View>
                                <View style={styles.stepRowContent}>
                                    <Text style={styles.stepRowTitle}>{step.title}</Text>
                                    <Text style={styles.stepRowStatus}>
                                        {completedSteps.includes(step.id) ? '✓ Completed' : 'Not started'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    skipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },

    // Step Indicators
    stepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    stepCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircleActive: {
        borderWidth: 3,
        borderColor: '#2A9D8F',
    },
    connector: {
        width: 24,
        height: 2,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 4,
    },
    connectorCompleted: {
        backgroundColor: '#10B981',
    },
    progressText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 16,
    },

    scrollContent: {
        padding: 20,
    },

    // Step Card
    stepCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
    },
    stepIconLarge: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 12,
        textAlign: 'center',
    },
    stepDescription: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#2A9D8F',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },

    // Navigation
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    navButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E2E8F0',
    },
    dotActive: {
        backgroundColor: '#2A9D8F',
        width: 24,
    },

    // All Steps Section
    allStepsSection: {
        marginTop: 8,
    },
    allStepsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    stepRowCompleted: {
        backgroundColor: '#F0FDF4',
    },
    stepRowIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    stepRowContent: {
        flex: 1,
    },
    stepRowTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    stepRowStatus: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
});
