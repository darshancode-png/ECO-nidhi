import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  CityBuilding,
  ProcessingPlant,
  TruckVehicle,
  PickupRequest,
  Mission,
  Achievement,
  MarketItem,
  SkillNode,
  Role,
  AppView,
  CityStage,
  WasteCategory,
  WasteHistoryItem,
  GameProgress,
  AuthSessionData
} from '../types';
import {
  INITIAL_USER,
  INITIAL_BUILDINGS,
  INITIAL_PLANTS,
  INITIAL_TRUCKS,
  INITIAL_PICKUPS,
  INITIAL_MISSIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_MARKET_ITEMS,
  INITIAL_SKILLS
} from '../data/mockData';
import { sound } from '../utils/audio';

export interface RewardCelebration {
  title: string;
  subtitle: string;
  coins?: number;
  xp?: number;
  greenScore?: number;
  badge?: string;
}

const INITIAL_WASTE_HISTORY: WasteHistoryItem[] = [
  {
    id: 'wh_1',
    category: 'plastic',
    itemName: 'PET Water Bottles (Pack of 4)',
    weightKg: 0.8,
    timestamp: '2 hours ago',
    xpEarned: 35,
    coinsEarned: 50,
    actionType: 'scan'
  },
  {
    id: 'wh_2',
    category: 'organic',
    itemName: 'Kitchen Vegetable & Fruit Scraps',
    weightKg: 2.5,
    timestamp: 'Yesterday',
    xpEarned: 60,
    coinsEarned: 85,
    actionType: 'pickup'
  },
  {
    id: 'wh_3',
    category: 'paper',
    itemName: 'Clean Corrugated Cardboard Boxes',
    weightKg: 3.2,
    timestamp: '3 days ago',
    xpEarned: 75,
    coinsEarned: 110,
    actionType: 'sort'
  }
];

const INITIAL_GAME_PROGRESS: GameProgress = {
  sortingHighScore: 1850,
  recyclingRunMaxDistance: 420,
  quizzesCompleted: 3,
  totalGamesPlayed: 7
};

interface GameContextType {
  user: UserProfile;
  role: Role;
  currentView: AppView;
  buildings: CityBuilding[];
  plants: ProcessingPlant[];
  trucks: TruckVehicle[];
  pickups: PickupRequest[];
  missions: Mission[];
  achievements: Achievement[];
  marketItems: MarketItem[];
  skills: SkillNode[];
  cityStage: CityStage;
  cityPollutionPercent: number;
  celebration: RewardCelebration | null;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  authSession: AuthSessionData | null;
  wasteHistory: WasteHistoryItem[];
  gameProgress: GameProgress;
  completeAuthOnboarding: (name: string, email: string, pin: string) => void;
  loginWithPin: (pin: string) => boolean;
  logoutAuth: () => void;
  clearAllLocalData: () => void;
  
  // Navigation & Role
  navigate: (view: AppView) => void;
  switchRole: (role: Role) => void;
  setSoundEnabled: (val: boolean) => void;
  setMusicEnabled: (val: boolean) => void;
  setHapticsEnabled: (val: boolean) => void;
  closeCelebration: () => void;
  resetDemoData: () => void;

  // Gamification core
  addXP: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGreenScore: (amount: number) => void;

  // City Builder
  upgradeBuilding: (buildingId: string) => boolean;

  // Circular Plants
  upgradePlant: (plantId: string) => boolean;
  startPlantBatch: (plantId: string, quantityKg: number) => boolean;
  claimPlantBatch: (plantId: string) => void;

  // Transport
  upgradeTruck: (truckId: string) => boolean;
  buyTruck: (truckId: string) => boolean;
  dispatchTruck: (truckId: string, destination: string, cargoKg: number) => boolean;

  // Pickups
  requestPickup: (category: WasteCategory, weightKg: number, address: string, scheduledTime: string) => void;
  acceptPickup: (pickupId: string, collectorName: string) => void;
  updatePickupStatus: (pickupId: string, status: PickupRequest['status']) => void;
  completePickup: (pickupId: string, verifiedWeightKg: number) => void;

  // Mini Games & Scans
  recordSortingScore: (score: number, itemsSorted: number, maxCombo: number, perfectSort?: boolean) => void;
  recordScanWaste: (category: WasteCategory, itemName: string, weightKg: number) => { xp: number; coins: number };

  // Missions & Skills & Chests
  claimMission: (missionId: string) => void;
  unlockSkill: (skillId: string) => boolean;
  openChest: (tier: 'green' | 'titanium' | 'mythic') => { coins: number; xp: number; specialItem?: string };

  // Marketplace
  buyMarketItem: (itemId: string, quantity: number) => boolean;
  sellMarketItem: (name: string, category: WasteCategory, pricePerUnit: number, quantity: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'econidhi_auth',
  USER: 'econidhi_user',
  ROLE: 'econidhi_role',
  VIEW: 'econidhi_view',
  BUILDINGS: 'econidhi_buildings',
  PLANTS: 'econidhi_plants',
  TRUCKS: 'econidhi_trucks',
  PICKUPS: 'econidhi_pickups',
  MISSIONS: 'econidhi_missions',
  ACHIEVEMENTS: 'econidhi_achievements',
  MARKET: 'econidhi_market',
  SKILLS: 'econidhi_skills',
  WASTE_HISTORY: 'econidhi_waste_history',
  GAME_PROGRESS: 'econidhi_game_progress'
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER) || localStorage.getItem('w2w_v2_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [role, setRole] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE) || localStorage.getItem('w2w_v2_role');
      return (saved as Role) || 'citizen';
    } catch {
      return 'citizen';
    }
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW) || localStorage.getItem('w2w_v2_view');
      return (saved as AppView) || 'home';
    } catch {
      return 'home';
    }
  });

  const [buildings, setBuildings] = useState<CityBuilding[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUILDINGS) || localStorage.getItem('w2w_v2_buildings');
      return saved ? JSON.parse(saved) : INITIAL_BUILDINGS;
    } catch {
      return INITIAL_BUILDINGS;
    }
  });

  const [plants, setPlants] = useState<ProcessingPlant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANTS) || localStorage.getItem('w2w_v2_plants');
      return saved ? JSON.parse(saved) : INITIAL_PLANTS;
    } catch {
      return INITIAL_PLANTS;
    }
  });

  const [trucks, setTrucks] = useState<TruckVehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRUCKS) || localStorage.getItem('w2w_v2_trucks');
      return saved ? JSON.parse(saved) : INITIAL_TRUCKS;
    } catch {
      return INITIAL_TRUCKS;
    }
  });

  const [pickups, setPickups] = useState<PickupRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PICKUPS) || localStorage.getItem('w2w_v2_pickups');
      return saved ? JSON.parse(saved) : INITIAL_PICKUPS;
    } catch {
      return INITIAL_PICKUPS;
    }
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MISSIONS) || localStorage.getItem('w2w_v2_missions');
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || localStorage.getItem('w2w_v2_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MARKET) || localStorage.getItem('w2w_v2_market');
      return saved ? JSON.parse(saved) : INITIAL_MARKET_ITEMS;
    } catch {
      return INITIAL_MARKET_ITEMS;
    }
  });

  const [skills, setSkills] = useState<SkillNode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS) || localStorage.getItem('w2w_v2_skills');
      return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  });

  const [wasteHistory, setWasteHistory] = useState<WasteHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WASTE_HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_WASTE_HISTORY;
    } catch {
      return INITIAL_WASTE_HISTORY;
    }
  });

  const [gameProgress, setGameProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
      return saved ? JSON.parse(saved) : INITIAL_GAME_PROGRESS;
    } catch {
      return INITIAL_GAME_PROGRESS;
    }
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => sound.isSoundEnabled());
  const [musicEnabled, setMusicEnabledState] = useState<boolean>(() => sound.isMusicEnabled());
  const [hapticsEnabled, setHapticsEnabledState] = useState<boolean>(() => sound.isHapticsEnabled());
  const [celebration, setCelebration] = useState<RewardCelebration | null>(null);

  const [authSession, setAuthSession] = useState<AuthSessionData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH) || localStorage.getItem('w2w_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.pin) {
          // If already unlocked in this active tab session, keep unlocked
          const tabUnlocked = sessionStorage.getItem('econidhi_tab_unlocked') === 'true';
          return {
            name: parsed.name || 'Darshan',
            email: parsed.email || 'darshancodetech04@gmail.com',
            pin: parsed.pin || '',
            isLoggedIn: tabUnlocked,
            registeredAt: parsed.registeredAt || new Date().toISOString(),
            lastLoginAt: parsed.lastLoginAt || new Date().toISOString()
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Auto-sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW, currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUILDINGS, JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRUCKS, JSON.stringify(trucks));
  }, [trucks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));
  }, [pickups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKET, JSON.stringify(marketItems));
  }, [marketItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WASTE_HISTORY, JSON.stringify(wasteHistory));
  }, [wasteHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(gameProgress));
  }, [gameProgress]);

  // Compute City Tier & Pollution Level
  const getCityStage = (score: number): CityStage => {
    if (score < 250) return 'Polluted Town';
    if (score < 500) return 'Clean Town';
    if (score < 750) return 'Green City';
    if (score < 1000) return 'Smart Eco City';
    return 'Circular Metropolis';
  };

  const cityStage = getCityStage(user.greenScore);
  const cityPollutionPercent = Math.max(0, Math.min(100, Math.round(100 - (user.greenScore / 1000) * 100)));

  // Simulation Game Tick: Process Plants, Truck trips, and generate passive coin yields
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Process active plant batches
      setPlants(prev =>
        prev.map(p => {
          if (p.isProcessing && p.batchTimeRemaining > 0) {
            const nextTime = p.batchTimeRemaining - 1;
            if (nextTime <= 0) {
              const outputKg = Math.round(p.currentBatchKg * (p.efficiency / 100));
              sound.playCorrect();
              return {
                ...p,
                isProcessing: false,
                batchTimeRemaining: 0,
                currentBatchKg: 0,
                unclaimedOutputKg: p.unclaimedOutputKg + outputKg
              };
            }
            return { ...p, batchTimeRemaining: nextTime };
          }
          return p;
        })
      );

      // 2. Process active truck trips
      setTrucks(prev =>
        prev.map(t => {
          if (t.activeTrip && t.activeTrip.remainingSeconds > 0) {
            const nextSec = t.activeTrip.remainingSeconds - 1;
            if (nextSec <= 0) {
              // Trip finished!
              const rewardC = t.activeTrip.rewardCoins;
              const rewardX = t.activeTrip.rewardXP;
              setUser(u => ({
                ...u,
                ecoCoins: u.ecoCoins + rewardC,
                xp: u.xp + rewardX,
                co2DivertedKg: Number((u.co2DivertedKg + t.co2SavedPerTrip).toFixed(1))
              }));
              sound.playCoinReward();
              return { ...t, activeTrip: undefined };
            }
            return {
              ...t,
              activeTrip: { ...t.activeTrip, remainingSeconds: nextSec }
            };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Passive building coin generation every 30 seconds
  useEffect(() => {
    const passiveGen = setInterval(() => {
      const activeTotalPerMin = buildings.reduce(
        (acc, b) => acc + (b.unlocked ? b.coinGenerationPerMin * b.level : 0),
        0
      );
      if (activeTotalPerMin > 0) {
        const halfMinGain = Math.max(1, Math.round(activeTotalPerMin / 2));
        setUser(u => ({
          ...u,
          ecoCoins: u.ecoCoins + halfMinGain
        }));
      }
    }, 30000);

    return () => clearInterval(passiveGen);
  }, [buildings]);

  // Audio/Haptic Handlers
  const setSoundEnabled = (val: boolean) => {
    sound.setSoundEnabled(val);
    setSoundEnabledState(val);
  };

  const setMusicEnabled = (val: boolean) => {
    sound.setMusicEnabled(val);
    setMusicEnabledState(val);
  };

  const setHapticsEnabled = (val: boolean) => {
    sound.setHapticsEnabled(val);
    setHapticsEnabledState(val);
  };

  const navigate = (view: AppView) => {
    sound.playTap();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = (newRole: Role) => {
    sound.playTap();
    setRole(newRole);
    if (newRole === 'collector') {
      setCurrentView('collector_dashboard');
    } else if (newRole === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const closeCelebration = () => {
    sound.playTap();
    setCelebration(null);
  };

  const completeAuthOnboarding = (name: string, email: string, pin: string) => {
    const finalName = name.trim() || 'Darshan';
    const finalEmail = email.trim() || 'resident@econidhi.city';
    const session: AuthSessionData = {
      name: finalName,
      email: finalEmail,
      pin,
      isLoggedIn: true,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    setAuthSession(session);
    sessionStorage.setItem('econidhi_tab_unlocked', 'true');
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    localStorage.setItem('w2w_auth_session', JSON.stringify(session));
    localStorage.setItem('w2w_onboarded_completed', 'true');
    setUser(prev => ({
      ...prev,
      name: finalName,
      email: finalEmail,
      xp: prev.xp + 100
    }));
    sound.playCoinReward();
  };

  const loginWithPin = (enteredPin: string): boolean => {
    if (authSession && authSession.pin === enteredPin) {
      const updated: AuthSessionData = {
        ...authSession,
        isLoggedIn: true,
        lastLoginAt: new Date().toISOString()
      };
      setAuthSession(updated);
      sessionStorage.setItem('econidhi_tab_unlocked', 'true');
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(updated));
      localStorage.setItem('w2w_auth_session', JSON.stringify(updated));
      localStorage.setItem('w2w_onboarded_completed', 'true');
      sound.playCorrect();
      return true;
    }
    sound.playWrong();
    return false;
  };

  const logoutAuth = () => {
    sessionStorage.removeItem('econidhi_tab_unlocked');
    localStorage.removeItem('w2w_onboarded_completed');
    if (authSession) {
      const updated: AuthSessionData = {
        ...authSession,
        isLoggedIn: false
      };
      setAuthSession(updated);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(updated));
      localStorage.setItem('w2w_auth_session', JSON.stringify(updated));
    }
    sound.playTap();
  };

  const clearAllLocalData = () => {
    sessionStorage.clear();
    localStorage.clear();
    setAuthSession(null);
    setUser(INITIAL_USER);
    setRole('citizen');
    setCurrentView('home');
    setBuildings(INITIAL_BUILDINGS);
    setPlants(INITIAL_PLANTS);
    setTrucks(INITIAL_TRUCKS);
    setPickups(INITIAL_PICKUPS);
    setMissions(INITIAL_MISSIONS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setMarketItems(INITIAL_MARKET_ITEMS);
    setSkills(INITIAL_SKILLS);
    setWasteHistory(INITIAL_WASTE_HISTORY);
    setGameProgress(INITIAL_GAME_PROGRESS);
    sound.playTap();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B', '#34D399']
      });
    } catch {
      // fallback safe
    }
  };

  const addXP = (amount: number, reason?: string) => {
    setUser(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXP = prev.xpToNextLevel;
      let newSkillPoints = prev.skillPoints;
      let leveledUp = false;

      while (newXP >= newMaxXP) {
        newXP -= newMaxXP;
        newLevel += 1;
        newMaxXP = Math.round(newMaxXP * 1.35);
        newSkillPoints += 1;
        leveledUp = true;
      }

      if (leveledUp) {
        sound.playLevelUp();
        triggerConfetti();
        setCelebration({
          title: `Level Up! Level ${newLevel}`,
          subtitle: `Congratulations! You unlocked +1 Skill Point and enhanced city status.`,
          xp: amount,
          coins: newLevel * 100
        });
      } else {
        sound.playCollect();
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newMaxXP,
        skillPoints: newSkillPoints,
        ecoCoins: leveledUp ? prev.ecoCoins + newLevel * 100 : prev.ecoCoins
      };
    });
  };

  const addCoins = (amount: number) => {
    sound.playCoinReward();
    setUser(prev => ({
      ...prev,
      ecoCoins: prev.ecoCoins + amount
    }));
  };

  const spendCoins = (amount: number): boolean => {
    if (user.ecoCoins < amount) {
      sound.playWrong();
      return false;
    }
    sound.playTap();
    setUser(prev => ({
      ...prev,
      ecoCoins: prev.ecoCoins - amount
    }));
    return true;
  };

  const addGreenScore = (amount: number) => {
    setUser(prev => {
      const nextScore = prev.greenScore + amount;
      return {
        ...prev,
        greenScore: nextScore
      };
    });
  };

  // City Building Upgrades
  const upgradeBuilding = (buildingId: string): boolean => {
    const target = buildings.find(b => b.id === buildingId);
    if (!target) return false;

    const cost = Math.round(target.baseCost * Math.pow(target.costMultiplier, target.level - 1));
    if (user.ecoCoins < cost) {
      sound.playWrong();
      return false;
    }

    spendCoins(cost);
    sound.playBuildingComplete();
    triggerConfetti();

    setBuildings(prev =>
      prev.map(b => {
        if (b.id === buildingId) {
          return {
            ...b,
            level: b.level + 1,
            unlocked: true
          };
        }
        return b;
      })
    );

    addGreenScore(target.greenScoreBonus);
    addXP(120);

    setCelebration({
      title: `${target.name} Upgraded!`,
      subtitle: `Now at Level ${target.level + 1}. Passive coin generation & city eco-score boosted!`,
      greenScore: target.greenScoreBonus,
      xp: 120
    });

    return true;
  };

  // Circular Plants
  const upgradePlant = (plantId: string): boolean => {
    const p = plants.find(item => item.id === plantId);
    if (!p || p.level >= p.maxLevel) return false;

    if (user.ecoCoins < p.upgradeCost) {
      sound.playWrong();
      return false;
    }

    spendCoins(p.upgradeCost);
    sound.playBuildingComplete();

    setPlants(prev =>
      prev.map(item => {
        if (item.id === plantId) {
          return {
            ...item,
            level: item.level + 1,
            efficiency: Math.min(99, item.efficiency + 5),
            batchCapacityKg: Math.round(item.batchCapacityKg * 1.3),
            upgradeCost: Math.round(item.upgradeCost * 1.5)
          };
        }
        return item;
      })
    );

    addXP(100);
    addGreenScore(25);
    return true;
  };

  const startPlantBatch = (plantId: string, quantityKg: number): boolean => {
    const p = plants.find(item => item.id === plantId);
    if (!p || p.isProcessing || quantityKg <= 0) return false;

    sound.playTap();
    setPlants(prev =>
      prev.map(item => {
        if (item.id === plantId) {
          return {
            ...item,
            isProcessing: true,
            currentBatchKg: quantityKg,
            batchTimeRemaining: item.batchDurationSeconds
          };
        }
        return item;
      })
    );
    return true;
  };

  const claimPlantBatch = (plantId: string) => {
    const p = plants.find(item => item.id === plantId);
    if (!p || p.unclaimedOutputKg <= 0) return;

    const earnings = Math.round(p.unclaimedOutputKg * p.outputMarketValuePerKg);
    const xpGain = Math.round(p.unclaimedOutputKg * 2);

    sound.playCoinReward();
    triggerConfetti();

    setPlants(prev =>
      prev.map(item => {
        if (item.id === plantId) {
          return {
            ...item,
            unclaimedOutputKg: 0
          };
        }
        return item;
      })
    );

    addCoins(earnings);
    addXP(xpGain);
    addGreenScore(Math.round(p.unclaimedOutputKg * 0.5));

    setUser(prev => ({
      ...prev,
      totalRecycledKg: Number((prev.totalRecycledKg + p.unclaimedOutputKg).toFixed(1)),
      co2DivertedKg: Number((prev.co2DivertedKg + p.unclaimedOutputKg * 1.8).toFixed(1)),
      treesSaved: prev.treesSaved + (p.unclaimedOutputKg > 20 ? 1 : 0)
    }));

    setCelebration({
      title: 'Batch Claimed & Sold!',
      subtitle: `Recovered ${p.outputName} delivered to manufacturers!`,
      coins: earnings,
      xp: xpGain
    });
  };

  // Transport
  const upgradeTruck = (truckId: string): boolean => {
    const t = trucks.find(item => item.id === truckId);
    if (!t) return false;
    if (user.ecoCoins < t.upgradeCost) {
      sound.playWrong();
      return false;
    }

    spendCoins(t.upgradeCost);
    sound.playBuildingComplete();

    setTrucks(prev =>
      prev.map(item => {
        if (item.id === truckId) {
          return {
            ...item,
            speedKmH: item.speedKmH + 10,
            capacityKg: Math.round(item.capacityKg * 1.25),
            upgradeCost: Math.round(item.upgradeCost * 1.6)
          };
        }
        return item;
      })
    );

    addXP(80);
    return true;
  };

  const buyTruck = (truckId: string): boolean => {
    const t = trucks.find(item => item.id === truckId);
    if (!t || t.isOwned) return false;
    if (user.ecoCoins < t.upgradeCost) {
      sound.playWrong();
      return false;
    }

    spendCoins(t.upgradeCost);
    sound.playAchievement();
    triggerConfetti();

    setTrucks(prev =>
      prev.map(item => {
        if (item.id === truckId) {
          return { ...item, isOwned: true };
        }
        return item;
      })
    );

    addXP(200);
    addGreenScore(50);
    return true;
  };

  const dispatchTruck = (truckId: string, destination: string, cargoKg: number): boolean => {
    const t = trucks.find(item => item.id === truckId);
    if (!t || !t.isOwned || t.activeTrip) return false;

    sound.playTap();
    const duration = Math.max(15, Math.round(45 - t.speedKmH * 0.3));
    const rewardCoins = Math.round(cargoKg * 0.8 + 50);
    const rewardXP = Math.round(cargoKg * 0.5 + 30);

    setTrucks(prev =>
      prev.map(item => {
        if (item.id === truckId) {
          return {
            ...item,
            activeTrip: {
              destination,
              durationSeconds: duration,
              remainingSeconds: duration,
              rewardCoins,
              rewardXP,
              cargoKg
            }
          };
        }
        return item;
      })
    );

    return true;
  };

  // Pickups
  const requestPickup = (
    category: WasteCategory,
    weightKg: number,
    address: string,
    scheduledTime: string
  ) => {
    sound.playCollect();
    const newReq: PickupRequest = {
      id: `req_${Date.now().toString().slice(-4)}`,
      citizenName: user.name,
      citizenPhone: '+1 (555) 019-4821',
      category,
      estimatedWeightKg: weightKg,
      pickupAddress: address,
      lat: 37.7749 + (Math.random() - 0.5) * 0.04,
      lng: -122.4194 + (Math.random() - 0.5) * 0.04,
      scheduledTime: scheduledTime || 'Today, Express within 2 hrs',
      status: 'pending',
      coinsReward: Math.round(weightKg * 8 + 40),
      xpReward: Math.round(weightKg * 5 + 30),
      requestedAt: 'Just now'
    };

    setPickups(prev => [newReq, ...prev]);

    // Update mission progress
    setMissions(prev =>
      prev.map(m => {
        if (m.id === 'm_daily_3') {
          return {
            ...m,
            currentProgress: Math.min(m.targetProgress, m.currentProgress + 1)
          };
        }
        return m;
      })
    );

    setCelebration({
      title: 'Pickup Scheduled!',
      subtitle: `A nearby eco-hauler has been dispatched for your ${weightKg}kg ${category} collection.`,
      coins: newReq.coinsReward,
      xp: newReq.xpReward
    });
  };

  const acceptPickup = (pickupId: string, collectorName: string) => {
    sound.playTap();
    setPickups(prev =>
      prev.map(p => {
        if (p.id === pickupId) {
          return {
            ...p,
            status: 'accepted',
            collectorName
          };
        }
        return p;
      })
    );
  };

  const updatePickupStatus = (pickupId: string, status: PickupRequest['status']) => {
    sound.playTap();
    setPickups(prev =>
      prev.map(p => (p.id === pickupId ? { ...p, status } : p))
    );
  };

  const completePickup = (pickupId: string, verifiedWeightKg: number) => {
    const target = pickups.find(p => p.id === pickupId);
    if (!target) return;

    sound.playAchievement();
    triggerConfetti();

    setPickups(prev =>
      prev.map(p => {
        if (p.id === pickupId) {
          return {
            ...p,
            status: 'completed',
            verifiedWeightKg,
            completedAt: 'Just now'
          };
        }
        return p;
      })
    );

    const bonusCoins = Math.round(verifiedWeightKg * 9 + 40);
    const bonusXP = Math.round(verifiedWeightKg * 6 + 30);

    addCoins(bonusCoins);
    addXP(bonusXP);
    addGreenScore(Math.round(verifiedWeightKg * 2));

    setUser(prev => ({
      ...prev,
      totalRecycledKg: Number((prev.totalRecycledKg + verifiedWeightKg).toFixed(1)),
      co2DivertedKg: Number((prev.co2DivertedKg + verifiedWeightKg * 2.1).toFixed(1)),
      treesSaved: prev.treesSaved + Math.floor(verifiedWeightKg / 20)
    }));

    // Record to persistent waste history
    const historyItem: WasteHistoryItem = {
      id: `wh_${Date.now()}`,
      category: target.category,
      itemName: `${target.category.toUpperCase()} Pickup Verified`,
      weightKg: verifiedWeightKg,
      timestamp: 'Just now',
      xpEarned: bonusXP,
      coinsEarned: bonusCoins,
      actionType: 'pickup'
    };
    setWasteHistory(prev => [historyItem, ...prev.slice(0, 49)]);

    setCelebration({
      title: 'Collection Verified!',
      subtitle: `Successfully logged ${verifiedWeightKg}kg of diverted waste. Rewards credited!`,
      coins: bonusCoins,
      xp: bonusXP
    });
  };

  // Mini Games & AI Scans
  const recordSortingScore = (
    score: number,
    itemsSorted: number,
    maxCombo: number,
    perfectSort: boolean = false
  ) => {
    let coinsWon = Math.round(score * 0.7);
    let xpWon = Math.round(score * 0.5);

    if (perfectSort) {
      coinsWon += 200;
      xpWon += 150;
    }

    addCoins(coinsWon);
    addXP(xpWon);
    addGreenScore(Math.round(itemsSorted * 1.5) + (perfectSort ? 25 : 0));

    // Update game progress
    setGameProgress(prev => ({
      ...prev,
      sortingHighScore: Math.max(prev.sortingHighScore, score),
      totalGamesPlayed: prev.totalGamesPlayed + 1
    }));

    // Record to waste history
    const historyItem: WasteHistoryItem = {
      id: `wh_${Date.now()}`,
      category: 'plastic',
      itemName: `${itemsSorted} items sorted (${score} pts)`,
      weightKg: Number((itemsSorted * 0.25).toFixed(1)),
      timestamp: 'Just now',
      xpEarned: xpWon,
      coinsEarned: coinsWon,
      actionType: 'sort'
    };
    setWasteHistory(prev => [historyItem, ...prev.slice(0, 49)]);

    // Missions check
    setMissions(prev =>
      prev.map(m => {
        if (m.id === 'm_daily_2') {
          return {
            ...m,
            currentProgress: Math.min(m.targetProgress, m.currentProgress + itemsSorted)
          };
        }
        return m;
      })
    );

    // Achievements check: Perfect Sort
    if (perfectSort && itemsSorted >= 5) {
      setAchievements(prev =>
        prev.map(a => {
          if (a.id === 'ach_perfect_sort' && !a.unlocked) {
            return {
              ...a,
              progress: 1,
              unlocked: true
            };
          }
          return a;
        })
      );
      sound.playAchievement();
      triggerConfetti();

      setCelebration({
        title: 'Perfect Sort Achievement!',
        subtitle: `Flawless run! You sorted all ${itemsSorted} items with 100% accuracy and zero errors!`,
        coins: coinsWon,
        xp: xpWon,
        badge: 'Perfect Sort'
      });
      return;
    }

    setCelebration({
      title: 'Sorting Run Complete!',
      subtitle: `Sorted ${itemsSorted} items with a max combo multiplier of x${maxCombo}!`,
      coins: coinsWon,
      xp: xpWon
    });
  };

  const recordScanWaste = (category: WasteCategory, itemName: string, weightKg: number) => {
    const hasScanSkill = user.unlockedSkills.includes('tech_1');
    const baseCoins = Math.round(weightKg * 20 + 35);
    const coinsWon = hasScanSkill ? Math.round(baseCoins * 1.25) : baseCoins;
    const xpWon = Math.round(weightKg * 15 + 25);

    addCoins(coinsWon);
    addXP(xpWon);
    addGreenScore(15);

    setUser(prev => ({
      ...prev,
      totalRecycledKg: Number((prev.totalRecycledKg + weightKg).toFixed(1)),
      co2DivertedKg: Number((prev.co2DivertedKg + weightKg * 1.6).toFixed(1))
    }));

    // Daily mission progression
    setMissions(prev =>
      prev.map(m => {
        if (m.id === 'm_daily_1') {
          return {
            ...m,
            currentProgress: Math.min(m.targetProgress, m.currentProgress + 1)
          };
        }
        return m;
      })
    );

    // Record to waste history
    const historyItem: WasteHistoryItem = {
      id: `wh_${Date.now()}`,
      category,
      itemName,
      weightKg,
      timestamp: 'Just now',
      xpEarned: xpWon,
      coinsEarned: coinsWon,
      actionType: 'scan'
    };
    setWasteHistory(prev => [historyItem, ...prev.slice(0, 49)]);

    return { xp: xpWon, coins: coinsWon };
  };

  // Missions & Skills & Chests
  const claimMission = (missionId: string) => {
    const m = missions.find(item => item.id === missionId);
    if (!m || m.claimed || m.currentProgress < m.targetProgress) return;

    sound.playMissionComplete();
    triggerConfetti();

    setMissions(prev =>
      prev.map(item => (item.id === missionId ? { ...item, claimed: true } : item))
    );

    addCoins(m.rewardCoins);
    addXP(m.rewardXP);
    addGreenScore(30);

    setCelebration({
      title: 'Mission Completed!',
      subtitle: `${m.title} reward claimed!`,
      coins: m.rewardCoins,
      xp: m.rewardXP
    });
  };

  const unlockSkill = (skillId: string): boolean => {
    const s = skills.find(item => item.id === skillId);
    if (!s || s.unlocked || user.skillPoints < s.cost) {
      sound.playWrong();
      return false;
    }

    sound.playAchievement();
    triggerConfetti();

    setUser(prev => ({
      ...prev,
      skillPoints: prev.skillPoints - s.cost,
      unlockedSkills: [...prev.unlockedSkills, s.id]
    }));

    setSkills(prev =>
      prev.map(item => (item.id === skillId ? { ...item, unlocked: true } : item))
    );

    setCelebration({
      title: 'Perk Unlocked!',
      subtitle: `${s.name}: ${s.bonus}`,
      badge: s.name
    });

    return true;
  };

  const openChest = (tier: 'green' | 'titanium' | 'mythic') => {
    sound.playChestOpen();
    triggerConfetti();

    let coins = 150;
    let xp = 100;
    let specialItem = 'Solar Cell Blueprint';

    if (tier === 'green') {
      coins = Math.floor(Math.random() * 200) + 120;
      xp = Math.floor(Math.random() * 100) + 80;
      specialItem = 'Compost Accelerator Token';
    } else if (tier === 'titanium') {
      coins = Math.floor(Math.random() * 450) + 300;
      xp = Math.floor(Math.random() * 250) + 200;
      specialItem = 'Turbo Truck Fuel Injector';
    } else {
      coins = Math.floor(Math.random() * 1200) + 800;
      xp = Math.floor(Math.random() * 600) + 500;
      specialItem = 'Mythic Zero-Landfill Core';
    }

    addCoins(coins);
    addXP(xp);

    setCelebration({
      title: `${tier.toUpperCase()} Mystery Chest!`,
      subtitle: `Found: ${specialItem}!`,
      coins,
      xp
    });

    return { coins, xp, specialItem };
  };

  // Marketplace
  const buyMarketItem = (itemId: string, quantity: number): boolean => {
    const item = marketItems.find(i => i.id === itemId);
    if (!item || item.availableQuantity < quantity) return false;

    const totalCost = item.pricePerUnit * quantity;
    if (user.ecoCoins < totalCost) {
      sound.playWrong();
      return false;
    }

    spendCoins(totalCost);
    sound.playCoinReward();

    setMarketItems(prev =>
      prev.map(i => {
        if (i.id === itemId) {
          return {
            ...i,
            availableQuantity: i.availableQuantity - quantity
          };
        }
        return i;
      })
    );

    addXP(quantity * 10);
    addGreenScore(Math.round(item.co2ReductionKg * quantity * 0.1));

    return true;
  };

  const sellMarketItem = (
    name: string,
    category: WasteCategory,
    pricePerUnit: number,
    quantity: number
  ) => {
    sound.playCoinReward();
    const earnings = pricePerUnit * quantity;
    addCoins(earnings);
    addXP(quantity * 8);

    const newItem: MarketItem = {
      id: `mk_${Date.now().toString().slice(-4)}`,
      name,
      category,
      description: 'Citizen listed recycled material stock.',
      pricePerUnit,
      unit: 'batch',
      availableQuantity: quantity,
      seller: user.name,
      buyerType: 'Certified Manufacturer',
      co2ReductionKg: quantity * 2.5
    };

    setMarketItems(prev => [newItem, ...prev]);

    setCelebration({
      title: 'Material Sold!',
      subtitle: `Sold ${quantity}x of ${name} directly to verified eco manufacturers!`,
      coins: earnings,
      xp: quantity * 8
    });
  };

  const resetDemoData = () => {
    clearAllLocalData();
  };

  return (
    <GameContext.Provider
      value={{
        user,
        role,
        currentView,
        buildings,
        plants,
        trucks,
        pickups,
        missions,
        achievements,
        marketItems,
        skills,
        cityStage,
        cityPollutionPercent,
        celebration,
        soundEnabled,
        musicEnabled,
        hapticsEnabled,
        authSession,
        wasteHistory,
        gameProgress,
        completeAuthOnboarding,
        loginWithPin,
        logoutAuth,
        clearAllLocalData,
        navigate,
        switchRole,
        setSoundEnabled,
        setMusicEnabled,
        setHapticsEnabled,
        closeCelebration,
        resetDemoData,
        addXP,
        addCoins,
        spendCoins,
        addGreenScore,
        upgradeBuilding,
        upgradePlant,
        startPlantBatch,
        claimPlantBatch,
        upgradeTruck,
        buyTruck,
        dispatchTruck,
        requestPickup,
        acceptPickup,
        updatePickupStatus,
        completePickup,
        recordSortingScore,
        recordScanWaste,
        claimMission,
        unlockSkill,
        openChest,
        buyMarketItem,
        sellMarketItem
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
};
