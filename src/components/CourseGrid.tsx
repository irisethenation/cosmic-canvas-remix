import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, Play, Star } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  tier_required: number;
  description_md: string;
  cover_url: string | null;
  is_published: boolean;
  lessons: {
    id: string;
    is_free: boolean;
  }[];
}

interface LessonProgress {
  id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
}

interface UserProfile {
  user_tier: number;
}

const CourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile to get tier
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('user_tier')
            .eq('user_id', user.id)
            .single();
          
          setUserProfile(profile);
        }

        // Determine user tier
        const userTier = userProfile?.user_tier || 0;

        // Fetch courses with lessons, filtered by user tier
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select(`
            *,
            modules!inner(
              lessons(id, is_free)
            )
          `)
          .eq('is_published', true)
          .lte('tier_required', user ? userTier : 0)
          .order('tier_required', { ascending: true });

        if (coursesError) throw coursesError;

        // Flatten lessons from modules
        const coursesWithLessons = coursesData?.map(course => ({
          ...course,
          lessons: course.modules?.flatMap(module => module.lessons) || []
        })) || [];

        setCourses(coursesWithLessons);

        // Fetch lesson progress if user is logged in
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id);

          if (progressError) throw progressError;
          setLessonProgress(progressData || []);
        }

      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile?.user_tier]);

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

  const getCourseProgress = (courseId: string) => {
    const courseProgressItems = lessonProgress.filter(p => p.course_id === courseId);
    const completedCount = courseProgressItems.filter(p => p.completed).length;
    const totalLessons = courses.find(c => c.id === courseId)?.lessons.length || 0;
    
    if (totalLessons === 0) return 0;
    return Math.round((completedCount / totalLessons) * 100);
  };

  const hasFreeLessons = (course: Course) => {
    return course.lessons.some(lesson => lesson.is_free);
  };

  const isLocked = (course: Course) => {
    const userTier = userProfile?.user_tier || 0;
    return course.tier_required > userTier;
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
            Your Course Library
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            {user 
              ? `Access courses up to Tier ${userProfile?.user_tier || 0}. Complete lessons to unlock higher tiers.`
              : "Sign up to access premium courses and track your progress."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress = getCourseProgress(course.id);
            const locked = isLocked(course);
            const hasFree = hasFreeLessons(course);

            return (
              <Card key={course.id} className={`hover:shadow-lg transition-all duration-300 ${locked ? 'opacity-60' : ''}`}>
                {course.cover_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={course.cover_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
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
                      {locked ? (
                        <Lock className="h-5 w-5 text-text-muted" />
                      ) : course.tier_required === 0 ? (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-text-secondary mb-4 line-clamp-3">
                    {course.description_md.replace(/\*\*/g, '')}
                  </CardDescription>
                  
                  {user && !locked && progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-text-muted mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-text-muted">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {hasFree && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Preview
                        </Button>
                      )}
                      
                      <Button 
                        variant={locked ? "outline" : "default"}
                        size="sm"
                        disabled={locked}
                        className={!locked && course.tier_required === 0 ? "bg-gradient-primary" : ""}
                      >
                        {locked ? "Locked" : progress > 0 ? "Continue" : "Start"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <Lock className="h-16 w-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No Courses Available
            </h3>
            <p className="text-text-secondary">
              {user 
                ? "Complete lower tier courses to unlock new content."
                : "Sign up to access our course library."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseGrid;