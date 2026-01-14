import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, Pencil, Trash2, Bell } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  body_markdown: string;
  audience: string;
  is_published: boolean;
  publish_at: string | null;
  created_at: string;
}

const audienceLabels: Record<string, string> = {
  ALL: 'All Users',
  TIER_1: 'Key Master',
  TIER_2: 'Master Builder',
  TIER_3: 'Mentorship',
  ADMINS_ONLY: 'Admins Only',
};

const AdminNotices = () => {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    body_markdown: '',
    audience: 'ALL',
    is_published: false,
    publish_at: '',
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch notices', variant: 'destructive' });
    } else {
      setNotices(data || []);
    }
    setLoading(false);
  };

  const openDialog = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        body_markdown: notice.body_markdown,
        audience: notice.audience,
        is_published: notice.is_published,
        publish_at: notice.publish_at || '',
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        body_markdown: '',
        audience: 'ALL',
        is_published: false,
        publish_at: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.body_markdown) {
      toast({ title: 'Error', description: 'Title and body are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const noticeData = {
        title: formData.title,
        body_markdown: formData.body_markdown,
        audience: formData.audience,
        is_published: formData.is_published,
        publish_at: formData.publish_at || null,
      };

      if (editingNotice) {
        await supabase.from('notices').update(noticeData).eq('id', editingNotice.id);
        toast({ title: 'Success', description: 'Notice updated' });
      } else {
        await supabase.from('notices').insert(noticeData);
        toast({ title: 'Success', description: 'Notice created' });
      }

      setDialogOpen(false);
      fetchNotices();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (notice: Notice) => {
    if (!confirm(`Delete "${notice.title}"?`)) return;

    const { error } = await supabase.from('notices').delete().eq('id', notice.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Notice deleted' });
      fetchNotices();
    }
  };

  const togglePublished = async (notice: Notice) => {
    await supabase.from('notices').update({ is_published: !notice.is_published }).eq('id', notice.id);
    fetchNotices();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notices</h1>
            <p className="text-muted-foreground">Manage announcements and notifications</p>
          </div>
          <Button onClick={() => openDialog()} className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Notice
          </Button>
        </div>

        <Card className="border-border shadow-soft">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : notices.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notices yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{audienceLabels[notice.audience]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={notice.is_published}
                          onCheckedChange={() => togglePublished(notice)}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDialog(notice)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(notice)}>
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

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNotice ? 'Edit Notice' : 'Add Notice'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notice title"
              />
            </div>
            <div className="space-y-2">
              <Label>Body (Markdown)</Label>
              <Textarea
                value={formData.body_markdown}
                onChange={(e) => setFormData({ ...formData, body_markdown: e.target.value })}
                placeholder="Notice content..."
                rows={6}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(v) => setFormData({ ...formData, audience: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Users</SelectItem>
                    <SelectItem value="TIER_1">Key Master</SelectItem>
                    <SelectItem value="TIER_2">Master Builder</SelectItem>
                    <SelectItem value="TIER_3">Mentorship</SelectItem>
                    <SelectItem value="ADMINS_ONLY">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule (optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.publish_at}
                  onChange={(e) => setFormData({ ...formData, publish_at: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label>Published</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNotices;
