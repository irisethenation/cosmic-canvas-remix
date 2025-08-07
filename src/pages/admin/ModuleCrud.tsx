import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ModuleCrud = () => {
  const { courseId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Modules</h1>
          <p className="text-muted-foreground">Manage modules for course {courseId}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Management</CardTitle>
          <CardDescription>Create, edit, and organize course modules</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Module CRUD functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleCrud;