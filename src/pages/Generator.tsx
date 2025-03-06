
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadArea } from "@/components/UploadArea";
import { Prompt } from "@/components/Prompt";
import { Preview } from "@/components/Preview";
import { processImageWithLUT } from "@/utils/imageProcessor";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Generator: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [cubeLutData, setCubeLutData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image.jpg");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's saved prompts if logged in
    if (user) {
      fetchSavedPrompts();
    }
  }, [user]);

  const fetchSavedPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('lut_prompts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSavedPrompts(data || []);
    } catch (error) {
      console.error('Error fetching saved prompts:', error);
    }
  };

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
      // Process the image with the LUT
      const { processedImageUrl, cubeLutData } = await processImageWithLUT(originalImage, prompt);
      setProcessedImage(processedImageUrl);
      setCubeLutData(cubeLutData);
      toast.success("LUT applied successfully");
      
      // Save the prompt if user is logged in
      if (user) {
        await supabase
          .from('lut_prompts')
          .insert({ prompt, user_id: user.id });
        
        // Refresh saved prompts
        fetchSavedPrompts();
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseExistingPrompt = (prompt: string) => {
    handlePromptSubmit(prompt);
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
        
        <Tabs defaultValue="generate" className="mb-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="generate">Generate LUT</TabsTrigger>
            <TabsTrigger value="history" disabled={!user}>
              Your Prompts {!user && "(Sign in)"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            {user ? (
              savedPrompts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {savedPrompts.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-3">{item.prompt}</p>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleUseExistingPrompt(item.prompt)}
                        >
                          Use This Prompt
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't created any LUTs yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/generator')}
                  >
                    Create Your First LUT
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Please sign in to save and view your prompts</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Generator;
