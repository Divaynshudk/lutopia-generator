import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Loader2 } from "lucide-react";

interface PromptProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const Prompt: React.FC<PromptProps> = ({ onSubmit, isLoading, disabled = false }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
    }
  };

  // Organized prompt templates by category
  const promptTemplates = {
    cinematic: [
      "Cinematic teal and orange",
      "Hollywood blockbuster look",
      "Cinematic drama with deep contrast",
      "Film noir cinematic style",
      "Sci-fi movie color grade",
    ],
    mood: [
      "Warm and cozy mood",
      "Cool and calm atmosphere",
      "Dramatic moody tones",
      "Dreamy soft aesthetic",
      "Dark and mysterious vibe",
      "Bright and cheerful feel",
    ],
    vintage: [
      "Warm vintage analog",
      "80s film photography",
      "Faded retro look",
      "Classic Kodak Portra emulation",
      "Nostalgic polaroid style",
    ],
    nature: [
      "Autumn woodland style",
      "Golden hour sunset glow",
      "Lush forest greens",
      "Desert warm amber",
      "Nordic cool blue",
      "Ocean breeze tones",
    ],
    modern: [
      "Clean minimal style",
      "Rich vibrant colors",
      "Muted pastel aesthetic",
      "High key bright look",
      "Creamy skin tones for portraits",
      "Fashion magazine style",
    ],
    creative: [
      "Cyberpunk neon style",
      "Cross-processed film effect",
      "Dreamy pastel fantasy",
      "Coffee tone with creamy highlights",
      "Silky smooth black and white",
      "High contrast monochrome",
    ],
  };
  
  // Combine all categories for "all" tab
  const allPrompts = Object.values(promptTemplates).flat();
  
  // Get the relevant prompts based on selected category
  const getPrompts = () => {
    if (selectedCategory === "all") return allPrompts;
    return promptTemplates[selectedCategory as keyof typeof promptTemplates] || [];
  };
  
  const randomPlaceholder = allPrompts[Math.floor(Math.random() * allPrompts.length)];

  const handlePredefinedPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    if (!isLoading && !disabled) {
      onSubmit(selectedPrompt);
    }
  };

  // Tips for better prompts
  const promptTips = [
    "Combine mood words with color preferences (e.g., 'moody blue with warm highlights')",
    "Mention specific film stocks for authentic looks (e.g., 'Kodak Portra 400 style')",
    "Add intensity modifiers (e.g., 'slightly warm' or 'very dramatic')",
    "Refer to times of day for natural lighting (e.g., 'golden hour glow' or 'blue hour calm')",
  ];
  
  // Cycle through tips
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % promptTips.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="w-full animate-slide-up">
      <div className="glass rounded-xl p-4 shadow-subtle">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <label htmlFor="prompt" className="block text-sm font-medium ml-1">
                Describe your desired LUT effect
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full bg-muted p-1 cursor-help">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="text-xs">
                      Our AI understands natural language descriptions. Try combining style words, 
                      color preferences, and moods for the best results.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {!user && (
              <Badge variant="outline" className="text-xs">
                Sign in to save prompts
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`e.g., "${randomPlaceholder}"`}
              disabled={isLoading || disabled}
              className="flex-1 px-4 py-2 rounded-lg bg-background border border-input focus:border-accent focus:ring-1 focus:ring-accent/40 outline-none"
            />
            <Button 
              type="submit" 
              disabled={!prompt.trim() || isLoading || disabled}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2 my-1">
            <span className="font-medium">Tip:</span> {promptTips[currentTipIndex]}
          </div>
          
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mt-2">
            <TabsList className="w-full grid grid-cols-7 mb-2">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="cinematic" className="text-xs">Cinematic</TabsTrigger>
              <TabsTrigger value="mood" className="text-xs">Mood</TabsTrigger>
              <TabsTrigger value="vintage" className="text-xs">Vintage</TabsTrigger>
              <TabsTrigger value="nature" className="text-xs">Nature</TabsTrigger>
              <TabsTrigger value="modern" className="text-xs">Modern</TabsTrigger>
              <TabsTrigger value="creative" className="text-xs">Creative</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-0">
              <div className="flex flex-wrap gap-2 mt-1">
                {getPrompts().map((predefinedPrompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePredefinedPrompt(predefinedPrompt)}
                    disabled={isLoading || disabled}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                  >
                    {predefinedPrompt}
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </form>
  );
};
