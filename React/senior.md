Here is an enterprise-grade playbook covering all 10 core architectural pillars for Senior/Staff React Engineering interviews.

---

### 1️⃣ Large-Scale Architecture & Project Structure

To scale past 50+ developers and hundreds of routes, avoid organizing by technical type (`/components`, `/hooks`, `/services`). Instead, adopt **Feature-Based Modularization (Vertical Slicing)** combined with a **Layered Architecture**.

#### Directory Structure (Vertical Slices + Layered Core)

```text
src/
├── app/                  # Application root, global providers, router, layouts
├── assets/               # Global static assets (svgs, fonts, global styles)
├── shared/               # Domain-agnostic infrastructure & design system
│   ├── ui/               # Low-level primitives (Button, Modal, Input)
│   ├── api/              # Base HTTP client, interceptors
│   ├── hooks/            # Generic hooks (useDebounce, useIntersectionObserver)
│   └── utils/            # Pure helpers (date-fns wrappers, math helpers)
├── features/             # Business modules (Domain Driven)
│   ├── analytics/
│   │   ├── api/          # React Query hooks, fetchers
│   │   ├── components/   # Analytics-specific components
│   │   ├── hooks/        # Module-specific hooks
│   │   ├── types/        # TypeScript interfaces
│   │   └── index.ts      # Explicit public API barrel file
│   └── billing/
└── pages/                # Route definitions lazily rendering feature views

```

#### Key Architecture Principles

* **Public API Barrels (`index.ts`):** Features only expose what other features need. Internal implementation details remain private to prevent circular dependencies.
* **Monorepo Strategy (Turborepo / Nx):** When cross-team boundaries require distinct CI/CD pipelines, split the monorepo into packages:
* `apps/web`: Shell app / Next.js
* `packages/ui`: Shared design system
* `packages/config`: ESLint, TypeScript, and Tailwind presets

* **Vite vs Next.js:** Prefer **Next.js (App Router)** when SSR, SEO, or server-centric streaming (RSC) is required. Prefer **Vite** for SPA dashboards behind authentication walls where client-side rendering speed and SPA ergonomics dominate.

---

### 2️⃣ State Management Strategy & Trade-Offs

State should be classified into **four distinct tiers** rather than dumped into a single global store:

```
┌─────────────────────────────────────────────────────────────┐
│                       Server State                          │
│               (TanStack Query / SWR / RTK Query)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Global Client State                      │
│                  (Zustand / Redux Toolkit)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                      Context State                          │
│             (Theme, Auth Context, Scope Local)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                      Local Component                        │
│                   (useState / useReducer)                   │
└─────────────────────────────────────────────────────────────┘

```

| Criteria             | React Context                                              | Zustand                                                         | Redux Toolkit (RTK)                                               |
| -------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Primary Use Case** | Low-frequency updates (Theme, Locale, Current User)        | High-frequency client UI state (Modals, Step Wizards, Filters)  | Complex enterprise apps with strict transactional state logs      |
| **Performance**      | Causes re-render on *all* consumers when any value changes | Atomic selectors isolate renders to specific changed properties | Boilerplate selectors optimize renders; uses Immer under the hood |
| **DevEx / Overhead** | Zero dependencies, built-in                                | Extremely low boilerplate, hook-first, supports middleware      | Action/Reducer pattern, heavy DevTools ecosystem                  |

#### Selection Rule

1. **Server Data:** Use **TanStack Query**. Never store server response data in Redux or Zustand.
2. **Global UI State:** Use **Zustand**. Use atomic state selection to prevent extra re-renders:

```typescript
const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

```

---

### 3️⃣ Rendering Performance in Data-Heavy Dashboards

#### A. DOM Virtualization

Rendering 10,000 table rows or chart data points freezes the main thread due to DOM node creation.

* Use **`@tanstack/react-virtual`** or **`react-window`** to mount only the visible nodes within the viewport buffer.
* Use **AG-Grid Enterprise** or **TanStack Table** for feature-rich data tables requiring column virtualization, pin-supported columns, and custom cell renders.

#### B. Strategic Memoization

* **`useMemo`:** Wrap expensive array operations (filtering, sorting, aggregations) or large objects passed down props.
* **`useCallback`:** Stabilize function references passed to memoized child components (`React.memo`).

#### C. Concurrent React & Debouncing

* **`useDeferredValue` / `useTransition`:** Keep input fields responsive while deferring low-priority rendering tasks (e.g., updating complex data visualizations during real-time typing).
* **Debouncing/Throttling:** Throttle high-frequency events (WebSocket ticks, scroll events, resize observables) before committing them to React state.

#### D. Profiling

Identify re-render causes using **React DevTools Profiler** ("Highlight updates when components render") and **`why-did-you-render`** in local staging builds to trace unstable prop references.

---

### 4️⃣ Code Splitting & Lazy Loading

#### A. Route-Based Code Splitting

Break app bundles into page chunks using `React.lazy` and `Suspense`:

```tsx
import React, { Suspense, lazy } from 'react';
import { PageSkeleton } from '@/shared/ui';

const AnalyticsPage = lazy(() => import('@/pages/analytics'));

export function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnalyticsPage />
    </Suspense>
  );
}

```

#### B. Component & Library Dynamic Imports

Defer heavy libraries (e.g., `Chart.js`, `Monaco Editor`, `PDF Generator`) until requested by user action:

```tsx
const handleOpenEditor = async () => {
  const { monaco } = await import('monaco-editor');
  // Initialize editor on demand
};

```

#### C. Preloading Strategies

Intelligently fetch chunks on hover or intent to eliminate loading spinners:

```tsx
const preloadAnalytics = () => import('@/pages/analytics');

<Link to="/analytics" onMouseEnter={preloadAnalytics}>
  Analytics
</Link>

```

---

### 5️⃣ Design Systems & Component Libraries

#### A. Architecture & Methodology

* **Atomic Design:** Foundations (Tokens/Vars) $\rightarrow$ Atomics (Button, Input) $\rightarrow$ Molecules (FormField) $\rightarrow$ Organisms (DataGrid, Navbar).
* **Headless UI Primitives:** Use unstyled, accessible primitives (**Radix UI** or **React Aria**) for state/accessibility, and style them using **Tailwind CSS** or CSS Modules.

#### B. Design Tokens & Multi-Theme System

Define design tokens using CSS Variables managed via a theme provider to allow light, dark, and high-contrast modes:

```css
:root {
  --color-primary-500: #3b82f6;
  --surface-bg: #ffffff;
}

[data-theme='dark'] {
  --surface-bg: #0f172a;
}

```

#### C. Documentation & Tooling

* **Storybook:** For component isolation, visual testing, and documentation.
* **Accessibility (a11y):** Enforce ARIA patterns, manage keyboard focus traps (e.g., in modals using Radix), and integrate `axe-core` in CI pipelines to catch automated accessibility errors.

---

### 6️⃣ Side Effects, Async Calls & Caching

#### The Standard: Server State Management via TanStack Query

Abandon imperative `useEffect` fetching patterns. `useEffect` fetches lead to race conditions, manual cancellation bugs, and waterfall loads.

```tsx
// Query Hook Layer
export function useUserData(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUserById(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 10 * 60 * 1000,    // 10 minutes cache retention
  });
}

```

#### Enterprise Best Practices

* **Optimistic Updates:** Update the local UI immediately on user action and rollback automatically if the server mutation fails.
* **Auto-Deduplication & Polling:** Query keys deduplicate parallel requests for the same payload across multiple components.
* **Error Retries & Circuit Breakers:** Configure exponential backoff retry algorithms for transient network failures.

---

### 7️⃣ Production Error Boundaries & Logging

#### A. Declarative Error Boundaries

React components cannot catch errors inside async handlers, event listeners, or SSR. Use component-level boundaries for render errors combined with global event listeners.

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function FallbackUI({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert" className="error-card">
      <p>Something went wrong in this module.</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

// Wrap critical feature widgets individually so one crash doesn't blank out the whole page
<ErrorBoundary FallbackComponent={FallbackUI} onReset={() => queryCache.clear()}>
  <ComplexChartWidget />
</ErrorBoundary>

```

#### B. Production Monitoring Integration (e.g., Sentry / Datadog)

* **Global Error Capture:** Attach `window.onerror` and `window.onunhandledrejection` handlers.
* **User Context & Breadcrumbs:** Pass logged-in user IDs, active route metadata, and recent user actions (clicks, network calls) to Sentry error reports.

---

### 8️⃣ Micro-Frontends & Module Federation

Module Federation enables independent teams to compile and deploy separate builds while executing as a single runtime SPA.

```
┌──────────────────────────────────────────────────────────┐
│                   Shell Application                      │
│                  (Host Engine / Router)                  │
└──────────────┬────────────────────────────┬──────────────┘
               │                            │
  Loads Remote │                            │ Loads Remote
               ▼                            ▼
┌───────────────────────────┐  ┌───────────────────────────┐
│     Checkout Remote       │  │     Dashboard Remote      │
│   (Team A - Independent)  │  │   (Team B - Independent)  │
└───────────────────────────┘  └───────────────────────────┘

```

#### Core Mechanics

* **Host vs. Remote:** The Host mounts remote modules dynamically at runtime via `remoteEntry.js`.
* **Shared Dependencies:** Configure React and runtime dependencies as shared singletons in Webpack/Vite plugins to prevent duplicating heavy frameworks in memory:

```javascript
shared: {
  react: { singleton: true, eager: true, requiredVersion: '^18.0.0' },
  'react-dom': { singleton: true, eager: true, requiredVersion: '^18.0.0' },
}

```

* **Cross-App Communication:** Keep MFEs isolated. Communicate across boundaries using **Custom Browser Events**, query parameters, or light event-bus libraries rather than shared global stores.

---

### 9️⃣ Security Best Practices in Single-Page Apps

#### A. Preventing XSS (Cross-Site Scripting)

* **Sanitization:** Never use `dangerouslySetInnerHTML` without parsing data through **DOMPurify**.
* **Content Security Policy (CSP):** Enforce strict server HTTP response headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.com;

```

#### B. Auth & Token Storage (CSRF vs. XSS Trade-off)

* **Avoid `localStorage`:** Storing JWTs in `localStorage` makes them accessible to malicious XSS scripts.
* **`httpOnly`, `SameSite=Strict`, `Secure` Cookies:** Prefer storing authentication session tokens in `httpOnly` cookies so JavaScript cannot read them, protecting them against XSS token theft. Use CSRF tokens or `SameSite` policies to mitigate Cross-Site Request Forgery.

#### C. API Security

Sanitize user inputs on both client and server sides. Use TypeScript interfaces and validation schemas (**Zod**) at API boundaries to reject malformed payload structures before rendering.

---

### 🔟 Feature Experimentation & A/B Testing

#### Architecture Pattern: Headless Feature Flag Context

```tsx
// 1. Feature Flag Context
const FeatureFlagContext = createContext<Record<string, boolean>>({});

export const FeatureFlagProvider = ({ children, user }: Props) => {
  const [flags, setFlags] = useState({});

  useEffect(() => {
    // Fetch flags from Optimizely / LaunchDarkly / PostHog
    fetchFlagsForUser(user.id).then(setFlags);
  }, [user.id]);

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// 2. Declarative Variant Component
export function FeatureVariant({ flag, fallback = null, children }: Props) {
  const flags = useContext(FeatureFlagContext);
  return flags[flag] ? <>{children}</> : <>{fallback}</>;
}

```

#### Analytical Tracking & Clean-Up

* **Exposure Tracking:** When a variant component mounts, fire an analytics exposure event (`analytics.track('Experiment Exposed', { flag: 'new_checkout_v2', variant: 'B' })`).
* **Technical Debt Management:** Enforce strict cleanup cycles to remove flag conditionals and old code branches once experiments reach statistical significance.
