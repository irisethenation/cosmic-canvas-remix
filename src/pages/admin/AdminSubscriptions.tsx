import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard } from 'lucide-react';

interface Subscription {
  id: string;
  user_id: string;
  tier_key: string;
  status: string;
  provider: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}

const tierLabels: Record<string, string> = {
  TIER_1_KEY_MASTER: 'Key Master',
  TIER_2_LEARNED_MASTER_BUILDER: 'Master Builder',
  TIER_3_PRIVATE_MENTORSHIP: 'Mentorship',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-500/10 text-green-600 border-green-500',
  TRIALING: 'bg-blue-500/10 text-blue-600 border-blue-500',
  PAST_DUE: 'bg-amber-500/10 text-amber-600 border-amber-500',
  CANCELED: 'bg-destructive/10 text-destructive border-destructive',
  INCOMPLETE: 'bg-muted text-muted-foreground border-border',
};

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      setSubscriptions(data || []);
      setLoading(false);
    };

    fetchSubscriptions();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">View and manage user subscriptions</p>
        </div>

        <Card className="border-border shadow-soft">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : subscriptions.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No subscriptions yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Period End</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-mono text-sm">
                        {sub.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {tierLabels[sub.tier_key] || sub.tier_key}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[sub.status]}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{sub.provider}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {sub.current_period_end 
                          ? new Date(sub.current_period_end).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString()}
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

export default AdminSubscriptions;
