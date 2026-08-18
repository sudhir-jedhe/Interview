Scaling a dashboard with 100+ pages requires optimizing three core pillars: **bundle delivery**, **codebase maintainability**, and **runtime performance**.

---

### 1. Architecture & Folder Structure: Feature-Sliced Modules

Avoid grouping by technical type (e.g., all components in one `/components` folder). Instead, use **domain-driven / feature-sliced modularization** so teams can work independently without coupling pages.

```text
src/
├── app/                  # Application initialization, providers, top-level router
├── shared/               # Domain-agnostic UI kit (buttons, modals), utility hooks, api-client
├── core/                 # Auth, RBAC context, navigation config, theme engine
└── features/             # Domain-specific vertical slices
    ├── analytics/
    │   ├── api/          # Query/mutation hooks specific to analytics
    │   ├── components/   # Internal sub-components (charts, metric widgets)
    │   ├── hooks/        # Local feature hooks
    │   ├── types/        # Feature TypeScript definitions
    │   └── pages/        # Lazy-loaded page entry points (Overview, Cohorts, Funnels)
    ├── billing/
    └── user-management/

```

* **Module Boundaries:** Enforce import boundaries using ESLint (e.g., `eslint-plugin-boundaries` or Nx Module Boundaries) so `features/billing` cannot directly import internal subcomponents from `features/analytics`. Cross-feature sharing must go through public APIs (`index.ts`) or `shared/`.

---

### 2. Routing, Code Splitting & Chunking Strategy

For 100+ pages, bundling everything together creates an unacceptably large initial JavaScript payload.

* **Route-Level Code Splitting:** Every page is dynamically imported via `React.lazy()` or Vite/Next.js/React Router `lazy` route definitions:

```tsx
const AnalyticsOverview = React.lazy(() => import('@/features/analytics/pages/OverviewPage'));

```

* **Intelligent Pre-fetching on Intent:** Preload page chunks when the user hovers over a navigation link or sidebar item:

```tsx
const preloadAnalytics = () => import('@/features/analytics/pages/OverviewPage');
<SidebarLink onMouseEnter={preloadAnalytics} to="/analytics">Analytics</SidebarLink>

```

* **Shared Vendor Chunking (Vite / Webpack / Rspack):** Separate heavy third-party libraries (e.g., D3/ECharts, SheetJS, Monaco Editor) into isolated chunks so they are only downloaded when entering a page that requires them.

---

### 3. Centralized Dynamic Routing & Dynamic Menu System

Hardcoding 100+ routes in JSX causes clutter and synchronization drift between the sidebar navigation and router definitions. Use a **data-driven route registry**:

```typescript
export interface AppRouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requiredPermissions: Permission[];
  title: string;
  icon?: string;
  layout?: 'default' | 'fullscreen' | 'compact';
  children?: AppRouteConfig[];
}

```

* **Dynamic Sidebar Generation:** The sidebar reads the route registry and filters out items the current user doesn't have permissions to see.
* **Breadcrumb & Page Title Engine:** Dynamically generated from the matched route tree, eliminating repetitive title/breadcrumb code across 100+ page files.

---

### 4. Enterprise-Grade Role-Based Access Control (RBAC)

With 100+ pages, permissions must be enforced at both the **route level** and the **component level**.

```tsx
// 1. Route Guard
export function ProtectedRoute({ requiredPermissions, children }: RouteGuardProps) {
  const { hasPermissions, isLoading } = useAuth();
  if (isLoading) return <PageSkeletonLoader />;
  if (!hasPermissions(requiredPermissions)) return <Forbidden403Page />;
  return <>{children}</>;
}

// 2. Fine-grained UI Guard
export function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermissions } = useAuth();
  return hasPermissions([permission]) ? <>{children}</> : <>{fallback}</>;
}

```

---

### 5. State Management & Server-State Separation

Mixing server data and client state causes massive overhead and unnecessary re-renders across multi-page apps.

```
┌────────────────────────────────────────────────────────┐
│                      State Layer                       │
├──────────────────────────┬─────────────────────────────┤
│  Server State            │  Client / Global UI State   │
│  (TanStack Query / SWR)  │  (Zustand)                  │
│  - API Caching           │  - Active Sidebar State     │
│  - Background Refetch    │  - Theme / User Preferences │
│  - Stale-While-Revalidate│  - Modal / Drawer Stacks    │
│  - Mutation Rollbacks    │  - Transient View Toggles   │
└──────────────────────────┴─────────────────────────────┘

```

* **URL as the Single Source of Truth:** Filters, active tabs, page numbers, date ranges, and sorting must live in URL search parameters (`useSearchParams`). This enables deep linking, browser history support, and prevents state synchronization bugs.

---

### 6. Design System & Virtualization for Data Grids

* **Headless / Composable UI Components:** Build on top of headless foundations (e.g., Radix UI, React Aria) styled with Tailwind CSS or CSS Modules to ensure accessibility, keyboard navigation, and theme flexibility.
* **Virtualized Lists and Tables:** Large dashboards handle large datasets. Render tables and select lists using `@tanstack/react-virtual` to keep DOM node counts minimal regardless of data volume.
* **Micro-Skeleton Loaders:** Instead of a full-page blocking spinner, provide localized skeleton layouts matching the shape of charts/cards to reduce perceived latency.

---

### 7. Scalability Comparison Matrix

| Architectural Dimension | Naive Approach (Fails at Scale)           | 100+ Page Scaled Pattern                                          |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| **Code Splitting**      | Monolithic bundle with static imports     | Dynamic `React.lazy()` + route chunking + hover prefetching       |
| **Data Fetching**       | `useEffect` + local `useState` everywhere | TanStack Query with central cache keys and stale-while-revalidate |
| **Navigation / RBAC**   | Hardcoded JSX `<Route>` elements          | Metadata-driven route config + dynamic sidebar & breadcrumbs      |
| **Folder Architecture** | Grouped by type (`/components`, `/pages`) | Feature-sliced architecture (`/features/<domain>`)                |
| **State Sync**          | Giant Redux/Context store for filters     | URL Query Params for filters; small Zustand stores for UI         |

---

### 8. Micro-Frontends vs. Modular Monorepo

* **Monorepo (Turborepo / Nx) with Vite/Rspack (Recommended):** Keeps CI/CD simple, shares a unified design system and TypeScript types, and avoids micro-frontend runtime routing complexity while maintaining modular feature boundaries.
* **Micro-Frontends (Module Federation):** Only consider this if distinct independent teams (e.g., 5+ autonomous engineering squads) must deploy their features independently on different release cycles.
