import React from 'react';

export const EcoCityBackdrop: React.FC = () => {
  return (
    <div className="relative w-full h-48 sm:h-56 rounded-3xl overflow-hidden shadow-xs border border-emerald-200/80 bg-gradient-to-b from-sky-100 via-emerald-50/80 to-emerald-100/60 mb-2 select-none">
      {/* 1. Warm Indian Morning Sun & Atmosphere */}
      <div className="absolute top-3 right-10 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-yellow-100 opacity-80 blur-xs" />
      <div className="absolute top-0 right-4 w-32 h-32 rounded-full bg-amber-100/40 blur-xl pointer-events-none" />

      {/* 2. Soft Morning Clouds & Flying Birds */}
      <svg className="absolute top-2 left-8 opacity-65 w-24" viewBox="0 0 100 40">
        <path d="M10,25 Q15,10 30,15 Q40,5 55,12 Q65,8 75,18 Q85,15 90,25 Z" fill="#ffffff" />
      </svg>
      <svg className="absolute top-5 right-36 opacity-50 w-20" viewBox="0 0 100 40">
        <path d="M10,25 Q15,10 30,15 Q40,5 55,12 Q65,8 75,18 Q85,15 90,25 Z" fill="#ffffff" />
      </svg>
      {/* Flying birds silhouette */}
      <svg className="absolute top-6 left-1/3 w-16 opacity-40 text-slate-600" viewBox="0 0 80 20" fill="currentColor">
        <path d="M5,10 Q12,2 20,8 Q28,2 35,10 Q28,5 20,12 Q12,5 5,10 Z" />
        <path d="M45,8 Q50,2 57,6 Q64,2 70,8 Q64,4 57,9 Q50,4 45,8 Z" />
      </svg>

      {/* 3. Distant Green Hills & Wind Turbines */}
      <svg className="absolute bottom-14 inset-x-0 w-full h-24 pointer-events-none" viewBox="0 0 800 120" preserveAspectRatio="none">
        <path d="M0,75 Q180,25 380,60 T800,40 L800,120 L0,120 Z" fill="#bbf7d0" opacity="0.65" />
        <path d="M0,85 Q220,40 500,70 T800,55 L800,120 L0,120 Z" fill="#86efac" opacity="0.75" />
        {/* Distant Wind Turbines */}
        <g stroke="#64748b" strokeWidth="1.2" opacity="0.4" fill="none">
          <line x1="220" y1="45" x2="220" y2="70" />
          <circle cx="220" cy="45" r="1.5" fill="#64748b" />
          <line x1="220" y1="45" x2="212" y2="38" />
          <line x1="220" y1="45" x2="228" y2="38" />
          <line x1="220" y1="45" x2="220" y2="55" />

          <line x1="250" y1="50" x2="250" y2="72" />
          <circle cx="250" cy="50" r="1.5" fill="#64748b" />
          <line x1="250" y1="50" x2="243" y2="44" />
          <line x1="250" y1="50" x2="257" y2="44" />
          <line x1="250" y1="50" x2="250" y2="58" />
        </g>
      </svg>

      {/* 4. Indian Neighborhood: Homes, Recycling Facility, Trees & Rooftops */}
      <svg className="absolute bottom-9 inset-x-0 w-full h-32 pointer-events-none" viewBox="0 0 900 130" preserveAspectRatio="none">
        {/* Left Side: Indian Residential Homes with Terrace Water Tanks & Solar PVs */}
        {/* House 1: Stucco yellow with balcony */}
        <rect x="25" y="38" width="55" height="52" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="1" />
        <rect x="33" y="46" width="16" height="18" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" rx="1" />
        <rect x="56" y="46" width="16" height="18" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" rx="1" />
        <rect x="42" y="70" width="18" height="20" fill="#78350f" rx="1" />
        {/* Overhead black PVC water tank on terrace */}
        <rect x="35" y="28" width="14" height="10" fill="#1e293b" rx="2" />
        <line x1="33" y1="38" x2="51" y2="38" stroke="#475569" strokeWidth="1.5" />
        {/* Small Solar panel on roof */}
        <rect x="55" y="30" width="22" height="7" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.8" rx="0.5" />

        {/* House 2: Terracotta / peach modern Indian house */}
        <rect x="85" y="45" width="48" height="45" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" rx="1" />
        <rect x="94" y="52" width="14" height="15" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" rx="1" />
        <rect x="114" y="52" width="14" height="15" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" rx="1" />
        <rect x="100" y="72" width="16" height="18" fill="#9a3412" rx="1" />
        <rect x="92" y="37" width="13" height="8" fill="#1e293b" rx="2" />

        {/* Lush Indian Canopy Tree (Neem / Gulmohar style) */}
        <rect x="146" y="55" width="6" height="35" fill="#78350f" rx="1" />
        <circle cx="149" cy="48" r="22" fill="#15803d" />
        <circle cx="138" cy="45" r="16" fill="#16a34a" />
        <circle cx="160" cy="46" r="17" fill="#22c55e" />
        {/* Red flower accents on tree (Gulmohar) */}
        <circle cx="142" cy="40" r="2.5" fill="#ef4444" />
        <circle cx="156" cy="42" r="2.5" fill="#ef4444" />
        <circle cx="150" cy="52" r="2.5" fill="#ef4444" />

        {/* Center: Municipal Dry Waste Collection Centre (DWCC) & Biomethanation Facility */}
        <g id="facility">
          {/* Facility Dome / Shed */}
          <path d="M 230,90 L 230,55 Q 280,32 330,55 L 330,90 Z" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
          {/* Solar Rooftop on facility */}
          <path d="M 245,55 Q 280,38 315,55" stroke="#0284c7" strokeWidth="3" fill="none" />
          {/* Recycling Emblem on Facility Wall */}
          <circle cx="280" cy="66" r="11" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
          <path d="M276,62 L284,62 L280,68 Z" fill="#059669" />
          <text x="280" y="84" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#065f46" fontFamily="sans-serif">
            MRF RECYCLING HUB
          </text>
          {/* Transparent Glass entrance */}
          <rect x="268" y="70" width="24" height="20" fill="#ccfbf1" stroke="#0f766e" strokeWidth="0.8" rx="1" />
          {/* Clean Segregated Bins outside Facility */}
          <rect x="338" y="76" width="7" height="14" fill="#16a34a" rx="1" />
          <rect x="347" y="76" width="7" height="14" fill="#0284c7" rx="1" />
          <rect x="356" y="76" width="7" height="14" fill="#eab308" rx="1" />
        </g>

        {/* Tree behind bins */}
        <rect x="375" y="58" width="5" height="32" fill="#78350f" rx="1" />
        <circle cx="377" cy="50" r="18" fill="#15803d" />
        <circle cx="388" cy="52" r="14" fill="#22c55e" />

        {/* Right Side: Clean Modern Commercial Eco-Avenue */}
        <rect x="420" y="32" width="46" height="58" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="2" />
        <line x1="420" y1="32" x2="466" y2="32" stroke="#0284c7" strokeWidth="2.5" />
        {/* Windows */}
        <rect x="428" y="40" width="12" height="10" fill="#bae6fd" rx="1" />
        <rect x="446" y="40" width="12" height="10" fill="#bae6fd" rx="1" />
        <rect x="428" y="56" width="12" height="10" fill="#bae6fd" rx="1" />
        <rect x="446" y="56" width="12" height="10" fill="#bae6fd" rx="1" />

        <rect x="480" y="24" width="52" height="66" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="2" />
        <line x1="480" y1="24" x2="532" y2="24" stroke="#0284c7" strokeWidth="2.5" />
        <rect x="490" y="34" width="14" height="12" fill="#bae6fd" rx="1" />
        <rect x="510" y="34" width="14" height="12" fill="#bae6fd" rx="1" />
        <rect x="490" y="52" width="14" height="12" fill="#bae6fd" rx="1" />
        <rect x="510" y="52" width="14" height="12" fill="#bae6fd" rx="1" />

        {/* Tree cluster on far right */}
        <rect x="555" y="60" width="5" height="30" fill="#78350f" rx="1" />
        <circle cx="557" cy="52" r="20" fill="#15803d" />
        <circle cx="570" cy="54" r="16" fill="#16a34a" />
        <circle cx="545" cy="55" r="15" fill="#22c55e" />

        {/* Distant Metro Viaduct in background */}
        <line x1="0" y1="90" x2="900" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />
      </svg>

      {/* 5. Clean City Road with Zebra Crossing & Active Electric Recycling Truck */}
      <div className="absolute bottom-7 inset-x-0 h-9 bg-slate-700 border-t border-slate-600 flex items-center relative overflow-hidden">
        {/* Dashed white center road lane */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/60" />

        {/* White Zebra crossing marks */}
        <div className="absolute left-32 top-0 bottom-0 flex gap-2">
          <div className="w-2.5 h-full bg-white/70" />
          <div className="w-2.5 h-full bg-white/70" />
          <div className="w-2.5 h-full bg-white/70" />
          <div className="w-2.5 h-full bg-white/70" />
        </div>

        {/* Electric Waste Collection Truck (VoltTrike / Swachh Hauler) on Road */}
        <div className="absolute left-1/2 -translate-x-12 sm:translate-x-16 -top-3 flex items-end">
          <svg className="w-24 h-12" viewBox="0 0 100 48">
            {/* Cargo Box */}
            <rect x="2" y="6" width="55" height="28" rx="3" fill="#15803d" stroke="#166534" strokeWidth="1" />
            {/* Solar rooftop on truck */}
            <rect x="6" y="3" width="46" height="3" rx="1" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.5" />
            {/* Leaf symbol on truck cargo */}
            <circle cx="28" cy="20" r="8" fill="#ffffff" />
            <path d="M28,14 Q34,16 32,24 Q26,24 24,20 Q24,15 28,14 Z" fill="#16a34a" />
            {/* Cab */}
            <path d="M57,14 L75,14 Q82,14 84,20 L88,27 L88,34 L57,34 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            {/* Windshield glass */}
            <path d="M60,16 L74,16 L80,26 L60,26 Z" fill="#bae6fd" />
            {/* Front Headlight */}
            <circle cx="86" cy="30" r="2.5" fill="#fef08a" />
            {/* Wheels */}
            <circle cx="20" cy="36" r="6.5" fill="#1e293b" />
            <circle cx="20" cy="36" r="3" fill="#94a3b8" />
            <circle cx="45" cy="36" r="6.5" fill="#1e293b" />
            <circle cx="45" cy="36" r="3" fill="#94a3b8" />
            <circle cx="75" cy="36" r="6.5" fill="#1e293b" />
            <circle cx="75" cy="36" r="3" fill="#94a3b8" />
          </svg>
        </div>

        {/* Responsible Citizen walking with green bag */}
        <div className="absolute left-20 -top-2 hidden sm:flex items-center">
          <svg className="w-7 h-10" viewBox="0 0 30 40">
            {/* Head */}
            <circle cx="15" cy="8" r="4.5" fill="#d97706" />
            {/* Body */}
            <rect x="11" y="13" width="8" height="12" rx="2" fill="#0284c7" />
            {/* Legs */}
            <line x1="13" y1="25" x2="11" y2="36" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="17" y1="25" x2="19" y2="36" stroke="#1e293b" strokeWidth="2.5" />
            {/* Green recycling bag */}
            <rect x="20" y="18" width="6" height="8" rx="1" fill="#16a34a" />
          </svg>
        </div>
      </div>

      {/* 6. Clean Foreground Eco Status Banner */}
      <div className="absolute bottom-0 inset-x-0 h-7 bg-white/95 backdrop-blur-xs border-t border-emerald-200/90 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-950 tracking-tight">
            Indian Smart Ward · 100% Door-to-Door Segregated Route Active
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-emerald-800 font-mono-numbers font-bold">
          Zero Open Dumps 🌿
        </span>
      </div>
    </div>
  );
};
