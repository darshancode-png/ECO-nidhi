import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import {
  ArrowLeft,
  Users,
  Trophy,
  Target,
  Sparkles,
  TreePine,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

interface CommunityDrive {
  id: string;
  wardName: string;
  zone: string;
  goalKg: number;
  currentKg: number;
  participantsCount: number;
  rewardRewardTitle: string;
}

export const CommunityCleanupGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, addCoins, addXP } = useGame();

  const [activeWard, setActiveWard] = useState<CommunityDrive>({
    id: 'ward_sector4',
    wardName: 'Ward 14 · Sustainable Sector 4',
    zone: 'East Smart Municipal Division',
    goalKg: 10000,
    currentKg: 7820,
    participantsCount: 428,
    rewardRewardTitle: 'Ward Solar Microgrid & Public Tree Canopy'
  });

  const [personalContributedKg, setPersonalContributedKg] = useState<number>(35);
  const [pledgeMessage, setPledgeMessage] = useState<string | null>(null);

  const wardTeams = [
    { rank: 1, name: 'Ward 14 · Sector 4', kg: 7820, active: true },
    { rank: 2, name: 'Ward 08 · Green Park', kg: 6940, active: false },
    { rank: 3, name: 'Ward 22 · Metro Station Corridor', kg: 5810, active: false },
    { rank: 4, name: 'Ward 03 · Lakeside Society', kg: 4950, active: false }
  ];

  const handlePledgeRecycling = (amountKg: number) => {
    sound.playCollect();
    const coinsWon = amountKg * 4;
    const xpWon = amountKg * 5;
    addCoins(coinsWon);
    addXP(xpWon);

    setActiveWard(prev => ({
      ...prev,
      currentKg: Math.min(prev.goalKg, prev.currentKg + amountKg),
      participantsCount: prev.participantsCount + 1
    }));
    setPersonalContributedKg(p => p + amountKg);
    setPledgeMessage(`Awesome! You contributed ${amountKg} kg to your Ward Goal. Earned +${coinsWon} Eco Coins & +${xpWon} XP!`);
  };

  const progressPercent = Math.min(100, Math.round((activeWard.currentKg / activeWard.goalKg) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </button>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono-numbers">
          Game 7: Community Cleanup
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Civic Community Cleanup Drive
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
          Join your local ward team. Pool your segregated recyclables to reach the 10,000 kg municipal diversion milestone and unlock community solar infrastructure!
        </p>
      </div>

      {/* Main Ward Goal Progress Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                Active Ward Team
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mt-1">
              {activeWard.wardName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeWard.zone} · {activeWard.participantsCount} Citizens Contributing
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 font-mono-numbers block">
              {activeWard.currentKg.toLocaleString()} / {activeWard.goalKg.toLocaleString()} kg
            </span>
            <span className="text-xs text-slate-400">
              {progressPercent}% Milestone Complete
            </span>
          </div>
        </div>

        {/* Fluid Milestone Progress Bar */}
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Community Unlock Target Details */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-2xs shrink-0">
            <Icon3D name="plant" size="md" fluidHover={false} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
              Target Reward for Ward
            </span>
            <div className="font-display font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
              {activeWard.rewardRewardTitle}
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Reaching 10,000 kg diverts 14 tons of landfill CO₂ and qualifies our ward for municipal green grants!
            </p>
          </div>
        </div>

        {/* Personal Contribution & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          {pledgeMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold text-center font-mono-numbers">
              {pledgeMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-mono-numbers">
              Your Contribution: <strong className="text-emerald-800">{personalContributedKg} kg</strong>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handlePledgeRecycling(10)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                + Pledge 10 kg
              </button>
              <button
                onClick={() => handlePledgeRecycling(25)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                + Pledge 25 kg
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ward Leaderboard */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="font-display font-bold text-slate-900 text-base">
          Municipal Ward Leaderboard
        </h3>
        <div className="divide-y divide-slate-100">
          {wardTeams.map((team) => (
            <div key={team.rank} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs font-mono-numbers ${
                  team.rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  #{team.rank}
                </span>
                <span className={`font-semibold ${team.active ? 'text-emerald-800 font-bold' : 'text-slate-800'}`}>
                  {team.name} {team.active && '(Your Ward)'}
                </span>
              </div>
              <span className="font-mono-numbers font-bold text-slate-700">
                {team.kg.toLocaleString()} kg diverted
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
