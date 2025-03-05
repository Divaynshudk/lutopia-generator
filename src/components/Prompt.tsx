
import React, { useState } from "react";
import { Button } from "./Button";

interface PromptProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const Prompt: React.FC<PromptProps> = ({ onSubmit, isLoading, disabled = false }) => {
  const [prompt, setPrompt] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
    }
  };

  const predefinedPrompts = [
    "Coffee tone",
    "Cinematic orange and teal",
    "Warm vintage film look",
    "Cold blue night aesthetic",
    "High contrast black and white",
    "Soft pastel tones",
    "Moody dark shadows",
    "Summer vibrant colors",
    "Cyberpunk neon glow"
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
        <label htmlFor="prompt" className="block text-sm font-medium mb-2 ml-1">
          Describe your desired LUT effect
        </label>
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
          Tip: Be specific about colors, mood, and style for best results
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
