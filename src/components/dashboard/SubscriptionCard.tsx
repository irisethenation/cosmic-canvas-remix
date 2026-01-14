import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Subscription {
  id: string;
  tier_key: string;
  status: string;
  current_period_end: string | null;
}

interface UserProfile {
  user_tier: number;
}

const tierConfig: Record<string, { name: string; icon: React.ElementType; color: string }> = {
  TIER_1_KEY_MASTER: { name: 'Key Master', icon: Star, color: 'bg-primary text-primary-foreground' },
  TIER_2_LEARNED_MASTER_BUILDER: { name: 'Learned Master Builder', icon: Sparkles, color: 'bg-accent text-accent-foreground' },
  TIER_3_PRIVATE_MENTORSHIP: { name: 'Private Mentorship', icon: Crown, color: 'bg-brand-purple text-primary-foreground' },
};

export const SubscriptionCard = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [subResult, profileResult] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('id, tier_key, status, current_period_end')
          .eq('user_id', user.id)
          .eq('status', 'ACTIVE')
          .maybeSingle(),
        supabase
          .from('user_profiles')
          .select('user_tier')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      setSubscription(subResult.data);
      setProfile(profileResult.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-6 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const tierInfo = subscription ? tierConfig[subscription.tier_key] : null;
  const TierIcon = tierInfo?.icon || Star;

  return (
    <Card className="border-border shadow-soft overflow-hidden">
      <div className="h-1 bg-gradient-primary" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TierIcon className="h-5 w-5 text-primary" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Plan</span>
              <Badge className={tierInfo?.color || 'bg-muted'}>
                {tierInfo?.name || subscription.tier_key}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className="border-green-500 text-green-600">
                {subscription.status}
              </Badge>
            </div>
            {subscription.current_period_end && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Renews</span>
                <span className="text-sm text-foreground">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <p className="text-muted-foreground">
              You don't have an active subscription
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Tier</span>
              <Badge variant="secondary">Free (Tier {profile?.user_tier || 0})</Badge>
            </div>
            <Button className="w-full bg-gradient-primary hover:opacity-90">
              Upgrade Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
