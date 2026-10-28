import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyWebhook, EventName, type PaddleEnv } from '../_shared/paddle.ts';

// Human-readable price/product IDs -> business effects.
const TIER_PRICE_TO_TIER: Record<string, number> = {
  key_master_monthly: 1,
  learned_master_builder_monthly: 2,
  private_mentorship_monthly: 3,
};

const COURSE_PRICE_IDS = new Set(['agnotology_programme_once']);

const CALL_PRICE_IDS = new Set([
  'morpheus_express_call_once',
  'morpheus_standard_call_once',
  'morpheus_deep_dive_once',
  'human_expert_consultation_once',
]);

// Paddle lowercase statuses -> existing uppercase enum values.
const STATUS_MAP: Record<string, string> = {
  active: 'ACTIVE',
  trialing: 'TRIALING',
  past_due: 'PAST_DUE',
  paused: 'CANCELED',
  canceled: 'CANCELED',
};

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }
  return _supabase;
}

function tierForPrice(priceId: string | null | undefined): number {
  if (!priceId) return 0;
  return TIER_PRICE_TO_TIER[priceId] ?? 0;
}

// Recompute the caller's tier from all of their subscriptions in this
// environment. Active (and past-due, which is dunning — access stays) and
// canceled-but-still-in-period subscriptions grant their tier; everything
// else is ignored.
async function recomputeTier(userId: string, env: PaddleEnv) {
  const supabase = getSupabase();
  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('tier_key, status, current_period_end')
    .eq('user_id', userId)
    .eq('environment', env);

  if (error || !subs) {
    console.error('recomputeTier query failed', error);
    return;
  }

  const now = Date.now();
  const TIER_KEY_TO_TIER: Record<string, number> = {
    TIER_1_KEY_MASTER: 1,
    TIER_2_LEARNED_MASTER_BUILDER: 2,
    TIER_3_PRIVATE_MENTORSHIP: 3,
  };

  let maxTier = 0;
  for (const sub of subs) {
    const tier = TIER_KEY_TO_TIER[sub.tier_key] ?? 0;
    const status = sub.status;
    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
    const grantsAccess =
      status === 'ACTIVE' ||
      status === 'TRIALING' ||
      (status === 'PAST_DUE' && (periodEnd === null || periodEnd > now)) ||
      (status === 'CANCELED' && periodEnd !== null && periodEnd > now);
    if (grantsAccess && tier > maxTier) maxTier = tier;
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_tier')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile && profile.user_tier !== maxTier) {
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ user_tier: maxTier })
      .eq('user_id', userId);
    if (updateError) console.error('Failed to update user_tier', updateError);
  }
}

async function handleSubscriptionCreated(data: any, env: PaddleEnv) {
  const { id, customerId, items, status, currentBillingPeriod, customData } = data;

  const userId = customData?.userId;
  if (!userId) {
    console.error('No userId in customData');
    return;
  }

  const item = items[0];
  const priceId = item.price.importMeta?.externalId;
  const productId = item.product?.importMeta?.externalId;
  if (!priceId || !productId) {
    // Product/price was not created via create_product / create_price, so we
    // have no human-readable ID to map tiers off.
    console.warn('Skipping subscription: missing importMeta.externalId', {
      rawPriceId: item.price.id,
      rawProductId: item.product?.id,
    });
    return;
  }

  const tier = tierForPrice(priceId);
  if (tier === 0) {
    console.warn('Subscription for unknown price, skipping tier mapping', { priceId });
  }

  const mappedStatus = STATUS_MAP[status] ?? 'INCOMPLETE';

  await getSupabase().from('subscriptions').upsert(
    {
      user_id: userId,
      tier_key:
        tier === 1
          ? 'TIER_1_KEY_MASTER'
          : tier === 2
            ? 'TIER_2_LEARNED_MASTER_BUILDER'
            : tier === 3
              ? 'TIER_3_PRIVATE_MENTORSHIP'
              : 'TIER_1_KEY_MASTER',
      provider: 'paddle',
      provider_customer_id: customerId,
      provider_subscription_id: id,
      paddle_subscription_id: id,
      paddle_customer_id: customerId,
      product_id: productId,
      price_id: priceId,
      status: mappedStatus,
      current_period_start: currentBillingPeriod?.startsAt ?? null,
      current_period_end: currentBillingPeriod?.endsAt ?? null,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  await recomputeTier(userId, env);
}

async function handleSubscriptionUpdated(data: any, env: PaddleEnv) {
  const { id, status, currentBillingPeriod, scheduledChange, items } = data;

  const update: Record<string, unknown> = {
    status: STATUS_MAP[status] ?? status,
    current_period_start: currentBillingPeriod?.startsAt ?? null,
    current_period_end: currentBillingPeriod?.endsAt ?? null,
    cancel_at_period_end: scheduledChange?.action === 'cancel',
    updated_at: new Date().toISOString(),
  };

  const priceId = items?.[0]?.price?.importMeta?.externalId;
  const tier = tierForPrice(priceId);
  if (tier > 0) {
    update.price_id = priceId;
    update.tier_key =
      tier === 1
        ? 'TIER_1_KEY_MASTER'
        : tier === 2
          ? 'TIER_2_LEARNED_MASTER_BUILDER'
          : 'TIER_3_PRIVATE_MENTORSHIP';
  }

  const { data: sub } = await getSupabase()
    .from('subscriptions')
    .select('user_id')
    .eq('paddle_subscription_id', id)
    .eq('environment', env)
    .maybeSingle();

  if (!sub) {
    console.warn('subscription.updated for unknown subscription', { id, env });
    return;
  }

  await getSupabase()
    .from('subscriptions')
    .update(update)
    .eq('paddle_subscription_id', id)
    .eq('environment', env);

  // Prorated plan changes land here; recompute tier for the new price.
  await recomputeTier(sub.user_id, env);
}

async function handleSubscriptionCanceled(data: any, env: PaddleEnv) {
  const { id } = data;

  const { data: sub } = await getSupabase()
    .from('subscriptions')
    .select('user_id, current_period_end')
    .eq('paddle_subscription_id', id)
    .eq('environment', env)
    .maybeSingle();

  if (!sub) {
    console.warn('subscription.canceled for unknown subscription', { id, env });
    return;
  }

  // Canceled rows keep their current_period_end, so the grace period
  // ("access until the paid period ends") stays enforced by recomputeTier.
  await getSupabase()
    .from('subscriptions')
    .update({ status: 'CANCELED', cancel_at_period_end: true, updated_at: new Date().toISOString() })
    .eq('paddle_subscription_id', id)
    .eq('environment', env);

  await recomputeTier(sub.user_id, env);
}

async function handleTransactionCompleted(data: any, env: PaddleEnv) {
  const { id, items, customData } = data;

  const userId = customData?.userId;
  if (!userId) {
    console.warn('transaction.completed without userId in customData', { id });
    return;
  }

  const priceId = items?.[0]?.price?.importMeta?.externalId;
  if (!priceId) {
    console.warn('transaction.completed missing price externalId', { id });
    return;
  }

  const supabase = getSupabase();

  if (COURSE_PRICE_IDS.has(priceId)) {
    const courseId = customData?.courseId;
    if (!courseId) {
      console.warn('Course purchase without courseId in customData', { id });
      return;
    }

    // One purchase row per user + course; idempotent on retry.
    const { data: existing } = await supabase
      .from('course_purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (existing) {
      console.log('Course already purchased, ignoring duplicate', { userId, courseId });
      return;
    }

    const { error } = await supabase.from('course_purchases').insert({
      user_id: userId,
      course_id: courseId,
      transaction_id: id,
      price_id: priceId,
      environment: env,
      status: 'paid',
    });
    if (error) console.error('Failed to insert course_purchases', error);
    return;
  }

  if (CALL_PRICE_IDS.has(priceId)) {
    const bookingId = customData?.bookingId;
    if (!bookingId) {
      console.warn('Call purchase without bookingId in customData', { id });
      return;
    }

    const { error } = await supabase
      .from('paid_call_bookings')
      .update({
        payment_status: 'PAID',
        stripe_checkout_session_id: id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);
    if (error) console.error('Failed to mark call booking paid', error);
    return;
  }

  console.log('transaction.completed for unhandled price', { priceId });
}

async function handleWebhook(req: Request, env: PaddleEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.eventType) {
    case EventName.SubscriptionCreated:
      await handleSubscriptionCreated(event.data, env);
      break;
    case EventName.SubscriptionUpdated:
      await handleSubscriptionUpdated(event.data, env);
      break;
    case EventName.SubscriptionCanceled:
      await handleSubscriptionCanceled(event.data, env);
      break;
    case EventName.TransactionCompleted:
      await handleTransactionCompleted(event.data, env);
      break;
    default:
      // Unhandled events (e.g. transaction.payment_failed) — log and return 200.
      console.log('Unhandled event:', event.eventType);
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as PaddleEnv;
  try {
    await handleWebhook(req, env);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook error:', e);
    return new Response('Webhook error', { status: 400 });
  }
});
