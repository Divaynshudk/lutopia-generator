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
 * RGB to OKLAB color space conversion for more perceptually uniform transformations
 * OKLAB provides better perceptual uniformity than HSL
 */
function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
  // Convert RGB to linear RGB
  const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Convert to XYZ
  const x = 0.4124 * linearR + 0.3576 * linearG + 0.1805 * linearB;
  const y = 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
  const z = 0.0193 * linearR + 0.1192 * linearG + 0.9505 * linearB;

  // Convert to LMS
  const l = 0.8189 * x + 0.3618 * y - 0.1288 * z;
  const m = 0.0329 * x + 0.9293 * y + 0.0361 * z;
  const s = 0.0482 * x + 0.2621 * y + 0.6839 * z;

  // Convert to OKLab
  const L = 0.2104 * Math.cbrt(l) + 0.7936 * Math.cbrt(m) - 0.0040 * Math.cbrt(s);
  const a = 1.9779 * Math.cbrt(l) - 2.4285 * Math.cbrt(m) + 0.4505 * Math.cbrt(s);
  const b_val = 0.0259 * Math.cbrt(l) + 0.7827 * Math.cbrt(m) - 0.8086 * Math.cbrt(s);

  return [L, a, b_val];
}

/**
 * OKLAB to RGB color space conversion
 */
function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
  // Convert to LMS
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);

  // Convert to XYZ
  const x = 1.2268798733 * l - 0.5578149965 * m + 0.2813910503 * s;
  const y = -0.0405757684 * l + 1.1122868293 * m - 0.0717110612 * s;
  const z = -0.0763729347 * l - 0.4214933399 * m + 1.5869240244 * s;

  // Convert to linear RGB
  const linearR = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  const linearG = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
  const linearB = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

  // Convert to sRGB
  const r = linearR <= 0.0031308 ? 12.92 * linearR : 1.055 * Math.pow(linearR, 1/2.4) - 0.055;
  const g = linearG <= 0.0031308 ? 12.92 * linearG : 1.055 * Math.pow(linearG, 1/2.4) - 0.055;
  const b_out = linearB <= 0.0031308 ? 12.92 * linearB : 1.055 * Math.pow(linearB, 1/2.4) - 0.055;

  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b_out))
  ];
}

/**
 * Apply S-Curve contrast to a value
 */
function applySCurve(value: number, strength: number = 0.3): number {
  return (1 / (1 + Math.exp(-strength * (value - 0.5) * 12))) * 0.98 + 0.01;
}

/**
 * Advanced color temperature adjustment
 */
function adjustColorTemperature(rgba: RGBA, temperature: number): RGBA {
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
function filmHighlightRolloff(value: number, strength: number = 0.7): number {
  if (value <= 0.7) return value;
  const x = (value - 0.7) / 0.3;
  return 0.7 + 0.3 * (1 - Math.pow(1 - x, strength));
}

/**
 * Enhanced shadow recovery
 */
function enhanceShadows(value: number, strength: number = 0.3): number {
  if (value >= 0.3) return value;
  const x = value / 0.3;
  return 0.3 * Math.pow(x, 1 - strength);
}

/**
 * Cross-processed look effect
 */
function applyCrossProcessing(rgba: RGBA, strength: number = 0.5): RGBA {
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
function applySplitTone(
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
function applyFilmicToneMapping(rgba: RGBA, strength: number = 0.8): RGBA {
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
      if (l > 0.7
