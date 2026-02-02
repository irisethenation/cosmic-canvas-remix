-- Create a secure view for support_cases that excludes internal Telegram identifiers
-- This prevents users from seeing Telegram chat IDs, user IDs, and usernames

CREATE OR REPLACE VIEW public.support_cases_user_view
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  current_agent,
  status,
  channel,
  case_type,
  priority,
  summary,
  created_at,
  updated_at
  -- Excludes: telegram_chat_id, telegram_user_id, telegram_username, vapi_call_id
FROM public.support_cases;

-- Grant access to authenticated users
GRANT SELECT ON public.support_cases_user_view TO authenticated;

-- Add comment for documentation
COMMENT ON VIEW public.support_cases_user_view IS 'Secure view for support cases that excludes internal Telegram identifiers. Users should query this view instead of the base table.';