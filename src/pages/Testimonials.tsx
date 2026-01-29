import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, BookOpen, Users, Award, ArrowRight } from "lucide-react";
import { testimonials, stats } from "@/data/testimonials";

const statIcons = [Users, BookOpen, Award];

const Testimonials = () => {
  const canonicalUrl = "https://cosmic-canvas-remix.lovable.app/testimonials";
  
  // JSON-LD for aggregate reviews
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "iRise Academy",
    "description": "Education platform for epistemic sovereignty and legal understanding",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": testimonials.length.toString(),
      "bestRating": "5"
    },
    "review": testimonials.slice(0, 5).map(t => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": t.name },
      "reviewBody": t.briefDescription,
      "name": t.category
    }))
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Success Stories & Testimonials | iRise Academy"
        description="Real results from real students. Read success stories about mortgage challenges, family law victories, debt discharge, and commercial sovereignty education."
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 lava-heading lava-adaptive-text">
              Success Stories
            </h1>
            <p className="text-xl max-w-3xl mx-auto lava-adaptive-text opacity-80">
              Real results from real students. Our programme has helped people achieve 
              victories in mortgages, family law, debt discharge, and commercial sovereignty.
            </p>
          </header>

          {/* Stats */}
          <section aria-label="Academy statistics" className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            {stats.map((stat, index) => {
              const Icon = statIcons[index];
              return (
                <Card key={index} className="lava-glass text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Testimonials Grid */}
          <section aria-label="Student testimonials" className="space-y-8">
            {testimonials.map((testimonial) => (
              <article 
                key={testimonial.id} 
                className="group"
              >
                <Card className="lava-glass overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-4 gap-0">
                      {/* Icon/Info Section */}
                      <div className="bg-primary/5 p-6 md:p-8 flex flex-col justify-center items-center text-center">
                        <span className="text-5xl mb-4">{testimonial.icon}</span>
                        <p className="font-bold text-lg text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {testimonial.category}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="md:col-span-3 p-6 md:p-8">
                        <div className="relative mb-4">
                          <Quote className="absolute -top-2 -left-2 h-10 w-10 text-primary/10" />
                          <p className="text-lg font-medium text-foreground mb-4 pl-6">
                            {testimonial.briefDescription}
                          </p>
                        </div>

                        <div className="prose prose-sm max-w-none text-muted-foreground line-clamp-4">
                          {testimonial.fullStory.split('\n\n').slice(0, 2).map((paragraph, idx) => {
                            if (paragraph.startsWith('## ')) {
                              return (
                                <h3 key={idx} className="text-foreground font-semibold mt-4 mb-2">
                                  {paragraph.replace('## ', '')}
                                </h3>
                              );
                            }
                            return <p key={idx} className="mb-2">{paragraph}</p>;
                          })}
                        </div>

                        <Link 
                          to={`/testimonials/${testimonial.slug}`}
                          className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Read full story
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </section>

          {/* CTA Section */}
          <section className="mt-16 text-center">
            <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Write Your Own Success Story?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join our community and begin your journey toward sovereignty today.
                </p>
                <Link 
                  to="/programs" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Your Journey
                </Link>
              </CardContent>
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Testimonials;
