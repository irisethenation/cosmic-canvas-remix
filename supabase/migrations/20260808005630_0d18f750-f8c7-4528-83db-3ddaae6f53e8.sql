-- 1. Prevent self tier escalation
CREATE OR REPLACE FUNCTION public.prevent_user_tier_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_tier IS DISTINCT FROM OLD.user_tier THEN
    IF auth.uid() IS NULL THEN
      RETURN NEW; -- service role / backend
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
$$;

DROP TRIGGER IF EXISTS enforce_user_tier_change ON public.user_profiles;
CREATE TRIGGER enforce_user_tier_change
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_user_tier_self_escalation();

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.hash_ip_address(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_user_tier_self_escalation() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_active_subscription(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_my_admin_status() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_my_role(app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_my_subscription() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.accept_agreement_with_privacy(uuid, text, text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_my_admin_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_my_role(app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_my_subscription() TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_agreement_with_privacy(uuid, text, text) TO authenticated;