import React from 'react';
import { EcoAppBackground } from '../common/EcoAppBackground';

/**
 * OnboardingEcoCityBackdrop
 * Realistic, bright natural eco environment background for EcoNidhi mobile onboarding
 */
export const OnboardingEcoCityBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      <EcoAppBackground />
    </div>
  );
};
