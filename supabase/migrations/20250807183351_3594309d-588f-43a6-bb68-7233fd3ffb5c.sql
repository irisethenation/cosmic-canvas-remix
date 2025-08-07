-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.cleanup_expired_verifications()
RETURNS void 
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    DELETE FROM public.two_factor_verifications 
    WHERE expires_at < now() AND used = false;
END;
$$ LANGUAGE plpgsql;