import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import GeometricBackground from '@/components/GeometricBackground';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { ProgressSummary } from '@/components/dashboard/ProgressSummary';
import { DashboardCourseGrid } from '@/components/dashboard/DashboardCourseGrid';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/5b04634a-8b34-4b3f-b5d4-9ca573b411f1.png" 
              alt="iRise Academy" 
              className="h-10 w-auto"
            />
            <span className="font-bold text-xl text-foreground">iRise Academy</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
              className="border-border"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey with iRise Academy
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-1">
            <SubscriptionCard />
          </div>
          <div className="lg:col-span-2">
            <ProgressSummary />
          </div>
        </div>

        <DashboardCourseGrid />
      </main>
    </div>
  );
};

export default Dashboard;
