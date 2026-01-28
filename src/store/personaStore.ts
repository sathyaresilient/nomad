import { create } from 'zustand';
import { AuthUser, TravelStyle, User } from '../types';

export type PersonaArchetype = 'The Socialite' | 'The Explorer' | 'The Zen Master' | 'The Digital Nomad' | 'The Foodie';

export interface PersonaTraits {
    social: number;    // 0-100
    adventure: number; // 0-100
    relaxation: number;// 0-100
    budget: number;    // 0-100
    culture: number;   // 0-100
}

// User info needed for persona generation
type PersonaUser = AuthUser | User;

interface PersonaState {
    archetype: PersonaArchetype;
    traits: PersonaTraits;
    generatedAt: Date | null;
    isLoading: boolean;

    // Actions
    generatePersona: (user: PersonaUser) => Promise<void>;
}

// Helper to determine archetype based on traits
const determineArchetype = (traits: PersonaTraits, style?: TravelStyle): PersonaArchetype => {
    // Simple logic for demo purposes
    if (traits.social > 80) return 'The Socialite';
    if (traits.adventure > 80) return 'The Explorer';
    if (traits.relaxation > 80) return 'The Zen Master';
    if (style === 'digitalNomad') return 'The Digital Nomad';
    return 'The Explorer'; // Default
};

export const usePersonaStore = create<PersonaState>((set) => ({
    archetype: 'The Explorer',
    traits: { social: 50, adventure: 50, relaxation: 50, budget: 50, culture: 50 },
    generatedAt: null,
    isLoading: false,

    generatePersona: async (user: PersonaUser) => {
        set({ isLoading: true });

        // Simulate AI Processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock deterministic generation based on user profile
        const nameLen = user.displayName.length;

        const traits: PersonaTraits = {
            social: user.travelStyle === 'social' ? 90 : 40 + (nameLen * 3) % 40,
            adventure: user.travelStyle === 'backpacker' || user.travelStyle === 'explorer' ? 85 : 30 + (nameLen * 4) % 50,
            relaxation: user.travelStyle === 'slowTravel' || user.travelStyle === 'luxury' ? 90 : 20 + (nameLen * 2) % 60,
            budget: user.travelStyle === 'backpacker' ? 90 : 50,
            culture: ('favoriteDestinations' in user ? user.favoriteDestinations.length : 0) * 10 + 40,
        };

        const archetype = determineArchetype(traits, user.travelStyle);

        set({
            archetype,
            traits,
            generatedAt: new Date(),
            isLoading: false
        });
    },
}));
