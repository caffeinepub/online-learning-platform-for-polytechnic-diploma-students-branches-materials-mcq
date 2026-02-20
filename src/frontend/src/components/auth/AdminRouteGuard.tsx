import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { AccessDeniedScreen } from './AccessDeniedScreen';
import { LoadingState } from '../common/LoadingState';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
