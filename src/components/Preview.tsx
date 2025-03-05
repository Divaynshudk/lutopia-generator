
import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

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

  if (!originalImage && !isProcessing) {
    return null;
  }

  return (
    <div className="w-full animate-slide-up">
      <div className="glass rounded-xl p-6 shadow-subtle">
        <h2 className="text-xl font-medium mb-4">Preview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Original Image */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">Original</span>
            <div className="relative aspect-video bg-secondary/50 rounded-lg overflow-hidden">
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="Original"
                  className={cn(
                    "w-full h-full object-cover image-fade-in",
                    imagesLoaded.original && "loaded"
                  )}
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, original: true }))}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="loader"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Processed Image */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">Processed</span>
            <div className="relative aspect-video bg-secondary/50 rounded-lg overflow-hidden">
              {isProcessing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="loader"></div>
                  <span className="text-sm text-muted-foreground animate-pulse-gentle">
                    Generating LUT...
                  </span>
                </div>
              ) : processedImage ? (
                <img
                  src={processedImage}
                  alt="Processed"
                  className={cn(
                    "w-full h-full object-cover image-fade-in",
                    imagesLoaded.processed && "loaded"
                  )}
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, processed: true }))}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Awaiting generation
                </div>
              )}
            </div>
          </div>
        </div>
        
        {processedImage && cubeLutData && (
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button 
              onClick={handleDownloadImage}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download Image</span>
            </Button>
            <Button 
              onClick={handleDownloadLUT}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download .cube File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
