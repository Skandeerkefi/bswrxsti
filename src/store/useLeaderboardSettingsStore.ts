import { create } from 'zustand';
import api from '@/lib/api';

export interface Prize {
	position: number;
	prize: string;
	currency: string;
}

export interface PreviousPeriod {
	startDate: string;
	endDate: string;
	title: string;
	prizes: Prize[];
	createdAt: string;
}

export interface LeaderboardSettings {
	_id: string;
	isActive: boolean;
	title: string;
	description: string;
	periodType: 'daily' | 'weekly' | 'biweekly' | 'custom';
	timezone: string;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	prizes: Prize[];
	minWager: number;
	categories: string;
	autoTransition: boolean;
	transitionHour: number;
	previousPeriods: PreviousPeriod[];
	createdAt: string;
	updatedAt: string;
}

interface LeaderboardSettingsState {
	settings: LeaderboardSettings | null;
	loading: boolean;
	error: string | null;

	// Fetch settings
	fetchSettings: () => Promise<void>;

	// Update settings
	updateSettings: (data: Partial<LeaderboardSettings>) => Promise<LeaderboardSettings | null>;

	// Get previous periods
	fetchPreviousPeriods: () => Promise<PreviousPeriod[]>;

	// Advance to next period
	advanceToNextPeriod: () => Promise<boolean>;

	// Clear error
	clearError: () => void;
}

export const useLeaderboardSettingsStore = create<LeaderboardSettingsState>((set) => ({
	settings: null,
	loading: false,
	error: null,

	fetchSettings: async () => {
		set({ loading: true, error: null });
		try {
			const response = await api.get('/api/leaderboard-settings');
			set({ settings: response.data, loading: false });
		} catch (error: any) {
			set({ error: error.message, loading: false });
		}
	},

	updateSettings: async (data: Partial<LeaderboardSettings>) => {
		set({ loading: true, error: null });
		try {
			const response = await api.put('/api/leaderboard-settings', data);
			set({ settings: response.data, loading: false });
			return response.data;
		} catch (error: any) {
			set({ error: error.message, loading: false });
			return null;
		}
	},

	fetchPreviousPeriods: async () => {
		try {
			const response = await api.get('/api/leaderboard-settings/previous');
			return response.data;
		} catch (error: any) {
			set({ error: error.message });
			return [];
		}
	},

	advanceToNextPeriod: async () => {
		set({ loading: true, error: null });
		try {
			await api.post('/api/leaderboard-settings/advance');
			await useLeaderboardSettingsStore.getState().fetchSettings();
			set({ loading: false });
			return true;
		} catch (error: any) {
			set({ error: error.message, loading: false });
			return false;
		}
	},

	clearError: () => set({ error: null }),
}));