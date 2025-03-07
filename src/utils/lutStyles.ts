
/**
 * Style templates and prompt analysis for LUT generation
 */

// Define style templates that can be used as starting points
export const styleTemplates = {
  cinematic: {
    description: "Filmic look with teal-orange color grading",
    splitTone: {
      shadowHue: 0.5,  // Teal shadows
      shadowStrength: 0.4,
      highlightHue: 0.08, // Orange highlights
      highlightStrength: 0.5,
    },
    contrast: 0.4,
    temperature: 0.1,
    vibrance: 0.2,
    filmicMapping: 0.8,
  },
  warm: {
    description: "Warm, golden tones",
    temperature: 0.5,
    splitTone: {
      shadowHue: 0.08,
      shadowStrength: 0.3,
      highlightHue: 0.11,
      highlightStrength: 0.4,
    },
    vibrance: 0.1,
    contrast: 0.2,
    filmicMapping: 0.5,
  },
  cool: {
    description: "Cool, blue tones",
    temperature: -0.5,
    splitTone: {
      shadowHue: 0.6,
      shadowStrength: 0.4,
      highlightHue: 0.6,
      highlightStrength: 0.2,
    },
    vibrance: 0.1,
    contrast: 0.3,
    filmicMapping: 0.5,
  },
  vintage: {
    description: "Aged film look with faded colors",
    temperature: 0.2,
    vibrance: -0.2,
    contrast: 0.1,
    fadeAmount: 0.3,
    filmGrain: 0.2,
    filmicMapping: 0.7,
    splitTone: {
      shadowHue: 0.07,
      shadowStrength: 0.2,
      highlightHue: 0.1,
      highlightStrength: 0.3,
    },
  },
  moody: {
    description: "Dark, dramatic look",
    contrast: 0.5,
    temperature: -0.1,
    vibrance: 0.05,
    fadeAmount: -0.1,
    splitTone: {
      shadowHue: 0.6,
      shadowStrength: 0.4,
      highlightHue: 0.05,
      highlightStrength: 0.2,
    },
    shadowsBoost: -0.15,
    filmicMapping: 0.7,
  },
  vibrant: {
    description: "Bright, saturated colors",
    vibrance: 0.5,
    contrast: 0.3,
    temperature: 0.1,
    splitTone: {
      shadowHue: 0.6,
      shadowStrength: 0.2,
      highlightHue: 0.1,
      highlightStrength: 0.3,
    },
    filmicMapping: 0.4,
  },
  bw: {
    description: "Black and white with contrast",
    desaturation: 1.0,
    contrast: 0.4,
    filmicMapping: 0.6,
  },
  autumnWoodland: {
    description: "Warm autumn tones with golden highlights",
    temperature: 0.6,
    contrast: 0.4,
    vibrance: 0.2,
    splitTone: {
      shadowHue: 0.08, // Amber shadows
      shadowStrength: 0.4,
      highlightHue: 0.11, // Golden highlights
      highlightStrength: 0.6,
    },
    filmicMapping: 0.7,
  },
  bluehour: {
    description: "Cool twilight tones",
    temperature: -0.4,
    vibrance: 0.1,
    contrast: 0.3,
    splitTone: {
      shadowHue: 0.6, // Deep blue shadows
      shadowStrength: 0.5,
      highlightHue: 0.55, // Lighter blue highlights
      highlightStrength: 0.3,
    },
    filmicMapping: 0.6,
  },
  summery: {
    description: "Bright, vibrant summer tones",
    temperature: 0.3,
    vibrance: 0.3,
    contrast: 0.25,
    splitTone: {
      shadowHue: 0.1, // Warm shadows
      shadowStrength: 0.2,
      highlightHue: 0.15, // Sunny highlights
      highlightStrength: 0.3,
    },
    filmicMapping: 0.5,
  },
  portra: {
    description: "Kodak Portra film emulation",
    temperature: 0.1,
    vibrance: 0.05,
    contrast: 0.2,
    fadeAmount: 0.1,
    splitTone: {
      shadowHue: 0.1,
      shadowStrength: 0.2,
      highlightHue: 0.08,
      highlightStrength: 0.3,
    },
    filmicMapping: 0.6,
  },
  fujichrome: {
    description: "Fuji film emulation with vibrant colors",
    temperature: 0.05,
    vibrance: 0.15,
    contrast: 0.25,
    splitTone: {
      shadowHue: 0.6,
      shadowStrength: 0.2,
      highlightHue: 0.15,
      highlightStrength: 0.3,
    },
    filmicMapping: 0.5,
  }
};

/**
 * Analyze a prompt to determine LUT parameters
 */
export function analyzePrompt(prompt: string) {
  const promptLower = prompt.toLowerCase();
  
  // Initialize parameters with default values
  let params = {
    baseStyle: "cinematic", // Default style template
    temperature: 0, // Color temperature (-1 to 1)
    contrast: 0.2, // Contrast adjustment (0 to 1)
    vibrance: 0.1, // Saturation/vibrance adjustment (-1 to 1)
    fadeAmount: 0, // Fade effect (0 to 1)
    filmGrain: 0, // Film grain effect (0 to 1)
    desaturation: 0, // Desaturation amount (0 to 1)
    shadowsBoost: 0, // Shadow level adjustment (-1 to 1)
    highlightsBoost: 0, // Highlight level adjustment (-1 to 1)
    splitTone: {
      shadowHue: 0.5, // Hue for shadows (0 to 1)
      shadowStrength: 0.3, // Strength of shadow toning (0 to 1)
      highlightHue: 0.1, // Hue for highlights (0 to 1)
      highlightStrength: 0.3, // Strength of highlight toning (0 to 1)
    },
    filmicMapping: 0.5, // Filmic tone mapping strength (0 to 1)
  };
  
  // Primary style detection (overrides base parameters)
  if (promptLower.includes("cinematic") || promptLower.includes("film look") || promptLower.includes("movie")) {
    params.baseStyle = "cinematic";
  } else if (promptLower.includes("vintage") || promptLower.includes("retro") || promptLower.includes("old") || promptLower.includes("film")) {
    params.baseStyle = "vintage";
  } else if (promptLower.includes("moody") || promptLower.includes("dramatic") || promptLower.includes("dark")) {
    params.baseStyle = "moody";
  } else if (promptLower.includes("vibrant") || promptLower.includes("saturated") || promptLower.includes("colorful")) {
    params.baseStyle = "vibrant";
  } else if (promptLower.includes("warm") || promptLower.includes("golden") || promptLower.includes("sunset")) {
    params.baseStyle = "warm";
  } else if (promptLower.includes("cool") || promptLower.includes("cold") || promptLower.includes("blue")) {
    params.baseStyle = "cool";
  } else if (promptLower.includes("black and white") || promptLower.includes("b&w") || promptLower.includes("monochrome")) {
    params.baseStyle = "bw";
  } else if (promptLower.includes("autumn") || promptLower.includes("fall") || promptLower.includes("woodland")) {
    params.baseStyle = "autumnWoodland";
  } else if (promptLower.includes("blue hour") || promptLower.includes("twilight")) {
    params.baseStyle = "bluehour";
  } else if (promptLower.includes("summer") || promptLower.includes("sunny") || promptLower.includes("bright")) {
    params.baseStyle = "summery";
  } else if (promptLower.includes("portra") || promptLower.includes("kodak portra")) {
    params.baseStyle = "portra";
  } else if (promptLower.includes("fuji") || promptLower.includes("fujifilm") || promptLower.includes("fujichrome")) {
    params.baseStyle = "fujichrome";
  }
  
  // Apply base style template
  params = { ...params, ...styleTemplates[params.baseStyle as keyof typeof styleTemplates] };
  
  // Secondary adjustments based on keywords (can fine-tune the base style)
  
  // Temperature adjustments
  if (promptLower.includes("warmer") || promptLower.includes("more warm")) {
    params.temperature += 0.2;
  } else if (promptLower.includes("cooler") || promptLower.includes("more cool")) {
    params.temperature -= 0.2;
  }
  
  // Contrast adjustments
  if (promptLower.includes("more contrast") || promptLower.includes("higher contrast") || promptLower.includes("contrasty")) {
    params.contrast += 0.2;
  } else if (promptLower.includes("less contrast") || promptLower.includes("lower contrast") || promptLower.includes("soft")) {
    params.contrast -= 0.1;
  }
  
  // Saturation/vibrance adjustments
  if (promptLower.includes("more saturated") || promptLower.includes("vibrant") || promptLower.includes("colorful")) {
    params.vibrance += 0.2;
  } else if (promptLower.includes("less saturated") || promptLower.includes("desaturated") || promptLower.includes("muted")) {
    params.vibrance -= 0.2;
  }
  
  // Fading effect
  if (promptLower.includes("faded") || promptLower.includes("matte")) {
    params.fadeAmount += 0.2;
  }
  
  // Shadow and highlight adjustments
  if (promptLower.includes("darker shadows") || promptLower.includes("deep shadows")) {
    params.shadowsBoost -= 0.15;
  } else if (promptLower.includes("lighter shadows") || promptLower.includes("lifted shadows")) {
    params.shadowsBoost += 0.15;
  }
  
  if (promptLower.includes("brighter highlights") || promptLower.includes("bright highlights")) {
    params.highlightsBoost += 0.15;
  } else if (promptLower.includes("dimmer highlights") || promptLower.includes("reduced highlights")) {
    params.highlightsBoost -= 0.15;
  }
  
  // Specific color treatments
  if (promptLower.includes("teal and orange") || promptLower.includes("orange and teal")) {
    params.splitTone.shadowHue = 0.5; // Teal
    params.splitTone.highlightHue = 0.08; // Orange
    params.splitTone.shadowStrength = 0.4;
    params.splitTone.highlightStrength = 0.5;
  }
  
  // Validate parameters are within proper ranges
  params.temperature = Math.max(-1, Math.min(1, params.temperature));
  params.contrast = Math.max(0, Math.min(1, params.contrast));
  params.vibrance = Math.max(-1, Math.min(1, params.vibrance));
  params.fadeAmount = Math.max(0, Math.min(1, params.fadeAmount || 0));
  params.filmGrain = Math.max(0, Math.min(1, params.filmGrain || 0));
  params.desaturation = Math.max(0, Math.min(1, params.desaturation || 0));
  params.shadowsBoost = Math.max(-0.5, Math.min(0.5, params.shadowsBoost));
  params.highlightsBoost = Math.max(-0.5, Math.min(0.5, params.highlightsBoost));
  params.filmicMapping = Math.max(0, Math.min(1, params.filmicMapping));
  
  return params;
}
