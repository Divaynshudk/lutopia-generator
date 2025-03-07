
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define style templates that can be used as starting points
const styleTemplates = {
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
  }
};

// Function to analyze prompt and extract parameters
function analyzePrompt(prompt: string) {
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
  }
  
  // Apply base style template
  params = { ...params, ...styleTemplates[params.baseStyle] };
  
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
  
  // Film treatments
  if (promptLower.includes("portra") || promptLower.includes("kodak portra")) {
    params.temperature = 0.1;
    params.vibrance = 0.05;
    params.fadeAmount = 0.1;
    params.filmicMapping = 0.6;
    params.splitTone.shadowHue = 0.1;
    params.splitTone.highlightHue = 0.08;
  } else if (promptLower.includes("fuji") || promptLower.includes("fujifilm")) {
    params.vibrance = 0.15;
    params.contrast = 0.25;
    params.splitTone.shadowHue = 0.6;
    params.splitTone.highlightHue = 0.15;
  }
  
  // Validate parameters are within proper ranges
  params.temperature = Math.max(-1, Math.min(1, params.temperature));
  params.contrast = Math.max(0, Math.min(1, params.contrast));
  params.vibrance = Math.max(-1, Math.min(1, params.vibrance));
  params.fadeAmount = Math.max(0, Math.min(1, params.fadeAmount));
  params.filmGrain = Math.max(0, Math.min(1, params.filmGrain));
  params.desaturation = Math.max(0, Math.min(1, params.desaturation));
  params.shadowsBoost = Math.max(-0.5, Math.min(0.5, params.shadowsBoost));
  params.highlightsBoost = Math.max(-0.5, Math.min(0.5, params.highlightsBoost));
  params.filmicMapping = Math.max(0, Math.min(1, params.filmicMapping));
  
  return params;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, image, userId } = await req.json();

    if (!prompt || !image) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: prompt and image are required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create a Supabase client with the Deno runtime
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Analyze the prompt to extract LUT parameters
    const lutParameters = analyzePrompt(prompt);
    
    // Process the image and generate LUT
    // For demonstration purposes, we're using a simplified transformation
    const processedImageUrl = image; // In a real app, this would be transformed
    const cubeLutData = generateEnhancedLUT(lutParameters);

    // Save the prompt to the database if userId is provided
    if (userId) {
      const { error } = await supabaseClient
        .from('lut_prompts')
        .insert({ prompt, user_id: userId });
      
      if (error) {
        console.error("Error saving prompt:", error);
      }
    }

    return new Response(
      JSON.stringify({ 
        processedImageUrl, 
        cubeLutData,
        analyzedParameters: lutParameters 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-lut function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Enhanced LUT generation based on analyzed parameters
function generateEnhancedLUT(params: any): string {
  const lutSize = 8; // Using a small size for the demo
  
  let cubeData = `# Generated LUT based on analyzed parameters\n`;
  cubeData += `# Base style: ${params.baseStyle}\n`;
  cubeData += `LUT_3D_SIZE ${lutSize}\n\n`;
  
  for (let b = 0; b < lutSize; b++) {
    for (let g = 0; g < lutSize; g++) {
      for (let r = 0; r < lutSize; r++) {
        // Normalize to 0-1 range
        let rn = r / (lutSize - 1);
        let gn = g / (lutSize - 1);
        let bn = b / (lutSize - 1);
        
        // Color temperature adjustment
        if (params.temperature > 0) {
          // Warm - increase red, decrease blue
          rn = Math.min(1, rn * (1 + params.temperature * 0.3));
          bn = Math.max(0, bn * (1 - params.temperature * 0.15));
        } else if (params.temperature < 0) {
          // Cool - increase blue, decrease red
          bn = Math.min(1, bn * (1 - params.temperature * 0.3));
          rn = Math.max(0, rn * (1 + params.temperature * 0.15));
        }
        
        // Apply contrast as S-curve
        if (params.contrast > 0) {
          const applySCurve = (value: number): number => {
            // Stronger S-curve for higher contrast
            const strength = params.contrast * 8; 
            return (1 / (1 + Math.exp(-strength * (value - 0.5)))) * 0.98 + 0.01;
          };
          
          rn = applySCurve(rn);
          gn = applySCurve(gn);
          bn = applySCurve(bn);
        }
        
        // Apply vibrance/saturation adjustments
        if (params.vibrance !== 0) {
          // Calculate luminance
          const luminance = 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
          
          // Calculate average of the RGB channels
          const avg = (rn + gn + bn) / 3;
          
          // Adjust saturation based on vibrance parameter
          const satAdjust = params.vibrance * 0.5;
          
          // Apply different saturation adjustments based on luminance and existing saturation
          // Lower saturation pixels get boosted more with positive vibrance
          // Higher saturation pixels get reduced more with negative vibrance
          const distFromGray = Math.abs(rn - avg) + Math.abs(gn - avg) + Math.abs(bn - avg);
          const saturationFactor = 1 + satAdjust * (1 - distFromGray * 2);
          
          rn = luminance + (rn - luminance) * saturationFactor;
          gn = luminance + (gn - luminance) * saturationFactor;
          bn = luminance + (bn - luminance) * saturationFactor;
          
          // Clamp values
          rn = Math.max(0, Math.min(1, rn));
          gn = Math.max(0, Math.min(1, gn));
          bn = Math.max(0, Math.min(1, bn));
        }
        
        // Apply fading effect
        if (params.fadeAmount > 0) {
          // Fading reduces contrast and adds a slight color cast
          const fadeStrength = params.fadeAmount;
          
          // Reduce contrast
          rn = rn * (1 - fadeStrength * 0.5) + fadeStrength * 0.25;
          gn = gn * (1 - fadeStrength * 0.5) + fadeStrength * 0.25;
          bn = bn * (1 - fadeStrength * 0.5) + fadeStrength * 0.25;
          
          // Add slight color cast based on fade type (default to vintage fade)
          rn = rn * (1 + fadeStrength * 0.1);
          bn = bn * (1 - fadeStrength * 0.05);
        }
        
        // Apply shadow and highlight adjustments
        const luminance = 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
        
        if (params.shadowsBoost !== 0 && luminance < 0.5) {
          // Apply shadow adjustment
          const shadowFactor = (0.5 - luminance) * 2; // 0 to 1 strength in shadow areas
          const adjustmentFactor = 1 + params.shadowsBoost * shadowFactor;
          
          rn *= adjustmentFactor;
          gn *= adjustmentFactor;
          bn *= adjustmentFactor;
        }
        
        if (params.highlightsBoost !== 0 && luminance > 0.5) {
          // Apply highlight adjustment
          const highlightFactor = (luminance - 0.5) * 2; // 0 to 1 strength in highlight areas
          const adjustmentFactor = 1 + params.highlightsBoost * highlightFactor;
          
          rn *= adjustmentFactor;
          gn *= adjustmentFactor;
          bn *= adjustmentFactor;
        }
        
        // Apply split toning if enabled
        if (params.splitTone) {
          // Convert RGB to HSL
          const max = Math.max(rn, gn, bn);
          const min = Math.min(rn, gn, bn);
          let h = 0;
          let s = 0;
          const l = (max + min) / 2;
          
          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            if (max === rn) {
              h = (gn - bn) / d + (gn < bn ? 6 : 0);
            } else if (max === gn) {
              h = (bn - rn) / d + 2;
            } else {
              h = (rn - gn) / d + 4;
            }
            
            h /= 6;
          }
          
          // Apply split toning
          let newH = h;
          let newS = s;
          
          if (l < 0.5) {
            // Shadows
            const mixFactor = (0.5 - l) * 2 * params.splitTone.shadowStrength;
            newH = h * (1 - mixFactor) + params.splitTone.shadowHue * mixFactor;
            newS = Math.min(1, s * (1 + params.splitTone.shadowStrength * 0.3));
          } else {
            // Highlights
            const mixFactor = (l - 0.5) * 2 * params.splitTone.highlightStrength;
            newH = h * (1 - mixFactor) + params.splitTone.highlightHue * mixFactor;
            newS = Math.min(1, s * (1 + params.splitTone.highlightStrength * 0.3));
          }
          
          // Convert back to RGB
          // Note: This is a simplified conversion for demonstration
          const hueToRGB = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          
          const q = l < 0.5 ? l * (1 + newS) : l + newS - l * newS;
          const p = 2 * l - q;
          
          rn = hueToRGB(p, q, newH + 1/3);
          gn = hueToRGB(p, q, newH);
          bn = hueToRGB(p, q, newH - 1/3);
        }
        
        // Apply black and white conversion if desaturation is present
        if (params.desaturation > 0) {
          const luminance = 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
          
          rn = rn * (1 - params.desaturation) + luminance * params.desaturation;
          gn = gn * (1 - params.desaturation) + luminance * params.desaturation;
          bn = bn * (1 - params.desaturation) + luminance * params.desaturation;
        }
        
        // Apply filmic tone mapping if enabled
        if (params.filmicMapping > 0) {
          // Simple filmic tone mapping function (approximated ACES curve)
          const filmicToneMap = (x: number): number => {
            const a = 0.15;
            const b = 0.50;
            const c = 0.10;
            const d = 0.20;
            const e = 0.02;
            const f = 0.30;
            
            return (x * (a * x + c * b) + d * e) / (x * (a * x + b) + d * f) - e / f;
          };
          
          // Mix between original and tone-mapped values based on strength
          rn = rn * (1 - params.filmicMapping) + filmicToneMap(rn) * params.filmicMapping;
          gn = gn * (1 - params.filmicMapping) + filmicToneMap(gn) * params.filmicMapping;
          bn = bn * (1 - params.filmicMapping) + filmicToneMap(bn) * params.filmicMapping;
        }
        
        // Ensure values are within 0-1 range
        rn = Math.max(0, Math.min(1, rn));
        gn = Math.max(0, Math.min(1, gn));
        bn = Math.max(0, Math.min(1, bn));
        
        // Add the LUT entry
        cubeData += `${rn.toFixed(6)} ${gn.toFixed(6)} ${bn.toFixed(6)}\n`;
      }
    }
  }
  
  return cubeData;
}
