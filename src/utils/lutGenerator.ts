/**
 * Enhanced LUT generator with more sophisticated algorithms
 */

import { RGBA, rgbToHsl, hslToRgb } from './lutColors';
import { 
  applySCurve, 
  adjustColorTemperature, 
  filmHighlightRolloff, 
  enhanceShadows,
  applyCrossProcessing,
  applySplitTone,
  applyFilmicToneMapping
} from './lutTransformations';
import { analyzePrompt } from './lutStyles';

// LUT dimensions (increased for better quality)
const LUT_SIZE = 64;

/**
 * Generate a CUBE format LUT file from a transformation function
 * @param transformFn Function that transforms RGBA values
 * @param lutSize Size of the LUT (number of points per dimension)
 * @returns String content of the .cube file
 */
export function generateCubeLUT(
  transformFn: (rgba: RGBA) => RGBA,
  lutSize: number = LUT_SIZE
): string {
  let cubeData = `# Created with Vision Grade LUTs Generator\n`;
  cubeData += `# https://visiongrade.com/\n\n`;
  cubeData += `LUT_3D_SIZE ${lutSize}\n\n`;

  // Generate the LUT data points
  for (let b = 0; b < lutSize; b++) {
    for (let g = 0; g < lutSize; g++) {
      for (let r = 0; r < lutSize; r++) {
        // Calculate the original RGB values (normalized from 0-1)
        const originalRGBA: RGBA = {
          r: r / (lutSize - 1),
          g: g / (lutSize - 1),
          b: b / (lutSize - 1),
          a: 1
        };

        // Apply the transformation function
        const transformedRGBA = transformFn(originalRGBA);

        // Add the transformed RGB values to the LUT
        cubeData += `${transformedRGBA.r.toFixed(6)} ${transformedRGBA.g.toFixed(6)} ${transformedRGBA.b.toFixed(6)}\n`;
      }
    }
  }

  return cubeData;
}

/**
 * Create a transformation based on a text prompt (enhanced version)
 */
export function createTransformationFromPrompt(prompt: string): (rgba: RGBA) => RGBA {
  const promptLower = prompt.toLowerCase();
  
  // Enhanced prompt analysis with more advanced algorithms for the example image style
  const isCinematic = promptLower.includes('cinematic');
  const isWarm = promptLower.includes('warm') || promptLower.includes('golden') || promptLower.includes('sunset');
  const isCold = promptLower.includes('cold') || promptLower.includes('blue') || promptLower.includes('cool');
  const isVintage = promptLower.includes('vintage') || promptLower.includes('film') || promptLower.includes('retro') || promptLower.includes('analog');
  const isHighContrast = promptLower.includes('contrast') || promptLower.includes('punchy') || promptLower.includes('dramatic');
  const isBW = promptLower.includes('black and white') || promptLower.includes('b&w') || promptLower.includes('monochrome');
  const isTeal = promptLower.includes('teal');
  const isOrange = promptLower.includes('orange');
  const isPastel = promptLower.includes('pastel') || promptLower.includes('soft');
  const isMoody = promptLower.includes('moody') || promptLower.includes('dark') || promptLower.includes('dramatic');
  const isSummer = promptLower.includes('summer') || promptLower.includes('sunny') || promptLower.includes('tropical');
  const isGreen = promptLower.includes('green') || promptLower.includes('forest');
  const isPurple = promptLower.includes('purple') || promptLower.includes('magenta');
  const isYellow = promptLower.includes('yellow') || promptLower.includes('gold');
  const isFaded = promptLower.includes('faded') || promptLower.includes('matte');
  const isVibrant = promptLower.includes('vibrant') || promptLower.includes('saturated');
  const isCyberpunk = promptLower.includes('cyberpunk') || promptLower.includes('neon');
  const isShadow = promptLower.includes('shadow') || promptLower.includes('noir');
  const isCoffee = promptLower.includes('coffee');
  const isSepia = promptLower.includes('sepia');
  const isRedTint = promptLower.includes('red') || promptLower.includes('crimson');
  const isBlueHour = promptLower.includes('blue hour') || promptLower.includes('twilight');
  const isGoldenHour = promptLower.includes('golden hour') || promptLower.includes('sunset');
  const isNight = promptLower.includes('night') || promptLower.includes('dark');
  const isSoft = promptLower.includes('soft') || promptLower.includes('gentle') || promptLower.includes('dreamy');
  const isHarsh = promptLower.includes('harsh') || promptLower.includes('strong');
  const isFilm = promptLower.includes('film') || promptLower.includes('analog');
  const isDigital = promptLower.includes('digital') || promptLower.includes('modern');
  const isAutumn = promptLower.includes('autumn') || promptLower.includes('fall') || promptLower.includes('orange leaves');
  const isDesert = promptLower.includes('desert') || promptLower.includes('amber') || promptLower.includes('sand');
  const isNordic = promptLower.includes('nordic') || promptLower.includes('scandinavia');
  const isCreamyHighlights = promptLower.includes('creamy') || promptLower.includes('cream');
  const isWoodland = promptLower.includes('woodland') || promptLower.includes('forest');
  const isRichTones = promptLower.includes('rich') || promptLower.includes('deep');
  
  // Detect specific film looks
  const isPortra = promptLower.includes('portra') || promptLower.includes('portrait film');
  const isFuji = promptLower.includes('fuji') || promptLower.includes('fujifilm');
  const isKodak = promptLower.includes('kodak');
  const isEktar = promptLower.includes('ektar');
  const isCineStill = promptLower.includes('cinestill');
  
  // New matching for the example image (golden retriever/warm autumn tones)
  const isGoldenRetrieverStyle = promptLower.includes('golden retriever') || 
                               promptLower.includes('dog portrait') || 
                               promptLower.includes('autumn pet') ||
                               promptLower.includes('autumn woodland');
  
  // Return a transformation function based on the prompt
  return (rgba: RGBA): RGBA => {
    let result = { ...rgba };
    
    // Convert to HSL for better transformations
    let [h, s, l] = rgbToHsl(result.r, result.g, result.b);
    
    // For the example golden retriever image style (warm autumn tones)
    if (isGoldenRetrieverStyle || isAutumn || isWoodland) {
      // Warm golden brown tones with autumn-like atmosphere
      result = adjustColorTemperature(result, 0.6); // Warm temperature
      
      // Apply split toning - warm amber shadows, golden highlights
      result = applySplitTone(result, 0.08, 0.4, 0.11, 0.6);
      
      // Filmic tone mapping for natural look
      result = applyFilmicToneMapping(result, 0.7);
      
      // Adjust vibrance for natural colors
      s = Math.min(1, s * 1.2);
      
      // Slight S-curve for contrast
      l = applySCurve(l, 0.4);
      
      // Additional adjustments for specific tones
      if (h > 0.05 && h < 0.17) { // Enhance golden/amber colors
        s = Math.min(1, s * 1.3);
        l = Math.min(0.95, l * 1.05);
      }
      
      if (h > 0.3 && h < 0.4) { // Enhance greens
        h = h * 0.95 + 0.33 * 0.05; // Shift slightly toward forest green
        s = Math.min(1, s * 0.9); // Slightly desaturate greens
      }
      
      // Apply highlight rolloff for filmic look
      if (l > 0.7) {
        l = filmHighlightRolloff(l, 0.8);
      }
      
      // Apply shadow enhancement
      if (l < 0.3) {
        l = enhanceShadows(l, 0.4);
      }
      
      // Convert back to RGB
      const [r, g, b] = hslToRgb(h, s, l);
      result.r = Math.max(0, Math.min(1, r));
      result.g = Math.max(0, Math.min(1, g));
      result.b = Math.max(0, Math.min(1, b));
      
      return result;
    }
    
    // Basic transformations
    if (isWarm) {
      // Enhanced warm look
      result = adjustColorTemperature(result, 0.5);
      
      // Add golden tint to highlights
      if (l > 0.7) {
        h = (h * 0.7 + 0.1 * 0.3) % 1; // Shift towards yellow-orange
      }
    }
    
    if (isCold) {
      // Enhanced cold look
      result = adjustColorTemperature(result, -0.5);
      
      // Add blue tint to shadows
      if (l < 0.3) {
        h = (h * 0.6 + 0.6 * 0.4) % 1; // Shift towards blue
      }
    }
    
    if (isVintage || isFilm) {
      // Enhanced vintage film look
      result = applyFilmicToneMapping(result, 0.7);
      
      // Add slight cross-processing effect for vintage feel
      result = applyCrossProcessing(result, 0.3);
      
      // Reduce saturation in shadows, enhance in midtones
      if (l < 0.3) {
        s = s * 0.8;
      } else if (l > 0.3 && l < 0.7) {
        s = Math.min(1, s * 1.1);
      }
      
      // Add filmic highlight rolloff
      if (l > 0.7) {
        l = filmHighlightRolloff(l, 0.8);
      }
      
      // Add slight warmth
      result = adjustColorTemperature(result, 0.2);
    }
    
    if (isHighContrast) {
      // Enhanced contrast with advanced S-curve
      l = applySCurve(l, 0.5);
      
      // Boost saturation in midtones
      if (l > 0.3 && l < 0.7) {
        s = Math.min(1, s * 1.2);
      }
    }
    
    if (isMoody) {
      // Enhanced moody look
      l = l * 0.9; // Overall darkening
      s = Math.min(1, s * 1.1); // Slight saturation increase
      
      // Blue shift in shadows, warmer midtones
      if (l < 0.3) {
        h = (h * 0.7 + 0.6 * 0.3) % 1; // Push shadows toward blue
        s = Math.min(1, s * 1.2);
      } else if (l > 0.3 && l < 0.6) {
        h = (h * 0.8 + 0.05 * 0.2) % 1; // Push midtones slightly warm
      }
      
      // Apply filmic tone mapping
      result = applyFilmicToneMapping(result, 0.7);
    }
    
    if (isSummer) {
      // Enhanced summer look
      result = adjustColorTemperature(result, 0.3); // Slight warmth
      
      // Enhance blues and cyans (sky and water)
      if (h > 0.5 && h < 0.6) {
        s = Math.min(1, s * 1.2);
        l = Math.min(1, l * 1.05);
      }
      
      // Enhance greens (foliage)
      if (h > 0.25 && h < 0.4) {
        s = Math.min(1, s * 1.1);
      }
      
      // Add sunny highlight glow
      if (l > 0.8) {
        l = Math.min(1, l * 1.1);
        s = s * 0.9; // Desaturate very bright highlights
      }
    }
    
    if (isGreen || isWoodland) {
      // Enhanced green processing
      if (h > 0.2 && h < 0.4) {
        // More precise adjustment for different types of greens
        if (h > 0.3) { // Yellow-greens
          h = h * 0.95 + 0.3 * 0.05; // Shift slightly
          s = Math.min(1, s * 1.1); // More saturation
        } else { // Blue-greens
          h = h * 0.95 + 0.27 * 0.05; // Shift slightly
          s = Math.min(1, s * 0.9); // Less saturation
        }
      }
      
      // Enhance contrast in greens
      if (h > 0.2 && h < 0.4 && l > 0.3 && l < 0.7) {
        l = applySCurve(l, 0.3);
      }
    }
    
    if (isPurple) {
      // Enhanced purple processing
      if (h > 0.7 && h < 0.85) {
        s = Math.min(1, s * 1.3); // Enhance saturation of purples
      }
      
      // Add purple cast to shadows
      if (l < 0.3) {
        h = (h * 0.7 + 0.8 * 0.3) % 1;
      }
    }
    
    if (isYellow || isGoldenHour) {
      // Enhanced yellow/golden processing
      if (h > 0.1 && h < 0.2) {
        s = Math.min(1, s * 1.2); // Enhance saturation of yellows
        l = Math.min(0.95, l * 1.05); // Brighten slightly
      }
      
      // Golden hour glow simulation
      result = adjustColorTemperature(result, 0.6);
      
      // Add golden tones to highlights
      if (l > 0.7) {
        h = (h * 0.7 + 0.12 * 0.3) % 1; // Shift towards gold
      }
      
      // Apply filmic highlight rolloff
      if (l > 0.75) {
        l = filmHighlightRolloff(l, 0.7);
      }
    }
    
    if (isFaded || isCreamyHighlights) {
      // Enhanced faded matte look
      s = s * 0.85; // Reduced saturation
      
      // Raise shadows, lower highlights
      if (l < 0.2) {
        l = l * 0.7 + 0.06; // Lift shadows
      } else if (l > 0.8) {
        l = l * 0.9 + 0.08; // Soften highlights
      }
      
      // Add subtle cream tint to highlights
      if (l > 0.7) {
        h = (h * 0.8 + 0.1 * 0.2) % 1; // Slight shift toward cream
        s = s * 0.8; // Desaturate highlights
      }
    }
    
    if (isVibrant || isRichTones) {
      // Enhanced vibrant look
      s = Math.min(1, s * 1.3); // Overall saturation increase
      
      // Apply split-tone for rich color palette
      result = applySplitTone(
        result, 
        0.6, // Shadow hue toward blue
        0.3, // Shadow strength
        0.1, // Highlight hue toward orange
        0.4  // Highlight strength
      );
      
      // Enhance contrast
      l = applySCurve(l, 0.4);
    }
    
    if (isCyberpunk) {
      // Enhanced cyberpunk look with extreme contrast and neon
      s = Math.min(1, s * 1.6); // Extreme saturation
      
      // High contrast
      l = applySCurve(l, 0.7);
      
      // Neon glow in shadows
      if (l < 0.3) {
        // Random neon color based on original hue
        const neonHues = [0.9, 0.7, 0.3, 0.5]; // Purple, Blue, Green, Cyan
        h = neonHues[Math.floor(h * 4)];
        s = Math.min(1, s * 1.8);
      }
      
      // Split toning
      result = applySplitTone(
        result,
        0.75, // Shadow hue (purple)
        0.7,  // Shadow strength
        0.5,  // Highlight hue (cyan)
        0.7   // Highlight strength
      );
    }
    
    if (isCinematic) {
      // Enhanced cinematic look with teal shadows and orange highlights
      result = applySplitTone(
        result,
        0.5,  // Shadow hue (teal)
        0.4,  // Shadow strength
        0.08, // Highlight hue (orange)
        0.5   // Highlight strength
      );
      
      // Filmic contrast
      l = applySCurve(l, 0.4);
      
      // Apply filmic tone mapping
      result = applyFilmicToneMapping(result, 0.8);
      
      // Selective desaturation
      if (l < 0.2 || l > 0.8) {
        s = s * 0.9; // Slightly desaturate very dark and very bright areas
      }
    }
    
    if (isTeal && isOrange) {
      // Enhanced teal & orange Hollywood look
      // More sophisticated implementation using luminance
      const luminance = 0.2126 * result.r + 0.7152 * result.g + 0.0722 * result.b;
      
      if (luminance < 0.5) {
        // Push shadows to teal, with gradual transition
        const strength = 0.7 - luminance; // Stronger effect for darker shadows
        h = h * (1 - strength) + 0.5 * strength; // Mix with teal hue
        s = Math.min(1, s * (1 + 0.3 * strength)); // Boost saturation
      } else {
        // Push highlights to orange, with gradual transition
        const strength = luminance - 0.5; // Stronger effect for brighter highlights
        h = h * (1 - strength) + 0.08 * strength; // Mix with orange hue
        s = Math.min(1, s * (1 + 0.3 * strength)); // Boost saturation
      }
      
      // Apply filmic contrast curve
      l = applySCurve(l, 0.5);
    }

    if (isShadow) {
      // Enhanced shadow detail processing
      if (l < 0.3) {
        l = enhanceShadows(l, 0.5);
      }
      
      // Deep rich shadows with blue tint
      if (l < 0.2) {
        h = (h * 0.8 + 0.6 * 0.2) % 1; // Shift toward blue
        s = Math.min(1, s * 0.9); // Slightly reduce saturation in very dark areas
      }
      
      // Brighter highlights
      if (l > 0.7) {
        l = Math.min(1, l * 1.1);
      }
    }
    
    // Apply final HSL adjustments if they were modified directly
    if ([h, s, l].some(Boolean)) {
      const [r, g, b] = hslToRgb(h, s, l);
      result.r = Math.max(0, Math.min(1, r));
      result.g = Math.max(0, Math.min(1, g));
      result.b = Math.max(0, Math.min(1, b));
    }
    
    return result;
  };
}

// Re-export necessary types and functions for backward compatibility
export { analyzePrompt };
export type { RGBA };
