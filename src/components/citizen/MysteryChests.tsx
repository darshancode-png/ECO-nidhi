import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Sparkles,
  ArrowLeft,
  Crown,
  Shield,
  Sprout
} from 'lucide-react';

export const MysteryChests: React.FC = () => {
  const { user, spendCoins, openChest, navigate } = useGame();
  const [openingTier, setOpeningTier] = useState<string | null>(null);

  const chests: {
    tier: 'green' | 'titanium' | 'mythic';
    name: string;
    cost: number;
    description: string;
    drops: string;
    icon: React.ReactNode;
  }[] = [
    {
      tier: 'green',
      name: 'Community Green Chest',
      cost: 200,
      description: 'Standard local resident cache containing starter coins, XP and compost acceleration vouchers.',
      drops: '120-320 Coins · 80-180 XP · Common Tokens',
      icon: <Sprout className="w-8 h-8 text-emerald-600" />
    },
    {
      tier: 'titanium',
      name: 'Titanium Recycler Chest',
      cost: 650,
      description: 'Heavy reinforced industrial container packed with high coin bounties and vehicle speed parts.',
      drops: '300-750 Coins · 200-450 XP · Truck Mods',
      icon: <Shield className="w-8 h-8 text-blue-600" />
    },
    {
      tier: 'mythic',
      name: 'Solar Sovereign Coffer',
      cost: 1500,
      description: 'Grand municipal award coffer overflowing with jackpot coins and zero-landfill cores.',
      drops: '800-2000 Coins · 500-1100 XP · Rare Artifacts',
      icon: <Crown className="w-8 h-8 text-amber-600" />
    }
  ];

  const handleOpen = (tier: 'green' | 'titanium' | 'mythic', cost: number) => {
    if (user.ecoCoins < cost) return;
    spendCoins(cost);
    setOpeningTier(tier);

    setTimeout(() => {
      openChest(tier);
      setOpeningTier(null);
    }, 500);
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
        <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-semibold font-mono-numbers">
          🪙 {user.ecoCoins} Coins Balance
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Mystery Eco Chests
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Open community reward drops to unlock bonus coins, XP bursts, and plant acceleration tokens.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chests.map((chest) => {
          const canAfford = user.ecoCoins >= chest.cost;

          return (
            <div
              key={chest.tier}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 text-center transition-all hover:shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto shadow-xs">
                {chest.icon}
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  {chest.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {chest.description}
                </p>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono-numbers">
                  {chest.drops}
                </div>
              </div>

              <button
                onClick={() => handleOpen(chest.tier, chest.cost)}
                disabled={!canAfford || !!openingTier}
                className={`w-full h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  canAfford && !openingTier
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open for 🪙 {chest.cost}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
