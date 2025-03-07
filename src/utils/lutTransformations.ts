
/**
 * Advanced color transformation functions for LUT generation
 */

import { RGBA, rgbToHsl, hslToRgb } from './lutColors';

/**
 * Apply S-Curve contrast to a value
 */
export function applySCurve(value: number, strength: number = 0.3): number {
  return (1 / (1 + Math.exp(-strength * (value - 0.5) * 12))) * 0.98 + 0.01;
}

/**
 * Advanced color temperature adjustment
 */
export function adjustColorTemperature(rgba: RGBA, temperature: number): RGBA {
  // Temperature ranges from -1 (cool/blue) to 1 (warm/orange)
  const [r, g, b] = [rgba.r, rgba.g, rgba.b];
  
  let result = {...rgba};
  
  if (temperature > 0) {
    // Warm (increase red, decrease blue)
    result.r = Math.min(1, r + temperature * 0.2);
    result.b = Math.max(0, b - temperature * 0.1);
  } else {
    // Cool (increase blue, decrease red)
    result.b = Math.min(1, b - temperature * 0.2);
    result.r = Math.max(0, r + temperature * 0.1);
  }
  
  return result;
}

/**
 * Film-like highlight roll-off function
 */
export function filmHighlightRolloff(value: number, strength: number = 0.7): number {
  if (value <= 0.7) return value;
  const x = (value - 0.7) / 0.3;
  return 0.7 + 0.3 * (1 - Math.pow(1 - x, strength));
}

/**
 * Enhanced shadow recovery
 */
export function enhanceShadows(value: number, strength: number = 0.3): number {
  if (value >= 0.3) return value;
  const x = value / 0.3;
  return 0.3 * Math.pow(x, 1 - strength);
}

/**
 * Cross-processed look effect
 */
export function applyCrossProcessing(rgba: RGBA, strength: number = 0.5): RGBA {
  let [h, s, l] = rgbToHsl(rgba.r, rgba.g, rgba.b);
  
  // Shift shadow tones towards teal
  if (l < 0.4) {
    h = (h * 0.7 + 0.5 * 0.3) % 1;
    s = Math.min(1, s * (1 + strength * 0.3));
  }
  
  // Shift highlights towards yellow/orange
  if (l > 0.6) {
    h = (h * 0.7 + 0.12 * 0.3) % 1;
    s = Math.min(1, s * (1 + strength * 0.2));
  }
  
  const [r, g, b] = hslToRgb(h, s, l);
  return {
    r: Math.max(0, Math.min(1, r)),
    g: Math.max(0, Math.min(1, g)),
    b: Math.max(0, Math.min(1, b)),
    a: rgba.a
  };
}

/**
 * Apply a split-tone effect (different colors for shadows and highlights)
 */
export function applySplitTone(
  rgba: RGBA, 
  shadowHue: number,
  shadowStrength: number,
  highlightHue: number,
  highlightStrength: number
): RGBA {
  let [h, s, l] = rgbToHsl(rgba.r, rgba.g, rgba.b);
  
  if (l < 0.5) {
    // Shadows
    const mixFactor = (0.5 - l) * 2 * shadowStrength;
    h = h * (1 - mixFactor) + shadowHue * mixFactor;
    s = Math.min(1, s * (1 + shadowStrength * 0.3));
  } else {
    // Highlights
    const mixFactor = (l - 0.5) * 2 * highlightStrength;
    h = h * (1 - mixFactor) + highlightHue * mixFactor;
    s = Math.min(1, s * (1 + highlightStrength * 0.3));
  }
  
  const [r, g, b] = hslToRgb(h, s, l);
  return {
    r: Math.max(0, Math.min(1, r)),
    g: Math.max(0, Math.min(1, g)),
    b: Math.max(0, Math.min(1, b)),
    a: rgba.a
  };
}

/**
 * Apply a "filmic" look with tone mapping
 */
export function applyFilmicToneMapping(rgba: RGBA, strength: number = 0.8): RGBA {
  const a = 0.15;
  const b_param = 0.50; // Renamed from 'b' to 'b_param' to avoid conflict
  const c = 0.10;
  const d = 0.20;
  const e = 0.02;
  const f = 0.30;
  
  const applyACES = (x: number): number => {
    return (x * (a * x + c * b_param) + d * e) / (x * (a * x + b_param) + d * f) - e / f;
  };
  
  // Mix between original and ACES-mapped value based on strength
  const r = rgba.r * (1 - strength) + applyACES(rgba.r) * strength;
  const g = rgba.g * (1 - strength) + applyACES(rgba.g) * strength;
  const b = rgba.b * (1 - strength) + applyACES(rgba.b) * strength;
  
  return {
    r: Math.max(0, Math.min(1, r)),
    g: Math.max(0, Math.min(1, g)),
    b: Math.max(0, Math.min(1, b)),
    a: rgba.a
  };
}
