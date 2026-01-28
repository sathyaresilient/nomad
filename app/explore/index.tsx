/**
 * Explore Screen - Redirects to Discover
 * This provides a fallback for the /explore route
 */

import { Redirect } from 'expo-router';

export default function ExploreScreen() {
    // Redirect to the discover tab which serves as the main explore functionality
    return <Redirect href="/discover" />;
}
