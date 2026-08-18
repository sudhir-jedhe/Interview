To persist the expanded and collapsed states across page reloads and user sessions, lift the accordion state out of individual recursive items into a **central set of expanded paths** backed by `localStorage`.

---

### 1. The Persistent State Hook (`hooks/useLocalStorageState.ts`)

A type-safe hook that syncs with `localStorage` and handles SSR/JSON serialization safely:

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn(`Error writing to localStorage key "${key}":`, err);
    }
  }, [key, state]);

  return [state, setState];
}

```

---

### 2. Multi-Level Sidebar with Persistent State (`components/DynamicSidebar.tsx`)

Instead of each submenu managing an isolated `useState(false)`, use a shared record `Record<string, boolean>` where keys are the **resolved route paths** (e.g., `"/system": true`, `"/analytics": false`).

```tsx
import React, { useMemo, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppRouteRecord } from '../types/routes';
import { useAuth } from '../components/RouteGuard';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface SidebarItemProps {
  route: AppRouteRecord;
  basePath: string;
  depth?: number;
  expandedMap: Record<string, boolean>;
  onToggle: (path: string) => void;
}

const resolvePath = (basePath: string, path: string) => {
  if (path.startsWith('/')) return path;
  if (!path) return basePath;
  return `${basePath}/${path}`.replace(/\/+/g, '/');
};

const STORAGE_KEY = 'app_sidebar_expanded_state';

export const DynamicSidebar: React.FC<{ routes: AppRouteRecord[] }> = ({ routes }) => {
  const { hasAccess } = useAuth();
  const location = useLocation();

  // Map of fullPath -> boolean (e.g., { "/system": true, "/analytics": false })
  const [expandedMap, setExpandedMap] = useLocalStorageState<Record<string, boolean>>(STORAGE_KEY, {});

  // Recursively filter by access and hidden flags
  const accessibleRoutes = useMemo(() => {
    const filterTree = (nodes: AppRouteRecord[]): AppRouteRecord[] => {
      return nodes
        .filter((node) => {
          if (node.meta?.hideInNav || node.path.includes(':')) return false;
          return hasAccess(node.meta);
        })
        .map((node) => ({
          ...node,
          children: node.children ? filterTree(node.children) : undefined,
        }))
        .filter((node) => !node.children || node.children.length > 0);
    };

    return filterTree(routes);
  }, [routes, hasAccess]);

  // Auto-expand any parent folder when deep-linking directly to a child URL
  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return;

    let accumulatedPath = '';
    const pathsToOpen: Record<string, boolean> = {};

    segments.slice(0, -1).forEach((seg) => {
      accumulatedPath += `/${seg}`;
      pathsToOpen[accumulatedPath] = true;
    });

    setExpandedMap((prev) => {
      // Only update if at least one parent isn't already expanded
      const needsUpdate = Object.keys(pathsToOpen).some((p) => !prev[p]);
      return needsUpdate ? { ...prev, ...pathsToOpen } : prev;
    });
  }, [location.pathname, setExpandedMap]);

  const toggleExpand = (fullPath: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [fullPath]: !prev[fullPath],
    }));
  };

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
            <SidebarItem
              key={route.path}
              route={route}
              basePath=""
              depth={0}
              expandedMap={expandedMap}
              onToggle={toggleExpand}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  route,
  basePath,
  depth = 0,
  expandedMap,
  onToggle,
}) => {
  const location = useLocation();
  const fullPath = resolvePath(basePath, route.path);

  const navChildren = route.children?.filter((c) => !c.meta?.hideInNav && !c.path.includes(':'));
  const hasChildren = Boolean(navChildren && navChildren.length > 0);

  // Read state from the centralized, persisted map (default to false if unset)
  const isExpanded = Boolean(expandedMap[fullPath]);
  const isChildActive = location.pathname.startsWith(fullPath) && location.pathname !== fullPath;
  const paddingLeft = 12 + depth * 16;

  if (hasChildren) {
    return (
      <li style={{ marginBottom: '2px' }}>
        <button
          type="button"
          onClick={() => onToggle(fullPath)}
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
          <span>{route.meta.title}</span>
          <span
            style={{
              fontSize: '10px',
              transition: 'transform 0.2s ease',
              transform: isExpanded ? 'rotate(90deg)' : 'none',
            }}
          >
            ▶
          </span>
        </button>

        {isExpanded && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navChildren!.map((child) => (
              <SidebarItem
                key={child.path}
                route={child}
                basePath={fullPath}
                depth={depth + 1}
                expandedMap={expandedMap}
                onToggle={onToggle}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

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

### Key Features of this Implementation

* **Path-Based Keys:** Using the resolved absolute path (`/system`, `/system/security`) as the map key avoids collisions if multiple sections have sub-routes with identical names (e.g., `settings` or `overview`).
* **Deep-Link Auto-Expansion:** If a user lands directly on a bookmark or shared URL (e.g., `/system/security/api-keys`), the `useEffect` parses the URL segments and ensures all ancestor folders expand immediately, updating `localStorage`.
* **State Isolation:** Submenu expand/collapse state changes do not cause route navigation; only clicking leaf links triggers React Router updates.
