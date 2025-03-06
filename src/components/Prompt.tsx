
import React, { useState } from "react";
import { Button } from "./Button";
import { useAuth } from "@/contexts/AuthContext";

interface PromptProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const Prompt: React.FC<PromptProps> = ({ onSubmit, isLoading, disabled = false }) => {
  const [prompt, setPrompt] = useState("");
  const { user } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
    }
  };

  const predefinedPrompts = [
    "Autumn woodland style",
    "Golden hour sunset glow",
    "Cinematic teal and orange",
    "Vibrant film look",
    "Warm vintage analog",
    "Muted pastel aesthetic",
    "Rich moody tones",
    "Dreamy soft portrait",
    "Dramatic high contrast",
    "Coffee tone with creamy highlights",
    "Nordic cool blue",
    "Desert warm amber",
    "Forest green nature",
    "Cyberpunk neon style"
  ];
  
  const randomPlaceholder = predefinedPrompts[Math.floor(Math.random() * predefinedPrompts.length)];

  const handlePredefinedPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    if (!isLoading && !disabled) {
      onSubmit(selectedPrompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full animate-slide-up">
      <div className="glass rounded-xl p-4 shadow-subtle">
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="prompt" className="block text-sm font-medium ml-1">
            Describe your desired LUT effect
          </label>
          {!user && (
            <span className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary">
              Sign in to save prompts
            </span>
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
          <Button type="submit" isLoading={isLoading} disabled={!prompt.trim() || disabled}>
            Generate
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 ml-1 mb-3">
          Tip: Be specific about mood, time of day, and color palette for best results
        </p>
        
        {/* Predefined prompt suggestions */}
        <div className="flex flex-wrap gap-2 mt-2">
          {predefinedPrompts.map((predefinedPrompt, index) => (
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
      </div>
    </form>
  );
};
