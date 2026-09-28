import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import {
  ArrowLeft,
  RotateCcw,
  Timer,
  CheckCircle2,
  Trophy,
  Sparkles,
  Search,
  Eye
} from 'lucide-react';

interface HiddenItem {
  id: string;
  name: string;
  category: string;
  isRecyclable: boolean;
  x: number; // percentage
  y: number; // percentage
  emoji: string;
  found: boolean;
  hint: string;
}

const INITIAL_SCENE_ITEMS: HiddenItem[] = [
  // Recyclables
  { id: 'h1', name: 'Plastic Water Bottle', category: 'plastic', isRecyclable: true, x: 22, y: 72, emoji: '🧴', found: false, hint: 'Near the sidewalk curb' },
  { id: 'h2', name: 'Crushed Soda Can', category: 'metal', isRecyclable: true, x: 68, y: 80, emoji: '🥫', found: false, hint: 'Beside the park bench' },
  { id: 'h3', name: 'Old Newspaper', category: 'paper', isRecyclable: true, x: 42, y: 64, emoji: '📰', found: false, hint: 'Under the tea stall table' },
  { id: 'h4', name: 'Coconut Shell (Biomass)', category: 'organic', isRecyclable: true, x: 82, y: 70, emoji: '🥥', found: false, hint: 'Near the fruit vendor cart' },
  { id: 'h5', name: 'Discarded AAA Battery', category: 'ewaste', isRecyclable: true, x: 52, y: 48, emoji: '🔋', found: false, hint: 'Near the bus shelter pillar' },
  { id: 'h6', name: 'Milk Carton Packaging', category: 'paper', isRecyclable: true, x: 15, y: 56, emoji: '📦', found: false, hint: 'Near the doorstep stairs' },

  // Distractors / Permanent Scene Features
  { id: 'd1', name: 'Clay Chai Cup (Biodegradable Kulhad)', category: 'clay', isRecyclable: false, x: 34, y: 52, emoji: '☕', found: false, hint: 'Not recyclable via bins' },
  { id: 'd2', name: 'Street Lamp', category: 'fixture', isRecyclable: false, x: 88, y: 35, emoji: '💡', found: false, hint: 'Municipal infrastructure' },
  { id: 'd3', name: 'Potted Tulsi Plant', category: 'plant', isRecyclable: false, x: 60, y: 42, emoji: '🪴', found: false, hint: 'Living plant' }
];

export const WasteHuntGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addCoins, addXP } = useGame();

  const [items, setItems] = useState<HiddenItem[]>(INITIAL_SCENE_ITEMS);
  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'SUMMARY'>('READY');
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const recyclables = items.filter(i => i.isRecyclable);
  const foundCount = recyclables.filter(i => i.found).length;
  const totalToFind = recyclables.length;

  const startGame = () => {
    sound.playTap();
    setItems(INITIAL_SCENE_ITEMS.map(i => ({ ...i, found: false })));
    setTimeLeft(35);
    setScore(0);
    setFeedback(null);
    setGameState('PLAYING');
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const endGame = () => {
    sound.playAchievement();
    setGameState('SUMMARY');
  };

  const handleTapItem = (item: HiddenItem) => {
    if (gameState !== 'PLAYING' || item.found) return;

    if (item.isRecyclable) {
      sound.playCorrect();
      setItems(items.map(i => i.id === item.id ? { ...i, found: true } : i));
      const gainedPoints = 40 + Math.round(timeLeft * 1.5);
      setScore(s => s + gainedPoints);
      setFeedback(`Found ${item.name}! +${gainedPoints} pts`);

      if (foundCount + 1 >= totalToFind) {
        // Complete!
        const bonusCoins = 150 + timeLeft * 2;
        const bonusXP = 120 + timeLeft;
        addCoins(bonusCoins);
        addXP(bonusXP);
        setTimeout(() => endGame(), 600);
      }
    } else {
      sound.playWrong();
      setTimeLeft(t => Math.max(0, t - 3));
      setFeedback(`Oops! "${item.name}" is not a dry recyclable! -3s penalty.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-5">
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
          Game 5: Waste Hunt
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Neighborhood Waste Hunt
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
          Spot and tap all 6 recyclable items hidden in the realistic street scene before the 35-second timer runs out!
        </p>
      </div>

      {/* Main Game Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        {/* HUD */}
        {gameState === 'PLAYING' && (
          <div className="flex items-center justify-between text-xs font-mono-numbers pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-900">Found: {foundCount} / {totalToFind}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl text-slate-800 font-bold">
              <Timer className={`w-3.5 h-3.5 ${timeLeft <= 8 ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`} />
              <span className={timeLeft <= 8 ? 'text-rose-600' : ''}>{timeLeft}s</span>
            </div>

            <div className="text-emerald-700 font-bold">
              Score: {score}
            </div>
          </div>
        )}

        {/* State 1: READY */}
        {gameState === 'READY' && (
          <div className="py-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-2xs p-2">
              <Icon3D name="camera" size="lg" animate={true} fluidHover={true} />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-xl font-display font-bold text-slate-900">
                Ready for the Search Challenge?
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identify plastic bottles, cans, newspapers, and batteries scattered in the neighborhood. Avoid tapping street furniture or organic soil!
              </p>
            </div>

            <button
              onClick={startGame}
              className="h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Start Neighborhood Hunt
            </button>
          </div>
        )}

        {/* State 2: PLAYING Interactive Scene */}
        {gameState === 'PLAYING' && (
          <div className="space-y-3">
            {feedback && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-center text-slate-800 font-mono-numbers">
                {feedback}
              </div>
            )}

            {/* Visual Illustrated Indian Neighborhood Scene */}
            <div className="relative aspect-video sm:aspect-21/9 min-h-[300px] bg-gradient-to-b from-sky-100 via-amber-50/50 to-emerald-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-inner select-none">
              {/* Illustrated Scene Backdrop: Buildings, Tea Stall, Trees */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 800 400">
                {/* Distant building silhouettes */}
                <rect x="50" y="80" width="120" height="200" fill="#e2e8f0" rx="4" />
                <rect x="200" y="50" width="140" height="230" fill="#cbd5e1" rx="4" />
                <rect x="360" y="100" width="100" height="180" fill="#e2e8f0" rx="4" />
                <rect x="580" y="70" width="160" height="210" fill="#cbd5e1" rx="4" />

                {/* Road and Sidewalk */}
                <polygon points="0,280 800,280 800,400 0,400" fill="#94a3b8" opacity="0.6" />
                <polygon points="0,250 800,250 800,280 0,280" fill="#f1f5f9" />
                <line x1="0" y1="280" x2="800" y2="280" stroke="#cbd5e1" strokeWidth="3" />

                {/* Trees */}
                <circle cx="180" cy="200" r="45" fill="#86efac" opacity="0.8" />
                <rect x="175" y="240" width="10" height="40" fill="#78350f" />
                <circle cx="520" cy="180" r="55" fill="#4ade80" opacity="0.7" />
                <rect x="515" y="230" width="12" height="50" fill="#78350f" />

                {/* Tea Stall Canopy */}
                <polygon points="340,190 480,190 470,220 350,220" fill="#ef4444" opacity="0.85" />
                <rect x="350" y="220" width="115" height="45" fill="#fef08a" opacity="0.9" />
              </svg>

              {/* Tappable Objects in Scene */}
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTapItem(item)}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                    item.found
                      ? 'scale-125 opacity-40 bg-emerald-100 ring-2 ring-emerald-500'
                      : 'hover:scale-130 active:scale-95 bg-white/70 backdrop-blur-xs shadow-md border border-slate-200'
                  }`}
                  title={item.name}
                >
                  <span className="text-2xl sm:text-3xl block filter drop-shadow-xs">
                    {item.emoji}
                  </span>
                  {item.found && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Checklist items at bottom */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {recyclables.map((r) => (
                <div
                  key={r.id}
                  className={`p-2 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                    r.found
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold line-through opacity-70'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="truncate">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State 3: SUMMARY */}
        {gameState === 'SUMMARY' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto shadow-xs p-2">
              <Icon3D name="trophy" size="xl" animate={true} fluidHover={true} />
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                {foundCount >= totalToFind ? 'Spotting Master!' : 'Time Expired!'}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                You spotted {foundCount} of {totalToFind} recyclables. Sharp observation stops littering and preserves our public commons!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-mono-numbers">
              <div>
                <span className="text-[10px] text-slate-500">FINAL SCORE</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">{score} pts</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">ACCURACY</span>
                <span className="text-base font-bold text-emerald-700 block mt-0.5">
                  {Math.round((foundCount / totalToFind) * 100)}%
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={startGame}
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
