import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyWebhook, EventName, type PaddleEnv } from '../_shared/paddle.ts';

// Human-readable price/product IDs -> business effects.
const TIER_PRICE_TO_TIER: Record<string, number> = {
  key_master_monthly: 1,
  learned_master_builder_monthly: 2,
  private_mentorship_monthly: 3,
};

const TIER_TO_TIER_KEY: Record<number, string> = {
  1: 'TIER_1_KEY_MASTER',
  2: 'TIER_2_LEARNED_MASTER_BUILDER',
  3: 'TIER_3_PRIVATE_MENTORSHIP',
};

const COURSE_PRICE_IDS = new Set(['agnotology_programme_once']);

// Call price ID -> paid_call_products.name, used to validate that the booking
// being marked paid actually matches the product that was purchased.
const CALL_PRICE_TO_PRODUCT_NAME: Record<string, string> = {
  morpheus_express_call_once: 'Morpheus Express Call',
  morpheus_standard_call_once: 'Morpheus Standard Call',
  morpheus_deep_dive_once: 'Morpheus Deep Dive',
  human_expert_consultation_once: 'Human Expert Consultation',
};

// Paddle lowercase statuses -> existing uppercase enum values.
// Paused grants no access (INCOMPLETE); effective_tier only honors
// ACTIVE/TRIALING, PAST_DUE in period, and CANCELED still in period.
const STATUS_MAP: Record<string, string> = {
  active: 'ACTIVE',
  trialing: 'TRIALING',
  past_due: 'PAST_DUE',
  paused: 'INCOMPLETE',
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

async function handleSubscriptionCreated(data: any, env: PaddleEnv) {
  const { id, customerId, items, status, currentBillingPeriod, customData } = data;

  const userId = customData?.userId;
  if (!userId) {
    console.error('No userId in customData');
    return;
  }

  const item = items?.[0];
  const priceId = item?.price?.importMeta?.externalId;
  const productId = item?.product?.importMeta?.externalId;
  if (!priceId || !productId) {
    console.warn('Skipping subscription: missing importMeta.externalId', {
      rawPriceId: item?.price?.id,
      rawProductId: item?.product?.id,
    });
    return;
  }

  const tier = tierForPrice(priceId);
  if (tier === 0) {
    // Never fall back to a default tier: an unknown price means the catalog
    // mapping is wrong, and granting access would be worse than skipping.
    console.warn('Subscription for unknown price, skipping', { priceId });
    return;
  }

  const { error } = await getSupabase().from('subscriptions').upsert(
    {
      user_id: userId,
      tier_key: TIER_TO_TIER_KEY[tier],
      provider: 'paddle',
      provider_customer_id: customerId,
      provider_subscription_id: id,
      paddle_subscription_id: id,
      paddle_customer_id: customerId,
      product_id: productId,
      price_id: priceId,
      status: STATUS_MAP[status] ?? 'INCOMPLETE',
      current_period_start: currentBillingPeriod?.startsAt ?? null,
      current_period_end: currentBillingPeriod?.endsAt ?? null,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'paddle_subscription_id' }
  );
  if (error) throw new Error(`subscription upsert failed: ${error.message}`);
}

async function handleSubscriptionUpdated(data: any, env: PaddleEnv) {
  const { id, status, currentBillingPeriod, scheduledChange, items } = data;

  const update: Record<string, unknown> = {
    status: STATUS_MAP[status] ?? 'INCOMPLETE',
    current_period_start: currentBillingPeriod?.startsAt ?? null,
    current_period_end: currentBillingPeriod?.endsAt ?? null,
    cancel_at_period_end: scheduledChange?.action === 'cancel',
    updated_at: new Date().toISOString(),
  };

  const priceId = items?.[0]?.price?.importMeta?.externalId;
  const tier = tierForPrice(priceId);
  if (tier > 0) {
    update.price_id = priceId;
    update.tier_key = TIER_TO_TIER_KEY[tier];
  }

  const { error, count } = await getSupabase()
    .from('subscriptions')
    .update(update, { count: 'exact' })
    .eq('paddle_subscription_id', id)
    .eq('environment', env);

  if (error) throw new Error(`subscription update failed: ${error.message}`);
  if (count === 0) {
    console.warn('subscription.updated for unknown subscription', { id, env });
  }
}

async function handleSubscriptionCanceled(data: any, env: PaddleEnv) {
  const { id } = data;

  // Canceled rows keep their current_period_end, so "access until the paid
  // period ends" stays enforced by the effective_tier entitlement function.
  const { error, count } = await getSupabase()
    .from('subscriptions')
    .update({ status: 'CANCELED', cancel_at_period_end: true, updated_at: new Date().toISOString() }, { count: 'exact' })
    .eq('paddle_subscription_id', id)
    .eq('environment', env);

  if (error) throw new Error(`subscription cancel failed: ${error.message}`);
  if (count === 0) {
    console.warn('subscription.canceled for unknown subscription', { id, env });
  }
}

// Idempotently record the transaction in payment history.
async function recordTransaction(data: any, env: PaddleEnv, status: string) {
  const { id, items, customData, details } = data;
  const userId = customData?.userId;
  if (!userId) return;

  const item = items?.[0];
  const { error } = await getSupabase().from('payment_transactions').upsert(
    {
      user_id: userId,
      paddle_transaction_id: id,
      environment: env,
      price_id: item?.price?.importMeta?.externalId ?? null,
      product_id: item?.price?.productId ?? null,
      amount: details?.totals?.total ? Number(details.totals.total) / 100 : null,
      currency: data.currencyCode ?? null,
      status,
    },
    { onConflict: 'paddle_transaction_id,environment' }
  );
  if (error) console.error('Failed to record payment transaction', error);
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

  await recordTransaction(data, env, 'completed');

  const supabase = getSupabase();

  if (COURSE_PRICE_IDS.has(priceId)) {
    const courseId = customData?.courseId;
    if (!courseId) {
      console.warn('Course purchase without courseId in customData', { id });
      return;
    }

    // Attribution check: the course must actually exist.
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .maybeSingle();
    if (!course) {
      console.warn('Course purchase for unknown course, rejecting', { id, courseId });
      return;
    }

    // Idempotent on retry: one row per user + course + environment.
    const { error } = await supabase.from('course_purchases').upsert(
      {
        user_id: userId,
        course_id: courseId,
        transaction_id: id,
        price_id: priceId,
        environment: env,
        status: 'paid',
      },
      { onConflict: 'user_id,course_id,environment', ignoreDuplicates: true }
    );
    if (error) throw new Error(`course_purchases insert failed: ${error.message}`);
    return;
  }

  const expectedProductName = CALL_PRICE_TO_PRODUCT_NAME[priceId];
  if (expectedProductName) {
    const bookingId = customData?.bookingId;
    if (!bookingId) {
      console.warn('Call purchase without bookingId in customData', { id });
      return;
    }

    // Attribution check: booking must belong to this user and match the
    // product that was actually paid for.
    const { data: booking } = await supabase
      .from('paid_call_bookings')
      .select('id, user_id, payment_status, paid_call_products(name)')
      .eq('id', bookingId)
      .maybeSingle();

    if (!booking || booking.user_id !== userId) {
      console.warn('Call purchase booking mismatch, rejecting', { id, bookingId, userId });
      return;
    }
    const productName = (booking as any).paid_call_products?.name;
    if (productName !== expectedProductName) {
      console.warn('Call purchase product mismatch, rejecting', { id, bookingId, productName, expectedProductName });
      return;
    }
    if (booking.payment_status === 'PAID') {
      console.log('Booking already paid, ignoring duplicate', { bookingId });
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
    if (error) throw new Error(`booking update failed: ${error.message}`);
    return;
  }

  console.log('transaction.completed for unhandled price', { priceId });
}

async function handleWebhook(req: Request, env: PaddleEnv) {
  const event = await verifyWebhook(req, env);
  const supabase = getSupabase();

  // Event ledger: insert first so retries and replays are deduplicated.
  const eventId = (event as any).eventId ?? (event as any).id;
  if (eventId) {
    const { error: ledgerError } = await supabase.from('payment_events').insert({
      event_id: eventId,
      environment: env,
      event_type: event.eventType,
      status: 'processing',
    });
    if (ledgerError?.code === '23505') {
      // Unique violation: already seen. If it failed before, reprocess.
      const { data: existing } = await supabase
        .from('payment_events')
        .select('status')
        .eq('event_id', eventId)
        .eq('environment', env)
        .maybeSingle();
      if (existing?.status === 'processed') {
        console.log('Duplicate event, already processed', { eventId });
        return;
      }
    } else if (ledgerError) {
      throw new Error(`event ledger insert failed: ${ledgerError.message}`);
    }
  }

  try {
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
      case EventName.TransactionPaymentFailed:
        await recordTransaction(event.data, env, 'failed');
        break;
      case EventName.TransactionCanceled:
        await recordTransaction(event.data, env, 'canceled');
        break;
      default:
        console.log('Unhandled event:', event.eventType);
    }

    if (eventId) {
      await supabase
        .from('payment_events')
        .update({ status: 'processed', processed_at: new Date().toISOString() })
        .eq('event_id', eventId)
        .eq('environment', env);
    }
  } catch (e) {
    if (eventId) {
      await supabase
        .from('payment_events')
        .update({ status: 'failed', error: e instanceof Error ? e.message : String(e) })
        .eq('event_id', eventId)
        .eq('environment', env);
    }
    throw e;
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
    // 500 so the provider retries instead of the event being lost.
    return new Response('Webhook error', { status: 500 });
  }
});
