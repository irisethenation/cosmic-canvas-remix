import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LavaLampBackground from "@/components/LavaLampBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, BookOpen, Users, Award } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John D.",
    role: "Property Owner & Academy Graduate",
    icon: "🏠",
    category: "Mortgage Challenge Success",
    briefDescription: "Successfully challenged mortgage validity and reclaimed full property rights through comprehensive legal education.",
    fullStory: `## The Challenge

John came to us facing foreclosure proceedings on his family home. Traditional legal advice had failed him, and he was desperate for solutions.

## Our Approach

Through our Mortgage Challenge module, John learned:
- The true nature of mortgage contracts
- How to identify contractual flaws
- Proper challenge procedures

## The Result

Within 6 months, John successfully:
1. Challenged the mortgage validity
2. Halted foreclosure proceedings
3. Reclaimed full property rights

*This success story demonstrates the power of proper legal education and understanding your rights.*`
  },
  {
    id: 2,
    name: "Freddie",
    role: "Student Grantor",
    icon: "🤝",
    category: "Community & Like Minds",
    briefDescription: "Building networks of sovereign-minded individuals supporting each other's journey.",
    fullStory: `## Finding Community

Freddie discovered that the journey to sovereignty doesn't have to be a lonely one. Through iRise Academy, he connected with like-minded individuals who share the same goals and values.

## The Power of Network

The community aspect of iRise Academy provided:
- Peer support and encouragement
- Shared learning experiences
- Collective wisdom and resources

## Ongoing Growth

Freddie continues to grow alongside his fellow students, proving that together we rise.`
  },
  {
    id: 3,
    name: "Marilyn",
    role: "Student Grantor",
    icon: "📝",
    category: "Debt Discharge via Promissory Note",
    briefDescription: "Learned how to apply knowledge to successfully discharge debts using proper commercial instruments and procedures.",
    fullStory: `## Understanding Commercial Instruments

Marilyn came to iRise Academy seeking clarity on how commercial law actually works. Through dedicated study, she mastered:
- The nature of promissory notes
- How to properly execute commercial instruments
- The procedures for debt discharge

## Applying Knowledge

With her newfound understanding, Marilyn successfully navigated the commercial system using the principles taught in our advanced modules.

## A New Perspective

Marilyn now views financial obligations through an entirely different lens—one of empowerment rather than burden.`
  },
  {
    id: 4,
    name: "Marilyn",
    role: "Student Grantor",
    icon: "💰",
    category: "Bill of Exchange Indorsement",
    briefDescription: "Mastering commercial law instruments for financial sovereignty.",
    fullStory: `## Commercial Mastery

Building on her earlier success, Marilyn continued her education into advanced commercial instruments.

## The Bill of Exchange

Learning the proper execution of indorsement on bills of exchange opened new doors to:
- Understanding commercial paper
- Proper endorsement procedures
- Financial sovereignty techniques

## Continued Success

Marilyn's dedication to learning has positioned her as a knowledgeable practitioner of commercial law principles.`
  },
  {
    id: 5,
    name: "Brenda",
    role: "Student Grantor",
    icon: "🎓",
    category: "Excellent Teaching Structure",
    briefDescription: "Comprehensive, step-by-step education that builds real understanding.",
    fullStory: `## Structured Learning

Brenda appreciated the methodical approach of iRise Academy's curriculum. The programme's structure provided:
- Clear progression from basics to advanced concepts
- Step-by-step guidance through complex topics
- Practical applications at every stage

## Building Confidence

With each module completed, Brenda gained confidence in her understanding of the system and her place within it.

## Testimony to Education

Brenda's experience highlights the importance of proper educational structure in mastering sovereignty concepts.`
  },
  {
    id: 6,
    name: "Maji",
    role: "Student",
    icon: "©️",
    category: "Trademark & Copyright Education",
    briefDescription: "Protecting intellectual property and commercial interests effectively.",
    fullStory: `## Intellectual Property Protection

Maji came to iRise Academy with concerns about protecting creative works and business interests.

## What Was Learned

Through our specialised modules, Maji discovered:
- How to legally enforce trademarks
- Copyright protection strategies
- Commercial interest safeguarding

## Empowered Protection

Maji now confidently protects intellectual property using the legal frameworks taught at iRise Academy.`
  },
  {
    id: 7,
    name: "Student",
    role: "Student",
    icon: "🏦",
    category: "BBL Discharge Success",
    briefDescription: "Navigating Bounce Back Loan challenges through proper understanding.",
    fullStory: `## The BBL Challenge

Like many business owners, this student faced challenges with Bounce Back Loan obligations during difficult economic times.

## Learning the System

Through iRise Academy's commercial law modules, they learned:
- The nature of loan agreements
- Proper procedures for addressing obligations
- How to navigate the commercial system

## Successful Navigation

Armed with knowledge, this student successfully addressed their BBL challenges through proper legal education.`
  },
  {
    id: 8,
    name: "Denise",
    role: "Student",
    icon: "👨‍👩‍👧‍👦",
    category: "Family Law Victory",
    briefDescription: "Protecting family rights and challenging unlawful state interventions.",
    fullStory: `## A Parent's Fight

Denise faced every parent's nightmare—unlawful intervention in her family. Traditional approaches had failed.

## The iRise Approach

Through our Family Law & Parental Sovereignty module (Module 7), Denise learned:
- The true nature of family court jurisdiction
- How to rebut presumptions of neglect
- Proper notices and documentation procedures

## Victory for Family

Denise achieved the reversal of illegal detention and removal of her children, demonstrating that knowledge truly is power when it comes to protecting your family.

*This case represents one of the most meaningful victories a parent can achieve.*`
  },
  {
    id: 9,
    name: "Bola",
    role: "Student",
    icon: "⚖️",
    category: "Arrest Dismissal - Trespass",
    briefDescription: "Understanding private property rights and proper legal procedures.",
    fullStory: `## The Incident

Bola experienced police trespass on private commercial property, leading to an arrest that should never have occurred.

## Legal Education Applied

Using knowledge gained from iRise Academy, Bola:
- Understood private property rights
- Applied proper legal procedures
- Challenged the unlawful actions effectively

## Case Dismissed

The arrest was dismissed after Bola successfully demonstrated the trespass on private commercial property, vindicating their rights.`
  },
  {
    id: 10,
    name: "Mariyah",
    role: "Student Grantor",
    icon: "✨",
    category: "Trust Education & Asset Protection",
    briefDescription: "The joy of discovering truth and securing one's commercial position.",
    fullStory: `## The Awakening

Mariyah came to iRise Academy excited but overwhelmed by the scope of what she didn't know.

## Unravelling Mis-Education

Through systematic study, Mariyah learned:
- How traditional education had obscured important truths
- The power of trusts for asset protection
- How to protect assets from potential creditors

## A New Foundation

Mariyah now operates from a position of knowledge and security, having established proper trust structures to protect her commercial interests.

*Her excitement at understanding these concepts is shared by many of our students.*`
  }
];

const stats = [
  { icon: Users, value: "500+", label: "Students Enrolled" },
  { icon: BookOpen, value: "68", label: "Lessons Available" },
  { icon: Award, value: "10+", label: "Documented Victories" },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 lava-heading lava-adaptive-text">
              Success Stories
            </h1>
            <p className="text-xl max-w-3xl mx-auto lava-adaptive-text opacity-80">
              Real results from real students. Our programme has helped people achieve 
              victories in mortgages, family law, debt discharge, and commercial sovereignty.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="lava-glass text-center">
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
            {testimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="lava-glass overflow-hidden"
              >
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

                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        {testimonial.fullStory.split('\n\n').map((paragraph, idx) => {
                          if (paragraph.startsWith('## ')) {
                            return (
                              <h3 key={idx} className="text-foreground font-semibold mt-4 mb-2">
                                {paragraph.replace('## ', '')}
                              </h3>
                            );
                          }
                          if (paragraph.startsWith('- ')) {
                            const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                            return (
                              <ul key={idx} className="list-disc pl-5 space-y-1 mb-3">
                                {items.map((item, i) => (
                                  <li key={i}>{item.replace('- ', '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          if (paragraph.startsWith('1. ')) {
                            const items = paragraph.split('\n').filter(line => /^\d+\. /.test(line));
                            return (
                              <ol key={idx} className="list-decimal pl-5 space-y-1 mb-3">
                                {items.map((item, i) => (
                                  <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                                ))}
                              </ol>
                            );
                          }
                          if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                            return (
                              <p key={idx} className="italic text-primary/80 mt-4">
                                {paragraph.replace(/\*/g, '')}
                              </p>
                            );
                          }
                          return <p key={idx} className="mb-3">{paragraph}</p>;
                        })}
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
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Testimonials;
