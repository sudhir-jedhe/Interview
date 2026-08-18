To implement a fallback strategy where a host loads a local fallback component if a remote Micro-Frontend (MFE) is unreachable, you can resolve the failure at two architectural tiers:

1. **Promise-level Fallback Loader (Seamless):** Intercept the dynamic `import()` at the JavaScript module level. If the remote fetch throws or rejects after retries, return the local bundled fallback component transparently to `React.lazy`.
2. **Boundary-level UI Fallback (Explicit):** Catch the error inside an `ErrorBoundary` and render an interactive fallback UI or static fallback view.

---

### Pattern 1: Promise-Level Transparent Fallback Loader (Recommended)

This pattern keeps your JSX clean. `React.lazy` receives a resolved module containing either the remote component or the local backup component without tripping an `ErrorBoundary`.

#### 1. Define the Local Backup Component (`host/src/fallbacks/LocalBillingFallback.tsx`)

```tsx
// src/fallbacks/LocalBillingFallback.tsx
import React from 'react';

export interface BillingProps {
  userId?: string;
  theme?: 'light' | 'dark';
}

export const LocalBillingFallback: React.FC<BillingProps> = ({ userId }) => {
  return (
    <div className="p-6 border border-amber-500/30 bg-amber-950/20 rounded-xl">
      <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
        <span>⚡</span>
        <h4>Offline Billing View (Cached/Basic Mode)</h4>
      </div>
      <p className="text-xs text-slate-300">
        The remote billing service is temporarily unreachable. You can still view your basic account tier below.
      </p>
      <div className="mt-4 p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-200">
        Account ID: {userId || 'N/A'} — Status: Active (Read-Only)
      </div>
    </div>
  );
};

export default LocalBillingFallback;

```

---

#### 2. Create the Fallback Loader Utility (`src/utils/federationFallback.ts`)

```typescript
// src/utils/federationFallback.ts
import { ComponentType, lazy } from 'react';

interface LoadWithFallbackOptions<T> {
  remoteLoader: () => Promise<{ default: ComponentType<T> }>;
  fallbackLoader: () => Promise<{ default: ComponentType<T> }>;
  retries?: number;
  retryDelay?: number;
  onFallbackTriggered?: (error: unknown) => void;
}

/**
 * Attempts to load the primary remote component.
 * If all retries fail, seamlessly falls back to the local bundled version.
 */
export function lazyWithLocalFallback<T = any>({
  remoteLoader,
  fallbackLoader,
  retries = 2,
  retryDelay = 800,
  onFallbackTriggered,
}: LoadWithFallbackOptions<T>) {
  return lazy(async () => {
    let attemptsLeft = retries;

    while (attemptsLeft >= 0) {
      try {
        // Attempt loading the remote entry/component
        return await remoteLoader();
      } catch (err) {
        attemptsLeft--;
        if (attemptsLeft >= 0) {
          console.warn(`[MFE Fallback] Remote load failed. Retrying in ${retryDelay}ms... (${attemptsLeft} retries left)`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          console.error('[MFE Fallback] Remote completely unreachable. Loading local fallback component.', err);
          if (onFallbackTriggered) {
            onFallbackTriggered(err);
          }
          // Load the local host fallback bundle
          return await fallbackLoader();
        }
      }
    }

    // Safety fallback
    return fallbackLoader();
  });
}

```

---

#### 3. Consume in Host Component

```tsx
// src/App.tsx
import React, { Suspense } from 'react';
import { lazyWithLocalFallback } from './utils/federationFallback';

// Dynamically attempts remoteApp/BillingDashboard, drops back to local copy on failure
const BillingComponent = lazyWithLocalFallback({
  remoteLoader: () => import('remoteBillingApp/BillingDashboard'),
  fallbackLoader: () => import('./fallbacks/LocalBillingFallback'),
  retries: 2,
  retryDelay: 1000,
  onFallbackTriggered: (err) => {
    // Optional telemetry alert (e.g. Sentry / Datadog)
    console.warn('Telemetry Event: Remote Billing MFE down, running on local fallback.', err);
  },
});

export function App() {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Enterprise Dashboard</h1>

      <Suspense fallback={<div className="p-4 text-slate-400">Loading Billing Section...</div>}>
        <BillingComponent userId="usr_98431" />
      </Suspense>
    </div>
  );
}

export default App;

```

---

### Pattern 2: Dynamic Multi-Version Failover (CDN Version Downgrade)

If you maintain immutable versioned deployments on your CDN (e.g., `v2.4.0`, `v2.3.9`, `v2.3.8`), the host can dynamically fall back to the **previous known stable remote version** before dropping to the local component.

```typescript
// src/utils/multiVersionFallback.ts
import { ComponentType, lazy } from 'react';

interface VersionFailoverOptions {
  versions: string[]; // e.g. ['https://cdn.example.com/v2.4.0/remoteEntry.js', 'https://cdn.example.com/v2.3.9/remoteEntry.js']
  moduleName: string;
  localFallback: () => Promise<{ default: ComponentType<any> }>;
}

export function lazyWithVersionFailover({
  versions,
  moduleName,
  localFallback,
}: VersionFailoverOptions) {
  return lazy(async () => {
    for (const url of versions) {
      try {
        console.log(`[Failover] Trying remote version at: ${url}`);
        const container = await import(/* @vite-ignore */ url);
        if (typeof container.get === 'function') {
          const factory = await container.get(moduleName);
          return factory();
        }
        if (container[moduleName]) {
          return { default: container[moduleName] };
        }
      } catch (err) {
        console.warn(`[Failover] Failed loading version from ${url}. Trying next fallback...`);
      }
    }

    console.error('[Failover] All remote CDN versions failed. Loading bundled local fallback.');
    return localFallback();
  });
}

```

---

### Pattern 3: Declarative React Component Fallback Boundary

If you prefer managing fallbacks via JSX layout hierarchy:

```tsx
// src/components/RemoteBoundaryWithFallback.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class RemoteBoundaryWithFallback extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RemoteBoundaryWithFallback] Remote crashed or failed to download:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

```

#### Usage in JSX

```tsx
<RemoteBoundaryWithFallback fallback={<LocalBillingFallback userId="usr_98431" />}>
  <Suspense fallback={<div>Loading remote...</div>}>
    <RemoteBillingDashboard userId="usr_98431" />
  </Suspense>
</RemoteBoundaryWithFallback>

```

---

### Comparison of Fallback Strategies

| Strategy                                           | When to Choose                                                                  | Advantages                                                                 | Trade-offs                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Promise-Level Loader (`lazyWithLocalFallback`)** | When the local component implements the same prop contract                      | Cleanest JSX, zero layout shifts, no ErrorBoundary trigger                 | Local component must be maintained in the host codebase    |
| **CDN Version Failover**                           | High-availability enterprise setups with immutable versioned CDN buckets        | Runs the actual remote app (last stable release) without host bloat        | Extra network round-trips while attempting broken versions |
| **JSX ErrorBoundary Fallback**                     | When the fallback is a simple notification card, degraded UI, or static message | Easy to compose in JSX, handles both network errors and runtime exceptions | Renders after an error is thrown to the React tree         |
