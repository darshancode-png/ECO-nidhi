import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Factory,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { ProcessingPlant } from '../../types';

export const CircularPlants: React.FC = () => {
  const {
    plants,
    user,
    startPlantBatch,
    claimPlantBatch,
    upgradePlant,
    navigate
  } = useGame();

  const [batchQuantities, setBatchQuantities] = useState<Record<string, number>>({
    plant_organic: 30,
    plant_plastic: 50,
    plant_paper: 40,
    plant_glass: 60,
    plant_metal: 35,
    plant_ewaste: 15,
    plant_construction: 80
  });

  const handleStart = (plant: ProcessingPlant) => {
    const qty = batchQuantities[plant.id] || 25;
    startPlantBatch(plant.id, qty);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
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
          7 Municipal Transformation Mills
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Circular Processing Plants
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
          Refine raw sorted waste into high-purity industrial commodities: rPET flakes, green compost, precious minerals, and eco-pavers.
        </p>
      </div>

      {/* Grid of 7 Plants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plants.map((plant) => {
          const isMax = plant.level >= plant.maxLevel;
          const canAffordUpgrade = user.ecoCoins >= plant.upgradeCost;
          const currentQty = batchQuantities[plant.id] || 25;

          return (
            <div
              key={plant.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base">
                      {plant.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-numbers mt-0.5">
                      <span>Level {plant.level}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">{plant.efficiency}% Efficiency</span>
                      <span>·</span>
                      <span>Cap: {plant.batchCapacityKg}kg</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono-numbers">
                    {plant.category}
                  </span>
                </div>

                {/* Equation Card */}
                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">Raw Input</span>
                    <span className="font-medium text-slate-800">{plant.inputName}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mx-2" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Refined Output</span>
                    <span className="font-bold text-emerald-800">{plant.outputName}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                {plant.isProcessing ? (
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex justify-between text-xs font-mono-numbers">
                      <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Refining Batch ({plant.currentBatchKg} kg)</span>
                      </span>
                      <span className="text-slate-600">{plant.batchTimeRemaining}s remaining</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-1000"
                        style={{
                          width: `${Math.round(
                            ((plant.batchDurationSeconds - plant.batchTimeRemaining) /
                              plant.batchDurationSeconds) *
                              100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                ) : plant.unclaimedOutputKg > 0 ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Batch Ready to Sell!</span>
                      </div>
                      <div className="text-xs text-emerald-800 font-mono-numbers mt-0.5">
                        Yield: {plant.unclaimedOutputKg} kg of {plant.outputName}
                      </div>
                    </div>
                    <button
                      onClick={() => claimPlantBatch(plant.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Sell & Claim
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Queue Batch Size</span>
                      <span className="text-emerald-700 font-mono-numbers font-bold">{currentQty} kg</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max={plant.batchCapacityKg}
                      step="5"
                      value={currentQty}
                      onChange={(e) =>
                        setBatchQuantities((prev) => ({
                          ...prev,
                          [plant.id]: parseInt(e.target.value)
                        }))
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <button
                      onClick={() => handleStart(plant)}
                      className="w-full h-9 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Start Refining ({plant.batchDurationSeconds}s)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Upgrade Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono-numbers">
                  Market Value: ~🪙{plant.outputMarketValuePerKg}/kg
                </span>

                {isMax ? (
                  <span className="text-[11px] font-semibold text-slate-400">Max Tier</span>
                ) : (
                  <button
                    onClick={() => upgradePlant(plant.id)}
                    disabled={!canAffordUpgrade}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold font-mono-numbers flex items-center gap-1 transition-all cursor-pointer ${
                      canAffordUpgrade
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Upgrade Plant</span>
                    <span>· 🪙 {plant.upgradeCost}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
