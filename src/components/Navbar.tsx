
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 2v8"></path>
            <path d="m4.93 10.93 1.41 1.41"></path>
            <path d="M2 18h2"></path>
            <path d="M20 18h2"></path>
            <path d="m19.07 10.93-1.41 1.41"></path>
            <path d="M22 22H2"></path>
            <path d="m8 22 4-10 4 10"></path>
          </svg>
          <span className="text-xl font-bold tracking-tight">LUTs Generator</span>
        </div>
        <div className="flex gap-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              cn("text-sm font-medium transition-colors hover:text-accent relative py-1.5",
                isActive 
                  ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-accent"
                  : "text-muted-foreground"
              )
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/generator" 
            className={({ isActive }) => 
              cn("text-sm font-medium transition-colors hover:text-accent relative py-1.5",
                isActive 
                  ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-accent"
                  : "text-muted-foreground"
              )
            }
          >
            Generator
          </NavLink>
          <NavLink 
            to="/trending" 
            className={({ isActive }) => 
              cn("text-sm font-medium transition-colors hover:text-accent relative py-1.5",
                isActive 
                  ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-accent"
                  : "text-muted-foreground"
              )
            }
          >
            Trending LUTs
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
