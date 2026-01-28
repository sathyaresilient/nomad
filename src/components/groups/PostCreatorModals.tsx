/**
 * Post Creation Modals
 * Modals for creating polls, events, and location pins
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../design/colors';

// ==================== POLL CREATOR ====================
interface PollCreatorProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (question: string, options: string[]) => void;
}

export const PollCreator: React.FC<PollCreatorProps> = ({ visible, onClose, onSubmit }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, text: string) => {
        const newOptions = [...options];
        newOptions[index] = text;
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        if (!question.trim()) {
            Alert.alert('Error', 'Please enter a question');
            return;
        }
        const validOptions = options.filter((o) => o.trim());
        if (validOptions.length < 2) {
            Alert.alert('Error', 'Please add at least 2 options');
            return;
        }
        onSubmit(question.trim(), validOptions);
        setQuestion('');
        setOptions(['', '']);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Create Poll</Text>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.submitText}>Post</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Question</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask a question..."
                            placeholderTextColor={Colors.text.muted}
                            value={question}
                            onChangeText={setQuestion}
                            multiline
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Options</Text>
                        {options.map((option, index) => (
                            <View key={index} style={styles.optionRow}>
                                <View style={styles.optionNumber}>
                                    <Text style={styles.optionNumberText}>{index + 1}</Text>
                                </View>
                                <TextInput
                                    style={styles.optionInput}
                                    placeholder={`Option ${index + 1}`}
                                    placeholderTextColor={Colors.text.muted}
                                    value={option}
                                    onChangeText={(text) => updateOption(index, text)}
                                />
                                {options.length > 2 && (
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => removeOption(index)}
                                    >
                                        <Ionicons name="close-circle" size={22} color={Colors.text.muted} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        {options.length < 6 && (
                            <TouchableOpacity style={styles.addOptionBtn} onPress={addOption}>
                                <Ionicons name="add-circle-outline" size={20} color={Colors.primary.main} />
                                <Text style={styles.addOptionText}>Add Option</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// ==================== EVENT CREATOR ====================
interface EventCreatorProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (title: string, date: Date, location: string, description: string) => void;
}

export const EventCreator: React.FC<EventCreatorProps> = ({ visible, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [dateString, setDateString] = useState('');
    const [timeString, setTimeString] = useState('');

    const handleSubmit = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter an event title');
            return;
        }
        if (!dateString.trim()) {
            Alert.alert('Error', 'Please enter a date (e.g., Jan 15, 2025)');
            return;
        }

        // Parse date and time
        const dateTime = new Date(`${dateString} ${timeString || '12:00'}`);
        if (isNaN(dateTime.getTime())) {
            Alert.alert('Error', 'Invalid date format. Try: Jan 15, 2025');
            return;
        }

        onSubmit(title.trim(), dateTime, location.trim(), description.trim());
        setTitle('');
        setDescription('');
        setLocation('');
        setDateString('');
        setTimeString('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Create Event</Text>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.submitText}>Post</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Event Title</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="What's happening?"
                            placeholderTextColor={Colors.text.muted}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date & Time</Text>
                        <View style={styles.dateTimeRow}>
                            <TextInput
                                style={[styles.textInput, { flex: 2 }]}
                                placeholder="Jan 15, 2025"
                                placeholderTextColor={Colors.text.muted}
                                value={dateString}
                                onChangeText={setDateString}
                            />
                            <TextInput
                                style={[styles.textInput, { flex: 1, marginLeft: 8 }]}
                                placeholder="7:00 PM"
                                placeholderTextColor={Colors.text.muted}
                                value={timeString}
                                onChangeText={setTimeString}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.locationInput}>
                            <Ionicons name="location-outline" size={18} color={Colors.text.muted} />
                            <TextInput
                                style={styles.locationTextInput}
                                placeholder="Add a location"
                                placeholderTextColor={Colors.text.muted}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description (optional)</Text>
                        <TextInput
                            style={[styles.textInput, { minHeight: 80 }]}
                            placeholder="Add details about the event..."
                            placeholderTextColor={Colors.text.muted}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// ==================== LOCATION PIN CREATOR ====================
interface LocationPinCreatorProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (name: string, address: string, latitude: number, longitude: number, note: string) => void;
}

// Common locations for quick selection
const QUICK_LOCATIONS = [
    { name: 'Café', icon: 'cafe', lat: 0, lng: 0 },
    { name: 'Restaurant', icon: 'restaurant', lat: 0, lng: 0 },
    { name: 'Coworking', icon: 'laptop', lat: 0, lng: 0 },
    { name: 'Beach', icon: 'sunny', lat: 0, lng: 0 },
    { name: 'Bar', icon: 'beer', lat: 0, lng: 0 },
    { name: 'Viewpoint', icon: 'eye', lat: 0, lng: 0 },
];

export const LocationPinCreator: React.FC<LocationPinCreatorProps> = ({ visible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a place name');
            return;
        }

        // Mock coordinates - in production would use actual geocoding
        const latitude = 38.7223 + Math.random() * 0.01;
        const longitude = -9.1393 + Math.random() * 0.01;

        onSubmit(name.trim(), address.trim(), latitude, longitude, note.trim());
        setName('');
        setAddress('');
        setNote('');
        setSelectedType(null);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Pin a Location</Text>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.submitText}>Post</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Place Category</Text>
                        <View style={styles.quickLocations}>
                            {QUICK_LOCATIONS.map((loc) => (
                                <TouchableOpacity
                                    key={loc.name}
                                    style={[
                                        styles.quickLocationBtn,
                                        selectedType === loc.name && styles.quickLocationBtnActive,
                                    ]}
                                    onPress={() => setSelectedType(loc.name)}
                                >
                                    <Ionicons
                                        name={loc.icon as any}
                                        size={20}
                                        color={selectedType === loc.name ? '#FFF' : Colors.text.secondary}
                                    />
                                    <Text
                                        style={[
                                            styles.quickLocationText,
                                            selectedType === loc.name && styles.quickLocationTextActive,
                                        ]}
                                    >
                                        {loc.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Place Name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="e.g., The Mill Coffee Shop"
                            placeholderTextColor={Colors.text.muted}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <View style={styles.locationInput}>
                            <Ionicons name="location-outline" size={18} color={Colors.text.muted} />
                            <TextInput
                                style={styles.locationTextInput}
                                placeholder="Search or enter address"
                                placeholderTextColor={Colors.text.muted}
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Note (optional)</Text>
                        <TextInput
                            style={[styles.textInput, { minHeight: 60 }]}
                            placeholder="Why is this place great?"
                            placeholderTextColor={Colors.text.muted}
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    cancelText: {
        fontSize: 15,
        color: Colors.text.secondary,
    },
    submitText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary.main,
    },
    modalContent: {
        flex: 1,
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: Colors.text.primary,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary.light,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    optionNumberText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary.main,
    },
    optionInput: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: Colors.text.primary,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    removeBtn: {
        marginLeft: 8,
    },
    addOptionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primary.main,
        borderStyle: 'dashed',
    },
    addOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary.main,
    },
    dateTimeRow: {
        flexDirection: 'row',
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    locationTextInput: {
        flex: 1,
        padding: 14,
        fontSize: 15,
        color: Colors.text.primary,
    },
    quickLocations: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    quickLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
    },
    quickLocationBtnActive: {
        backgroundColor: Colors.primary.main,
    },
    quickLocationText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    quickLocationTextActive: {
        color: '#FFF',
    },
});
