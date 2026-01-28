/**
 * Loading Skeleton Components
 * Animated placeholder skeletons for loading states
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// Base skeleton with pulse animation
interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 16,
    borderRadius = 8,
    style,
}) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, borderRadius, opacity },
                style,
            ]}
        />
    );
};

// Card skeleton (for posts, groups, etc.)
export const CardSkeleton: React.FC = () => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.cardHeaderText}>
                <Skeleton width={120} height={14} />
                <Skeleton width={80} height={12} style={{ marginTop: 6 }} />
            </View>
        </View>
        <Skeleton width="100%" height={14} style={{ marginTop: 12 }} />
        <Skeleton width="80%" height={14} style={{ marginTop: 6 }} />
        <Skeleton width="60%" height={14} style={{ marginTop: 6 }} />
    </View>
);

// Profile row skeleton (for friends, members)
export const ProfileRowSkeleton: React.FC = () => (
    <View style={styles.profileRow}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.profileInfo}>
            <Skeleton width={140} height={14} />
            <Skeleton width={100} height={12} style={{ marginTop: 6 }} />
        </View>
        <Skeleton width={32} height={32} borderRadius={16} />
    </View>
);

// Group card skeleton
export const GroupCardSkeleton: React.FC = () => (
    <View style={styles.groupCard}>
        <Skeleton width={50} height={50} borderRadius={14} />
        <View style={styles.groupInfo}>
            <Skeleton width={160} height={16} />
            <Skeleton width={120} height={12} style={{ marginTop: 6 }} />
            <Skeleton width={80} height={12} style={{ marginTop: 6 }} />
        </View>
    </View>
);

// Post skeleton
export const PostSkeleton: React.FC = () => (
    <View style={styles.post}>
        <View style={styles.cardHeader}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.cardHeaderText}>
                <Skeleton width={100} height={14} />
                <Skeleton width={60} height={10} style={{ marginTop: 4 }} />
            </View>
        </View>
        <Skeleton width="100%" height={12} style={{ marginTop: 14 }} />
        <Skeleton width="90%" height={12} style={{ marginTop: 6 }} />
        <Skeleton width="70%" height={12} style={{ marginTop: 6 }} />
        <Skeleton width="100%" height={160} borderRadius={12} style={{ marginTop: 12 }} />
        <View style={styles.postActions}>
            <Skeleton width={60} height={24} borderRadius={12} />
            <Skeleton width={60} height={24} borderRadius={12} />
            <Skeleton width={60} height={24} borderRadius={12} />
        </View>
    </View>
);

// Feed skeleton (multiple posts)
export const FeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <View style={styles.feed}>
        {Array.from({ length: count }).map((_, i) => (
            <PostSkeleton key={i} />
        ))}
    </View>
);

// Friends list skeleton
export const FriendsListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <View>
        {Array.from({ length: count }).map((_, i) => (
            <ProfileRowSkeleton key={i} />
        ))}
    </View>
);

// Groups list skeleton
export const GroupsListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
    <View>
        {Array.from({ length: count }).map((_, i) => (
            <GroupCardSkeleton key={i} />
        ))}
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E2E8F0',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardHeaderText: {
        marginLeft: 10,
        flex: 1,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
    },
    groupInfo: {
        flex: 1,
        marginLeft: 12,
    },
    post: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    postActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 14,
    },
    feed: {
        padding: 16,
    },
});
