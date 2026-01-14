import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  overallProgress: number;
}

export const ProgressSummary = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats>({
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    overallProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('status, completed')
        .eq('user_id', user.id);

      if (progress) {
        const completed = progress.filter(p => p.completed).length;
        const inProgress = progress.filter(p => p.status === 'IN_PROGRESS' && !p.completed).length;
        const total = progress.length || 1;

        setStats({
          totalLessons: progress.length,
          completedLessons: completed,
          inProgressLessons: inProgress,
          overallProgress: Math.round((completed / total) * 100),
        });
      }

      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-2 bg-muted rounded w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-soft overflow-hidden">
      <div className="h-1 bg-gradient-primary" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{stats.overallProgress}%</span>
          </div>
          <Progress value={stats.overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalLessons}</div>
            <div className="text-xs text-muted-foreground">Started</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.inProgressLessons}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.completedLessons}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
