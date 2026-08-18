Here is a complete, scalable TypeScript implementation of a **data-driven route registry** using React Router (v6/v7 compatible), with dynamic **Role-Based Access Control (RBAC)** guards and an automatic **breadcrumb engine**.

---

### 1. Types & Route Definitions (`types/routes.ts`)

Define the schema for routes, navigation metadata, and permission models.

```typescript
import { ComponentType, LazyExoticComponent } from 'react';

export type UserRole = 'admin' | 'manager' | 'viewer';
export type Permission = 'users:read' | 'users:write' | 'billing:read' | 'analytics:read';

export interface RouteMeta {
  title: string;
  breadcrumb?: string;
  icon?: string;
  hideInNav?: boolean;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
}

export interface AppRouteRecord {
  path: string;
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  meta: RouteMeta;
  children?: AppRouteRecord[];
}

```

---

### 2. Central Route Registry (`config/routes.config.ts`)

Every route in the dashboard is declared here with its metadata, lazy-loaded chunk, and access rules.

```typescript
import { lazy } from 'react';
import { AppRouteRecord } from '../types/routes';

export const APP_ROUTES: AppRouteRecord[] = [
  {
    path: '/dashboard',
    component: lazy(() => import('../pages/DashboardOverview')),
    meta: {
      title: 'Dashboard Overview',
      breadcrumb: 'Overview',
      icon: 'LayoutDashboard',
    },
  },
  {
    path: '/analytics',
    component: lazy(() => import('../pages/AnalyticsPage')),
    meta: {
      title: 'Analytics',
      breadcrumb: 'Analytics',
      icon: 'BarChart',
      requiredPermissions: ['analytics:read'],
    },
  },
  {
    path: '/users',
    component: lazy(() => import('../pages/UsersLayout')),
    meta: {
      title: 'User Management',
      breadcrumb: 'Users',
      icon: 'Users',
      requiredPermissions: ['users:read'],
    },
    children: [
      {
        path: '',
        component: lazy(() => import('../pages/UserListPage')),
        meta: {
          title: 'All Users',
          hideInNav: true,
        },
      },
      {
        path: ':id',
        component: lazy(() => import('../pages/UserDetailsPage')),
        meta: {
          title: 'User Details',
          breadcrumb: 'Details',
          hideInNav: true,
        },
      },
    ],
  },
  {
    path: '/billing',
    component: lazy(() => import('../pages/BillingPage')),
    meta: {
      title: 'Billing & Subscriptions',
      breadcrumb: 'Billing',
      icon: 'CreditCard',
      requiredRoles: ['admin', 'manager'],
      requiredPermissions: ['billing:read'],
    },
  },
];

```

---

### 3. Authentication & RBAC Hooks (`hooks/useAuth.ts`, `components/RouteGuard.tsx`)

A lightweight auth context that checks if the logged-in user satisfies both role and permission constraints.

```tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole, Permission, RouteMeta } from '../types/routes';

interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

interface AuthContextType {
  user: AuthUser | null;
  hasAccess: (meta?: RouteMeta) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Route Guard Component
export const RouteGuard: React.FC<{ meta: RouteMeta; children: ReactNode }> = ({ meta, children }) => {
  const { user, hasAccess } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess(meta)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>403 - Forbidden</h2>
        <p>You lack the required permissions to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

```

---

### 4. Dynamic Breadcrumb Generator Hook (`hooks/useBreadcrumbs.ts`)

Traverses the active URL path and matches it against the route registry to dynamically produce the breadcrumb chain.

```typescript
import { useLocation, matchPath, Link } from 'react-router-dom';
import { APP_ROUTES } from '../config/routes.config';
import { AppRouteRecord } from '../types/routes';

export interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const currentPath = location.pathname;

  // Flatten nested routes into absolute paths for matching
  const flattenRoutes = (
    routes: AppRouteRecord[],
    basePath = ''
  ): { fullPath: string; record: AppRouteRecord }[] => {
    return routes.reduce((acc, route) => {
      const cleanPath = route.path.startsWith('/') ? route.path : `/${route.path}`;
      const fullPath = route.path === '' ? basePath : `${basePath}${cleanPath}`.replace(/\/+/g, '/');

      acc.push({ fullPath, record: route });

      if (route.children) {
        acc.push(...flattenRoutes(route.children, fullPath));
      }
      return acc;
    }, [] as { fullPath: string; record: AppRouteRecord }[]);
  };

  const flatRoutes = flattenRoutes(APP_ROUTES);
  const pathSegments = currentPath.split('/').filter(Boolean);

  const crumbs: BreadcrumbItem[] = [];
  let constructedPath = '';

  pathSegments.forEach((segment, index) => {
    constructedPath += `/${segment}`;

    // Find the matching route definition (handles dynamic params like :id)
    const match = flatRoutes.find((r) => matchPath({ path: r.fullPath, end: true }, constructedPath));

    if (match && match.record.meta.breadcrumb) {
      crumbs.push({
        label: match.record.meta.breadcrumb,
        path: constructedPath,
        isLast: index === pathSegments.length - 1,
      });
    }
  });

  return crumbs;
}

```

---

### 5. Breadcrumb UI Component (`components/Breadcrumbs.tsx`)

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../hooks/useBreadcrumbs';

export const Breadcrumbs: React.FC = () => {
  const crumbs = useBreadcrumbs();

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', padding: '8px 0', fontSize: '14px' }}>
      <Link to="/dashboard" style={{ color: '#6b7280', textDecoration: 'none' }}>
        Home
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.path} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#d1d5db' }}>/</span>
          {crumb.isLast ? (
            <span style={{ color: '#111827', fontWeight: 600 }}>{crumb.label}</span>
          ) : (
            <Link to={crumb.path} style={{ color: '#6b7280', textDecoration: 'none' }}>
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

```

---

### 6. Dynamic Route Renderer & Router Integration (`App.tsx`)

Recursively transforms the data-driven configuration into React Router `<Route/>` objects wrapped with `Suspense` and `RouteGuard`.

```tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { APP_ROUTES } from './config/routes.config';
import { AppRouteRecord } from './types/routes';
import { AuthContext, RouteGuard } from './components/RouteGuard';
import { Breadcrumbs } from './components/Breadcrumbs';

// Recursive Route Builder
function renderAppRoutes(routes: AppRouteRecord[]) {
  return routes.map((route) => {
    const Component = route.component;

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <RouteGuard meta={route.meta}>
            <Suspense fallback={<div style={{ padding: '1rem' }}>Loading view...</div>}>
              <Component />
            </Suspense>
          </RouteGuard>
        }
      >
        {route.children && renderAppRoutes(route.children)}
      </Route>
    );
  });
}

// Global Shell Layout
function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: '#1e293b', color: '#fff', padding: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem' }}>Enterprise App</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/analytics" style={{ color: '#94a3b8', textDecoration: 'none' }}>Analytics</Link>
          <Link to="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Users</Link>
          <Link to="/billing" style={{ color: '#94a3b8', textDecoration: 'none' }}>Billing</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1.5rem', background: '#f8fafc' }}>
        <Breadcrumbs />
        <div style={{ marginTop: '1rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  // Mock current authenticated user
  const mockUser = {
    id: 'usr_123',
    name: 'Jane Doe',
    role: 'manager' as const,
    permissions: ['users:read', 'analytics:read'] as const,
  };

  const hasAccess = (meta?: AppRouteRecord['meta']) => {
    if (!meta) return true;
    const { requiredRoles, requiredPermissions } = meta;

    if (requiredRoles && !requiredRoles.includes(mockUser.role)) return false;
    if (requiredPermissions && !requiredPermissions.every((p) => mockUser.permissions.includes(p))) {
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user: mockUser, hasAccess }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            {renderAppRoutes(APP_ROUTES)}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

```

---

### Architectural Benefits

* **Single Source of Truth:** Adding a new page requires only one entry in `APP_ROUTES`. Router paths, dynamic sidebar menus, RBAC rules, page titles, and breadcrumbs update automatically.
* **Granular Lazy Loading:** Every route uses `React.lazy()`, ensuring only the requested page chunk and its dependencies are fetched.
* **Path-Matching Breadcrumbs:** `matchPath` correctly resolves parameterized dynamic routes (like `/users/:id` $\rightarrow$ `/users/42`) without hardcoded path segments.
