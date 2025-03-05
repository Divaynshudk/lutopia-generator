
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Home: React.FC = () => {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const sfxVideoRef = useRef<HTMLVideoElement>(null);
  const trendingVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fix for GIF/video autoplay
    const playVideos = async () => {
      try {
        if (heroVideoRef.current) {
          heroVideoRef.current.play().catch(error => {
            console.error("Hero video autoplay prevented:", error);
          });
        }
        if (sfxVideoRef.current) {
          sfxVideoRef.current.play().catch(error => {
            console.error("SFX video autoplay prevented:", error);
          });
        }
        if (trendingVideoRef.current) {
          trendingVideoRef.current.play().catch(error => {
            console.error("Trending video autoplay prevented:", error);
          });
        }
      } catch (error) {
        console.error("Error playing videos:", error);
      }
    };

    playVideos();
  }, []);

  const faqs = [
    {
      question: "How do I generate a LUT from a prompt online?",
      answer: "To generate a LUT from a prompt online, simply upload your image in our Generator page, type a natural language description of the look you want, and click 'Generate LUT'. Our AI will create a custom LUT based on your description that you can download and use in your projects."
    },
    {
      question: "Why use a prompt to generate LUTs instead of manual editing?",
      answer: "Using prompts to generate LUTs saves time, requires no technical color grading knowledge, and allows you to experiment with different looks quickly. It's perfect for creators who want professional-looking color grading without spending hours in editing software."
    },
    {
      question: "What are the top tips for writing prompts to create LUTs?",
      answer: "For effective LUT generation prompts: 1) Be specific about the mood (e.g., 'warm sunset glow' vs just 'warm'), 2) Reference familiar visual styles (e.g., 'Wes Anderson pastel palette'), 3) Mention contrast and saturation levels, 4) Describe specific color relationships you want, and 5) Try combining different descriptors for unique results."
    },
    {
      question: "HOW TO USE GENERATED LUT IN EDITING SOFTWARE LIKE CAPCUT AND PR?",
      answer: "To use your generated LUT in editing software: For CapCut, go to 'Effects > New Effect > Filter > Import', and select your .cube file. For Premiere Pro, go to 'Lumetri Color panel > Creative > Look dropdown > Browse', and select your .cube file. The LUT will be applied to your footage and you can adjust the intensity as needed."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            {/* Mobile first - GIF appears first on mobile */}
            <div className="md:order-last order-first relative rounded-lg overflow-hidden shadow-subtle animate-fade-in mx-auto" style={{ animationDelay: "0.4s" }}>
              <video 
                ref={heroVideoRef}
                src="https://i.imgur.com/YOJTAkk.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full rounded-lg object-cover aspect-video"
              >
                <source src="https://i.imgur.com/YOJTAkk.mp4" type="video/mp4" />
                <source src="https://i.imgur.com/YOJTAkk.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex flex-col gap-6 animate-slide-up text-center md:text-left md:order-first order-last">
              <div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
                  Transform Your Images with AI-Powered LUTs
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto md:mx-0">
                  Create stunning visuals with our advanced color grading tool. Generate custom LUTs from natural language descriptions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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

      {/* SFX Pack Promo Section */}
      <section className="py-16 bg-blue-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="flex flex-col gap-6 animate-slide-up text-center md:text-left">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                  Elevate Your Videos with Our Sound Effects Pack
                </h2>
                <p className="text-lg text-muted-foreground max-w-[600px] mx-auto md:mx-0">
                  Pair your stunning visuals with professional sound effects. Our SFX pack includes everything you need to make your videos stand out.
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <Button asChild variant="default" size="lg" className="animate-fade-in group" style={{ animationDelay: "0.2s" }}>
                  <a href="https://www.visiongradeco.com/sfx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Get SFX Pack
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-subtle animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <video 
                ref={sfxVideoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full rounded-lg object-cover aspect-video"
              >
                <source src="https://i.imgur.com/YOJTAkk.mp4" type="video/mp4" />
                <source src="https://i.imgur.com/YOJTAkk.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Trending LUTs Promo Section */}
      <section className="py-16 bg-gradient-to-br from-background to-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="relative rounded-lg overflow-hidden shadow-subtle animate-fade-in order-first md:order-last" style={{ animationDelay: "0.4s" }}>
              <video 
                ref={trendingVideoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full rounded-lg object-cover aspect-video"
              >
                <source src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmwzaTFpNWNveWlkbjNwbjFyMmdodHowcjFoMW00dXVpcjl5YTQ5MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MMt8xKGc3Wr1WvdB4n/giphy.mp4" type="video/mp4" />
                <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmwzaTFpNWNveWlkbjNwbjFyMmdodHowcjFoMW00dXVpcjl5YTQ5MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MMt8xKGc3Wr1WvdB4n/giphy.gif" alt="Trending LUTs" className="w-full rounded-lg object-cover aspect-video" />
              </video>
            </div>
            <div className="flex flex-col gap-6 animate-slide-up text-center md:text-left order-last md:order-first">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                  Check Out Our Trending LUTs
                </h2>
                <p className="text-lg text-muted-foreground max-w-[600px] mx-auto md:mx-0">
                  Download free LUTs created by our community and professionals. Perfect for any project from social media to professional filmmaking.
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <Button asChild variant="default" size="lg" className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <Link to="/trending" className="flex items-center gap-2">
                    Browse Trending LUTs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - adjusted spacing */}
      <section className="py-16 mt-2 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our LUT generator and how to make the most of it
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
