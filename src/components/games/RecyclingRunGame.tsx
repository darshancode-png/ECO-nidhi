import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import {
  ArrowLeft,
  RotateCcw,
  Zap,
  CheckCircle2,
  Trophy,
  Navigation,
  Fuel,
  TrendingDown
} from 'lucide-react';

interface GridCell {
  x: number;
  y: number;
  type: 'road' | 'obstacle' | 'bin' | 'depot' | 'plant';
  binCollected?: boolean;
  name?: string;
  category?: string;
}

const GRID_SIZE = 5;

const INITIAL_GRID: GridCell[] = [
  // Row 0
  { x: 0, y: 0, type: 'depot', name: 'Fleet Depot' },
  { x: 1, y: 0, type: 'road' },
  { x: 2, y: 0, type: 'bin', name: 'Sector 4 Society', category: 'Plastics' },
  { x: 3, y: 0, type: 'road' },
  { x: 4, y: 0, type: 'obstacle', name: 'Traffic Jam' },

  // Row 1
  { x: 0, y: 1, type: 'road' },
  { x: 1, y: 1, type: 'obstacle', name: 'Road Work' },
  { x: 2, y: 1, type: 'road' },
  { x: 3, y: 1, type: 'bin', name: 'Local Market', category: 'Organic' },
  { x: 4, y: 1, type: 'road' },

  // Row 2
  { x: 0, y: 2, type: 'bin', name: 'Metro Station', category: 'Paper' },
  { x: 1, y: 2, type: 'road' },
  { x: 2, y: 2, type: 'obstacle', name: 'Congestion' },
  { x: 3, y: 2, type: 'road' },
  { x: 4, y: 2, type: 'bin', name: 'City Hospital', category: 'Dry Waste' },

  // Row 3
  { x: 0, y: 3, type: 'road' },
  { x: 1, y: 3, type: 'bin', name: 'Public School', category: 'E-Waste' },
  { x: 2, y: 3, type: 'road' },
  { x: 3, y: 3, type: 'obstacle', name: 'Waterlogging' },
  { x: 4, y: 3, type: 'road' },

  // Row 4
  { x: 0, y: 4, type: 'road' },
  { x: 1, y: 4, type: 'road' },
  { x: 2, y: 4, type: 'road' },
  { x: 3, y: 4, type: 'road' },
  { x: 4, y: 4, type: 'plant', name: 'Materials Recovery Facility' }
];

export const RecyclingRunGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addCoins, addXP } = useGame();

  const [truckPos, setTruckPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [grid, setGrid] = useState<GridCell[]>(INITIAL_GRID);
  const [batteryKwh, setBatteryKwh] = useState<number>(100);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [binsCollectedCount, setBinsCollectedCount] = useState<number>(0);
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [message, setMessage] = useState<string>('Navigate the electric hauler to collect all 5 waste bins and reach the Recovery Facility.');

  const TOTAL_BINS = 5;

  const resetGame = () => {
    sound.playTap();
    setTruckPos({ x: 0, y: 0 });
    setGrid(INITIAL_GRID.map(cell => ({ ...cell, binCollected: false })));
    setBatteryKwh(100);
    setMovesCount(0);
    setBinsCollectedCount(0);
    setGameState('PLAYING');
    setMessage('Route your clean electric hauler to all bins and avoid traffic bottlenecks!');
  };

  const moveTruck = (dx: number, dy: number) => {
    if (gameState !== 'PLAYING') return;

    const newX = truckPos.x + dx;
    const newY = truckPos.y + dy;

    // Check bounds
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
      sound.playWrong();
      setMessage('Boundary reached! Stay on designated municipal transit corridors.');
      return;
    }

    const targetCell = grid.find(c => c.x === newX && c.y === newY);
    if (!targetCell) return;

    // Check obstacles
    if (targetCell.type === 'obstacle') {
      sound.playWrong();
      setBatteryKwh(b => Math.max(0, b - 15));
      setMessage(`Traffic bottleneck encountered at (${newX}, ${newY})! -15% Battery drained.`);
      return;
    }

    // Valid move
    sound.playTap();
    const newBattery = Math.max(0, batteryKwh - 4);
    setBatteryKwh(newBattery);
    setMovesCount(m => m + 1);
    setTruckPos({ x: newX, y: newY });

    // Collect bin
    if (targetCell.type === 'bin' && !targetCell.binCollected) {
      sound.playCollect();
      const updatedGrid = grid.map(c =>
        c.x === newX && c.y === newY ? { ...c, binCollected: true } : c
      );
      setGrid(updatedGrid);
      const newCollected = binsCollectedCount + 1;
      setBinsCollectedCount(newCollected);
      setMessage(`Collected ${targetCell.category} from ${targetCell.name}! (${newCollected}/${TOTAL_BINS})`);
    }

    // Check plant arrival
    if (targetCell.type === 'plant') {
      if (binsCollectedCount >= TOTAL_BINS) {
        // WIN!
        sound.playAchievement();
        setGameState('WON');
        const bonusCoins = 180 + Math.round(newBattery * 1.5);
        const bonusXP = 120 + Math.round(newBattery);
        addCoins(bonusCoins);
        addXP(bonusXP);
        setMessage(`Route Completed! All waste delivered with ${newBattery}% battery remaining. +${bonusCoins} Coins & +${bonusXP} XP!`);
      } else {
        setMessage(`Facility reached, but you still need ${TOTAL_BINS - binsCollectedCount} more waste bins collected first!`);
      }
    } else if (newBattery <= 0) {
      sound.playWrong();
      setGameState('LOST');
      setMessage('Battery depleted! Plan a more energy-efficient route next time.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Game 2: Recycling Run
          </span>
          <button
            onClick={resetGame}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            title="Restart Route"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Surface */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* HUD Info */}
        <div className="grid grid-cols-3 gap-3 font-mono-numbers text-center">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-sans block">BATTERY (EV)</span>
            <div className="flex items-center justify-center gap-1 mt-0.5 text-sm font-bold">
              <Zap className={`w-3.5 h-3.5 ${batteryKwh > 30 ? 'text-emerald-600' : 'text-rose-500 animate-pulse'}`} />
              <span className={batteryKwh > 30 ? 'text-slate-900' : 'text-rose-600'}>{batteryKwh}%</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-sans block">BINS COLLECTED</span>
            <span className="text-sm font-bold text-emerald-700 mt-0.5 block">
              {binsCollectedCount} / {TOTAL_BINS}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-sans block">MOVES TAKEN</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              {movesCount} steps
            </span>
          </div>
        </div>

        {/* Live Status Banner */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 text-center font-medium">
          {message}
        </div>

        {/* 5x5 City Map Grid */}
        <div className="aspect-square max-w-sm mx-auto w-full grid grid-cols-5 gap-2 p-2 bg-slate-100 rounded-3xl border border-slate-200/80 select-none">
          {grid.map((cell) => {
            const isTruckHere = truckPos.x === cell.x && truckPos.y === cell.y;

            let bgClass = 'bg-white';
            let content = null;

            if (cell.type === 'depot') {
              bgClass = 'bg-blue-50 border border-blue-200';
              content = <span className="text-xs font-bold text-blue-700">DEPOT</span>;
            } else if (cell.type === 'plant') {
              bgClass = 'bg-emerald-100 border border-emerald-300';
              content = <span className="text-xs font-bold text-emerald-800">MRF ♻</span>;
            } else if (cell.type === 'obstacle') {
              bgClass = 'bg-rose-50 border border-rose-200';
              content = <span className="text-base" title={cell.name}>🚧</span>;
            } else if (cell.type === 'bin') {
              bgClass = cell.binCollected ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-300';
              content = (
                <div className="flex flex-col items-center">
                  <span className="text-sm">{cell.binCollected ? '✅' : '🗑'}</span>
                  <span className="text-[8px] font-bold text-slate-600 line-clamp-1">{cell.category}</span>
                </div>
              );
            }

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`relative rounded-2xl flex items-center justify-center p-1 text-center transition-all ${bgClass} ${
                  isTruckHere ? 'ring-2 ring-emerald-600 shadow-md scale-105 z-10' : ''
                }`}
              >
                {isTruckHere ? (
                  <div className="flex flex-col items-center animate-bounce">
                    <Icon3D name="truck" size="sm" fluidHover={false} />
                    <span className="text-[8px] font-bold text-emerald-900 bg-white/90 px-1 rounded-sm -mt-1 shadow-2xs">
                      EV Hauler
                    </span>
                  </div>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>

        {/* Direction Controls (Mobile Thumb-Friendly Pad) */}
        {gameState === 'PLAYING' && (
          <div className="max-w-xs mx-auto space-y-2">
            <div className="flex justify-center">
              <button
                onClick={() => moveTruck(0, -1)}
                className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-lg flex items-center justify-center shadow-xs cursor-pointer"
              >
                ▲
              </button>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => moveTruck(-1, 0)}
                className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-lg flex items-center justify-center shadow-xs cursor-pointer"
              >
                ◀
              </button>
              <button
                onClick={() => moveTruck(0, 1)}
                className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-lg flex items-center justify-center shadow-xs cursor-pointer"
              >
                ▼
              </button>
              <button
                onClick={() => moveTruck(1, 0)}
                className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-lg flex items-center justify-center shadow-xs cursor-pointer"
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {/* Win/Loss Modal State */}
        {gameState !== 'PLAYING' && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 mx-auto flex items-center justify-center">
              {gameState === 'WON' ? (
                <Trophy className="w-6 h-6 text-emerald-700" />
              ) : (
                <Fuel className="w-6 h-6 text-rose-600" />
              )}
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              {gameState === 'WON' ? 'Eco Logistics Master!' : 'Trip Failed — Battery Depleted'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {gameState === 'WON'
                ? 'You avoided traffic congestion and optimized transit energy. Clean EV fleet routing reduces city carbon footprints by up to 65%!'
                : 'Getting stuck in bottlenecks drains EV range quickly. Plan your path around congested zones.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={resetGame}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                All Games
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
