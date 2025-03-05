
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://i.imgur.com/JgWvscq.png"
            alt="Vision Grade Logo"
            className="h-10 w-auto"
          />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center p-2 text-gray-500 hover:text-primary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-6">
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

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 bg-background animate-fade-in">
          <div className="flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                cn("text-sm font-medium transition-colors hover:text-accent py-2 px-4 rounded-md",
                  isActive 
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                )
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/generator" 
              className={({ isActive }) => 
                cn("text-sm font-medium transition-colors hover:text-accent py-2 px-4 rounded-md",
                  isActive 
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                )
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Generator
            </NavLink>
            <NavLink 
              to="/trending" 
              className={({ isActive }) => 
                cn("text-sm font-medium transition-colors hover:text-accent py-2 px-4 rounded-md",
                  isActive 
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                )
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Trending LUTs
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};
