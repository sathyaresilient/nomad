import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { mockUsers } from '../../data/mockUsers';

const { width } = Dimensions.get('window');
const PASSPORT_WIDTH = width * 0.85;
const ASPECT_RATIO = 1.4; // Height / Width

export const PassportPage = () => {
    const user = mockUsers[0]; // Alex

    return (
        <View style={styles.container}>
            {/* Background Texture Simulation */}
            <View style={styles.texture}>
                <View style={styles.guillocheCircle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.republicText}>REPUBLIC OF ROAMLY</Text>
                    <Text style={styles.subHeaderText}>NOMAD PASS • TRUST DOCUMENT</Text>
                    <View style={styles.headerLine} />
                </View>
                <View style={styles.shieldIcon}>
                    <Ionicons name="shield-checkmark" size={20} color="#1E293B" />
                </View>
            </View>

            {/* Identity Section */}
            <View style={styles.identityRow}>
                <View style={styles.photoContainer}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.photo} />
                    {/* Overlay Stamp */}
                    <View style={styles.verifiedStamp}>
                        <Text style={styles.stampTextRing}>VERIFIED • ROAMLY SECURE •</Text>
                    </View>
                </View>

                <View style={styles.detailsCol}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>SURNAME / NOM</Text>
                        <Text style={styles.fieldValue}>ROAMER</Text>
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>GIVEN NAMES / PRÉNOMS</Text>
                        <Text style={styles.fieldValue}>{user.displayName.toUpperCase()}</Text>
                    </View>
                    <View style={styles.rowDetails}>
                        <View>
                            <Text style={styles.fieldLabel}>ISSUE DATE</Text>
                            <Text style={styles.fieldValue}>12 OCT 23</Text>
                        </View>
                        <View>
                            <Text style={styles.fieldLabel}>ID NO.</Text>
                            <Text style={styles.fieldValue}>RM-8821</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Trust Score */}
            <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>GLOBAL REPUTATION SCORE</Text>
                <View style={styles.scoreValueRow}>
                    <Text style={styles.scoreBig}>98</Text>
                    <Text style={styles.scoreTotal}> / 100</Text>
                </View>
            </View>

            {/* Visas / Stamps */}
            <View style={styles.visasSection}>
                <Text style={styles.visasLabel}>VISAS & ENDORSEMENTS</Text>
                <View style={styles.stampsGrid}>
                    <View style={[styles.stamp, styles.stampGreen, { transform: [{ rotate: '-12deg' }] }]}>
                        <Text style={[styles.stampText, { color: '#064E3B' }]}>INDONESIA</Text>
                        <Text style={[styles.stampDate, { color: '#064E3B' }]}>14 FEB 24</Text>
                        <Ionicons name="airplane" size={12} color="#064E3B" />
                        <Text style={[styles.stampSmall, { color: '#064E3B' }]}>BALI IMMIGRATION</Text>
                    </View>

                    <View style={[styles.stamp, styles.stampRed, { transform: [{ rotate: '8deg' }] }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <Text style={[styles.stampSmall, { color: '#7F1D1D' }]}>EU</Text>
                            <Text style={[styles.stampSmall, { color: '#7F1D1D' }]}>PRT</Text>
                        </View>
                        <Text style={[styles.stampText, { color: '#7F1D1D', fontSize: 10 }]}>LISBON</Text>
                        <Text style={[styles.stampDate, { color: '#7F1D1D' }]}>ENTRY 2023</Text>
                    </View>

                    <View style={[styles.stamp, styles.stampGold, { transform: [{ rotate: '-5deg' }], borderRadius: 20 }]}>
                        <Text style={[styles.stampSmall, { color: '#92400E' }]}>COLOMBIA</Text>
                        <Ionicons name="leaf" size={10} color="#92400E" />
                        <Text style={[styles.stampText, { color: '#92400E', fontSize: 8 }]}>MEDELLIN</Text>
                    </View>

                    <View style={[styles.stamp, styles.stampBlue, { transform: [{ rotate: '4deg' }], width: 60, height: 60, borderRadius: 2 }]}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#1E3A8A' }} />
                        <Text style={[styles.stampText, { color: '#1E3A8A', fontSize: 8 }]}>KYOTO</Text>
                        <Text style={[styles.stampSmall, { color: '#1E3A8A' }]}>JP-EXIT</Text>
                    </View>
                </View>
            </View>

            {/* Machine Readable Zone */}
            <View style={styles.mrzSection}>
                <Text style={styles.mrzText}>P&lt;ROAMSMITH&lt;&lt;ALEXANDER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</Text>
                <Text style={styles.mrzText}>RM8821XJ4ROAM8510123M2810123&lt;&lt;&lt;&lt;&lt;&lt;98</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: PASSPORT_WIDTH,
        minHeight: PASSPORT_WIDTH * ASPECT_RATIO,
        backgroundColor: '#FDFBF7', // Cream/Passport paper color
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    texture: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
    },
    guillocheCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 20,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    republicText: {
        fontFamily: 'Times New Roman', // System serif
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        color: '#334155',
        marginBottom: 4,
    },
    subHeaderText: {
        fontSize: 8,
        letterSpacing: 1,
        color: '#64748B',
        marginBottom: 8,
    },
    headerLine: {
        height: 1,
        backgroundColor: '#CBD5E1',
        width: '100%',
    },
    shieldIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    identityRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    photoContainer: {
        marginRight: 16,
        position: 'relative',
    },
    photo: {
        width: 80,
        height: 100,
        borderRadius: 4,
        backgroundColor: '#E2E8F0',
    },
    verifiedStamp: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#064E3B', // Dark Green Stamp
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        transform: [{ rotate: '-15deg' }],
    },
    stampTextRing: {
        fontSize: 5,
        fontWeight: '700',
        color: '#064E3B',
        textAlign: 'center',
    },
    detailsCol: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    fieldGroup: {
        marginBottom: 8,
    },
    fieldLabel: {
        fontSize: 7,
        color: '#94A3B8',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    fieldValue: {
        fontFamily: 'Courier',
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: 0.5,
    },
    rowDetails: {
        flexDirection: 'row',
        gap: 24,
    },
    scoreSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        paddingVertical: 8,
        borderStyle: 'dashed',
    },
    scoreLabel: {
        fontFamily: 'Times New Roman',
        color: '#475569',
        fontSize: 10,
        letterSpacing: 1,
    },
    scoreValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    scoreBig: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    scoreTotal: {
        fontSize: 12,
        color: '#64748B',
    },
    visasSection: {
        flex: 1,
    },
    visasLabel: {
        alignSelf: 'center',
        fontSize: 8,
        color: '#94A3B8',
        letterSpacing: 2,
        marginBottom: 16,
    },
    stampsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 12,
    },
    stamp: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        width: 70,
        height: 70,
    },
    stampGreen: {
        borderColor: '#064E3B',
        borderRadius: 35,
        borderStyle: 'solid',
    },
    stampRed: {
        borderColor: '#7F1D1D',
        borderRadius: 4,
    },
    stampGold: {
        borderColor: '#92400E',
        borderRadius: 20, // Oval
        width: 80,
        height: 50,
    },
    stampBlue: {
        borderColor: '#1E3A8A',
    },
    stampText: {
        fontSize: 9,
        fontWeight: '700',
        marginVertical: 2,
    },
    stampDate: {
        fontSize: 6,
        fontWeight: '600',
    },
    stampSmall: {
        fontSize: 5,
        fontWeight: '500',
    },
    mrzSection: {
        marginTop: 24,
        opacity: 0.6,
    },
    mrzText: {
        fontFamily: 'Courier',
        fontSize: 12,
        color: '#334155',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: 4,
    },
});
