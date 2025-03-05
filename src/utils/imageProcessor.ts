import { RGBA, generateCubeLUT, createTransformationFromPrompt } from "./lutGenerator";

/**
 * Apply a LUT transformation to an image
 * @param imageUrl The URL of the image to process
 * @param prompt Description of the desired LUT effect
 * @returns Promise with the processed image URL and LUT data
 */
export async function processImageWithLUT(
  imageUrl: string,
  prompt: string
): Promise<{ processedImageUrl: string; cubeLutData: string }> {
  return new Promise((resolve, reject) => {
    try {
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
        
        // Create transformation function based on the prompt
        const transformFn = createTransformationFromPrompt(prompt);
        
        // Generate the CUBE LUT file
        const cubeLutData = generateCubeLUT(transformFn);
        
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
        resolve({ processedImageUrl, cubeLutData });
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
