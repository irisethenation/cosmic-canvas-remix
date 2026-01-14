import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll respond within 24-48 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Admissions",
      description: "Questions about enrollment and programs",
      email: "admissions@iriseacademy.com"
    },
    {
      icon: HelpCircle,
      title: "Support",
      description: "Technical support and account help",
      email: "support@iriseacademy.com"
    },
    {
      icon: MessageSquare,
      title: "General Inquiries",
      description: "Partnerships and general questions",
      email: "info@iriseacademy.com"
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
              Contact Us
            </h1>
            <p className="text-xl max-w-2xl mx-auto lava-adaptive-text opacity-80">
              Have questions about our programs? We're here to help you on your journey 
              to epistemic sovereignty.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 lava-adaptive-text">Get in Touch</h2>
              <div className="space-y-4">
                {contactOptions.map((option, index) => (
                  <Card key={index} className="lava-glass">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                        <option.icon className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{option.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{option.description}</p>
                        <a 
                          href={`mailto:${option.email}`}
                          className="text-sm text-amber-400 hover:text-amber-300 hover:underline"
                        >
                          {option.email}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="lava-glass">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required placeholder="John" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required placeholder="Doe" className="bg-background/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="john@example.com" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required placeholder="How can we help?" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      required 
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="bg-background/50"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
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

export default Contact;
