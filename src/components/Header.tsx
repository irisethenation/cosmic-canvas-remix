import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, signOut } = useAuth();

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/7839be91-7988-4489-9261-258c18f256b1.png" 
              alt="iRise Academy Seal" 
              className="w-12 h-12"
            />
            <h1 className="text-xl font-bold text-text-primary">iRise Academy</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/programs" className="text-text-secondary hover:text-text-primary transition-colors">
              Programs
            </Link>
            <Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-text-secondary hover:text-text-primary transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-text-secondary hidden sm:block">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  className="text-text-secondary hover:text-text-primary"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-text-secondary hover:text-text-primary"
                  onClick={() => openAuth("login")}
                >
                  Login
                </Button>
                <Button 
                  className="bg-gradient-primary shadow-soft"
                  onClick={() => openAuth("signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultMode={authMode}
      />
    </header>
  );
};

export default Header;