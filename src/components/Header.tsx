import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/7839be91-7988-4489-9261-258c18f256b1.png" 
              alt="iRise Academy Seal" 
              className="w-12 h-12"
            />
            <h1 className="text-xl font-bold text-text-primary">iRise Academy</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#programs" className="text-text-secondary hover:text-text-primary transition-colors">
              Programs
            </a>
            <a href="#about" className="text-text-secondary hover:text-text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-text-secondary hover:text-text-primary transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-text-secondary hover:text-text-primary">
              Login
            </Button>
            <Button className="bg-gradient-primary shadow-soft">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;