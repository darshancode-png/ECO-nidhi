import React from 'react';
import { useGame } from '../../context/GameContext';
import { EcoCityBackdrop } from './EcoCityBackdrop';
import { CityBuildingGraphic } from './CityDistrictSvg';
import { Icon3D } from '../common/Icon3D';
import {
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  Leaf
} from 'lucide-react';

export const EcoCityBuilder: React.FC = () => {
  const {
    user,
    buildings,
    cityStage,
    missions,
    claimMission,
    upgradeBuilding,
    navigate
  } = useGame();

  const activeDailyMission = missions.find(m => m.category === 'daily' && !m.claimed) || missions[0];

  const quickFeatures = [
    { view: 'games', title: '7 Eco Games', icon: 'gamepad' as const, tag: 'Arcade Hub' },
    { view: 'impact', title: 'My Impact', icon: 'leaf' as const, tag: 'CO2 Audit' },
    { view: 'plants', title: 'Recycle Plants', icon: 'plant' as const, tag: 'Industrial' },
    { view: 'leaderboard', title: 'Rankings', icon: 'trophy' as const, tag: 'Top 10' }
  ];

  const recentActivities = [
    {
      id: 'act_1',
      title: 'Recycled Plastic Scrap & Bottles',
      amount: '18.2 kg diverted',
      reward: '+140 Coins',
      time: '2 hours ago',
      icon3d: 'recycle' as const
    },
    {
      id: 'act_2',
      title: 'Biogas Humus Plant Output Sold',
      amount: '34 kg compost delivered',
      reward: '+119 Coins',
      time: 'Yesterday',
      icon3d: 'plant' as const
    },
    {
      id: 'act_3',
      title: 'Completed Conveyor Sorting Run',
      amount: '12 items sorted (x3 combo)',
      reward: '+84 Coins',
      time: '2 days ago',
      icon3d: 'gamepad' as const
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6">
      {/* 1. Welcome Message & Telemetry Highlights */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs fluid-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1 shadow-2xs">
              <Icon3D name="profile" size="md" fluidHover={true} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  {getGreeting()}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-500">Sector 4</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight mt-0.5">
                {user.name}
              </h1>
            </div>
          </div>

          {/* Level and XP Fluid Badge */}
          <div className="flex items-center gap-3 bg-emerald-50/90 border border-emerald-200/90 p-2.5 px-4 rounded-2xl self-start sm:self-auto shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-display font-bold text-xs flex items-center justify-center shadow-xs">
              L{user.level}
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-950 font-mono-numbers gap-4">
                <span>Eco Level {user.level}</span>
                <span>{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <div className="w-32 bg-emerald-200/70 h-2 rounded-full overflow-hidden mt-1 p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-300 shadow-2xs"
                  style={{ width: `${Math.min(100, (user.xp / user.xpToNextLevel) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats: Eco Coins & Green Score Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100 font-mono-numbers">
          <div
            onClick={() => navigate('market')}
            className="flex items-center gap-2.5 bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/80 p-2.5 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-2xs">
              <Icon3D name="coin" size="xs" fluidHover={false} />
            </div>
            <div>
              <span className="text-[10px] text-amber-800 font-sans block font-semibold">ECO COINS</span>
              <span className="text-sm font-bold text-amber-950">{user.ecoCoins.toLocaleString()}</span>
            </div>
          </div>

          <div
            onClick={() => navigate('impact')}
            className="flex items-center gap-2.5 bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/80 p-2.5 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-2xs">
              <Icon3D name="leaf" size="xs" fluidHover={false} />
            </div>
            <div>
              <span className="text-[10px] text-emerald-800 font-sans block font-semibold">GREEN SCORE</span>
              <span className="text-sm font-bold text-emerald-950">{user.greenScore} pts</span>
            </div>
          </div>

          <div
            onClick={() => navigate('profile')}
            className="hidden sm:flex items-center gap-2.5 bg-orange-50/80 hover:bg-orange-100/70 border border-orange-200/80 p-2.5 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-2xs">
              <Icon3D name="flame" size="xs" fluidHover={false} />
            </div>
            <div>
              <span className="text-[10px] text-orange-800 font-sans block font-semibold">DAILY STREAK</span>
              <span className="text-sm font-bold text-orange-950">{user.streakDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Realistic Indian Eco City Backdrop Banner */}
      <EcoCityBackdrop />

      {/* 3. Primary Large Buttons: "Scan Waste" & "Request Pickup" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Large "Scan Waste" Button */}
        <div
          onClick={() => navigate('scanner')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between group relative overflow-hidden select-none"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-1.5 mb-3 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <Icon3D name="camera" size="md" animate={true} fluidHover={false} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full text-white">
                AI Vision
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              Scan Waste
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-xs leading-relaxed">
              Identify waste material, get correct bin guidance, and earn Eco Coins instantly.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Icon3D name="coin" size="xs" fluidHover={false} />
              <span className="text-xs font-bold text-white font-mono-numbers">+35 Coins</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Large "Request Pickup" Button */}
        <div
          onClick={() => navigate('pickup')}
          className="bg-white hover:bg-amber-50/40 border-2 border-emerald-600/40 hover:border-emerald-600 rounded-3xl p-6 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between group select-none"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center p-1.5 mb-3 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <Icon3D name="truck" size="md" fluidHover={false} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-mono-numbers">
                Express Route
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              Request Pickup
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
              Schedule doorstep electric hauler collection with certified digital scales.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl font-mono-numbers">
              <span className="text-xs font-semibold text-slate-700">Digital Scale Certified</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick 3D Navigation Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickFeatures.map((feat) => (
          <button
            key={feat.view}
            onClick={() => navigate(feat.view as any)}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-all duration-200 active:scale-95 group shadow-xs cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Icon3D name={feat.icon} size="sm" fluidHover={false} />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              {feat.title}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {feat.tag}
            </span>
          </button>
        ))}
      </div>

      {/* 5. Active Daily Mission Card */}
      {activeDailyMission && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3 fluid-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon3D name="trophy" size="xs" fluidHover={false} />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Today's Green Mission
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono-numbers">
              Expires in {activeDailyMission.expiresInText}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                {activeDailyMission.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {activeDailyMission.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80">
                <Icon3D name="coin" size="xs" fluidHover={false} />
                <span>+{activeDailyMission.rewardCoins}</span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80">
                ⚡ +{activeDailyMission.rewardXP} XP
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono-numbers">
                <span>Progress</span>
                <span>
                  {activeDailyMission.currentProgress} / {activeDailyMission.targetProgress}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (activeDailyMission.currentProgress / activeDailyMission.targetProgress) * 100
                    )}%`
                  }}
                />
              </div>
            </div>

            {activeDailyMission.currentProgress >= activeDailyMission.targetProgress ? (
              <button
                onClick={() => claimMission(activeDailyMission.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Claim Reward
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                In progress
              </span>
            )}
          </div>
        </div>
      )}

      {/* 5b. Personal Environmental Impact Summary */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 fluid-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1 shadow-2xs">
              <Icon3D name="leaf" size="sm" fluidHover={false} />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Your Personal Impact
              </h3>
              <p className="text-xs text-slate-500">
                Verified waste diverted from municipal open landfills
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('impact')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Full Audit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-numbers text-center">
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] text-slate-500 font-sans block">RECYCLED</span>
            <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{user.totalRecycledKg} kg</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] text-slate-500 font-sans block">CO₂ AVOIDED</span>
            <span className="text-sm font-bold text-teal-700 mt-0.5 block">{user.co2DivertedKg} kg</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] text-slate-500 font-sans block">TREES SAVED</span>
            <span className="text-sm font-bold text-amber-700 mt-0.5 block">{user.treesSaved} 🌳</span>
          </div>
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] text-slate-500 font-sans block">WATER SAVED</span>
            <span className="text-sm font-bold text-blue-700 mt-0.5 block">{user.waterSavedLiters} L</span>
          </div>
        </div>
      </div>

      {/* 6. City Progress & Infrastructure Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 fluid-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1">
              <Icon3D name="home" size="sm" fluidHover={false} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-slate-900">
                City Progress & Facilities
              </h2>
              <p className="text-xs text-slate-500">
                Neighborhood development: <span className="font-semibold text-emerald-800">{cityStage}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 font-mono-numbers">
              {user.greenScore} / 1000 Green Score
            </span>
          </div>
        </div>

        {/* Fluid Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 h-full rounded-full transition-all duration-500 animate-fluid-wave"
            style={{ width: `${Math.min(100, (user.greenScore / 1000) * 100)}%` }}
          />
        </div>

        {/* Compact Grid of Municipal Buildings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {buildings.slice(0, 3).map((building) => {
            const upgradeCost = Math.round(
              building.baseCost * Math.pow(building.costMultiplier, building.level - 1)
            );
            const canAfford = user.ecoCoins >= upgradeCost;

            return (
              <div
                key={building.id}
                className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-2 fluid-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {building.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono-numbers">
                      Level {building.level} · +{building.coinGenerationPerMin * building.level} coins/min
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono-numbers">
                    +{building.greenScoreBonus} pts
                  </span>
                </div>

                <div className="py-1">
                  <CityBuildingGraphic
                    category={building.category}
                    level={building.level}
                    unlocked={building.unlocked}
                  />
                </div>

                <button
                  onClick={() => upgradeBuilding(building.id)}
                  disabled={!canAfford}
                  className={`w-full py-1.5 rounded-xl text-xs font-semibold font-mono-numbers transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Icon3D name="coin" size="xs" fluidHover={false} />
                  <span>Upgrade · {upgradeCost}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Recent Activity Feed */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3 fluid-card">
        <h3 className="text-sm font-display font-bold text-slate-900">
          Recent Recycling Activity
        </h3>

        <div className="divide-y divide-slate-100">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-1 shadow-2xs">
                  <Icon3D name={act.icon3d} size="xs" fluidHover={false} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{act.title}</div>
                  <div className="text-slate-500 text-[11px]">{act.amount} · {act.time}</div>
                </div>
              </div>
              <span className="font-semibold font-mono-numbers text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                {act.reward}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
