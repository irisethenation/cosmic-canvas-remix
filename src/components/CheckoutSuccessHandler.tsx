import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getPaddleEnvironment } from '@/lib/paddle';

// Shows a confirmation toast after a successful checkout redirect and
// refreshes the session-derived profile so new access appears immediately.
const CheckoutSuccessHandler = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('checkout') !== 'success') return;

    toast({
      title: 'Purchase complete! 🎉',
      description: 'Your access has been unlocked. Welcome aboard!',
    });

    // Clean the query string so the toast doesn't repeat on reload.
    window.history.replaceState({}, '', window.location.pathname);

    if (user) {
      supabase.auth.refreshSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

export default CheckoutSuccessHandler;
export { getPaddleEnvironment };
