
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadArea } from "@/components/UploadArea";
import { Prompt } from "@/components/Prompt";
import { Preview } from "@/components/Preview";
import { processImageWithLUT } from "@/utils/imageProcessor";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Generator: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [cubeLutData, setCubeLutData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("image.jpg");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
  const [analyzedParameters, setAnalyzedParameters] = useState<any | null>(null);
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
    setAnalyzedParameters(null);
    
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
      const response = await processImageWithLUT(originalImage, prompt);
      setProcessedImage(response.processedImageUrl);
      setCubeLutData(response.cubeLutData);
      setAnalyzedParameters(response.analyzedParameters);
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
  
  // Format parameter value for display
  const formatParameterValue = (value: number): string => {
    if (typeof value !== 'number') return 'N/A';
    
    // Convert value to percentage or descriptive term based on range
    if (value >= -1 && value <= 1) {
      const percentage = Math.round(value * 100);
      if (percentage === 0) return "Neutral (0%)";
      return `${percentage > 0 ? '+' : ''}${percentage}%`;
    }
    
    return value.toFixed(2);
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
              
              {analyzedParameters && (
                <Card className="mt-4 animate-fade-in">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span>LUT Parameters</span>
                      <Badge variant="outline" className="text-xs font-normal">
                        {analyzedParameters.baseStyle}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      AI-generated parameters based on your prompt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="color-adjustments">
                        <AccordionTrigger className="text-sm font-medium">Color Adjustments</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium">Temperature</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.temperature)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Vibrance</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.vibrance)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Contrast</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.contrast)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Fade Amount</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.fadeAmount)}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="tonal-adjustments">
                        <AccordionTrigger className="text-sm font-medium">Tonal Adjustments</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium">Shadows</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.shadowsBoost)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Highlights</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.highlightsBoost)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Filmic Mapping</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.filmicMapping)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Desaturation</p>
                              <p className="text-muted-foreground">
                                {formatParameterValue(analyzedParameters.desaturation)}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="split-toning">
                        <AccordionTrigger className="text-sm font-medium">Split Toning</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium">Shadow Toning</p>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ 
                                    backgroundColor: `hsl(${analyzedParameters.splitTone.shadowHue * 360}, 70%, 50%)` 
                                  }}
                                />
                                <p className="text-muted-foreground">
                                  {(analyzedParameters.splitTone.shadowHue * 360).toFixed(0)}° / 
                                  {(analyzedParameters.splitTone.shadowStrength * 100).toFixed(0)}%
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Highlight Toning</p>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ 
                                    backgroundColor: `hsl(${analyzedParameters.splitTone.highlightHue * 360}, 70%, 50%)` 
                                  }}
                                />
                                <p className="text-muted-foreground">
                                  {(analyzedParameters.splitTone.highlightHue * 360).toFixed(0)}° / 
                                  {(analyzedParameters.splitTone.highlightStrength * 100).toFixed(0)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              )}
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
