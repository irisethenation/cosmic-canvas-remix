import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John D.",
    role: "Property Owner & Academy Graduate",
    icon: "🏠",
    quote: "Successfully challenged my mortgage validity and reclaimed full property rights through the comprehensive legal education program. Within 6 months, I halted foreclosure proceedings on my family home.",
    category: "Mortgage Challenge Success"
  },
  {
    id: 2,
    name: "Denise",
    role: "Student",
    icon: "👨‍👩‍👧‍👦",
    quote: "Achieved the reversal of illegal detention and removal of my children. iRise Academy taught me how to protect family rights and challenge unlawful state interventions effectively.",
    category: "Family Law Victory"
  },
  {
    id: 3,
    name: "Marilyn",
    role: "Student Grantor",
    icon: "📝",
    quote: "Learned how to successfully discharge debts using proper commercial instruments and procedures. The knowledge of promissory notes and bills of exchange changed everything.",
    category: "Debt Discharge Success"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real Results from Real Students
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our students achieve tangible victories in mortgages, family law, 
            debt discharge, and commercial sovereignty.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{testimonial.icon}</span>
                  <span className="text-sm font-medium text-primary">
                    {testimonial.category}
                  </span>
                </div>
                
                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                  <p className="text-muted-foreground italic pl-4 text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/testimonials">
              View All Success Stories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
