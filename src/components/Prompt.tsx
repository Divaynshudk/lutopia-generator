
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

  const placeholderExamples = [
    "Cinematic orange and teal contrast",
    "Warm vintage film look",
    "Cold blue night aesthetic",
    "High contrast black and white",
    "Soft pastel tones"
  ];
  
  const randomPlaceholder = placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)];

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
        <p className="text-xs text-muted-foreground mt-2 ml-1">
          Tip: Be specific about colors, mood, and style for best results
        </p>
      </div>
    </form>
  );
};
