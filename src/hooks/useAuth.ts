import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Send welcome email when user signs up
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await supabase.functions.invoke('send-welcome-email', {
              body: {
                email: session.user.email,
                name: session.user.user_metadata.full_name || 'Student',
                program: 'Agnotology & Epistemic Sovereignty Programme™'
              }
            });
          } catch (error) {
            console.error('Failed to send welcome email:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signOut,
  };
};