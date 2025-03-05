
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Home: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play the GIF/video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Auto-play was prevented:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="flex flex-col gap-6 animate-slide-up">
              <div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
                  Transform Your Images with AI-Powered LUTs
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
                  Create stunning visuals with our advanced color grading tool. Generate custom LUTs from natural language descriptions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <Link to="/generator" className="flex items-center gap-2">
                    Try Generator
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <Link to="/trending">
                    Browse Trending LUTs
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-subtle animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <video 
                ref={videoRef}
                src="https://i.imgur.com/YOJTAkk.gif" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full rounded-lg object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered LUT generator transforms your images with custom color grading in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Upload Your Image",
                description: "Start by uploading any image you want to transform with custom color grading",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Describe Your Look",
                description: "Tell our AI what kind of color grading you want using natural language",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                )
              },
              {
                title: "Download & Use",
                description: "Get your processed image and reusable .cube LUT file for other software",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center gap-4 p-6 rounded-xl glass animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="p-3 rounded-full bg-primary/10 mb-2">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
