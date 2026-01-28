/**
 * Verification Store
 * Manages identity verification with real API
 */

import { create } from 'zustand';
import { VerificationAPI } from '../lib/api';

export type VerificationStatus = 'idle' | 'pending' | 'verified';
export type ScanStatus = 'none' | 'scanning' | 'success';

interface VerificationState {
    status: VerificationStatus;
    idScanResult: ScanStatus;
    isLoading: boolean;
    error: string | null;
    socials: {
        linkedin: boolean;
        instagram: boolean;
        github: boolean;
    };

    loadStatus: () => Promise<void>;
    startIdScan: () => Promise<void>;
    linkSocial: (platform: 'linkedin' | 'instagram' | 'github') => Promise<boolean>;
    unlinkSocial: (platform: 'linkedin' | 'instagram' | 'github') => Promise<boolean>;
    reset: () => void;
}

export const useVerificationStore = create<VerificationState>((set, get) => ({
    status: 'idle',
    idScanResult: 'none',
    isLoading: false,
    error: null,
    socials: {
        linkedin: false,
        instagram: false,
        github: false,
    },

    loadStatus: async () => {
        set({ isLoading: true });

        const result = await VerificationAPI.getStatus();

        if (result.data) {
            set({
                status: result.data.status === 'verified' ? 'verified' : 'idle',
                socials: result.data.socials as any,
                isLoading: false,
            });
        } else {
            set({ isLoading: false });
        }
    },

    startIdScan: async () => {
        set({ idScanResult: 'scanning', status: 'pending' });

        const result = await VerificationAPI.startIdVerification();

        if (result.error) {
            set({ idScanResult: 'none', status: 'idle', error: result.error });
            return;
        }

        // Simulate scan completion after delay (in real app, would poll or use webhook)
        setTimeout(async () => {
            await VerificationAPI.completeIdVerification(result.data!.sessionId, 'success');
            set({ idScanResult: 'success', status: 'verified' });
        }, 3000);
    },

    linkSocial: async (platform) => {
        // In real app, would redirect to OAuth flow first
        const result = await VerificationAPI.linkSocial(platform, 'mock_token');

        if (result.data?.linked) {
            set((state) => ({
                socials: { ...state.socials, [platform]: true },
            }));
            return true;
        }
        return false;
    },

    unlinkSocial: async (platform) => {
        const result = await VerificationAPI.unlinkSocial(platform);

        if (!result.error) {
            set((state) => ({
                socials: { ...state.socials, [platform]: false },
            }));
            return true;
        }
        return false;
    },

    reset: () => set({
        status: 'idle',
        idScanResult: 'none',
        socials: { linkedin: false, instagram: false, github: false },
    }),
}));
