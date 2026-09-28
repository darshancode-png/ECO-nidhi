import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import {
  ArrowLeft,
  Factory,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Machine {
  id: string;
  name: string;
  stage: string;
  level: number;
  maxLevel: number;
  capacityKgPerMin: number;
  energyKw: number;
  upgradeCost: number;
  icon: string;
}

export const FactoryManagerGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, addCoins, addXP } = useGame();

  const [rawInputKg, setRawInputKg] = useState<number>(150);
  const [finishedOutputKg, setFinishedOutputKg] = useState<number>(45);
  const [solarPanelsLevel, setSolarPanelsLevel] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [qualityScore, setQualityScore] = useState<number>(94);
  const [plantEarnings, setPlantEarnings] = useState<number>(0);

  const [machines, setMachines] = useState<Machine[]>([
    {
      id: 'm_sorter',
      name: 'NIR Optical Sensor Sorter',
      stage: 'Stage 1: Purity Segregation',
      level: 1,
      maxLevel: 4,
      capacityKgPerMin: 20,
      energyKw: 12,
      upgradeCost: 120,
      icon: '🔍'
    },
    {
      id: 'm_shredder',
      name: 'Twin-Shaft Cryogenic Shredder',
      stage: 'Stage 2: Flake Granulation',
      level: 1,
      maxLevel: 4,
      capacityKgPerMin: 25,
      energyKw: 18,
      upgradeCost: 160,
      icon: '⚙️'
    },
    {
      id: 'm_washer',
      name: 'Caustic Hydro-Cleaning Vat',
      stage: 'Stage 3: Decontamination',
      level: 1,
      maxLevel: 4,
      capacityKgPerMin: 20,
      energyKw: 14,
      upgradeCost: 190,
      icon: '💧'
    },
    {
      id: 'm_extruder',
      name: 'Vacuum Pelletizing Extruder',
      stage: 'Stage 4: Certified Output',
      level: 1,
      maxLevel: 4,
      capacityKgPerMin: 18,
      energyKw: 22,
      upgradeCost: 240,
      icon: '🧪'
    }
  ]);

  const totalCapacity = Math.min(...machines.map(m => m.capacityKgPerMin * m.level));
  const totalEnergy = machines.reduce((acc, m) => acc + (m.energyKw * m.level), 0);
  const solarEnergyOffset = solarPanelsLevel * 25; // 25 kW per solar tier
  const netEnergyRequired = Math.max(5, totalEnergy - solarEnergyOffset);

  const handleOrderRawBales = () => {
    sound.playTap();
    setRawInputKg(r => r + 80);
  };

  const handleProcessRun = () => {
    if (rawInputKg <= 10) return;
    sound.playCollect();
    setIsProcessing(true);

    setTimeout(() => {
      const processedKg = Math.min(rawInputKg, totalCapacity * 3);
      const outputYield = Math.round(processedKg * 0.88); // 88% circular recovery rate
      setRawInputKg(r => Math.max(0, r - processedKg));
      setFinishedOutputKg(f => f + outputYield);
      setIsProcessing(false);
      sound.playCorrect();
    }, 1200);
  };

  const handleSellOutput = () => {
    if (finishedOutputKg <= 0) return;
    sound.playCoinReward();

    const pricePerKg = 4; // 4 Eco Coins per kg of circular polymer
    const totalSale = finishedOutputKg * pricePerKg;
    const earnedXp = Math.round(totalSale * 0.6);

    addCoins(totalSale);
    addXP(earnedXp);
    setPlantEarnings(p => p + totalSale);
    setFinishedOutputKg(0);
  };

  const handleUpgradeMachine = (id: string) => {
    const target = machines.find(m => m.id === id);
    if (!target || user.ecoCoins < target.upgradeCost || target.level >= target.maxLevel) return;

    sound.playBuildingComplete();
    addCoins(-target.upgradeCost);
    setMachines(machines.map(m => m.id === id ? {
      ...m,
      level: m.level + 1,
      upgradeCost: Math.round(m.upgradeCost * 1.5)
    } : m));
    setQualityScore(q => Math.min(99, q + 1.2));
  };

  const handleUpgradeSolar = () => {
    const cost = solarPanelsLevel * 150;
    if (user.ecoCoins < cost || solarPanelsLevel >= 4) return;
    sound.playBuildingComplete();
    addCoins(-cost);
    setSolarPanelsLevel(s => s + 1);
  };

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
          Game 3: Factory Manager
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Circular Recovery Plant Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
          Transform municipal collected waste into certified secondary raw polymer granules. Balance throughput, machinery upgrades, and solar energy!
        </p>
      </div>

      {/* Factory Overview HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numbers text-center">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-sans block">RAW WASTE INPUT</span>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {rawInputKg} kg
          </div>
          <button
            onClick={handleOrderRawBales}
            className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200/80 transition-colors cursor-pointer"
          >
            + Order 80kg
          </button>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-sans block">RECOVERED OUTPUT</span>
          <div className="text-base font-bold text-emerald-700 mt-0.5">
            {finishedOutputKg} kg
          </div>
          <button
            onClick={handleSellOutput}
            disabled={finishedOutputKg <= 0}
            className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              finishedOutputKg > 0
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            Sell for 🪙 {finishedOutputKg * 4}
          </button>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-sans block">GRID ENERGY DRAW</span>
          <div className="text-base font-bold text-blue-700 mt-0.5">
            {netEnergyRequired} kW
          </div>
          <button
            onClick={handleUpgradeSolar}
            disabled={user.ecoCoins < solarPanelsLevel * 150 || solarPanelsLevel >= 4}
            className="mt-2 text-[10px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200/80 transition-colors cursor-pointer"
          >
            Solar L{solarPanelsLevel} ({solarPanelsLevel * 150}c)
          </button>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-sans block">OUTPUT PURITY</span>
          <div className="text-base font-bold text-teal-700 mt-0.5">
            {qualityScore.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-1">ISO 14021 Certified</span>
        </div>
      </div>

      {/* Main Process Run Action */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-base">
              Automated Transformation Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Throughput capacity: {totalCapacity * 3} kg / batch · 88% circular recovery rate
            </p>
          </div>

          <button
            onClick={handleProcessRun}
            disabled={isProcessing || rawInputKg <= 10}
            className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              !isProcessing && rawInputKg > 10
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Factory className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Processing Batch...' : 'Process Batch Run'}</span>
          </button>
        </div>

        {/* 4 Machine Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {machines.map((m) => {
            const canAfford = user.ecoCoins >= m.upgradeCost;
            const isMax = m.level >= m.maxLevel;

            return (
              <div
                key={m.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs">{m.icon}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                      {m.stage}
                    </span>
                    <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
                      {m.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono-numbers mt-1">
                      <span>L{m.level}/{m.maxLevel}</span>
                      <span>·</span>
                      <span>{m.capacityKgPerMin * m.level} kg/min</span>
                      <span>·</span>
                      <span>{m.energyKw * m.level} kW</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgradeMachine(m.id)}
                  disabled={isMax || !canAfford}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-numbers shrink-0 transition-colors cursor-pointer ${
                    isMax
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isMax ? 'MAX' : `🪙 ${m.upgradeCost}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
