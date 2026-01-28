/**
 * Safety Store
 * Manages emergency contacts and alerts with real API
 */

import { create } from 'zustand';
import { SafetyAPI } from '../lib/api';

export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relation: string;
}

interface SafetyState {
    isSharingLocation: boolean;
    emergencyContacts: EmergencyContact[];
    alertStatus: 'idle' | 'countdown' | 'active';
    countdown: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadContacts: () => Promise<void>;
    toggleLocation: () => Promise<void>;
    addContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<boolean>;
    removeContact: (id: string) => Promise<boolean>;
    startAlertFlow: () => void;
    cancelAlert: () => void;
    confirmAlert: () => Promise<void>;
    tickCountdown: () => void;
}

// Fallback mock contacts
const MOCK_CONTACTS: EmergencyContact[] = [
    { id: '1', name: 'Mom', phone: '+1234567890', relation: 'Family' },
    { id: '2', name: 'Embassy', phone: '+3512134567', relation: 'Authority' },
];

export const useSafetyStore = create<SafetyState>((set, get) => ({
    isSharingLocation: false,
    emergencyContacts: MOCK_CONTACTS,
    alertStatus: 'idle',
    countdown: 5,
    isLoading: false,
    error: null,

    loadContacts: async () => {
        set({ isLoading: true });

        const result = await SafetyAPI.getContacts();

        if (result.data?.length) {
            set({ emergencyContacts: result.data as EmergencyContact[], isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    toggleLocation: async () => {
        const newState = !get().isSharingLocation;

        // Would get actual location from device
        const result = await SafetyAPI.updateLocationSharing(newState, 38.7223, -9.1393);

        if (!result.error) {
            set({ isSharingLocation: newState });
        }
    },

    addContact: async (contact) => {
        const result = await SafetyAPI.addContact(contact);

        if (result.data) {
            set((state) => ({
                emergencyContacts: [...state.emergencyContacts, result.data as EmergencyContact],
            }));
            return true;
        }
        return false;
    },

    removeContact: async (id) => {
        const result = await SafetyAPI.removeContact(id);

        if (!result.error) {
            set((state) => ({
                emergencyContacts: state.emergencyContacts.filter((c) => c.id !== id),
            }));
            return true;
        }
        return false;
    },

    startAlertFlow: () => {
        set({ alertStatus: 'countdown', countdown: 5 });
    },

    cancelAlert: () => set({ alertStatus: 'idle', countdown: 5 }),

    confirmAlert: async () => {
        // Would get actual location
        await SafetyAPI.triggerAlert(38.7223, -9.1393, 'Emergency alert triggered');
        set({ alertStatus: 'active', countdown: 0 });
    },

    tickCountdown: () => {
        const current = get().countdown;
        if (current > 1) {
            set({ countdown: current - 1 });
        } else {
            get().confirmAlert();
        }
    },
}));
