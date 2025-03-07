
import { RGBA, generateCubeLUT, createTransformationFromPrompt, analyzePrompt } from "./lutGenerator";

/**
 * Apply a LUT transformation to an image
 * @param imageUrl The URL of the image to process
 * @param prompt Description of the desired LUT effect
 * @returns Promise with the processed image URL, LUT data, and analyzed parameters
 */
export async function processImageWithLUT(
  imageUrl: string,
  prompt: string
): Promise<{ 
  processedImageUrl: string; 
  cubeLutData: string;
  analyzedParameters?: any;
}> {
  return new Promise((resolve, reject) => {
    try {
      // Call the Supabase Edge Function for LUT generation
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lut`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          prompt,
          image: imageUrl,
          userId: null // This will be set by the server if the user is authenticated
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Process the image locally using the LUT data from the server
        applyLutToImage(imageUrl, data.cubeLutData).then(processedImageUrl => {
          resolve({
            processedImageUrl,
            cubeLutData: data.cubeLutData,
            analyzedParameters: data.analyzedParameters
          });
        });
      })
      .catch(error => {
        console.error("Error calling LUT generator function:", error);
        
        // Fallback to local processing if the function call fails
        console.log("Falling back to local LUT processing...");
        
        // Load the image
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = () => {
          // Use the local transformation method
          const transformFn = createTransformationFromPrompt(prompt);
          const cubeLutData = generateCubeLUT(transformFn);
          
          // Create a canvas to process the image
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Apply the transformation to each pixel
          for (let i = 0; i < pixels.length; i += 4) {
            const originalPixel: RGBA = {
              r: pixels[i] / 255,
              g: pixels[i + 1] / 255,
              b: pixels[i + 2] / 255,
              a: pixels[i + 3] / 255,
            };
            
            const transformedPixel = transformFn(originalPixel);
            
            pixels[i] = Math.round(transformedPixel.r * 255);     // R
            pixels[i + 1] = Math.round(transformedPixel.g * 255); // G
            pixels[i + 2] = Math.round(transformedPixel.b * 255); // B
            // Alpha channel remains unchanged
          }
          
          // Put the processed image data back on the canvas
          ctx.putImageData(imageData, 0, 0);
          
          // Convert canvas to data URL
          const processedImageUrl = canvas.toDataURL("image/png");
          
          // Return the processed image URL and LUT data
          resolve({ 
            processedImageUrl, 
            cubeLutData 
          });
        };
        
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Apply a LUT to an image
 * This function will parse the CUBE LUT file data and apply it to an image
 */
async function applyLutToImage(
  imageUrl: string,
  cubeLutData: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Parse the CUBE LUT file
      const lutSize = parseLutSize(cubeLutData);
      const lutData = parseLutData(cubeLutData, lutSize);
      
      // Load the image
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        // Create a canvas to process the image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Apply the LUT to each pixel
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i] / 255;
          const g = pixels[i + 1] / 255;
          const b = pixels[i + 2] / 255;
          
          // Apply the LUT
          const transformedColor = applyLut(r, g, b, lutData, lutSize);
          
          pixels[i] = Math.round(transformedColor.r * 255);     // R
          pixels[i + 1] = Math.round(transformedColor.g * 255); // G
          pixels[i + 2] = Math.round(transformedColor.b * 255); // B
          // Alpha channel remains unchanged
        }
        
        // Put the processed image data back on the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to data URL
        const processedImageUrl = canvas.toDataURL("image/png");
        
        // Return the processed image URL
        resolve(processedImageUrl);
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      
      img.src = imageUrl;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Parse the size of the LUT from the CUBE file data
 */
function parseLutSize(cubeData: string): number {
  const sizeMatch = cubeData.match(/LUT_3D_SIZE\s+(\d+)/i);
  if (sizeMatch && sizeMatch[1]) {
    return parseInt(sizeMatch[1], 10);
  }
  return 8; // Default size if not found
}

/**
 * Parse the LUT data from the CUBE file data
 */
function parseLutData(cubeData: string, lutSize: number): number[][][] {
  // Initialize a 3D array for the LUT data
  const lutData: number[][][] = new Array(lutSize);
  for (let i = 0; i < lutSize; i++) {
    lutData[i] = new Array(lutSize);
    for (let j = 0; j < lutSize; j++) {
      lutData[i][j] = new Array(lutSize);
      for (let k = 0; k < lutSize; k++) {
        lutData[i][j][k] = [0, 0, 0];
      }
    }
  }
  
  // Parse the CUBE data - Skip comments and header
  const lines = cubeData.split('\n').filter(line => 
    line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('LUT_3D_SIZE')
  );
  
  // Each line contains R G B values
  let index = 0;
  for (let b = 0; b < lutSize; b++) {
    for (let g = 0; g < lutSize; g++) {
      for (let r = 0; r < lutSize; r++) {
        if (index < lines.length) {
          const rgbValues = lines[index].trim().split(/\s+/).map(parseFloat);
          if (rgbValues.length >= 3) {
            lutData[r][g][b] = [rgbValues[0], rgbValues[1], rgbValues[2]];
          }
          index++;
        }
      }
    }
  }
  
  return lutData;
}

/**
 * Apply a LUT to a single color value using trilinear interpolation
 */
function applyLut(r: number, g: number, b: number, lutData: number[][][], lutSize: number): RGBA {
  // Scale the input values to the LUT indices
  const rScaled = r * (lutSize - 1);
  const gScaled = g * (lutSize - 1);
  const bScaled = b * (lutSize - 1);
  
  // Get the eight surrounding points in the LUT
  const r0 = Math.floor(rScaled);
  const r1 = Math.min(r0 + 1, lutSize - 1);
  const g0 = Math.floor(gScaled);
  const g1 = Math.min(g0 + 1, lutSize - 1);
  const b0 = Math.floor(bScaled);
  const b1 = Math.min(b0 + 1, lutSize - 1);
  
  // Calculate the interpolation factors
  const rFrac = rScaled - r0;
  const gFrac = gScaled - g0;
  const bFrac = bScaled - b0;
  
  // Perform trilinear interpolation
  const c000 = lutData[r0][g0][b0];
  const c001 = lutData[r0][g0][b1];
  const c010 = lutData[r0][g1][b0];
  const c011 = lutData[r0][g1][b1];
  const c100 = lutData[r1][g0][b0];
  const c101 = lutData[r1][g0][b1];
  const c110 = lutData[r1][g1][b0];
  const c111 = lutData[r1][g1][b1];
  
  const c00 = interpolate(c000, c001, bFrac);
  const c01 = interpolate(c010, c011, bFrac);
  const c10 = interpolate(c100, c101, bFrac);
  const c11 = interpolate(c110, c111, bFrac);
  
  const c0 = interpolate(c00, c01, gFrac);
  const c1 = interpolate(c10, c11, gFrac);
  
  const c = interpolate(c0, c1, rFrac);
  
  return {
    r: Math.max(0, Math.min(1, c[0])),
    g: Math.max(0, Math.min(1, c[1])),
    b: Math.max(0, Math.min(1, c[2])),
    a: 1
  };
}

/**
 * Linear interpolation between two points
 */
function interpolate(a: number[], b: number[], t: number): number[] {
  return [
    a[0] * (1 - t) + b[0] * t,
    a[1] * (1 - t) + b[1] * t,
    a[2] * (1 - t) + b[2] * t
  ];
}
