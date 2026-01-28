import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../src/design/colors';
import { useVerificationStore } from '../../src/store/verificationStore';

const { width } = Dimensions.get('window');

export default function ScanIdScreen() {
    const router = useRouter();
    const { startIdScan, idScanResult } = useVerificationStore();

    useEffect(() => {
        // Start scan on mount
        startIdScan().then(() => {
            // Navigate back on success
            setTimeout(() => {
                router.back();
            }, 800);
        });
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Scanning ID...</Text>
                    </View>

                    <View style={styles.cameraFrame}>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />

                        {idScanResult === 'success' ? (
                            <View style={styles.successOverlay}>
                                <ActivityIndicator size="large" color={Colors.status.success} />
                                <Text style={styles.statusText}>Verified!</Text>
                            </View>
                        ) : (
                            <View style={styles.scanLine} />
                        )}

                        <Text style={styles.instruction}>
                            Align your ID card within the frame
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <ActivityIndicator color="#FFF" style={{ marginBottom: 12 }} />
                        <Text style={styles.footerText}>Processing secure verification...</Text>
                    </View>
                </SafeAreaView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    header: {
        marginTop: 20,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    cameraFrame: {
        width: width - 60,
        height: (width - 60) * 0.63, // ID card aspect ratio
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 16,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    instruction: {
        position: 'absolute',
        bottom: -60,
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
    },
    // Scan corners
    cornerTL: { position: 'absolute', top: -2, left: -2, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: Colors.primary.main, borderTopLeftRadius: 16 },
    cornerTR: { position: 'absolute', top: -2, right: -2, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: Colors.primary.main, borderTopRightRadius: 16 },
    cornerBL: { position: 'absolute', bottom: -2, left: -2, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: Colors.primary.main, borderBottomLeftRadius: 16 },
    cornerBR: { position: 'absolute', bottom: -2, right: -2, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: Colors.primary.main, borderBottomRightRadius: 16 },

    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: Colors.primary.light,
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
        opacity: 0.8,
    },
    successOverlay: {
        alignItems: 'center',
    },
    statusText: {
        color: Colors.status.success,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12,
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
});
