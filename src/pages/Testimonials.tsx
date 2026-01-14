import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeometricBackground from "@/components/GeometricBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, BookOpen, Users, Award } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    role: "Research Analyst",
    location: "London, UK",
    shortQuote: "iRise Academy transformed my approach to information analysis.",
    fullStory: "Before discovering iRise Academy, I struggled to navigate the complex web of misinformation that permeates modern research. The agnotology framework has become essential to my research methodology. I now approach every source with a structured analytical lens that helps me identify manufactured doubt and strategic ignorance. The curriculum's emphasis on historical case studies—particularly the tobacco industry's disinformation campaigns—provided invaluable context for understanding contemporary manipulation tactics. My research papers have become more rigorous, and I've been invited to speak at three international conferences on information integrity.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    tier: "Tier 2 - Learned Master Builder",
    completedCourses: 4
  },
  {
    id: 2,
    name: "Marcus Thompson",
    role: "Investigative Journalist",
    location: "New York, USA",
    shortQuote: "The critical thinking tools made me a far more effective journalist.",
    fullStory: "As an investigative journalist covering corporate malfeasance, I thought I had a solid foundation in critical analysis. iRise Academy showed me how much I was missing. The module on 'Information Warfare Defense' was particularly eye-opening—I learned to recognize coordinated disinformation campaigns that I had previously attributed to organic confusion. My latest investigation into pharmaceutical pricing exposed a systematic effort to manufacture confusion around drug costs, and I applied techniques directly from the Critical Analysis Methods course. The story won a regional journalism award and sparked legislative action. I've since recommended iRise to my entire newsroom.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    tier: "Tier 2 - Learned Master Builder",
    completedCourses: 5
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "University Professor",
    location: "Madrid, Spain",
    shortQuote: "I've integrated iRise curriculum into my own courses.",
    fullStory: "Teaching media literacy at a major university, I was searching for a comprehensive framework that could help students navigate today's complex information environment. iRise Academy's epistemic sovereignty curriculum exceeded my expectations. The structured approach to understanding manufactured ignorance—from historical tobacco industry tactics to modern social media manipulation—provided exactly the academic rigor I needed. I've now incorporated key concepts from the Agnotology course into my own syllabus, and student evaluations have improved dramatically. Several students have gone on to pursue research in information integrity, citing their introduction through my adapted iRise materials.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    tier: "Tier 3 - Private Mentorship",
    completedCourses: 6
  },
  {
    id: 4,
    name: "James Okonkwo",
    role: "Policy Advisor",
    location: "Lagos, Nigeria",
    shortQuote: "Essential knowledge for anyone working in public policy.",
    fullStory: "Working in government policy, I constantly encounter competing claims and manufactured controversies designed to derail evidence-based legislation. The iRise Academy curriculum gave me the tools to cut through the noise. The Advanced Research Methodology course was particularly valuable—I learned to trace funding sources, identify astroturf campaigns, and distinguish genuine scientific debate from manufactured uncertainty. I've since trained my team in these techniques, and our policy recommendations have become more resistant to disinformation attacks. We recently passed landmark legislation on environmental protection, overcoming a well-funded misinformation campaign by applying principles learned at iRise.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    tier: "Tier 2 - Learned Master Builder",
    completedCourses: 4
  },
  {
    id: 5,
    name: "Dr. Aisha Patel",
    role: "Public Health Researcher",
    location: "Mumbai, India",
    shortQuote: "A game-changer for understanding health misinformation.",
    fullStory: "The COVID-19 pandemic highlighted the devastating impact of health misinformation. As a public health researcher, I was struggling to understand why evidence-based recommendations were so easily undermined. iRise Academy provided the theoretical framework I was missing. The historical parallels to tobacco and climate science denial were illuminating—I realized we were facing the same manufactured doubt tactics, just applied to vaccines and public health measures. The course on Building Mental Defenses helped me develop more effective health communications that anticipate and address common manipulation tactics. My team's vaccination campaign materials now incorporate 'pre-bunking' techniques learned at iRise, significantly improving public acceptance of evidence-based health guidance.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
    tier: "Tier 2 - Learned Master Builder",
    completedCourses: 5
  },
  {
    id: 6,
    name: "Thomas Weber",
    role: "Independent Researcher",
    location: "Berlin, Germany",
    shortQuote: "Finally, a systematic approach to truth-seeking.",
    fullStory: "After years of independent research into various topics dismissed as 'conspiracy theories,' I was frustrated by the lack of rigorous methodology in alternative research communities. iRise Academy provided exactly what was missing: a systematic, evidence-based approach to investigating suppressed or obscured information. The emphasis on source verification, logical consistency, and historical precedent has made my research far more credible and effective. I've learned to distinguish genuine cover-ups from misinterpretation, and to present findings in ways that withstand mainstream scrutiny. My blog now attracts readers from across the political spectrum, united by a shared commitment to epistemic sovereignty. The Private Mentorship tier provided invaluable guidance on publishing my findings in academic journals.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    tier: "Tier 3 - Private Mentorship",
    completedCourses: 6
  }
];

const stats = [
  { icon: Users, value: "2,500+", label: "Active Students" },
  { icon: BookOpen, value: "15", label: "Courses Available" },
  { icon: Award, value: "98%", label: "Completion Rate" },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how iRise Academy has transformed the lives and careers of truth-seekers, 
              researchers, and independent thinkers around the world.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id} 
                className={`bg-card/50 backdrop-blur-sm border-border overflow-hidden ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <CardContent className="p-0">
                  <div className={`grid md:grid-cols-3 gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image Section */}
                    <div className="relative h-64 md:h-auto">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-sm opacity-90">{testimonial.role}</p>
                        <p className="text-xs opacity-75">{testimonial.location}</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:col-span-2 p-6 md:p-8">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {testimonial.tier}
                        </span>
                      </div>

                      <div className="relative mb-6">
                        <Quote className="absolute -top-2 -left-2 h-10 w-10 text-primary/10" />
                        <p className="text-muted-foreground leading-relaxed pl-6">
                          {testimonial.fullStory}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{testimonial.completedCourses} courses completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Write Your Own Success Story?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join our community of truth-seekers and begin your journey toward epistemic sovereignty today.
                </p>
                <a 
                  href="/programs" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Explore Our Programs
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Testimonials;
