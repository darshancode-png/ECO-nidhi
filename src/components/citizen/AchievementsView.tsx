import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Award,
  Sparkles,
  Shield,
  Sprout,
  Building,
  Crown,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { Achievement } from '../../types';

export const AchievementsView: React.FC = () => {
  const { achievements, navigate } = useGame();

  const tierColors: Record<Achievement['tier'], { border: string; bg: string; text: string }> = {
    bronze: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-800' },
    silver: { border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-800' },
    gold: { border: 'border-yellow-300', bg: 'bg-yellow-50', text: 'text-yellow-800' },
    diamond: { border: 'border-cyan-300', bg: 'bg-cyan-50', text: 'text-cyan-900' }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'shield': return <Shield className="w-5 h-5 text-blue-600" />;
      case 'sprout': return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'building': return <Building className="w-5 h-5 text-indigo-600" />;
      case 'crown': return <Crown className="w-5 h-5 text-amber-600" />;
      default: return <Award className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold font-mono-numbers">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} Badges Unlocked
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Hall of Eco Achievements
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Trophies and badges awarded for milestone contributions to urban recycling and zero-waste initiatives.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const tColor = tierColors[ach.tier];
          const progressPercent = Math.min(
            100,
            Math.round((ach.progress / ach.target) * 100)
          );

          return (
            <div
              key={ach.id}
              className={`rounded-3xl p-5 border shadow-xs flex items-start gap-4 transition-all bg-white ${
                ach.unlocked ? tColor.border : 'border-slate-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  ach.unlocked ? `${tColor.bg} ${tColor.border}` : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                {getIcon(ach.badgeIcon)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider font-mono-numbers ${tColor.text}`}>
                    {ach.tier} Tier
                  </span>
                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono-numbers">
                      {ach.progress} / {ach.target}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-slate-900 text-base">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-600 leading-snug">
                  {ach.description}
                </p>

                {!ach.unlocked && (
                  <div className="pt-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 font-mono-numbers">
                  <span>🪙 +{ach.rewardCoins}</span>
                  <span>⚡ +{ach.rewardXP} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
