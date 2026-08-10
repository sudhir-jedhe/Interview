Designing a production-grade Shimmer UI requires combining **pure CSS hardware animation**, **predictive layout geometries**, and **robust TypeScript state modeling**.

Here is how you handle every architectural layer of a Shimmer loading system.

---

## 1. Achieving the Shimmer Effect in React

A Shimmer effect is achieved by animating a semi-transparent linear gradient across a container element using hardware-accelerated CSS transforms or background shifts.

### A. The Base Shimmer CSS (`shimmer.css`)

```css
/* Hardware-accelerated shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer-base {
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f5f5f5 50%,
    #e0e0e0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 4px;
}

```

### B. Primitives Construction Kit (`SkeletonPrimitives.tsx`)

Rather than creating monolithic skeletons, build **composable atomic primitives** (`SkeletonText`, `SkeletonRect`, `SkeletonCircle`).

```tsx
import React from 'react';
import './shimmer.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const SkeletonRect: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
}) => (
  <div
    className={`shimmer-base ${className}`}
    style={{ width, height, borderRadius }}
    aria-hidden="true" // Hide skeleton decorative nodes from screen readers
  />
);

export const SkeletonCircle: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <SkeletonRect width={size} height={size} borderRadius="50%" />
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonRect
        key={i}
        height="14px"
        width={i === lines - 1 ? '60%' : '100%'} // Last line is shorter to mirror realistic typography
      />
    ))}
  </div>
);

```

---

## 2. Breaking Down Specialized Skeleton Placeholders

Skeletons must be specialized into **domain-specific composites** mirroring target components.

### A. Card Skeleton

```tsx
export const CardSkeleton = () => (
  <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', width: '300px' }}>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
      <SkeletonCircle size={48} />
      <div style={{ flex: 1 }}>
        <SkeletonRect height="16px" width="70%" />
        <div style={{ height: '6px' }} />
        <SkeletonRect height="12px" width="40%" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

```

### B. Table Skeleton

```tsx
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} style={{ borderBottom: '1px solid #eee' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} style={{ padding: '12px' }}>
              <SkeletonRect height="18px" width={c === 0 ? '80%' : '50%'} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

```

### C. Input & Button Indicator

For buttons and inputs, replace text with an inline shimmer bar rather than a full spinner to preserve button dimensions.

```tsx
export const ButtonSkeleton = ({ width = '120px', height = '36px' }) => (
  <SkeletonRect width={width} height={height} borderRadius="6px" />
);

```

---

## 3. Modeling Loading States

### Avoid Boolean Flag Soup (Anti-Pattern)

```typescript
// BAD: Multiple booleans cause impossible state combinations (e.g. isLoading=true AND isError=true)
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [data, setData] = useState(null);

```

### Recommended: Tagged Union / Discriminated Types

Using **Discriminated Unions** enforces compile-time safety and prevents invalid UI states.

```typescript
export type RemoteData<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

// Usage in Component
function UserProfile({ state }: { state: RemoteData<User> }) {
  switch (state.status) {
    case 'idle':
    case 'loading':
      return <CardSkeleton />;
    case 'error':
      return <ErrorMessage error={state.error} />;
    case 'success':
      return <UserCard user={state.data} />;
  }
}

```

---

## 4. Preventing Layout Shift (CLS) and Visual Flickering

### A. Preventing Cumulative Layout Shift (CLS)

Layout shift occurs when the rendered element has a different height or aspect ratio than the skeleton it replaces.

1. **Explicit Dimensions:** Match the skeleton's `min-height`, `font-size` alignment, and padding exactly to the real component.
2. **Aspect Ratio Lock:** Use CSS `aspect-ratio` on image/card placeholders so space is reserved prior to assets downloading.

```css
.card-image-skeleton {
  aspect-ratio: 16 / 9;
  width: 100%;
}

```

### B. Preventing Flash of Loading State (Flicker)

If an API request resolves in 30ms, rendering a skeleton for 30ms creates a jarring flash. Use a **Delayed Loader** and a **Minimum Visible Duration** hook.

```typescript
// useSmoothLoading.ts
import { useState, useEffect, useRef } from 'react';

export function useSmoothLoading(
  isLoading: boolean,
  delay = 200,      // Wait 200ms before showing loader
  minDuration = 400 // Keep loader visible for at least 400ms once shown
): boolean {
  const [showLoading, setShowLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let minDurationTimer: NodeJS.Timeout;

    if (isLoading) {
      delayTimer = setTimeout(() => {
        startTimeRef.current = Date.now();
        setShowLoading(true);
      }, delay);
    } else {
      if (startTimeRef.current) {
        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, minDuration - elapsedTime);

        minDurationTimer = setTimeout(() => {
          setShowLoading(false);
          startTimeRef.current = null;
        }, remainingTime);
      } else {
        clearTimeout(delayTimer);
        setShowLoading(false);
      }
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minDurationTimer);
    };
  }, [isLoading, delay, minDuration]);

  return showLoading;
}

```

---

## 5. Structuring Loading Boundaries

In React, break loading boundaries down into **granular sub-tree components** using **React Suspense** rather than a top-level page spinner.

```tsx
// Page Layout with Granular Suspense Boundaries
export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      {/* 1. Header renders immediately (0ms) */}
      <HeaderTitle />

      {/* 2. User Stats Widget loads independently */}
      <React.Suspense fallback={<CardSkeleton />}>
        <UserStatsWidget />
      </React.Suspense>

      {/* 3. Transaction Table loads independently */}
      <React.Suspense fallback={<TableSkeleton rows={10} />}>
        <TransactionTable />
      </React.Suspense>
    </div>
  );
}

```

### Summary of Architectural Benefits

* **Suspense Boundaries:** Isolates network delays to specific DOM nodes so slow APIs don't block fast APIs.
* **Component-Mirror Skeletons:** Preserves DOM geometry, maintaining a zero Cumulative Layout Shift score.
* **Discriminated Unions:** Eliminates impossible state bugs.
