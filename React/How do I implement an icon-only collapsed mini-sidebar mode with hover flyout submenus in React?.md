To implement an icon-only mini-sidebar with hover flyout submenus, the architecture needs to handle two distinct interaction modes:

1. **Expanded Mode (260px):** Standard vertical tree with accordion slide-outs.
2. **Collapsed Mini Mode (64px):** Shows only icons, and hovering over any item triggers an **absolute/portal-positioned flyout popover** that lists the sub-routes or item title.

---

### 1. The Collapsible Mini-Sidebar (`components/CollapsibleSidebar.tsx`)

This component handles both modes and uses CSS-based hover popovers when `isCollapsed` is active.

```tsx
import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppRouteRecord } from '../types/routes';
import { useAuth } from '../components/RouteGuard';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface SidebarProps {
  routes: AppRouteRecord[];
}

const resolvePath = (basePath: string, path: string) => {
  if (path.startsWith('/')) return path;
  if (!path) return basePath;
  return `${basePath}/${path}`.replace(/\/+/g, '/');
};

export const CollapsibleSidebar: React.FC<SidebarProps> = ({ routes }) => {
  const { hasAccess } = useAuth();
  
  // Persist sidebar collapsed status (mini vs expanded)
  const [isCollapsed, setIsCollapsed] = useLocalStorageState<boolean>('sidebar_is_collapsed', false);
  const [expandedMap, setExpandedMap] = useLocalStorageState<Record<string, boolean>>('sidebar_expanded_map', {});

  // Filter accessible routes
  const accessibleRoutes = useMemo(() => {
    const filterTree = (nodes: AppRouteRecord[]): AppRouteRecord[] => {
      return nodes
        .filter((node) => !node.meta?.hideInNav && !node.path.includes(':') && hasAccess(node.meta))
        .map((node) => ({
          ...node,
          children: node.children ? filterTree(node.children) : undefined,
        }))
        .filter((node) => !node.children || node.children.length > 0);
    };
    return filterTree(routes);
  }, [routes, hasAccess]);

  const toggleAccordion = (fullPath: string) => {
    setExpandedMap((prev) => ({ ...prev, [fullPath]: !prev[fullPath] }));
  };

  return (
    <aside
      style={{
        width: isCollapsed ? '68px' : '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        height: '100vh',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 40,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Header & Toggle Button */}
      <div
        style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #1e293b',
        }}
      >
        {!isCollapsed && (
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#38bdf8', whiteSpace: 'nowrap' }}>
            Enterprise UI
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isCollapsed ? '⇥' : '⇤'}
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: isCollapsed ? 'visible' : 'auto' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {accessibleRoutes.map((route) => (
            <CollapsibleSidebarItem
              key={route.path}
              route={route}
              basePath=""
              depth={0}
              isCollapsed={isCollapsed}
              expandedMap={expandedMap}
              onToggle={toggleAccordion}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Item Component with Hover Flyout support
interface ItemProps {
  route: AppRouteRecord;
  basePath: string;
  depth: number;
  isCollapsed: boolean;
  expandedMap: Record<string, boolean>;
  onToggle: (path: string) => void;
}

const CollapsibleSidebarItem: React.FC<ItemProps> = ({
  route,
  basePath,
  depth,
  isCollapsed,
  expandedMap,
  onToggle,
}) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const fullPath = resolvePath(basePath, route.path);

  const navChildren = route.children?.filter((c) => !c.meta?.hideInNav && !c.path.includes(':'));
  const hasChildren = Boolean(navChildren && navChildren.length > 0);

  const isExpanded = Boolean(expandedMap[fullPath]);
  const isChildActive = location.pathname.startsWith(fullPath) && location.pathname !== fullPath;

  // Placeholder icon fallback if none provided
  const icon = route.meta.icon || '▫';

  // -------------------------------------------------------------
  // 1. COLLAPSED MINI-MODE (Flyout on hover)
  // -------------------------------------------------------------
  if (isCollapsed && depth === 0) {
    return (
      <li
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative', marginBottom: '6px' }}
      >
        <NavLink
          to={hasChildren ? fullPath + '/' + navChildren![0].path : fullPath}
          style={({ isActive }) => ({
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: isActive || isChildActive ? '#38bdf8' : '#94a3b8',
            backgroundColor: isActive || isChildActive ? '#1e293b' : 'transparent',
            textDecoration: 'none',
            fontSize: '18px',
          })}
        >
          <span>{icon}</span>
        </NavLink>

        {/* Floating Flyout Menu on Hover */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              left: 'calc(100% + 8px)',
              top: 0,
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              minWidth: '190px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
              border: '1px solid #334155',
              padding: '6px 0',
              zIndex: 100,
            }}
          >
            {/* Popover Header */}
            <div
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#38bdf8',
                borderBottom: hasChildren ? '1px solid #334155' : 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {route.meta.title}
            </div>

            {/* Popover Sub-Links */}
            {hasChildren && (
              <ul style={{ listStyle: 'none', margin: 0, padding: '4px 0' }}>
                {navChildren!.map((child) => {
                  const childPath = resolvePath(fullPath, child.path);
                  return (
                    <li key={child.path}>
                      <NavLink
                        to={childPath}
                        style={({ isActive }) => ({
                          display: 'block',
                          padding: '8px 14px',
                          fontSize: '13px',
                          textDecoration: 'none',
                          color: isActive ? '#ffffff' : '#94a3b8',
                          backgroundColor: isActive ? '#0284c7' : 'transparent',
                        })}
                      >
                        {child.meta.title}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </li>
    );
  }

  // -------------------------------------------------------------
  // 2. EXPANDED MODE (Standard Accordion Tree)
  // -------------------------------------------------------------
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
            padding: `8px 12px 8px ${12 + depth * 14}px`,
            backgroundColor: isChildActive ? '#1e293b' : 'transparent',
            color: isChildActive ? '#38bdf8' : '#94a3b8',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{icon}</span>
            <span>{route.meta.title}</span>
          </span>
          <span
            style={{
              fontSize: '10px',
              transform: isExpanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          >
            ▶
          </span>
        </button>

        {isExpanded && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navChildren!.map((child) => (
              <CollapsibleSidebarItem
                key={child.path}
                route={child}
                basePath={fullPath}
                depth={depth + 1}
                isCollapsed={isCollapsed}
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
          padding: `8px 12px 8px ${12 + depth * 14}px`,
          borderRadius: '6px',
          fontSize: '14px',
          textDecoration: 'none',
          backgroundColor: isActive ? '#0284c7' : 'transparent',
          color: isActive ? '#ffffff' : '#94a3b8',
        })}
      >
        <span>{icon}</span>
        <span>{route.meta.title}</span>
      </NavLink>
    </li>
  );
};

```

---

### 2. Key UX & Technical Considerations

* **`overflow` Switching:** The container uses `overflowY: isCollapsed ? 'visible' : 'auto'`. If the container keeps `overflow: hidden/auto` in collapsed mode, the flyout will get clipped by the sidebar bounds.
* **Flyout Offset:** `left: calc(100% + 8px)` renders the menu just outside the collapsed edge with a gap, maintaining hover focus across the boundary.
* **Direct Navigation on Parent Click:** In collapsed mode, clicking a parent folder defaults to its first child route (`fullPath + '/' + navChildren[0].path`) for fast access.
* **Accessible Tooltip Title:** Even for routes without children, the flyout popover acts as an instant tooltip displaying the title that is otherwise hidden in mini mode.
