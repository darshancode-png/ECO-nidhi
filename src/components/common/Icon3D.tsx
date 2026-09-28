import React from 'react';

export type Icon3DType =
  | 'recycle'
  | 'camera'
  | 'truck'
  | 'coin'
  | 'gamepad'
  | 'map'
  | 'market'
  | 'profile'
  | 'plant'
  | 'trophy'
  | 'leaf'
  | 'chest'
  | 'flame'
  | 'home'
  | 'sparkle'
  | 'shield';

interface Icon3DProps {
  name: Icon3DType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  animate?: boolean;
  fluidHover?: boolean;
  className?: string;
  glow?: boolean;
}

const sizeMap = {
  xs: 'w-5 h-5',
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
  hero: 'w-28 h-28 sm:w-32 sm:h-32'
};

export const Icon3D: React.FC<Icon3DProps> = ({
  name,
  size = 'md',
  animate = false,
  fluidHover = true,
  className = '',
  glow = false
}) => {
  const sizeClasses = sizeMap[size];

  const renderIconSvg = () => {
    switch (name) {
      // 1. 3D Golden Eco Coin
      case 'coin':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="coinEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="85%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <radialGradient id="coinShine" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="leafGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            {/* 3D Depth Base / Cylinder Edge */}
            <ellipse cx="50" cy="54" rx="42" ry="38" fill="url(#coinEdge)" />
            <ellipse cx="50" cy="52" rx="42" ry="38" fill="#d97706" />
            {/* Coin Front Face */}
            <ellipse cx="50" cy="48" rx="42" ry="38" fill="url(#coinGold)" />
            {/* Inner Ring Emboss */}
            <ellipse cx="50" cy="48" rx="35" ry="31" fill="none" stroke="#fef08a" strokeWidth="2.5" opacity="0.9" />
            <ellipse cx="50" cy="48" rx="33" ry="29" fill="none" stroke="#b45309" strokeWidth="1" opacity="0.4" />
            {/* Specular Highlight Sheen */}
            <ellipse cx="50" cy="48" rx="41" ry="37" fill="url(#coinShine)" />
            {/* Embossed Leaf Emblem in Center */}
            <g transform="translate(50, 48)">
              {/* Leaf Stem & Body */}
              <path
                d="M -2,14 C -1,5 6,0 15,-10 C 15,-10 4,-12 -8,-4 C -16,4 -10,13 -2,14 Z"
                fill="url(#leafGreen)"
                stroke="#14532d"
                strokeWidth="1.2"
              />
              <path
                d="M -10,6 C -7,2 -2,0 8,-5"
                fill="none"
                stroke="#bbf7d0"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="9" cy="-12" r="2.5" fill="#fef08a" />
            </g>
          </svg>
        );

      // 2. 3D Recycle Leaf Loop
      case 'recycle':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="recGreenTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="recGreenRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="60%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>
              <linearGradient id="recGreenLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="70%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>
              <radialGradient id="recGlow" cx="40%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* 3D Soft Shadow Base */}
            <ellipse cx="50" cy="85" rx="32" ry="9" fill="#0f172a" opacity="0.12" />
            {/* Segment 1: Top Ribbon Curve */}
            <path
              d="M 32,26 C 42,16 58,16 68,26 L 62,32 C 55,25 45,25 38,32 Z"
              fill="url(#recGreenTop)"
            />
            {/* Arrowhead Top */}
            <polygon points="65,18 78,30 60,36" fill="#16a34a" />
            <polygon points="65,18 76,28 62,32" fill="#4ade80" />

            {/* Segment 2: Right Ribbon Curve */}
            <path
              d="M 72,42 C 78,54 74,68 62,76 L 58,68 C 65,62 68,52 64,44 Z"
              fill="url(#recGreenRight)"
            />
            {/* Arrowhead Right */}
            <polygon points="76,68 60,82 60,65" fill="#15803d" />
            <polygon points="74,68 62,78 61,67" fill="#22c55e" />

            {/* Segment 3: Left Ribbon Curve */}
            <path
              d="M 44,74 C 32,72 24,60 26,46 L 34,48 C 32,58 38,66 46,67 Z"
              fill="url(#recGreenLeft)"
            />
            {/* Arrowhead Left */}
            <polygon points="26,38 38,24 40,42" fill="#14532d" />
            <polygon points="28,38 36,27 38,40" fill="#86efac" />

            {/* Central Sprouting 3D Eco Bud */}
            <ellipse cx="50" cy="50" rx="9" ry="11" fill="url(#recGreenTop)" />
            <path d="M 49,42 C 45,47 45,55 49,58 C 53,55 53,47 49,42 Z" fill="#bbf7d0" />
          </svg>
        );

      // 3. 3D AI Camera Scanner
      case 'camera':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="camBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="camTopBevel" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="lensRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <radialGradient id="lensGlass" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="35%" stopColor="#06b6d4" />
                <stop offset="70%" stopColor="#0e7490" />
                <stop offset="100%" stopColor="#083344" />
              </radialGradient>
              <linearGradient id="scanRay" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Contact Shadow */}
            <ellipse cx="50" cy="85" rx="34" ry="8" fill="#0f172a" opacity="0.12" />
            
            {/* Camera 3D Body Base */}
            <rect x="18" y="34" width="64" height="46" rx="14" fill="#cbd5e1" />
            {/* Camera 3D Main Front */}
            <rect x="18" y="30" width="64" height="46" rx="14" fill="url(#camBody)" stroke="#e2e8f0" strokeWidth="1.5" />
            
            {/* Top Shutter Button & Sensor Mound */}
            <rect x="28" y="24" width="14" height="8" rx="3" fill="#cbd5e1" />
            <rect x="29" y="23" width="12" height="6" rx="2" fill="url(#camTopBevel)" />
            <rect x="58" y="25" width="18" height="6" rx="3" fill="#94a3b8" />
            <circle cx="67" cy="28" r="2" fill="#ef4444" />

            {/* Flash & Status LED */}
            <circle cx="28" cy="40" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="28" cy="40" r="1.5" fill="#ffffff" />

            {/* 3D Deep Lens Ring */}
            <circle cx="53" cy="53" r="22" fill="url(#lensRing)" stroke="#475569" strokeWidth="1.5" />
            <circle cx="53" cy="53" r="18" fill="#0284c7" opacity="0.4" />
            <circle cx="53" cy="53" r="16" fill="url(#lensGlass)" />

            {/* Lens Specular Reflection 1 */}
            <ellipse cx="48" cy="47" rx="7" ry="4" transform="rotate(-30 48 47)" fill="#ffffff" opacity="0.75" />
            {/* Lens Reflection 2 */}
            <circle cx="59" cy="59" r="2" fill="#67e8f9" opacity="0.8" />

            {/* Laser AI Hologram Target Brackets */}
            <path d="M 40,43 L 37,43 L 37,46" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 66,43 L 69,43 L 69,46" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 40,63 L 37,63 L 37,60" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 66,63 L 69,63 L 69,60" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );

      // 4. 3D Electric Pickup Truck
      case 'truck':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="truckBody" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="60%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="truckCab" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="solarRoof" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            {/* Ground shadow */}
            <ellipse cx="50" cy="84" rx="36" ry="7" fill="#0f172a" opacity="0.14" />
            
            {/* Cargo Box */}
            <rect x="14" y="38" width="40" height="30" rx="4" fill="url(#truckBody)" />
            {/* Cargo Ridge lines */}
            <line x1="22" y1="42" x2="22" y2="64" stroke="#14532d" strokeWidth="1.5" opacity="0.5" />
            <line x1="32" y1="42" x2="32" y2="64" stroke="#14532d" strokeWidth="1.5" opacity="0.5" />
            <line x1="42" y1="42" x2="42" y2="64" stroke="#14532d" strokeWidth="1.5" opacity="0.5" />

            {/* Recycled Leaf Emblem on Cargo */}
            <circle cx="32" cy="53" r="8" fill="#ffffff" opacity="0.9" />
            <path d="M 29,55 C 30,50 34,48 37,48 C 36,52 33,56 29,55 Z" fill="#16a34a" />

            {/* Truck Cab Front */}
            <path
              d="M 54,42 L 67,42 C 72,42 77,47 80,53 L 84,60 C 85,62 85,68 82,68 L 54,68 Z"
              fill="url(#truckCab)"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            {/* Windshield */}
            <path
              d="M 58,45 L 67,45 C 70,45 74,48 76,53 L 78,57 L 58,57 Z"
              fill="#38bdf8"
              opacity="0.85"
            />
            <path d="M 60,47 L 65,47 L 70,55 L 67,55 Z" fill="#ffffff" opacity="0.6" />

            {/* Solar Panel on Cargo Roof */}
            <rect x="16" y="34" width="36" height="5" rx="2" fill="url(#solarRoof)" />
            <line x1="28" y1="34" x2="28" y2="39" stroke="#38bdf8" strokeWidth="1" />
            <line x1="40" y1="34" x2="40" y2="39" stroke="#38bdf8" strokeWidth="1" />

            {/* Headlight LED */}
            <circle cx="83" cy="62" r="3" fill="#facc15" />
            <circle cx="83" cy="62" r="1.5" fill="#ffffff" />

            {/* Wheels (Front & Back) */}
            <g transform="translate(26, 68)">
              <circle cx="0" cy="0" r="10" fill="#1e293b" />
              <circle cx="0" cy="0" r="6" fill="#94a3b8" />
              <circle cx="0" cy="0" r="3" fill="#475569" />
            </g>
            <g transform="translate(70, 68)">
              <circle cx="0" cy="0" r="10" fill="#1e293b" />
              <circle cx="0" cy="0" r="6" fill="#94a3b8" />
              <circle cx="0" cy="0" r="3" fill="#475569" />
            </g>
          </svg>
        );

      // 5. 3D Gamepad / Sorting Mini-Game
      case 'gamepad':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="padBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="padGrip" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="82" rx="36" ry="7" fill="#0f172a" opacity="0.12" />

            {/* Gamepad Main Chassis */}
            <path
              d="M 24,32 C 34,30 66,30 76,32 C 86,34 92,44 88,68 C 86,76 78,79 72,74 L 64,62 C 58,58 42,58 36,62 L 28,74 C 22,79 14,76 12,68 C 8,44 14,34 24,32 Z"
              fill="url(#padBody)"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            {/* Grip Accents */}
            <path
              d="M 15,50 C 13,60 16,68 22,70 L 25,65 C 20,62 18,56 19,50 Z"
              fill="url(#padGrip)"
            />
            <path
              d="M 85,50 C 87,60 84,68 78,70 L 75,65 C 80,62 82,56 81,50 Z"
              fill="url(#padGrip)"
            />

            {/* D-Pad (Left) */}
            <g transform="translate(30, 48)">
              <rect x="-4" y="-11" width="8" height="22" rx="2" fill="#334155" />
              <rect x="-11" y="-4" width="22" height="8" rx="2" fill="#334155" />
              <circle cx="0" cy="0" r="3" fill="#1e293b" />
            </g>

            {/* 3D Action Buttons (Right) - Colorful Eco Bins */}
            <g transform="translate(70, 48)">
              {/* Top button (Yellow - Metal) */}
              <circle cx="0" cy="-8" r="4" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              {/* Bottom button (Blue - Paper) */}
              <circle cx="0" cy="8" r="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
              {/* Left button (Green - Compost) */}
              <circle cx="-8" cy="0" r="4" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
              {/* Right button (Red - Hazard) */}
              <circle cx="8" cy="0" r="4" fill="#f87171" stroke="#dc2626" strokeWidth="1" />
            </g>

            {/* Center Status Display */}
            <rect x="42" y="38" width="16" height="9" rx="2" fill="#0f172a" />
            <circle cx="47" cy="42.5" r="1.5" fill="#34d399" />
            <circle cx="53" cy="42.5" r="1.5" fill="#38bdf8" />
          </svg>
        );

      // 6. 3D Trophy / Award
      case 'trophy':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="trophyBase" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="86" rx="28" ry="6" fill="#0f172a" opacity="0.15" />
            {/* Plinth Base */}
            <polygon points="32,74 68,74 65,84 35,84" fill="url(#trophyBase)" />
            <rect x="36" y="68" width="28" height="6" rx="1.5" fill="#d97706" />

            {/* Cup Stem */}
            <rect x="46" y="56" width="8" height="13" rx="2" fill="url(#trophyGold)" />

            {/* Handles */}
            <path
              d="M 34,34 C 20,34 20,52 36,52"
              fill="none"
              stroke="#eab308"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 66,34 C 80,34 80,52 64,52"
              fill="none"
              stroke="#eab308"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Cup Body */}
            <path
              d="M 32,24 C 32,54 44,58 50,58 C 56,58 68,54 68,24 Z"
              fill="url(#trophyGold)"
            />
            <ellipse cx="50" cy="24" rx="18" ry="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />

            {/* Star on Cup */}
            <polygon
              points="50,32 52,38 58,38 53,42 55,48 50,44 45,48 47,42 42,38 48,38"
              fill="#ffffff"
            />
          </svg>
        );

      // 7. 3D Map & Location Pin
      case 'map':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="mapFold1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="mapFold2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="82" rx="34" ry="7" fill="#0f172a" opacity="0.12" />

            {/* Isometric Folded Map Leaves */}
            <polygon points="16,38 38,30 38,72 16,80" fill="url(#mapFold1)" />
            <polygon points="38,30 62,38 62,80 38,72" fill="url(#mapFold2)" />
            <polygon points="62,38 84,30 84,72 62,80" fill="url(#mapFold1)" />

            {/* Green Eco Route on Map */}
            <path
              d="M 24,60 Q 38,50 48,56 T 76,46"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />

            {/* 3D Floating Pin */}
            <g transform="translate(50, 36)">
              <ellipse cx="0" cy="24" rx="6" ry="2.5" fill="#0f172a" opacity="0.25" />
              <path
                d="M 0,22 C -8,12 -12,4 -12,-2 C -12,-9 -6,-15 0,-15 C 6,-15 12,-9 12,-2 C 12,4 8,12 0,22 Z"
                fill="url(#pinGrad)"
                stroke="#991b1b"
                strokeWidth="1"
              />
              <circle cx="0" cy="-3" r="4.5" fill="#ffffff" />
            </g>
          </svg>
        );

      // 8. 3D Circular Plant / Bioreactor
      case 'plant':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="domeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="82" rx="32" ry="7" fill="#0f172a" opacity="0.12" />
            {/* Base Vat */}
            <rect x="26" y="56" width="48" height="20" rx="6" fill="#475569" />
            <rect x="28" y="54" width="44" height="20" rx="5" fill="#e2e8f0" />
            {/* Level meter */}
            <rect x="36" y="60" width="28" height="6" rx="3" fill="#22c55e" />

            {/* Glass Biodome */}
            <path
              d="M 28,54 C 28,26 72,26 72,54 Z"
              fill="url(#domeGrad)"
              stroke="#a7f3d0"
              strokeWidth="1.5"
            />
            {/* Growing Sprout inside */}
            <path
              d="M 50,54 C 50,42 43,38 40,36 C 44,42 48,46 50,54 Z"
              fill="#ffffff"
            />
            <path
              d="M 50,54 C 50,40 57,36 60,34 C 56,40 52,46 50,54 Z"
              fill="#bbf7d0"
            />
            {/* Solar roof cap */}
            <ellipse cx="50" cy="27" rx="10" ry="3" fill="#0284c7" />
          </svg>
        );

      // 9. 3D Market Shopping Bag
      case 'market':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="bagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="84" rx="28" ry="6" fill="#0f172a" opacity="0.12" />
            {/* Bag Body */}
            <polygon points="26,38 74,38 70,80 30,80" fill="url(#bagGrad)" />
            {/* Handle */}
            <path
              d="M 38,38 C 38,22 62,22 62,38"
              fill="none"
              stroke="#c2410c"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Green Leaf Tag */}
            <g transform="translate(50, 52)">
              <ellipse cx="0" cy="0" rx="10" ry="6" fill="#16a34a" transform="rotate(-20)" />
              <line x1="-8" y1="3" x2="8" y2="-3" stroke="#86efac" strokeWidth="1.5" />
            </g>
          </svg>
        );

      // 10. 3D Home / Eco Cottage
      case 'home':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="84" rx="32" ry="7" fill="#0f172a" opacity="0.12" />
            {/* House Wall */}
            <rect x="26" y="46" width="48" height="34" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Solar Roof */}
            <polygon points="50,22 18,48 82,48" fill="url(#roofGrad)" />
            {/* Solar Cells Grid */}
            <line x1="38" y1="34" x2="62" y2="34" stroke="#a7f3d0" strokeWidth="1" />
            <line x1="44" y1="28" x2="44" y2="44" stroke="#a7f3d0" strokeWidth="1" />
            <line x1="56" y1="28" x2="56" y2="44" stroke="#a7f3d0" strokeWidth="1" />
            {/* Front Door & Window */}
            <rect x="42" y="60" width="16" height="20" rx="3" fill="#15803d" />
            <circle cx="54" cy="70" r="1.5" fill="#fef08a" />
            <rect x="30" y="54" width="8" height="8" rx="2" fill="#38bdf8" />
            <rect x="62" y="54" width="8" height="8" rx="2" fill="#38bdf8" />
          </svg>
        );

      // 11. 3D Profile Citizen Badge
      case 'profile':
      case 'shield':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="84" rx="28" ry="6" fill="#0f172a" opacity="0.12" />
            {/* Shield Body */}
            <path
              d="M 50,18 C 72,18 78,28 78,48 C 78,68 56,78 50,82 C 44,78 22,68 22,48 C 22,28 28,18 50,18 Z"
              fill="url(#shieldGrad)"
              stroke="#bae6fd"
              strokeWidth="2"
            />
            {/* Citizen Avatar Silhouette */}
            <circle cx="50" cy="42" r="10" fill="#ffffff" />
            <path
              d="M 36,66 C 36,54 42,52 50,52 C 58,52 64,54 64,66 Z"
              fill="#ffffff"
            />
          </svg>
        );

      // Default fallback: 3D Leaf
      case 'leaf':
      case 'sparkle':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
            <defs>
              <linearGradient id="pureLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="82" rx="24" ry="6" fill="#0f172a" opacity="0.1" />
            <path
              d="M 50,18 C 28,32 28,68 50,80 C 72,68 72,32 50,18 Z"
              fill="url(#pureLeaf)"
              stroke="#14532d"
              strokeWidth="1.5"
            />
            {/* Midrib & Veins */}
            <path d="M 50,24 L 50,74" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M 50,40 L 40,46" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M 50,52 L 60,58" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M 50,60 L 42,65" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center relative transition-transform duration-200 ease-out ${sizeClasses} ${
        fluidHover ? 'hover:scale-108 active:scale-95 cursor-pointer' : ''
      } ${animate ? 'animate-fluid-float' : ''} ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-emerald-400/25 rounded-full blur-md -z-10 animate-pulse pointer-events-none" />
      )}
      {renderIconSvg()}
    </div>
  );
};
