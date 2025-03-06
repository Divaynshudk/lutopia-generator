
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, name });
      
      if (error) {
        if (error.code === '23505') {
          toast.info("You're already subscribed to our newsletter!");
        } else {
          throw error;
        }
      } else {
        toast.success("Thanks for subscribing to our newsletter!");
        setEmail("");
        setName("");
      }
    } catch (error: any) {
      console.error("Error subscribing to newsletter:", error);
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Join Our Newsletter</h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest trends in video editing, LUTs, and exclusive insights from Vision Grade
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubscribe} className="glass rounded-xl p-6 shadow-subtle animate-fade-in">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name (Optional)
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            
            <p className="mt-4 text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
