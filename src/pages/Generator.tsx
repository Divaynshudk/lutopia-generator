
import React, { useState } from "react";
import { UploadArea } from "@/components/UploadArea";
import { Prompt } from "@/components/Prompt";
import { Preview } from "@/components/Preview";
import { processImageWithLUT } from "@/utils/imageProcessor";
import { toast } from "sonner";

const Generator: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [cubeLutData, setCubeLutData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image.jpg");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = (file: File) => {
    setFileName(file.name);
    setProcessedImage(null);
    setCubeLutData(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setOriginalImage(e.target.result as string);
        toast.success("Image uploaded successfully");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read the image file");
    };
    reader.readAsDataURL(file);
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!originalImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    try {
      const { processedImageUrl, cubeLutData } = await processImageWithLUT(originalImage, prompt);
      setProcessedImage(processedImageUrl);
      setCubeLutData(cubeLutData);
      toast.success("LUT applied successfully");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-12">
      <div className="container max-w-5xl px-4 sm:px-6">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create Your LUT</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your images with custom color grading using AI-powered LUTs
          </p>
        </header>
        
        <div className="flex flex-col gap-8">
          <UploadArea 
            onImageUpload={handleImageUpload} 
            className="max-w-2xl mx-auto w-full animate-slide-up"
          />
          
          {originalImage && (
            <Prompt 
              onSubmit={handlePromptSubmit} 
              isLoading={isProcessing}
            />
          )}
          
          <Preview 
            originalImage={originalImage}
            processedImage={processedImage}
            cubeLutData={cubeLutData}
            fileName={fileName}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default Generator;
