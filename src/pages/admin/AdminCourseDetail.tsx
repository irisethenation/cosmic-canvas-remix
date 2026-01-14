import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ArrowLeft, GripVertical, FileText, Video, Headphones, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface Module {
  id: string;
  title: string;
  summary: string | null;
  order_index: number;
  is_published: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  content_url: string | null;
  video_url: string | null;
  content_text: string | null;
  duration_seconds: number | null;
  is_free: boolean;
  is_published: boolean;
  order_index: number;
}

const contentTypeIcons: Record<string, React.ElementType> = {
  VIDEO: Video,
  AUDIO: Headphones,
  PDF: FileText,
  TEXT: BookOpen,
};

const AdminCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', summary: '', is_published: false });
  
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content_type: 'VIDEO',
    content_url: '',
    video_url: '',
    content_text: '',
    duration_seconds: 0,
    is_free: false,
    is_published: false,
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courseId) fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    const { data: courseData } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('id', courseId)
      .single();

    if (courseData) setCourse(courseData);

    const { data: modulesData } = await supabase
      .from('modules')
      .select(`
        id, title, summary, order_index, is_published,
        lessons (id, title, content_type, content_url, video_url, content_text, duration_seconds, is_free, is_published, order_index)
      `)
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (modulesData) {
      const sorted = modulesData.map(m => ({
        ...m,
        lessons: (m.lessons || []).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
      }));
      setModules(sorted as Module[]);
    }

    setLoading(false);
  };

  // Module handlers
  const openModuleDialog = (module?: Module) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({ title: module.title, summary: module.summary || '', is_published: module.is_published });
    } else {
      setEditingModule(null);
      setModuleForm({ title: '', summary: '', is_published: false });
    }
    setModuleDialogOpen(true);
  };

  const saveModule = async () => {
    if (!moduleForm.title) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingModule) {
        await supabase.from('modules').update({
          title: moduleForm.title,
          summary: moduleForm.summary || null,
          is_published: moduleForm.is_published,
        }).eq('id', editingModule.id);
        toast({ title: 'Success', description: 'Module updated' });
      } else {
        const maxOrder = Math.max(...modules.map(m => m.order_index), -1);
        await supabase.from('modules').insert({
          course_id: courseId,
          title: moduleForm.title,
          summary: moduleForm.summary || null,
          is_published: moduleForm.is_published,
          order_index: maxOrder + 1,
        });
        toast({ title: 'Success', description: 'Module created' });
      }
      setModuleDialogOpen(false);
      fetchCourseData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async (module: Module) => {
    if (!confirm(`Delete "${module.title}" and all its lessons?`)) return;
    await supabase.from('modules').delete().eq('id', module.id);
    toast({ title: 'Success', description: 'Module deleted' });
    fetchCourseData();
  };

  // Lesson handlers
  const openLessonDialog = (moduleId: string, lesson?: Lesson) => {
    setSelectedModuleId(moduleId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        content_type: lesson.content_type,
        content_url: lesson.content_url || '',
        video_url: lesson.video_url || '',
        content_text: lesson.content_text || '',
        duration_seconds: lesson.duration_seconds || 0,
        is_free: lesson.is_free,
        is_published: lesson.is_published,
      });
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '',
        content_type: 'VIDEO',
        content_url: '',
        video_url: '',
        content_text: '',
        duration_seconds: 0,
        is_free: false,
        is_published: false,
      });
    }
    setLessonDialogOpen(true);
  };

  const saveLesson = async () => {
    if (!lessonForm.title || !selectedModuleId) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const module = modules.find(m => m.id === selectedModuleId);
      const maxOrder = Math.max(...(module?.lessons.map(l => l.order_index) || []), -1);

      const lessonData = {
        title: lessonForm.title,
        content_type: lessonForm.content_type,
        content_url: lessonForm.content_url || null,
        video_url: lessonForm.video_url || null,
        content_text: lessonForm.content_text || null,
        duration_seconds: lessonForm.duration_seconds || null,
        is_free: lessonForm.is_free,
        is_published: lessonForm.is_published,
      };

      if (editingLesson) {
        await supabase.from('lessons').update(lessonData).eq('id', editingLesson.id);
        toast({ title: 'Success', description: 'Lesson updated' });
      } else {
        await supabase.from('lessons').insert({
          ...lessonData,
          module_id: selectedModuleId,
          order_index: maxOrder + 1,
        });
        toast({ title: 'Success', description: 'Lesson created' });
      }
      setLessonDialogOpen(false);
      fetchCourseData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (lesson: Lesson) => {
    if (!confirm(`Delete "${lesson.title}"?`)) return;
    await supabase.from('lessons').delete().eq('id', lesson.id);
    toast({ title: 'Success', description: 'Lesson deleted' });
    fetchCourseData();
  };

  const toggleLessonPublished = async (lesson: Lesson) => {
    await supabase.from('lessons').update({ is_published: !lesson.is_published }).eq('id', lesson.id);
    fetchCourseData();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin/courses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{course?.title}</h1>
            <p className="text-muted-foreground">Manage modules and lessons</p>
          </div>
        </div>

        {/* Add Module Button */}
        <div className="flex justify-end">
          <Button onClick={() => openModuleDialog()} className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>

        {/* Modules */}
        {modules.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No modules yet. Create your first module!</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {modules.map((module, index) => (
              <AccordionItem key={module.id} value={module.id} className="border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 bg-muted/30 hover:bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">M{index + 1}</span>
                    <span className="font-medium text-foreground">{module.title}</span>
                    <Badge variant={module.is_published ? "default" : "secondary"} className="ml-2">
                      {module.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto mr-4">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openModuleDialog(module)}>
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteModule(module)}>
                        <Trash2 className="h-3 w-3 mr-1 text-destructive" />
                        Delete
                      </Button>
                    </div>
                    <Button size="sm" onClick={() => openLessonDialog(module.id)} className="bg-gradient-primary">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Lesson
                    </Button>
                  </div>

                  {module.lessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No lessons in this module</p>
                  ) : (
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const Icon = contentTypeIcons[lesson.content_type] || BookOpen;
                        return (
                          <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                            <span className="text-xs text-muted-foreground w-6">{lessonIndex + 1}.</span>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 text-sm font-medium text-foreground">{lesson.title}</span>
                            {lesson.is_free && <Badge variant="outline" className="text-green-600 border-green-500">Free</Badge>}
                            <Switch
                              checked={lesson.is_published}
                              onCheckedChange={() => toggleLessonPublished(lesson)}
                            />
                            <Button variant="ghost" size="sm" onClick={() => openLessonDialog(module.id, lesson)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteLesson(lesson)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Add Module'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                placeholder="Module title"
              />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea
                value={moduleForm.summary}
                onChange={(e) => setModuleForm({ ...moduleForm, summary: e.target.value })}
                placeholder="Brief description..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={moduleForm.is_published}
                onCheckedChange={(checked) => setModuleForm({ ...moduleForm, is_published: checked })}
              />
              <Label>Published</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveModule} disabled={saving} className="bg-gradient-primary">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                placeholder="Lesson title"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select
                  value={lessonForm.content_type}
                  onValueChange={(v) => setLessonForm({ ...lessonForm, content_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="AUDIO">Audio</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="TEXT">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (seconds)</Label>
                <Input
                  type="number"
                  value={lessonForm.duration_seconds}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration_seconds: Number(e.target.value) })}
                />
              </div>
            </div>
            {lessonForm.content_type === 'VIDEO' && (
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}
            {lessonForm.content_type !== 'TEXT' && (
              <div className="space-y-2">
                <Label>Content URL</Label>
                <Input
                  value={lessonForm.content_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, content_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}
            {lessonForm.content_type === 'TEXT' && (
              <div className="space-y-2">
                <Label>Content Text</Label>
                <Textarea
                  value={lessonForm.content_text}
                  onChange={(e) => setLessonForm({ ...lessonForm, content_text: e.target.value })}
                  placeholder="Lesson content..."
                  rows={6}
                />
              </div>
            )}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={lessonForm.is_free}
                  onCheckedChange={(checked) => setLessonForm({ ...lessonForm, is_free: checked })}
                />
                <Label>Free Lesson</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={lessonForm.is_published}
                  onCheckedChange={(checked) => setLessonForm({ ...lessonForm, is_published: checked })}
                />
                <Label>Published</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveLesson} disabled={saving} className="bg-gradient-primary">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCourseDetail;
