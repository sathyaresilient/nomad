import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SocialVibe, SocialVibeSelector } from '../../src/components/trips/SocialVibeSelector';

const { width } = Dimensions.get('window');

export default function CreateTripScreen() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [socialVibe, setSocialVibe] = useState<SocialVibe>('meetups');
    const [goal, setGoal] = useState('');

    const handleSave = () => {
        // Just mock navigation for now
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Title */}
                            <Text style={styles.title}>
                                Where to <Text style={styles.highlight}>next?</Text>
                            </Text>
                            <Text style={styles.subtitle}>Start your next adventure log.</Text>

                            {/* Destination */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>DESTINATION</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="location-sharp" size={20} color="#2A9D8F" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Lisbon, Portugal"
                                        placeholderTextColor="#94A3B8"
                                        value={destination}
                                        onChangeText={setDestination}
                                    />
                                </View>
                            </View>

                            {/* Timeline */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>TIMELINE</Text>
                                <View style={styles.row}>
                                    <View style={[styles.inputContainer, styles.halfInput]}>
                                        <Ionicons name="calendar-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Arrival"
                                            placeholderTextColor="#94A3B8"
                                            value={arrivalDate}
                                            onChangeText={setArrivalDate}
                                        />
                                    </View>
                                    <View style={[styles.inputContainer, styles.halfInput]}>
                                        <Ionicons name="airplane-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Departure"
                                            placeholderTextColor="#94A3B8"
                                            value={departureDate}
                                            onChangeText={setDepartureDate}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Social Vibe */}
                            <SocialVibeSelector value={socialVibe} onChange={setSocialVibe} />

                            {/* Trip Goal */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>TRIP GOAL</Text>
                                <View style={styles.textAreaContainer}>
                                    <TextInput
                                        style={styles.textArea}
                                        multiline
                                        placeholder="Briefly describe what you're looking for (e.g., 'Coworking partner for 2 weeks' or 'Weekend hiking buddy')."
                                        placeholderTextColor="#94A3B8"
                                        value={goal}
                                        onChangeText={setGoal}
                                        maxLength={140}
                                    />
                                    <Text style={styles.charCount}>{goal.length}/140</Text>
                                </View>
                            </View>

                        </ScrollView>

                        {/* Footer Button */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                                <Text style={styles.submitButtonText}>Announce Trip</Text>
                                <Ionicons name="send" size={16} color="#FFF" style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 10,
    },
    closeButton: {
        padding: 4,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2A9D8F',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 8,
    },
    highlight: {
        color: '#2A9D8F',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 32,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 10,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        marginLeft: 10,
        fontWeight: '500',
    },
    inputIcon: {
        marginRight: 2,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
        paddingVertical: 14,
    },
    textAreaContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        height: 120,
    },
    textArea: {
        flex: 1,
        fontSize: 15,
        color: '#1E293B',
        lineHeight: 22,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        fontSize: 11,
        color: '#CBD5E1',
        marginTop: 8,
    },
    footer: {
        paddingVertical: 20,
    },
    submitButton: {
        backgroundColor: '#2A9D8F',
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2A9D8F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
