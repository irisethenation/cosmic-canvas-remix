import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Upload, Mail, Brain, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { title: "Manage Courses", icon: BookOpen, path: "/courses", description: "Create and edit courses" },
    { title: "Upload Media", icon: Upload, path: "/media", description: "Add videos and images" },
    { title: "View Analytics", icon: BarChart3, path: "/users", description: "Student progress data" },
    { title: "Email Campaigns", icon: Mail, path: "/email", description: "Send newsletters" },
    { title: "AI Knowledge", icon: Brain, path: "/ai-kb", description: "Manage AI content" },
    { title: "User Management", icon: Users, path: "/users", description: "View user profiles" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-300">Welcome to the IRISE Academy admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Total Courses</CardTitle>
            <CardDescription className="text-slate-300">Active courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Total Students</CardTitle>
            <CardDescription className="text-slate-300">Enrolled users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,234</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Completion Rate</CardTitle>
            <CardDescription className="text-slate-300">Average completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">78%</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Active Lessons</CardTitle>
            <CardDescription className="text-slate-300">Published lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">156</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-300">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                onClick={() => navigate(action.path)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 text-left bg-slate-600 border-slate-500 hover:bg-slate-500 text-white"
              >
                <div className="flex items-center gap-2">
                  <action.icon className="h-5 w-5" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-sm text-slate-300">{action.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;