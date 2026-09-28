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
  WasteCategory
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex Rivera',
  avatar: 'eco_ranger',
  role: 'citizen',
  level: 4,
  xp: 780,
  xpToNextLevel: 1000,
  ecoCoins: 2450,
  greenScore: 540,
  streakDays: 6,
  lastDailyDate: new Date().toISOString().split('T')[0],
  totalRecycledKg: 142.5,
  co2DivertedKg: 285.0,
  treesSaved: 14,
  waterSavedLiters: 1840,
  skillPoints: 3,
  unlockedSkills: ['sorting_1', 'tech_1']
};

export const INITIAL_BUILDINGS: CityBuilding[] = [
  {
    id: 'b_residential',
    name: 'Solar Eco-Apartments',
    category: 'residential',
    level: 2,
    maxLevel: 5,
    baseCost: 350,
    costMultiplier: 1.6,
    coinGenerationPerMin: 8,
    greenScoreBonus: 40,
    description: 'Residential micro-grid with solar balconies and localized compost chutes.',
    unlocked: true,
    iconName: 'home'
  },
  {
    id: 'b_mrf',
    name: 'Smart Materials Recovery Facility',
    category: 'recycling',
    level: 3,
    maxLevel: 5,
    baseCost: 600,
    costMultiplier: 1.7,
    coinGenerationPerMin: 15,
    greenScoreBonus: 85,
    description: 'Automated optical sorting belts that sort municipal waste at 98% accuracy.',
    unlocked: true,
    iconName: 'recycle'
  },
  {
    id: 'b_biogas',
    name: 'Anaerobic Biogas Generator',
    category: 'energy',
    level: 2,
    maxLevel: 5,
    baseCost: 800,
    costMultiplier: 1.8,
    coinGenerationPerMin: 22,
    greenScoreBonus: 95,
    description: 'Ferments municipal organic scraps into clean methane for zero-emission city power.',
    unlocked: true,
    iconName: 'zap'
  },
  {
    id: 'b_polymer',
    name: 'Circular Polymer Micro-Plant',
    category: 'recycling',
    level: 1,
    maxLevel: 5,
    baseCost: 1200,
    costMultiplier: 1.9,
    coinGenerationPerMin: 30,
    greenScoreBonus: 120,
    description: 'Thermal pelletizer converting ocean & city plastics into high-grade manufacturing pellets.',
    unlocked: true,
    iconName: 'layers'
  },
  {
    id: 'b_aquaponics',
    name: 'Community Botanical Biosphere',
    category: 'nature',
    level: 1,
    maxLevel: 5,
    baseCost: 1500,
    costMultiplier: 2.0,
    coinGenerationPerMin: 35,
    greenScoreBonus: 150,
    description: 'Urban forest that filters urban particulate while growing organic produce with compost.',
    unlocked: false,
    iconName: 'tree'
  },
  {
    id: 'b_hydrogen',
    name: 'Green Hydrogen Fleet Hub',
    category: 'transport',
    level: 1,
    maxLevel: 5,
    baseCost: 2200,
    costMultiplier: 2.2,
    coinGenerationPerMin: 50,
    greenScoreBonus: 210,
    description: 'Electrolyzer fueling station providing zero-emission energy for city waste haulers.',
    unlocked: false,
    iconName: 'truck'
  }
];

export const INITIAL_PLANTS: ProcessingPlant[] = [
  {
    id: 'plant_organic',
    name: 'Bio-Digester & Humus Cell',
    category: 'organic',
    inputName: 'Food & Garden Scraps',
    outputName: 'Bio-Methane & Rich Compost',
    level: 2,
    maxLevel: 5,
    efficiency: 85,
    upgradeCost: 500,
    batchCapacityKg: 60,
    currentBatchKg: 40,
    batchDurationSeconds: 45,
    batchTimeRemaining: 0,
    isProcessing: false,
    unclaimedOutputKg: 34,
    outputMarketValuePerKg: 3.5,
    description: 'Turns food waste into nutrient-dense fertilizer and municipal electricity.'
  },
  {
    id: 'plant_plastic',
    name: 'Precision Extrusion Foundry',
    category: 'plastic',
    inputName: 'PET Bottles & Polymers',
    outputName: 'rPET Resin Flakes',
    level: 3,
    maxLevel: 5,
    efficiency: 92,
    upgradeCost: 750,
    batchCapacityKg: 100,
    currentBatchKg: 0,
    batchDurationSeconds: 60,
    batchTimeRemaining: 0,
    isProcessing: false,
    unclaimedOutputKg: 0,
    outputMarketValuePerKg: 6.0,
    description: 'Flakes, washes, and extrudes clean pellets ready for circular 3D filaments.'
  },
  {
    id: 'plant_paper',
    name: 'Hydra-Pulper Mill',
    category: 'paper',
    inputName: 'Cardboard & Paper Shreds',
    outputName: 'Bleach-Free Kraft Pulp',
    level: 1,
    maxLevel: 5,
    efficiency: 78,
    upgradeCost: 400,
    batchCapacityKg: 80,
    currentBatchKg: 0,
    batchDurationSeconds: 50,
    batchTimeRemaining: 0,
    isProcessing: false,
    unclaimedOutputKg: 0,
    outputMarketValuePerKg: 2.8,
    description: 'Disintegrates cellulose fibers into resilient recycled packaging stock.'
  },
  {
    id: 'plant_glass',
    name: 'Induction Cullet Kiln',
    category: 'glass',
    inputName: 'Crushed Bottles & Glass',
    outputName: 'Purified Glass Cullet',
    level: 1,
    maxLevel: 5,
    efficiency: 80,
    upgradeCost: 450,
    batchCapacityKg: 120,
    currentBatchKg: 0,
    batchDurationSeconds: 70,
    batchTimeRemaining: 0,
    isProcessing: false,
    unclaimedOutputKg: 0,
    outputMarketValuePerKg: 2.5,
    description: 'Melted cullet requires 30% less thermal energy than virgin raw silica.'
  },
  {
    id: 'plant_metal',
    name: 'Smelting & Ingot Press',
    category: 'metal',
    inputName: 'Cans, Foil & Ferrous Scrap',
    outputName: 'High-Purity Aluminum Billets',
    level: 2,
    maxLevel: 5,
    efficiency: 88,
    upgradeCost: 850,
    batchCapacityKg: 75,
    currentBatchKg: 0,
    batchDurationSeconds: 80,
    batchTimeRemaining: 0,
    isProcessing: false,
    unclaimedOutputKg: 0,
    outputMarketValuePerKg: 12.0,
    description: 'Saves 95% of greenhouse emissions compared to bauxite strip mining.'
  },
  {
    id: 'plant_ewaste',
    name: 'Urban Hydrometallurgy Refinery',
    category: 'ewaste',
    inputName: 'Smartphones, PCBs & Batteries',
    outputName: 'Recovered Gold, Copper & Lithium',
    level: 1,
    maxLevel: 5,
    efficiency: 74,
    upgradeCost: 1400,
    batchCapacityKg: 30,
    currentBatchKg: 0,
    batchDurationSeconds: 120,
    batchTimeRemaining: 0,
    isProcessing: false,
    unclaimedOutputKg: 0,
    outputMarketValuePerKg: 42.0,
    description: 'Non-toxic bio-leaching extracting rare precious elements from retired tech.'
  },
  {
    id: 'plant_construction',
    name: 'Aggregates & Paver Press',
    category: 'construction',
    inputName: 'Concrete Rubble & Drywall',
    outputName: 'Permeable Eco-Paver Bricks',
    level: 1,
    maxLevel: 5,
    efficiency: 82,
    upgradeCost: 650,
    batchCapacityKg: 200,
    currentBatchKg: 0,
    batchDurationSeconds: 90,
    batchTimeRemaining: 0,
    isProcessing: false,
    unclaimedOutputKg: 0,
    outputMarketValuePerKg: 1.8,
    description: 'Crushes demolition debris into stormwater-absorbing civic paving blocks.'
  }
];

export const INITIAL_TRUCKS: TruckVehicle[] = [
  {
    id: 'truck_1',
    name: 'VoltTrike Cargo Pod',
    tier: 1,
    speedKmH: 35,
    capacityKg: 150,
    co2SavedPerTrip: 12.5,
    energyType: 'Electric',
    upgradeCost: 350,
    isOwned: true
  },
  {
    id: 'truck_2',
    name: 'Bio-CNG Urban Sprinter',
    tier: 2,
    speedKmH: 60,
    capacityKg: 450,
    co2SavedPerTrip: 38.0,
    energyType: 'Bio-CNG',
    upgradeCost: 800,
    isOwned: true
  },
  {
    id: 'truck_3',
    name: 'EcoCompactor Pro X',
    tier: 3,
    speedKmH: 50,
    capacityKg: 1200,
    co2SavedPerTrip: 95.0,
    energyType: 'Electric',
    upgradeCost: 1500,
    isOwned: false
  },
  {
    id: 'truck_4',
    name: 'AeroZero Hydrogen Titan',
    tier: 4,
    speedKmH: 80,
    capacityKg: 3500,
    co2SavedPerTrip: 260.0,
    energyType: 'Hydrogen',
    upgradeCost: 3200,
    isOwned: false
  }
];

export const INITIAL_PICKUPS: PickupRequest[] = [
  {
    id: 'req_101',
    citizenName: 'Sophia Chen',
    citizenPhone: '+1 (555) 349-8812',
    category: 'plastic',
    estimatedWeightKg: 18.5,
    verifiedWeightKg: 18.2,
    pickupAddress: '742 Evergreen Terrace, Sector 4',
    lat: 37.7749,
    lng: -122.4194,
    scheduledTime: 'Today, 2:30 PM',
    status: 'completed',
    collectorName: 'Marcus Cole',
    coinsReward: 120,
    xpReward: 90,
    requestedAt: '2 hours ago',
    completedAt: '30 mins ago'
  },
  {
    id: 'req_102',
    citizenName: 'David Miller',
    citizenPhone: '+1 (555) 782-9901',
    category: 'ewaste',
    estimatedWeightKg: 8.0,
    pickupAddress: '1088 Meadow Lane, District 2',
    lat: 37.7833,
    lng: -122.4167,
    scheduledTime: 'Today, 4:00 PM',
    status: 'en_route',
    collectorName: 'Elena Rostova',
    coinsReward: 190,
    xpReward: 140,
    requestedAt: '1 hour ago'
  },
  {
    id: 'req_103',
    citizenName: 'Maya Patel',
    citizenPhone: '+1 (555) 621-4478',
    category: 'organic',
    estimatedWeightKg: 25.0,
    pickupAddress: '450 Sunnyvale Ave, Garden Block',
    lat: 37.7650,
    lng: -122.4250,
    scheduledTime: 'Tomorrow, 10:00 AM',
    status: 'accepted',
    collectorName: 'Elena Rostova',
    coinsReward: 140,
    xpReward: 100,
    requestedAt: '45 mins ago'
  },
  {
    id: 'req_104',
    citizenName: 'Liam O’Connor',
    citizenPhone: '+1 (555) 914-2200',
    category: 'metal',
    estimatedWeightKg: 32.0,
    pickupAddress: '12 Harbor View Plaza, Bay Docks',
    lat: 37.7910,
    lng: -122.4010,
    scheduledTime: 'Today, 5:30 PM',
    status: 'pending',
    coinsReward: 210,
    xpReward: 160,
    requestedAt: '15 mins ago'
  },
  {
    id: 'req_105',
    citizenName: 'Chloe Bennett',
    citizenPhone: '+1 (555) 438-1923',
    category: 'paper',
    estimatedWeightKg: 40.0,
    pickupAddress: '88 Innovation Boulevard, Tech Park',
    lat: 37.7680,
    lng: -122.4080,
    scheduledTime: 'Today, 6:00 PM',
    status: 'pending',
    coinsReward: 160,
    xpReward: 110,
    requestedAt: '5 mins ago'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm_daily_1',
    title: 'Precision Scanner',
    description: 'Use the AI Waste Scanner to classify 2 unknown objects.',
    category: 'daily',
    currentProgress: 1,
    targetProgress: 2,
    rewardXP: 60,
    rewardCoins: 90,
    claimed: false,
    expiresInText: '11h 24m',
    icon: 'scan'
  },
  {
    id: 'm_daily_2',
    title: 'Sort Master',
    description: 'Score at least 15 successful items in the Sorting Mini-Game.',
    category: 'daily',
    currentProgress: 12,
    targetProgress: 15,
    rewardXP: 80,
    rewardCoins: 120,
    claimed: false,
    expiresInText: '11h 24m',
    icon: 'gamepad'
  },
  {
    id: 'm_daily_3',
    title: 'Clean Hauler',
    description: 'Complete or request 1 on-demand waste pickup.',
    category: 'daily',
    currentProgress: 1,
    targetProgress: 1,
    rewardXP: 100,
    rewardCoins: 150,
    claimed: false,
    expiresInText: '11h 24m',
    icon: 'truck'
  },
  {
    id: 'm_weekly_1',
    title: 'Carbon Neutrality Champion',
    description: 'Divert over 50kg of municipal waste through sorting and plants.',
    category: 'weekly',
    currentProgress: 38,
    targetProgress: 50,
    rewardXP: 300,
    rewardCoins: 450,
    claimed: false,
    expiresInText: '4 days left',
    icon: 'leaf'
  },
  {
    id: 'm_weekly_2',
    title: 'Industrial Symbiosis',
    description: 'Process 3 batches of raw recyclables in circular plants.',
    category: 'weekly',
    currentProgress: 2,
    targetProgress: 3,
    rewardXP: 280,
    rewardCoins: 400,
    claimed: false,
    expiresInText: '4 days left',
    icon: 'factory'
  },
  {
    id: 'm_special_1',
    title: 'Zero-Landfill City Initiative',
    description: 'Elevate your Eco City development to Tier 3 "Green City".',
    category: 'special',
    currentProgress: 2,
    targetProgress: 3,
    rewardXP: 800,
    rewardCoins: 1200,
    claimed: false,
    expiresInText: 'Event Boss Quest',
    icon: 'award'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_perfect_sort',
    title: 'Perfect Sort',
    tagline: 'Zero-error sorting masterclass.',
    description: 'Completed an entire waste sorting round with 100% accuracy and zero mistakes.',
    tier: 'gold',
    progress: 0,
    target: 1,
    unlocked: false,
    rewardCoins: 500,
    rewardXP: 350,
    badgeIcon: 'crown'
  },
  {
    id: 'ach_first_recycler',
    title: 'First Step to Green',
    tagline: 'Recycle your first piece of waste.',
    description: 'Sorted or scanned your inaugural recyclable item.',
    tier: 'bronze',
    progress: 1,
    target: 1,
    unlocked: true,
    rewardCoins: 100,
    rewardXP: 50,
    badgeIcon: 'sparkles'
  },
  {
    id: 'ach_plastic_buster',
    title: 'Polymer Buster',
    tagline: 'Divert 50kg of single-use plastics.',
    description: 'Kept harmful plastics away from marine sanctuaries and incinerators.',
    tier: 'silver',
    progress: 34,
    target: 50,
    unlocked: false,
    rewardCoins: 300,
    rewardXP: 200,
    badgeIcon: 'shield'
  },
  {
    id: 'ach_compost_master',
    title: 'Humus Alchemist',
    tagline: 'Generate 100kg of rich organic compost.',
    description: 'Transmuted household food leftovers into agricultural black gold.',
    tier: 'silver',
    progress: 58,
    target: 100,
    unlocked: false,
    rewardCoins: 350,
    rewardXP: 220,
    badgeIcon: 'sprout'
  },
  {
    id: 'ach_factory_owner',
    title: 'Circular Industrialist',
    tagline: 'Upgrade 3 recycling plants to Level 3.',
    description: 'Built high-throughput material processing infrastructure.',
    tier: 'gold',
    progress: 1,
    target: 3,
    unlocked: false,
    rewardCoins: 600,
    rewardXP: 450,
    badgeIcon: 'building'
  },
  {
    id: 'ach_circular_champion',
    title: 'Grand Eco Sovereign',
    tagline: 'Attain Green Score of 1,000+ points.',
    description: 'Reformed your urban district into a closed-loop cradle-to-cradle paradise.',
    tier: 'diamond',
    progress: 540,
    target: 1000,
    unlocked: false,
    rewardCoins: 1500,
    rewardXP: 1000,
    badgeIcon: 'crown'
  }
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'mk_1',
    name: 'Clean rPET Polymer Pellets',
    category: 'plastic',
    description: 'Triple-washed flakes ready for 3D printing filaments and polyester textile.',
    pricePerUnit: 14,
    unit: '10kg bag',
    availableQuantity: 42,
    seller: 'GreenCycle Works',
    buyerType: 'Certified Manufacturer',
    co2ReductionKg: 28.5
  },
  {
    id: 'mk_2',
    name: 'Enriched Biogas Humus Compost',
    category: 'organic',
    description: 'Pathogen-free high-nitrogen soil conditioner from digested household organics.',
    pricePerUnit: 8,
    unit: '25kg sack',
    availableQuantity: 75,
    seller: 'EcoCity Organics',
    buyerType: 'Community Farm',
    co2ReductionKg: 19.2
  },
  {
    id: 'mk_3',
    name: 'Refined Aluminum Ingots',
    category: 'metal',
    description: '99.2% pure secondary aluminum smelted with zero virgin strip mining.',
    pricePerUnit: 45,
    unit: '5kg billet',
    availableQuantity: 28,
    seller: 'Foundry District 9',
    buyerType: 'Certified Manufacturer',
    co2ReductionKg: 62.0
  },
  {
    id: 'mk_4',
    name: 'Recovered Gold & Copper Traces',
    category: 'ewaste',
    description: 'Extracted precious conductive metals from obsolete motherboard circuits.',
    pricePerUnit: 120,
    unit: '50g vial',
    availableQuantity: 9,
    seller: 'Urban Miners Lab',
    buyerType: 'Artisan Recycler',
    co2ReductionKg: 94.0
  },
  {
    id: 'mk_5',
    name: 'Permeable Recycled Paver Blocks',
    category: 'construction',
    description: 'Crushed masonry and slag paving bricks allowing rainfall infiltration.',
    pricePerUnit: 22,
    unit: 'Bundle of 10',
    availableQuantity: 60,
    seller: 'Circular Aggregate Hub',
    buyerType: 'Eco Builder',
    co2ReductionKg: 35.0
  },
  {
    id: 'mk_6',
    name: 'Bleached Recycled Kraft Paper Rolls',
    category: 'paper',
    description: 'Post-consumer paper fiber repulped for eco packaging cartons and notebook stationery.',
    pricePerUnit: 18,
    unit: '50kg spool',
    availableQuantity: 34,
    seller: 'Kalam Paper Mills',
    buyerType: 'Certified Manufacturer',
    co2ReductionKg: 42.0
  },
  {
    id: 'mk_7',
    name: 'Color-Sorted Glass Cullet Crushed Sand',
    category: 'glass',
    description: 'Clean amber and flint glass cullet ready for furnace remelting without virgin silica mining.',
    pricePerUnit: 12,
    unit: '25kg bag',
    availableQuantity: 48,
    seller: 'Shakti Glass Recovery',
    buyerType: 'Certified Manufacturer',
    co2ReductionKg: 18.0
  }
];

export const INITIAL_SKILLS: SkillNode[] = [
  {
    id: 'sorting_1',
    name: 'Quick Reflexes',
    branch: 'Sorting',
    description: 'Increases Sorting Mini-Game combo multiplier timer by 25%.',
    cost: 1,
    requiredLevel: 1,
    icon: 'zap',
    unlocked: true,
    bonus: '+25% Combo Time'
  },
  {
    id: 'sorting_2',
    name: 'Optical Eye',
    branch: 'Sorting',
    description: 'Incorrect sorts deduct 50% fewer points.',
    cost: 2,
    requiredLevel: 3,
    icon: 'eye',
    unlocked: false,
    bonus: '-50% Penalty'
  },
  {
    id: 'tech_1',
    name: 'AI Auto-Calibration',
    branch: 'Technology',
    description: 'AI Waste Scanner awards +25% bonus Eco Coins per valid classification.',
    cost: 1,
    requiredLevel: 2,
    icon: 'cpu',
    unlocked: true,
    bonus: '+25% Scan Coins'
  },
  {
    id: 'tech_2',
    name: 'Catalytic Acceleration',
    branch: 'Technology',
    description: 'Circular processing plants complete conversion batches 20% faster.',
    cost: 2,
    requiredLevel: 4,
    icon: 'activity',
    unlocked: false,
    bonus: '+20% Plant Speed'
  },
  {
    id: 'logistics_1',
    name: 'Optimized Routing',
    branch: 'Logistics',
    description: 'Pickup hauler dispatch journeys yield +30% logistics bounty.',
    cost: 1,
    requiredLevel: 3,
    icon: 'map',
    unlocked: false,
    bonus: '+30% Hauler Bounty'
  },
  {
    id: 'economy_1',
    name: 'Fair Trade Synergy',
    branch: 'Economy',
    description: 'Marketplace sales to certified buyers receive +15% coin premium.',
    cost: 2,
    requiredLevel: 4,
    icon: 'trending-up',
    unlocked: false,
    bonus: '+15% Market Payout'
  }
];

export interface WasteItemCatalog {
  id: string;
  name: string;
  category: WasteCategory;
  points: number;
  trivia: string;
  tip: string;
  co2SavedKg: number;
  sampleImgDescription: string;
}

export const WASTE_ITEMS: WasteItemCatalog[] = [
  {
    id: 'item_1',
    name: 'Single-Use Water Bottle',
    category: 'plastic',
    points: 15,
    trivia: 'Takes up to 450 years to decompose in a conventional landfill.',
    tip: 'Empty liquids, crush flat, and keep cap attached for mechanical recycling.',
    co2SavedKg: 0.12,
    sampleImgDescription: 'Clear crumpled plastic PET water bottle with blue screw cap'
  },
  {
    id: 'item_2',
    name: 'Apple Core & Peel',
    category: 'organic',
    points: 12,
    trivia: 'Organic matter in airtight landfills produces potent greenhouse methane.',
    tip: 'Place into green compost bin to cultivate biological soil nutrients.',
    co2SavedKg: 0.08,
    sampleImgDescription: 'Organic apple core with seeds and fruit peel'
  },
  {
    id: 'item_3',
    name: 'Corrugated Shipping Box',
    category: 'paper',
    points: 14,
    trivia: 'Recycling 1 ton of cardboard saves 17 mature trees and 7,000 gallons of water.',
    tip: 'Flatten boxes completely and remove synthetic plastic tape.',
    co2SavedKg: 0.25,
    sampleImgDescription: 'Brown corrugated shipping delivery cardboard box'
  },
  {
    id: 'item_4',
    name: 'Sparkling Water Can',
    category: 'metal',
    points: 20,
    trivia: 'Aluminum can be melted down and repurposed indefinitely with 0% quality loss.',
    tip: 'Rinse quickly; do not need to crush if using automated reverse-vending units.',
    co2SavedKg: 0.35,
    sampleImgDescription: 'Cylindrical aluminum soda beverage can with pull tab'
  },
  {
    id: 'item_5',
    name: 'Green Olive Glass Jar',
    category: 'glass',
    points: 18,
    trivia: 'Glass cullet melts at 300°C lower temperature than raw silica sand.',
    tip: 'Rinse food residue. Remove metal lid (metal lid goes to metal bin!).',
    co2SavedKg: 0.22,
    sampleImgDescription: 'Transparent green glass pickle and olive food container'
  },
  {
    id: 'item_6',
    name: 'Cracked Smartphone PCB',
    category: 'ewaste',
    points: 35,
    trivia: '1 million cellphones contain over 35,000 lbs of copper and 75 lbs of gold.',
    tip: 'Never throw into household trash. Take to certified e-waste dropoff hubs.',
    co2SavedKg: 1.40,
    sampleImgDescription: 'High-tech green circuit board PCB with microchips and connectors'
  },
  {
    id: 'item_7',
    name: 'Broken Concrete Paver',
    category: 'construction',
    points: 16,
    trivia: 'Concrete rubble can be crushed into permeable aggregate for roadways.',
    tip: 'Separate mortar and drywall from timber and steel rebar.',
    co2SavedKg: 0.45,
    sampleImgDescription: 'Fragment of broken stone and concrete building paver'
  },
  {
    id: 'item_8',
    name: 'Shampoo HDPE Jug',
    category: 'plastic',
    points: 15,
    trivia: 'HDPE #2 is one of the most readily recycled polymers for park benches.',
    tip: 'Rinse out soap lather completely before placing into yellow bin.',
    co2SavedKg: 0.16,
    sampleImgDescription: 'White opaque HDPE plastic shampoo bottle'
  },
  {
    id: 'item_9',
    name: 'Old Newspaper Roll',
    category: 'paper',
    points: 10,
    trivia: 'Newsprint fibers can be re-pulped between 5 to 7 cycles.',
    tip: 'Keep dry; soggy paper gets moldy and clogs automated optic sorters.',
    co2SavedKg: 0.14,
    sampleImgDescription: 'Rolled up black-and-white daily newspaper bundle'
  },
  {
    id: 'item_10',
    name: 'Spent AA Lithium Battery',
    category: 'ewaste',
    points: 40,
    trivia: 'Contains hazardous heavy metals that must never enter groundwater aquifers.',
    tip: 'Tape the terminals with scotch tape before placing into battery safe deposit.',
    co2SavedKg: 0.90,
    sampleImgDescription: 'Cylindrical metal battery with plus and minus contact terminals'
  }
];
