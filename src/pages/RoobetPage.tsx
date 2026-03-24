import React, { useEffect, useState } from "react";
import { useRoobetStore } from "../store/RoobetStore";
import GraphicalBackground from "@/components/GraphicalBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);

const RoobetPage: React.FC = () => {
  const { leaderboard, loading, error, fetchLeaderboard, periodInfo } = useRoobetStore();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // 💰 Prize mapping (Top 15)
  const prizeMap: Record<number, string> = {
    1: "$1000",
    2: "$500",
    3: "$350",
    4: "$200",
    5: "$150",
    6: "$80",
    7: "$65",
    8: "$50",
    9: "$35",
    10: "$25",
    11: "$15",
    12: "$10",
    13: "$10",
    14: "$5",
    15: "$5",
  };

  // ⏳ Countdown (UTC-based, bi-weekly)
  useEffect(() => {
    const updateCountdown = () => {
      if (!periodInfo) return;

      const now = dayjs().utc();
      const end = periodInfo.end;
      const diff = end.diff(now);

      if (diff <= 0) {
        setTimeLeft("Leaderboard period has ended. Resetting...");
        return;
      }

      const d = dayjs.duration(diff);

      const days = Math.floor(d.asDays());
      const hours = d.hours();
      const minutes = d.minutes();
      const seconds = d.seconds();

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    if (!periodInfo) return;
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [periodInfo]);

  return (
    <div className="relative flex flex-col min-h-screen">
      <GraphicalBackground />
      <Navbar />

      <main className="relative z-10 flex-grow w-full max-w-6xl px-6 py-16 mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-5xl md:text-6xl font-black text-[#FEFDDE] uppercase drop-shadow-[0_0_20px_rgba(255,253,222,0.22)]">
            Roobet Bi-Weekly Leaderboard
          </h1>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-[#D2758F] to-transparent mb-8" />
          
          <div className="inline-block px-8 py-4 rounded-2xl bg-[#381835]/40 border border-[#D2758F]/40 backdrop-blur-sm">
            <p className="text-2xl font-bold text-[#FEFDDE]">
              💰 $2,500 Prize Pool
            </p>
          </div>
        </div>

        {/* Event Info Card */}
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-[#381835]/50 to-[#0E0D1D]/50 border border-[#D2758F]/30 backdrop-blur-md">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="text-center md:text-left">
              <p className="text-sm uppercase tracking-widest text-[#FEFDDE]/70 mb-2">Event Duration</p>
              <p className="text-xl font-bold text-[#FEFDDE]">
                {periodInfo?.startDate} <span className="text-[#D2758F]">→</span> {periodInfo?.endDate}
              </p>
              <p className="text-xs text-[#FEFDDE]/50 mt-1">EST Timezone</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm uppercase tracking-widest text-[#FEFDDE]/70 mb-2">Time Remaining</p>
              <p className="text-xl font-bold font-mono text-[#D2758F]">{timeLeft}</p>
              <p className="text-xs text-[#FEFDDE]/50 mt-1">Until Next Reset</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-[#FEFDDE]">Loading leaderboard...</p>
          </div>
        )}
        {error && (
          <div className="p-6 text-center rounded-2xl bg-[#D2758F]/20 border border-[#D2758F]/50">
            <p className="text-[#D2758F] font-semibold">{error}</p>
          </div>
        )}

        {leaderboard && (
          <>
            <p className="mb-10 text-xs italic text-[#FEFDDE]/60 text-center px-6 py-3 bg-[#0E0D1D]/50 rounded-xl border border-[#FEFDDE]/10">
              {leaderboard.disclosure}
            </p>

            {/* 🏆 Top 3 Champions */}
            <div className="mb-16">
              <h2 className="mb-8 text-2xl font-bold text-[#FEFDDE] uppercase tracking-wide">
                🏆 Top Champions
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {leaderboard.data.slice(0, 3).map((player, idx) => (
                <div
                  key={player.uid}
                  className={`relative p-8 rounded-3xl border-2 border-[#D2758F] shadow-2xl bg-gradient-to-br from-[#D2758F]/20 to-[#0E0D1D]/60 backdrop-blur-sm hover:border-[#FEFDDE] hover:shadow-[0_0_30px_rgba(210,117,143,0.5)] transition-all duration-300 group ${
                    idx === 0 ? "md:order-2" : idx === 1 ? "md:order-1" : "md:order-3"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#D2758F] to-[#381835] border-2 border-[#FEFDDE] font-black text-lg text-[#FEFDDE] shadow-lg">
                    #{player.rankLevel}
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-3xl md:text-4xl font-black text-[#FEFDDE] mb-4 drop-shadow-lg group-hover:text-[#D2758F] transition-colors">
                      {player.username}
                    </p>

                    <div className="h-1 w-12 mx-auto bg-gradient-to-r from-transparent via-[#D2758F] to-transparent mb-4" />

                    {prizeMap[player.rankLevel] && (
                      <p className="text-2xl font-bold text-[#FEFDDE] mb-6">
                        💰 {prizeMap[player.rankLevel]}
                      </p>
                    )}

                    <div className="pt-4 border-t border-[#D2758F]/30">
                      <p className="text-sm uppercase tracking-wider text-[#FEFDDE]/70 mb-1">Wagered</p>
                      <p className="text-xl font-bold text-[#D2758F] font-mono">
                        ${player.weightedWagered.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* Remaining players (4+) */}
            {leaderboard.data.length > 3 && (
              <div className="mt-16">
                <h2 className="mb-8 text-2xl font-bold text-[#FEFDDE] uppercase tracking-wide">
                  📊 Full Leaderboard
                </h2>
                <div className="overflow-x-auto rounded-2xl shadow-2xl border border-[#D2758F]/30">
                  <table className="w-full text-left border-collapse">
                    <thead className="text-sm font-bold tracking-widest text-[#0E0D1D] uppercase bg-gradient-to-r from-[#D2758F] to-[#D2758F]/80">
                      <tr>
                        <th className="p-4">Rank</th>
                        <th className="p-4">Username</th>
                        <th className="p-4 text-right">Wagered</th>
                        <th className="p-4 text-right">Prize</th>
                      </tr>
                    </thead>
                  <tbody className="bg-[#0E0D1D]/60 backdrop-blur-sm">
                    {leaderboard.data.slice(3).map((player, idx) => (
                      <tr
                        key={player.uid}
                        className={`border-t border-[#D2758F]/20 transition-colors ${
                          idx % 2 === 0 ? "bg-[#0E0D1D]/40" : "bg-[#381835]/20"
                        } hover:bg-[#D2758F]/15`}
                      >
                        <td className="p-4 font-bold text-[#FEFDDE] w-12">{player.rankLevel}</td>
                        <td className="p-4 font-semibold text-[#FEFDDE]">{player.username}</td>
                        <td className="p-4 text-right text-[#FEFDDE] font-mono">
                          ${player.weightedWagered.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4 text-right font-bold text-[#D2758F]">
                          {prizeMap[player.rankLevel] ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default RoobetPage;
