import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="min-h-[80vh] bg-gradient-hero flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-8 leading-tight">
            Agnotology & Epistemic 
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Sovereignty Programme™
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            Master the art of recognizing and combating deliberate ignorance. 
            Develop your epistemic sovereignty through our comprehensive 16-week program.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary shadow-medium text-lg px-8 py-6 h-auto"
              onClick={() => setAuthModalOpen(true)}
            >
              {user ? "Continue Journey" : "Start Your Journey"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-brand-purple text-brand-purple hover:bg-brand-purple-light text-lg px-8 py-6 h-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
      />
    </section>
  );
};

export default HeroSection;