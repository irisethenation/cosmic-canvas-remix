-- Create role enum
CREATE TYPE public.app_role AS ENUM (
  'VISITOR',
  'STUDENT_KEY_MASTER', 
  'GRADUATE_LEARNED_MASTER_BUILDER',
  'AMBASSADOR',
  'ADMIN',
  'SUPER_ADMIN'
);

-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM (
  'TIER_1_KEY_MASTER',
  'TIER_2_LEARNED_MASTER_BUILDER', 
  'TIER_3_PRIVATE_MENTORSHIP'
);

-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM (
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'INCOMPLETE'
);

-- Create user roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'VISITOR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_key subscription_tier NOT NULL,
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  status subscription_status NOT NULL DEFAULT 'INCOMPLETE',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Create agreements table
CREATE TABLE public.agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1.0',
  content_markdown TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_agreements table
CREATE TABLE public.user_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agreement_id UUID NOT NULL REFERENCES public.agreements(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE (user_id, agreement_id)
);

-- Create notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'ALL',
  is_published BOOLEAN NOT NULL DEFAULT false,
  publish_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to existing courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'SUBSCRIBERS_ONLY';

-- Add new columns to existing modules table  
ALTER TABLE public.modules
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false;

-- Add new columns to existing lessons table
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'VIDEO',
ADD COLUMN IF NOT EXISTS content_url TEXT,
ADD COLUMN IF NOT EXISTS content_text TEXT,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT false;

-- Update lesson_progress table with new fields
ALTER TABLE public.lesson_progress
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN IF NOT EXISTS percent_complete INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_position_seconds INTEGER;

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('ADMIN', 'SUPER_ADMIN')
  )
$$;

-- Function to check active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
      AND status = 'ACTIVE'
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'SUPER_ADMIN'));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can update subscriptions"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- RLS Policies for agreements (public read, admin write)
CREATE POLICY "Anyone can view active agreements"
ON public.agreements FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage agreements"
ON public.agreements FOR ALL
USING (public.is_admin(auth.uid()));

-- RLS Policies for user_agreements
CREATE POLICY "Users can view their own agreements"
ON public.user_agreements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can accept agreements"
ON public.user_agreements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notices
CREATE POLICY "Authenticated users can view published notices"
ON public.notices FOR SELECT
USING (
  is_published = true 
  AND (publish_at IS NULL OR publish_at <= now())
);

CREATE POLICY "Admins can manage notices"
ON public.notices FOR ALL
USING (public.is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_agreements_user_id ON public.user_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_notices_audience ON public.notices(audience);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_key ON public.courses(key);
CREATE INDEX IF NOT EXISTS idx_courses_visibility ON public.courses(visibility);
CREATE INDEX IF NOT EXISTS idx_modules_is_published ON public.modules(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_is_published ON public.lessons(is_published);

-- Function to create user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'VISITOR');
  RETURN NEW;
END;
$$;

-- Trigger to auto-create role on user signup
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();