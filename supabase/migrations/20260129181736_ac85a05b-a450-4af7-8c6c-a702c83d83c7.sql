-- Fix 1: Create a function to hash IP addresses for privacy compliance
-- This ensures IP addresses are stored as hashed values rather than plain text

CREATE OR REPLACE FUNCTION public.hash_ip_address(ip text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF ip IS NULL OR ip = '' THEN
    RETURN NULL;
  END IF;
  -- Use SHA-256 hash with a salt for privacy-compliant IP storage
  RETURN encode(digest(ip || 'lovable_ip_salt_v1', 'sha256'), 'hex');
END;
$$;

-- Fix 2: Create a secure view for case_messages that excludes sensitive metadata
-- Users should only see safe fields, not internal metadata

CREATE OR REPLACE VIEW public.case_messages_user_view
WITH (security_invoker = on) AS
SELECT 
  id,
  case_id,
  content,
  sender,
  created_at,
  attachments,
  message_type
  -- Excludes: metadata, telegram_message_id (internal fields)
FROM public.case_messages;

-- Grant access to the view
GRANT SELECT ON public.case_messages_user_view TO authenticated;

-- Fix 3: Update case_messages RLS to be more restrictive
-- Add explicit deny for anonymous users
CREATE POLICY "Deny anonymous access to case_messages"
ON public.case_messages
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Fix 4: Update user_agreements to store hashed IP instead of plain text
-- Note: The current ip_address column will store hashed values going forward
COMMENT ON COLUMN public.user_agreements.ip_address IS 'Stores SHA-256 hashed IP address for privacy compliance. Never store plain text IPs.';

-- Fix 5: Create an RPC function for inserting user agreements with hashed IP
CREATE OR REPLACE FUNCTION public.accept_agreement_with_privacy(
  _agreement_id uuid,
  _ip_address text,
  _user_agent text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new_id uuid;
BEGIN
  -- Only allow authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  INSERT INTO public.user_agreements (
    user_id,
    agreement_id,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    _agreement_id,
    hash_ip_address(_ip_address),  -- Hash the IP before storing
    LEFT(_user_agent, 500)  -- Truncate user agent to prevent overflow
  )
  RETURNING id INTO _new_id;

  RETURN _new_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.accept_agreement_with_privacy(uuid, text, text) TO authenticated;