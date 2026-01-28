/**
 * Mock Data - Trips
 * Sample trip intents for development
 */

import type { Trip } from '../types';
import { mockUsers } from './mockUsers';

// Helper to create dates relative to today
const daysFromNow = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

export const mockTrips: Trip[] = [
    {
        id: '1',
        userId: '1', // Alex Rivera (current user)
        user: mockUsers[0],
        city: 'Lisbon',
        country: 'Portugal',
        startDate: daysFromNow(-2),
        endDate: daysFromNow(12),
        status: 'active',
        openTo: ['meetups', 'coTravel'],
        notes: 'Working from cafes and exploring the city. Looking for coffee buddies!',
        createdAt: daysFromNow(-10),
        updatedAt: daysFromNow(-2),
    },
    {
        id: '2',
        userId: '2', // Maya Chen
        user: mockUsers[1],
        city: 'Lisbon',
        country: 'Portugal',
        startDate: daysFromNow(0),
        endDate: daysFromNow(14),
        status: 'active',
        openTo: ['meetups', 'coLiving'],
        notes: 'Exploring the design scene in Lisbon',
        createdAt: daysFromNow(-5),
        updatedAt: daysFromNow(0),
    },
    {
        id: '3',
        userId: '3', // Marcus Johnson
        user: mockUsers[2],
        city: 'Lisbon',
        country: 'Portugal',
        startDate: daysFromNow(3),
        endDate: daysFromNow(10),
        status: 'planning',
        openTo: ['meetups', 'coTravel'],
        notes: 'Planning some hiking in Sintra, anyone interested?',
        createdAt: daysFromNow(-3),
        updatedAt: daysFromNow(-1),
    },
    {
        id: '4',
        userId: '4', // Emma Wilson
        user: mockUsers[3],
        city: 'Lisbon',
        country: 'Portugal',
        startDate: daysFromNow(1),
        endDate: daysFromNow(20),
        status: 'active',
        openTo: ['meetups'],
        notes: 'Teaching yoga in the mornings, free afternoons',
        createdAt: daysFromNow(-7),
        updatedAt: daysFromNow(1),
    },
    {
        id: '5',
        userId: '5', // Kai Tanaka
        user: mockUsers[4],
        city: 'Barcelona',
        country: 'Spain',
        startDate: daysFromNow(5),
        endDate: daysFromNow(15),
        status: 'planning',
        openTo: ['meetups', 'coTravel', 'coLiving'],
        notes: 'First time in Barcelona! Would love local tips',
        createdAt: daysFromNow(-2),
        updatedAt: daysFromNow(-1),
    },
    {
        id: '6',
        userId: '6', // Sofia Martinez
        user: mockUsers[5],
        city: 'Lisbon',
        country: 'Portugal',
        startDate: daysFromNow(-1),
        endDate: daysFromNow(8),
        status: 'active',
        openTo: ['meetups', 'coTravel'],
        notes: 'Shooting a photography project, looking for models and explorers!',
        createdAt: daysFromNow(-4),
        updatedAt: daysFromNow(-1),
    },
    // Future trip for current user
    {
        id: '7',
        userId: '1',
        user: mockUsers[0],
        city: 'Bali',
        country: 'Indonesia',
        startDate: daysFromNow(30),
        endDate: daysFromNow(60),
        status: 'planning',
        openTo: ['meetups', 'coLiving'],
        notes: 'Heading to Canggu for a month. Co-working and surfing!',
        createdAt: daysFromNow(-1),
        updatedAt: daysFromNow(-1),
    },
];

// Get trips for current user
export const getUserTrips = (userId: string): Trip[] => {
    return mockTrips.filter(t => t.userId === userId);
};

// Get matching trips in same city (excluding own)
export const getMatchingTrips = (userTrip: Trip): Trip[] => {
    return mockTrips.filter(t =>
        t.userId !== userTrip.userId &&
        t.city === userTrip.city
    );
};
