import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Icon3D } from './Icon3D';
import {
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  Sparkles,
  Zap,
  Flame,
  ChevronDown,
  User,
  Truck,
  ShieldAlert,
  Leaf
} from 'lucide-react';
import { Role } from '../../types';

export const TopGameBar: React.FC = () => {
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
    navigate,
    cityStage
  } = useGame();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

  const roleLabels: Record<Role, { title: string; icon: React.ReactNode; color: string }> = {
    citizen: { title: 'Citizen', icon: <User className="w-3.5 h-3.5" />, color: 'text-emerald-700' },
    collector: { title: 'Collector', icon: <Truck className="w-3.5 h-3.5" />, color: 'text-amber-700' },
    admin: { title: 'Admin', icon: <ShieldAlert className="w-3.5 h-3.5" />, color: 'text-blue-700' }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Zone 1: Brand Wordmark */}
        <div
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
          onClick={() => navigate('home')}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 p-1">
            <Icon3D name="recycle" size="sm" animate={true} fluidHover={false} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-none">
              Eco<span className="text-emerald-600">Nidhi</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-medium hidden sm:inline mt-0.5">
              Turn Waste Into Value
            </span>
          </div>
        </div>

        {/* Zone 2: Clean Telemetry Stats */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {/* Level & XP Mini Bar */}
          <div
            className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-2xl px-2.5 py-1 cursor-pointer transition-all duration-150 active:scale-95 shrink-0"
            onClick={() => navigate('profile')}
            title="Level and XP"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white font-display font-bold text-[11px] flex items-center justify-center shadow-2xs">
              {user.level}
            </div>
            <div className="hidden md:flex flex-col w-16">
              <div className="flex justify-between text-[9px] text-slate-500 font-mono-numbers font-medium">
                <span>XP</span>
                <span>{user.xp}/{user.xpToNextLevel}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Eco Coins */}
          <div
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/90 text-amber-900 px-2.5 py-1 rounded-2xl font-mono-numbers text-xs sm:text-sm font-semibold cursor-pointer hover:bg-amber-100/80 transition-all duration-150 active:scale-95 shrink-0"
            onClick={() => navigate('market')}
            title="Eco Coins Balance"
          >
            <Icon3D name="coin" size="xs" fluidHover={false} />
            <span>{user.ecoCoins.toLocaleString()}</span>
          </div>

          {/* Green Score */}
          <div
            className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/90 text-emerald-900 px-2.5 py-1 rounded-2xl text-xs font-semibold cursor-pointer hover:bg-emerald-100/80 transition-all duration-150 active:scale-95 shrink-0"
            onClick={() => navigate('home')}
            title="City Green Score"
          >
            <Icon3D name="leaf" size="xs" fluidHover={false} />
            <span className="font-mono-numbers font-bold">{user.greenScore}</span>
            <span className="text-slate-500 text-[11px] hidden lg:inline">· {cityStage}</span>
          </div>

          {/* Streak */}
          <div
            className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 text-orange-900 px-2.5 py-1 rounded-2xl text-xs font-bold font-mono-numbers shrink-0"
            title={`${user.streakDays} Day Streak`}
          >
            <Icon3D name="flame" size="xs" fluidHover={false} />
            <span>{user.streakDays}d</span>
          </div>
        </div>

        {/* Zone 3: Audio Toggle, Role Switcher, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Audio Sound FX Switch */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title={soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Background Ambient Music Switch */}
          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              musicEnabled
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-400'
            }`}
            title={musicEnabled ? 'Ambient Music On' : 'Ambient Music Off'}
            aria-label="Toggle Music"
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              aria-label="Select Role"
            >
              <span className={roleLabels[role].color}>{roleLabels[role].icon}</span>
              <span className="hidden sm:inline capitalize">{roleLabels[role].title}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Active Persona
                </div>
                {(['citizen', 'collector', 'admin'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === r ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={roleLabels[r].color}>{roleLabels[r].icon}</span>
                      <span className="capitalize">{roleLabels[r].title}</span>
                    </div>
                    {role === r && <span className="text-[10px] text-emerald-600">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile trigger */}
          <button
            onClick={() => navigate('profile')}
            className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
