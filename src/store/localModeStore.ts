import { create } from 'zustand';

interface Availability {
    weekends: boolean;
    evenings: boolean;
    lunchWithLocals: boolean;
    flexible: boolean;
}

interface LocalModeState {
    isEnabled: boolean;
    availability: Availability;
    superpowers: string[];
    toggleLocalMode: () => void;
    toggleAvailability: (key: keyof Availability) => void;
    toggleSuperpower: (superpower: string) => void;
    reset: () => void;
}

const initialAvailability: Availability = {
    weekends: false,
    evenings: false,
    lunchWithLocals: false,
    flexible: false,
};

export const useLocalModeStore = create<LocalModeState>((set) => ({
    isEnabled: false,
    availability: initialAvailability,
    superpowers: [],

    toggleLocalMode: () => set((state) => ({ isEnabled: !state.isEnabled })),

    toggleAvailability: (key) =>
        set((state) => ({
            availability: {
                ...state.availability,
                [key]: !state.availability[key],
            },
        })),

    toggleSuperpower: (superpower) =>
        set((state) => {
            const exists = state.superpowers.includes(superpower);
            return {
                superpowers: exists
                    ? state.superpowers.filter((s) => s !== superpower)
                    : [...state.superpowers, superpower],
            };
        }),

    reset: () => set({
        isEnabled: false,
        availability: initialAvailability,
        superpowers: []
    }),
}));
