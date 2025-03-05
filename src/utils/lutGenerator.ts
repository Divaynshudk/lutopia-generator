
// Enhanced LUT generator with more sophisticated algorithms

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

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
  let cubeData = `# Created with LUTs Generator\n`;
  cubeData += `# https://lovable.dev/\n\n`;
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
 * Converting RGB to HSL color space for better transformations
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 1;
  g /= 1;
  b /= 1;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

/**
 * Converting HSL back to RGB color space
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r, g, b];
}

/**
 * Create a transformation based on a text prompt (enhanced version)
 */
export function createTransformationFromPrompt(prompt: string): (rgba: RGBA) => RGBA {
  const promptLower = prompt.toLowerCase();
  
  // Enhanced prompt analysis with more options
  const isCinematic = promptLower.includes('cinematic');
  const isWarm = promptLower.includes('warm');
  const isCold = promptLower.includes('cold') || promptLower.includes('blue') || promptLower.includes('cool');
  const isVintage = promptLower.includes('vintage') || promptLower.includes('film') || promptLower.includes('retro');
  const isHighContrast = promptLower.includes('contrast') || promptLower.includes('punchy');
  const isBW = promptLower.includes('black and white') || promptLower.includes('b&w') || promptLower.includes('monochrome');
  const isTeal = promptLower.includes('teal');
  const isOrange = promptLower.includes('orange');
  const isPastel = promptLower.includes('pastel') || promptLower.includes('soft');
  const isMoody = promptLower.includes('moody') || promptLower.includes('dark') || promptLower.includes('dramatic');
  const isSummer = promptLower.includes('summer') || promptLower.includes('sunny') || promptLower.includes('tropical');
  const isGreen = promptLower.includes('green');
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
  const isSoft = promptLower.includes('soft') || promptLower.includes('gentle');
  const isHarsh = promptLower.includes('harsh') || promptLower.includes('strong');
  const isFilm = promptLower.includes('film') || promptLower.includes('analog');
  const isDigital = promptLower.includes('digital') || promptLower.includes('modern');
  
  // Return a transformation function based on the prompt
  return (rgba: RGBA): RGBA => {
    let result = { ...rgba };
    
    // Convert to HSL for better transformations
    let [h, s, l] = rgbToHsl(result.r, result.g, result.b);
    
    // Basic transformations
    if (isWarm) {
      // Shift hue towards orange/red
      h = (h + 0.05) % 1;
      s = Math.min(1, s * 1.1);
    }
    
    if (isCold) {
      // Shift hue towards blue
      h = (h - 0.05 + 1) % 1;
      s = Math.min(1, s * 1.1);
    }
    
    if (isVintage) {
      // Vintage film look with muted colors and warm tone
      h = (h + 0.02) % 1;
      s = Math.max(0, s * 0.85);
      l = 0.9 * l + 0.1;
    }
    
    if (isHighContrast) {
      // Increase contrast with S-curve
      l = l > 0.5 ? l + (1 - l) * 0.2 : l - l * 0.2;
      s = Math.min(1, s * 1.2);
    }
    
    if (isMoody) {
      // Dark, moody look with blue shadows
      l = l * 0.9;
      s = Math.min(1, s * 1.1);
      if (l < 0.3) {
        h = (h * 0.7 + 0.6) % 1; // Push shadows toward blue
      }
    }
    
    if (isSummer) {
      // Bright, warm look
      h = (h * 0.8 + 0.1) % 1; // Slight shift toward yellow/orange
      s = Math.min(1, s * 1.1);
      l = Math.min(1, l * 1.05 + 0.05);
    }
    
    if (isGreen) {
      // Enhance greens
      if (h > 0.2 && h < 0.4) {
        s = Math.min(1, s * 1.3);
      }
    }
    
    if (isPurple) {
      // Add purple cast
      h = (h * 0.7 + 0.8) % 1;
    }
    
    if (isYellow) {
      // Add yellow cast
      h = (h * 0.7 + 0.15) % 1;
    }
    
    if (isFaded) {
      // Faded matte look
      s = s * 0.8;
      l = l * 0.9 + 0.1;
    }
    
    if (isVibrant) {
      // Increase saturation
      s = Math.min(1, s * 1.5);
    }
    
    if (isCyberpunk) {
      // High contrast with neon glow
      s = Math.min(1, s * 1.5);
      l = l > 0.7 ? Math.min(1, l * 1.2) : l * 0.8;
      h = (h + 0.5) % 1; // Complementary colors
    }
    
    if (isCinematic) {
      // Enhanced cinematic look with controlled contrast
      l = l > 0.5 ? l * 0.9 + 0.1 : l * 0.9;
      s = Math.min(1, s * 1.05);
    }
    
    if (isTeal && isOrange) {
      // The popular teal & orange look from Hollywood
      const luminance = 0.2126 * result.r + 0.7152 * result.g + 0.0722 * result.b;
      
      if (luminance < 0.5) {
        // Shadows to teal
        h = 0.5; // Teal
        s = Math.min(1, s * 1.2);
      } else {
        // Highlights to orange
        h = 0.08; // Orange
        s = Math.min(1, s * 1.2);
      }
    }
    
    if (isShadow) {
      // Deep shadows, brighter highlights
      l = l < 0.3 ? l * 0.7 : l > 0.7 ? Math.min(1, l * 1.1) : l;
    }
    
    if (isPastel) {
      // Soft pastel tones
      s = Math.max(0.3, s * 0.7);
      l = Math.min(0.9, l * 0.8 + 0.2);
    }
    
    if (isBW) {
      // Convert to black and white
      s = 0;
      
      if (isHighContrast) {
        // High contrast B&W
        l = l > 0.5 ? Math.min(1, l * 1.2) : Math.max(0, l * 0.8);
      }
    }
    
    // New transformations
    if (isCoffee) {
      // Coffee tone - warm browns with slightly reduced saturation
      h = 0.08; // Brown-orange hue
      s = Math.min(1, s * 0.9);
      l = l * 0.95;
      
      // Subtle shift based on luminance for dimension
      if (l > 0.7) {
        h = 0.07; // Slightly more golden for highlights
        s = Math.min(0.8, s * 0.8);
      } else if (l < 0.3) {
        h = 0.09; // Deeper brown for shadows
        s = Math.min(0.7, s * 0.7);
      }
    }
    
    if (isSepia) {
      // Classic sepia tone
      h = 0.07; // Sepia hue
      s = Math.min(0.8, s * 0.8);
      l = Math.min(0.9, l * 0.9 + 0.1);
    }
    
    if (isRedTint) {
      // Red/Crimson tint
      h = (h * 0.5 + 0.98) % 1;
      s = Math.min(1, s * 1.2);
    }
    
    if (isBlueHour) {
      // Blue hour twilight look
      h = (h * 0.5 + 0.6) % 1; // Shift toward blue
      s = Math.min(1, s * 0.9);
      l = l * 0.9;
      
      // Shadows deeper blue
      if (l < 0.4) {
        h = (h * 0.8 + 0.65) % 1;
        s = Math.min(1, s * 1.2);
      }
    }
    
    if (isGoldenHour) {
      // Golden hour sunset look
      h = (h * 0.7 + 0.07) % 1; // Shift toward gold
      s = Math.min(1, s * 1.1);
      
      // Different treatment based on luminance
      if (l > 0.7) {
        // Highlights more yellow
        h = (h * 0.9 + 0.1) % 1;
        s = Math.min(1, s * 0.9);
      } else if (l < 0.3) {
        // Shadows more orange-red
        h = (h * 0.9 + 0.05) % 1;
        s = Math.min(1, s * 1.2);
      }
    }
    
    if (isNight) {
      // Night look - deep blues and shadows
      l = l * 0.8; // Darken overall
      
      if (l < 0.5) {
        h = (h * 0.5 + 0.6) % 1; // Blue shift for darker areas
        s = Math.min(1, s * 0.8);
      }
    }
    
    if (isSoft) {
      // Soft look - reduced contrast and slightly lifted blacks
      l = l < 0.1 ? l * 2 + 0.1 : l > 0.9 ? l * 0.9 + 0.1 : l;
      s = s * 0.9;
    }
    
    if (isHarsh) {
      // Harsh look - increased contrast and saturation
      l = l > 0.5 ? Math.min(1, l * 1.2) : Math.max(0, l * 0.8);
      s = Math.min(1, s * 1.3);
    }
    
    if (isFilm) {
      // Film look - subtle highlight rolloff, grain simulation, slight color shifts
      if (l > 0.8) {
        l = 0.8 + (l - 0.8) * 0.7; // Softer highlights
      }
      
      // Slight color shift based on tone
      if (l > 0.6) {
        h = (h * 0.95 + 0.08 * 0.05) % 1; // Slight warmth in highlights
      } else if (l < 0.3) {
        h = (h * 0.95 + 0.6 * 0.05) % 1; // Slight coolness in shadows
      }
      
      // Slight s-curve for mid tones
      if (l > 0.3 && l < 0.7) {
        l = l > 0.5 ? l + (l - 0.5) * 0.1 : l - (0.5 - l) * 0.1;
      }
    }
    
    if (isDigital) {
      // Digital look - clean, sharp, vibrant
      s = Math.min(1, s * 1.2);
      l = l > 0.5 ? Math.min(1, l * 1.1) : Math.max(0, l * 0.9);
    }
    
    // Convert back to RGB
    const [r, g, b] = hslToRgb(h, s, l);
    result.r = Math.max(0, Math.min(1, r));
    result.g = Math.max(0, Math.min(1, g));
    result.b = Math.max(0, Math.min(1, b));
    
    return result;
  };
}
