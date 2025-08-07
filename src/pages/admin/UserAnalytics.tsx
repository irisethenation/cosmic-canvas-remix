import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Analytics</h1>
        <p className="text-muted-foreground">Track user engagement and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Daily active users and session data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">User engagement analytics will be displayed here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Student progress across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Course progress analytics will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAnalytics;