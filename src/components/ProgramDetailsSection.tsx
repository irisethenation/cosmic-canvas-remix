import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  tier_required: number;
  description_md: string;
}

const ProgramDetailsSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, tier_required, description_md')
          .eq('is_published', true)
          .order('tier_required', { ascending: true })
          .order('title', { ascending: true });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const programHighlights = [
    {
      icon: Clock,
      title: "Self-Paced Learning",
      description: "Progress through modules at your own speed with lifetime access"
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

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 0: return "bg-green-100 text-green-800 border-green-200";
      case 1: return "bg-blue-100 text-blue-800 border-blue-200";
      case 2: return "bg-purple-100 text-purple-800 border-purple-200";
      case 3: return "bg-orange-100 text-orange-800 border-orange-200";
      case 4: return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 0: return "Free";
      case 1: return "Foundation";
      case 2: return "Intermediate";
      case 3: return "Advanced";
      case 4: return "Expert";
      default: return `Tier ${tier}`;
    }
  };

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
              <h3 className="text-2xl font-bold text-text-primary mb-8">Course Modules</h3>
              {loading ? (
                <div className="text-center text-text-secondary">Loading course modules...</div>
              ) : (
                <div className="grid gap-3">
                  {courses.map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:shadow-soft transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                        <div>
                          <span className="text-text-primary font-medium block">{course.title}</span>
                          <span className="text-text-secondary text-sm">{course.description_md.replace(/\*\*/g, '').substring(0, 60)}...</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getTierColor(course.tier_required)} whitespace-nowrap`}
                      >
                        {getTierLabel(course.tier_required)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramDetailsSection;