import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityFeedItem } from '../../src/components/home/ActivityFeedItem';
import { HomeHeader } from '../../src/components/home/HomeHeader';
import { OnlineUsersRow } from '../../src/components/home/OnlineUsersRow';
import { PulseHeroCard } from '../../src/components/home/PulseHeroCard';
import { useAuthStore, useTripStore } from '../../src/store';

export default function DiscoverScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { loadMyTrips } = useTripStore();

  useEffect(() => {
    if (user) {
      loadMyTrips();
    }
  }, [user]);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 56 + Math.max(insets.bottom, 8) + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <OnlineUsersRow />

        <PulseHeroCard />

        <ActivityFeedItem />

        {/* Host / Local Mode CTA */}
        <TouchableOpacity
          style={styles.hostCard}
          onPress={() => router.push('/local-mode')}
          activeOpacity={0.8}
        >
          <View style={styles.hostIconWrap}>
            <Ionicons name="home-outline" size={22} color="#2A9D8F" />
          </View>
          <View style={styles.hostContent}>
            <Text style={styles.hostTitle}>Become a Local Host</Text>
            <Text style={styles.hostSub}>Share your city knowledge with travelers nearby</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  hostIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  hostContent: {
    flex: 1,
  },
  hostTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  hostSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
