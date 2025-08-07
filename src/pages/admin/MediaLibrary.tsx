import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, FileVideo, FileText } from "lucide-react";

const MediaLibrary = () => {
  const handleUpload = () => {
    // TODO: Implement file upload functionality
    console.log("Upload media files");
  };

  const mediaItems = [
    { id: 1, name: "intro-video.mp4", type: "video", size: "45.2 MB", date: "2024-01-15" },
    { id: 2, name: "course-banner.jpg", type: "image", size: "2.1 MB", date: "2024-01-14" },
    { id: 3, name: "syllabus.pdf", type: "document", size: "1.8 MB", date: "2024-01-13" },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <FileVideo className="h-5 w-5 text-blue-400" />;
      case 'image': return <FileImage className="h-5 w-5 text-green-400" />;
      default: return <FileText className="h-5 w-5 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="text-slate-400">Manage your media assets</p>
        </div>
        <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Media Management</CardTitle>
          <CardDescription className="text-slate-400">Upload and organize videos, images, and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mediaItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(item.type)}
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-slate-400 text-sm">{item.size} • {item.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-white border-slate-600 hover:bg-slate-600">
                    View
                  </Button>
                  <Button size="sm" variant="destructive">
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

export default MediaLibrary;