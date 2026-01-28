import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../design/colors';

interface Props {
    text: string;
    isMe: boolean;
    timestamp: Date;
}

export const MessageBubble = ({ text, isMe, timestamp }: Props) => {
    return (
        <View style={[styles.container, isMe ? styles.meContainer : styles.otherContainer]}>
            <View style={[styles.bubble, isMe ? styles.meBubble : styles.otherBubble]}>
                <Text style={[styles.text, isMe ? styles.meText : styles.otherText]}>{text}</Text>
            </View>
            <Text style={styles.time}>
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        marginBottom: 12,
    },
    meContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    otherContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    meBubble: {
        backgroundColor: Colors.primary.main,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#F1F5F9', // light gray
        borderBottomLeftRadius: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 20,
    },
    meText: {
        color: '#FFF',
    },
    otherText: {
        color: Colors.text.primary,
    },
    time: {
        fontSize: 10,
        color: Colors.text.muted,
        marginTop: 4,
        marginHorizontal: 4,
    },
});
