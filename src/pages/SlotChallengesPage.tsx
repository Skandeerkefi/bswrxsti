import { useEffect, useState } from 'react';
import { useSlotChallengeStore, SlotChallenge } from '@/store/useSlotChallengeStore';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Users, Target, DollarSign } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import GraphicalBackground from '@/components/GraphicalBackground';

export default function SlotChallengesPage() {
  const { challenges, fetchChallenges, isLoading } = useSlotChallengeStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const filteredChallenges = challenges.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Ongoing';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  const getWinnerCount = (challenge: SlotChallenge) => {
    return challenge.leaderboard.filter((r) => r.isWinner).length;
  };

  return (
    <div className='relative flex flex-col min-h-screen text-white'>
      <GraphicalBackground />
      <Navbar />
      <main className='relative z-10 flex-grow'>
        <div className="container px-4 py-8 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="flex items-center justify-center gap-3 mb-2 text-4xl font-bold">
              <Trophy className="text-[#D2758F]" />
              Slot Challenges
            </h1>
            <p className="text-[#FEFDDE]/70">Compete for the biggest multipliers and win big!</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(['all', 'active', 'upcoming', 'ended'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === status
                    ? 'bg-[#D2758F] text-white shadow-lg shadow-[#D2758F]/50'
                    : 'bg-[#1a1222] text-[#FEFDDE] hover:bg-[#381835] hover:text-[#D2758F]'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-t-2 border-b-2 border-[#D2758F] rounded-full animate-spin"></div>
            </div>
          )}

          {/* Challenge Cards Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <Link
                  key={challenge._id}
                  to={`/slot-challenges/${challenge._id}`}
                  className="group bg-[#1a1222]/80 border border-[#D2758F]/30 rounded-xl overflow-hidden hover:border-[#D2758F] transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#D2758F]/20"
                >
                  {/* Game Image */}
                  <div className="relative h-40 overflow-hidden bg-[#0E0D1D]">
                    {challenge.gameImageUrl ? (
                      <img
                        src={challenge.gameImageUrl}
                        alt={challenge.gameTitle}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Trophy className="w-16 h-16 text-[#D2758F]/30" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(challenge.status)}`}>
                      {challenge.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-2 text-xl font-bold text-[#FEFDDE] transition-colors group-hover:text-[#D2758F]">
                      {challenge.gameTitle}
                    </h3>
                    <p className="mb-4 text-sm text-[#FEFDDE]/60">{challenge.title}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-[#FEFDDE]/80">Min: ${challenge.minBet}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-red-400" />
                        <span className="text-[#FEFDDE]/80">{challenge.targetMultiplier.toLocaleString()}x</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-[#FEFDDE]/80">
                          {getWinnerCount(challenge)}/{challenge.winnerCount} Winners
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-[#FEFDDE]/80">
                          {formatDate(challenge.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Participants Count */}
                    <div className="flex items-center gap-2 text-sm text-[#FEFDDE]/60">
                      <Users className="w-4 h-4" />
                      <span>{challenge.leaderboard.length} participants</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredChallenges.length === 0 && (
            <div className="py-20 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-[#D2758F]/30" />
              <h3 className="text-xl font-medium text-[#FEFDDE]/60">No challenges found</h3>
              <p className="mt-2 text-[#FEFDDE]/40">
                {filter === 'all' ? 'Check back soon for new challenges!' : `No ${filter} challenges at the moment.`}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}