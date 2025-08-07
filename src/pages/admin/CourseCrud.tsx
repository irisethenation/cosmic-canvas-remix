import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCrud = () => {
  const navigate = useNavigate();
  const [courses] = useState([
    { id: 1, title: "Agnotology & Epistemic Sovereignty Programme™", published: true, modules: 12 },
    { id: 2, title: "Critical Thinking Fundamentals", published: false, modules: 8 },
    { id: 3, title: "Media Literacy in Digital Age", published: true, modules: 6 },
  ]);

  const handleAddCourse = () => {
    // TODO: Implement add course modal/form
    console.log("Add new course");
  };

  const handleEditCourse = (courseId: number) => {
    // TODO: Implement edit course functionality
    console.log("Edit course:", courseId);
  };

  const handleDeleteCourse = (courseId: number) => {
    // TODO: Implement delete confirmation and deletion
    console.log("Delete course:", courseId);
  };

  const handleViewModules = (courseId: number) => {
    navigate(`/modules/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Courses</h1>
          <p className="text-slate-400">Manage your course content</p>
        </div>
        <Button onClick={handleAddCourse} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Course Management</CardTitle>
          <CardDescription className="text-slate-400">Create, edit, and manage your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">{course.title}</h3>
                  <p className="text-slate-400 text-sm">
                    {course.modules} modules • {course.published ? 'Published' : 'Draft'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleViewModules(course.id)}
                    className="text-white border-slate-600 hover:bg-slate-600"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Modules
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditCourse(course.id)}
                    className="text-white border-slate-600 hover:bg-slate-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCrud;