import { create } from "zustand";
import axios from "axios";
import dayjs from "dayjs";

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
	loading: boolean;
	error: string | null;
	periodInfo: PeriodInfo | null;
	fetchLeaderboard: () => Promise<void>;
}

/**
 * Calculate bi-weekly period dates for Roobet leaderboard
 * Started: March 21, 2026 12am EST
 * Auto-resets every 14 days
 */
const getBiWeeklyPeriod = (): PeriodInfo => {
	// Reference start: March 21, 2026 12am EST = March 21, 2026 5am UTC
	const referenceStart = dayjs("2026-03-21T05:00:00Z").utc();
	const now = dayjs().utc();

	// Calculate which bi-weekly period we're in
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

export const useRoobetStore = create<RoobetStore>((set) => ({
	leaderboard: null,
	loading: false,
	error: null,
	periodInfo: null,

	fetchLeaderboard: async () => {
		set({ loading: true, error: null });

		try {
			const periodInfo = getBiWeeklyPeriod();
			const { startDate, endDate } = periodInfo;
			set({ periodInfo });

			let url = `https://bswrxstidata-production.up.railway.app/api/leaderboard/${startDate}/${endDate}`;

			const response = await axios.get(url);

			const updatedData: LeaderboardData = {
				disclosure: response.data.disclosure,
				data: response.data.data.map((player: any, index: number) => ({
					uid: player.uid,
					username: player.username,
					wagered: player.wagered,
					weightedWagered: player.weightedWagered,
					favoriteGameId: player.favoriteGameId,
					favoriteGameTitle: player.favoriteGameTitle,
					rankLevel: index + 1,
				})),
			};

			set({ leaderboard: updatedData, loading: false });
		} catch (err: any) {
			set({
				error: err.response?.data?.error || "Failed to fetch leaderboard",
				loading: false,
			});
		}
	},
}));
