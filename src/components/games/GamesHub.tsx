import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import { SortingMiniGame } from '../citizen/SortingMiniGame';
import { RecyclingRunGame } from './RecyclingRunGame';
import { FactoryManagerGame } from './FactoryManagerGame';
import { WasteHuntGame } from './WasteHuntGame';
import { EcoQuizGame } from './EcoQuizGame';
import { CommunityCleanupGame } from './CommunityCleanupGame';
import { EcoCityBuilder } from '../citizen/EcoCityBuilder';
import {
  Gamepad2,
  Trophy,
  Flame,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';

export const GamesHub: React.FC = () => {
  const { user, navigate } = useGame();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const gamesList = [
    {
      id: 'sort_master',
      num: 1,
      title: 'Sort Master',
      tagline: 'Arcade Drag & Drop Conveyor',
      description: 'Sort conveyor waste into Compost, Plastic, Paper & Metal bins. Build combo multipliers for XP and unlock the Perfect Sort achievement!',
      icon3d: 'gamepad' as const,
      difficulty: 'Fast Reflexes',
      rewardText: '+150 Coins · +100 XP',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Combo Multipliers'
    },
    {
      id: 'recycling_run',
      num: 2,
      title: 'Recycling Run',
      tagline: 'Route Optimization & Fuel Puzzle',
      description: 'Navigate an electric collection truck through city sectors avoiding traffic bottlenecks. Teaches fleet efficiency and zero-emission transit.',
      icon3d: 'truck' as const,
      difficulty: 'Strategy',
      rewardText: '+180 Coins · +120 XP',
      color: 'from-amber-500 to-orange-600',
      badge: 'Route Efficiency'
    },
    {
      id: 'factory_manager',
      num: 3,
      title: 'Factory Manager',
      tagline: 'Circular Recovery Plant Simulator',
      description: 'Manage an industrial secondary polymer plant. Balance raw waste input, shredder and extruder machine capacities, energy draw, and market yields.',
      icon3d: 'plant' as const,
      difficulty: 'Simulation',
      rewardText: '+240 Coins · +160 XP',
      color: 'from-blue-500 to-indigo-600',
      badge: 'Machinery Upgrades'
    },
    {
      id: 'clean_city',
      num: 4,
      title: 'Clean City Builder',
      tagline: 'Virtual Municipal Metagame',
      description: 'Build and upgrade sustainable districts (solar microgrids, bio-gas digesters, urban forests). Real-world recycling activity unlocks greater city progress!',
      icon3d: 'home' as const,
      difficulty: 'Progression',
      rewardText: '+200 Green Score',
      color: 'from-emerald-600 to-green-700',
      badge: 'City Metagame'
    },
    {
      id: 'waste_hunt',
      num: 5,
      title: 'Waste Hunt',
      tagline: 'Timed Hidden Recyclables Spotter',
      description: 'Identify and tap hidden recyclable packaging scattered in a realistic neighborhood street and market scene before the 35-second timer expires.',
      icon3d: 'camera' as const,
      difficulty: 'Observation',
      rewardText: '+160 Coins · +110 XP',
      color: 'from-teal-500 to-emerald-700',
      badge: '35s Timer'
    },
    {
      id: 'eco_quiz',
      num: 6,
      title: 'Eco Quiz Challenge',
      tagline: '5-Question Segregation Trivia',
      description: 'Test your knowledge on wet vs dry waste, hazardous e-waste, composting, and plastic recycling codes with instant educational explanations.',
      icon3d: 'trophy' as const,
      difficulty: 'Knowledge',
      rewardText: '+200 Coins · +150 XP',
      color: 'from-purple-500 to-indigo-600',
      badge: 'Certifications'
    },
    {
      id: 'community_cleanup',
      num: 7,
      title: 'Community Cleanup',
      tagline: 'Civic Team Ward Challenge',
      description: 'Collaborate with your municipal neighborhood team to pool recycling points toward a shared 10,000 kg milestone and unlock public solar parks.',
      icon3d: 'recycle' as const,
      difficulty: 'Co-op Civic',
      rewardText: '+250 Coins · +200 XP',
      color: 'from-emerald-700 to-teal-800',
      badge: 'Ward Drive'
    }
  ];

  const handleLaunchGame = (id: string) => {
    sound.playTap();
    setActiveGameId(id);
  };

  // Render individual game if active
  if (activeGameId === 'sort_master') {
    return <SortingMiniGame />;
  }
  if (activeGameId === 'recycling_run') {
    return <RecyclingRunGame onBack={() => setActiveGameId(null)} />;
  }
  if (activeGameId === 'factory_manager') {
    return <FactoryManagerGame onBack={() => setActiveGameId(null)} />;
  }
  if (activeGameId === 'clean_city') {
    return <EcoCityBuilder />;
  }
  if (activeGameId === 'waste_hunt') {
    return <WasteHuntGame onBack={() => setActiveGameId(null)} />;
  }
  if (activeGameId === 'eco_quiz') {
    return <EcoQuizGame onBack={() => setActiveGameId(null)} />;
  }
  if (activeGameId === 'community_cleanup') {
    return <CommunityCleanupGame onBack={() => setActiveGameId(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
              <Gamepad2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Eco Education Arcade
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
            EcoNidhi Games
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            7 interactive games connected directly to real-world segregation, route efficiency, recycling factories, and community cleanups.
          </p>
        </div>

        {/* Player Arcade Status Badge */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs self-start sm:self-auto font-mono-numbers">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-1">
            <Icon3D name="gamepad" size="sm" fluidHover={false} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Arcade Tier L{user.level}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">{user.ecoCoins} Coins Earned</div>
          </div>
        </div>
      </div>

      {/* 7 Educational Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gamesList.map((game) => (
          <div
            key={game.id}
            onClick={() => handleLaunchGame(game.id)}
            className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-3xl p-5 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between space-y-4 fluid-card select-none group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                  <Icon3D name={game.icon3d} size="md" fluidHover={false} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono-numbers">
                    GAME {game.num}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                    {game.badge}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  {game.tagline}
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg group-hover:text-emerald-800 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {game.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono-numbers font-semibold text-slate-500">
                Reward: <strong className="text-amber-800">{game.rewardText}</strong>
              </span>

              <div className="flex items-center gap-1.5 font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                <span>Play Now</span>
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
