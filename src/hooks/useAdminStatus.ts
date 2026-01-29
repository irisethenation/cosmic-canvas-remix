import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAdminStatus = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Use secure function that only checks own admin status (no user_id parameter)
      const { data, error } = await supabase.rpc('check_my_admin_status');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      setLoading(false);
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: authLoading || loading };
};
