/**
 * Verification Start Screen
 * Multi-step verification journey: LinkedIn, Instagram, ID Card
 */

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type VerificationStep = 'intro' | 'linkedin' | 'instagram' | 'facebook' | 'idcard' | 'complete';

export default function VerificationStartScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<VerificationStep>('intro');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [idUploaded, setIdUploaded] = useState(false);

    const steps = [
        { key: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin', completed: !!linkedinUrl },
        { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', completed: !!instagramUrl },
        { key: 'facebook', label: 'Facebook', icon: 'logo-facebook', completed: !!facebookUrl },
        { key: 'idcard', label: 'ID Card', icon: 'card-outline', completed: idUploaded },
    ];

    const completedCount = steps.filter(s => s.completed).length;

    const renderIntro = () => (
        <View style={styles.stepContent}>
            <View style={styles.introIcon}>
                <Ionicons name="shield-checkmark" size={64} color="#2A9D8F" />
            </View>
            <Text style={styles.introTitle}>Get Verified</Text>
            <Text style={styles.introSubtitle}>
                Complete verification to build trust with the community and unlock all features.
            </Text>

            <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#2A9D8F" />
                    <Text style={styles.benefitText}>Verified badge on your profile</Text>
                </View>
                <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#2A9D8F" />
                    <Text style={styles.benefitText}>Higher trust score</Text>
                </View>
                <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#2A9D8F" />
                    <Text style={styles.benefitText}>Connect with verified nomads</Text>
                </View>
                <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#2A9D8F" />
                    <Text style={styles.benefitText}>Access to exclusive features</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setCurrentStep('linkedin')}
            >
                <Text style={styles.primaryButtonText}>Start Verification</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
        </View>
    );

    const renderLinkedIn = () => (
        <View style={styles.stepContent}>
            <View style={[styles.stepIcon, { backgroundColor: '#E8F4FD' }]}>
                <Ionicons name="logo-linkedin" size={48} color="#0A66C2" />
            </View>
            <Text style={styles.stepTitle}>Connect LinkedIn</Text>
            <Text style={styles.stepSubtitle}>
                Link your professional profile to verify your identity and work history.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>LinkedIn Profile URL</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://linkedin.com/in/yourprofile"
                    placeholderTextColor="#94A3B8"
                    value={linkedinUrl}
                    onChangeText={setLinkedinUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                />
            </View>

            <TouchableOpacity style={styles.oauthButton}>
                <Ionicons name="logo-linkedin" size={20} color="#FFF" />
                <Text style={styles.oauthButtonText}>Connect with LinkedIn</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => setCurrentStep('instagram')}
                >
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, !linkedinUrl && styles.buttonDisabled]}
                    onPress={() => setCurrentStep('instagram')}
                >
                    <Text style={styles.nextButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderInstagram = () => (
        <View style={styles.stepContent}>
            <View style={[styles.stepIcon, { backgroundColor: '#FFEEF8' }]}>
                <Ionicons name="logo-instagram" size={48} color="#E4405F" />
            </View>
            <Text style={styles.stepTitle}>Connect Instagram</Text>
            <Text style={styles.stepSubtitle}>
                Share your travel photos and experiences with the community.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Instagram Username</Text>
                <View style={styles.inputWithPrefix}>
                    <Text style={styles.inputPrefix}>@</Text>
                    <TextInput
                        style={styles.inputNoBorder}
                        placeholder="yourusername"
                        placeholderTextColor="#94A3B8"
                        value={instagramUrl}
                        onChangeText={setInstagramUrl}
                        autoCapitalize="none"
                    />
                </View>
            </View>

            <TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#E4405F' }]}>
                <Ionicons name="logo-instagram" size={20} color="#FFF" />
                <Text style={styles.oauthButtonText}>Connect with Instagram</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => setCurrentStep('facebook')}
                >
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, !instagramUrl && styles.buttonDisabled]}
                    onPress={() => setCurrentStep('facebook')}
                >
                    <Text style={styles.nextButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFacebook = () => (
        <View style={styles.stepContent}>
            <View style={[styles.stepIcon, { backgroundColor: '#E8F0FE' }]}>
                <Ionicons name="logo-facebook" size={48} color="#1877F2" />
            </View>
            <Text style={styles.stepTitle}>Connect Facebook</Text>
            <Text style={styles.stepSubtitle}>
                Link your social profile to build more trust with the community.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Facebook Profile URL</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://facebook.com/yourprofile"
                    placeholderTextColor="#94A3B8"
                    value={facebookUrl}
                    onChangeText={setFacebookUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                />
            </View>

            <TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#1877F2' }]}>
                <Ionicons name="logo-facebook" size={20} color="#FFF" />
                <Text style={styles.oauthButtonText}>Connect with Facebook</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => setCurrentStep('idcard')}
                >
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, !facebookUrl && styles.buttonDisabled]}
                    onPress={() => setCurrentStep('idcard')}
                >
                    <Text style={styles.nextButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderIdCard = () => (
        <View style={styles.stepContent}>
            <View style={[styles.stepIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="card-outline" size={48} color="#F59E0B" />
            </View>
            <Text style={styles.stepTitle}>Verify ID Card</Text>
            <Text style={styles.stepSubtitle}>
                Upload a government-issued ID to complete verification. Your data is encrypted and secure.
            </Text>

            <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => setIdUploaded(true)}
            >
                {idUploaded ? (
                    <>
                        <View style={styles.uploadedIcon}>
                            <Ionicons name="checkmark-circle" size={48} color="#2A9D8F" />
                        </View>
                        <Text style={styles.uploadedText}>ID Uploaded Successfully</Text>
                    </>
                ) : (
                    <>
                        <Ionicons name="cloud-upload-outline" size={48} color="#94A3B8" />
                        <Text style={styles.uploadText}>Tap to upload ID</Text>
                        <Text style={styles.uploadHint}>Passport, Driver's License, or National ID</Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={styles.securityNote}>
                <Ionicons name="lock-closed" size={16} color="#64748B" />
                <Text style={styles.securityText}>
                    Your ID is encrypted and only used for verification. It will not be shared.
                </Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => setCurrentStep('complete')}
                >
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, !idUploaded && styles.buttonDisabled]}
                    onPress={() => setCurrentStep('complete')}
                >
                    <Text style={styles.nextButtonText}>Complete</Text>
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderComplete = () => (
        <View style={styles.stepContent}>
            <View style={styles.completeIcon}>
                <Ionicons name="checkmark-circle" size={80} color="#2A9D8F" />
            </View>
            <Text style={styles.completeTitle}>Verification Submitted!</Text>
            <Text style={styles.completeSubtitle}>
                We're reviewing your information. You'll receive a notification once verified.
            </Text>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Verification Summary</Text>
                {steps.map((step, index) => (
                    <View key={step.key} style={styles.summaryRow}>
                        <View style={styles.summaryRowLeft}>
                            <Ionicons name={step.icon as any} size={20} color="#4B5563" />
                            <Text style={styles.summaryLabel}>{step.label}</Text>
                        </View>
                        <Ionicons
                            name={step.completed ? "checkmark-circle" : "close-circle"}
                            size={20}
                            color={step.completed ? "#2A9D8F" : "#CBD5E1"}
                        />
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.back()}
            >
                <Text style={styles.primaryButtonText}>Back to Profile</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        if (currentStep === 'intro') {
                            router.back();
                        } else if (currentStep === 'linkedin') {
                            setCurrentStep('intro');
                        } else if (currentStep === 'instagram') {
                            setCurrentStep('linkedin');
                        } else if (currentStep === 'facebook') {
                            setCurrentStep('instagram');
                        } else if (currentStep === 'idcard') {
                            setCurrentStep('facebook');
                        } else {
                            router.back();
                        }
                    }}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Verification</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Progress Bar (only show after intro) */}
                {currentStep !== 'intro' && currentStep !== 'complete' && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTrack}>
                            <View style={[
                                styles.progressFill,
                                { width: currentStep === 'linkedin' ? '25%' : currentStep === 'instagram' ? '50%' : currentStep === 'facebook' ? '75%' : '100%' }
                            ]} />
                        </View>
                        <Text style={styles.progressText}>
                            Step {currentStep === 'linkedin' ? 1 : currentStep === 'instagram' ? 2 : currentStep === 'facebook' ? 3 : 4} of 4
                        </Text>
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {currentStep === 'intro' && renderIntro()}
                    {currentStep === 'linkedin' && renderLinkedIn()}
                    {currentStep === 'instagram' && renderInstagram()}
                    {currentStep === 'facebook' && renderFacebook()}
                    {currentStep === 'idcard' && renderIdCard()}
                    {currentStep === 'complete' && renderComplete()}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    progressTrack: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2A9D8F',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'right',
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },

    // Step Content
    stepContent: {
        flex: 1,
        alignItems: 'center',
    },

    // Intro
    introIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12,
    },
    introSubtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    benefitsList: {
        alignSelf: 'stretch',
        marginBottom: 32,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    benefitText: {
        fontSize: 15,
        color: '#1E293B',
    },

    // Step Screens
    stepIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },

    // Input
    inputContainer: {
        alignSelf: 'stretch',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1E293B',
        backgroundColor: '#F8FAFC',
    },
    inputWithPrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
    },
    inputPrefix: {
        paddingLeft: 16,
        fontSize: 15,
        color: '#94A3B8',
    },
    inputNoBorder: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1E293B',
    },

    // OAuth Button
    oauthButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#0A66C2',
        paddingVertical: 14,
        borderRadius: 12,
        alignSelf: 'stretch',
        marginBottom: 24,
    },
    oauthButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },

    // Upload Box
    uploadBox: {
        alignSelf: 'stretch',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        marginBottom: 16,
    },
    uploadText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
        marginTop: 12,
    },
    uploadHint: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    uploadedIcon: {
        marginBottom: 8,
    },
    uploadedText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2A9D8F',
    },

    // Security Note
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'stretch',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 10,
        marginBottom: 24,
    },
    securityText: {
        flex: 1,
        fontSize: 12,
        color: '#64748B',
        lineHeight: 18,
    },

    // Buttons
    buttonRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        gap: 12,
        marginTop: 'auto',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2A9D8F',
        paddingVertical: 16,
        borderRadius: 12,
        alignSelf: 'stretch',
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    skipButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    skipButtonText: {
        color: '#64748B',
        fontSize: 15,
        fontWeight: '600',
    },
    nextButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#2A9D8F',
        paddingVertical: 16,
        borderRadius: 12,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.5,
    },

    // Complete
    completeIcon: {
        marginBottom: 24,
    },
    completeTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    completeSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    summaryCard: {
        alignSelf: 'stretch',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    summaryRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#4B5563',
    },
});
