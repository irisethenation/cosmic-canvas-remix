-- Billing state becomes server-owned
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "System can update subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (is_admin(auth.uid()));

-- Key subscriptions by provider subscription ID, not user_id
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_paddle_subscription_id_key
  ON public.subscriptions (paddle_subscription_id) WHERE paddle_subscription_id IS NOT NULL;

-- course_purchases: environment-aware uniqueness
ALTER TABLE public.course_purchases DROP CONSTRAINT IF EXISTS course_purchases_user_id_course_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS course_purchases_user_course_env_key
  ON public.course_purchases (user_id, course_id, environment);

-- paid_call_bookings: users can only create PENDING rows, never update payment state
DROP POLICY IF EXISTS "System can update bookings" ON public.paid_call_bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.paid_call_bookings;
CREATE POLICY "Users can create pending bookings"
  ON public.paid_call_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id AND payment_status = 'PENDING' AND status = 'PENDING');

-- user_profiles: block tier self-escalation on INSERT too
CREATE OR REPLACE FUNCTION public.prevent_user_tier_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.user_tier IS DISTINCT FROM 0
       AND auth.uid() IS NOT NULL
       AND NOT EXISTS (
         SELECT 1 FROM public.user_roles
         WHERE user_id = auth.uid() AND role IN ('ADMIN','SUPER_ADMIN')
       ) THEN
      RAISE EXCEPTION 'Not allowed to set user_tier';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.user_tier IS DISTINCT FROM OLD.user_tier THEN
    IF auth.uid() IS NULL THEN
      RETURN NEW;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('ADMIN','SUPER_ADMIN')
    ) THEN
      RAISE EXCEPTION 'Not allowed to modify user_tier';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS prevent_user_tier_self_escalation_insert ON public.user_profiles;
CREATE TRIGGER prevent_user_tier_self_escalation_insert
  BEFORE INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_user_tier_self_escalation();

-- Environment helpers: client sends x-app-env header; default 'live' as safety net
CREATE OR REPLACE FUNCTION public.current_app_env()
RETURNS text
LANGUAGE sql
STABLE
AS $function$
  SELECT CASE
    WHEN current_setting('request.headers', true) IS NULL
      OR current_setting('request.headers', true) = '' THEN 'live'
    ELSE COALESCE(
      NULLIF(current_setting('request.headers', true)::jsonb ->> 'x-app-env', ''),
      'live'
    )
  END;
$function$;

CREATE OR REPLACE FUNCTION public.subscription_tier_for(_user_id uuid, _env text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(MAX(
    CASE s.tier_key
      WHEN 'TIER_1_KEY_MASTER' THEN 1
      WHEN 'TIER_2_LEARNED_MASTER_BUILDER' THEN 2
      WHEN 'TIER_3_PRIVATE_MENTORSHIP' THEN 3
      ELSE 0
    END
  ), 0)
  FROM public.subscriptions s
  WHERE s.user_id = _user_id
    AND s.environment = _env
    AND (
      s.status IN ('ACTIVE', 'TRIALING')
      OR (s.status = 'PAST_DUE' AND (s.current_period_end IS NULL OR s.current_period_end > now()))
      OR (s.status = 'CANCELED' AND s.current_period_end IS NOT NULL AND s.current_period_end > now())
    );
$function$;

-- Effective tier = best of purchased subscription tier and admin-granted manual tier
CREATE OR REPLACE FUNCTION public.effective_tier(_user_id uuid, _env text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT GREATEST(
    public.subscription_tier_for(_user_id, _env),
    COALESCE((SELECT up.user_tier FROM public.user_profiles up WHERE up.user_id = _user_id), 0)
  );
$function$;

GRANT EXECUTE ON FUNCTION public.current_app_env() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.subscription_tier_for(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.effective_tier(uuid, text) TO anon, authenticated;

-- Entitlement-aware RLS (environment + time based)
DROP POLICY IF EXISTS "Users can view lessons of accessible courses" ON public.lessons;
CREATE POLICY "Users can view lessons of accessible courses"
  ON public.lessons FOR SELECT
  USING (
    is_published = true AND (
      is_free = true OR (
        auth.uid() IS NOT NULL AND (
          EXISTS (
            SELECT 1
            FROM course_purchases cp
            JOIN modules m ON m.course_id = cp.course_id
            WHERE cp.user_id = auth.uid()
              AND cp.status = 'paid'
              AND cp.environment = public.current_app_env()
              AND m.id = lessons.module_id
          )
          OR EXISTS (
            SELECT 1
            FROM modules m
            JOIN courses c ON c.id = m.course_id
            WHERE m.id = lessons.module_id
              AND c.tier_required > 0
              AND c.tier_required <= public.effective_tier(auth.uid(), public.current_app_env())
          )
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can view courses up to their tier" ON public.courses;
CREATE POLICY "Users can view courses up to their tier"
  ON public.courses FOR SELECT
  USING (
    is_published = true AND (
      tier_required = 0
      OR visibility = 'PUBLIC'
      OR (auth.uid() IS NOT NULL AND tier_required <= public.effective_tier(auth.uid(), public.current_app_env()))
    )
  );

DROP POLICY IF EXISTS "Users can view modules of accessible courses" ON public.modules;
CREATE POLICY "Users can view modules of accessible courses"
  ON public.modules FOR SELECT
  USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
        AND c.is_published = true
        AND (
          c.tier_required = 0
          OR c.visibility = 'PUBLIC'
          OR (auth.uid() IS NOT NULL AND c.tier_required <= public.effective_tier(auth.uid(), public.current_app_env()))
        )
    )
  );

-- Curriculum view: published content only
CREATE OR REPLACE VIEW public.course_lesson_curriculum AS
SELECT l.id,
       m.course_id,
       l.module_id,
       l.title,
       l.content_type,
       l.duration_seconds,
       l.is_free,
       l.order_index,
       l.is_published
FROM lessons l
JOIN modules m ON m.id = l.module_id
JOIN courses c ON c.id = m.course_id
WHERE l.is_published = true
  AND m.is_published = true
  AND c.is_published = true;

-- Programme tier mapping: any membership tier unlocks it
UPDATE public.courses SET tier_required = 1
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND tier_required = 0;

-- Payment event ledger (idempotent webhook processing)
CREATE TABLE IF NOT EXISTS public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  environment text NOT NULL,
  event_type text NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE (event_id, environment)
);
GRANT SELECT ON public.payment_events TO authenticated;
GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view payment events"
  ON public.payment_events FOR SELECT
  USING (is_admin(auth.uid()));

-- Payment transaction history
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  paddle_transaction_id text NOT NULL,
  environment text NOT NULL,
  price_id text,
  product_id text,
  amount numeric,
  currency text,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (paddle_transaction_id, environment)
);
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (is_admin(auth.uid()));

-- Account deletion requests
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);
GRANT INSERT, SELECT ON public.account_deletion_requests TO authenticated;
GRANT ALL ON public.account_deletion_requests TO service_role;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can request their own deletion"
  ON public.account_deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own deletion request"
  ON public.account_deletion_requests FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage deletion requests"
  ON public.account_deletion_requests FOR ALL
  USING (is_admin(auth.uid()));