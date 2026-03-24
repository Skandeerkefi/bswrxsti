import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

type LeaderboardPeriod = "monthly";

interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardTableProps {
	period: LeaderboardPeriod;
	data: LeaderboardPlayer[] | undefined;
}

const PRIZES: Record<LeaderboardPeriod, Record<number, number>> = {
	monthly: { 1: 600, 2: 300, 3: 175, 4: 75, 5: 50, 6: 25, 7: 25 },
};

export function LeaderboardTable({ period, data }: LeaderboardTableProps) {
	if (!data || data.length === 0) {
		return (
			<div className='py-10 italic text-center text-white/60'>
				No leaderboard data available for {period}.
			</div>
		);
	}

	return (
		<div className='overflow-x-auto rounded-2xl border-4 border-[#D2758F] shadow-[0_0_12px_#D2758F] bg-[#0E0D1D]'>
			{/* Transparent Gray Background covering full inside of border */}
			<div className='bg-black/50 backdrop-blur-sm '>
				<Table className='min-w-full'>
					<TableHeader>
						<TableRow className='bg-[#D2758F]/20 hover:bg-[#FEFDDE]/30 border-b border-white'>
							<TableHead className='w-16 text-left text-[#D2758F] font-semibold tracking-wide py-3 pl-6'>
								Rank
							</TableHead>
							<TableHead className='py-3 pl-6 font-semibold tracking-wide text-left text-white'>
								Player
							</TableHead>
							<TableHead className='text-right text-[#D2758F] font-semibold tracking-wide py-3 pr-6'>
								Wager
							</TableHead>
							<TableHead className='text-right text-[#D2758F] font-semibold tracking-wide py-3 pr-6'>
								Prize
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((player) => {
							const prize = PRIZES[period]?.[player.rank] || 0;
							const isTop3 = player.rank <= 3;

							return (
								<TableRow
									key={player.username}
									className={`border-b border-[#D2758F]/30  hover:bg-[#D2758F]/10 cursor-default ${
										player.isFeatured ? "bg-[#D2758F]/15" : ""
									}`}
								>
									<TableCell className='py-3 pl-6 font-semibold text-[#D2758F] text-center'>
										{isTop3 ? (
											<Crown
												className={`inline-block h-5 w-5 ${
													player.rank === 1
														? "text-[#D2758F]"
														: player.rank === 2
														? "text-[#D2758F]"
														: "text-[#D2758F]"
												}`}
												aria-label={`Rank ${player.rank}`}
											/>
										) : (
											<span>{player.rank}</span>
										)}
									</TableCell>

									<TableCell className='py-3 pl-6 font-medium text-white whitespace-nowrap'>
										{player.username}
										{player.isFeatured && (
											<Badge
												variant='outline'
												className='text-[#D2758F] border-[#D2758F] ml-2 select-none'
											>
												Streamer
											</Badge>
										)}
									</TableCell>

									<TableCell className='py-3 pr-6 text-right text-[#D2758F] font-mono font-semibold whitespace-nowrap'>
										${player.wager.toLocaleString()}
									</TableCell>

									<TableCell
										className={`py-3 pr-6 text-right font-semibold whitespace-nowrap ${
											prize > 0 ? "text-[#D2758F]" : "text-white/50 italic"
										}`}
									>
										{prize > 0 ? `$${prize}` : "-"}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
