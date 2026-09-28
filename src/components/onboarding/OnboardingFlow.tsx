import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { OnboardingEcoCityBackdrop } from './OnboardingEcoCityBackdrop';
import { sound } from '../../utils/audio';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Mail,
  Lock,
  Sparkles,
  Leaf,
  ShieldCheck,
  AlertCircle,
  X,
  Delete
} from 'lucide-react';

interface OnboardingFlowProps {
  onFinish?: () => void;
  initialStep?: OnboardingStep;
}

type OnboardingStep =
  | 'welcome'
  | 'name'
  | 'email'
  | 'pin'
  | 'confirm_pin'
  | 'ready'
  | 'unlock';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onFinish, initialStep }) => {
  const { completeAuthOnboarding, loginWithPin, authSession, clearAllLocalData, navigate } = useGame();

  // If a session already exists with a PIN, default to unlock screen for returning users
  const [step, setStep] = useState<OnboardingStep>(() => {
    if (initialStep) return initialStep;
    return authSession?.pin ? 'unlock' : 'welcome';
  });

  const [name, setName] = useState<string>(() => authSession?.name || '');
  const [email, setEmail] = useState<string>(() => authSession?.email || '');
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [unlockPin, setUnlockPin] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [googleNotice, setGoogleNotice] = useState<string>('');
  const [shakeBoxes, setShakeBoxes] = useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus inputs on step transition
  useEffect(() => {
    if (step === 'name') {
      setTimeout(() => nameInputRef.current?.focus(), 150);
    } else if (step === 'email') {
      setTimeout(() => emailInputRef.current?.focus(), 150);
    }
  }, [step]);

  // Play ready sound once entering ready screen
  useEffect(() => {
    if (step === 'ready') {
      sound.playCoinReward();
    }
  }, [step]);

  // Physical keyboard support for PIN screens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step !== 'pin' && step !== 'confirm_pin' && step !== 'unlock') return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeypadBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleKeypadClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, pin, confirmPin, unlockPin]);

  // Keypad Handlers
  const handleKeypadPress = (digit: string) => {
    sound.playTap();
    setPinError('');

    if (step === 'pin') {
      if (pin.length < 4) {
        setPin(prev => prev + digit);
      }
    } else if (step === 'confirm_pin') {
      if (confirmPin.length < 4) {
        const nextVal = confirmPin + digit;
        setConfirmPin(nextVal);
      }
    } else if (step === 'unlock') {
      if (unlockPin.length < 4) {
        const nextVal = unlockPin + digit;
        setUnlockPin(nextVal);
        if (nextVal.length === 4) {
          // Check unlock PIN using context loginWithPin
          const success = loginWithPin(nextVal);
          if (success) {
            onFinish?.();
          } else {
            setPinError('Incorrect PIN. Please try again.');
            setShakeBoxes(true);
            setTimeout(() => {
              setShakeBoxes(false);
              setUnlockPin('');
            }, 600);
          }
        }
      }
    }
  };

  const handleKeypadBackspace = () => {
    sound.playTap();
    setPinError('');
    if (step === 'pin') {
      setPin(prev => prev.slice(0, -1));
    } else if (step === 'confirm_pin') {
      setConfirmPin(prev => prev.slice(0, -1));
    } else if (step === 'unlock') {
      setUnlockPin(prev => prev.slice(0, -1));
    }
  };

  const handleKeypadClear = () => {
    sound.playTap();
    setPinError('');
    if (step === 'pin') {
      setPin('');
    } else if (step === 'confirm_pin') {
      setConfirmPin('');
    } else if (step === 'unlock') {
      setUnlockPin('');
    }
  };

  // Step 2: Validate Name
  const handleContinueName = () => {
    sound.playTap();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Please enter your name to continue.');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('Name must be at least 2 characters.');
      return;
    }
    setNameError('');
    setStep('email');
  };

  // Step 3: Validate Email
  const handleContinueEmail = () => {
    sound.playTap();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed) {
      setEmailError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }
    setEmailError('');
    setStep('pin');
  };

  // Step 3b: Google Sign-In Demo Placeholder
  const handleGoogleSignInClick = () => {
    sound.playTap();
    // Pre-fill demo Google account without fake redirect
    const demoGoogleEmail = 'darshancodetech04@gmail.com';
    setEmail(demoGoogleEmail);
    setEmailError('');
    setGoogleNotice('Google Workspace demo mode: autofilled your verified account.');
  };

  // Step 4: Validate PIN
  const handleContinuePin = () => {
    sound.playTap();
    if (pin.length !== 4) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }
    setPinError('');
    setStep('confirm_pin');
  };

  // Step 5: Validate Confirm PIN & Create Account
  const handleCreateAccount = () => {
    sound.playTap();
    if (confirmPin.length !== 4) {
      setPinError('Please enter all 4 digits to confirm your PIN.');
      return;
    }

    if (confirmPin !== pin) {
      sound.playWrong();
      setPinError('PINs do not match. Please try again.');
      setShakeBoxes(true);
      setTimeout(() => {
        setShakeBoxes(false);
        setConfirmPin('');
      }, 600);
      return;
    }

    // Success! Advance to Screen 6 (Ready)
    sound.playCorrect();
    setPinError('');
    setStep('ready');
  };

  // Step 6: Enter EcoNidhi
  const handleEnterApp = () => {
    sound.playTap();
    const finalName = name.trim() || 'Darshan';
    const finalEmail = email.trim() || 'resident@econidhi.city';
    completeAuthOnboarding(finalName, finalEmail, pin);
    navigate('home');
    onFinish?.();
  };

  // Render 4 PIN Boxes
  const renderPinBoxes = (currentDigits: string, hasError: boolean) => {
    return (
      <div
        className={`flex justify-center gap-3 sm:gap-4 my-4 sm:my-6 ${
          hasError || shakeBoxes ? 'animate-shake' : ''
        }`}
      >
        {[0, 1, 2, 3].map(index => {
          const isFilled = index < currentDigits.length;
          const isCurrent = index === currentDigits.length;

          return (
            <div
              key={index}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-150 ${
                isFilled
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs scale-102'
                  : isCurrent
                  ? 'border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-100 scale-105'
                  : 'border-slate-200 bg-slate-50 text-slate-300'
              }`}
            >
              {isFilled ? (
                // Never expose the actual digit — always a clean security dot
                <div className="w-4 h-4 rounded-full bg-white shadow-2xs animate-in zoom-in-75 duration-100" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 opacity-60" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Numeric Keypad Component
  const renderNumericKeypad = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    return (
      <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
        {keys.map(k => (
          <button
            key={k}
            type="button"
            onClick={() => handleKeypadPress(k)}
            className="h-12 sm:h-13 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-800 text-xl font-bold font-mono-numbers shadow-2xs active:scale-95 active:bg-emerald-100 transition-all cursor-pointer flex items-center justify-center select-none"
          >
            {k}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleKeypadClear}
          className="h-12 sm:h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold tracking-wider uppercase active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
        >
          Clear
        </button>

        {/* Zero */}
        <button
          type="button"
          onClick={() => handleKeypadPress('0')}
          className="h-12 sm:h-13 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-800 text-xl font-bold font-mono-numbers shadow-2xs active:scale-95 active:bg-emerald-100 transition-all cursor-pointer flex items-center justify-center select-none"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={handleKeypadBackspace}
          className="h-12 sm:h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
          aria-label="Delete last digit"
        >
          <Delete className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-100 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Full-screen realistic Indian eco-city backdrop with soft overlay */}
      <OnboardingEcoCityBackdrop />

      {/* Main Container: On desktop centers as a realistic mobile card; on mobile occupies full screen */}
      <div className="relative z-10 w-full min-h-screen sm:min-h-0 sm:max-w-md sm:my-8 bg-white sm:rounded-[32px] sm:shadow-2xl sm:border sm:border-slate-200/90 flex flex-col justify-between p-6 sm:p-8 animate-in fade-in zoom-in-98 duration-200">
        
        {/* ======================================================== */}
        {/* SCREEN 1: WELCOME                                         */}
        {/* ======================================================== */}
        {step === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between space-y-6 text-center py-2 animate-in fade-in duration-200">
            {/* Top subtle civic pill */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800 shadow-2xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Swachh Smart City · Circular Logistics</span>
              </span>
            </div>

            {/* Brand Logo & Tagline */}
            <div className="space-y-3 pt-2">
              <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white mx-auto shadow-lg shadow-emerald-600/25 flex items-center justify-center">
                <span className="text-4xl">♻️</span>
              </div>

              <div>
                <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                  Eco<span className="text-emerald-600">Nidhi</span>
                </h1>
                <p className="text-base font-semibold text-emerald-700 mt-1">
                  “Turn Waste Into Value.”
                </p>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                  Join thousands of citizens transforming everyday household recycling into urban prosperity, rewards, and clean neighborhoods.
                </p>
              </div>
            </div>

            {/* Real-World Key Highlights */}
            <div className="space-y-2.5 text-left max-w-xs mx-auto w-full pt-1">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">AI Waste Sorting & Scans</div>
                  <div className="text-[11px] text-slate-500">Camera recognition for wet, dry, & e-waste</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Doorstep Electric Haulers</div>
                  <div className="text-[11px] text-slate-500">Scheduled pickups by certified collectors</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Eco Coins & City Growth</div>
                  <div className="text-[11px] text-slate-500">Redeem recycled output for real goods</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setStep('name');
                }}
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {authSession?.pin && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setStep('unlock');
                  }}
                  className="w-full py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  Already have a PIN? Enter PIN →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: YOUR NAME                                       */}
        {/* ======================================================== */}
        {step === 'name' && (
          <div className="flex-1 flex flex-col justify-between space-y-6 py-2 animate-in fade-in duration-150">
            {/* Top Navigation & Step Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setStep('welcome');
                  }}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono-numbers">
                  Step 1 of 4
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-1/4 rounded-full transition-all duration-300" />
              </div>
            </div>

            {/* Title & Input */}
            <div className="space-y-4 my-auto">
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-bold text-slate-900">
                  What should we call you?
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your name to personalize your recycling profile, certificates, and ward impact score.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label htmlFor="user-name" className="block text-xs font-semibold text-slate-700">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <input
                    ref={nameInputRef}
                    id="user-name"
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleContinueName();
                    }}
                    placeholder="Your name (e.g. Darshan)"
                    className="w-full h-13 pl-11 pr-10 rounded-2xl bg-white border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 text-slate-900 font-medium text-sm transition-all outline-hidden shadow-2xs"
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => setName('')}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {nameError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleContinueName}
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 3: EMAIL                                           */}
        {/* ======================================================== */}
        {step === 'email' && (
          <div className="flex-1 flex flex-col justify-between space-y-6 py-2 animate-in fade-in duration-150">
            {/* Top Navigation & Step Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setStep('name');
                  }}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono-numbers">
                  Step 2 of 4
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-2/4 rounded-full transition-all duration-300" />
              </div>
            </div>

            {/* Title & Email Form */}
            <div className="space-y-4 my-auto">
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-bold text-slate-900">
                  Enter your email
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We'll send digital pickup receipts, ESG recycling statements, and pickup arrival updates.
                </p>
              </div>

              {/* Clear Google Sign-In Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGoogleSignInClick}
                  className="w-full h-12 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50/80 text-slate-700 font-semibold text-xs flex items-center justify-center gap-3 shadow-2xs active:scale-98 transition-all cursor-pointer"
                >
                  {/* Official Google G SVG icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {googleNotice && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-xl p-2 mt-2 leading-tight">
                    {googleNotice}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">
                  Use email instead
                </span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Email Input Field */}
              <div className="space-y-1.5">
                <label htmlFor="user-email" className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <input
                    ref={emailInputRef}
                    id="user-email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleContinueEmail();
                    }}
                    placeholder="name@gmail.com"
                    className="w-full h-13 pl-11 pr-10 rounded-2xl bg-white border border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 text-slate-900 font-medium text-sm transition-all outline-hidden shadow-2xs"
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => setEmail('')}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {emailError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleContinueEmail}
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 4: 4-DIGIT PIN                                     */}
        {/* ======================================================== */}
        {step === 'pin' && (
          <div className="flex-1 flex flex-col justify-between space-y-4 py-2 animate-in fade-in duration-150">
            {/* Top Navigation & Step Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setStep('email');
                  }}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono-numbers">
                  Step 3 of 4
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-3/4 rounded-full transition-all duration-300" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Create your 4-digit PIN
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Use this PIN for quick access to EcoNidhi on this device.
              </p>
            </div>

            {/* 4 Large PIN Boxes */}
            <div>
              {renderPinBoxes(pin, Boolean(pinError))}

              {pinError && (
                <p className="text-xs text-center text-rose-600 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            {/* Numeric Keypad */}
            {renderNumericKeypad()}

            {/* Bottom Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={pin.length !== 4}
                onClick={handleContinuePin}
                className={`w-full h-13 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  pin.length === 4
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 5: CONFIRM PIN                                     */}
        {/* ======================================================== */}
        {step === 'confirm_pin' && (
          <div className="flex-1 flex flex-col justify-between space-y-4 py-2 animate-in fade-in duration-150">
            {/* Top Navigation & Step Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setStep('pin');
                  }}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono-numbers">
                  Step 4 of 4
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-full rounded-full transition-all duration-300" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Confirm your PIN
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Re-enter your 4-digit PIN to make sure it matches.
              </p>
            </div>

            {/* 4 Large PIN Boxes */}
            <div>
              {renderPinBoxes(confirmPin, Boolean(pinError))}

              {pinError && (
                <p className="text-xs text-center text-rose-600 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            {/* Numeric Keypad */}
            {renderNumericKeypad()}

            {/* Bottom Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={confirmPin.length !== 4}
                onClick={handleCreateAccount}
                className={`w-full h-13 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  confirmPin.length === 4
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Create Account</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 6: READY                                           */}
        {/* ======================================================== */}
        {step === 'ready' && (
          <div className="flex-1 flex flex-col justify-between space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
            {/* Top Celebration Icon */}
            <div className="pt-2">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 mx-auto shadow-md flex items-center justify-center animate-bounce">
                <span className="text-4xl">🌱</span>
              </div>
            </div>

            {/* Personalized Welcome Header */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Welcome, {name.trim() || 'Darshan'} 👋
              </h2>

              {/* Small Animation Reward Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-sm shadow-xs animate-pulse">
                <span>🌱</span>
                <span>+100 Green XP</span>
              </div>

              <p className="text-sm font-semibold text-emerald-800 pt-1">
                “Your journey to a cleaner city starts here.”
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your profile and 4-digit device PIN are securely configured. You can now request pickups, sort waste, and build your smart eco-city.
              </p>
            </div>

            {/* Verified Account Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 max-w-xs mx-auto w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Citizen Identity</span>
                <span className="font-bold text-slate-900">{name.trim() || 'Darshan'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Email Account</span>
                <span className="font-mono-numbers text-slate-700 truncate max-w-[170px]">
                  {email.trim() || 'darshancodetech04@gmail.com'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Quick Device PIN</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Configured (4 digits)</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-200/80 pt-2">
                <span className="text-slate-500 font-medium">Starting Status</span>
                <span className="font-bold text-emerald-700 font-mono-numbers">Level 1 · Eco Resident</span>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleEnterApp}
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter EcoNidhi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* QUICK UNLOCK MODE (For returning users with saved PIN)    */}
        {/* ======================================================== */}
        {step === 'unlock' && (
          <div className="flex-1 flex flex-col justify-between space-y-4 py-2 animate-in fade-in duration-150">
            {/* Top Info */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Welcome back, {authSession?.name || 'Citizen'}
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Enter your 4-digit PIN for quick access to EcoNidhi on this device.
              </p>
            </div>

            {/* 4 Large PIN Boxes */}
            <div>
              {renderPinBoxes(unlockPin, Boolean(pinError))}

              {pinError && (
                <p className="text-xs text-center text-rose-600 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            {/* Numeric Keypad */}
            {renderNumericKeypad()}

            {/* Bottom unlock button & secondary actions */}
            <div className="pt-2 space-y-2 text-center">
              <button
                type="button"
                disabled={unlockPin.length !== 4}
                onClick={() => {
                  const ok = loginWithPin(unlockPin);
                  if (ok) {
                    onFinish?.();
                  } else {
                    setPinError('Incorrect PIN. Please try again.');
                    setShakeBoxes(true);
                    setTimeout(() => {
                      setShakeBoxes(false);
                      setUnlockPin('');
                    }, 600);
                  }
                }}
                className={`w-full h-12 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  unlockPin.length === 4
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 active:scale-98'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Unlock & Open Home</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setStep('welcome');
                  }}
                  className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                >
                  Switch Account →
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Clear all local device data? This will reset your account and city on this device.')) {
                      clearAllLocalData();
                      setStep('welcome');
                    }
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors cursor-pointer"
                >
                  Clear Local Data
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
