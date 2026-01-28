import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../design/colors';
import { BoardNote } from '../../store/tripBoardStore';

interface Props {
    note: BoardNote;
}

const BG_COLORS = {
    yellow: '#FEF9C3', // Light yellow
    blue: '#E0F2FE',   // Light blue
    green: '#DCFCE7',  // Light green
    pink: '#FCE7F3',   // Light pink
};

const ACCENT_COLORS = {
    yellow: '#FACC15',
    blue: '#38BDF8',
    green: '#4ADE80',
    pink: '#F472B6',
};

export const StickyNote = ({ note }: Props) => {
    const bgColor = BG_COLORS[note.color] || BG_COLORS.yellow;
    const accentColor = ACCENT_COLORS[note.color] || ACCENT_COLORS.yellow;

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={[styles.pin, { backgroundColor: accentColor }]} />

            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
            </View>

            <Text style={styles.content}>{note.content}</Text>

            <View style={styles.footer}>
                <View style={styles.author}>
                    {note.authorValues.avatarUrl ? (
                        <Image source={{ uri: note.authorValues.avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: Colors.primary.light }]} />
                    )}
                    <Text style={styles.timeAgo}>{note.timeAgo}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16, // Softer corners
        marginBottom: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        position: 'relative',
        marginTop: 8, // For pin space
    },
    pin: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        top: -6,
        left: '50%',
        marginLeft: -6,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    header: {
        marginBottom: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    content: {
        fontSize: 13,
        color: Colors.text.primary,
        lineHeight: 19, // specific line height for readability
        fontFamily: 'System', // Could use handwritten font if available
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    author: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E2E8F0',
    },
    timeAgo: {
        fontSize: 11,
        color: Colors.text.secondary,
    }
});
