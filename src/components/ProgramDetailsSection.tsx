import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, BookOpen } from "lucide-react";

const ProgramDetailsSection = () => {
  const programHighlights = [
    {
      icon: Clock,
      title: "16-Week Duration",
      description: "Comprehensive learning journey with structured progression"
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from leading researchers in epistemic sovereignty"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Receive official certification upon program completion"
    },
    {
      icon: BookOpen,
      title: "Research Access",
      description: "Access to exclusive research papers and case studies"
    }
  ];

  const topics = [
    "Understanding Agnotology",
    "Media Manipulation Techniques",
    "Information Warfare",
    "Cognitive Biases & Heuristics",
    "Source Verification Methods",
    "Digital Forensics Basics",
    "Epistemic Communities",
    "Knowledge Production Systems"
  ];

  return (
    <section className="py-20 bg-hero-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Program Overview
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              A deep dive into the mechanisms of knowledge production and the tools to maintain intellectual independence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-8">Key Features</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {programHighlights.map((highlight, index) => (
                  <Card key={index} className="border-border shadow-soft">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-3">
                        <highlight.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-lg text-text-primary">
                        {highlight.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-text-secondary">
                        {highlight.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-8">Core Topics Covered</h3>
              <div className="grid gap-3">
                {topics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-card border border-border hover:shadow-soft transition-all duration-200">
                    <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                    <span className="text-text-primary font-medium">{topic}</span>
                    <Badge variant="secondary" className="ml-auto bg-accent text-accent-foreground">
                      Week {Math.floor(index / 2) + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramDetailsSection;