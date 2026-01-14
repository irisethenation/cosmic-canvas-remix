import { useEffect, useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  slug: string;
  description_md: string;
  tier_required: number;
  is_published: boolean;
  visibility: string;
  cover_url: string | null;
  created_at: string;
}

const tierLabels: Record<number, string> = {
  0: 'Free',
  1: 'Key Master',
  2: 'Master Builder',
  3: 'Mentorship',
};

const AdminCourses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description_md: '',
    tier_required: 0,
    is_published: false,
    visibility: 'SUBSCRIBERS_ONLY',
    cover_url: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch courses', variant: 'destructive' });
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        slug: course.slug,
        description_md: course.description_md,
        tier_required: course.tier_required,
        is_published: course.is_published,
        visibility: course.visibility,
        cover_url: course.cover_url || '',
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        slug: '',
        description_md: '',
        tier_required: 0,
        is_published: false,
        visibility: 'SUBSCRIBERS_ONLY',
        cover_url: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast({ title: 'Error', description: 'Title and slug are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update({
            title: formData.title,
            slug: formData.slug,
            description_md: formData.description_md,
            tier_required: formData.tier_required,
            is_published: formData.is_published,
            visibility: formData.visibility,
            cover_url: formData.cover_url || null,
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Course updated successfully' });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            title: formData.title,
            slug: formData.slug,
            description_md: formData.description_md,
            tier_required: formData.tier_required,
            is_published: formData.is_published,
            visibility: formData.visibility,
            cover_url: formData.cover_url || null,
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Course created successfully' });
      }

      setDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) return;

    const { error } = await supabase.from('courses').delete().eq('id', course.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete course', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Course deleted successfully' });
      fetchCourses();
    }
  };

  const togglePublished = async (course: Course) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !course.is_published })
      .eq('id', course.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update course', variant: 'destructive' });
    } else {
      fetchCourses();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Courses</h1>
            <p className="text-muted-foreground">Manage your course catalog</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: editingCourse ? formData.slug : generateSlug(e.target.value),
                        });
                      }}
                      placeholder="Course title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="course-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description_md}
                    onChange={(e) => setFormData({ ...formData, description_md: e.target.value })}
                    placeholder="Course description..."
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Required Tier</Label>
                    <Select
                      value={String(formData.tier_required)}
                      onValueChange={(v) => setFormData({ ...formData, tier_required: Number(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Free</SelectItem>
                        <SelectItem value="1">Key Master (Tier 1)</SelectItem>
                        <SelectItem value="2">Master Builder (Tier 2)</SelectItem>
                        <SelectItem value="3">Mentorship (Tier 3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(v) => setFormData({ ...formData, visibility: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="SUBSCRIBERS_ONLY">Subscribers Only</SelectItem>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image URL</Label>
                  <Input
                    id="cover"
                    value={formData.cover_url}
                    onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
                    {saving ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-soft">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : courses.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No courses yet. Create your first course!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tierLabels[course.tier_required]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={course.is_published}
                          onCheckedChange={() => togglePublished(course)}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {course.visibility.toLowerCase().replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/courses/${course.id}`}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(course)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(course)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
