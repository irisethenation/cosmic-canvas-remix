-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Service role full access on support_cases" ON public.support_cases;
DROP POLICY IF EXISTS "Service role full access on case_messages" ON public.case_messages;

-- Create proper RLS policies for support_cases
-- Admins can view all support cases
CREATE POLICY "Admins can view all support cases"
  ON public.support_cases FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins can manage support cases
CREATE POLICY "Admins can manage support cases"
  ON public.support_cases FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Create proper RLS policies for case_messages
-- Admins can view all case messages
CREATE POLICY "Admins can view all case messages"
  ON public.case_messages FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins can manage case messages
CREATE POLICY "Admins can manage case messages"
  ON public.case_messages FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));