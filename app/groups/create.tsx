/**
 * Create Group Page
 * Step-by-step flow to create a new group
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../src/design/colors';
import { useGroupsStore } from '../../src/store/groupsStore';
import { GroupPrivacy, GroupType } from '../../src/types/groups';

const GROUP_TYPES = [
    { type: 'trip' as GroupType, icon: 'airplane', label: 'Trip Squad', desc: 'Travel together', color: '#F59E0B', bg: '#FEF3C7' },
    { type: 'city' as GroupType, icon: 'location', label: 'City Circle', desc: 'Local community', color: '#3B82F6', bg: '#DBEAFE' },
    { type: 'interest' as GroupType, icon: 'heart', label: 'Interest Tribe', desc: 'Shared passion', color: '#EC4899', bg: '#FCE7F3' },
    { type: 'private' as GroupType, icon: 'lock-closed', label: 'Private Crew', desc: 'Invite only', color: '#6B7280', bg: '#F3F4F6' },
];

const PRIVACY_OPTIONS = [
    { value: 'public' as GroupPrivacy, label: 'Public', desc: 'Anyone can join', icon: 'globe-outline' },
    { value: 'request' as GroupPrivacy, label: 'Request', desc: 'Approve new members', icon: 'hand-left-outline' },
    { value: 'invite' as GroupPrivacy, label: 'Invite Only', desc: 'Members must be invited', icon: 'lock-closed-outline' },
];

export default function CreateGroupScreen() {
    const router = useRouter();
    const { createGroup } = useGroupsStore();

    const [step, setStep] = useState(1);
    const [groupType, setGroupType] = useState<GroupType>('trip');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [destination, setDestination] = useState('');
    const [startDateString, setStartDateString] = useState('');
    const [endDateString, setEndDateString] = useState('');
    const [privacy, setPrivacy] = useState<GroupPrivacy>('request');

    const selectedType = GROUP_TYPES.find((t) => t.type === groupType);

    const handleCreate = () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter a group name');
            return;
        }

        // Parse dates for trip groups
        let startDate: Date | undefined;
        let endDate: Date | undefined;
        if (groupType === 'trip' && startDateString) {
            startDate = new Date(startDateString);
            if (endDateString) {
                endDate = new Date(endDateString);
            }
        }

        const groupId = createGroup({
            name: name.trim(),
            type: groupType,
            emoji: selectedType?.icon === 'airplane' ? '🎒' : selectedType?.icon === 'location' ? '🏙️' : selectedType?.icon === 'heart' ? '🎯' : '🔒',
            description: description.trim() || `A ${selectedType?.label} for travelers`,
            destination: destination || undefined,
            startDate,
            endDate,
            privacy,
            createdBy: 'current-user',
        });

        router.replace(`/groups/${groupId}`);
    };

    const canProceed = () => {
        if (step === 1) return true;
        if (step === 2) return name.trim().length >= 3;
        return true;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={styles.backBtn}>
                    <Ionicons name={step > 1 ? 'arrow-back' : 'close'} size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Group</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Progress */}
            <View style={styles.progress}>
                {[1, 2, 3].map((s) => (
                    <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive]} />
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <>
                        <Text style={styles.stepTitle}>What kind of group?</Text>
                        <Text style={styles.stepDesc}>Choose the type that best fits your group</Text>

                        <View style={styles.typeGrid}>
                            {GROUP_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type.type}
                                    style={[
                                        styles.typeCard,
                                        groupType === type.type && styles.typeCardSelected,
                                        groupType === type.type && { borderColor: type.color },
                                    ]}
                                    onPress={() => setGroupType(type.type)}
                                >
                                    <View style={[styles.typeIcon, { backgroundColor: type.bg }]}>
                                        <Ionicons name={type.icon as any} size={28} color={type.color} />
                                    </View>
                                    <Text style={styles.typeLabel}>{type.label}</Text>
                                    <Text style={styles.typeDesc}>{type.desc}</Text>
                                    {groupType === type.type && (
                                        <View style={[styles.checkBadge, { backgroundColor: type.color }]}>
                                            <Ionicons name="checkmark" size={14} color="#FFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text style={styles.stepTitle}>Group details</Text>
                        <Text style={styles.stepDesc}>Give your group a name and description</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Lisbon Dec Crew 🇵🇹"
                                placeholderTextColor={Colors.text.muted}
                                value={name}
                                onChangeText={setName}
                                maxLength={50}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="What's this group about?"
                                placeholderTextColor={Colors.text.muted}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                maxLength={200}
                            />
                        </View>

                        {(groupType === 'trip' || groupType === 'city') && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Destination</Text>
                                <View style={styles.inputWithIcon}>
                                    <Ionicons name="location-outline" size={18} color={Colors.text.muted} />
                                    <TextInput
                                        style={styles.inputInner}
                                        placeholder="e.g. Lisbon, Portugal"
                                        placeholderTextColor={Colors.text.muted}
                                        value={destination}
                                        onChangeText={setDestination}
                                    />
                                </View>
                            </View>
                        )}

                        {groupType === 'trip' && (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Trip Dates (optional)</Text>
                                    <View style={styles.dateRow}>
                                        <View style={[styles.inputWithIcon, { flex: 1 }]}>
                                            <Ionicons name="calendar-outline" size={18} color={Colors.text.muted} />
                                            <TextInput
                                                style={styles.inputInner}
                                                placeholder="Start (Dec 10, 2024)"
                                                placeholderTextColor={Colors.text.muted}
                                                value={startDateString}
                                                onChangeText={setStartDateString}
                                            />
                                        </View>
                                        <Text style={styles.dateSeparator}>→</Text>
                                        <View style={[styles.inputWithIcon, { flex: 1 }]}>
                                            <Ionicons name="calendar-outline" size={18} color={Colors.text.muted} />
                                            <TextInput
                                                style={styles.inputInner}
                                                placeholder="End (Dec 24, 2024)"
                                                placeholderTextColor={Colors.text.muted}
                                                value={endDateString}
                                                onChangeText={setEndDateString}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </>
                        )}
                    </>
                )}

                {step === 3 && (
                    <>
                        <Text style={styles.stepTitle}>Privacy settings</Text>
                        <Text style={styles.stepDesc}>Who can join your group?</Text>

                        <View style={styles.privacyOptions}>
                            {PRIVACY_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.privacyCard,
                                        privacy === option.value && styles.privacyCardSelected,
                                    ]}
                                    onPress={() => setPrivacy(option.value)}
                                >
                                    <View style={styles.privacyLeft}>
                                        <View style={[styles.privacyRadio, privacy === option.value && styles.privacyRadioSelected]}>
                                            {privacy === option.value && <View style={styles.privacyRadioDot} />}
                                        </View>
                                        <View>
                                            <Text style={styles.privacyLabel}>{option.label}</Text>
                                            <Text style={styles.privacyDesc}>{option.desc}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name={option.icon as any} size={20} color={Colors.text.muted} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Preview */}
                        <View style={styles.preview}>
                            <Text style={styles.previewTitle}>Preview</Text>
                            <View style={styles.previewCard}>
                                <View style={[styles.previewIcon, { backgroundColor: selectedType?.bg }]}>
                                    <Ionicons name={selectedType?.icon as any} size={24} color={selectedType?.color} />
                                </View>
                                <View style={styles.previewInfo}>
                                    <Text style={styles.previewName}>{name || 'Group Name'}</Text>
                                    <Text style={styles.previewMeta}>
                                        {selectedType?.label} • {privacy === 'public' ? 'Public' : privacy === 'request' ? 'Request to join' : 'Invite only'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Bottom Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
                    onPress={() => step < 3 ? setStep(step + 1) : handleCreate()}
                    disabled={!canProceed()}
                >
                    <Text style={styles.nextBtnText}>
                        {step < 3 ? 'Continue' : 'Create Group'}
                    </Text>
                    <Ionicons name={step < 3 ? 'arrow-forward' : 'checkmark'} size={18} color="#FFF" />
                </TouchableOpacity>
            </View>
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
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    progress: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        backgroundColor: '#FFF',
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E2E8F0',
    },
    progressDotActive: {
        backgroundColor: Colors.primary.main,
        width: 24,
    },
    content: {
        padding: 20,
        paddingBottom: 120,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    stepDesc: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 24,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeCard: {
        width: '47%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    typeCardSelected: {
        borderWidth: 2,
    },
    typeIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    typeLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    typeDesc: {
        fontSize: 11,
        color: Colors.text.muted,
        marginTop: 2,
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: Colors.text.primary,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        gap: 10,
    },
    inputInner: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: Colors.text.primary,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateSeparator: {
        fontSize: 16,
        color: Colors.text.muted,
    },
    privacyOptions: {
        gap: 12,
    },
    privacyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    privacyCardSelected: {
        borderColor: Colors.primary.main,
        backgroundColor: '#F0FDFA',
    },
    privacyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    privacyRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    privacyRadioSelected: {
        borderColor: Colors.primary.main,
    },
    privacyRadioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary.main,
    },
    privacyLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    privacyDesc: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    preview: {
        marginTop: 32,
    },
    previewTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    previewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
    },
    previewIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    previewInfo: {
        flex: 1,
    },
    previewName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    previewMeta: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary.main,
        paddingVertical: 16,
        borderRadius: 14,
    },
    nextBtnDisabled: {
        backgroundColor: '#CBD5E1',
    },
    nextBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});
