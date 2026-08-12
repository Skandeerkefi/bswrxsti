import { create } from "zustand";
import axios from "axios";
import dayjs from "dayjs";
import { apiUrl } from "@/lib/apiBase";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface Player {
	uid: string;
	username: string;
	wagered: number;
	weightedWagered: number;
	favoriteGameId: string;
	favoriteGameTitle: string;
	rankLevel: number;
}

interface LeaderboardData {
	disclosure: string;
	data: Player[];
}

interface PeriodInfo {
	startDate: string;
	endDate: string;
	start: dayjs.Dayjs;
	end: dayjs.Dayjs;
}

interface RoobetStore {
	leaderboard: LeaderboardData | null;
	previousLeaderboard: LeaderboardData | null;
	loading: boolean;
	error: string | null;
	periodInfo: PeriodInfo | null;
	previousPeriodInfo: PeriodInfo | null;
	adminViewingPeriod: "current" | "previous";
	setAdminViewingPeriod: (period: "current" | "previous") => void;
	fetchLeaderboard: () => Promise<void>;
}

/**
 * Calculate bi-weekly period dates for Roobet leaderboard
 * Started: March 21, 2026 12am EST
 * Auto-resets every 14 days, with a special period ending August 19, 2026
 */
const getBiWeeklyPeriod = (): PeriodInfo => {
	// Reference start: March 21, 2026 12am EST = March 21, 2026 5am UTC
	const referenceStart = dayjs("2026-03-21T05:00:00Z").utc();
	const now = dayjs().utc();

	const specialEndDate = dayjs("2026-08-19T23:59:59Z").utc();
	const specialPeriodStart = dayjs("2026-07-25T05:00:00Z").utc();
	const postSpecialStart = dayjs("2026-08-20T05:00:00Z").utc();

	// If we're past the special period end, use normal biweekly from Aug 20
	if (now.isAfter(specialEndDate)) {
		const diffDays = now.diff(postSpecialStart, "day", true);
		const periodNumber = Math.floor(diffDays / 14);
		const start = postSpecialStart.add(periodNumber * 14, "day");
		const end = start.add(14, "day").subtract(1, "second");
		return {
			startDate: start.format("YYYY-MM-DD"),
			endDate: end.format("YYYY-MM-DD"),
			start,
			end,
		};
	}

	// If we're in the special period (between its start and end), extend to Aug 19
	if (now.isAfter(specialPeriodStart) && now.isBefore(specialEndDate)) {
		const start = specialPeriodStart;
		return {
			startDate: start.format("YYYY-MM-DD"),
			endDate: "2026-08-19",
			start,
			end: specialEndDate,
		};
	}

	// Normal bi-weekly calculation
	const diffDays = now.diff(referenceStart, "day", true);
	const periodNumber = Math.floor(diffDays / 14);

	// Calculate start of current period
	const start = referenceStart.add(periodNumber * 14, "day");

	// Calculate end of current period (14 days later, at 4:59:59 UTC = 12:59 AM EST)
	const end = start.add(14, "day").subtract(1, "second");

	return {
		startDate: start.format("YYYY-MM-DD"),
		endDate: end.format("YYYY-MM-DD"),
		start,
		end,
	};
};

/**
 * Calculate bi-weekly period dates for Roobet leaderboard
 * For previous period, we go back one cycle (14 days)
 */
const getPreviousPeriod = (currentPeriod: PeriodInfo): PeriodInfo => {
	const start = currentPeriod.start.subtract(14, "day");
	const end = start.add(14, "day").subtract(1, "second");
	return {
		startDate: start.format("YYYY-MM-DD"),
		endDate: end.format("YYYY-MM-DD"),
		start,
		end,
	};
};

export const useRoobetStore = create<RoobetStore>((set) => ({
	leaderboard: null,
	previousLeaderboard: null,
	loading: false,
	error: null,
	periodInfo: null,
	previousPeriodInfo: null,
	adminViewingPeriod: "current",

	setAdminViewingPeriod: (period) => set({ adminViewingPeriod: period }),

	fetchLeaderboard: async () => {
		set({ loading: true, error: null });

		try {
			const periodInfo = getBiWeeklyPeriod();
			const { startDate, endDate } = periodInfo;
			set({ periodInfo });

			// Fetch current period leaderboard
			const currentUrl = `${apiUrl(`/api/leaderboard/${startDate}/${endDate}`)}`;
			const currentResponse = await axios.get(currentUrl);

			const currentData: LeaderboardData = {
				disclosure: currentResponse.data.disclosure,
				data: currentResponse.data.data.map((player: Record<string, unknown>, index: number) => ({
					uid: player.uid as string,
					username: player.username as string,
					wagered: player.wagered as number,
					weightedWagered: player.weightedWagered as number,
					favoriteGameId: player.favoriteGameId as string,
					favoriteGameTitle: player.favoriteGameTitle as string,
					rankLevel: index + 1,
				})),
			};

			// Fetch previous period leaderboard for admin access
			const previousPeriod = getPreviousPeriod(periodInfo);
			set({ previousPeriodInfo: previousPeriod });

			const prevUrl = `${apiUrl(`/api/leaderboard/${previousPeriod.startDate}/${previousPeriod.endDate}`)}`;
			let previousData: LeaderboardData | null = null;
			
			try {
				const prevResponse = await axios.get(prevUrl);
				previousData = {
					disclosure: prevResponse.data.disclosure,
					data: prevResponse.data.data.map((player: Record<string, unknown>, index: number) => ({
						uid: player.uid as string,
						username: player.username as string,
						wagered: player.wagered as number,
						weightedWagered: player.weightedWagered as number,
						favoriteGameId: player.favoriteGameId as string,
						favoriteGameTitle: player.favoriteGameTitle as string,
						rankLevel: index + 1,
					})),
				};
			} catch {
				// Previous period might not exist yet
				previousData = null;
			}

			set({ 
				leaderboard: currentData, 
				previousLeaderboard: previousData,
				loading: false 
			});
		} catch (err: unknown) {
			const errorMessage = err && typeof err === 'object' && 'response' in err 
				? (err as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to fetch leaderboard"
				: "Failed to fetch leaderboard";
			set({
				error: errorMessage,
				loading: false,
			});
		}
	},
}));
