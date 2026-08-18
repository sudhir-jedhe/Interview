To generate a multi-level sidebar automatically from your route configuration, you need a recursive rendering component that:

1. **Filters out restricted items** using the user's RBAC roles/permissions.
2. **Filters out hidden items** (e.g., `hideInNav: true` or parameterized child routes like `:id`).
3. **Prunes empty parent nodes** if a user has no access to any of its children.
4. **Handles collapsible submenus** with active-path auto-expansion.

---

### 1. The Dynamic Sidebar Engine (`components/DynamicSidebar.tsx`)

```tsx
import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppRouteRecord, RouteMeta } from '../types/routes';
import { useAuth } from '../components/RouteGuard';

interface NavItemProps {
  route: AppRouteRecord;
  basePath: string;
  depth?: number;
}

// Helper: Normalize route paths
const resolvePath = (basePath: string, path: string) => {
  if (path.startsWith('/')) return path;
  if (!path) return basePath;
  return `${basePath}/${path}`.replace(/\/+/g, '/');
};

export const DynamicSidebar: React.FC<{ routes: AppRouteRecord[] }> = ({ routes }) => {
  const { hasAccess } = useAuth();

  // Recursively filter the tree by permissions and visibility
  const accessibleRoutes = useMemo(() => {
    const filterTree = (nodes: AppRouteRecord[]): AppRouteRecord[] => {
      return nodes
        .filter((node) => {
          // Exclude hidden nodes and paths with dynamic segments like :id
          if (node.meta?.hideInNav || node.path.includes(':')) return false;
          return hasAccess(node.meta);
        })
        .map((node) => {
          if (!node.children) return node;
          const filteredChildren = filterTree(node.children);
          return { ...node, children: filteredChildren };
        })
        // Prune parent category if it has an empty child array after filtering
        .filter((node) => !node.children || node.children.length > 0);
    };

    return filterTree(routes);
  }, [routes, hasAccess]);

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#38bdf8' }}>
          Enterprise Core
        </h2>
      </div>

      <nav style={{ flex: 1, padding: '12px 8px' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {accessibleRoutes.map((route) => (
            <SidebarItem key={route.path} route={route} basePath="" depth={0} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Recursive Nav Item Component
const SidebarItem: React.FC<NavItemProps> = ({ route, basePath, depth = 0 }) => {
  const location = useLocation();
  const fullPath = resolvePath(basePath, route.path);

  // Filter valid visual children
  const navChildren = route.children?.filter((c) => !c.meta?.hideInNav && !c.path.includes(':'));
  const hasChildren = Boolean(navChildren && navChildren.length > 0);

  // Auto-expand folder if current route is a child
  const isChildActive = location.pathname.startsWith(fullPath) && location.pathname !== fullPath;
  const [isOpen, setIsOpen] = useState(isChildActive);

  const paddingLeft = 12 + depth * 16;

  // Folder with sub-routes
  if (hasChildren) {
    return (
      <li style={{ marginBottom: '2px' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `8px 12px 8px ${paddingLeft}px`,
            backgroundColor: isChildActive ? '#1e293b' : 'transparent',
            color: isChildActive ? '#38bdf8' : '#94a3b8',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'background 0.15s ease',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{route.meta.title}</span>
          </span>
          <span
            style={{
              fontSize: '10px',
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(90deg)' : 'none',
            }}
          >
            ▶
          </span>
        </button>

        {isOpen && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navChildren!.map((child) => (
              <SidebarItem
                key={child.path}
                route={child}
                basePath={fullPath}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // Terminal Leaf Route Link
  return (
    <li style={{ marginBottom: '2px' }}>
      <NavLink
        to={fullPath}
        end={fullPath === '/dashboard'}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: `8px 12px 8px ${paddingLeft}px`,
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: isActive ? 600 : 400,
          textDecoration: 'none',
          backgroundColor: isActive ? '#0284c7' : 'transparent',
          color: isActive ? '#ffffff' : '#94a3b8',
          transition: 'all 0.15s ease',
        })}
      >
        <span>{route.meta.title}</span>
      </NavLink>
    </li>
  );
};

```

---

### 2. Multi-Level Route Config Example (`config/routes.config.ts`)

```typescript
import { lazy } from 'react';
import { AppRouteRecord } from '../types/routes';

export const APP_ROUTES: AppRouteRecord[] = [
  {
    path: '/dashboard',
    component: lazy(() => import('../pages/Dashboard')),
    meta: { title: 'Dashboard', icon: 'LayoutDashboard' },
  },
  {
    path: '/system',
    component: lazy(() => import('../pages/SystemLayout')),
    meta: {
      title: 'System Settings',
      requiredRoles: ['admin'], // Entire branch hidden for non-admins
    },
    children: [
      {
        path: 'general',
        component: lazy(() => import('../pages/GeneralSettings')),
        meta: { title: 'General' },
      },
      {
        path: 'security',
        component: lazy(() => import('../pages/SecuritySettings')),
        meta: {
          title: 'Security & Keys',
          requiredPermissions: ['users:write'],
        },
      },
      {
        path: 'audit-logs/:logId', // Ignored by sidebar because of :logId
        component: lazy(() => import('../pages/AuditLogDetail')),
        meta: { title: 'Log Detail', hideInNav: true },
      },
    ],
  },
  {
    path: '/analytics',
    component: lazy(() => import('../pages/AnalyticsLayout')),
    meta: { title: 'Analytics', requiredPermissions: ['analytics:read'] },
    children: [
      {
        path: 'realtime',
        component: lazy(() => import('../pages/Realtime')),
        meta: { title: 'Realtime Traffic' },
      },
      {
        path: 'reports',
        component: lazy(() => import('../pages/Reports')),
        meta: { title: 'Saved Reports' },
      },
    ],
  },
];

```

---

### 3. Integrating Sidebar with Dashboard Layout (`layouts/DashboardLayout.tsx`)

```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicSidebar } from '../components/DynamicSidebar';
import { APP_ROUTES } from '../config/routes.config';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const DashboardLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Auto-generated Sidebar */}
      <DynamicSidebar routes={APP_ROUTES} />

      {/* Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
          <Breadcrumbs />
        </header>
        <main style={{ flex: 1, padding: '24px', background: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

```

---

### Key Architectural Behaviors

* **Deep Tree Permission Pruning:** If a user role has access to `/system` but lacks permissions for every child inside it, the filtering engine strips `/system` completely so no empty folders clutter the UI.
* **Smart Auto-Expansion:** Opening a deep link like `/system/security` directly in the browser causes the parent `/system` accordion menu to initialize in an expanded state.
* **Automatic Path Resolution:** Child paths (`general`) are concatenated with parent base paths (`/system` $\rightarrow$ `/system/general`) without hardcoded URLs.
