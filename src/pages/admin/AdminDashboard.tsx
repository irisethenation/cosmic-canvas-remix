import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Users, 
  CreditCard, 
  TrendingUp,
  GraduationCap,
  FileText
} from 'lucide-react';

interface Stats {
  totalCourses: number;
  publishedCourses: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalLessons: number;
  totalModules: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    publishedCourses: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    totalLessons: 0,
    totalModules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        coursesResult,
        publishedCoursesResult,
        usersResult,
        subscriptionsResult,
        lessonsResult,
        modulesResult,
      ] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
        supabase.from('lessons').select('id', { count: 'exact', head: true }),
        supabase.from('modules').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalCourses: coursesResult.count || 0,
        publishedCourses: publishedCoursesResult.count || 0,
        totalUsers: usersResult.count || 0,
        activeSubscriptions: subscriptionsResult.count || 0,
        totalLessons: lessonsResult.count || 0,
        totalModules: modulesResult.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Total Courses', 
      value: stats.totalCourses, 
      subtitle: `${stats.publishedCourses} published`,
      icon: BookOpen, 
      color: 'text-primary' 
    },
    { 
      title: 'Total Modules', 
      value: stats.totalModules, 
      icon: FileText, 
      color: 'text-blue-500' 
    },
    { 
      title: 'Total Lessons', 
      value: stats.totalLessons, 
      icon: GraduationCap, 
      color: 'text-green-500' 
    },
    { 
      title: 'Registered Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'text-amber-500' 
    },
    { 
      title: 'Active Subscriptions', 
      value: stats.activeSubscriptions, 
      icon: CreditCard, 
      color: 'text-emerald-500' 
    },
    { 
      title: 'Conversion Rate', 
      value: stats.totalUsers > 0 ? `${Math.round((stats.activeSubscriptions / stats.totalUsers) * 100)}%` : '0%', 
      icon: TrendingUp, 
      color: 'text-purple-500' 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the iRise Academy Admin Panel</p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="border-border">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.title} className="border-border shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a 
                href="/admin/courses" 
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <BookOpen className="h-6 w-6 text-primary mb-2" />
                <div className="font-medium text-foreground">Manage Courses</div>
                <p className="text-sm text-muted-foreground">Add, edit, or publish courses</p>
              </a>
              <a 
                href="/admin/users" 
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Users className="h-6 w-6 text-primary mb-2" />
                <div className="font-medium text-foreground">Manage Users</div>
                <p className="text-sm text-muted-foreground">View and manage user accounts</p>
              </a>
              <a 
                href="/admin/subscriptions" 
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <CreditCard className="h-6 w-6 text-primary mb-2" />
                <div className="font-medium text-foreground">Subscriptions</div>
                <p className="text-sm text-muted-foreground">Manage active subscriptions</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
