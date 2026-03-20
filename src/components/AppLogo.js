import React from 'react';
import appLogo from '../assets/appLogo.svg'; // Adjust path as necessary

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
  <img src={appLogo} alt="App Logo" width={size} height={size} className={className} {...rest} />
);

export default AppLogo;
