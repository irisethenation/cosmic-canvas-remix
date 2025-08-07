import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminGuard({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) checkRole(s.user.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) checkRole(s.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function checkRole(uid: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', uid)
      .single();
    const ok = !error && data?.role === 'admin';
    setIsAdmin(ok);
    setLoading(false);
    if (!ok) nav('/', { replace: true }); // bounce non-admins
  }

  if (loading) return <p className="p-8 text-white">Checking credentials…</p>;
  if (!session || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="w-96 bg-slate-800 p-8 rounded-lg shadow-2xl border border-slate-700">
          <h1 className="text-white text-2xl mb-6 text-center font-semibold">Admin Login</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#1d4ed8',
                    inputBackground: '#374151',
                    inputBorder: '#6b7280',
                    inputText: '#ffffff',
                    inputLabelText: '#d1d5db',
                  }
                }
              }
            }}
            providers={[]}
            redirectTo={window.location.origin} // keeps admin.irise.academy
          />
        </div>
      </div>
    );
  }

  return children;
}