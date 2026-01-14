import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, Play, Star, Clock, FileText, Video, Headphones, ChevronRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  tier_required: number;
  description_md: string;
  cover_url: string | null;
  is_published: boolean;
}

interface Module {
  id: string;
  title: string;
  summary: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  duration_seconds: number | null;
  is_free: boolean;
  order_index: number;
}

const CourseGrid = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the main course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .eq('slug', 'agnotology-epistemic-sovereignty')
          .maybeSingle();

        if (courseError) throw courseError;
        setCourse(courseData);

        if (courseData) {
          // Fetch modules with lessons
          const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select(`
              id,
              title,
              summary,
              order_index,
              lessons (
                id,
                title,
                content_type,
                duration_seconds,
                is_free,
                order_index
              )
            `)
            .eq('course_id', courseData.id)
            .eq('is_published', true)
            .order('order_index', { ascending: true });

          if (modulesError) throw modulesError;
          
          // Sort lessons within each module
          const sortedModules = (modulesData || []).map(module => ({
            ...module,
            lessons: (module.lessons || []).sort((a, b) => a.order_index - b.order_index)
          }));
          
          setModules(sortedModules);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4" />;
      case 'AUDIO': return <Headphones className="h-4 w-4" />;
      case 'PDF': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const previewModule = modules.find(m => m.order_index === 0);
  const otherModules = modules.filter(m => m.order_index > 0);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Course Coming Soon</h2>
          <p className="text-muted-foreground">Check back soon for our full programme.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-surface" id="programs">
      <div className="container mx-auto px-4">
        {/* Course Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Star className="h-3 w-3 mr-1" />
            Complete Programme
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {course.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {course.description_md}
          </p>
        </div>

        {/* Free Preview Module */}
        {previewModule && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Free Preview</h3>
                <p className="text-sm text-muted-foreground">Start learning today — no signup required</p>
              </div>
              <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                Free Access
              </Badge>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-border">
                <CardTitle className="text-lg">{previewModule.title}</CardTitle>
                {previewModule.summary && (
                  <CardDescription>{previewModule.summary}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {previewModule.lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      to={user ? `/lessons/${lesson.id}` : '#'}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          // Could trigger auth modal here
                        }
                      }}
                    >
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-sm font-medium text-green-700 dark:text-green-400">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getContentIcon(lesson.content_type)}
                            {lesson.content_type}
                          </span>
                          {lesson.duration_seconds && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(lesson.duration_seconds)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        Free
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Full Programme Modules */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Full Programme Curriculum</h3>
              <p className="text-sm text-muted-foreground">{otherModules.length} modules • {otherModules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              <Lock className="h-3 w-3 mr-1" />
              Subscription Required
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherModules.map((module) => (
              <Card 
                key={module.id} 
                className="bg-card/50 backdrop-blur-sm border-border hover:shadow-md transition-all group"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {module.order_index}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
                        {module.title.replace(`Module ${module.order_index} — `, '')}
                      </h4>
                      {module.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {module.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {module.lessons.length} lessons
                    </span>
                    <Lock className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Card className="bg-primary/5 border-primary/20 max-w-xl mx-auto">
              <CardContent className="p-6">
                <h4 className="font-bold text-foreground mb-2">Unlock the Full Programme</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get access to all 12 modules, 68+ lessons, and exclusive resources.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link to="/courses/agnotology-epistemic-sovereignty">
                      View Full Course
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/pricing">
                      See Pricing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
