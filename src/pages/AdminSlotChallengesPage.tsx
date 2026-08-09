import { useEffect, useState } from 'react';
import { useSlotChallengeStore, SlotChallenge } from '@/store/useSlotChallengeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Plus, Edit, RefreshCw, Search, Crown } from 'lucide-react';
import AdminChallengeForm from '@/components/AdminChallengeForm';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import GraphicalBackground from '@/components/GraphicalBackground';

export default function AdminSlotChallengesPage() {
  const navigate = useNavigate();
  const { challenges, fetchChallenges, refreshLeaderboard, isLoading } = useSlotChallengeStore();
  const { user } = useAuthStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<SlotChallenge | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchChallenges();
  }, [isAdmin, navigate, fetchChallenges]);

  const handleCreate = () => {
    setEditingChallenge(null);
    setShowForm(true);
  };

  const handleEdit = (challenge: SlotChallenge) => {
    setEditingChallenge(challenge);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingChallenge(null);
    fetchChallenges();
  };

  const handleRefresh = async (id: string) => {
    await refreshLeaderboard(id);
    fetchChallenges();
  };

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

  const filteredChallenges = challenges.filter(c =>
    c.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <div className='relative flex flex-col min-h-screen text-white'>
      <GraphicalBackground />
      <Navbar />
      <main className='relative z-10 flex-grow'>
        <div className="container px-4 py-8 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="flex items-center gap-3 text-4xl font-bold text-[#FEFDDE]">
                <Trophy className="text-[#D2758F]" />
                Manage Slot Challenges
              </h1>
              <p className="mt-2 text-[#FEFDDE]/60">Create, edit, and manage your slot challenges</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-[#D2758F] rounded-lg hover:bg-[#C1536E]"
            >
              <Plus className="w-5 h-5" />
              Create Challenge
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute w-5 h-5 text-[#FEFDDE]/40 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="w-full py-3 pl-10 pr-4 text-[#FEFDDE] placeholder-[#FEFDDE]/40 bg-[#1a1222] border border-[#D2758F]/30 rounded-lg focus:border-[#D2758F] focus:outline-none"
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-t-2 border-b-2 border-[#D2758F] rounded-full animate-spin"></div>
            </div>
          )}

          {/* Challenges Table */}
          {!isLoading && (
            <div className="overflow-hidden border border-[#D2758F]/30 bg-[#1a1222]/80 rounded-2xl">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0E0D1D]/50">
                    <th className="px-6 py-4 text-sm font-medium text-left text-[#FEFDDE]/60">Game</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-[#FEFDDE]/60">Status</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-[#FEFDDE]/60">Target</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-[#FEFDDE]/60">Winners</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-[#FEFDDE]/60">End Date</th>
                    <th className="px-6 py-4 text-sm font-medium text-right text-[#FEFDDE]/60">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D2758F]/10">
                  {filteredChallenges.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-[#D2758F]/30" />
                        <h3 className="text-xl font-medium text-[#FEFDDE]/60">No challenges found</h3>
                        <p className="mt-2 text-[#FEFDDE]/40">
                          {searchQuery ? 'Try a different search term' : 'Create your first challenge to get started'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredChallenges.map((challenge) => {
                      const winnersCount = challenge.leaderboard.filter(r => r.isWinner).length;
                      return (
                        <tr key={challenge._id} className="transition-colors hover:bg-[#1a1222]/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {challenge.gameImageUrl ? (
                                <img
                                  src={challenge.gameImageUrl}
                                  alt={challenge.gameTitle}
                                  className="object-cover w-12 h-12 rounded-lg"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-12 h-12 bg-[#D2758F]/20 rounded-lg">
                                  <Trophy className="w-6 h-6 text-[#D2758F]" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-[#FEFDDE]">{challenge.gameTitle}</p>
                                <p className="text-sm text-[#FEFDDE]/60">{challenge.title}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(challenge.status)}`}>
                              {challenge.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-400">
                              {challenge.targetMultiplier.toLocaleString()}x
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-yellow-400" />
                              <span className="text-[#FEFDDE]">
                                {winnersCount}/{challenge.winnerCount}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#FEFDDE]/60">
                            {formatDate(challenge.endDate)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRefresh(challenge._id)}
                                disabled={isLoading}
                                className="p-2 text-[#D2758F] transition-colors rounded-lg hover:bg-[#D2758F]/20"
                                title="Refresh Leaderboard"
                              >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                              </button>
                              <Link
                                to={`/slot-challenges/${challenge._id}`}
                                className="p-2 text-blue-400 transition-colors rounded-lg hover:bg-blue-500/20"
                                title="View Challenge"
                              >
                                <Trophy className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleEdit(challenge)}
                                className="p-2 text-green-400 transition-colors rounded-lg hover:bg-green-500/20"
                                title="Edit Challenge"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Create/Edit Modal */}
      {showForm && (
        <AdminChallengeForm
          challenge={editingChallenge || undefined}
          onClose={handleCloseForm}
          onSave={handleCloseForm}
        />
      )}
    </div>
  );
}
