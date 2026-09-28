import React from 'react';

/**
 * EcoAppBackground
 * Premium, realistic background for the EcoNidhi mobile sustainability app:
 * - Bright natural eco environment (Light mode)
 * - Fresh green trees and plants framing the edges (Neem, Peepal, Gulmohar)
 * - Soft sunlight filtering through foliage with warm ambient glow
 * - Clean green city / eco-park environment with manicured lawns
 * - Recycling segregation bins & subtle recycling truck in the distance
 * - Natural sky with soft clouds and drifting leaves
 * - Depth-of-field foreground leaves with subtle camera blur
 * - High readability: center and lower areas kept light with soft green-white gradient overlay
 * - No text, no logos, no neon, no dark mode
 */
export const EcoAppBackground: React.FC<{
  className?: string;
  variant?: 'fullscreen' | 'header' | 'subtle';
}> = ({ className = '', variant = 'fullscreen' }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* 1. Base Natural Sky & Atmosphere (Crisp, Bright Light Mode) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/90 via-emerald-50/70 to-emerald-100/40" />

      {/* 2. Soft Morning Sunlight & Diffuse Lens Flare */}
      <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/50 via-yellow-100/35 to-transparent blur-3xl pointer-events-none animate-sun-shimmer" />
      <div className="absolute top-4 right-16 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-200/60 via-amber-100/40 to-white/70 blur-md pointer-events-none" />

      {/* Subtle Sunbeams streaming diagonally from top right */}
      <svg
        className="absolute top-0 right-0 w-full h-96 opacity-25 pointer-events-none mix-blend-overlay"
        viewBox="0 0 800 500"
        fill="none"
      >
        <polygon points="720,0 760,0 480,500 360,500" fill="url(#sunbeam-grad)" />
        <polygon points="650,0 710,0 260,500 180,500" fill="url(#sunbeam-grad)" />
        <polygon points="780,0 800,0 600,500 520,500" fill="url(#sunbeam-grad)" />
        <defs>
          <linearGradient id="sunbeam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3. Natural Sky Clouds (Soft, Photorealistic Gradients) */}
      <div className="absolute top-6 left-6 w-56 h-20 opacity-60 pointer-events-none">
        <svg viewBox="0 0 240 80" fill="none" className="w-full h-full filter blur-[0.5px]">
          <path
            d="M20,60 C30,35 60,30 85,42 C100,20 145,18 165,38 C185,28 215,35 220,60 C225,70 20,70 20,60 Z"
            fill="url(#cloud-grad-1)"
          />
          <defs>
            <linearGradient id="cloud-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute top-14 right-28 w-44 h-16 opacity-45 pointer-events-none hidden sm:block">
        <svg viewBox="0 0 200 70" fill="none" className="w-full h-full filter blur-[0.5px]">
          <path
            d="M15,50 C25,28 55,24 75,34 C90,16 130,15 148,32 C165,24 190,30 195,50 Z"
            fill="url(#cloud-grad-2)"
          />
          <defs>
            <linearGradient id="cloud-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Distant Eco-City Horizon & Rolling Green Hills */}
      <div className="absolute bottom-28 inset-x-0 w-full h-48 pointer-events-none">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="far-hills" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#86efac" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="mid-hills" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Far Green Hills Layer */}
          <path d="M0,110 Q240,40 520,85 T1000,55 L1000,200 L0,200 Z" fill="url(#far-hills)" />

          {/* Distant Sustainable Urban Silhouette: Solar Rooftops & Clean Wind Turbines */}
          <g opacity="0.35">
            {/* Clean low-emission city skyline silhouettes */}
            <rect x="180" y="88" width="32" height="40" fill="#94a3b8" rx="2" />
            <rect x="216" y="74" width="28" height="54" fill="#64748b" rx="2" />
            <rect x="248" y="94" width="22" height="34" fill="#94a3b8" rx="2" />
            {/* Solar rooftop indicator */}
            <line x1="216" y1="74" x2="244" y2="74" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Distant Wind Turbines */}
            <line x1="380" y1="62" x2="380" y2="110" stroke="#64748b" strokeWidth="1.4" />
            <circle cx="380" cy="62" r="2" fill="#64748b" />
            <line x1="380" y1="62" x2="370" y2="52" stroke="#64748b" strokeWidth="1.2" />
            <line x1="380" y1="62" x2="390" y2="52" stroke="#64748b" strokeWidth="1.2" />
            <line x1="380" y1="62" x2="380" y2="74" stroke="#64748b" strokeWidth="1.2" />

            <line x1="430" y1="70" x2="430" y2="114" stroke="#64748b" strokeWidth="1.4" />
            <circle cx="430" cy="70" r="2" fill="#64748b" />
            <line x1="430" y1="70" x2="422" y2="60" stroke="#64748b" strokeWidth="1.2" />
            <line x1="430" y1="70" x2="438" y2="60" stroke="#64748b" strokeWidth="1.2" />
            <line x1="430" y1="70" x2="430" y2="82" stroke="#64748b" strokeWidth="1.2" />
          </g>

          {/* Near Eco-Park Grass Mound */}
          <path d="M0,135 Q300,75 680,120 T1000,98 L1000,200 L0,200 Z" fill="url(#mid-hills)" />
        </svg>
      </div>

      {/* 5. Clean Green Eco-Park & Paved Avenue in Distance */}
      <div className="absolute bottom-0 inset-x-0 w-full h-36 sm:h-44 pointer-events-none">
        <svg viewBox="0 0 1000 160" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="park-lawn" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="paved-walkway" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>

          {/* Manicured Park Lawn */}
          <path d="M0,45 Q400,20 1000,38 L1000,160 L0,160 Z" fill="url(#park-lawn)" />

          {/* Clean Stone Paved Walkway along Park */}
          <path d="M0,82 Q420,68 1000,78 L1000,105 Q420,95 0,110 Z" fill="url(#paved-walkway)" opacity="0.9" />
          <path d="M0,82 Q420,68 1000,78" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
          <path d="M0,110 Q420,95 1000,105" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />

          {/* Subtle Subtle Recycling Truck in the Distance (Clean Eco-Electric Hauler) */}
          <g transform="translate(680, 52) scale(0.68)" opacity="0.78">
            {/* Cargo Compartment - Fresh Emerald */}
            <rect x="0" y="4" width="56" height="24" rx="3" fill="#15803d" stroke="#14532d" strokeWidth="1" />
            {/* White eco stripe & recycle leaf symbol */}
            <rect x="0" y="14" width="56" height="4" fill="#ffffff" opacity="0.85" />
            <circle cx="28" cy="16" r="4.5" fill="#ffffff" />
            <path d="M28,13 Q31,14.5 30,18.5 Q26,18.5 25,16 Q25,13.5 28,13 Z" fill="#16a34a" />
            {/* Solar rooftop panel on truck */}
            <rect x="4" y="1" width="46" height="3" rx="1" fill="#0284c7" />
            {/* Truck Cab - Clean White */}
            <path d="M56,10 L70,10 Q76,10 78,16 L83,23 L83,28 L56,28 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            {/* Windshield */}
            <path d="M59,12 L69,12 L75,22 L59,22 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.5" />
            {/* Wheels */}
            <circle cx="16" cy="28" r="5" fill="#334155" />
            <circle cx="16" cy="28" r="2.2" fill="#94a3b8" />
            <circle cx="44" cy="28" r="5" fill="#334155" />
            <circle cx="44" cy="28" r="2.2" fill="#94a3b8" />
            <circle cx="73" cy="28" r="5" fill="#334155" />
            <circle cx="73" cy="28" r="2.2" fill="#94a3b8" />
          </g>

          {/* Neat Color-Coded Recycling Segregation Bins in the Distance */}
          <g transform="translate(180, 68) scale(0.72)" opacity="0.85">
            {/* Green Organic Waste Bin */}
            <rect x="0" y="2" width="13" height="20" rx="2.5" fill="#16a34a" stroke="#14532d" strokeWidth="0.8" />
            <rect x="-1" y="0" width="15" height="3.5" rx="1.5" fill="#15803d" />
            <rect x="3" y="6" width="7" height="1.5" rx="0.5" fill="#bbf7d0" />

            {/* Blue Dry Recyclables Bin */}
            <rect x="17" y="2" width="13" height="20" rx="2.5" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
            <rect x="16" y="0" width="15" height="3.5" rx="1.5" fill="#0369a1" />
            <rect x="20" y="6" width="7" height="1.5" rx="0.5" fill="#bae6fd" />

            {/* Yellow Metals / Electronics Bin */}
            <rect x="34" y="2" width="13" height="20" rx="2.5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
            <rect x="33" y="0" width="15" height="3.5" rx="1.5" fill="#ca8a04" />
            <rect x="37" y="6" width="7" height="1.5" rx="0.5" fill="#fef08a" />
          </g>
        </svg>
      </div>

      {/* 6. Lush Fresh Green Foliage Framing the Edges (Top, Left, Right) */}
      {/* Top Left Tree Canopy (Neem / Peepal foliage clusters) */}
      <div className="absolute -top-12 -left-12 w-64 sm:w-80 h-64 sm:h-80 pointer-events-none">
        <svg viewBox="0 0 300 300" fill="none" className="w-full h-full filter drop-shadow-md">
          {/* Main Branches */}
          <path d="M0,0 Q60,70 120,95 Q170,115 220,130" stroke="#78350f" strokeWidth="12" strokeLinecap="round" />
          <path d="M80,80 Q130,50 180,45" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
          <path d="M120,95 Q140,150 170,185" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />

          {/* Deep green backdrop leaf clusters */}
          <circle cx="100" cy="50" r="45" fill="#14532d" opacity="0.9" />
          <circle cx="150" cy="45" r="40" fill="#166534" opacity="0.95" />
          <circle cx="70" cy="90" r="50" fill="#15803d" />
          <circle cx="140" cy="110" r="46" fill="#16a34a" />
          <circle cx="190" cy="90" r="38" fill="#15803d" />
          <circle cx="215" cy="140" r="32" fill="#22c55e" />
          <circle cx="165" cy="170" r="30" fill="#16a34a" />

          {/* Highlights & Fresh Green Leaf Sprigs with Dappled Sunlight */}
          <circle cx="120" cy="70" r="28" fill="#4ade80" opacity="0.8" />
          <circle cx="180" cy="75" r="22" fill="#86efac" opacity="0.75" />
          <circle cx="160" cy="130" r="22" fill="#4ade80" opacity="0.8" />

          {/* Realistic Neem Leaf Blades */}
          <g fill="#22c55e" stroke="#15803d" strokeWidth="0.8">
            <path d="M140,120 Q160,115 175,130 Q160,135 140,120 Z" />
            <path d="M165,140 Q185,142 195,160 Q180,162 165,140 Z" />
            <path d="M110,130 Q125,145 120,165 Q105,150 110,130 Z" />
            <path d="M190,110 Q215,112 230,125 Q212,130 190,110 Z" />
          </g>
        </svg>
      </div>

      {/* Top Right Tree Canopy with Warm Sunlight Filtering Through */}
      <div className="absolute -top-10 -right-10 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none">
        <svg viewBox="0 0 350 350" fill="none" className="w-full h-full filter drop-shadow-md">
          {/* Main Branch arching inward */}
          <path d="M350,0 Q270,80 200,105 Q140,130 80,150" stroke="#78350f" strokeWidth="14" strokeLinecap="round" />
          <path d="M260,85 Q220,40 160,35" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
          <path d="M200,105 Q170,160 140,210" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />

          {/* Rich Leaf Clusters */}
          <circle cx="280" cy="50" r="55" fill="#14532d" opacity="0.95" />
          <circle cx="220" cy="55" r="48" fill="#15803d" />
          <circle cx="160" cy="45" r="42" fill="#16a34a" />
          <circle cx="250" cy="115" r="50" fill="#16a34a" />
          <circle cx="180" cy="120" r="46" fill="#22c55e" />
          <circle cx="120" cy="145" r="38" fill="#16a34a" />
          <circle cx="80" cy="165" r="30" fill="#22c55e" />
          <circle cx="145" cy="195" r="34" fill="#15803d" />

          {/* Bright Sunlight Flecks through leaves */}
          <circle cx="205" cy="90" r="26" fill="#86efac" opacity="0.85" />
          <circle cx="150" cy="100" r="24" fill="#fef08a" opacity="0.6" />
          <circle cx="105" cy="145" r="18" fill="#4ade80" opacity="0.8" />
          <circle cx="240" cy="75" r="20" fill="#bbf7d0" opacity="0.75" />

          {/* Leaf detail clusters */}
          <g fill="#4ade80" stroke="#16a34a" strokeWidth="0.8">
            <path d="M120,135 Q100,140 85,155 Q100,160 120,135 Z" />
            <path d="M150,170 Q130,185 125,205 Q145,195 150,170 Z" />
            <path d="M180,140 Q160,150 150,168 Q170,165 180,140 Z" />
            <path d="M75,160 Q55,165 40,180 Q60,185 75,160 Z" />
          </g>
        </svg>
      </div>

      {/* Left Edge Foliage Sprigs */}
      <div className="absolute top-1/3 -left-6 w-24 sm:w-32 h-48 pointer-events-none opacity-80">
        <svg viewBox="0 0 100 180" fill="none" className="w-full h-full">
          <path d="M0,90 Q45,85 70,60" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <circle cx="45" cy="75" r="22" fill="#16a34a" />
          <circle cx="70" cy="55" r="18" fill="#22c55e" />
          <circle cx="55" cy="45" r="16" fill="#4ade80" opacity="0.85" />
        </svg>
      </div>

      {/* Right Edge Foliage Sprigs */}
      <div className="absolute top-1/2 -right-6 w-28 sm:w-36 h-52 pointer-events-none opacity-80">
        <svg viewBox="0 0 110 200" fill="none" className="w-full h-full">
          <path d="M110,100 Q65,95 40,70" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <circle cx="65" cy="85" r="24" fill="#15803d" />
          <circle cx="40" cy="65" r="20" fill="#22c55e" />
          <circle cx="50" cy="50" r="18" fill="#86efac" opacity="0.8" />
        </svg>
      </div>

      {/* 7. Green Leaves Gently Floating Through the Air */}
      {/* Drifting Leaf 1 - Mid altitude */}
      <div className="absolute top-28 left-1/4 w-7 h-7 pointer-events-none animate-leaf-float-1 opacity-80">
        <svg viewBox="0 0 28 28" fill="none" className="w-full h-full drop-shadow-xs">
          <path
            d="M6,22 C8,14 14,8 24,4 C22,14 16,20 6,22 Z"
            fill="url(#leaf-grad-1)"
            stroke="#15803d"
            strokeWidth="0.8"
          />
          <path d="M6,22 Q14,14 24,4" stroke="#166534" strokeWidth="0.7" />
          <defs>
            <linearGradient id="leaf-grad-1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Drifting Leaf 2 - High right */}
      <div className="absolute top-44 right-1/4 w-8 h-8 pointer-events-none animate-leaf-float-2 opacity-75">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-xs">
          <path
            d="M8,26 C10,16 18,10 28,6 C26,16 20,24 8,26 Z"
            fill="url(#leaf-grad-2)"
            stroke="#15803d"
            strokeWidth="0.8"
          />
          <path d="M8,26 Q16,16 28,6" stroke="#15803d" strokeWidth="0.7" />
          <defs>
            <linearGradient id="leaf-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Drifting Leaf 3 - Mid-lower left */}
      <div className="absolute top-2/3 left-12 w-6 h-6 pointer-events-none animate-leaf-float-1 opacity-70">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path
            d="M5,19 C7,12 12,7 20,3 C18,12 13,17 5,19 Z"
            fill="#22c55e"
            stroke="#166534"
            strokeWidth="0.6"
          />
          <path d="M5,19 Q11,11 20,3" stroke="#166534" strokeWidth="0.6" />
        </svg>
      </div>

      {/* 8. Foreground Leaves with Subtle Depth-of-Field (Soft Camera Bokeh Blur) */}
      {/* Foreground Left Leaf with Blur */}
      <div className="absolute -bottom-4 -left-4 w-28 h-28 pointer-events-none filter blur-[2px] opacity-75">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M10,90 C25,50 55,25 90,10 C85,55 55,80 10,90 Z"
            fill="url(#fg-leaf-1)"
            stroke="#14532d"
            strokeWidth="1.5"
          />
          <path d="M10,90 Q50,55 90,10" stroke="#14532d" strokeWidth="1.5" />
          <defs>
            <linearGradient id="fg-leaf-1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="60%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Foreground Right Leaf with Subtle Blur */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 pointer-events-none filter blur-[2.2px] opacity-75">
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <path
            d="M110,110 C90,65 55,30 10,15 C20,65 55,95 110,110 Z"
            fill="url(#fg-leaf-2)"
            stroke="#14532d"
            strokeWidth="1.5"
          />
          <path d="M110,110 Q60,65 10,15" stroke="#14532d" strokeWidth="1.5" />
          <defs>
            <linearGradient id="fg-leaf-2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="50%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 9. Soft Green-White Gradient Overlay for 100% UI Content Readability */}
      {/* Radial vignette keeping center and lower area clean and slightly light/blurred */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-white/75 via-emerald-50/60 to-transparent pointer-events-none" />

      {/* Vertical readability gradient ensuring top HUD, cards, forms, and bottom nav have pristine contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-emerald-50/50 to-white/85 backdrop-blur-[0.5px] pointer-events-none" />
    </div>
  );
};
