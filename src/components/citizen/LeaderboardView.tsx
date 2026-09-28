import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Crown,
  ArrowLeft,
  Flame
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  greenScore: number;
  totalKg: number;
  streak: number;
  isCurrentUser?: boolean;
}

export const LeaderboardView: React.FC = () => {
  const { user, navigate } = useGame();
  const [activeTab, setActiveTab] = useState<'global' | 'district' | 'friends'>('global');

  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Maya Lin', avatar: '🌱', level: 9, greenScore: 1480, totalKg: 420.5, streak: 24 },
    { rank: 2, name: 'Kenji Sato', avatar: '⚡', level: 8, greenScore: 1290, totalKg: 380.0, streak: 19 },
    { rank: 3, name: 'Elena Rostova', avatar: '🦊', level: 7, greenScore: 1120, totalKg: 310.2, streak: 15 },
    { rank: 4, name: `${user.name} (You)`, avatar: '🌟', level: user.level, greenScore: user.greenScore, totalKg: user.totalRecycledKg, streak: user.streakDays, isCurrentUser: true },
    { rank: 5, name: 'Marcus Cole', avatar: '🦁', level: 5, greenScore: 490, totalKg: 130.4, streak: 8 },
    { rank: 6, name: 'David Miller', avatar: '🦅', level: 4, greenScore: 430, totalKg: 110.0, streak: 5 },
    { rank: 7, name: 'Chloe Bennett', avatar: '🌸', level: 3, greenScore: 360, totalKg: 92.5, streak: 4 }
  ];

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

        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          {(['global', 'district', 'friends'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                activeTab === tab
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
          Sustainability Rankings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Top community recycling leaders. The top 3 ranked residents receive weekly municipal reward chests!
        </p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto pt-4 text-center items-end">
        {/* 2nd Place */}
        <div className="bg-white border border-slate-200 rounded-3xl p-3 pb-5 flex flex-col items-center shadow-xs">
          <span className="text-2xl mb-1">{leaderboardData[1].avatar}</span>
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono-numbers">
            2
          </div>
          <div className="font-bold text-xs text-slate-900 truncate max-w-full mt-1">
            {leaderboardData[1].name}
          </div>
          <span className="text-[10px] text-emerald-700 font-mono-numbers font-semibold">
            {leaderboardData[1].greenScore} pts
          </span>
        </div>

        {/* 1st Place */}
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-4 pb-7 flex flex-col items-center relative -top-2 shadow-xs">
          <Crown className="w-5 h-5 text-amber-600 mb-1" />
          <span className="text-2xl mb-1">{leaderboardData[0].avatar}</span>
          <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center font-mono-numbers shadow-xs">
            1
          </div>
          <div className="font-bold text-xs text-slate-900 truncate max-w-full mt-1">
            {leaderboardData[0].name}
          </div>
          <span className="text-xs text-amber-800 font-mono-numbers font-bold">
            {leaderboardData[0].greenScore} pts
          </span>
        </div>

        {/* 3rd Place */}
        <div className="bg-white border border-slate-200 rounded-3xl p-3 pb-5 flex flex-col items-center shadow-xs">
          <span className="text-2xl mb-1">{leaderboardData[2].avatar}</span>
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono-numbers">
            3
          </div>
          <div className="font-bold text-xs text-slate-900 truncate max-w-full mt-1">
            {leaderboardData[2].name}
          </div>
          <span className="text-[10px] text-emerald-700 font-mono-numbers font-semibold">
            {leaderboardData[2].greenScore} pts
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs space-y-2">
        {leaderboardData.map((row) => (
          <div
            key={row.rank}
            className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-colors ${
              row.isCurrentUser
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-medium'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center font-mono-numbers font-bold text-slate-400">
                #{row.rank}
              </span>
              <span className="text-lg">{row.avatar}</span>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{row.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono-numbers">
                    L{row.level}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono-numbers flex items-center gap-2 mt-0.5">
                  <span>{row.totalKg} kg diverted</span>
                  <span>·</span>
                  <span className="text-orange-600 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-orange-500" />
                    <span>{row.streak}d streak</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right font-mono-numbers">
              <div className="font-bold text-emerald-800 text-sm">
                {row.greenScore} pts
              </div>
              <span className="text-[10px] text-slate-400">Green Score</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
