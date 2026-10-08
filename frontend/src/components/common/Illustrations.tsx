import React from 'react';

/**
 * World-class SVG vector illustrations for CyberSeva
 * Crisp at all resolutions, perfectly aligned, with modern gradients & Indian cyber café motifs.
 */

export const CounterHeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 540 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="deskGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0B132B" />
        <stop offset="100%" stopColor="#1C2541" />
      </linearGradient>
      <linearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#00F0FF" />
        <stop offset="100%" stopColor="#0072FF" />
      </linearGradient>
      <linearGradient id="tricolorAccent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FF9933" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#138808" />
      </linearGradient>
      <linearGradient id="laserBeam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
      </linearGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Ambient Glows */}
    <circle cx="270" cy="140" r="120" fill="#4F46E5" fillOpacity="0.12" filter="url(#softGlow)" />
    <circle cx="430" cy="180" r="80" fill="#10B981" fillOpacity="0.1" filter="url(#softGlow)" />
    <circle cx="100" cy="200" r="70" fill="#F59E0B" fillOpacity="0.08" filter="url(#softGlow)" />

    {/* Counter Desk Surface */}
    <ellipse cx="270" cy="265" rx="240" ry="42" fill="url(#deskGrad)" fillOpacity="0.95" />
    <ellipse cx="270" cy="262" rx="230" ry="38" stroke="#334155" strokeWidth="1.5" />

    {/* Subtle Tri-Color Edge Ribbon */}
    <rect x="180" y="278" width="180" height="4" rx="2" fill="url(#tricolorAccent)" opacity="0.85" />

    {/* Main Monitor Display */}
    <g transform="translate(185, 70)">
      {/* Monitor Stand */}
      <path d="M75 140 L95 140 L92 165 L78 165 Z" fill="#475569" />
      <ellipse cx="85" cy="166" rx="35" ry="8" fill="#334155" />
      {/* Screen Frame */}
      <rect x="0" y="0" width="170" height="135" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" filter="url(#softGlow)" />
      {/* Screen Inside */}
      <rect x="6" y="6" width="158" height="123" rx="10" fill="#090D1A" />
      {/* Screen Window UI */}
      <rect x="14" y="14" width="142" height="14" rx="4" fill="#1E293B" />
      <circle cx="22" cy="21" r="3" fill="#EF4444" />
      <circle cx="31" cy="21" r="3" fill="#F59E0B" />
      <circle cx="40" cy="21" r="3" fill="#10B981" />
      <rect x="52" y="18" width="60" height="6" rx="3" fill="#334155" />
      {/* Mini Card Preview on Screen */}
      <rect x="20" y="38" width="60" height="40" rx="5" fill="#1E293B" stroke="#60A5FA" strokeWidth="1" />
      <rect x="26" y="44" width="20" height="18" rx="3" fill="#3B82F6" opacity="0.4" />
      <rect x="50" y="44" width="24" height="4" rx="2" fill="#93C5FD" />
      <rect x="50" y="52" width="18" height="3" rx="1.5" fill="#64748B" />
      <rect x="26" y="68" width="48" height="4" rx="2" fill="#E2E8F0" opacity="0.6" />
      {/* Live Chart on Screen */}
      <path d="M90 75 Q105 50 120 62 T145 42" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="145" cy="42" r="3.5" fill="#34D399" />
      <rect x="20" y="88" width="130" height="30" rx="4" fill="#1E293B" opacity="0.8" />
      <rect x="28" y="96" width="30" height="6" rx="3" fill="#10B981" />
      <rect x="28" y="106" width="45" height="4" rx="2" fill="#64748B" />
      <rect x="85" y="96" width="55" height="14" rx="4" fill="#2563EB" />
    </g>

    {/* High-Speed Laser Printer on Left */}
    <g transform="translate(60, 155)">
      {/* Printer Body */}
      <rect x="0" y="20" width="110" height="70" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
      <rect x="10" y="30" width="90" height="14" rx="4" fill="#0F172A" />
      {/* Status LED */}
      <circle cx="20" cy="25" r="2.5" fill="#10B981" />
      <circle cx="30" cy="25" r="2.5" fill="#38BDF8" />
      {/* Paper In Tray */}
      <rect x="25" y="5" width="60" height="20" rx="2" fill="#FFFFFF" opacity="0.9" />
      {/* Fresh Print Emerging with Fold Lines */}
      <rect x="18" y="44" width="74" height="48" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" filter="url(#softGlow)" />
      {/* Aadhaar Layout on Printed Paper */}
      <rect x="24" y="50" width="28" height="18" rx="2" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="0.8" />
      <rect x="56" y="50" width="28" height="18" rx="2" fill="#F0FDF4" stroke="#10B981" strokeWidth="0.8" />
      {/* Cut Guideline */}
      <line x1="53.5" y1="47" x2="53.5" y2="72" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="24" y="74" width="62" height="4" rx="2" fill="#94A3B8" />
      <rect x="24" y="82" width="40" height="4" rx="2" fill="#CBD5E1" />
    </g>

    {/* QR Desk Standee on Right */}
    <g transform="translate(385, 140)">
      {/* Acrylic Stand Base */}
      <path d="M10 110 L80 110 L68 122 L22 122 Z" fill="#334155" opacity="0.9" />
      {/* Standee Board */}
      <rect x="12" y="10" width="66" height="95" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" filter="url(#softGlow)" />
      {/* Top Standee Header */}
      <rect x="12" y="10" width="66" height="20" rx="6" fill="#071A52" />
      <rect x="20" y="17" width="50" height="5" rx="2.5" fill="#F8FAFC" />
      {/* QR Code graphic */}
      <rect x="22" y="36" width="46" height="46" rx="4" fill="#F1F5F9" />
      <rect x="26" y="40" width="12" height="12" fill="#0F172A" />
      <rect x="28" y="42" width="8" height="8" fill="#FFFFFF" />
      <rect x="30" y="44" width="4" height="4" fill="#0F172A" />
      <rect x="52" y="40" width="12" height="12" fill="#0F172A" />
      <rect x="54" y="42" width="8" height="8" fill="#FFFFFF" />
      <rect x="56" y="44" width="4" height="4" fill="#0F172A" />
      <rect x="26" y="66" width="12" height="12" fill="#0F172A" />
      <rect x="28" y="68" width="8" height="8" fill="#FFFFFF" />
      <rect x="30" y="70" width="4" height="4" fill="#0F172A" />
      {/* Center QR Pixel cluster */}
      <rect x="44" y="48" width="4" height="4" fill="#0F172A" />
      <rect x="50" y="54" width="6" height="4" fill="#0F172A" />
      <rect x="42" y="62" width="8" height="4" fill="#0F172A" />
      <rect x="54" y="68" width="6" height="8" fill="#0F172A" />
      {/* "Scan & Send" pill */}
      <rect x="20" y="87" width="50" height="11" rx="4" fill="#10B981" />
      <rect x="28" y="91" width="34" height="3" rx="1.5" fill="#FFFFFF" />
    </g>

    {/* Biometric Scanner & Keypad on Desk Center */}
    <g transform="translate(190, 220)">
      <rect x="0" y="0" width="42" height="35" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1" />
      <circle cx="21" cy="17" r="10" fill="#065F46" stroke="#10B981" strokeWidth="1.5" />
      {/* Fingerprint ridges */}
      <path d="M17 17 Q21 13 25 17 Q21 21 17 17" stroke="#34D399" strokeWidth="1.2" fill="none" />
      <path d="M15 17 Q21 10 27 17" stroke="#34D399" strokeWidth="1" fill="none" />
    </g>

    {/* Sparkles / Connectivity Waves */}
    <path d="M370 170 Q350 150 330 160" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.8" />
    <path d="M380 185 Q355 170 330 185" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" opacity="0.6" />
    <polygon points="175,55 178,48 185,45 178,42 175,35 172,42 165,45 172,48" fill="#FBBF24" />
    <polygon points="480,95 482,89 488,87 482,85 480,79 478,85 472,87 478,89" fill="#38BDF8" />
  </svg>
);

export const LoginSecurityIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 460 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="authGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="10" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Radiant Background Aura */}
    <circle cx="230" cy="180" r="140" fill="#3B82F6" fillOpacity="0.12" filter="url(#authGlow)" />
    <circle cx="230" cy="180" r="100" fill="#10B981" fillOpacity="0.08" filter="url(#authGlow)" />

    {/* Concentric Security Radar Rings */}
    <circle cx="230" cy="180" r="130" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
    <circle cx="230" cy="180" r="105" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
    <circle cx="230" cy="180" r="80" stroke="#4F46E5" strokeWidth="1.5" opacity="0.4" />

    {/* Shield Base */}
    <path
      d="M230 65 L315 105 C315 190 270 250 230 275 C190 250 145 190 145 105 Z"
      fill="url(#shieldGrad)"
      stroke="#60A5FA"
      strokeWidth="3"
      filter="url(#authGlow)"
    />

    {/* Inner Shield Facet */}
    <path
      d="M230 80 L295 112 C295 180 260 232 230 254 C200 232 165 180 165 112 Z"
      fill="#0B132B"
      fillOpacity="0.85"
    />

    {/* Golden Padlock & Keyhole */}
    <rect x="205" y="160" width="50" height="42" rx="8" fill="url(#goldGrad)" stroke="#FDE68A" strokeWidth="1.5" />
    {/* Lock Shackle */}
    <path
      d="M214 160 V142 C214 133 221 126 230 126 C239 126 246 133 246 142 V160"
      stroke="url(#goldGrad)"
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="230" cy="178" r="4.5" fill="#78350F" />
    <polygon points="228,178 232,178 233,190 227,190" fill="#78350F" />

    {/* Biometric Verification Pulse Line */}
    <path
      d="M160 200 Q195 200 205 190 T220 205 T235 185 T245 205 T255 195 T300 200"
      stroke="#34D399"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.9"
    />

    {/* Floating Badges */}
    <g transform="translate(60, 110)">
      <rect x="0" y="0" width="105" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
      <circle cx="16" cy="17" r="6" fill="#10B981" />
      <path d="M13 17 L15 19 L19 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="28" y="12" width="65" height="4" rx="2" fill="#F8FAFC" />
      <rect x="28" y="19" width="45" height="3" rx="1.5" fill="#64748B" />
    </g>

    <g transform="translate(295, 220)">
      <rect x="0" y="0" width="115" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
      <circle cx="16" cy="17" r="6" fill="#3B82F6" />
      <rect x="28" y="12" width="72" height="4" rx="2" fill="#F8FAFC" />
      <rect x="28" y="19" width="50" height="3" rx="1.5" fill="#38BDF8" />
    </g>
  </svg>
);

export const EmptyKhataIllustration: React.FC<{ className?: string }> = ({ className = 'w-44 h-44 mx-auto' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="80" fill="#F0FDF4" />
    {/* Ledger Book */}
    <rect x="50" y="50" width="90" height="105" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
    <rect x="50" y="50" width="16" height="105" rx="4" fill="#071A52" />
    {/* Book Ribbon */}
    <rect x="90" y="45" width="8" height="35" rx="2" fill="#10B981" />
    {/* Lines inside */}
    <rect x="74" y="70" width="55" height="5" rx="2.5" fill="#E2E8F0" />
    <rect x="74" y="85" width="45" height="5" rx="2.5" fill="#E2E8F0" />
    <rect x="74" y="100" width="50" height="5" rx="2.5" fill="#E2E8F0" />
    <rect x="74" y="115" width="35" height="5" rx="2.5" fill="#10B981" opacity="0.6" />
    {/* Rupee Coins */}
    <g transform="translate(125, 120)">
      <circle cx="15" cy="15" r="15" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="15" cy="15" r="11" stroke="#FDE68A" strokeWidth="1" fill="none" />
      <text x="11.5" y="19" fill="#FFFFFF" fontSize="12" fontWeight="bold">₹</text>
    </g>
    <g transform="translate(108, 136)">
      <circle cx="12" cy="12" r="12" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      <text x="9" y="16" fill="#78350F" fontSize="10" fontWeight="bold">₹</text>
    </g>
  </svg>
);

export const EmptyQueueIllustration: React.FC<{ className?: string }> = ({ className = 'w-44 h-44 mx-auto' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="75" fill="#EFF6FF" />
    {/* Mobile Phone */}
    <rect x="70" y="45" width="60" height="110" rx="10" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" />
    <rect x="76" y="55" width="48" height="85" rx="4" fill="#1E293B" />
    {/* Camera notch */}
    <circle cx="100" cy="50" r="2" fill="#64748B" />
    {/* QR code on screen */}
    <rect x="85" y="70" width="30" height="30" rx="3" fill="#FFFFFF" />
    <rect x="88" y="73" width="8" height="8" fill="#0F172A" />
    <rect x="104" y="73" width="8" height="8" fill="#0F172A" />
    <rect x="88" y="89" width="8" height="8" fill="#0F172A" />
    <rect x="98" y="81" width="4" height="4" fill="#0F172A" />
    {/* Broadcast Waves */}
    <path d="M55 70 Q45 100 55 130" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
    <path d="M42 55 Q28 100 42 145" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
    <path d="M145 70 Q155 100 145 130" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
    <path d="M158 55 Q172 100 158 145" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
  </svg>
);
