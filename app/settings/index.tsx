import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../src/design/colors';

type SettingItem = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    route?: string;
    danger?: boolean;
};

const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
        title: 'Account',
        items: [
            { icon: 'person-outline', label: 'Edit Profile', route: '/profile/edit' },
            { icon: 'shield-checkmark-outline', label: 'Privacy', route: '/settings/privacy' },
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'globe-outline', label: 'Language' },
        ],
    },
    {
        title: 'Verification',
        items: [
            { icon: 'checkmark-circle-outline', label: 'Verify Identity', route: '/verification/start' },
            { icon: 'link-outline', label: 'Connected Accounts' },
        ],
    },
    {
        title: 'Support',
        items: [
            { icon: 'help-circle-outline', label: 'Help Center' },
            { icon: 'chatbubble-outline', label: 'Give Feedback', route: '/feedback' },
            { icon: 'document-text-outline', label: 'Terms & Policies' },
        ],
    },
    {
        title: 'Account Actions',
        items: [
            { icon: 'log-out-outline', label: 'Log Out', danger: true },
        ],
    },
];

export default function SettingsScreen() {
    const router = useRouter();

    const handlePress = (item: SettingItem) => {
        if (item.route) {
            router.push(item.route as any);
        } else if (item.label === 'Log Out') {
            alert('Logging out...');
        } else {
            alert(`${item.label} - Coming soon!`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {settingsSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionCard}>
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    style={[
                                        styles.row,
                                        itemIndex < section.items.length - 1 && styles.rowBorder,
                                    ]}
                                    onPress={() => handlePress(item)}
                                >
                                    <View style={styles.rowLeft}>
                                        <Ionicons
                                            name={item.icon}
                                            size={20}
                                            color={item.danger ? '#EF4444' : Colors.text.secondary}
                                        />
                                        <Text style={[styles.rowLabel, item.danger && styles.dangerText]}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <Text style={styles.version}>Nomad v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    list: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 8,
        paddingLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowLabel: {
        fontSize: 15,
        color: Colors.text.primary,
    },
    dangerText: {
        color: '#EF4444',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 16,
    },
});
