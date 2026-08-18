import { create } from 'zustand';
import api from '@/lib/api';

export interface ChallengeResult {
  uid: string;
  username: string;
  wagered: number;
  weightedWagered: number;
  favoriteGameId: string;
  favoriteGameTitle: string;
  rankLevel: number;
  rankLevelImage: string;
  highestMultiplier: {
    multiplier: number;
    wagered: number;
    payout: number;
    gameId: string;
    gameTitle: string;
  };
  isWinner: boolean;
  winnerRank: number | null;
  qualifiedAt: string | null;
  updatedAt: string;
  rank?: number;
}

export interface SlotChallenge {
  _id: string;
  title: string;
  gameId: string | null;
  gameTitle: string;
  gameImageUrl: string;
  gameProvider: string;
  minBet: number;
  targetMultiplier: number;
  winnerCount: number;
  winnerSelectionMode: 'firstComeFirstServed' | 'topPerformers';
  isActive: boolean;
  status: 'active' | 'upcoming' | 'ended';
  startDate: string;
  endDate: string | null;
  lastSyncedAt: string | null;
  nextSyncAt: string | null;
  leaderboard: ChallengeResult[];
  createdAt: string;
  updatedAt: string;
}

interface SlotChallengeState {
  challenges: SlotChallenge[];
  currentChallenge: SlotChallenge | null;
  isLoading: boolean;
  error: string | null;
  
  // Fetch all challenges
  fetchChallenges: (status?: string) => Promise<void>;
  
  // Fetch single challenge
  fetchChallenge: (id: string) => Promise<void>;
  
  // Fetch leaderboard for a challenge
  fetchLeaderboard: (id: string) => Promise<{ challenge: Partial<SlotChallenge>; leaderboard: ChallengeResult[]; lastSyncedAt: string | null } | null>;
  
  // Create challenge (admin)
  createChallenge: (data: Partial<SlotChallenge>) => Promise<SlotChallenge | null>;
  
  // Update challenge (admin)
  updateChallenge: (id: string, data: Partial<SlotChallenge>) => Promise<SlotChallenge | null>;
  
  // Delete challenge (admin)
  deleteChallenge: (id: string) => Promise<boolean>;
  
  // Refresh leaderboard (admin)
  refreshLeaderboard: (id: string) => Promise<boolean>;
  
  // Search slots
  searchSlots: (query: string) => Promise<any[]>;
  
  // Clear error
  clearError: () => void;
}

export const useSlotChallengeStore = create<SlotChallengeState>((set, get) => ({
  challenges: [],
  currentChallenge: null,
  isLoading: false,
  error: null,

  fetchChallenges: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/api/slot-challenges${params}`);
      set({ challenges: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchChallenge: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/slot-challenges/${id}`);
      set({ currentChallenge: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLeaderboard: async (id: string) => {
    try {
      const response = await api.get(`/api/slot-challenges/${id}/leaderboard`);
      return response.data;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  createChallenge: async (data: Partial<SlotChallenge>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/slot-challenges', data);
      const newChallenge = response.data;
      set(state => ({
        challenges: [newChallenge, ...state.challenges],
        isLoading: false,
      }));
      return newChallenge;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateChallenge: async (id: string, data: Partial<SlotChallenge>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/slot-challenges/${id}`, data);
      const updatedChallenge = response.data;
      set(state => ({
        challenges: state.challenges.map(c => c._id === id ? updatedChallenge : c),
        currentChallenge: state.currentChallenge?._id === id ? updatedChallenge : state.currentChallenge,
        isLoading: false,
      }));
      return updatedChallenge;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  deleteChallenge: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/slot-challenges/${id}`);
      set(state => ({
        challenges: state.challenges.filter(c => c._id !== id),
        currentChallenge: state.currentChallenge?._id === id ? null : state.currentChallenge,
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  refreshLeaderboard: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/api/slot-challenges/${id}/refresh`);
      // Refetch the challenge to get updated data
      await get().fetchChallenge(id);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  searchSlots: async (query: string) => {
    try {
      const response = await api.get(`/api/slot-challenges/slots/search?q=${encodeURIComponent(query)}`);
      return response.data || [];
    } catch (error: any) {
      set({ error: error.message });
      return [];
    }
  },

  clearError: () => set({ error: null }),
}));