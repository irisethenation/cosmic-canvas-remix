-- Create secure versions of role-checking functions that prevent user enumeration
-- These functions only allow users to check their own status, or admins to check any user

-- Secure version of is_admin - only allows checking own admin status
-- For RLS policies, keeps the original function as-is since RLS runs in service context
CREATE OR REPLACE FUNCTION public.check_my_admin_status()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('ADMIN', 'SUPER_ADMIN')
  )
$$;

-- Secure version of has_role - only allows checking own roles
CREATE OR REPLACE FUNCTION public.check_my_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- Secure version of has_active_subscription - only allows checking own subscription
CREATE OR REPLACE FUNCTION public.check_my_subscription()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = auth.uid()
      AND status = 'ACTIVE'
  )
$$;

-- Update the original functions to add authorization checks
-- These are still needed for RLS policies (which run in service context)
-- But now they validate the caller has permission when called via RPC

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If checking own user_id, allow
  IF _user_id = auth.uid() THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role IN ('ADMIN', 'SUPER_ADMIN')
    );
  END IF;
  
  -- If caller is admin, allow checking any user
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
  ) THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role IN ('ADMIN', 'SUPER_ADMIN')
    );
  END IF;
  
  -- Otherwise deny access
  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If checking own user_id, allow
  IF _user_id = auth.uid() THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    );
  END IF;
  
  -- If caller is admin, allow checking any user
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
  ) THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    );
  END IF;
  
  -- Otherwise deny access  
  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If checking own user_id, allow
  IF _user_id = auth.uid() THEN
    RETURN EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = _user_id AND status = 'ACTIVE'
    );
  END IF;
  
  -- If caller is admin, allow checking any user
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
  ) THEN
    RETURN EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = _user_id AND status = 'ACTIVE'
    );
  END IF;
  
  -- Otherwise deny access
  RETURN FALSE;
END;
$$;