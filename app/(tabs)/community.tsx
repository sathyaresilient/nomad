import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryPill } from '../../src/components/community/CategoryPill';
import { EventCard } from '../../src/components/community/EventCard';
import { Colors } from '../../src/design/colors';
import { useCommunityStore } from '../../src/store/communityStore';

export default function CommunityScreen() {
    const router = useRouter();
    const { events, categories, selectEvent } = useCommunityStore();
    const insets = useSafeAreaInsets();
    const [activeCategory, setActiveCategory] = React.useState('All');

    // Filter events by category
    const filteredEvents = events.filter(e =>
        activeCategory === 'All' || activeCategory === 'Events' ? true : e.category === activeCategory
    );

    const handleEventPress = (eventId: string) => {
        selectEvent(eventId);
        router.push(`/community/event/${eventId}`);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Community Hub</Text>
                <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/events/create')}>
                    <Ionicons name="add" size={24} color={Colors.primary.main} />
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={styles.categoryContainer}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
                    renderItem={({ item }) => (
                        <CategoryPill
                            label={item}
                            isActive={activeCategory === item}
                            onPress={() => setActiveCategory(item)}
                        />
                    )}
                />
            </View>

            {/* Events Feed */}
            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EventCard
                        event={item}
                        onPress={() => handleEventPress(item.id)}
                    />
                )}
                contentContainerStyle={styles.feedContent}
            />
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text.primary,
    },
    createBtn: {
        padding: 4,
    },
    categoryContainer: {
        paddingVertical: 16,
    },
    feedContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
