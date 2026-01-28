import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { EmergencyContact } from '../../store/safetyStore';

interface Props {
    contact: EmergencyContact;
    onRemove: () => void;
}

export const ContactItem = ({ contact, onRemove }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <View style={styles.avatar}>
                    <Text style={styles.initial}>{contact.name[0]}</Text>
                </View>
                <View>
                    <Text style={styles.name}>{contact.name}</Text>
                    <Text style={styles.relation}>{contact.relation} • {contact.phone}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initial: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.secondary,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    relation: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    removeBtn: {
        padding: 8,
    },
});
