
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Updated LUTs data with the provided information
const trendingLUTs = [
  {
    id: "01",
    title: "Colour Kick",
    description: "Give your footage a vibrant boost with this color-enhancing LUT",
    gifUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNno3ZXY3bGxua2NnajU1enRsbWxlaWV3MDlvM2FseDlpdG5xeHZsNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/40IcQ80MxAs16o34Pm/giphy.gif",
    downloadUrl: "https://drive.google.com/file/d/1Z2KGMIn04uIlfZVCBFSUWMU0dwMi3nzn/view?usp=drive_link"
  },
  {
    id: "02",
    title: "Vintage Chrome",
    description: "Create a classic film look with warm tones and subtle fade",
    gifUrl: "https://i.imgur.com/GFH4nlO.gif",
    downloadUrl: "https://drive.google.com/file/d/1qbus8oxdH9LU5MEcFEnsntPISIkhIGLU/view?usp=drive_link"
  },
  {
    id: "03",
    title: "Sea Green Rush",
    description: "Add an aquatic, cool-toned look to your underwater or nature footage",
    gifUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDBvaDk2djhnN2cyZGRqZnM2ZDlkcHV4Y3U4aGx2ZnVrOHRncm9qcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UF4XkF25rVPGDoxhnQ/giphy.gif",
    downloadUrl: "https://drive.google.com/file/d/1Q5gAueNiKWz3SGbeB01lSG88YgC9xci0/view?usp=drive_link"
  },
  {
    id: "04",
    title: "Cinematic Vibe",
    description: "Professional cinema-quality color grading for dramatic scenes",
    gifUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTZiZ2lnM3FlMDBlNzk4Y3ozNzhpb29kMjN4YnB1djVhcWY0cHJtOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oXH2w5ApNGMos93P8g/giphy.gif",
    downloadUrl: "https://drive.google.com/file/d/1g-wVigMrBqpEBKfIV9M-p9Cu3s23jyVi/view?usp=sharing"
  },
  {
    id: "05",
    title: "Teal and Orange",
    description: "The iconic Hollywood blockbuster look with complementary colors",
    gifUrl: "https://i.imgur.com/SU86IUd.gif",
    downloadUrl: "https://drive.google.com/file/d/1YVI7zKlBSHJ61EkqzTOaS0vcf8_uYFsO/view?usp=drive_link"
  },
  {
    id: "06",
    title: "Dark Sunset",
    description: "Golden hour tones with deep shadows for moody atmospheres",
    gifUrl: "https://i.imgur.com/O4sMZuC.gif",
    downloadUrl: "https://drive.google.com/file/d/1zK9N4m95XFXxaoCG-hdpqg8tpk43KZIs/view?usp=sharing"
  },
  {
    id: "07",
    title: "Dark Tone Cinematic",
    description: "Deep shadows and muted highlights for intense storytelling",
    gifUrl: "https://i.imgur.com/NM3Y92Q.gif",
    downloadUrl: "https://drive.google.com/file/d/1VvO7kN742Q3i-Iq2D5IbhisSmraEGY9c/view?usp=drive_link"
  },
  {
    id: "08",
    title: "Sky Blue Highlights",
    description: "Enhance outdoor scenes with vibrant blue skies and natural tones",
    gifUrl: "https://i.imgur.com/tBbRMki.gif",
    downloadUrl: "https://drive.google.com/file/d/1xw6WwRyWdHaa5FnAYuKi05DjHgDMcbfi/view?usp=sharing"
  },
  {
    id: "09",
    title: "Yellow Tinted Cinematic",
    description: "Warm yellow tones for nostalgic and period piece aesthetics",
    gifUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXZwZjAybnhnNHJtc2podWFwd204dmR2Z2tzdnhoNjJsaWJlZGNoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/j3IViD8a2gDUPa3UBF/giphy.gif",
    downloadUrl: "https://drive.google.com/file/d/16Qqubrs5jep0072yTpIalxNU-FtfFXik/view?usp=sharing"
  },
  {
    id: "10",
    title: "Colourise",
    description: "Vibrant color enhancement that brings images to life",
    gifUrl: "https://i.imgur.com/cwia1j8.gif",
    downloadUrl: "https://drive.google.com/file/d/1Hgd0CY0gStUYyXtd45bgwpzTWivxfG6f/view?usp=drive_link"
  },
  {
    id: "11",
    title: "Dark Contrasted",
    description: "High contrast with deep blacks for impactful visuals",
    gifUrl: "https://i.imgur.com/88vSPxo.gif",
    downloadUrl: "https://drive.google.com/file/d/1QNhAMeAw_5MqnFYWTAT9o4URENp1-rqb/view?usp=sharing"
  },
  {
    id: "12",
    title: "Moody Matte",
    description: "Subtle matte finish with muted colors for an artistic look",
    gifUrl: "https://i.imgur.com/OrqeP5I.gif",
    downloadUrl: "https://drive.google.com/file/d/19JQRfR6__n4ZJPluHHTPuLBXpRf3SfCu/view?usp=sharing"
  }
];

const TrendingLUTs: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = (id: string, downloadUrl: string) => {
    console.log(`Downloading LUT with ID: ${id}`);
    window.open(downloadUrl, '_blank');
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Changed to insert into lut_pack_subscribers table instead of newsletter_subscribers
      const { error } = await supabase
        .from('lut_pack_subscribers')
        .insert({ email, name });
      
      if (error) {
        if (error.code === '23505') {
          toast.info("You're already subscribed to our LUTs pack!");
        } else {
          throw error;
        }
      } else {
        toast.success("Thanks for subscribing! You'll receive 100+ LUTs on the 15th of every month.");
        setEmail("");
        setName("");
      }
    } catch (error: any) {
      console.error("Error subscribing to LUTs pack:", error);
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-12">
      <div className="container px-4 md:px-6">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Trending LUTs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make your visuals great with LUTs
          </p>
        </header>
        
        {/* Newsletter subscription form */}
        <div className="mb-16 max-w-3xl mx-auto">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Mail className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Fill the form to get 100+ LUTs on every 15th every month!</h2>
              </div>
              
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Get Free LUTs Every Month"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* LUTs grid */}
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
                  onClick={() => handleDownload(lut.id, lut.downloadUrl)}
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
