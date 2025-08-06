import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, Star } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  tier_required: number;
  description_md: string;
  is_published: boolean;
}

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('tier_required', { ascending: true });

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
      case 0: return "Free Preview";
      case 1: return "Foundation";
      case 2: return "Intermediate";
      case 3: return "Advanced";
      case 4: return "Expert";
      default: return `Tier ${tier}`;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Loading Courses...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Course Curriculum
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Progressive learning modules designed to build your epistemic sovereignty step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-text-primary mb-2">
                      {course.title}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`${getTierColor(course.tier_required)} mb-2`}
                    >
                      {getTierLabel(course.tier_required)}
                    </Badge>
                  </div>
                  <div className="ml-2">
                    {course.tier_required === 0 ? (
                      <Star className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-text-muted" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-text-secondary mb-4 line-clamp-3">
                  {course.description_md.replace(/\*\*/g, '')}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-text-muted">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Course</span>
                  </div>
                  
                  <Button 
                    variant={course.tier_required === 0 ? "default" : "outline"}
                    size="sm"
                    className={course.tier_required === 0 ? "bg-gradient-primary" : ""}
                  >
                    {course.tier_required === 0 ? "Start Free" : "Learn More"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;