Implementing centralized route guards and authentication across Micro-Frontends (MFEs) follows a **zero-trust frontend architecture**: the host container (App Shell) acts as the primary gatekeeper for top-level routing, while child MFEs act as autonomous consumers that validate permissions locally and handle token expiration/401s uniformly.

---

### Core Architecture

```
                               Browser Navigation (/admin/settings)
                                                │
                                                ▼
                   ┌────────────────────────────────────────────────────────┐
                   │                       App Shell                        │
                   │   • Owns Session State & Token Refresh Loop            │
                   │   • Executes Global Route Guards (Auth / RBAC)         │
                   │   • Evaluates Route Config / Metadata                  │
                   └───────┬────────────────────────────────────────┬───────┘
                           │ (Authenticated & Authorized)           │ (Unauthenticated)
                           ▼                                        ▼
    ┌───────────────────────────────────────────────┐     ┌───────────────────┐
    │              Remote Child MFE                 │     │  Redirect /login  │
    │  • Receives User/Claims via Context/Props     │     │  (Preserve Return │
    │  • Performs Fine-Grained UI Permission Checks │     │   URL Parameter)  │
    │  • Dispatches 'auth:unauthorized' on 401 API  │     └───────────────────┘
    └───────────────────────────────────────────────┘

```

---

### 1. Shared Auth Contract & Store (`@my-org/auth-contract`)

Expose a framework-agnostic shared singleton contract (via Module Federation or an internal npm package) to avoid tight coupling.

```typescript
// packages/auth-contract/src/index.ts
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST';

export interface UserSession {
  userId: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
  accessToken: string;
}

export interface RouteMeta {
  requiresAuth?: boolean;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
}

// Global Event Contract
export const AUTH_EVENTS = {
  SESSION_EXPIRED: 'auth:session-expired',
  UNAUTHORIZED: 'auth:unauthorized',
  FORBIDDEN: 'auth:forbidden',
} as const;

```

---

### 2. The App Shell: Centralized Route Guard

The App Shell intercepts route changes before child micro-frontends are downloaded or mounted. If the user is unauthenticated or lacks the required role, the shell redirects to `/login` or `/403-forbidden` without loading the remote JavaScript bundle.

```tsx
// shell/src/components/GuardedRoute.tsx
import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserSession, UserRole, AUTH_EVENTS } from '@my-org/auth-contract';

interface GuardedRouteProps {
  session: UserSession | null;
  isLoadingSession: boolean;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  children: React.ReactNode;
}

export function GuardedRoute({
  session,
  isLoadingSession,
  requiredRoles = [],
  requiredPermissions = [],
  children,
}: GuardedRouteProps) {
  const location = useLocation();

  // 1. Show global loading state while initial session check or silent refresh runs
  if (isLoadingSession) {
    return <div className="shell-loader">Validating security session...</div>;
  }

  // 2. Authentication Guard
  if (!session) {
    // Preserve return URL so user returns directly after login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // 3. Role-Based Access Control (RBAC) Guard
  if (
    requiredRoles.length > 0 &&
    !requiredRoles.some((role) => session.roles.includes(role))
  ) {
    return <Navigate to="/403" replace />;
  }

  // 4. Permission-Based Guard (Fine-Grained)
  if (
    requiredPermissions.length > 0 &&
    !requiredPermissions.every((perm) => session.permissions.includes(perm))
  ) {
    return <Navigate to="/403" replace />;
  }

  // 5. Authorized -> Mount the Child MFE inside Suspense
  return <Suspense fallback={<div>Loading Micro-Frontend...</div>}>{children}</Suspense>;
}

```

#### Mounting Guards in the App Shell Router

```tsx
// shell/src/App.tsx
import React, { useEffect, useState, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GuardedRoute } from './components/GuardedRoute';
import { UserSession, AUTH_EVENTS } from '@my-org/auth-contract';

const AdminRemoteMFE = lazy(() => import('admin_app/AdminApp'));
const BillingRemoteMFE = lazy(() => import('billing_app/BillingApp'));

export function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial silent auth verify on mount
  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data))
      .finally(() => setIsLoading(false));

    // Listen for unauthorized/session-expired events emitted by ANY child MFE
    const handleAuthFailure = () => {
      setSession(null);
      window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
    };

    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleAuthFailure);
    return () => window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleAuthFailure);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/403" element={<div>Access Denied (403 Forbidden)</div>} />

        {/* Protected MFE: Requires Admin Role */}
        <Route
          path="/admin/*"
          element={
            <GuardedRoute
              session={session}
              isLoadingSession={isLoading}
              requiredRoles={['ADMIN']}
            >
              <AdminRemoteMFE session={session} />
            </GuardedRoute>
          }
        />

        {/* Protected MFE: Requires Billing Permission */}
        <Route
          path="/billing/*"
          element={
            <GuardedRoute
              session={session}
              isLoadingSession={isLoading}
              requiredPermissions={['invoices:read']}
            >
              <BillingRemoteMFE session={session} />
            </GuardedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

```

---

### 3. Child MFE: Intercepting API 401s & Fine-Grained Permissions

Child MFEs must not try to trigger redirects manually via `window.location.replace('/login')` or mutate cookies. Instead, they consume session props, guard in-component features, and dispatch event signals when their backend APIs return `401 Unauthorized`.

#### A. Unified Axios / Fetch Interceptor in Child MFE

```typescript
// child-mfe/src/api/apiClient.ts
import axios from 'axios';
import { AUTH_EVENTS } from '@my-org/auth-contract';

export const apiClient = axios.create({
  baseURL: '/api/v1/billing',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Notify the App Shell that the session has expired
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.SESSION_EXPIRED));
    }
    if (error.response?.status === 403) {
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.FORBIDDEN));
    }
    return Promise.reject(error);
  }
);

```

#### B. Component-Level Feature Guarding in Child MFE

```tsx
// child-mfe/src/components/RefundButton.tsx
import React from 'react';
import { UserSession } from '@my-org/auth-contract';

interface RefundButtonProps {
  session: UserSession;
  orderId: string;
}

export function RefundButton({ session, orderId }: RefundButtonProps) {
  const canRefund = session.permissions.includes('orders:refund');

  if (!canRefund) {
    return null; // Hide sensitive UI element if permission is missing
  }

  return (
    <button onClick={() => processRefund(orderId)}>
      Process Refund
    </button>
  );
}

```

---

### Security & Governance Rules

| Layer                     | Responsibility                                                                                                | What It MUST NOT Do                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **App Shell**             | Top-level routing, executing token rotation, orchestrating auth redirections, RBAC page guards.               | Do not micromanage internal child buttons/sub-views.                                     |
| **Child MFE**             | Internal memory routing, conditional UI rendering based on `session.permissions`, notifying shell on 401/403. | Do not handle OAuth login redirects or store tokens in isolated `localStorage` keys.     |
| **Backend / API Gateway** | **Source of Truth:** Validates JWT/session on every single microservice endpoint.                             | Never trust the frontend's RBAC validation; frontend guards are purely UX optimizations. |

---

### Summary Checklist

1. **Centralize the Gatekeeper:** The Shell evaluates authentication state *before* dynamic `import()` fetches the remote script bundles.
2. **Standardize Event Communication:** Use a shared constant (`AUTH_EVENTS.SESSION_EXPIRED`) so any MFE encountering an expired token signals the Shell to trigger re-authentication uniformly.
3. **Decouple Secrets:** Pass only session claims and access tokens top-down from the Shell; keep the refresh token isolated in an `HttpOnly` cookie.
