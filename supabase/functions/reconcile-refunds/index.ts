import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { gatewayFetch, type PaddleEnv } from '../_shared/paddle.ts';
import { getServiceClient } from '../_shared/auth.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Reconciles approved refunds with entitlements. The app webhook destination
// does not receive adjustment events, so this runs on a schedule (or manually)
// and revokes access for refunded transactions.
//
// Auth: requires the service role key as a bearer token, so only backend
// callers (cron, admin tooling) can trigger it.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = getServiceClient();
  const results: Record<string, number> = { purchasesRefunded: 0, bookingsRefunded: 0, errors: 0 };

  for (const env of ['sandbox', 'live'] as PaddleEnv[]) {
    // Course purchases still marked paid
    const { data: purchases, error } = await supabase
      .from('course_purchases')
      .select('id, transaction_id')
      .eq('environment', env)
      .eq('status', 'paid');

    if (error) {
      console.error('reconcile query failed', error);
      results.errors++;
      continue;
    }

    for (const purchase of purchases ?? []) {
      try {
        const res = await gatewayFetch(
          env,
          `/adjustments?transaction_id=${encodeURIComponent(purchase.transaction_id)}`
        );
        const data = await res.json();
        const refunded = (data?.data ?? []).some(
          (a: any) => a.action === 'refund' && a.status === 'approved'
        );
        if (refunded) {
          const { error: updateError } = await supabase
            .from('course_purchases')
            .update({ status: 'refunded' })
            .eq('id', purchase.id);
          if (updateError) throw updateError;
          await supabase
            .from('payment_transactions')
            .update({ status: 'refunded' })
            .eq('paddle_transaction_id', purchase.transaction_id)
            .eq('environment', env);
          results.purchasesRefunded++;
        }
      } catch (e) {
        console.error('reconcile item failed', { id: purchase.id, e });
        results.errors++;
      }
    }

    // Paid call bookings
    const { data: bookings } = await supabase
      .from('paid_call_bookings')
      .select('id, stripe_checkout_session_id')
      .eq('payment_status', 'PAID')
      .not('stripe_checkout_session_id', 'is', null);

    for (const booking of bookings ?? []) {
      try {
        const res = await gatewayFetch(
          env,
          `/adjustments?transaction_id=${encodeURIComponent(booking.stripe_checkout_session_id)}`
        );
        const data = await res.json();
        const refunded = (data?.data ?? []).some(
          (a: any) => a.action === 'refund' && a.status === 'approved'
        );
        if (refunded) {
          const { error: updateError } = await supabase
            .from('paid_call_bookings')
            .update({ payment_status: 'REFUNDED', status: 'CANCELED', updated_at: new Date().toISOString() })
            .eq('id', booking.id);
          if (updateError) throw updateError;
          results.bookingsRefunded++;
        }
      } catch (e) {
        console.error('reconcile booking failed', { id: booking.id, e });
        results.errors++;
      }
    }
  }

  return json({ ok: true, ...results });
});
