import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Wet vs Dry Segregation',
    question: 'According to Solid Waste Management Rules, which of these belongs strictly in the Green (Wet) Bin?',
    options: [
      'Used aluminum foil rolls',
      'Fruit peels, leftover cooked rice & tea leaves',
      'Disposable plastic water bottle',
      'Clean cardboard shipping box'
    ],
    correctIndex: 1,
    explanation: 'Green bins are designated for organic, biodegradable food and garden waste which can be composted or turned into bio-methane.'
  },
  {
    id: 2,
    topic: 'Plastic Preparation',
    question: 'How should you prepare daily plastic milk pouches (MLP/LDPE) before discarding?',
    options: [
      'Throw them filled with milk residue into the wet bin',
      'Burn them in open fire',
      'Cut only a small corner, rinse clean, dry, and place in dry waste',
      'Cut into tiny confetti pieces'
    ],
    correctIndex: 2,
    explanation: 'Rinsing and drying keeps dry waste unsoiled. Keeping the small snipped corner attached prevents micro-plastic litter from escaping recycling.'
  },
  {
    id: 3,
    topic: 'Hazardous E-Waste',
    question: 'Where should swollen phone batteries, old cables, and tube lights be disposed?',
    options: [
      'Standard residential dry waste bin',
      'Authorized municipal E-Waste deposit kiosk or collection drive',
      'Buried in garden compost',
      'Flushed down drainage'
    ],
    correctIndex: 1,
    explanation: 'E-waste contains heavy metals (lead, cadmium, mercury) and lithium which cause fire hazards in compactor trucks and contaminate groundwater if landfilled.'
  },
  {
    id: 4,
    topic: 'Plastic Resin Codes',
    question: 'What does the recycling triangle with number #1 (PET / PETE) indicate?',
    options: [
      'Polyethylene Terephthalate — highly recyclable into polyester fiber and new bottles',
      'Non-recyclable toxic medical waste',
      'Biodegradable plastic made of cornstarch',
      'Low-density shopping bag film'
    ],
    correctIndex: 0,
    explanation: 'PET (#1) is one of the most widely recycled plastics globally, commonly re-granulated into clean polyester yarns and circular bottles.'
  },
  {
    id: 5,
    topic: 'Circular Economy',
    question: 'What is the primary ecological benefit of decentralized community composting in apartments and wards?',
    options: [
      'Eliminates the need for electricity in the city',
      'Diverts up to 60% of municipal waste from rotting into methane in open landfills',
      'Allows burning of dry plastics',
      'Replaces tap water'
    ],
    correctIndex: 1,
    explanation: 'Organic waste rotting anaerobically in landfills is a leading cause of methane emissions and leachate poison. Local aerobic composting turns it into nutrient-rich soil food.'
  }
];

export const EcoQuizGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addCoins, addXP } = useGame();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      setCorrectAnswersCount(c => c + 1);
    } else {
      sound.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sound.playTap();
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finished
      sound.playAchievement();
      const finalScore = correctAnswersCount + (selectedOption === currentQ.correctIndex ? 1 : 0);
      const earnedCoins = finalScore * 40;
      const earnedXP = finalScore * 30;
      addCoins(earnedCoins);
      addXP(earnedXP);
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    sound.playTap();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-5">
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
          Game 6: Eco Quiz
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Swachh Segregation & Recycling Quiz
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          5 quick questions testing your real-world waste segregation and circular economy knowledge.
        </p>
      </div>

      {/* Quiz Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {!quizCompleted ? (
          <div className="space-y-5">
            {/* Progress Bar & Question Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-numbers">
                <span className="font-bold text-emerald-800 uppercase tracking-wide">
                  {currentQ.topic}
                </span>
                <span className="text-slate-500 font-semibold">
                  Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-2 ring-emerald-300';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Drawer after Answering */}
            {isAnswered && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Why this matters:</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {currentQ.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    {currentIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'Complete Quiz'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Summary Certificate Screen */
          <div className="py-8 text-center space-y-5">
            <div className="w-18 h-18 rounded-3xl bg-amber-50 border border-amber-200/90 flex items-center justify-center mx-auto shadow-sm p-2">
              <Icon3D name="trophy" size="xl" animate={true} fluidHover={true} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Quiz Certification
              </span>
              <h2 className="text-2xl font-display font-bold text-slate-900 mt-2">
                {correctAnswersCount >= 4 ? 'Eco Segregation Expert!' : 'Keep Learning, Eco Ranger!'}
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                You scored {correctAnswersCount} out of {QUIZ_QUESTIONS.length} correct. Real understanding translates into cleaner streets and higher municipal recycling rates!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono-numbers">
              <div>
                <span className="text-[10px] text-slate-500">COINS WON</span>
                <span className="text-base font-bold text-amber-700 block mt-0.5">
                  🪙 +{correctAnswersCount * 40}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">XP EARNED</span>
                <span className="text-base font-bold text-emerald-700 block mt-0.5">
                  ⚡ +{correctAnswersCount * 30}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleRestartQuiz}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Retake Quiz
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
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
