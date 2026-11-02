import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getPaddleEnvironment } from '@/lib/paddle';
import GeometricBackground from '@/components/GeometricBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

type Status = 'verifying' | 'confirmed' | 'failed';

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 45000;

// Verified checkout return page. Never trusts the URL alone: it polls the
// database until the webhook has recorded the purchase/subscription in this
// environment, then confirms. A spoofed ?checkout=success URL shows "failed".
const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<Status>('verifying');
  const startedAt = useRef(Date.now());

  const purchaseType = searchParams.get('type') || 'subscription';
  const courseId = searchParams.get('courseId');
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setStatus('failed');
      return;
    }

    const env = getPaddleEnvironment();

    const check = async (): Promise<boolean> => {
      if (purchaseType === 'course' && courseId) {
        const { data } = await supabase
          .from('course_purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .eq('environment', env)
          .eq('status', 'paid')
          .maybeSingle();
        return !!data;
      }
      if (purchaseType === 'call') {
        // Confirm the exact booking from this checkout, not just any paid one.
        let query = supabase
          .from('paid_call_bookings')
          .select('id')
          .eq('user_id', user.id)
          .eq('payment_status', 'PAID');
        if (bookingId) query = query.eq('id', bookingId);
        const { data } = await query
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        return !!data;
      }
      const { data } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('environment', env)
        .in('status', ['ACTIVE', 'TRIALING'])
        .limit(1)
        .maybeSingle();
      return !!data;
    };

    let cancelled = false;
    const poll = async () => {
      const done = await check();
      if (cancelled) return;
      if (done) {
        setStatus('confirmed');
        return;
      }
      if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) {
        setStatus('failed');
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    };
    poll();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, purchaseType, courseId]);

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <GeometricBackground />
      <Card className="border-border shadow-soft max-w-md w-full relative z-10">
        <CardContent className="p-8 text-center space-y-4">
          {status === 'verifying' && (
            <>
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <h1 className="text-2xl font-bold text-foreground">Confirming your purchase…</h1>
              <p className="text-muted-foreground">
                We're verifying your payment. This usually takes a few seconds — please don't close this page.
              </p>
            </>
          )}
          {status === 'confirmed' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Purchase confirmed! 🎉</h1>
              <p className="text-muted-foreground">
                {purchaseType === 'course'
                  ? 'The full course is now unlocked. Happy learning!'
                  : purchaseType === 'call'
                    ? 'Your call is booked and paid. We\'ll be in touch to schedule it.'
                    : 'Your subscription is active. Welcome aboard!'}
              </p>
              <Button asChild className="bg-gradient-primary hover:opacity-90 w-full">
                <Link to={purchaseType === 'call' ? '/support/paid-calls' : '/dashboard'}>
                  {purchaseType === 'call' ? 'View my bookings' : 'Go to dashboard'}
                </Link>
              </Button>
            </>
          )}
          {status === 'failed' && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">We couldn't confirm your payment</h1>
              <p className="text-muted-foreground">
                {user
                  ? 'Your payment may still be processing. If you were charged, your access will appear shortly — check your dashboard in a few minutes or contact support.'
                  : 'Please sign in to check your purchase status.'}
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild className="bg-gradient-primary hover:opacity-90 w-full">
                  <Link to="/dashboard">Go to dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-border">
                  <Link to="/support">Contact support</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
