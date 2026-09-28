import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopGameBar } from './components/common/TopGameBar';
import { BottomNav } from './components/common/BottomNav';
import { CelebrationModal } from './components/common/CelebrationModal';
import { EcoAppBackground } from './components/common/EcoAppBackground';
import { OnboardingFlow } from './components/onboarding/OnboardingModal';

// Citizen screens
import { EcoCityBuilder } from './components/citizen/EcoCityBuilder';
import { CitizenMapView } from './components/citizen/CitizenMapView';
import { QuickCollectHub } from './components/citizen/QuickCollectHub';
import { CircularMarketplace } from './components/citizen/CircularMarketplace';
import { CitizenProfile } from './components/citizen/CitizenProfile';
import { AiWasteScanner } from './components/citizen/AiWasteScanner';
import { PickupFlow } from './components/citizen/PickupFlow';
import { ImpactDashboard } from './components/citizen/ImpactDashboard';
import { SortingMiniGame } from './components/citizen/SortingMiniGame';
import { GamesHub } from './components/games/GamesHub';
import { RecyclingRunGame } from './components/games/RecyclingRunGame';
import { FactoryManagerGame } from './components/games/FactoryManagerGame';
import { WasteHuntGame } from './components/games/WasteHuntGame';
import { EcoQuizGame } from './components/games/EcoQuizGame';
import { CommunityCleanupGame } from './components/games/CommunityCleanupGame';
import { TransportLogistics } from './components/citizen/TransportLogistics';
import { CircularPlants } from './components/citizen/CircularPlants';
import { MissionsQuests } from './components/citizen/MissionsQuests';
import { AchievementsView } from './components/citizen/AchievementsView';
import { LeaderboardView } from './components/citizen/LeaderboardView';
import { MysteryChests } from './components/citizen/MysteryChests';
import { SkillTreeView } from './components/citizen/SkillTreeView';

// Collector & Admin screens
import { CollectorPortal } from './components/collector/CollectorPortal';
import { AdminPortal } from './components/admin/AdminPortal';

const MainAppContent: React.FC = () => {
  const { currentView, role, navigate, authSession } = useGame();

  // If user is not authenticated or session is locked:
  // - If registered: renders "Welcome back, [Name]" -> asks for 4-digit PIN -> opens Home
  // - If new: renders Welcome -> Name -> Gmail/Email -> 4-digit PIN -> opens Home
  if (!authSession || !authSession.isLoggedIn) {
    return <OnboardingFlow />;
  }

  const renderCurrentView = () => {
    // When in collector or admin role, route to their portals
    if (role === 'collector') {
      return <CollectorPortal />;
    }
    if (role === 'admin') {
      return <AdminPortal />;
    }

    // Citizen views
    switch (currentView) {
      case 'home':
        return <EcoCityBuilder />;
      case 'map':
        return <CitizenMapView />;
      case 'collect':
        return <QuickCollectHub />;
      case 'market':
        return <CircularMarketplace />;
      case 'profile':
        return <CitizenProfile />;
      case 'games':
        return <GamesHub />;
      case 'scanner':
        return <AiWasteScanner />;
      case 'pickup':
        return <PickupFlow />;
      case 'impact':
        return <ImpactDashboard />;
      case 'sorting_game':
        return <SortingMiniGame />;
      case 'recycling_run':
        return <RecyclingRunGame onBack={() => navigate('games')} />;
      case 'factory_manager':
        return <FactoryManagerGame onBack={() => navigate('games')} />;
      case 'clean_city':
        return <EcoCityBuilder />;
      case 'waste_hunt':
        return <WasteHuntGame onBack={() => navigate('games')} />;
      case 'eco_quiz':
        return <EcoQuizGame onBack={() => navigate('games')} />;
      case 'community_cleanup':
        return <CommunityCleanupGame onBack={() => navigate('games')} />;
      case 'transport':
        return <TransportLogistics />;
      case 'plants':
        return <CircularPlants />;
      case 'missions':
        return <MissionsQuests />;
      case 'achievements':
        return <AchievementsView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'chests':
        return <MysteryChests />;
      case 'skills':
        return <SkillTreeView />;
      default:
        return <EcoCityBuilder />;
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Realistic Eco Background with soft sunlight, lush green trees, drifting leaves & clean eco-city */}
      <EcoAppBackground className="fixed inset-0 z-0 pointer-events-none" />

      {/* Top HUD Game Navigation Bar */}
      <div className="relative z-20">
        <TopGameBar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10">
        {renderCurrentView()}
      </main>

      {/* Mobile-first ergonomic Bottom Nav (visible for Citizen mode) */}
      <div className="relative z-20">
        <BottomNav />
      </div>

      {/* Celebration Modal (Confetti & Reward popup) */}
      <CelebrationModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
