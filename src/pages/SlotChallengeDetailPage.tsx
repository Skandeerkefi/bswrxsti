import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSlotChallengeStore } from '@/store/useSlotChallengeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Trophy, 
  Clock, 
  Target, 
  DollarSign, 
  RefreshCw, 
  ArrowLeft,
  Crown,
  Medal,
  Award,
  User
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import GraphicalBackground from '@/components/GraphicalBackground';

export default function SlotChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentChallenge, 
    fetchChallenge, 
    refreshLeaderboard, 
    isLoading
  } = useSlotChallengeStore();
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (id) {
      fetchChallenge(id);
    }
  }, [id, fetchChallenge]);

  const handleRefresh = async () => {
    if (id) {
      await refreshLeaderboard(id);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Ongoing';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getWinnerIcon = (rank: number | null) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-purple-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'ended':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const sortedLeaderboard = currentChallenge?.leaderboard 
    ? [...currentChallenge.leaderboard].sort((a, b) => 
        (b.highestMultiplier?.multiplier || 0) - (a.highestMultiplier?.multiplier || 0)
      )
    : [];

  if (isLoading && !currentChallenge) {
    return (
      <div className='relative flex flex-col min-h-screen text-white'>
        <GraphicalBackground />
        <Navbar />
        <main className='relative z-10 flex items-center justify-center flex-grow'>
          <div className="w-12 h-12 border-t-2 border-b-2 border-[#D2758F] rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className='relative flex flex-col min-h-screen text-white'>
        <GraphicalBackground />
        <Navbar />
        <main className='relative z-10 flex items-center justify-center flex-grow'>
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-[#D2758F]/30" />
            <h2 className="mb-2 text-2xl font-bold">Challenge not found</h2>
            <button
              onClick={() => navigate('/slot-challenges')}
              className="text-[#D2758F] hover:text-[#FEFDDE] transition-colors"
            >
              Back to Challenges
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='relative flex flex-col min-h-screen text-white'>
      <GraphicalBackground />
      <Navbar />
      <main className='relative z-10 flex-grow'>
        <div className="container px-4 py-8 mx-auto">
          <button
            onClick={() => navigate('/slot-challenges')}
            className="flex items-center gap-2 mb-6 text-[#FEFDDE]/70 transition-colors hover:text-[#D2758F]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Challenges
          </button>

          <div className="mb-8 overflow-hidden border border-[#D2758F]/30 bg-[#1a1222]/80 rounded-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-48 md:w-1/3 md:h-auto">
                {currentChallenge.gameImageUrl ? (
                  <img
                    src={currentChallenge.gameImageUrl}
                    alt={currentChallenge.gameTitle}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-[#0E0D1D]">
                    <Trophy className="w-20 h-20 text-[#D2758F]/30" />
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(currentChallenge.status)}`}>
                  {currentChallenge.status.toUpperCase()}
                </div>
              </div>

              <div className="p-6 md:w-2/3">
                <h1 className="mb-2 text-3xl font-bold text-[#FEFDDE]">
                  {currentChallenge.gameTitle}
                </h1>
                <p className="mb-6 text-[#FEFDDE]/60">{currentChallenge.title}</p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="p-4 rounded-lg bg-[#0E0D1D]/50">
                    <div className="flex items-center gap-2 mb-1 text-[#FEFDDE]/60">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Min Bet</span>
                    </div>
                    <p className="text-2xl font-bold text-[#FEFDDE]">${currentChallenge.minBet}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#0E0D1D]/50">
                    <div className="flex items-center gap-2 mb-1 text-[#FEFDDE]/60">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Target</span>
                    </div>
                    <p className="text-2xl font-bold text-red-400">{currentChallenge.targetMultiplier.toLocaleString()}x</p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#0E0D1D]/50">
                    <div className="flex items-center gap-2 mb-1 text-[#FEFDDE]/60">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm">Winners</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400">
                      {sortedLeaderboard.filter(r => r.isWinner).length}/{currentChallenge.winnerCount}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#0E0D1D]/50">
                    <div className="flex items-center gap-2 mb-1 text-[#FEFDDE]/60">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Ends</span>
                    </div>
                    <p className="text-lg font-medium text-[#FEFDDE]">
                      {formatDate(currentChallenge.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-sm text-[#FEFDDE]/40">
                    <Clock className="w-4 h-4" />
                    Last synced: {formatTimeAgo(currentChallenge.lastSyncedAt)}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={handleRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-[#D2758F] rounded-lg hover:bg-[#C1536E] disabled:bg-[#D2758F]/50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh Leaderboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border border-[#D2758F]/30 bg-[#1a1222]/80 rounded-2xl">
            <div className="p-6 border-b border-[#D2758F]/20">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-[#FEFDDE]">
                  <Trophy className="text-yellow-400" />
                  Leaderboard
                </h2>
                <span className="text-[#FEFDDE]/60">
                  {sortedLeaderboard.length} participants
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-[#FEFDDE]/60 bg-[#0E0D1D]/50">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4 md:col-span-3">Player</div>
              <div className="col-span-3 text-right md:col-span-2">Multiplier</div>
              <div className="hidden col-span-2 text-right md:block">Bet Size</div>
              <div className="hidden col-span-2 text-right md:block">Payout</div>
              <div className="col-span-3 text-right">Status</div>
            </div>

            <div className="divide-y divide-[#D2758F]/10">
              {sortedLeaderboard.length === 0 ? (
                <div className="py-20 text-center">
                  <User className="w-16 h-16 mx-auto mb-4 text-[#D2758F]/30" />
                  <h3 className="text-xl font-medium text-[#FEFDDE]/60">No participants yet</h3>
                  <p className="mt-2 text-[#FEFDDE]/40">Be the first to hit the target multiplier!</p>
                </div>
              ) : (
                sortedLeaderboard.map((entry, index) => {
                  const rank = (entry as { rank?: number }).rank || (index + 1);
                  const isWinner = entry.isWinner;
                  const multiplier = entry.highestMultiplier?.multiplier || 0;
                  const wagered = entry.highestMultiplier?.wagered || 0;
                  const payout = entry.highestMultiplier?.payout || 0;
                  const meetsTarget = multiplier >= currentChallenge.targetMultiplier;

                  return (
                    <div
                      key={entry.uid}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${isWinner ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : 'hover:bg-[#1a1222]/50'}`}
                    >
                      <div className="flex items-center col-span-1">
                        {isWinner ? getWinnerIcon(entry.winnerRank) : <span className="font-mono text-[#FEFDDE]/60">#{rank}</span>}
                      </div>
                      <div className="flex items-center col-span-4 gap-3 md:col-span-3">
                        <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-[#D2758F]/20 rounded-full">
                          {entry.rankLevelImage ? (
                            <img src={entry.rankLevelImage} alt="" className="object-cover w-full h-full" />
                          ) : (
                            <User className="w-5 h-5 text-[#D2758F]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#FEFDDE] truncate">{entry.username}</p>
                          {entry.rankLevel > 0 && (
                            <p className="text-xs text-[#FEFDDE]/40">Level {entry.rankLevel}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-3 text-right md:col-span-2">
                        <p className={`text-xl font-bold ${meetsTarget ? "text-green-400" : "text-[#FEFDDE]"}`}>
                          {multiplier.toLocaleString()}x
                        </p>
                      </div>
                      <div className="hidden col-span-2 text-right md:block">
                        <p className="text-[#FEFDDE]/80">${wagered.toFixed(2)}</p>
                      </div>
                      <div className="hidden col-span-2 text-right md:block">
                        <p className="text-green-400">${payout.toFixed(2)}</p>
                      </div>
                      <div className="col-span-3 text-right">
                        {isWinner ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-yellow-400 border rounded-full bg-yellow-500/20 border-yellow-500/50">
                            <Crown className="w-4 h-4" /> Winner #{entry.winnerRank}
                          </span>
                        ) : meetsTarget ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-green-400 border rounded-full bg-green-500/20 border-green-500/50">
                            Qualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-[#FEFDDE]/60 border rounded-full bg-[#D2758F]/10 border-[#D2758F]/30">
                            Participating
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
