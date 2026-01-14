import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "signup";
}

const AuthModal = ({ open, onOpenChange, defaultMode = "login" }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLogin(defaultMode === "login");
  }, [defaultMode, open]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName,
              enrollment_date: new Date().toISOString(),
              program: "Agnotology & Epistemic Sovereignty Programme™"
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Registration successful!",
          description: "Welcome to iRise Academy! Your journey begins now.",
        });
      }
      
      setEmail("");
      setPassword("");
      setFullName("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isLogin ? "Welcome Back" : "Start Your Journey"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Sign in to continue your learning journey" 
              : "Join the Agnotology & Epistemic Sovereignty Programme™"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleAuth} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                placeholder="Your full name"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your secure password"
              minLength={8}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary text-primary-foreground"
            disabled={loading}
          >
            {loading 
              ? "Please wait..." 
              : isLogin 
                ? "Sign In" 
                : "Create Account"
            }
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? "New here? Create an account" 
              : "Already have an account? Sign in"
            }
          </Button>
        </form>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          Educational purposes only. By continuing, you agree to our Terms of Service.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;