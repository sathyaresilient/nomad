import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type StampStyle = 'circle' | 'rectangle' | 'faded';

interface VisaStampProps {
    country: string;
    city: string;
    date: string;
    style?: StampStyle;
    color?: string;
}

export const VisaStamp: React.FC<VisaStampProps> = ({
    country,
    city,
    date,
    style = 'circle',
    color = '#6B7280',
}) => {
    if (style === 'rectangle') {
        return (
            <View style={[styles.rectangleStamp, { borderColor: color }]}>
                <View style={styles.rectangleHeader}>
                    <Text style={[styles.rectangleCountry, { color }]}>{country.substring(0, 2).toUpperCase()}</Text>
                    <Text style={[styles.rectangleFlag, { backgroundColor: color }]}>{country.substring(0, 3).toUpperCase()}</Text>
                </View>
                <Text style={[styles.rectangleCity, { color }]}>{city}</Text>
                <Text style={[styles.rectangleDate, { color }]}>{date}</Text>
            </View>
        );
    }

    if (style === 'faded') {
        return (
            <View style={[styles.fadedStamp]}>
                <Text style={styles.fadedCountry}>{country}</Text>
                <Text style={styles.fadedCity}>{city}</Text>
                <Text style={styles.fadedNote}>✓ Visa</Text>
            </View>
        );
    }

    // Default: circle stamp
    return (
        <View style={[styles.circleStamp, { borderColor: color }]}>
            <Text style={[styles.stampCountry, { color }]}>{country}</Text>
            <Text style={[styles.stampDate, { color }]}>{date}</Text>
            <Text style={[styles.stampCity, { color }]}>🌴 {city}</Text>
            <Text style={[styles.stampNote, { color }]}>IMMIGRATION</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    // Circle stamp
    circleStamp: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        transform: [{ rotate: '-8deg' }],
    },
    stampCountry: {
        fontSize: 7,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    stampDate: {
        fontSize: 6,
        marginTop: 1,
    },
    stampCity: {
        fontSize: 8,
        fontWeight: '700',
        marginTop: 2,
    },
    stampNote: {
        fontSize: 5,
        marginTop: 1,
        opacity: 0.7,
    },

    // Rectangle stamp
    rectangleStamp: {
        width: 70,
        padding: 6,
        borderWidth: 2,
        borderRadius: 4,
        alignItems: 'center',
        transform: [{ rotate: '3deg' }],
    },
    rectangleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },
    rectangleCountry: {
        fontSize: 9,
        fontWeight: '800',
    },
    rectangleFlag: {
        fontSize: 6,
        color: '#FFF',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 2,
        fontWeight: '700',
    },
    rectangleCity: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    rectangleDate: {
        fontSize: 7,
        marginTop: 2,
        opacity: 0.8,
    },

    // Faded stamp
    fadedStamp: {
        width: 60,
        alignItems: 'center',
        opacity: 0.5,
        transform: [{ rotate: '5deg' }],
    },
    fadedCountry: {
        fontSize: 6,
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    fadedCity: {
        fontSize: 9,
        fontWeight: '600',
        color: '#6B7280',
    },
    fadedNote: {
        fontSize: 7,
        color: '#9CA3AF',
        marginTop: 2,
    },
});
