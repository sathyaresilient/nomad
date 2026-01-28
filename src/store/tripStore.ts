/**
 * Trip Store
 * Manages user trips with real API
 */

import { create } from 'zustand';
import { Trip as APITrip, TripsAPI } from '../lib/api';
import type { TravelerMatch } from '../types';

// Use the API Trip type for consistency with backend responses
type Trip = APITrip;

interface TripState {
    myTrips: Trip[];
    matches: TravelerMatch[];
    selectedTrip: Trip | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadMyTrips: () => Promise<void>;
    loadMatches: (tripId: string) => Promise<void>;
    createTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
    selectTrip: (trip: Trip | null) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
    myTrips: [],
    matches: [],
    selectedTrip: null,
    isLoading: false,
    error: null,

    loadMyTrips: async () => {
        set({ isLoading: true, error: null });

        const result = await TripsAPI.list();

        if (result.error) {
            set({ isLoading: false, error: result.error });
            return;
        }

        const trips = (result.data || []) as Trip[];
        set({ myTrips: trips, isLoading: false });

        // Auto-select active trip
        const activeTrip = trips.find(t => t.status === 'active');
        if (activeTrip) {
            set({ selectedTrip: activeTrip });
            get().loadMatches(activeTrip.id);
        }
    },

    loadMatches: async (tripId: string) => {
        set({ isLoading: true });

        const result = await TripsAPI.getMatches(tripId);

        if (result.error) {
            set({ matches: [], isLoading: false });
            return;
        }

        const matches = (result.data?.matches || []) as TravelerMatch[];
        set({ matches, isLoading: false });
    },

    createTrip: async (tripData) => {
        set({ isLoading: true, error: null });

        const result = await TripsAPI.create({
            city: tripData.city,
            country: tripData.country,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            status: tripData.status || 'planned',
            openTo: tripData.openTo || [],
        });

        if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
        }

        if (result.data) {
            set(state => ({
                myTrips: [...state.myTrips, result.data as Trip],
                isLoading: false,
            }));
            return true;
        }

        set({ isLoading: false });
        return false;
    },

    selectTrip: (trip) => {
        set({ selectedTrip: trip });
        if (trip) {
            get().loadMatches(trip.id);
        }
    },
}));
