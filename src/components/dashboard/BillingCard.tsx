import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Crown, Sparkles, Star, ShoppingBag, CreditCard, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { usePaddleCheckout } from '@/hooks/usePaddleCheckout';
import { useToast } from '@/hooks/use-toast';
import { getPaddleEnvironment } from '@/lib/paddle';
import { SUBSCRIPTION_PLANS } from '@/lib/catalog';

const tierConfig: Record<string, { name: string; icon: React.ElementType; color: string }> = {
  TIER_1_KEY_MASTER: { name: 'Key Master', icon: Star, color: 'bg-primary text-primary-foreground' },
  TIER_2_LEARNED_MASTER_BUILDER: { name: 'Learned Master Builder', icon: Sparkles, color: 'bg-accent text-accent-foreground' },
  TIER_3_PRIVATE_MENTORSHIP: { name: 'Private Mentorship', icon: Crown, color: 'bg-brand-purple text-primary-foreground' },
};

const planIcons: Record<number, React.ElementType> = { 1: Star, 2: Sparkles, 3: Crown };

// Full billing self-service: subscribe, change plan (with proration preview),
// cancel/resume, manage payment method, and view payment history.
export const BillingCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscription, loading, hasAccess, isPastDue, refetch } = useSubscription();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ priceId: string; name: string; total: string | null } | null>(null);
  const [history, setHistory] = useState<{ id: string; amount: number | null; currency: string | null; status: string; created_at: string }[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const invoke = async (action: string, extra: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke('manage-subscription', {
      body: { action, environment: getPaddleEnvironment(), ...extra },
    });
    if (error) throw new Error(data?.error || error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const subscribe = (priceId: string) => {
    if (!user) return;
    openCheckout({
      priceId,
      customerEmail: user.email,
      customData: { userId: user.id },
      successUrl: `${window.location.origin}/checkout/success?type=subscription`,
    });
  };

  const startPlanChange = async (priceId: string, name: string) => {
    setBusy(priceId);
    try {
      const data = await invoke('preview_change', { newPriceId: priceId });
      const total = data.immediateTotal
        ? `${data.currency === 'GBP' ? '£' : ''}${(Number(data.immediateTotal) / 100).toFixed(2)}`
        : null;
      setPreview({ priceId, name, total });
    } catch (e) {
      toast({ title: 'Preview failed', description: e instanceof Error ? e.message : 'Could not preview plan change', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const confirmPlanChange = async () => {
    if (!preview) return;
    setBusy(preview.priceId);
    try {
      await invoke('apply_change', { newPriceId: preview.priceId });
      toast({ title: 'Plan updated', description: `You're now on ${preview.name}. Changes apply immediately.` });
      setPreview(null);
      refetch();
    } catch (e) {
      toast({ title: 'Plan change failed', description: e instanceof Error ? e.message : 'Could not change plan', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const cancelSubscription = async () => {
    setBusy('cancel');
    try {
      await invoke('cancel');
      toast({ title: 'Subscription canceled', description: 'You keep access until the end of your paid period.' });
      refetch();
    } catch (e) {
      toast({ title: 'Cancel failed', description: e instanceof Error ? e.message : 'Could not cancel', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const resumeSubscription = async () => {
    setBusy('resume');
    try {
      await invoke('resume');
      toast({ title: 'Subscription resumed', description: 'Your plan will renew as normal.' });
      refetch();
    } catch (e) {
      toast({ title: 'Resume failed', description: e instanceof Error ? e.message : 'Could not resume', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const openPortal = async () => {
    setBusy('portal');
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { environment: getPaddleEnvironment() },
      });
      if (error || !data?.url) throw new Error(data?.error || error?.message || 'No portal URL');
      window.open(data.url, '_blank');
    } catch (e) {
      toast({ title: 'Portal unavailable', description: e instanceof Error ? e.message : 'Could not open billing portal', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const loadHistory = async () => {
    if (!user || historyLoaded) return;
    const { data } = await supabase
      .from('payment_transactions')
      .select('id, amount, currency, status, created_at')
      .eq('user_id', user.id)
      .eq('environment', getPaddleEnvironment())
      .order('created_at', { ascending: false })
      .limit(10);
    setHistory(data || []);
    setHistoryLoaded(true);
  };

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
  const currentTier = subscription ? SUBSCRIPTION_PLANS.find(p => p.priceId === subscription.price_id)?.tier : undefined;

  return (
    <Card className="border-border shadow-soft overflow-hidden">
      <div className="h-1 bg-gradient-primary" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TierIcon className="h-5 w-5 text-primary" />
          Subscription &amp; Billing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPastDue && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Payment failed</p>
              <p className="text-muted-foreground">We're retrying your payment. Update your payment method to keep your access.</p>
              <Button variant="outline" size="sm" className="mt-2 border-border" onClick={openPortal} disabled={busy === 'portal'}>
                Update payment method
              </Button>
            </div>
          </div>
        )}

        {subscription && hasAccess ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Plan</span>
              <Badge className={tierInfo?.color || 'bg-muted'}>
                {tierInfo?.name || subscription.tier_key}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className={subscription.cancel_at_period_end ? 'border-amber-500 text-amber-600' : 'border-green-500 text-green-600'}>
                {subscription.cancel_at_period_end ? 'Cancels at period end' : subscription.status}
              </Badge>
            </div>
            {subscription.current_period_end && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{subscription.cancel_at_period_end ? 'Access until' : 'Renews'}</span>
                <span className="text-sm text-foreground">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Change plan</p>
              {SUBSCRIPTION_PLANS.filter(p => p.tier !== currentTier).map((plan) => {
                const Icon = planIcons[plan.tier];
                return (
                  <Button
                    key={plan.priceId}
                    variant="outline"
                    disabled={busy !== null}
                    onClick={() => startPlanChange(plan.priceId, plan.name)}
                    className="w-full justify-between border-border hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      {plan.tier > (currentTier ?? 0) ? 'Upgrade to' : 'Switch to'} {plan.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {busy === plan.priceId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : plan.priceLabel}
                    </span>
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={openPortal} disabled={busy !== null} className="border-border">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment method &amp; invoices
              </Button>
              {subscription.cancel_at_period_end ? (
                <Button variant="outline" size="sm" onClick={resumeSubscription} disabled={busy !== null} className="border-border">
                  Resume subscription
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={cancelSubscription} disabled={busy !== null} className="text-muted-foreground">
                  Cancel subscription
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <p className="text-muted-foreground">You don't have an active subscription</p>
            <div className="space-y-2 pt-2">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const Icon = planIcons[plan.tier];
                return (
                  <Button
                    key={plan.priceId}
                    variant="outline"
                    disabled={checkoutLoading}
                    onClick={() => subscribe(plan.priceId)}
                    className="w-full justify-between border-border hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      {plan.name}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {plan.priceLabel}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment history */}
        <div className="pt-2 border-t border-border">
          {!historyLoaded ? (
            <Button variant="link" size="sm" onClick={loadHistory} className="px-0 text-muted-foreground">
              View payment history
            </Button>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payments yet</p>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Payment history</p>
              {history.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</span>
                  <span className="text-foreground">
                    {tx.amount != null ? `${tx.currency === 'GBP' ? '£' : ''}${tx.amount.toFixed(2)}` : '—'}
                  </span>
                  <Badge variant="outline" className="border-border text-xs">{tx.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Proration preview confirmation */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm plan change</DialogTitle>
            <DialogDescription>
              Switching to {preview?.name} applies immediately with proration.
              {preview?.total
                ? ` You'll be charged ${preview.total} now for the remainder of this billing period.`
                : ' The prorated amount will be shown at confirmation.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPreview(null)} className="border-border">
              Back
            </Button>
            <Button onClick={confirmPlanChange} disabled={busy !== null} className="bg-gradient-primary hover:opacity-90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
