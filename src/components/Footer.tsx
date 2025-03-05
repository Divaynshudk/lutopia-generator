
import React from "react";
import { Instagram } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/80 border-t border-border py-6">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground text-center md:text-left">
          © {currentYear} Vision Grade. All rights reserved.
        </div>
        
        <a 
          href="https://www.instagram.com/visiongrade" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          aria-label="Follow Vision Grade on Instagram"
        >
          <Instagram className="h-4 w-4" />
          <span>Follow us on Instagram</span>
        </a>
      </div>
    </footer>
  );
};
