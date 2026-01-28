import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ReviewSlider } from '../../src/components/quarters/ReviewSlider';
import { mockUsers } from '../../src/data/mockUsers';

const TAGS = ['Helpful Guide', 'Respects Privacy', 'Great Cook', 'Tech Savvy'];

export default function HostReviewScreen() {
    const router = useRouter();
    const host = mockUsers[1]; // Sarah Jenkins
    const [endorseEnabled, setEndorseEnabled] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>(['Helpful Guide', 'Tech Savvy']);
    const [vibeEmoji, setVibeEmoji] = useState<'totally' | 'somewhat' | 'notreally'>('totally');

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.headerSuper}>REVIEW STAY</Text>
                        <Text style={styles.headerTitle}>The Quarter • Berlin</Text>
                    </View>
                    <View style={{ width: 24 }} />
                </View>
                {/* Progress Bar Mock */}
                <View style={styles.progressRow}>
                    <View style={[styles.barSegment, styles.barActive]} />
                    <View style={[styles.barSegment, styles.barActive]} />
                    <View style={[styles.barSegment, styles.barInactive]} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Productivity Section */}
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardTitle}>Let's talk productivity</Text>
                            <Ionicons name="wifi" size={20} color="#10B981" />
                        </View>

                        <ReviewSlider
                            label="WiFi Stability"
                            value={5.0}
                            minLabel="Unstable"
                            maxLabel="Lightning Fast"
                            verifiedBadge="Verified 200mbps"
                        />
                        <ReviewSlider
                            label="Desk Ergonomics"
                            value={4.0}
                            minLabel="Cramped"
                            maxLabel="Spacious"
                        />
                        <ReviewSlider
                            label="Ambient Noise"
                            value={3.5}
                            minLabel="Noisy"
                            maxLabel="Library Quiet"
                        />
                    </View>

                    {/* Vibe Check Section */}
                    <View style={[styles.card, styles.vibeCard]}>
                        <Text style={styles.cardTitle}>Vibe Check</Text>

                        <View style={styles.hostProfileRow}>
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: host.avatarUrl }} style={styles.avatar} />
                                <View style={styles.lightningBadge}>
                                    <Ionicons name="flash" size={10} color="#F59E0B" />
                                </View>
                            </View>
                            <View>
                                <Text style={styles.hostLabel}>Your Host</Text>
                                <Text style={styles.hostName}>{host.displayName}</Text>
                                <View style={styles.personaTag}>
                                    <Ionicons name="globe" size={12} color="#A855F7" />
                                    <Text style={styles.personaText}>The Social Connector</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.questionText}>Did Sarah live up to her AI Persona?</Text>

                        <View style={styles.emojiRow}>
                            <TouchableOpacity
                                style={[styles.emojiBtn, vibeEmoji === 'totally' && styles.emojiSelected]}
                                onPress={() => setVibeEmoji('totally')}
                            >
                                <Text style={styles.emojiIcon}>🤩</Text>
                                <Text style={styles.emojiLabel}>Totally!</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emojiBtn, vibeEmoji === 'somewhat' && styles.emojiSelected]}
                                onPress={() => setVibeEmoji('somewhat')}
                            >
                                <Text style={styles.emojiIcon}>🤔</Text>
                                <Text style={styles.emojiLabel}>Somewhat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.emojiBtn, vibeEmoji === 'notreally' && styles.emojiSelected]}
                                onPress={() => setVibeEmoji('notreally')}
                            >
                                <Text style={styles.emojiIcon}>🫠</Text>
                                <Text style={styles.emojiLabel}>Not really</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.questionText}>What stood out? (Select all that apply)</Text>
                        <View style={styles.tagsRow}>
                            {TAGS.map(tag => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[styles.tagChip, isSelected && styles.tagSelected]}
                                        onPress={() => toggleTag(tag)}
                                    >
                                        <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{tag}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Leave a Legacy Section */}
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                            <View style={styles.legacyIcon}>
                                <Ionicons name="ribbon" size={16} color="#B45309" />
                            </View>
                            <Text style={styles.cardTitle}>Leave a legacy</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={styles.inputLabel}>Public Trust Endorsement</Text>
                            <View style={styles.visibleTag}>
                                <Text style={styles.visibleText}>Visible on Profile</Text>
                            </View>
                        </View>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Help other nomads trust Sarah. What made this stay special?"
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={3}
                        />

                        <View style={{ flexDirection: 'row', gap: 6, marginTop: 16, marginBottom: 8 }}>
                            <Ionicons name="lock-closed" size={14} color="#64748B" />
                            <Text style={styles.inputLabel}>Private Note for Sarah</Text>
                        </View>
                        <TextInput
                            style={[styles.textArea, { backgroundColor: '#F8FAFC', borderColor: 'transparent' }]}
                            placeholder="Any tips for improvement? Only Sarah sees this."
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={2}
                        />

                        <View style={styles.endorseRow}>
                            <View>
                                <Text style={styles.endorseLabel}>Endorse this Host</Text>
                                <Text style={styles.endorseSub}>Adds a +1 to Sarah's Trust Score</Text>
                            </View>
                            <Switch
                                value={endorseEnabled}
                                onValueChange={setEndorseEnabled}
                                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                                thumbColor={'#FFF'}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={() => {
                            Alert.alert("Review Submitted", "Thanks for keeping our community trusted!");
                            router.back();
                        }}
                    >
                        <Text style={styles.submitText}>Submit Review</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9', // Light gray background behind cards
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    headerSuper: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    progressRow: {
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#FFF',
    },
    barSegment: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    barActive: {
        backgroundColor: '#10B981',
    },
    barInactive: {
        backgroundColor: '#E2E8F0',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    vibeCard: {
        backgroundColor: '#FFF', // Keeping white for consistency, design implies slight transparency or gradient but white is safe
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    hostProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
        marginTop: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    lightningBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        elevation: 2,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 }
    },
    hostLabel: {
        fontSize: 12,
        color: '#94A3B8',
    },
    hostName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    personaTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    personaText: {
        fontSize: 10,
        color: '#9333EA',
        fontWeight: '600',
    },
    questionText: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 16,
        fontWeight: '500',
    },
    emojiRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    emojiBtn: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    emojiSelected: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
    },
    emojiIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    emojiLabel: {
        fontSize: 10,
        color: '#64748B',
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tagSelected: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    tagText: {
        fontSize: 12,
        color: '#64748B',
    },
    tagTextSelected: {
        color: '#FFF',
        fontWeight: '600',
    },
    legacyIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
    },
    visibleTag: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    visibleText: {
        fontSize: 10,
        color: '#10B981',
        fontWeight: '600',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 16,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#1E293B',
        minHeight: 100,
    },
    endorseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    endorseLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    endorseSub: {
        fontSize: 10,
        color: '#64748B',
    },
    footer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    submitBtn: {
        backgroundColor: '#34D399', // Emerald 400ish
        paddingVertical: 16,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#34D399',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
