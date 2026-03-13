import React from 'react';

/**
 * AppLogo
 * Circular golden badge — transparent background, inline SVG so the gradient
 * and crisp rendering are guaranteed at every DPI.
 *
 * Design:
 *  • Outer ring  — 2 px golden gradient stroke
 *  • Inner ring  — 0.6 px, 30 % opacity accent band
 *  • Four tick-marks at cardinal positions (top / right / bottom / left)
 *  • Large serif "R" (dominant, left-centre)
 *  • Smaller "$" (secondary, lower-right, slight overlap for depth)
 *  • Radial inner glow (very subtle)
 *
 * Gradient mirrors --gradient-brand: #fff8e8 → #fcd34d → #f59e0b → #d97706
 */
const AppLogo = ({ size = 40, className = '', ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    aria-hidden="true"
    className={className}
    style={{ flexShrink: 0, display: 'block' }}
    {...rest}
  >
    <defs>
      {/* Primary gold gradient — diagonal, matches app brand gradient */}
      <linearGradient
        id="al-gold"
        x1="4" y1="4" x2="44" y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%"   stopColor="#fff8e8" />
        <stop offset="25%"  stopColor="#fcd34d" />
        <stop offset="62%"  stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>

      {/* Dimmer version for the inner ring */}
      <linearGradient
        id="al-gold-dim"
        x1="4" y1="4" x2="44" y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%"   stopColor="#fcd34d" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.25" />
      </linearGradient>

      {/* Radial glow for inner fill */}
      <radialGradient id="al-glow" cx="48%" cy="42%" r="50%">
        <stop offset="0%"   stopColor="#fcd34d" stopOpacity="0.16" />
        <stop offset="80%"  stopColor="#f59e0b" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ── Subtle inner fill glow ─────────────────────────────────────── */}
    <circle cx="24" cy="24" r="21.5" fill="url(#al-glow)" />

    {/* ── Outer ring ────────────────────────────────────────────────── */}
    <circle cx="24" cy="24" r="22.5" stroke="url(#al-gold)" strokeWidth="2" />

    {/* ── Inner decorative ring ─────────────────────────────────────── */}
    <circle cx="24" cy="24" r="18.8" stroke="url(#al-gold-dim)" strokeWidth="0.6" />

    {/* ── Cardinal tick marks (top · right · bottom · left) ────────── */}
    {/* Top    */ }
    <line x1="24" y1="2.5"  x2="24" y2="5.5"  stroke="url(#al-gold)" strokeWidth="1.2" strokeLinecap="round" />
    {/* Right  */ }
    <line x1="42.5" y1="24" x2="45.5" y2="24" stroke="url(#al-gold)" strokeWidth="1.2" strokeLinecap="round" />
    {/* Bottom */ }
    <line x1="24" y1="42.5" x2="24" y2="45.5" stroke="url(#al-gold)" strokeWidth="1.2" strokeLinecap="round" />
    {/* Left   */ }
    <line x1="2.5" y1="24"  x2="5.5" y2="24"  stroke="url(#al-gold)" strokeWidth="1.2" strokeLinecap="round" />

    {/* ── Large "R"  — serif, left-dominant ────────────────────────── */}
    <text
      x="6"
      y="35"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize="28"
      fontWeight="bold"
      fill="url(#al-gold)"
      dominantBaseline="auto"
    >
      R
    </text>

    {/* ── "$" — smaller, lower-right, slight overlap for depth ─────── */}
    <text
      x="27.5"
      y="36"
      fontFamily="'Arial', Helvetica, sans-serif"
      fontSize="14"
      fontWeight="700"
      fill="url(#al-gold)"
      opacity="0.88"
      dominantBaseline="auto"
    >
      $
    </text>
  </svg>
);

export default AppLogo;
