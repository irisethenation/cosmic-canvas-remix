import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getPaddleEnvironment } from '@/lib/paddle';
import { TIER_KEY_TO_TIER } from '@/lib/catalog';

export interface Subscription {
  id: string;
  tier_key: string;
  status: string;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

// The user's current subscription in THIS environment (test vs live), with
// realtime refresh. Access rules mirror the server: active/trialing, past_due
// still in period, and canceled still in period all retain access.
export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('subscriptions')
      .select('id, tier_key, status, price_id, current_period_end, cancel_at_period_end')
      .eq('user_id', user.id)
      .eq('environment', getPaddleEnvironment())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setSubscription(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSubscription();

    if (!user) return;
    const channel = supabase
      .channel(`subscriptions:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${user.id}` },
        () => fetchSubscription()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchSubscription]);

  const now = Date.now();
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).getTime()
    : null;

  const hasAccess =
    !!subscription &&
    (subscription.status === 'ACTIVE' ||
      subscription.status === 'TRIALING' ||
      (subscription.status === 'PAST_DUE' && (periodEnd === null || periodEnd > now)) ||
      (subscription.status === 'CANCELED' && periodEnd !== null && periodEnd > now));

  const tier = hasAccess ? TIER_KEY_TO_TIER[subscription!.tier_key] ?? 0 : 0;

  return {
    subscription,
    loading,
    hasAccess,
    tier,
    isPastDue: subscription?.status === 'PAST_DUE',
    refetch: fetchSubscription,
  };
};
