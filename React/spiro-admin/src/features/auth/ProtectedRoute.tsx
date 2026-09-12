/**
 * Route guards.
 *
 * Two distinct jobs, deliberately split:
 *   ProtectedRoute  are you signed in at all?      -> redirect to /login
 *   RequirePermission  may you see THIS?           -> render a 403, not a redirect
 *
 * Bouncing an authenticated user to /login because they lack one permission
 * is the classic mistake: it reads as "you are logged out" and they retry
 * forever.
 */

import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { Permission } from '@/types/domain';
import { useAuth } from './AuthProvider';

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Do not decide anything until bootstrap has resolved.
  if (status === 'unknown') return <FullPageSpinner />;

  if (status === 'anonymous') {
    // Remember where they were headed, so login can send them back.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children?: ReactNode;
}) {
  const { can } = useAuth();

  if (!can(permission)) return <Forbidden permission={permission} />;
  return <>{children ?? <Outlet />}</>;
}

/** Conditionally render a control the user is allowed to use. */
export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = useAuth();
  return <>{can(permission) ? children : fallback}</>;
}

function Forbidden({ permission }: { permission: Permission }) {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 'var(--sp-12)' }}>
      <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--sp-2)' }}>
        You don't have access to this page
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        It requires the <code>{permission}</code> permission. Ask an administrator if you
        think this is wrong.
      </p>
    </div>
  );
}

function FullPageSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
        color: 'var(--text-secondary)',
      }}
    >
      Loading…
    </div>
  );
}
