import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const loc = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: loc.pathname }} />;
  }
  return <>{children}</>;
}
