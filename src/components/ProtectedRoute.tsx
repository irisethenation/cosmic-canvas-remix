import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAgreements } from '@/hooks/useAgreements';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasAcceptedAll, loading: agreementsLoading, pendingAgreements } = useAgreements();
  const location = useLocation();

  if (authLoading || agreementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    // Remember the intended destination so sign-in can return to it.
    sessionStorage.setItem('auth_next', location.pathname + location.search);
    return <Navigate to="/" replace />;
  }

  // If user hasn't accepted all agreements and isn't already on onboarding page
  if (!hasAcceptedAll && pendingAgreements.length > 0 && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
