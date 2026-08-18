Coordinating client-side routing between a host container (Application Shell) and child Micro-Frontends (MFEs) requires solving two primary problems:

1. **Preventing Router Collisions:** Avoiding multiple routers fighting over `window.history` and causing infinite navigation loops or missed state syncs.
2. **Deep Linking & Sub-Routing:** Allowing the shell to own the top-level route (e.g., `/dashboard/*`) while the child MFE owns internal sub-routes (e.g., `/dashboard/settings`, `/dashboard/analytics`).

The industry-standard approach uses **History Synchronization via Memory Routers** (recommended by Single-SPA and Module Federation patterns).

---

### Core Architecture: Browser History vs. Memory History

```
  Browser URL: /dashboard/settings
          │
          ▼
┌────────────────────────────────────────────────────────┐
│                   Application Shell                    │
│   • Uses BrowserHistory (owns window.history)          │
│   • Matches top-level prefix: /dashboard/*             │
└──────────────────────────┬─────────────────────────────┘
                           │
             (Syncs path via Event / Callback)
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             Remote Child MFE (e.g., Dashboard)         │
│   • Uses MemoryHistory (isolated internal router)      │
│   • Matches sub-path: /settings                        │
└────────────────────────────────────────────────────────┘

```

* **Shell uses `BrowserHistory`:** Directly listens to and updates `window.location` and the browser history stack.
* **Child MFEs use `MemoryHistory`:** Keeps its routing state in memory, completely decoupled from `window.history`.
* **The Bridge:** The Shell and Child synchronize routes via explicit navigation events.

---

### 1. The Child Micro-Frontend Contract (`DashboardApp.tsx`)

The child MFE exports a lifecycle `mount` function (or a wrapped React component) that accepts the shell's current pathname, a navigation callback, and returns its own navigation handler.

```tsx
// Remote MFE (e.g., React + React Router v6)
import React, { useEffect } from 'react';
import { createMemoryRouter, RouterProvider, useNavigate, useLocation } from 'react-router-dom';

interface MountProps {
  initialPathname: string;
  onNavigate?: (location: { pathname: string }) => void;
}

// Internal sync component that notifies the shell of internal sub-route changes
function ShellSync({ onNavigate }: { onNavigate?: (location: { pathname: string }) => void }) {
  const location = useLocation();

  useEffect(() => {
    if (onNavigate) {
      onNavigate({ pathname: location.pathname });
    }
  }, [location, onNavigate]);

  return null;
}

// Define child routes relative to its own sub-tree
const routes = [
  {
    path: '/',
    element: (
      <div>
        <h2>Dashboard Home</h2>
        <a href="#/settings">Go to Settings</a>
      </div>
    ),
  },
  {
    path: '/settings',
    element: <div><h2>Dashboard Settings</h2></div>,
  },
  {
    path: '/analytics',
    element: <div><h2>Dashboard Analytics</h2></div>,
  },
];

export function DashboardMfe({ initialPathname, onNavigate }: MountProps) {
  // 1. Create a Memory Router initialized with the path handed by the Shell
  const [router] = React.useState(() =>
    createMemoryRouter(
      routes.map((r) => ({
        ...r,
        element: (
          <>
            <ShellSync onNavigate={onNavigate} />
            {r.element}
          </>
        ),
      })),
      {
        initialEntries: [initialPathname || '/'],
      }
    )
  );

  return <RouterProvider router={router} />;
}

// 2. Framework-Agnostic Mount helper (for Single-SPA or Vanilla consumption)
export function mount(el: HTMLElement, props: MountProps) {
  const root = ReactDOM.createRoot(el);
  root.render(<DashboardMfe {...props} />);

  return {
    onParentNavigate({ pathname }: { pathname: string }) {
      // Logic to push new path into the internal Memory Router if changed
    },
    unmount() {
      root.unmount();
    },
  };
}

```

---

### 2. The Host Shell Container (`AppShell.tsx`)

The Shell mounts the child MFE at the specified route prefix (e.g., `/dashboard/*`), strips the prefix when passing the route down, and updates `window.history` when the child navigates internally.

```tsx
// Shell Application (Host)
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Dynamically import child MFE via Module Federation
const RemoteDashboard = lazy(() => import('dashboard_remote/DashboardMfe'));

function DashboardWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  // Strip prefix: "/dashboard/settings" -> "/settings"
  const childSubPath = location.pathname.replace(/^\/dashboard/, '') || '/';

  // Handle navigations originating from inside the Child MFE
  const handleChildNavigate = ({ pathname }: { pathname: string }) => {
    const targetPath = `/dashboard${pathname === '/' ? '' : pathname}`;
    
    // Prevent duplicate history pushes if the path is already aligned
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <RemoteDashboard
        initialPathname={childSubPath}
        onNavigate={handleChildNavigate}
      />
    </Suspense>
  );
}

export function AppShell() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: '1px solid #ccc' }}>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/dashboard/settings">Settings</a>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to App Shell Home</h1>} />
        {/* Wildcard allows child MFE to manage all deep sub-routes */}
        <Route path="/dashboard/*" element={<DashboardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

```

---

### 3. Alternative: Global Event-Driven Custom History Bridge

If child MFEs use different frameworks (e.g., Shell in React, Child A in Angular, Child B in Vue), implement a generic window-level custom event contract.

```typescript
// routing/bridge.ts
export interface MfeNavigationPayload {
  mfeName: string;
  path: string;
}

export function dispatchMfeNavigation(mfeName: string, path: string) {
  window.dispatchEvent(
    new CustomEvent<MfeNavigationPayload>('mfe:navigate', {
      detail: { mfeName, path },
    })
  );
}

export function listenToMfeNavigation(callback: (payload: MfeNavigationPayload) => void) {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<MfeNavigationPayload>;
    callback(customEvent.detail);
  };

  window.addEventListener('mfe:navigate', handler);
  return () => window.removeEventListener('mfe:navigate', handler);
}

```

---

### 4. Handling Cross-MFE Navigations

When MFE A needs to navigate to a page owned by MFE B (e.g., from `/dashboard/orders` to `/checkout/pay`):

1. **Top-Level Shell Links:** Use standard HTML `<a>` tags or native `window.history.pushState(null, '', '/checkout/pay')` followed by dispatching a `popstate` event:

```typescript
export function navigateToMfe(targetUrl: string) {
  window.history.pushState(null, '', targetUrl);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

```

1. **Shell Interception:** The Shell intercepts the URL change, unmounts MFE A, and mounts MFE B at `/checkout`.

---

### Routing Rules of Thumb for MFEs

* **Never run multiple `BrowserRouter` instances simultaneously:** Multiple active `BrowserRouter` components will simultaneously listen to `popstate`, leading to race conditions and duplicate history entries.
* **Child MFEs should always support basename or prefix stripping:** A child should not hardcode `/dashboard` inside its route definitions; it should operate relative to its assigned root (`/`).
* **Preserve Query Parameters and State:** Ensure the bridge passes search parameters (`?tab=billing&filter=active`) through to the memory router so deep links resolve properly.
