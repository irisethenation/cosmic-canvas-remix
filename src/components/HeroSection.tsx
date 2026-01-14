import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="min-h-[80vh] flex items-center relative">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight lava-heading">
            <span className="lava-adaptive-text">Agnotology & Epistemic</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
              Sovereignty Programme™
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed lava-adaptive-text">
            Master the art of recognizing and combating deliberate ignorance. 
            Develop your epistemic sovereignty through our comprehensive 16-week program.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 text-lg px-8 py-6 h-auto border-0"
              onClick={() => setAuthModalOpen(true)}
            >
              {user ? "Continue Journey" : "Start Your Journey"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 text-lg px-8 py-6 h-auto backdrop-blur-sm"
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
