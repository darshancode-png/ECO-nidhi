import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import {
  Gamepad2,
  Trophy,
  Flame,
  Heart,
  Timer,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Crown,
  MousePointer2,
  Info,
  Cpu
} from 'lucide-react';
import { WasteCategory } from '../../types';

interface MiniGameItem {
  id: string;
  name: string;
  category: WasteCategory;
  binName: string;
  icon: string;
  points: number;
  aiClassification: {
    material: string;
    confidence: number;
  };
}

const GAME_ITEMS: MiniGameItem[] = [
  {
    id: 'item_plastic_bottle',
    name: 'Plastic Water Bottle',
    category: 'plastic',
    binName: 'Plastic',
    icon: '🧴',
    points: 20,
    aiClassification: { material: 'rPET #1 Polymer', confidence: 99.2 }
  },
  {
    id: 'item_apple_core',
    name: 'Organic Apple Core',
    category: 'organic',
    binName: 'Compost',
    icon: '🍎',
    points: 15,
    aiClassification: { material: 'Plant Cellulose & Pectin', confidence: 98.7 }
  },
  {
    id: 'item_newspaper',
    name: 'Daily Newspaper Roll',
    category: 'paper',
    binName: 'Paper',
    icon: '📰',
    points: 18,
    aiClassification: { material: 'Re-pulpable Newsprint', confidence: 97.9 }
  },
  {
    id: 'item_tin_can',
    name: 'Aluminum Tin Can',
    category: 'metal',
    binName: 'Metal',
    icon: '🥫',
    points: 25,
    aiClassification: { material: 'Aluminum Alloy 3004', confidence: 99.5 }
  },
  {
    id: 'item_banana_peel',
    name: 'Banana Peel',
    category: 'organic',
    binName: 'Compost',
    icon: '🍌',
    points: 15,
    aiClassification: { material: 'Organic Biomass', confidence: 98.9 }
  },
  {
    id: 'item_shampoo_bottle',
    name: 'HDPE Shampoo Bottle',
    category: 'plastic',
    binName: 'Plastic',
    icon: '🧴',
    points: 20,
    aiClassification: { material: 'HDPE #2 Polymer', confidence: 98.4 }
  },
  {
    id: 'item_cardboard_box',
    name: 'Corrugated Shipping Box',
    category: 'paper',
    binName: 'Paper',
    icon: '📦',
    points: 22,
    aiClassification: { material: 'Kraft Cellulose Fiber', confidence: 99.1 }
  },
  {
    id: 'item_soda_can',
    name: 'Sparkling Soda Can',
    category: 'metal',
    binName: 'Metal',
    icon: '🥤',
    points: 25,
    aiClassification: { material: 'Anodized Bauxite Aluminum', confidence: 99.8 }
  }
];

interface BinDefinition {
  category: WasteCategory;
  label: string;
  colorName: string;
  icon: string;
  textColor: string;
  borderColor: string;
  bgClass: string;
  hoverBorder: string;
}

export const SortingMiniGame: React.FC = () => {
  const { recordSortingScore, navigate } = useGame();

  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'SUMMARY'>('READY');
  const [score, setScore] = useState<number>(0);
  const [totalXpEarned, setTotalXpEarned] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(40);
  const [itemsSorted, setItemsSorted] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<MiniGameItem>(GAME_ITEMS[0]);
  const [draggedOverCategory, setDraggedOverCategory] = useState<WasteCategory | null>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    isCorrect: boolean;
  } | null>(null);

  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [aiHintsLeft, setAiHintsLeft] = useState<number>(3);
  const [showAiBreakdown, setShowAiBreakdown] = useState<boolean>(false);
  const [shakeError, setShakeError] = useState<boolean>(false);

  // Touch drag tracking for mobile
  const [touchDragging, setTouchDragging] = useState<boolean>(false);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const ROUND_TARGET_ITEMS = 10;

  const bins: BinDefinition[] = [
    {
      category: 'organic',
      label: 'Compost',
      colorName: 'Green',
      icon: '🌿',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-300',
      bgClass: 'bg-emerald-50/70',
      hoverBorder: 'border-emerald-600 ring-2 ring-emerald-400 bg-emerald-100'
    },
    {
      category: 'plastic',
      label: 'Plastic',
      colorName: 'Yellow',
      icon: '🧴',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300',
      bgClass: 'bg-amber-50/70',
      hoverBorder: 'border-amber-600 ring-2 ring-amber-400 bg-amber-100'
    },
    {
      category: 'paper',
      label: 'Paper',
      colorName: 'Blue',
      icon: '📦',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      bgClass: 'bg-blue-50/70',
      hoverBorder: 'border-blue-600 ring-2 ring-blue-400 bg-blue-100'
    },
    {
      category: 'metal',
      label: 'Metal',
      colorName: 'Silver',
      icon: '🥫',
      textColor: 'text-slate-800',
      borderColor: 'border-slate-300',
      bgClass: 'bg-slate-100/70',
      hoverBorder: 'border-slate-600 ring-2 ring-slate-400 bg-slate-200'
    }
  ];

  const pickRandomItem = (excludeId?: string) => {
    const candidates = GAME_ITEMS.filter(item => item.id !== excludeId);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentItem(chosen);
    setShowAiBreakdown(false);
  };

  const startGame = () => {
    sound.playTap();
    setScore(0);
    setTotalXpEarned(0);
    setCombo(1);
    setMaxCombo(1);
    setLives(3);
    setErrorsCount(0);
    setTimeLeft(40);
    setItemsSorted(0);
    setAiHintsLeft(3);
    pickRandomItem();
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
    setGameState('SUMMARY');
    sound.playAchievement();
  };

  const processSort = (targetCategory: WasteCategory) => {
    if (gameState !== 'PLAYING') return;

    const isCorrect = targetCategory === currentItem.category;

    if (isCorrect) {
      const earnedScore = currentItem.points * combo;
      const earnedXp = Math.round(earnedScore * 0.75);
      const nextCombo = combo + 1;

      setScore(s => s + earnedScore);
      setTotalXpEarned(x => x + earnedXp);
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);

      const newSortedCount = itemsSorted + 1;
      setItemsSorted(newSortedCount);

      sound.playCombo(nextCombo);
      setFeedback({
        text: `+${earnedXp} XP · COMBO x${combo}!`,
        isCorrect: true
      });

      if (newSortedCount >= ROUND_TARGET_ITEMS) {
        setTimeout(() => endGame(), 400);
        return;
      }
    } else {
      sound.playWrong();
      setCombo(1);
      const nextLives = lives - 1;
      setLives(nextLives);
      setErrorsCount(e => e + 1);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 350);

      setFeedback({
        text: `Incorrect Bin! ${currentItem.binName} was correct`,
        isCorrect: false
      });

      if (nextLives <= 0) {
        setTimeout(() => endGame(), 400);
        return;
      }
    }

    setTimeout(() => setFeedback(null), 650);
    pickRandomItem(currentItem.id);
  };

  // HTML5 Drag & Drop
  const handleDragStart = (e: React.DragEvent) => {
    sound.playTap();
    e.dataTransfer.setData('text/plain', currentItem.category);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, category: WasteCategory) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverCategory !== category) {
      setDraggedOverCategory(category);
    }
  };

  const handleDragLeave = (category: WasteCategory) => {
    if (draggedOverCategory === category) {
      setDraggedOverCategory(null);
    }
  };

  const handleDrop = (e: React.DragEvent, category: WasteCategory) => {
    e.preventDefault();
    setDraggedOverCategory(null);
    processSort(category);
  };

  // Mobile Touch drag
  const handleTouchStart = (e: React.TouchEvent) => {
    sound.playTap();
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });
    setTouchDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragging) return;
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const binElem = element?.closest('[data-bin-category]');
    if (binElem) {
      const cat = binElem.getAttribute('data-bin-category') as WasteCategory;
      setDraggedOverCategory(cat);
    } else {
      setDraggedOverCategory(null);
    }
  };

  const handleTouchEnd = () => {
    if (!touchDragging) return;
    setTouchDragging(false);
    if (draggedOverCategory) {
      processSort(draggedOverCategory);
      setDraggedOverCategory(null);
    }
  };

  const handleTriggerAiScan = () => {
    if (isAiScanning || aiHintsLeft <= 0) return;
    sound.playCollect();
    setIsAiScanning(true);
    setAiHintsLeft(h => h - 1);

    setTimeout(() => {
      setIsAiScanning(false);
      setShowAiBreakdown(true);
      sound.playCorrect();
    }, 450);
  };

  const isPerfectRun = itemsSorted >= 5 && errorsCount === 0;

  const handleClaimRewards = () => {
    recordSortingScore(score, itemsSorted, maxCombo, isPerfectRun);
    setGameState('READY');
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

        <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold font-mono-numbers">
          Arcade Mode · Combo Multipliers
        </span>
      </div>

      {/* Main Game Card */}
      <div
        className={`bg-white border rounded-3xl p-5 sm:p-7 shadow-xs overflow-hidden transition-all duration-300 ${
          shakeError ? 'border-rose-400 animate-shake' : 'border-slate-200/90'
        }`}
      >
        {/* HUD Bar */}
        {gameState === 'PLAYING' && (
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 font-mono-numbers">
            {/* Score & XP */}
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-base font-bold text-slate-900">{score}</span>
              <span className="text-xs text-emerald-700 font-semibold hidden sm:inline">
                (+{totalXpEarned} XP)
              </span>
            </div>

            {/* Combo Multiplier */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-150 ${
                combo > 1
                  ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${combo > 1 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-bold">COMBO x{combo}</span>
            </div>

            {/* Timer & Lives */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700">
                <Timer className="w-3.5 h-3.5 text-slate-500" />
                <span className={timeLeft <= 8 ? 'text-rose-600 animate-pulse' : ''}>{timeLeft}s</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3].map((h) => (
                  <Heart
                    key={h}
                    className={`w-4 h-4 ${
                      h <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State 1: READY */}
        {gameState === 'READY' && (
          <div className="py-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-2xs p-2">
              <Icon3D name="gamepad" size="xl" animate={true} fluidHover={true} />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Waste Sorting Mini-Game
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Drag each waste item into the correct category bin: <strong className="text-emerald-800">Compost</strong>, <strong className="text-amber-800">Plastic</strong>, <strong className="text-blue-800">Paper</strong>, or <strong className="text-slate-800">Metal</strong>. Build combo streaks to maximize your XP!
              </p>
            </div>

            {/* Perfect Sort Challenge Notice */}
            <div className="max-w-md mx-auto bg-amber-50/90 border border-amber-200 rounded-3xl p-4 flex items-center gap-3.5 text-left fluid-card">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 p-1">
                <Icon3D name="trophy" size="sm" fluidHover={false} />
              </div>
              <div className="text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>Special Challenge: 'Perfect Sort'</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded-md font-mono-numbers">
                    +500 Coins · +350 XP
                  </span>
                </div>
                <p className="text-amber-800/80 mt-0.5">
                  Complete the entire 10-item round with 100% accuracy and zero errors to unlock this gold achievement!
                </p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Start Sorting Round
            </button>
          </div>
        )}

        {/* State 2: PLAYING */}
        {gameState === 'PLAYING' && (
          <div className="space-y-6">
            {/* Feedback Toast */}
            {feedback && (
              <div
                className={`py-2 px-4 rounded-xl text-xs font-bold font-mono-numbers text-center mx-auto max-w-sm border shadow-xs animate-in fade-in duration-100 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {feedback.text}
              </div>
            )}

            {/* Active Item Conveyor Area */}
            <div className="relative py-7 px-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-center flex flex-col items-center justify-center overflow-hidden">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2 font-medium">
                <MousePointer2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Drag item to bin or tap the matching bin below</span>
              </div>

              {/* Draggable Card */}
              <div
                draggable
                onDragStart={handleDragStart}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="cursor-grab active:cursor-grabbing p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm transition-all hover:scale-105 active:scale-95 flex flex-col items-center select-none"
              >
                <div className="text-5xl mb-1 filter drop-shadow-xs">{currentItem.icon}</div>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  {currentItem.name}
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5">Drag to correct bin</span>
              </div>

              {/* Mobile Touch Clone */}
              {touchDragging && (
                <div
                  style={{
                    position: 'fixed',
                    left: touchPos.x - 24,
                    top: touchPos.y - 24,
                    pointerEvents: 'none',
                    zIndex: 100
                  }}
                  className="text-4xl filter drop-shadow-lg"
                >
                  {currentItem.icon}
                </div>
              )}

              {/* AI Hint Trigger & Counter */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full max-w-sm flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleTriggerAiScan}
                  disabled={isAiScanning || aiHintsLeft <= 0}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    aiHintsLeft > 0
                      ? 'bg-white hover:bg-slate-50 border-emerald-300 text-emerald-800 shadow-xs'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAiScanning ? 'Scanning...' : `AI Hint (${aiHintsLeft} left)`}</span>
                </button>

                <span className="text-[11px] text-slate-500 font-mono-numbers">
                  Item {itemsSorted + 1} of {ROUND_TARGET_ITEMS}
                </span>
              </div>

              {/* AI Hint Drawer */}
              {showAiBreakdown && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left max-w-sm w-full text-xs space-y-1 font-mono-numbers">
                  <div className="text-emerald-900 font-bold">
                    Material: {currentItem.aiClassification.material}
                  </div>
                  <div className="text-emerald-700 text-[11px]">
                    💡 Correct Destination: <strong className="uppercase">{currentItem.binName} Bin</strong>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Category Bins Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bins.map((b) => {
                const isHovered = draggedOverCategory === b.category;

                return (
                  <div
                    key={b.category}
                    data-bin-category={b.category}
                    onDragOver={(e) => handleDragOver(e, b.category)}
                    onDragLeave={() => handleDragLeave(b.category)}
                    onDrop={(e) => handleDrop(e, b.category)}
                    onClick={() => processSort(b.category)}
                    className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-center flex flex-col items-center justify-between min-h-[130px] select-none ${
                      isHovered
                        ? b.hoverBorder
                        : `${b.borderColor} ${b.bgClass} hover:border-slate-400 hover:shadow-xs`
                    }`}
                  >
                    <div className="text-3xl mb-1">{b.icon}</div>
                    <div>
                      <h4 className={`font-display font-bold text-sm ${b.textColor}`}>
                        {b.label}
                      </h4>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {b.colorName} Bin
                      </span>
                    </div>

                    <div className="w-full pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 font-mono-numbers">
                      {isHovered ? 'Drop here!' : 'Drop or Tap'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* State 3: SUMMARY */}
        {gameState === 'SUMMARY' && (
          <div className="py-6 text-center space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/90 flex items-center justify-center mx-auto shadow-sm p-2">
              <Icon3D name="trophy" size="xl" animate={true} fluidHover={true} />
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                {isPerfectRun ? 'Flawless Sorting Master!' : 'Round Completed!'}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                {isPerfectRun
                  ? 'Congratulations! You sorted all items with 100% accuracy and zero mistakes. "Perfect Sort" achievement unlocked!'
                  : 'Great effort! Your diverted recyclables have been recorded.'}
              </p>
            </div>

            {/* Perfect Sort Badge */}
            {isPerfectRun && (
              <div className="max-w-md mx-auto bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3 fluid-card">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 p-1">
                  <Icon3D name="trophy" size="sm" fluidHover={false} />
                </div>
                <div className="text-left text-xs font-mono-numbers">
                  <div className="font-bold text-amber-900 text-sm">
                    'Perfect Sort' Achievement Unlocked!
                  </div>
                  <div className="text-amber-800 mt-0.5 flex items-center gap-1.5">
                    <span>100% Accuracy Bonus:</span>
                    <span className="font-bold text-emerald-800">+500 Coins · +350 XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scorecard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono-numbers">
              <div>
                <div className="text-[10px] text-slate-500">Score</div>
                <div className="text-base font-bold text-slate-900">{score}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">XP Earned</div>
                <div className="text-base font-bold text-emerald-700">
                  +{totalXpEarned + (isPerfectRun ? 150 : 0)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Max Combo</div>
                <div className="text-base font-bold text-amber-700">x{maxCombo}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Accuracy</div>
                <div className={`text-base font-bold ${errorsCount === 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {itemsSorted > 0 ? Math.round((itemsSorted / (itemsSorted + errorsCount)) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleClaimRewards}
                className="w-full sm:w-auto h-11 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Claim XP & Coins</span>
              </button>

              <button
                onClick={startGame}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guide Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3">
        <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>Waste Sorting Reference Guide</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <span className="font-bold text-emerald-800 block mb-0.5">🌿 Compost (Green)</span>
            <span className="text-slate-600 text-[11px]">Food leftovers, fruit peels, vegetable scraps.</span>
          </div>
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
            <span className="font-bold text-amber-800 block mb-0.5">🧴 Plastic (Yellow)</span>
            <span className="text-slate-600 text-[11px]">Water bottles, clean shampoo jugs, milk containers.</span>
          </div>
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
            <span className="font-bold text-blue-800 block mb-0.5">📦 Paper (Blue)</span>
            <span className="text-slate-600 text-[11px]">Newspapers, flattened delivery cartons, magazines.</span>
          </div>
          <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-300">
            <span className="font-bold text-slate-800 block mb-0.5">🥫 Metal (Silver)</span>
            <span className="text-slate-600 text-[11px]">Aluminum beverage cans, clean tin cans, steel lids.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
