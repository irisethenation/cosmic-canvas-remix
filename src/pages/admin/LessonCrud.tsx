import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const LessonCrud = () => {
  const { moduleId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lessons</h1>
          <p className="text-muted-foreground">Manage lessons for module {moduleId}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Management</CardTitle>
          <CardDescription>Create, edit, and organize module lessons</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Lesson CRUD functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonCrud;