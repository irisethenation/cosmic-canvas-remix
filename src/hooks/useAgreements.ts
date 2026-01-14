import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Agreement {
  id: string;
  key: string;
  title: string;
  version: string;
  content_markdown: string;
}

interface UserAgreement {
  agreement_id: string;
  accepted_at: string;
}

export const useAgreements = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [userAgreements, setUserAgreements] = useState<UserAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAgreements, setPendingAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    const fetchAgreements = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all active agreements
        const { data: activeAgreements, error: agreementsError } = await supabase
          .from('agreements')
          .select('id, key, title, version, content_markdown')
          .eq('is_active', true);

        if (agreementsError) throw agreementsError;

        // Fetch user's accepted agreements
        const { data: accepted, error: acceptedError } = await supabase
          .from('user_agreements')
          .select('agreement_id, accepted_at')
          .eq('user_id', user.id);

        if (acceptedError) throw acceptedError;

        setAgreements(activeAgreements || []);
        setUserAgreements(accepted || []);

        // Calculate pending agreements
        const acceptedIds = new Set((accepted || []).map(a => a.agreement_id));
        const pending = (activeAgreements || []).filter(a => !acceptedIds.has(a.id));
        setPendingAgreements(pending);
      } catch (error) {
        console.error('Error fetching agreements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, [user]);

  const acceptAgreement = async (agreementId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('user_agreements')
        .insert({
          user_id: user.id,
          agreement_id: agreementId,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      // Update local state
      setUserAgreements(prev => [...prev, { 
        agreement_id: agreementId, 
        accepted_at: new Date().toISOString() 
      }]);
      setPendingAgreements(prev => prev.filter(a => a.id !== agreementId));

      return { error: null };
    } catch (error) {
      console.error('Error accepting agreement:', error);
      return { error };
    }
  };

  const acceptAllAgreements = async () => {
    if (!user || pendingAgreements.length === 0) return { error: null };

    try {
      const inserts = pendingAgreements.map(agreement => ({
        user_id: user.id,
        agreement_id: agreement.id,
        ip_address: null,
        user_agent: navigator.userAgent
      }));

      const { error } = await supabase
        .from('user_agreements')
        .insert(inserts);

      if (error) throw error;

      // Update local state
      const newAccepted = pendingAgreements.map(a => ({
        agreement_id: a.id,
        accepted_at: new Date().toISOString()
      }));
      setUserAgreements(prev => [...prev, ...newAccepted]);
      setPendingAgreements([]);

      return { error: null };
    } catch (error) {
      console.error('Error accepting agreements:', error);
      return { error };
    }
  };

  const hasAcceptedAll = pendingAgreements.length === 0 && agreements.length > 0;

  return {
    agreements,
    userAgreements,
    pendingAgreements,
    loading,
    hasAcceptedAll,
    acceptAgreement,
    acceptAllAgreements
  };
};
