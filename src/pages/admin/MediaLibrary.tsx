import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const MediaLibrary = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your media assets</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
          <CardDescription>Upload and organize videos, images, and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Media library functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibrary;