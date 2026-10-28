-- One-time course purchases (service role writes via payments webhook)
create table public.course_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id uuid not null references public.courses(id) on delete cascade,
  transaction_id text not null unique,
  price_id text not null,
  environment text not null default 'sandbox',
  status text not null default 'paid',
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index idx_course_purchases_user on public.course_purchases(user_id);
create index idx_course_purchases_course on public.course_purchases(course_id);

grant select on public.course_purchases to authenticated;
grant all on public.course_purchases to service_role;

alter table public.course_purchases enable row level security;

create policy "Users can view own purchases"
  on public.course_purchases for select
  using (auth.uid() = user_id);

-- Paddle subscription bookkeeping on the existing subscriptions table
alter table public.subscriptions
  add column if not exists paddle_subscription_id text,
  add column if not exists paddle_customer_id text,
  add column if not exists product_id text,
  add column if not exists price_id text,
  add column if not exists environment text not null default 'sandbox',
  add column if not exists cancel_at_period_end boolean not null default false;

create unique index if not exists subscriptions_paddle_subscription_id_key
  on public.subscriptions(paddle_subscription_id);

-- Paid lessons are locked for everyone except buyers and tier subscribers.
-- (Previously the course was fully open; a purchase or subscription now unlocks it.)
drop policy if exists "Users can view lessons of accessible courses" on public.lessons;
create policy "Users can view lessons of accessible courses"
  on public.lessons for select
  using (
    is_published = true
    and (
      is_free = true
      or (
        auth.uid() is not null
        and (
          exists (
            select 1
            from public.course_purchases cp
            join public.modules m on m.course_id = cp.course_id
            where cp.user_id = auth.uid()
              and cp.status = 'paid'
              and m.id = lessons.module_id
          )
          or exists (
            select 1
            from public.modules m
            join public.courses c on c.id = m.course_id
            where m.id = lessons.module_id
              and c.tier_required > 0
              and c.tier_required <= coalesce(
                (select up.user_tier from public.user_profiles up where up.user_id = auth.uid()), 0
              )
          )
        )
      )
    )
  );