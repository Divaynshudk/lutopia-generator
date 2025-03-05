
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Sample trending LUTs data
const trendingLUTs = [
  {
    id: "01",
    title: "Cinematic Orange & Teal",
    description: "The classic Hollywood look with warm highlights and cool shadows",
    gifUrl: "https://i.imgur.com/YOJTAkk.gif",
    downloadUrl: "#"
  },
  {
    id: "02",
    title: "Vintage Film",
    description: "Nostalgic color grading inspired by classic film stock",
    gifUrl: "https://i.imgur.com/YOJTAkk.gif",
    downloadUrl: "#"
  },
  {
    id: "03",
    title: "Moody Blue",
    description: "Cool, atmospheric look perfect for night scenes",
    gifUrl: "https://i.imgur.com/YOJTAkk.gif",
    downloadUrl: "#"
  },
  {
    id: "04",
    title: "Summer Vibes",
    description: "Warm, vibrant colors that enhance outdoor scenes",
    gifUrl: "https://i.imgur.com/YOJTAkk.gif",
    downloadUrl: "#"
  },
  {
    id: "05",
    title: "Black & White Contrast",
    description: "High contrast monochrome for dramatic effect",
    gifUrl: "https://i.imgur.com/YOJTAkk.gif",
    downloadUrl: "#"
  },
  {
    id: "06",
    title: "Pastel Dreams",
    description: "Soft, dreamy colors with subtle pastel tints",
    gifUrl: "https://i.imgur.com/YOJTAkk.gif",
    downloadUrl: "#"
  }
];

const TrendingLUTs: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    console.log(`Downloading LUT with ID: ${id}`);
    // In a real app, this would initiate the download of the .cube file
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-12">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Trending LUTs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download free LUTs created by our community and professionals
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingLUTs.map((lut, index) => (
            <div 
              key={lut.id}
              className="glass rounded-xl overflow-hidden transition-all animate-fade-in hover:shadow-lg"
              style={{ animationDelay: `${0.1 * index}s` }}
              onMouseEnter={() => setHoveredCard(lut.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                <img 
                  src={lut.gifUrl} 
                  alt={lut.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ 
                    transform: hoveredCard === lut.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{lut.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{lut.description}</p>
                <Button 
                  onClick={() => handleDownload(lut.id)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download LUT
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingLUTs;
