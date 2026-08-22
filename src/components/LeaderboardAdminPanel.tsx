import { useState, useEffect } from 'react';
import { useLeaderboardSettingsStore, Prize } from '@/store/useLeaderboardSettingsStore';
import { Calendar, Trophy, Plus, ChevronRight, Trash2, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { GraphicalBackground } from './GraphicalBackground';

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
  { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
  { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
];

const PERIOD_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly (7 days)' },
  { value: 'biweekly', label: 'Bi-weekly (14 days)' },
  { value: 'custom', label: 'Custom' },
];

type PeriodType = 'daily' | 'weekly' | 'biweekly' | 'custom';

export default function LeaderboardAdminPanel() {
  const { settings, loading, error, fetchSettings, updateSettings, advanceToNextPeriod } = useLeaderboardSettingsStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    periodType: 'biweekly' as PeriodType,
    timezone: 'America/New_York',
    currentPeriodStart: '',
    currentPeriodEnd: '',
    prizes: [] as Prize[],
    minWager: 100,
    isActive: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        title: settings.title || '',
        description: settings.description || '',
        periodType: (settings.periodType || 'biweekly') as PeriodType,
        timezone: settings.timezone || 'America/New_York',
        currentPeriodStart: settings.currentPeriodStart ? new Date(settings.currentPeriodStart).toISOString().slice(0, 16) : '',
        currentPeriodEnd: settings.currentPeriodEnd ? new Date(settings.currentPeriodEnd).toISOString().slice(0, 16) : '',
        prizes: settings.prizes || [],
        minWager: settings.minWager || 100,
        isActive: settings.isActive ?? true,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const result = await updateSettings({
        ...formData,
        currentPeriodStart: new Date(formData.currentPeriodStart).toISOString(),
        currentPeriodEnd: new Date(formData.currentPeriodEnd).toISOString(),
      });
      if (result) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdvancePeriod = async () => {
    if (!confirm('Are you sure you want to advance to the next period?')) return;
    const success = await advanceToNextPeriod();
    setSaveMessage(success ? 'Advanced to next period successfully!' : 'Failed to advance period');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { position: prev.prizes.length + 1, prize: '', currency: 'USD' }]
    }));
  };

  const updatePrize = (index: number, field: keyof Prize, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const removePrize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index).map((p, i) => ({ ...p, position: i + 1 }))
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0D1D] to-[#1a191f] text-[#FEFDDE]">
      <GraphicalBackground />
      <Navbar />
      
      <div className="px-4 py-8 sm:px-6 sm:py-12 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-[#D2758F] hover:text-[#FEFDDE] transition"><Home className="w-4 h-4" /></Link>
          <span className="text-[#D2758F]/50">/</span>
          <span className="text-[#FEFDDE]/50">Admin</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">
              <span className="text-[#D2758F]">Leaderboard</span> <span className="text-[#FEFDDE]">Settings</span>
            </h1>
            <p className="text-[#FEFDDE]/60 mt-2">Manage your leaderboard periods, prizes, and configuration</p>
          </div>
          <button onClick={handleAdvancePeriod} disabled={loading} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D2758F] hover:bg-[#C1536E] rounded-xl font-bold shadow-lg shadow-[#D2758F]/30 transition-all disabled:opacity-50">
            <ChevronRight className="w-5 h-5" />Advance Period
          </button>
        </div>

        {saveMessage && <div className={`mb-6 p-4 rounded-xl ${saveMessage.includes('Failed') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>{saveMessage}</div>}
        {error && <div className="mb-6 p-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">{error}</div>}

        {loading && !settings ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D2758F] border-t-transparent"></div></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Settings */}
            <div className="bg-[#1a191f]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D2758F]/20 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-[#D2758F]/20 rounded-lg"><Trophy className="w-5 h-5 text-[#D2758F]" /></div>General Settings
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#FEFDDE]/80 mb-2">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 bg-[#0E0D1D] border border-[#D2758F]/30 rounded-xl focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#FEFDDE]/80 mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 bg-[#0E0D1D] border border-[#D2758F]/30 rounded-xl focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE] h-24 resize-none" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-5 h-5 rounded border-[#D2758F]/30 bg-[#0E0D1D] text-[#D2758F] focus:ring-[#D2758F]" />
                  <span className="font-semibold text-[#FEFDDE]">Leaderboard Active</span>
                </label>
              </div>
            </div>

            {/* Period Settings */}
            <div className="bg-[#1a191f]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D2758F]/20 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-[#D2758F]/20 rounded-lg"><Calendar className="w-5 h-5 text-[#D2758F]" /></div>Period Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#FEFDDE]/80 mb-2">Period Type</label>
                  <select value={formData.periodType} onChange={(e) => setFormData(prev => ({ ...prev, periodType: e.target.value as PeriodType }))} className="w-full px-4 py-3 bg-[#0E0D1D] border border-[#D2758F]/30 rounded-xl focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE]">
                    {PERIOD_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#FEFDDE]/80 mb-2">Timezone</label>
                  <select value={formData.timezone} onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))} className="w-full px-4 py-3 bg-[#0E0D1D] border border-[#D2758F]/30 rounded-xl focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE]">
                    {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#FEFDDE]/80 mb-2">Start Date & Time</label>
                  <input type="datetime-local" value={formData.currentPeriodStart} onChange={(e) => setFormData(prev => ({ ...prev, currentPeriodStart: e.target.value }))} className="w-full px-4 py-3 bg-[#0E0D1D] border border-[#D2758F]/30 rounded-xl focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#FEFDDE]/80 mb-2">End Date & Time</label>
                  <input type="datetime-local" value={formData.currentPeriodEnd} onChange={(e) => setFormData(prev => ({ ...prev, currentPeriodEnd: e.target.value }))} className="w-full px-4 py-3 bg-[#0E0D1D] border border-[#D2758F]/30 rounded-xl focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE]" />
                </div>
              </div>
            </div>

            {/* Prize Settings */}
            <div className="bg-[#1a191f]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D2758F]/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-[#D2758F]/20 rounded-lg"><Trophy className="w-5 h-5 text-[#D2758F]" /></div>Prize Settings
                </h2>
                <button type="button" onClick={addPrize} className="flex items-center gap-2 px-4 py-2 bg-[#D2758F] hover:bg-[#C1536E] rounded-lg font-semibold transition-all text-sm">
                  <Plus className="w-4 h-4" />Add Prize
                </button>
              </div>
              <div className="space-y-4">
                {formData.prizes.length === 0 ? (
                  <div className="text-center py-8 text-[#FEFDDE]/50">No prizes configured. Click "Add Prize" to add prizes for the leaderboard.</div>
                ) : (
                  formData.prizes.map((prize, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-[#0E0D1D] rounded-xl border border-[#D2758F]/20">
                      <div className="flex items-center justify-center w-12 h-12 bg-[#D2758F]/20 rounded-lg text-[#D2758F] font-bold text-lg">
                        #{prize.position}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#FEFDDE]/60 mb-1">Prize Description</label>
                          <input type="text" value={prize.prize} onChange={(e) => updatePrize(index, 'prize', e.target.value)} placeholder="e.g., $500 Cash" className="w-full px-3 py-2 bg-[#1a191f] border border-[#D2758F]/30 rounded-lg focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE] text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#FEFDDE]/60 mb-1">Currency</label>
                          <select value={prize.currency} onChange={(e) => updatePrize(index, 'currency', e.target.value)} className="w-full px-3 py-2 bg-[#1a191f] border border-[#D2758F]/30 rounded-lg focus:border-[#D2758F] focus:ring-2 focus:ring-[#D2758F]/20 focus:outline-none transition-all text-[#FEFDDE] text-sm">
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                          </select>
                        </div>
                      </div>
                      <button type="button" onClick={() => removePrize(index)} className="flex items-center justify-center w-12 h-12 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex items-center justify-end pt-4">
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-4 bg-[#D2758F] hover:bg-[#C1536E] rounded-xl font-bold shadow-lg shadow-[#D2758F]/30 transition-all text-lg disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            )}
        </div>
      </div>
    );
  }