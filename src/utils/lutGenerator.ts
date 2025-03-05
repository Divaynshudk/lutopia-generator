
// Simplified LUT generator for the first version
// In a real app, this would be connected to a more sophisticated backend

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

// LUT dimensions (typically either 32x32x32 or 64x64x64)
const LUT_SIZE = 32;

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
 * Apply a simple color transformation based on a text prompt (simplified for demo)
 * In a real app, this would use AI or more sophisticated algorithms
 */
export function createTransformationFromPrompt(prompt: string): (rgba: RGBA) => RGBA {
  const promptLower = prompt.toLowerCase();
  
  // Basic prompt analysis (simplified for this version)
  const isCinematic = promptLower.includes('cinematic');
  const isWarm = promptLower.includes('warm');
  const isCold = promptLower.includes('cold') || promptLower.includes('blue');
  const isVintage = promptLower.includes('vintage') || promptLower.includes('film');
  const isHighContrast = promptLower.includes('contrast');
  const isBW = promptLower.includes('black and white') || promptLower.includes('b&w');
  const isTeal = promptLower.includes('teal');
  const isOrange = promptLower.includes('orange');
  const isPastel = promptLower.includes('pastel');
  
  // Return a transformation function based on the prompt
  return (rgba: RGBA): RGBA => {
    let result = { ...rgba };
    
    // Basic transformations
    if (isWarm) {
      result.r = Math.min(1, result.r * 1.1);
      result.g = Math.min(1, result.g * 1.05);
      result.b = Math.max(0, result.b * 0.9);
    }
    
    if (isCold) {
      result.r = Math.max(0, result.r * 0.85);
      result.g = Math.max(0, result.g * 0.95);
      result.b = Math.min(1, result.b * 1.2);
    }
    
    if (isVintage) {
      // Vintage film look
      result.r = Math.min(1, result.r * 1.08);
      result.g = Math.min(1, result.g * 0.93);
      result.b = Math.max(0, result.b * 0.87);
      
      // Add slight fading
      result.r = 0.9 * result.r + 0.1;
      result.g = 0.9 * result.g + 0.08;
      result.b = 0.85 * result.b + 0.07;
    }
    
    if (isCinematic) {
      // Enhance shadows and highlights for cinematic look
      if (result.r < 0.5) result.r = result.r * 0.85;
      else result.r = 0.85 * result.r + 0.15;
      
      if (result.g < 0.5) result.g = result.g * 0.85;
      else result.g = 0.85 * result.g + 0.15;
      
      if (result.b < 0.5) result.b = result.b * 0.85;
      else result.b = 0.85 * result.b + 0.15;
    }
    
    if (isTeal && isOrange) {
      // Orange and teal look (popular in cinema)
      const luminance = 0.2126 * result.r + 0.7152 * result.g + 0.0722 * result.b;
      
      if (luminance < 0.5) {
        // Shadows to teal
        result.r = Math.max(0, result.r * 0.75);
        result.g = Math.min(1, result.g * 1.05);
        result.b = Math.min(1, result.b * 1.3);
      } else {
        // Highlights to orange
        result.r = Math.min(1, result.r * 1.2);
        result.g = Math.min(1, result.g * 0.95);
        result.b = Math.max(0, result.b * 0.75);
      }
    }
    
    if (isHighContrast) {
      // Increase contrast
      result.r = result.r > 0.5 ? Math.min(1, result.r * 1.2) : Math.max(0, result.r * 0.8);
      result.g = result.g > 0.5 ? Math.min(1, result.g * 1.2) : Math.max(0, result.g * 0.8);
      result.b = result.b > 0.5 ? Math.min(1, result.b * 1.2) : Math.max(0, result.b * 0.8);
    }
    
    if (isBW) {
      // Convert to black and white
      const bw = 0.299 * result.r + 0.587 * result.g + 0.114 * result.b;
      result.r = bw;
      result.g = bw;
      result.b = bw;
      
      if (isHighContrast) {
        // High contrast B&W
        result.r = result.r > 0.5 ? Math.min(1, result.r * 1.3) : Math.max(0, result.r * 0.7);
        result.g = result.g > 0.5 ? Math.min(1, result.g * 1.3) : Math.max(0, result.g * 0.7);
        result.b = result.b > 0.5 ? Math.min(1, result.b * 1.3) : Math.max(0, result.b * 0.7);
      }
    }
    
    if (isPastel) {
      // Pastel look - soften and shift towards pastel colors
      result.r = 0.8 * result.r + 0.2;
      result.g = 0.8 * result.g + 0.2;
      result.b = 0.8 * result.b + 0.2;
    }
    
    return result;
  };
}
