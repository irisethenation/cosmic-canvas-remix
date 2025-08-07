import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
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
    </div>
  );
};

export default Dashboard;