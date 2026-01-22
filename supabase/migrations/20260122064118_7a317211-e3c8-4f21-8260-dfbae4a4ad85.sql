-- Create calls table for voice call logging
CREATE TABLE public.calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.support_cases(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'VAPI' CHECK (provider IN ('VAPI', 'TWILIO')),
  direction TEXT NOT NULL DEFAULT 'INBOUND' CHECK (direction IN ('INBOUND', 'OUTBOUND')),
  status TEXT NOT NULL DEFAULT 'RINGING' CHECK (status IN ('RINGING', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),
  recording_url TEXT,
  transcript TEXT,
  consent_confirmed BOOLEAN NOT NULL DEFAULT false,
  vapi_call_id TEXT,
  phone_number TEXT,
  duration_seconds INTEGER,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create paid_call_products table
CREATE TABLE public.paid_call_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_gbp NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  entitlement TEXT NOT NULL DEFAULT 'MORPHEUS_CALL' CHECK (entitlement IN ('MORPHEUS_CALL', 'TRINITY_CALL', 'HUMAN_CALL')),
  stripe_price_id TEXT,
  calendly_event_type_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create paid_call_bookings table
CREATE TABLE public.paid_call_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.paid_call_products(id) ON DELETE RESTRICT,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  calendly_event_uri TEXT,
  calendly_invitee_uri TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE,
  scheduled_end TIMESTAMP WITH TIME ZONE,
  meeting_link TEXT,
  call_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SCHEDULED', 'COMPLETED', 'NO_SHOW', 'CANCELED')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create telemetry table for system monitoring
CREATE TABLE public.telemetry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('TELEGRAM', 'VAPI', 'PAYMENTS', 'APP', 'SYSTEM')),
  level TEXT NOT NULL DEFAULT 'INFO' CHECK (level IN ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
  event_key TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.support_cases(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_call_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_call_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;

-- RLS for calls table
CREATE POLICY "Admins can view all calls" ON public.calls FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage calls" ON public.calls FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- RLS for paid_call_products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.paid_call_products FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all products" ON public.paid_call_products FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage products" ON public.paid_call_products FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- RLS for paid_call_bookings
CREATE POLICY "Users can view their own bookings" ON public.paid_call_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.paid_call_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.paid_call_bookings FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage all bookings" ON public.paid_call_bookings FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "System can update bookings" ON public.paid_call_bookings FOR UPDATE USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- RLS for telemetry (admin only)
CREATE POLICY "Admins can view telemetry" ON public.telemetry FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage telemetry" ON public.telemetry FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Add updated_at triggers
CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON public.calls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_paid_call_products_updated_at BEFORE UPDATE ON public.paid_call_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_paid_call_bookings_updated_at BEFORE UPDATE ON public.paid_call_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add additional columns to support_cases for enhanced workflow
ALTER TABLE public.support_cases 
  ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'TELEGRAM' CHECK (channel IN ('TELEGRAM', 'VAPI_VOICE', 'WEB_FORM', 'EMAIL')),
  ADD COLUMN IF NOT EXISTS case_type TEXT DEFAULT 'ACADEMY_SUPPORT' CHECK (case_type IN ('ACADEMY_SUPPORT', 'ONBOARDING', 'TRUST_ONBOARDING', 'ADVOCACY', 'TECH_SUPPORT', 'BILLING')),
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Insert default paid call products
INSERT INTO public.paid_call_products (name, description, price_gbp, duration_minutes, entitlement) VALUES
  ('Morpheus Express Call', '15-minute focused support session with Morpheus AI', 15.00, 15, 'MORPHEUS_CALL'),
  ('Morpheus Standard Call', '30-minute comprehensive support with Morpheus AI', 27.00, 30, 'MORPHEUS_CALL'),
  ('Morpheus Deep Dive', '60-minute in-depth consultation with Morpheus AI', 47.00, 60, 'MORPHEUS_CALL'),
  ('Human Expert Consultation', '30-minute session with a human support specialist', 97.00, 30, 'HUMAN_CALL');

-- Enable realtime for support_cases and case_messages for admin dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_cases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.case_messages;