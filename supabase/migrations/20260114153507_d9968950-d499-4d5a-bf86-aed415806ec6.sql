-- Fix RLS: Enforce tier-based access server-side

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Anyone can view modules of published courses" ON public.modules;
DROP POLICY IF EXISTS "Anyone can view lessons of published courses" ON public.lessons;

-- Create tier-aware course policy
CREATE POLICY "Users can view courses up to their tier"
ON public.courses FOR SELECT
USING (
  is_published = true AND (
    tier_required = 0 OR
    visibility = 'PUBLIC' OR
    (
      auth.uid() IS NOT NULL AND
      tier_required <= COALESCE(
        (SELECT user_tier FROM public.user_profiles WHERE user_id = auth.uid()),
        0
      )
    )
  )
);

-- Create tier-aware module policy
CREATE POLICY "Users can view modules of accessible courses"
ON public.modules FOR SELECT
USING (
  is_published = true AND
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = modules.course_id
    AND c.is_published = true
    AND (
      c.tier_required = 0 OR
      c.visibility = 'PUBLIC' OR
      (
        auth.uid() IS NOT NULL AND
        c.tier_required <= COALESCE(
          (SELECT user_tier FROM public.user_profiles WHERE user_id = auth.uid()),
          0
        )
      )
    )
  )
);

-- Create tier-aware lesson policy (free lessons always accessible, others require tier)
CREATE POLICY "Users can view lessons of accessible courses"
ON public.lessons FOR SELECT
USING (
  is_published = true AND
  (
    is_free = true OR
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
      AND c.is_published = true
      AND (
        c.tier_required = 0 OR
        c.visibility = 'PUBLIC' OR
        (
          auth.uid() IS NOT NULL AND
          c.tier_required <= COALESCE(
            (SELECT user_tier FROM public.user_profiles WHERE user_id = auth.uid()),
            0
          )
        )
      )
    )
  )
);

-- Create user_profiles automatically for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, user_tier)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();