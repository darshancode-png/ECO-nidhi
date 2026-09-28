import React from 'react';
import { useGame } from '../../context/GameContext';
import { Sparkles, Zap, Award, CheckCircle } from 'lucide-react';

export const CelebrationModal: React.FC = () => {
  const { celebration, closeCelebration } = useGame();

  if (!celebration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-center overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Soft background ambient */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs">
          {celebration.badge ? (
            <Award className="w-8 h-8 text-emerald-600" />
          ) : (
            <Sparkles className="w-8 h-8 text-amber-500" />
          )}
        </div>

        <h3 className="font-display font-bold text-xl text-slate-900 mb-1 tracking-tight">
          {celebration.title}
        </h3>
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          {celebration.subtitle}
        </p>

        {/* Rewards cluster */}
        <div className="flex items-center justify-center gap-2.5 mb-6 font-mono-numbers">
          {celebration.coins !== undefined && celebration.coins > 0 && (
            <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-800 font-bold text-xs">
              <span className="text-sm">🪙</span>
              <span>+{celebration.coins}</span>
            </div>
          )}

          {celebration.xp !== undefined && celebration.xp > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>+{celebration.xp} XP</span>
            </div>
          )}

          {celebration.greenScore !== undefined && celebration.greenScore > 0 && (
            <div className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-teal-800 font-bold text-xs">
              <span>🌿</span>
              <span>+{celebration.greenScore}</span>
            </div>
          )}
        </div>

        <button
          onClick={closeCelebration}
          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Claim & Continue</span>
        </button>
      </div>
    </div>
  );
};
