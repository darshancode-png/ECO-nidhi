import React from 'react';
import { useGame } from '../../context/GameContext';
import { Icon3D, Icon3DType } from '../common/Icon3D';
import { ArrowRight, Leaf } from 'lucide-react';

export const QuickCollectHub: React.FC = () => {
  const { navigate, user } = useGame();

  const actions: {
    id: string;
    title: string;
    subtitle: string;
    icon3d: Icon3DType;
    tag: string;
    bg: string;
    action: () => void;
  }[] = [
    {
      id: 'scanner',
      title: 'AI Optical Waste Scanner',
      subtitle: 'Identify packaging plastics, paper, and e-waste to claim instant coins and proper bin advice',
      icon3d: 'camera',
      tag: 'AI Camera · Instant XP',
      bg: 'bg-emerald-50/80 border-emerald-200/90',
      action: () => navigate('scanner')
    },
    {
      id: 'pickup',
      title: 'Doorstep Hauler Collection',
      subtitle: 'Book electric hauler pickup with calibrated digital weighing at zero fee',
      icon3d: 'truck',
      tag: 'Electric Hauler · Zero Fee',
      bg: 'bg-amber-50/80 border-amber-200/90',
      action: () => navigate('pickup')
    },
    {
      id: 'sorting_game',
      title: 'Sorting Mini-Game',
      subtitle: 'Sort conveyor waste into 4 clean bins with combo multipliers and Perfect Sort challenge',
      icon3d: 'gamepad',
      tag: 'Arcade Mode · Multipliers',
      bg: 'bg-blue-50/80 border-blue-200/90',
      action: () => navigate('sorting_game')
    },
    {
      id: 'map',
      title: 'Dropoff Kiosks on Map',
      subtitle: 'Drop off bottles and batteries at reverse vending machines across your sector',
      icon3d: 'map',
      tag: 'GPS Map · Walking Distance',
      bg: 'bg-teal-50/80 border-teal-200/90',
      action: () => navigate('map')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
          Recycling Action Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Choose your recycling mode today. Every item segregated avoids landfill disposal and preserves municipal ecology.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={act.action}
            className={`p-5 rounded-3xl border ${act.bg} shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between space-y-4 fluid-card select-none group`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs border border-white/60 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-200">
                  <Icon3D name={act.icon3d} size="md" fluidHover={false} />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 font-mono-numbers shadow-2xs border border-slate-100">
                  {act.tag}
                </span>
              </div>

              <h3 className="font-display font-bold text-slate-900 text-lg mt-3 group-hover:text-emerald-800 transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {act.subtitle}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Launch Activity</span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-2xs group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Environmental Impact Summary */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3 fluid-card">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Icon3D name="leaf" size="xs" fluidHover={false} />
          <span>Your Ecological Impact to Date</span>
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center font-mono-numbers">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">DIVERTED WASTE</div>
            <div className="text-sm sm:text-base font-bold text-emerald-700 mt-0.5">
              {user.totalRecycledKg} kg
            </div>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">CO₂ AVOIDED</div>
            <div className="text-sm sm:text-base font-bold text-teal-700 mt-0.5">
              {user.co2DivertedKg} kg
            </div>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] text-slate-500 font-medium">TREES EQUIV.</div>
            <div className="text-sm sm:text-base font-bold text-amber-700 mt-0.5">
              {user.treesSaved} 🌳
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

