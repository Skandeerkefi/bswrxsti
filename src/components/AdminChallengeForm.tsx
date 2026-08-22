import { useState } from 'react';
import { useSlotChallengeStore, SlotChallenge } from '@/store/useSlotChallengeStore';
import { X, Search, Trophy, Save, Trash2, RefreshCw } from 'lucide-react';

// Helper function to extract gameId from URL
// URL format: https://roobet.com/casino/game/hacksaw:1787
// Returns: hacksaw:1787
const extractGameIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/\/game\/([^/]+)/);
  return match ? match[1] : null;
};

interface SlotSearchResult {
  name?: string;
  title?: string;
  image?: string;
  img?: string;
  url?: string;
  provider?: string;
}

interface AdminChallengeFormProps {
  challenge?: SlotChallenge;
  onClose: () => void;
  onSave: () => void;
}

export default function AdminChallengeForm({ challenge, onClose, onSave }: AdminChallengeFormProps) {
  const { createChallenge, updateChallenge, deleteChallenge, searchSlots, refreshLeaderboard } = useSlotChallengeStore();
  
  const [formData, setFormData] = useState({
    title: challenge?.title || '',
    gameTitle: challenge?.gameTitle || '',
    gameImageUrl: challenge?.gameImageUrl || '',
    gameProvider: challenge?.gameProvider || '',
    minBet: challenge?.minBet || 0.2,
    targetMultiplier: challenge?.targetMultiplier || 1000,
    winnerCount: challenge?.winnerCount || 3,
    winnerSelectionMode: challenge?.winnerSelectionMode || 'firstComeFirstServed',
    startDate: challenge?.startDate ? new Date(challenge.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    endDate: challenge?.endDate ? new Date(challenge.endDate).toISOString().slice(0, 16) : '',
    gameId: challenge?.gameId || null, // Extracted from slot URL when selecting a game
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SlotSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!challenge;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchSlots(searchQuery);
      // Ensure results is an array
      const resultsArray = Array.isArray(results) ? results : [];
      setSearchResults(resultsArray);
      setShowSearchResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setError('Failed to search slots');
    } finally {
      setIsSearching(false);
    }
  };

  const selectGame = (slot: SlotSearchResult) => {
    console.log("Selecting slot:", slot);
    const gameId = extractGameIdFromUrl(slot.url || '');
    console.log("Extracted gameId:", gameId);
    setFormData(prev => ({
      ...prev,
      gameTitle: slot.name || slot.title || '',
      gameImageUrl: slot.image || slot.img || '',
      gameProvider: slot.provider || '',
      gameId: gameId,
    }));
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gameTitle) {
      setError('Please select a game');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const data = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (isEditing && challenge) {
        await updateChallenge(challenge._id, data);
      } else {
        await createChallenge(data);
      }
      
      onSave();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save challenge';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!challenge || !confirm('Are you sure you want to delete this challenge?')) return;
    
    const success = await deleteChallenge(challenge._id);
    if (success) {
      onSave();
    }
  };

  const handleRefresh = async () => {
    if (!challenge) return;
    
    await refreshLeaderboard(challenge._id);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 rounded-2xl border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gray-800 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Challenge' : 'Create New Challenge'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 text-red-400 border rounded-lg bg-red-500/10 border-red-500/50">
              {error}
            </div>
          )}

          {/* Game Search */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Select Game <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    placeholder="Search for a slot game..."
                    className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-500 bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-4 py-3 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-800"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-64">
                  {searchResults.map((slot, index) => (
                    <button
                      key={`${slot.name}-${index}`}
                      type="button"
                      onClick={() => selectGame(slot)}
                      className="flex items-center w-full gap-4 p-3 text-left transition-colors hover:bg-gray-800"
                    >
                      <img
                        src={slot.image}
                        alt={slot.name}
                        className="object-cover w-12 h-12 rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect fill="%23374151" width="24" height="24"/></svg>';
                        }}
                      />
                      <div>
                        <p className="font-medium text-white">{slot.name}</p>
                        {slot.provider && (
                          <p className="text-sm text-gray-400">{slot.provider}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Game Preview */}
            {formData.gameTitle && (
              <div className="flex items-center gap-4 p-3 mt-3 border border-gray-700 rounded-lg bg-gray-900/50">
                {formData.gameImageUrl ? (
                  <img
                    src={formData.gameImageUrl}
                    alt={formData.gameTitle}
                    className="object-cover w-16 h-16 rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-lg">
                    <Trophy className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{formData.gameTitle}</p>
                  {formData.gameProvider && (
                    <p className="text-sm text-gray-400">{formData.gameProvider}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Challenge Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Auto-generated if empty"
              className="w-full px-4 py-3 text-white placeholder-gray-500 bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Min Bet & Target Multiplier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Minimum Bet ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.minBet}
                onChange={(e) => setFormData(prev => ({ ...prev, minBet: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-3 text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Target Multiplier (x) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.targetMultiplier}
                onChange={(e) => setFormData(prev => ({ ...prev, targetMultiplier: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Winner Count & Selection Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Number of Winners <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.winnerCount}
                onChange={(e) => setFormData(prev => ({ ...prev, winnerCount: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Winner Selection
              </label>
              <select
                value={formData.winnerSelectionMode}
                onChange={(e) => setFormData(prev => ({ ...prev, winnerSelectionMode: e.target.value as 'firstComeFirstServed' | 'topPerformers' }))}
                className="w-full px-4 py-3 text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="firstComeFirstServed">First Come, First Served</option>
                <option value="topPerformers">Top Performers (at end)</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                End Date (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 text-white bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
            {isEditing && (
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-purple-400 transition-colors border border-purple-500 rounded-lg hover:bg-purple-500/10"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Now
              </button>
            )}
            <div className="flex-1" />
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-400 transition-colors border border-red-500 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-800"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
