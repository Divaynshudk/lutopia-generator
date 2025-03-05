
import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

interface PreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  cubeLutData: string | null;
  fileName: string;
  isProcessing: boolean;
}

export const Preview: React.FC<PreviewProps> = ({
  originalImage,
  processedImage,
  cubeLutData,
  fileName,
  isProcessing,
}) => {
  const [imagesLoaded, setImagesLoaded] = useState({
    original: false,
    processed: false,
  });
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);

  // Reset loaded state when images change
  useEffect(() => {
    setImagesLoaded({ original: false, processed: false });
  }, [originalImage, processedImage]);

  const originalFileName = fileName.split(".")[0] || "image";

  const handleDownloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `${originalFileName}_processed.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadLUT = () => {
    if (!cubeLutData) return;
    
    const blob = new Blob([cubeLutData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${originalFileName}_LUT.cube`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  if (!originalImage && !isProcessing) {
    return null;
  }

  return (
    <div className="w-full animate-slide-up">
      <div className="glass rounded-xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Preview</h2>
          {processedImage && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareMode('side-by-side')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  compareMode === 'side-by-side' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <ChevronLeft className="h-4 w-4 inline" />
                <ChevronRight className="h-4 w-4 inline" />
              </button>
              <button
                onClick={() => setCompareMode('slider')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  compareMode === 'slider' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <span className="text-sm">Slider</span>
              </button>
            </div>
          )}
        </div>
        
        {compareMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Original Image */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Original</span>
              <div className="relative bg-secondary/50 rounded-lg overflow-hidden shadow-subtle">
                {originalImage ? (
                  <div className="w-full" style={{ aspectRatio: imagesLoaded.original ? 'auto' : '16/9' }}>
                    <img
                      src={originalImage}
                      alt="Original"
                      className={cn(
                        "w-full h-auto object-contain image-fade-in",
                        imagesLoaded.original && "loaded"
                      )}
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, original: true }))}
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center">
                    <div className="loader"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Processed Image */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">Processed</span>
              <div className="relative bg-secondary/50 rounded-lg overflow-hidden shadow-subtle">
                {isProcessing ? (
                  <div className="aspect-video w-full flex flex-col items-center justify-center gap-2">
                    <div className="loader"></div>
                    <span className="text-sm text-muted-foreground animate-pulse-gentle">
                      Generating LUT...
                    </span>
                  </div>
                ) : processedImage ? (
                  <div className="w-full" style={{ aspectRatio: imagesLoaded.processed ? 'auto' : '16/9' }}>
                    <img
                      src={processedImage}
                      alt="Processed"
                      className={cn(
                        "w-full h-auto object-contain image-fade-in",
                        imagesLoaded.processed && "loaded"
                      )}
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, processed: true }))}
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center text-muted-foreground">
                    Awaiting generation
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="relative rounded-lg overflow-hidden shadow-subtle bg-secondary/50">
              {originalImage && processedImage ? (
                <div className="relative w-full" style={{ aspectRatio: imagesLoaded.original && imagesLoaded.processed ? 'auto' : '16/9' }}>
                  {/* Original image as background */}
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-auto object-contain"
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, original: true }))}
                  />
                  
                  {/* Processed image with clip-path */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
                    }}
                  >
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full h-auto object-contain"
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, processed: true }))}
                    />
                  </div>
                  
                  {/* Slider line */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                  ></div>
                  
                  {/* Slider labels */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Original
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Processed
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center">
                  <div className="loader"></div>
                </div>
              )}
            </div>
            
            {/* Slider control */}
            {originalImage && processedImage && (
              <div className="mt-4 px-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  className="w-full cursor-pointer"
                />
              </div>
            )}
          </div>
        )}
        
        {processedImage && cubeLutData && (
          <div className="flex flex-col sm:flex-row gap-4 justify-end animate-slide-up">
            <Button 
              onClick={handleDownloadImage}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Image</span>
            </Button>
            <Button 
              onClick={handleDownloadLUT}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download .cube File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
