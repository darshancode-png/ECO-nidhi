import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Award,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const MissionsQuests: React.FC = () => {
  const { missions, claimMission, navigate } = useGame();
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');

  const filteredMissions = missions.filter((m) =>
    filter === 'all' ? true : m.category === filter
  );

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

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          {(['all', 'daily', 'weekly', 'special'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Missions & Community Quests
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Complete daily tasks, weekly recycling goals, and special events to earn bonus XP and Eco Coins.
        </p>
      </div>

      {/* Missions List */}
      <div className="space-y-3">
        {filteredMissions.map((m) => {
          const progressPercent = Math.min(
            100,
            Math.round((m.currentProgress / m.targetProgress) * 100)
          );
          const isComplete = m.currentProgress >= m.targetProgress;

          return (
            <div
              key={m.id}
              className={`bg-white border rounded-3xl p-5 shadow-xs transition-all ${
                m.claimed
                  ? 'border-slate-200 opacity-60'
                  : isComplete
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono-numbers">
                      {m.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono-numbers">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{m.expiresInText}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-slate-900 text-base">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600">{m.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono-numbers">
                  <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-800 font-bold text-xs">
                    🪙 +{m.rewardCoins}
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-800 font-bold text-xs">
                    ⚡ +{m.rewardXP} XP
                  </span>
                </div>
              </div>

              {/* Progress Bar & Claim */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 space-y-1 font-mono-numbers">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>
                      {m.currentProgress} / {m.targetProgress} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {m.claimed ? (
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1 self-end sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Claimed</span>
                  </span>
                ) : isComplete ? (
                  <button
                    onClick={() => claimMission(m.id)}
                    className="h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium self-end sm:self-auto">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
