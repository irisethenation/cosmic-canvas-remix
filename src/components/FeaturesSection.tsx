import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Search } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Agnotology Studies",
    description: "Learn to identify and understand the production of ignorance and doubt in society."
  },
  {
    icon: Shield,
    title: "Epistemic Sovereignty",
    description: "Develop the ability to maintain and control your own knowledge systems."
  },
  {
    icon: Search,
    title: "Critical Analysis",
    description: "Master advanced techniques for analyzing information and media literacy."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-feature-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            What You'll Learn
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Comprehensive curriculum designed for critical thinking mastery
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border shadow-soft hover:shadow-medium transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-text-primary">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;