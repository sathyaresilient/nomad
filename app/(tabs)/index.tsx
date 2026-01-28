import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <OnlineUsersRow />

        <PulseHeroCard />

        <ActivityFeedItem />

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
});
