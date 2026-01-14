import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import GeometricBackground from '@/components/GeometricBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  ArrowRight, 
  BookOpen, 
  CheckCircle,
  Clock,
  FileText,
  Headphones,
  Play,
  Video,
  User,
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  content_url: string | null;
  content_text: string | null;
  content_md: string | null;
  video_url: string | null;
  duration_seconds: number | null;
  is_free: boolean;
  order_index: number;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
  order_index: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface LessonProgress {
  id: string;
  percent_complete: number;
  completed: boolean;
  last_position_seconds: number | null;
}

interface SiblingLesson {
  id: string;
  title: string;
}

const contentTypeIcons: Record<string, React.ElementType> = {
  VIDEO: Video,
  AUDIO: Headphones,
  PDF: FileText,
  TEXT: BookOpen,
};

const LessonPlayer = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [prevLesson, setPrevLesson] = useState<SiblingLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<SiblingLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!lessonId) return;

      // Fetch lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .maybeSingle();

      if (lessonError || !lessonData) {
        setLoading(false);
        return;
      }

      setLesson(lessonData);

      // Fetch module
      const { data: moduleData } = await supabase
        .from('modules')
        .select('id, title, course_id, order_index')
        .eq('id', lessonData.module_id)
        .maybeSingle();

      if (moduleData) {
        setModule(moduleData);

        // Fetch course
        const { data: courseData } = await supabase
          .from('courses')
          .select('id, title, slug')
          .eq('id', moduleData.course_id)
          .maybeSingle();

        setCourse(courseData);

        // Fetch all lessons in this module to find prev/next
        const { data: allLessons } = await supabase
          .from('lessons')
          .select('id, title, order_index')
          .eq('module_id', lessonData.module_id)
          .eq('is_published', true)
          .order('order_index', { ascending: true });

        if (allLessons) {
          const currentIndex = allLessons.findIndex(l => l.id === lessonId);
          if (currentIndex > 0) {
            setPrevLesson(allLessons[currentIndex - 1]);
          }
          if (currentIndex < allLessons.length - 1) {
            setNextLesson(allLessons[currentIndex + 1]);
          }
        }
      }

      // Fetch user progress
      if (user && moduleData) {
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('id, percent_complete, completed, last_position_seconds')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();

        setProgress(progressData);

        // Create progress record if doesn't exist
        if (!progressData && moduleData) {
          await supabase.from('lesson_progress').insert({
            user_id: user.id,
            lesson_id: lessonId,
            course_id: moduleData.course_id,
            status: 'IN_PROGRESS',
            percent_complete: 0,
          });
        }
      }

      setLoading(false);
    };

    fetchLessonData();
  }, [lessonId, user]);

  const updateProgress = useCallback(async (percentComplete: number, completed: boolean = false) => {
    if (!user || !lesson || !module) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          course_id: module.course_id,
          percent_complete: percentComplete,
          completed,
          status: completed ? 'COMPLETED' : 'IN_PROGRESS',
          completed_at: completed ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      setProgress(prev => prev ? {
        ...prev,
        percent_complete: percentComplete,
        completed,
      } : null);

      if (completed) {
        toast({
          title: "Lesson Completed! 🎉",
          description: "Great job! Your progress has been saved.",
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setSaving(false);
    }
  }, [user, lesson, module, toast]);

  const markAsComplete = () => {
    updateProgress(100, true);
  };

  const ContentIcon = lesson ? contentTypeIcons[lesson.content_type] || BookOpen : BookOpen;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Lesson Not Found</h1>
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
            {course && (
              <Link to={`/courses/${course.slug}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {progress && (
              <Badge variant={progress.completed ? "default" : "outline"} className={progress.completed ? "bg-green-500" : ""}>
                {progress.completed ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </>
                ) : (
                  `${progress.percent_complete}% Complete`
                )}
              </Badge>
            )}
            {user && (
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          {course && (
            <>
              <Link to={`/courses/${course.slug}`} className="hover:text-primary">
                {course.title}
              </Link>
              <span>/</span>
            </>
          )}
          {module && (
            <>
              <span>{module.title}</span>
              <span>/</span>
            </>
          )}
          <span className="text-foreground font-medium">{lesson.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/Content Player */}
            <Card className="border-border shadow-soft overflow-hidden">
              <div className="aspect-video bg-muted/50 relative">
                {lesson.video_url || lesson.content_url ? (
                  lesson.content_type === 'VIDEO' ? (
                    <video
                      src={lesson.video_url || lesson.content_url || ''}
                      controls
                      className="w-full h-full"
                      onEnded={() => updateProgress(100, true)}
                      onTimeUpdate={(e) => {
                        const video = e.currentTarget;
                        const percent = Math.round((video.currentTime / video.duration) * 100);
                        if (percent % 10 === 0) {
                          updateProgress(percent, false);
                        }
                      }}
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : lesson.content_type === 'AUDIO' ? (
                    <div className="flex items-center justify-center h-full">
                      <audio
                        src={lesson.content_url || ''}
                        controls
                        className="w-full max-w-md"
                        onEnded={() => updateProgress(100, true)}
                      >
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  ) : lesson.content_type === 'PDF' ? (
                    <iframe
                      src={lesson.content_url || ''}
                      className="w-full h-full"
                      title={lesson.title}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ContentIcon className="h-16 w-16 text-primary/30" />
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <ContentIcon className="h-16 w-16 text-primary/30" />
                    <p className="text-muted-foreground">Content coming soon</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Lesson Title & Info */}
            <Card className="border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-border">
                    <ContentIcon className="h-3 w-3 mr-1" />
                    {lesson.content_type}
                  </Badge>
                  {lesson.duration_seconds && (
                    <Badge variant="outline" className="border-border">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.floor(lesson.duration_seconds / 60)} min
                    </Badge>
                  )}
                  {lesson.is_free && (
                    <Badge variant="outline" className="border-green-500 text-green-600">
                      Free Lesson
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl text-foreground">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Lesson Text Content */}
                {(lesson.content_text || lesson.content_md) && (
                  <div className="prose prose-sm max-w-none text-foreground">
                    <p className="whitespace-pre-wrap">{lesson.content_text || lesson.content_md}</p>
                  </div>
                )}

                {/* Mark as Complete Button */}
                {user && !progress?.completed && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button 
                      onClick={markAsComplete}
                      disabled={saving}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Mark as Complete'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {prevLesson ? (
                <Link to={`/lessons/${prevLesson.id}`}>
                  <Button variant="outline" className="border-border">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Previous:</span> {prevLesson.title.slice(0, 20)}...
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link to={`/lessons/${nextLesson.id}`}>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <span className="hidden sm:inline">Next:</span> {nextLesson.title.slice(0, 20)}...
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : progress?.completed ? (
                course && (
                  <Link to={`/courses/${course.slug}`}>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Return to Course
                    </Button>
                  </Link>
                )
              ) : null}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Progress Card */}
            {user && (
              <Card className="border-border shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground">Lesson Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium text-foreground">
                        {progress?.percent_complete || 0}%
                      </span>
                    </div>
                    <Progress value={progress?.percent_complete || 0} className="h-2" />
                  </div>
                  {progress?.completed && (
                    <div className="mt-4 flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Completed!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Course Info */}
            {course && (
              <Card className="border-border shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground">About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to={`/courses/${course.slug}`} className="text-primary hover:underline font-medium">
                    {course.title}
                  </Link>
                  {module && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Module: {module.title}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonPlayer;
