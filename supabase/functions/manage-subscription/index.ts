import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { getPaddleClient, gatewayFetch, type PaddleEnv } from '../_shared/paddle.ts';
import { getAuthenticatedUser, getServiceClient } from '../_shared/auth.ts';
import { SUBSCRIPTION_PRICE_IDS } from '../_shared/catalog.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

async function resolvePaddlePriceId(env: PaddleEnv, externalId: string): Promise<string | null> {
  const res = await gatewayFetch(env, `/prices?external_id=${encodeURIComponent(externalId)}`);
  const data = await res.json();
  return data?.data?.[0]?.id ?? null;
}

// Subscription self-service: preview/apply a prorated plan change, cancel at
// period end, or resume a scheduled cancellation.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const body = await req.json().catch(() => ({}));
    const action = typeof body?.action === 'string' ? body.action : '';
    const env: PaddleEnv = body?.environment === 'live' ? 'live' : 'sandbox';
    const newPriceId = typeof body?.newPriceId === 'string' ? body.newPriceId : null;

    if (!['preview_change', 'apply_change', 'cancel', 'resume'].includes(action)) {
      return json({ error: 'Unknown action' }, 400);
    }
    if ((action === 'preview_change' || action === 'apply_change') &&
        (!newPriceId || !(SUBSCRIPTION_PRICE_IDS as readonly string[]).includes(newPriceId))) {
      return json({ error: 'Unknown or missing newPriceId' }, 400);
    }

    // The user's current subscription in this environment.
    const { data: sub } = await getServiceClient()
      .from('subscriptions')
      .select('paddle_subscription_id, price_id, status')
      .eq('user_id', user.id)
      .eq('environment', env)
      .in('status', ['ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED'])
      .not('paddle_subscription_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub?.paddle_subscription_id) {
      return json({ error: 'No subscription found' }, 404);
    }

    const paddle = getPaddleClient(env);
    const paddleSubId = sub.paddle_subscription_id;

    if (action === 'cancel') {
      await paddle.subscriptions.cancel(paddleSubId, { effectiveFrom: 'next_billing_period' });
      return json({ ok: true });
    }

    if (action === 'resume') {
      await paddle.subscriptions.update(paddleSubId, { scheduledChange: null });
      return json({ ok: true });
    }

    const paddlePriceId = await resolvePaddlePriceId(env, newPriceId!);
    if (!paddlePriceId) return json({ error: 'Price not found' }, 404);

    const changeRequest = {
      items: [{ priceId: paddlePriceId, quantity: 1 }],
      prorationBillingMode: 'prorated_immediately' as const,
    };

    if (action === 'preview_change') {
      const preview = await paddle.subscriptions.previewUpdate(paddleSubId, changeRequest);
      const immediate = preview.updateSummary?.immediateTransaction;
      return json({
        ok: true,
        immediateTotal: immediate?.details?.totals?.total ?? null,
        currency: preview.updateSummary?.currencyCode ?? null,
        nextBilledAt: preview.nextTransaction?.billingPeriod?.endsAt ?? null,
      });
    }

    // apply_change — prorated immediately; failed payment keeps the old plan
    // because the provider only applies the change on successful collection.
    await paddle.subscriptions.update(paddleSubId, changeRequest);
    return json({ ok: true });
  } catch (e) {
    console.error('manage-subscription error:', e);
    return json({ error: 'Subscription operation failed' }, 500);
  }
});
