import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AdminLogin = ({ onLogin, isLoading, error }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "Account Temporarily Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onLogin(email, password);
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
        }, BLOCK_DURATION);
        
        toast({
          title: "Account Locked",
          description: `Too many failed attempts. Account locked for 15 minutes.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Secure login to iRise Academy Admin Panel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@irise.academy"
                  className="pl-10"
                  required
                  disabled={isBlocked || isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                  disabled={isBlocked || isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {attempts > 0 && !isBlocked && (
              <Alert>
                <AlertDescription>
                  {MAX_ATTEMPTS - attempts} login attempts remaining
                </AlertDescription>
              </Alert>
            )}

            {isBlocked && (
              <Alert variant="destructive">
                <AlertDescription>
                  Account locked due to too many failed attempts. Please wait 15 minutes.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isBlocked || isLoading || !email || !password}
            >
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Secured with enterprise-grade authentication</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;