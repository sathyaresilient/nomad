import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/design/colors';
import { UsersAPI } from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';
import { TravelStyle } from '../../src/types';

const TRAVEL_STYLES: { id: TravelStyle; label: string; icon: string }[] = [
    { id: 'digitalNomad', label: 'Digital Nomad', icon: 'laptop-outline' },
    { id: 'backpacker', label: 'Backpacker', icon: 'trail-sign-outline' },
    { id: 'explorer', label: 'Explorer', icon: 'compass-outline' },
    { id: 'luxury', label: 'Luxury', icon: 'diamond-outline' },
];

export default function EditProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, updateProfile } = useAuthStore();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [travelStyle, setTravelStyle] = useState<TravelStyle>(user?.travelStyle || 'digitalNomad');
    const [languages, setLanguages] = useState((user?.languages || ['English']).join(', '));
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const langArray = languages
            .split(',')
            .map(l => l.trim())
            .filter(Boolean);

        const updates = {
            displayName,
            bio,
            travelStyle,
            languages: langArray,
        };

        const result = await UsersAPI.updateMe(updates);
        if (result.data?.user) {
            updateProfile(result.data.user);
        } else {
            updateProfile(updates as any);
        }
        setIsSaving(false);
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Display Name */}
                    <View style={styles.field}>
                        <Text style={styles.label}>DISPLAY NAME</Text>
                        <TextInput
                            style={styles.input}
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Your name"
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    {/* Bio */}
                    <View style={styles.field}>
                        <Text style={styles.label}>BIO</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell travelers about yourself..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            maxLength={200}
                        />
                        <Text style={styles.charCount}>{bio.length}/200</Text>
                    </View>

                    {/* Travel Style */}
                    <View style={styles.field}>
                        <Text style={styles.label}>TRAVEL STYLE</Text>
                        <View style={styles.styleGrid}>
                            {TRAVEL_STYLES.map(style => (
                                <TouchableOpacity
                                    key={style.id}
                                    style={[styles.styleOption, travelStyle === style.id && styles.styleOptionActive]}
                                    onPress={() => setTravelStyle(style.id)}
                                >
                                    <Ionicons
                                        name={style.icon as any}
                                        size={20}
                                        color={travelStyle === style.id ? Colors.primary.main : '#94A3B8'}
                                    />
                                    <Text style={[styles.styleLabel, travelStyle === style.id && styles.styleLabelActive]}>
                                        {style.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Languages */}
                    <View style={styles.field}>
                        <Text style={styles.label}>LANGUAGES</Text>
                        <TextInput
                            style={styles.input}
                            value={languages}
                            onChangeText={setLanguages}
                            placeholder="English, Spanish, ..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    {/* Nomadpic Link */}
                    <TouchableOpacity style={styles.nomadpicBtn} onPress={() => router.push('/biopic')}>
                        <Ionicons name="images-outline" size={20} color={Colors.primary.main} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.nomadpicTitle}>Edit Nomadpic</Text>
                            <Text style={styles.nomadpicSub}>Photos, places, likes & dislikes</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                    </TouchableOpacity>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingVertical: 14,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary.main,
    },
    scrollContent: {
        padding: 20,
    },
    field: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1E293B',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        fontSize: 11,
        color: '#CBD5E1',
        marginTop: 4,
    },
    styleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    styleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    styleOptionActive: {
        borderColor: Colors.primary.main,
        backgroundColor: '#F0FDFA',
    },
    styleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    styleLabelActive: {
        color: Colors.primary.main,
    },
    nomadpicBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 24,
    },
    nomadpicTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    nomadpicSub: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    saveButton: {
        backgroundColor: Colors.primary.main,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
