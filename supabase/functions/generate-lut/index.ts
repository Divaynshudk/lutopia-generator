
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Process the image and generate LUT
    // Note: this is a simplified version, the actual AI processing would be implemented here
    
    // For demonstration purposes, we're using a basic transformation
    // In a real implementation, this would use a more sophisticated AI model
    const processedImageUrl = image; // In a real app, this would be transformed
    const cubeLutData = generateDummyLUT(prompt);

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
        cubeLutData 
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

// Placeholder function for generating a basic LUT
// In a real implementation, this would be more sophisticated
function generateDummyLUT(prompt: string): string {
  const lowercasePrompt = prompt.toLowerCase();
  const lutSize = 8; // Using a small size for the demo
  
  let cubeData = `# Generated LUT based on prompt: ${prompt}\n`;
  cubeData += `LUT_3D_SIZE ${lutSize}\n\n`;
  
  // Basic color shifts based on prompt keywords
  const isWarm = lowercasePrompt.includes('warm') || lowercasePrompt.includes('golden');
  const isCool = lowercasePrompt.includes('cool') || lowercasePrompt.includes('blue');
  const isVintage = lowercasePrompt.includes('vintage') || lowercasePrompt.includes('film');
  const isVibrant = lowercasePrompt.includes('vibrant') || lowercasePrompt.includes('saturated');
  
  for (let b = 0; b < lutSize; b++) {
    for (let g = 0; g < lutSize; g++) {
      for (let r = 0; r < lutSize; r++) {
        // Normalize to 0-1 range
        let rn = r / (lutSize - 1);
        let gn = g / (lutSize - 1);
        let bn = b / (lutSize - 1);
        
        // Apply simple adjustments based on prompt
        if (isWarm) {
          rn = Math.min(1, rn * 1.2);
          bn = Math.max(0, bn * 0.9);
        } else if (isCool) {
          rn = Math.max(0, rn * 0.9);
          bn = Math.min(1, bn * 1.1);
        }
        
        if (isVintage) {
          // Add a bit of a faded look
          rn = rn * 0.9 + 0.1;
          gn = gn * 0.9 + 0.08;
          bn = bn * 0.8 + 0.05;
        }
        
        if (isVibrant) {
          // Boost saturation by pushing colors away from gray
          const avg = (rn + gn + bn) / 3;
          rn = rn + (rn - avg) * 0.3;
          gn = gn + (gn - avg) * 0.3;
          bn = bn + (bn - avg) * 0.3;
          
          // Clamp values
          rn = Math.max(0, Math.min(1, rn));
          gn = Math.max(0, Math.min(1, gn));
          bn = Math.max(0, Math.min(1, bn));
        }
        
        // Add the LUT entry
        cubeData += `${rn.toFixed(6)} ${gn.toFixed(6)} ${bn.toFixed(6)}\n`;
      }
    }
  }
  
  return cubeData;
}
