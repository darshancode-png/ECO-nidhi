import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Icon3D } from '../common/Icon3D';
import {
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  ArrowRight,
  Lock,
  LogOut,
  Trash2,
  Database,
  ShieldCheck,
  HardDrive,
  AlertTriangle,
  X
} from 'lucide-react';
import { Role } from '../../types';

export const CitizenProfile: React.FC = () => {
  const {
    user,
    role,
    switchRole,
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
    hapticsEnabled,
    setHapticsEnabled,
    authSession,
    wasteHistory,
    gameProgress,
    pickups,
    missions,
    buildings,
    plants,
    marketItems,
    logoutAuth,
    clearAllLocalData,
    navigate,
    cityStage,
    achievements
  } = useGame();

  const [showClearModal, setShowClearModal] = useState(false);
  const [showDataDetails, setShowDataDetails] = useState(false);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6 fluid-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2 shrink-0 shadow-2xs">
            <Icon3D name="profile" size="xl" animate={true} fluidHover={true} />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                {user.name}
              </h1>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold font-mono-numbers">
                Level {user.level} · Eco Resident
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Active Resident of <span className="text-emerald-700 font-semibold">{cityStage}</span>
            </p>

            {/* Quick XP progress */}
            <div className="pt-2 max-w-sm mx-auto sm:mx-0 space-y-1 font-mono-numbers">
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>XP Progress</span>
                <span>{user.xp} / {user.xpToNextLevel}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (user.xp / user.xpToNextLevel) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Eco Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numbers text-center pt-2">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">TOTAL RECYCLED</div>
            <div className="text-base font-bold text-emerald-700 mt-0.5">
              {user.totalRecycledKg} kg
            </div>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">CO₂ AVOIDED</div>
            <div className="text-base font-bold text-teal-700 mt-0.5">
              {user.co2DivertedKg} kg
            </div>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">TREES EQUIV.</div>
            <div className="text-base font-bold text-amber-700 mt-0.5">
              {user.treesSaved} 🌳
            </div>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">WATER SAVED</div>
            <div className="text-base font-bold text-blue-700 mt-0.5">
              {user.waterSavedLiters} L
            </div>
          </div>
        </div>
      </div>

      {/* Metagame & Impact Shortcuts with 3D Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => navigate('impact')}
          className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs cursor-pointer flex items-center justify-between transition-all duration-200 active:scale-[0.98] fluid-card select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform">
              <Icon3D name="leaf" size="sm" fluidHover={false} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Impact Report</div>
              <div className="text-[11px] text-slate-500 font-mono-numbers">
                CO₂ & Landfill Audit
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => navigate('achievements')}
          className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs cursor-pointer flex items-center justify-between transition-all duration-200 active:scale-[0.98] fluid-card select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform">
              <Icon3D name="trophy" size="sm" fluidHover={false} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Achievements</div>
              <div className="text-[11px] text-slate-500 font-mono-numbers">
                {unlockedCount} / {achievements.length} Badges
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => navigate('skills')}
          className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs cursor-pointer flex items-center justify-between transition-all duration-200 active:scale-[0.98] fluid-card select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform">
              <Icon3D name="plant" size="sm" fluidHover={false} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">Skill Perks</div>
              <div className="text-[11px] text-slate-500 font-mono-numbers">
                {user.skillPoints} Points Free
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-slate-900 text-base">
          Preferences & Controls
        </h3>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
            <div>
              <div className="font-semibold text-xs text-slate-900">Sound Effects (SFX)</div>
              <div className="text-[11px] text-slate-500">Short satisfying chimes for tap, scan & rewards</div>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              soundEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                soundEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Ambient Music Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Music className={`w-5 h-5 ${musicEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div>
              <div className="font-semibold text-xs text-slate-900">Ambient Music (BGM)</div>
              <div className="text-[11px] text-slate-500">Subtle relaxing lo-fi background soundscape</div>
            </div>
          </div>
          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              musicEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                musicEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Haptics */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Vibrate className={`w-5 h-5 ${hapticsEnabled ? 'text-teal-600' : 'text-slate-400'}`} />
            <div>
              <div className="font-semibold text-xs text-slate-900">Haptic Vibration</div>
              <div className="text-[11px] text-slate-500">Tactile touch buzz on buttons</div>
            </div>
          </div>
          <button
            onClick={() => setHapticsEnabled(!hapticsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              hapticsEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                hapticsEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Switch Persona */}
        <div className="py-2 border-b border-slate-100 space-y-2">
          <span className="text-xs font-semibold text-slate-800">Switch Persona:</span>
          <div className="grid grid-cols-3 gap-2">
            {(['citizen', 'collector', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  role === r
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Account & Device PIN Security */}
        <div className="py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>{authSession?.name || user.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>PIN Secured (4 digits)</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono-numbers">
              {authSession?.email || 'resident@econidhi.city'} · Active Device Session
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Logout Button */}
            <button
              type="button"
              onClick={logoutAuth}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Lock session and return to PIN screen"
            >
              <LogOut className="w-3.5 h-3.5 text-emerald-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Local Device Storage Inspector */}
        <div className="py-3 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-slate-900">Local Device Storage</span>
                <span className="block text-[11px] text-slate-500">
                  Data persists offline across app reopens in browser localStorage
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDataDetails(!showDataDetails)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
            >
              {showDataDetails ? 'Hide Details' : 'View Storage'}
            </button>
          </div>

          {showDataDetails && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-mono-numbers animate-in fade-in">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">NAME & EMAIL</span>
                  <span className="font-semibold text-slate-800">{user.name}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">PIN STATUS</span>
                  <span className="font-semibold text-emerald-700">Configured (••••)</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">XP & ECO COINS</span>
                  <span className="font-semibold text-slate-800">{user.xp} XP · {user.ecoCoins} Coins</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">LEVEL & STREAK</span>
                  <span className="font-semibold text-slate-800">Lvl {user.level} · {user.streakDays}d Streak</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">MISSIONS & BADGES</span>
                  <span className="font-semibold text-slate-800">{missions.length} Missions · {unlockedCount} Badges</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">WASTE HISTORY</span>
                  <span className="font-semibold text-slate-800">{wasteHistory.length} Diversion Records</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">PICKUP REQUESTS</span>
                  <span className="font-semibold text-slate-800">{pickups.length} Pickups Logged</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">CITY UPGRADES</span>
                  <span className="font-semibold text-slate-800">{buildings.length} Buildings · {plants.length} Plants</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Stored cleanly under structured JSON keys (econidhi_*)</span>
              </div>
            </div>
          )}
        </div>

        {/* Clear Local Data Action */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-800">Clear device storage</div>
            <div className="text-[11px] text-slate-500">Erase all local progress & registered account</div>
          </div>
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear local data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clear Local Data */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 font-display">
                Clear all local data?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will permanently delete your stored account name, email, 4-digit PIN, XP, Eco Coins, waste history, and city builder upgrades from this device.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-[11px] text-rose-800 space-y-1">
              <span className="font-bold block">This action cannot be undone.</span>
              <span>The app will restart with a fresh onboarding welcome screen.</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowClearModal(false);
                  clearAllLocalData();
                }}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer shadow-md shadow-rose-600/25 transition-colors"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
