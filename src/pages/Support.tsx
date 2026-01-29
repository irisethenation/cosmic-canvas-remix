import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, Book, MessageCircle, Mail } from "lucide-react";
import { SupportChatPanel } from "@/components/support/SupportChatPanel";
import { useAuth } from "@/hooks/useAuth";

const Support = () => {
  const { user } = useAuth();
  
  const faqs = [
    {
      question: "How do I access my courses?",
      answer: "After logging in, navigate to your Dashboard where you'll find all your enrolled courses. Click on any course to access its modules and lessons."
    },
    {
      question: "What if I forget my password?",
      answer: "Click the 'Login' button and then select 'Forgot Password'. Enter your email address and we'll send you instructions to reset your password."
    },
    {
      question: "How do I upgrade my subscription tier?",
      answer: "Visit your Dashboard and click on the 'Upgrade' button in your subscription card. You can choose from our available tiers: Key Master, Learned Master Builder, or Private Mentorship."
    },
    {
      question: "Can I download course materials?",
      answer: "Yes, PDF materials and resources can be downloaded from within each lesson. Video content is available for streaming only."
    },
    {
      question: "How do I track my progress?",
      answer: "Your progress is automatically tracked as you complete lessons. View your overall progress on the Dashboard or within each course."
    },
    {
      question: "What are the different subscription tiers?",
      answer: "Tier 1 (Key Master) provides access to foundational courses. Tier 2 (Learned Master Builder) includes advanced curriculum. Tier 3 (Private Mentorship) offers personalized guidance and all content."
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
              Support Center
            </h1>
            <p className="text-xl max-w-2xl mx-auto lava-adaptive-text opacity-80">
              Find answers to common questions or reach out to our support team.
            </p>
          </div>

          {/* Support Chat Panel - only shown to authenticated users */}
          {user && (
            <div className="max-w-3xl mx-auto mb-12">
              <SupportChatPanel />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="lava-glass text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse our knowledge base
                </p>
                <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">Coming Soon</Button>
              </CardContent>
            </Card>

            <Card className="lava-glass text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other students
                </p>
                <Button variant="outline" size="sm" asChild className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                  <Link to="/community">Join Community</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="lava-glass text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Contact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized help
                </p>
                <Button variant="outline" size="sm" asChild className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="lava-glass max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-400" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Support;
