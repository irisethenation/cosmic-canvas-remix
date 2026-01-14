import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeometricBackground from "@/components/GeometricBackground";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: BookOpen,
      title: "Epistemic Rigor",
      description: "We champion evidence-based reasoning and intellectual honesty in all our teachings."
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Learning thrives in community. We foster collaborative environments for growth."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We pursue the highest standards in education and personal development."
    },
    {
      icon: Shield,
      title: "Sovereignty",
      description: "We empower individuals to think independently and resist manipulation."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About iRise Academy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Founded on the principles of epistemic sovereignty and critical thinking, 
              iRise Academy empowers individuals to navigate the complex information landscape 
              with clarity and confidence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  At iRise Academy, we are dedicated to combating the manufactured ignorance 
                  that pervades modern society. Through our comprehensive curriculum in Agnotology 
                  and Epistemic Sovereignty, we equip students with the tools to identify, 
                  analyze, and resist information manipulation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our programs are designed for truth-seekers, researchers, and anyone committed 
                  to maintaining intellectual independence in an age of pervasive misinformation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Card className="bg-card/50 backdrop-blur-sm border-border inline-block">
              <CardContent className="p-8">
                <p className="text-lg italic text-muted-foreground mb-4">
                  "Exsurgite Omnes Qui Vocati Sentiunt"
                </p>
                <p className="text-sm text-muted-foreground">
                  Rise, all who feel the calling
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default About;
