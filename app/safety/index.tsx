import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { ContactItem } from '../../src/components/safety/ContactItem';
import { SignalButton } from '../../src/components/safety/SignalButton';
import { Colors } from '../../src/design/colors';
import { useSafetyStore } from '../../src/store/safetyStore';

export default function SafetyScreen() {
    const router = useRouter();
    const {
        isSharingLocation,
        toggleLocation,
        emergencyContacts,
        alertStatus,
        countdown,
        startAlertFlow,
        cancelAlert,
        tickCountdown,
        removeContact
    } = useSafetyStore();

    // Effect for countdown logic
    useEffect(() => {
        let interval: any;
        if (alertStatus === 'countdown') {
            interval = setInterval(() => {
                tickCountdown();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [alertStatus, tickCountdown]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Safety Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Status Card */}
                <View style={[
                    styles.statusCard,
                    alertStatus === 'active' ? styles.statusActive : styles.statusSafe
                ]}>
                    <Ionicons
                        name={alertStatus === 'active' ? "warning" : "shield-checkmark"}
                        size={24}
                        color={alertStatus === 'active' ? "#EF4444" : Colors.status.success}
                    />
                    <Text style={[
                        styles.statusText,
                        alertStatus === 'active' ? styles.textActive : styles.textSafe
                    ]}>
                        {alertStatus === 'active' ? 'ALERT ACTIVE' : 'YOU ARE SAFE'}
                    </Text>
                </View>

                {/* Main Signal Button */}
                <SignalButton
                    status={alertStatus}
                    onPress={alertStatus === 'idle' ? startAlertFlow : () => { }}
                    countdownValue={countdown}
                />

                {/* Cancel Button (Visible during Countdown/Active) */}
                {alertStatus !== 'idle' && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={cancelAlert}>
                        <Text style={styles.cancelText}>CANCEL ALERT</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.divider} />

                {/* Location Sharing */}
                <View style={styles.sectionRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionTitle}>Share Live Location</Text>
                        <Text style={styles.sectionDesc}>
                            Visible to your added trusted contacts.
                        </Text>
                    </View>
                    <Switch
                        value={isSharingLocation}
                        onValueChange={toggleLocation}
                        trackColor={{ false: '#E2E8F0', true: Colors.primary.main }}
                    />
                </View>

                <View style={styles.divider} />

                {/* Contacts List */}
                <View style={styles.contactsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trusted Contacts</Text>
                        <TouchableOpacity>
                            <Text style={styles.addText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    {emergencyContacts.map(contact => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            onRemove={() => removeContact(contact.id)}
                        />
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
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
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    content: {
        padding: 20,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 8,
        marginBottom: 20,
    },
    statusSafe: {
        backgroundColor: '#F0FDF4', // Light green
    },
    statusActive: {
        backgroundColor: '#FEF2F2', // Light red
    },
    statusText: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    textSafe: {
        color: Colors.status.success,
    },
    textActive: {
        color: '#EF4444',
    },
    cancelBtn: {
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        marginBottom: 32,
    },
    cancelText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.secondary,
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 20,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 13,
        color: Colors.text.secondary,
        maxWidth: '90%',
    },
    contactsSection: {},
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary.main,
    },
});
