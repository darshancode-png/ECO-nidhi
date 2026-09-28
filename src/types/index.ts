export type Role = 'citizen' | 'collector' | 'admin';

export type AppView =
  | 'splash'
  | 'onboarding'
  | 'role_select'
  | 'home'
  | 'map'
  | 'collect'
  | 'games'
  | 'market'
  | 'profile'
  | 'scanner'
  | 'pickup'
  | 'impact'
  | 'sorting_game'
  | 'recycling_run'
  | 'factory_manager'
  | 'clean_city'
  | 'waste_hunt'
  | 'eco_quiz'
  | 'community_cleanup'
  | 'transport'
  | 'plants'
  | 'missions'
  | 'achievements'
  | 'leaderboard'
  | 'chests'
  | 'skills'
  | 'collector_dashboard'
  | 'admin_dashboard';

export type WasteCategory =
  | 'organic'
  | 'plastic'
  | 'paper'
  | 'glass'
  | 'metal'
  | 'ewaste'
  | 'construction';

export interface UserProfile {
  name: string;
  email?: string;
  avatar: string;
  role: Role;
  level: number;
  xp: number;
  xpToNextLevel: number;
  ecoCoins: number;
  greenScore: number;
  streakDays: number;
  lastDailyDate: string;
  totalRecycledKg: number;
  co2DivertedKg: number;
  treesSaved: number;
  waterSavedLiters: number;
  skillPoints: number;
  unlockedSkills: string[];
}

export interface WasteHistoryItem {
  id: string;
  category: WasteCategory;
  itemName: string;
  weightKg: number;
  timestamp: string;
  xpEarned: number;
  coinsEarned: number;
  actionType: 'scan' | 'sort' | 'pickup';
}

export interface GameProgress {
  sortingHighScore: number;
  recyclingRunMaxDistance: number;
  quizzesCompleted: number;
  totalGamesPlayed: number;
}

export interface AuthSessionData {
  name: string;
  email: string;
  pin: string;
  isLoggedIn: boolean;
  registeredAt?: string;
  lastLoginAt?: string;
}

export type CityStage = 
  | 'Polluted Town'
  | 'Clean Town'
  | 'Green City'
  | 'Smart Eco City'
  | 'Circular Metropolis';

export interface CityBuilding {
  id: string;
  name: string;
  category: 'residential' | 'energy' | 'recycling' | 'nature' | 'transport';
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  coinGenerationPerMin: number;
  greenScoreBonus: number;
  description: string;
  unlocked: boolean;
  iconName: string;
}

export interface ProcessingPlant {
  id: string;
  name: string;
  category: WasteCategory;
  inputName: string;
  outputName: string;
  level: number;
  maxLevel: number;
  efficiency: number; // percentage
  upgradeCost: number;
  batchCapacityKg: number;
  currentBatchKg: number;
  batchDurationSeconds: number;
  batchTimeRemaining: number;
  isProcessing: boolean;
  unclaimedOutputKg: number;
  outputMarketValuePerKg: number;
  description: string;
}

export interface TruckVehicle {
  id: string;
  name: string;
  tier: number;
  speedKmH: number;
  capacityKg: number;
  co2SavedPerTrip: number;
  energyType: 'Electric' | 'Bio-CNG' | 'Hydrogen' | 'Solar-Hybrid';
  upgradeCost: number;
  isOwned: boolean;
  activeTrip?: {
    destination: string;
    durationSeconds: number;
    remainingSeconds: number;
    rewardCoins: number;
    rewardXP: number;
    cargoKg: number;
  };
}

export interface PickupRequest {
  id: string;
  citizenName: string;
  citizenPhone: string;
  category: WasteCategory;
  estimatedWeightKg: number;
  verifiedWeightKg?: number;
  pickupAddress: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'en_route' | 'weighing' | 'completed' | 'cancelled';
  collectorName?: string;
  coinsReward: number;
  xpReward: number;
  requestedAt: string;
  completedAt?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'special';
  currentProgress: number;
  targetProgress: number;
  rewardXP: number;
  rewardCoins: number;
  claimed: boolean;
  expiresInText: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  progress: number;
  target: number;
  unlocked: boolean;
  rewardCoins: number;
  rewardXP: number;
  badgeIcon: string;
}

export interface MarketItem {
  id: string;
  name: string;
  category: WasteCategory;
  description: string;
  pricePerUnit: number;
  unit: string;
  availableQuantity: number;
  seller: string;
  buyerType: 'Certified Manufacturer' | 'Community Farm' | 'Eco Builder' | 'Artisan Recycler';
  co2ReductionKg: number;
}

export interface SkillNode {
  id: string;
  name: string;
  branch: 'Sorting' | 'Technology' | 'Logistics' | 'Economy';
  description: string;
  cost: number;
  requiredLevel: number;
  icon: string;
  unlocked: boolean;
  bonus: string;
}
