import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Search, Users } from 'lucide-react';

interface UserProfile {
  user_id: string;
  user_tier: number;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

interface UserWithDetails {
  user_id: string;
  email: string;
  user_tier: number;
  role: string;
  created_at: string;
}

const tierLabels: Record<number, string> = {
  0: 'Free',
  1: 'Key Master',
  2: 'Master Builder',
  3: 'Mentorship',
};

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Fetch user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, user_tier, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Fetch user roles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    const roleMap: Record<string, string> = {};
    roles?.forEach(r => {
      roleMap[r.user_id] = r.role;
    });

    // Combine data - we can't directly query auth.users, so we'll show user_id
    const usersWithDetails: UserWithDetails[] = (profiles || []).map(p => ({
      user_id: p.user_id,
      email: p.user_id.substring(0, 8) + '...', // Truncated ID as placeholder
      user_tier: p.user_tier,
      role: roleMap[p.user_id] || 'VISITOR',
      created_at: p.created_at,
    }));

    setUsers(usersWithDetails);
    setLoading(false);
  };

  const updateUserTier = async (userId: string, newTier: number) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ user_tier: newTier })
      .eq('user_id', userId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update tier', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User tier updated' });
      fetchUsers();
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole as any })
      .eq('user_id', userId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User role updated' });
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card className="border-border shadow-soft">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-mono text-sm">{user.user_id}</TableCell>
                      <TableCell>
                        <Select
                          value={String(user.user_tier)}
                          onValueChange={(v) => updateUserTier(user.user_id, Number(v))}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Free</SelectItem>
                            <SelectItem value="1">Key Master</SelectItem>
                            <SelectItem value="2">Master Builder</SelectItem>
                            <SelectItem value="3">Mentorship</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(v) => updateUserRole(user.user_id, v)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VISITOR">Visitor</SelectItem>
                            <SelectItem value="STUDENT_KEY_MASTER">Student</SelectItem>
                            <SelectItem value="GRADUATE_LEARNED_MASTER_BUILDER">Graduate</SelectItem>
                            <SelectItem value="AMBASSADOR">Ambassador</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
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

export default AdminUsers;
