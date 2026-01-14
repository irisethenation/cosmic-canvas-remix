import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import GeometricBackground from '@/components/GeometricBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Lock, 
  Play,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';

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

interface Course {
  id: string;
  title: string;
  description_md: string;
  tier_required: number;
  cover_url: string | null;
  slug: string;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  percent_complete: number;
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

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, signOut } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) return;

      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (!courseData) {
        setLoading(false);
        return;
      }

      setCourse(courseData);

      // Fetch modules with lessons
      const { data: modulesData } = await supabase
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

      if (modulesData) {
        // Sort lessons within each module
        const sortedModules = modulesData.map(m => ({
          ...m,
          lessons: (m.lessons || []).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
        }));
        setModules(sortedModules as Module[]);
      }

      // Fetch user progress
      if (user) {
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('lesson_id, completed, percent_complete')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id);

        if (progressData) {
          const progressMap: Record<string, LessonProgress> = {};
          progressData.forEach(p => {
            progressMap[p.lesson_id] = p;
          });
          setProgress(progressMap);
        }
      }

      setLoading(false);
    };

    fetchCourseData();
  }, [slug, user]);

  const getTotalLessons = () => modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const getCompletedLessons = () => Object.values(progress).filter(p => p.completed).length;
  const getCourseProgress = () => {
    const total = getTotalLessons();
    if (total === 0) return 0;
    return Math.round((getCompletedLessons() / total) * 100);
  };

  const getModuleProgress = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module || module.lessons.length === 0) return 0;
    const completed = module.lessons.filter(l => progress[l.id]?.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
        <Link to="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/5b04634a-8b34-4b3f-b5d4-9ca573b411f1.png" 
                alt="iRise Academy" 
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cover Image */}
            <div className="lg:w-1/3">
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-hero shadow-soft">
                {course.cover_url ? (
                  <img 
                    src={course.cover_url} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={tierColors[course.tier_required]}>
                  {tierLabels[course.tier_required]}
                </Badge>
                <Badge variant="outline" className="border-border">
                  {getTotalLessons()} Lessons
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-muted-foreground mb-6">{course.description_md}</p>

              {/* Progress Bar */}
              {user && (
                <Card className="border-border shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Your Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {getCompletedLessons()} / {getTotalLessons()} completed
                      </span>
                    </div>
                    <Progress value={getCourseProgress()} className="h-2" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Modules
          </h2>

          {modules.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No modules available yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {modules.map((module, moduleIndex) => {
                const moduleProgress = getModuleProgress(module.id);
                const isComplete = moduleProgress === 100;

                return (
                  <Card key={module.id} className="border-border shadow-soft overflow-hidden">
                    <CardHeader className="pb-3 bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              MODULE {moduleIndex + 1}
                            </span>
                            {isComplete && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <CardTitle className="text-lg text-foreground">{module.title}</CardTitle>
                          {module.summary && (
                            <p className="text-sm text-muted-foreground mt-1">{module.summary}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">
                            {module.lessons.length} lessons
                          </span>
                          {user && (
                            <div className="mt-1">
                              <Progress value={moduleProgress} className="w-20 h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const lessonProgress = progress[lesson.id];
                          const isLessonComplete = lessonProgress?.completed;
                          const isLocked = !lesson.is_free && !user;

                          return (
                            <Link
                              key={lesson.id}
                              to={isLocked ? '#' : `/lessons/${lesson.id}`}
                              className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                                isLocked ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                {isLessonComplete ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : isLocked ? (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <span className="text-sm font-medium text-muted-foreground">
                                    {lessonIndex + 1}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground truncate">
                                    {lesson.title}
                                  </span>
                                  {lesson.is_free && (
                                    <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <Play className="h-3 w-3" />
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

                              {!isLocked && (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
