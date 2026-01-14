import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Lock, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description_md: string;
  tier_required: number;
  cover_url: string | null;
  slug: string;
}

interface LessonProgress {
  course_id: string;
  completed: boolean;
}

const tierLabels: Record<number, string> = {
  0: 'Free',
  1: 'Key Master',
  2: 'Master Builder',
  3: 'Mentorship',
};

const tierColors: Record<number, string> = {
  0: 'bg-muted text-muted-foreground',
  1: 'bg-primary/10 text-primary',
  2: 'bg-accent text-accent-foreground',
  3: 'bg-brand-purple text-primary-foreground',
};

export const DashboardCourseGrid = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Courses are already filtered by RLS based on user tier
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, title, description_md, tier_required, cover_url, slug')
        .eq('is_published', true)
        .order('tier_required', { ascending: true });

      if (coursesData) {
        setCourses(coursesData);
      }

      // Fetch progress if user is logged in
      if (user) {
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('course_id, completed')
          .eq('user_id', user.id);

        if (progressData) {
          const progressMap: Record<string, { total: number; completed: number }> = {};
          progressData.forEach(p => {
            if (!progressMap[p.course_id]) {
              progressMap[p.course_id] = { total: 0, completed: 0 };
            }
            progressMap[p.course_id].total++;
            if (p.completed) progressMap[p.course_id].completed++;
          });

          const percentages: Record<string, number> = {};
          Object.entries(progressMap).forEach(([courseId, data]) => {
            percentages[courseId] = Math.round((data.completed / data.total) * 100);
          });
          setProgress(percentages);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Your Courses
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-border animate-pulse">
              <div className="h-32 bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <Card className="border-border shadow-soft">
        <CardContent className="p-8 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Available</h3>
          <p className="text-muted-foreground mb-4">
            Upgrade your subscription to unlock premium courses
          </p>
          <Button className="bg-gradient-primary hover:opacity-90">
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        Your Courses
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => {
          const courseProgress = progress[course.id] || 0;
          
          return (
            <Card 
              key={course.id} 
              className="border-border shadow-soft overflow-hidden hover:shadow-medium transition-shadow group"
            >
              <div className="h-32 bg-gradient-hero relative overflow-hidden">
                {course.cover_url ? (
                  <img 
                    src={course.cover_url} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary/30" />
                  </div>
                )}
                <Badge className={`absolute top-2 right-2 ${tierColors[course.tier_required]}`}>
                  {tierLabels[course.tier_required]}
                </Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description_md.slice(0, 100)}...
                </p>
                
                {courseProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{courseProgress}%</span>
                    </div>
                    <Progress value={courseProgress} className="h-1.5" />
                  </div>
                )}

                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {courseProgress > 0 ? 'Continue' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
