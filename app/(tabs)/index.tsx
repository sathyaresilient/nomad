import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <OnlineUsersRow />

        <PulseHeroCard />

        <ActivityFeedItem />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    paddingBottom: 100, // Safe space for tab bar
  },
});
