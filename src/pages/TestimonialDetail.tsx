import { useParams, Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials, getTestimonialBySlug } from "@/data/testimonials";

const TestimonialDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const testimonial = slug ? getTestimonialBySlug(slug) : undefined;

  if (!testimonial) {
    return <Navigate to="/testimonials" replace />;
  }

  // Find prev/next testimonials for navigation
  const currentIndex = testimonials.findIndex(t => t.slug === slug);
  const prevTestimonial = currentIndex > 0 ? testimonials[currentIndex - 1] : null;
  const nextTestimonial = currentIndex < testimonials.length - 1 ? testimonials[currentIndex + 1] : null;

  const canonicalUrl = `https://cosmic-canvas-remix.lovable.app/testimonials/${testimonial.slug}`;
  
  // JSON-LD structured data for testimonial/review
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "EducationalOrganization",
      "name": "iRise Academy",
      "description": "Education platform for epistemic sovereignty and legal understanding"
    },
    "author": {
      "@type": "Person",
      "name": testimonial.name
    },
    "reviewBody": testimonial.briefDescription,
    "name": testimonial.category,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    }
  };

  const seoTitle = `${testimonial.name}: ${testimonial.category} | iRise Academy Success Story`;
  const seoDescription = `${testimonial.briefDescription} Read ${testimonial.name}'s full story of transformation with iRise Academy.`;

  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        ogType="article"
        jsonLd={jsonLd}
      />
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/testimonials" className="hover:text-primary transition-colors">Success Stories</Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">{testimonial.category}</li>
            </ol>
          </nav>

          {/* Back link */}
          <Link 
            to="/testimonials" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all success stories
          </Link>

          <article>
            {/* Header */}
            <header className="text-center mb-12">
              <span className="text-6xl mb-4 block">{testimonial.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 lava-heading lava-adaptive-text">
                {testimonial.category}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                {testimonial.briefDescription}
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </header>

            {/* Main content */}
            <Card className="lava-glass max-w-3xl mx-auto mb-12">
              <CardContent className="p-8 md:p-12">
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary/10" />
                  <div className="prose prose-lg max-w-none text-foreground pl-6">
                    {testimonial.fullStory.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-xl font-semibold mt-8 mb-4 text-foreground">
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-2 mb-4 text-muted-foreground">
                            {items.map((item, i) => (
                              <li key={i}>{item.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      if (paragraph.startsWith('1. ')) {
                        const items = paragraph.split('\n').filter(line => /^\d+\. /.test(line));
                        return (
                          <ol key={idx} className="list-decimal pl-5 space-y-2 mb-4 text-muted-foreground">
                            {items.map((item, i) => (
                              <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                            ))}
                          </ol>
                        );
                      }
                      if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                        return (
                          <p key={idx} className="italic text-primary/80 mt-6 text-center">
                            {paragraph.replace(/\*/g, '')}
                          </p>
                        );
                      }
                      return <p key={idx} className="mb-4 text-muted-foreground leading-relaxed">{paragraph}</p>;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <nav aria-label="Testimonial navigation" className="flex justify-between max-w-3xl mx-auto">
              {prevTestimonial ? (
                <Link 
                  to={`/testimonials/${prevTestimonial.slug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">{prevTestimonial.name}'s Story</span>
                </Link>
              ) : (
                <div />
              )}
              {nextTestimonial && (
                <Link 
                  to={`/testimonials/${nextTestimonial.slug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="text-sm">{nextTestimonial.name}'s Story</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </nav>
          </article>

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
                <Button asChild>
                  <Link to="/programs">Start Your Journey</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default TestimonialDetail;
