import React from 'react';
import { useGame } from '../../context/GameContext';
import { Icon3D, Icon3DType } from './Icon3D';
import { AppView } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentView, navigate, role } = useGame();

  if (role !== 'citizen') return null;

  const navItems: { view: AppView; label: string; icon3d: Icon3DType }[] = [
    { view: 'home', label: 'Home', icon3d: 'home' },
    { view: 'map', label: 'Map', icon3d: 'map' },
    { view: 'collect', label: 'Collect', icon3d: 'recycle' },
    { view: 'games', label: 'Games', icon3d: 'gamepad' },
    { view: 'market', label: 'Market', icon3d: 'market' },
    { view: 'profile', label: 'Profile', icon3d: 'profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 max-w-lg md:max-w-2xl mx-auto md:rounded-t-3xl shadow-xl pb-safe">
      <div className="grid grid-cols-6 items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive =
            currentView === item.view ||
            (item.view === 'collect' &&
              ['scanner', 'pickup'].includes(currentView)) ||
            (item.view === 'games' &&
              [
                'sorting_game',
                'recycling_run',
                'factory_manager',
                'clean_city',
                'waste_hunt',
                'eco_quiz',
                'community_cleanup'
              ].includes(currentView)) ||
            (item.view === 'home' &&
              ['plants', 'transport', 'missions', 'achievements', 'chests', 'skills', 'impact'].includes(
                currentView
              ));

          const isCenterCollect = item.view === 'collect';

          return (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={`flex flex-col items-center justify-center min-h-[46px] min-w-[42px] py-1 transition-all duration-200 relative select-none ${
                isActive ? 'text-emerald-800 font-bold scale-105' : 'text-slate-500 hover:text-slate-800 active:scale-95'
              }`}
            >
              {isCenterCollect ? (
                <div className="relative -top-2 flex flex-col items-center group">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 border-2 border-white group-hover:from-emerald-400 group-hover:to-emerald-600 active:scale-90 transition-all duration-200 p-1">
                    <Icon3D name="recycle" size="sm" animate={true} fluidHover={false} />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold mt-0.5 text-emerald-800 tracking-tight">
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <div className={`relative transition-transform duration-200 ${isActive ? 'translate-y-[-2px]' : ''}`}>
                    <Icon3D
                      name={item.icon3d}
                      size="sm"
                      fluidHover={false}
                      className={isActive ? 'drop-shadow-sm' : 'opacity-85 grayscale-[0.15]'}
                    />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full shadow-xs shadow-emerald-500/50" />
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-emerald-900' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

