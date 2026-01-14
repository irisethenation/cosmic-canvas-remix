import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Calendar, Award } from "lucide-react";

const Community = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Engage in thought-provoking discussions with fellow students and faculty on topics of epistemic sovereignty and critical analysis."
    },
    {
      icon: Calendar,
      title: "Live Events",
      description: "Join weekly webinars, Q&A sessions, and virtual meetups with industry experts and community leaders."
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Form study groups with peers to deepen your understanding and collaborate on research projects."
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Earn badges and recognition for your contributions to the community and academic achievements."
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
              iRise Community
            </h1>
            <p className="text-xl max-w-2xl mx-auto lava-adaptive-text opacity-80">
              Connect with a global network of truth-seekers, researchers, and independent thinkers 
              committed to epistemic sovereignty.
            </p>
          </div>

          <Card className="lava-glass max-w-2xl mx-auto mb-12">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Community Coming Soon
              </h2>
              <p className="text-muted-foreground mb-6">
                We're building a vibrant community platform for iRise Academy students. 
                Sign up for updates to be notified when we launch.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                Get Notified
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="lava-glass">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                      <feature.icon className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Community;
