/**
 * Map Store
 * Manages map pins and location data with real API
 */

import { create } from 'zustand';
import { mockUsers } from '../data/mockUsers';
import { LocationsAPI } from '../lib/api';

export type PinType = 'user' | 'event' | 'place';

export interface MapPin {
    id: string;
    type: PinType;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
    data?: any;
    distance?: string;
    overlapDays?: number;
    badges?: string[];
}

interface MapState {
    pins: MapPin[];
    selectedPinId: string | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        showUsers: boolean;
        showGuides: boolean;
        showEvents: boolean;
    };

    // Actions
    loadNearby: (latitude: number, longitude: number) => Promise<void>;
    selectPin: (id: string | null) => void;
    toggleFilter: (filter: 'showUsers' | 'showGuides' | 'showEvents') => void;
    updateMyLocation: (latitude: number, longitude: number) => Promise<void>;
}

// Fallback mock pins
const MOCK_PINS: MapPin[] = [
    {
        id: 'p1',
        type: 'user',
        latitude: 38.7119,
        longitude: -9.1444,
        title: 'Sarah Jenkins',
        description: 'Digital Nomad',
        data: mockUsers[1],
        distance: '0.8 km',
        overlapDays: 12,
        badges: ['NOMAD', 'NIGHT OWL']
    },
    {
        id: 'p2',
        type: 'user',
        latitude: 38.7075,
        longitude: -9.1471,
        title: 'Mike',
        description: 'Explorer',
        data: mockUsers[2],
        distance: '1.2 km',
        overlapDays: 5,
        badges: ['NOMAD']
    },
    {
        id: 'e1',
        type: 'event',
        latitude: 38.7369,
        longitude: -9.1557,
        title: 'Digital Arts Exhibition',
        description: 'Meetup at 4PM',
        data: { time: '16:00', host: 'NomadList' },
    },
];

export const useMapStore = create<MapState>((set, get) => ({
    pins: MOCK_PINS,
    selectedPinId: null,
    isLoading: false,
    error: null,
    filters: {
        showUsers: true,
        showGuides: true,
        showEvents: true,
    },

    loadNearby: async (latitude, longitude) => {
        set({ isLoading: true });

        const result = await LocationsAPI.getNearby(latitude, longitude, 10);

        if (result.data?.length) {
            set({ pins: result.data as MapPin[], isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    selectPin: (id) => set({ selectedPinId: id }),

    toggleFilter: (filter) => set((state) => ({
        filters: {
            ...state.filters,
            [filter]: !state.filters[filter],
        }
    })),

    updateMyLocation: async (latitude, longitude) => {
        await LocationsAPI.updateMyLocation(latitude, longitude);
    },
}));
