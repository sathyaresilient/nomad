import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CollaboratorGroup } from '../../src/components/trip-board/CollaboratorGroup';
import { PlaceCard } from '../../src/components/trip-board/PlaceCard';
import { StickyNote } from '../../src/components/trip-board/StickyNote';
import { Colors } from '../../src/design/colors';
import { useTripBoardStore } from '../../src/store/tripBoardStore';

type Tab = 'pins' | 'notes';

export default function TripBoardScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { initializeBoard, places, notes, collaborators } = useTripBoardStore();
    const [activeTab, setActiveTab] = useState<Tab>('pins');

    useEffect(() => {
        if (id) {
            initializeBoard(id as string);
        }
    }, [id]);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.superTitle}>Roadtrip to</Text>
                        <Text style={styles.title}>Lisbon</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsButton} onPress={() => alert('Trip Options:\n• Edit trip details\n• Share trip\n• Export to calendar\n• Delete trip')}>
                        <Ionicons name="ellipsis-vertical" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Sub-Header Actions */}
                <View style={styles.subHeader}>
                    <CollaboratorGroup collaborators={collaborators} onAdd={() => { }} />
                    <TouchableOpacity style={styles.inviteBtn}>
                        <Text style={styles.inviteText}>Invite</Text>
                    </TouchableOpacity>
                </View>

                {/* Custom Tabs */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabBackground}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'pins' && styles.activeTab]}
                            onPress={() => setActiveTab('pins')}
                        >
                            <Ionicons
                                name="location"
                                size={16}
                                color={activeTab === 'pins' ? Colors.primary.main : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === 'pins' && styles.activeTabText]}>Pins</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
                            onPress={() => setActiveTab('notes')}
                        >
                            <Ionicons
                                name="document-text"
                                size={16}
                                color={activeTab === 'notes' ? Colors.primary.main : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>Notes</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentInner}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'pins' ? (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Saved Places</Text>
                                <Text style={styles.itemCount}>{places.length} ITEMS</Text>
                            </View>

                            <View style={styles.placesGrid}>
                                {places.map((place) => (
                                    <PlaceCard key={place.id} place={place} />
                                ))}
                                {/* Add Place Placeholder */}
                                <TouchableOpacity style={styles.addPlaceCard} onPress={() => alert('Add Place: Search for cafes, restaurants, attractions, or any place you want to visit!')}>
                                    <View style={styles.addIconCircle}>
                                        <Ionicons name="add" size={24} color={Colors.primary.main} />
                                    </View>
                                    <Text style={styles.addPlaceText}>Add Place</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Sticky Notes</Text>
                                <TouchableOpacity>
                                    <Text style={styles.viewAllText}>View all</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.notesList}>
                                {notes.map((note) => (
                                    <StickyNote key={note.id} note={note} />
                                ))}
                                <TouchableOpacity style={styles.addNoteBtn} onPress={() => alert('Write a Note: Add tips, reminders, or anything you want to remember about this trip!')}>
                                    <Text style={styles.addNoteText}>+ Write a note</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>

                {/* Floating Bottom Bar (if needed, but using inline adds for now) */}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    superTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.primary.dark,
        lineHeight: 32,
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    inviteBtn: {
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    inviteText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 12,
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tabBackground: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 4,
        boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    activeTab: {
        backgroundColor: '#F0FDFA', // Light teal
    },
    tabText: {
        fontWeight: '600',
        color: Colors.text.muted,
        fontSize: 14,
    },
    activeTabText: {
        color: Colors.primary.main,
    },
    content: {
        flex: 1,
    },
    contentInner: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    itemCount: {
        fontSize: 11,
        color: Colors.text.muted,
    },
    viewAllText: {
        fontSize: 12,
        color: Colors.primary.main,
        fontWeight: '600',
    },
    placesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    addPlaceCard: {
        width: '48%',
        height: 180, // Match Approx card height
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    addIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    addPlaceText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.muted,
    },
    notesList: {
        gap: 0,
    },
    addNoteBtn: {
        marginTop: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.border.light,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    addNoteText: {
        color: Colors.text.muted,
        fontWeight: '600',
    },
});
