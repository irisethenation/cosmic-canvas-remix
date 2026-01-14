import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, BookOpen, Lightbulb, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter. Check your email for confirmation.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const benefits = [
    {
      icon: BookOpen,
      title: "Exclusive Content",
      description: "Get access to articles and insights not available anywhere else."
    },
    {
      icon: Lightbulb,
      title: "Research Updates",
      description: "Stay informed about the latest in agnotology and epistemic studies."
    },
    {
      icon: Calendar,
      title: "Event Invitations",
      description: "Be first to know about webinars, workshops, and community events."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 lava-heading lava-adaptive-text">
              Stay Informed
            </h1>
            <p className="text-xl max-w-2xl mx-auto lava-adaptive-text opacity-80">
              Subscribe to our newsletter for the latest insights on epistemic sovereignty, 
              critical thinking, and truth-seeking.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
            <div>
              <h2 className="text-2xl font-bold mb-6 lava-adaptive-text">
                What You'll Get
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="lava-glass">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                        <benefit.icon className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="lava-glass">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-foreground text-center mb-6">
                  Subscribe to Our Newsletter
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" required placeholder="Your name" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="your@email.com" className="bg-background/50" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="consent" required />
                    <Label htmlFor="consent" className="text-sm text-muted-foreground leading-tight">
                      I agree to receive newsletters and updates from iRise Academy. 
                      You can unsubscribe at any time.
                    </Label>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Newsletter;
