/**
 * Housing Store
 * Manages housing listings with real API
 */

import { create } from 'zustand';
import { mockUsers } from '../data/mockUsers';
import { ListingsAPI } from '../lib/api';

export interface HousingListing {
    id: string;
    hostId: string;
    title: string;
    location: string;
    price: number;
    period: 'night' | 'month';
    images: string[];
    type: 'entire_place' | 'private_room' | 'shared';
    rating: number;
    reviewCount: number;
    tags: string[];
    isVerified: boolean;
    hostPersonaTraits?: string[];
}

interface HousingState {
    listings: HousingListing[];
    isLoading: boolean;
    error: string | null;
    filters: {
        city: string;
        type: string | null;
    };

    loadListings: (city?: string) => Promise<void>;
    createListing: (listing: Omit<HousingListing, 'id' | 'rating' | 'reviewCount' | 'isVerified'>) => Promise<boolean>;
    setCityFilter: (city: string) => void;
}

// Fallback mock data
const MOCK_LISTINGS: HousingListing[] = [
    {
        id: 'h1',
        hostId: mockUsers[1]?.id || 'user-2',
        title: 'Sunny Loft in Bairro Alto',
        location: 'Lisbon, Portugal',
        price: 1200,
        period: 'month',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
        type: 'entire_place',
        rating: 4.9,
        reviewCount: 12,
        tags: ['500Mbps', 'Workspace'],
        isVerified: true,
        hostPersonaTraits: ['Night Owl', 'Social'],
    },
    {
        id: 'h2',
        hostId: mockUsers[2]?.id || 'user-3',
        title: 'Cozy Room near Cowork',
        location: 'Lisbon, Portugal',
        price: 650,
        period: 'month',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        type: 'private_room',
        rating: 4.7,
        reviewCount: 8,
        tags: ['Quiet', 'Gym Access'],
        isVerified: true,
        hostPersonaTraits: ['Early Riser', 'Focus'],
    }
];

export const useHousingStore = create<HousingState>((set, get) => ({
    listings: MOCK_LISTINGS,
    isLoading: false,
    error: null,
    filters: {
        city: 'Lisbon',
        type: null,
    },

    loadListings: async (city) => {
        set({ isLoading: true, error: null });

        const result = await ListingsAPI.list({ city: city || get().filters.city });

        if (result.error) {
            set({ isLoading: false });
            return;
        }

        const listings = result.data?.length ? result.data as HousingListing[] : MOCK_LISTINGS;
        set({ listings, isLoading: false });
    },

    createListing: async (listing) => {
        set({ isLoading: true, error: null });

        const result = await ListingsAPI.create(listing);

        if (result.error) {
            set({ isLoading: false, error: result.error });
            return false;
        }

        if (result.data) {
            set((state) => ({
                listings: [result.data as HousingListing, ...state.listings],
                isLoading: false,
            }));
            return true;
        }

        set({ isLoading: false });
        return false;
    },

    setCityFilter: (city) => {
        set((state) => ({
            filters: { ...state.filters, city }
        }));
        get().loadListings(city);
    },
}));
