import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../design/colors';
import { Collaborator } from '../../store/tripBoardStore';

interface Props {
    collaborators: Collaborator[];
    onAdd?: () => void;
}

export const CollaboratorGroup = ({ collaborators, onAdd }: Props) => {
    return (
        <View style={styles.container}>
            {collaborators.map((user, index) => (
                <View key={user.id} style={[styles.avatarContainer, { zIndex: collaborators.length - index, transform: [{ translateX: -10 * index }] }]}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                </View>
            ))}

            {/* Add Button */}
            {onAdd && (
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        { zIndex: 0, transform: [{ translateX: -10 * collaborators.length }] }
                    ]}
                    onPress={onAdd}
                >
                    <Ionicons name="add" size={16} color="#FFF" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10, // content inset
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#FFF',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E2E8F0',
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary.main,
        borderWidth: 2,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
