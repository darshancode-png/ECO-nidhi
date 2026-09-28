import React from 'react';

interface CityBuildingGraphicProps {
  category: string;
  level: number;
  unlocked: boolean;
}

export const CityBuildingGraphic: React.FC<CityBuildingGraphicProps> = ({
  category,
  level,
  unlocked
}) => {
  if (!unlocked) {
    return (
      <div className="w-full h-24 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-slate-400">
        <svg className="w-6 h-6 opacity-40 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-[11px] font-medium text-slate-500">Unlocks at Next Tier</span>
      </div>
    );
  }

  switch (category) {
    case 'residential':
      return (
        <svg viewBox="0 0 160 90" className="w-full h-24">
          <polygon points="80,10 145,40 80,70 15,40" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
          <polygon points="15,40 80,70 80,85 15,55" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
          <polygon points="80,70 145,40 145,55 80,85" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
          {/* Apartments */}
          <rect x="55" y="24" width="22" height="34" rx="2" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
          <rect x="85" y="18" width="26" height="40" rx="2" fill="#f0fdf4" stroke="#15803d" strokeWidth="1.5" />
          {/* Windows */}
          <line x1="60" y1="30" x2="72" y2="30" stroke="#0284c7" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="60" y1="38" x2="72" y2="38" stroke="#0284c7" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="60" y1="46" x2="72" y2="46" stroke="#0284c7" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="90" y1="26" x2="106" y2="26" stroke="#0284c7" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="90" y1="34" x2="106" y2="34" stroke="#0284c7" strokeWidth="2" strokeDasharray="2 2" />
          {/* Rooftop Solar & Plant */}
          <ellipse cx="66" cy="24" rx="8" ry="3" fill="#38bdf8" />
          <circle cx="98" cy="16" r="5" fill="#22c55e" />
        </svg>
      );

    case 'recycling':
      return (
        <svg viewBox="0 0 160 90" className="w-full h-24">
          <polygon points="80,10 145,40 80,70 15,40" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="15,40 80,70 80,85 15,55" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
          <polygon points="80,70 145,40 145,55 80,85" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          {/* Hangar */}
          <rect x="45" y="24" width="70" height="34" rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
          {/* Conveyor */}
          <path d="M55 42 L80 48 L105 40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="48" r="4" fill="#16a34a" />
          <path d="M70 20 L80 12 L90 20 Z" fill="#38bdf8" />
        </svg>
      );

    case 'energy':
      return (
        <svg viewBox="0 0 160 90" className="w-full h-24">
          <polygon points="80,10 145,40 80,70 15,40" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="15,40 80,70 80,85 15,55" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <polygon points="80,70 145,40 145,55 80,85" fill="#fcd34d" stroke="#d97706" strokeWidth="1" />
          {/* Biogas Dome */}
          <circle cx="80" cy="38" r="22" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
          <path d="M68 38 Q80 26 92 38" stroke="#16a34a" strokeWidth="1.5" fill="none" />
          <path d="M78 28 L83 37 L77 38 L82 48" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'nature':
      return (
        <svg viewBox="0 0 160 90" className="w-full h-24">
          <polygon points="80,10 145,40 80,70 15,40" fill="#dcfce7" stroke="#15803d" strokeWidth="1.5" />
          <polygon points="15,40 80,70 80,85 15,55" fill="#bbf7d0" stroke="#15803d" strokeWidth="1" />
          <polygon points="80,70 145,40 145,55 80,85" fill="#86efac" stroke="#15803d" strokeWidth="1" />
          {/* Biosphere Dome */}
          <ellipse cx="80" cy="40" rx="26" ry="18" fill="#ffffff" stroke="#22c55e" strokeWidth="1.5" />
          <circle cx="72" cy="40" r="7" fill="#16a34a" />
          <circle cx="88" cy="38" r="8" fill="#15803d" />
          <circle cx="80" cy="32" r="6" fill="#4ade80" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 160 90" className="w-full h-24">
          <polygon points="80,10 145,40 80,70 15,40" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="15,40 80,70 80,85 15,55" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="80,70 145,40 145,55 80,85" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          <rect x="55" y="24" width="50" height="28" rx="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="60" y1="36" x2="100" y2="36" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      );
  }
};
