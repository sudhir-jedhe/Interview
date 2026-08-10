In frontend system design, there is no single "best" loading state—the optimal approach depends on **user expectation, content type, latency duration, and layout predictability**.

A well-architected frontend handles loading states across four design dimensions: **UX patterns, component architecture, state management, and network performance**.

---

## 1. Selecting the Right UX Loading Pattern

Match the loading pattern to the **expected duration** and **layout structure** of the content being fetched.

```
Expected Latency & Content Layout
 ├── High Predictability + Short/Medium Duration (100ms - 2s) ──> Skeleton Screen
 ├── Low Predictability / Unstructured Content                ──> Spinners & Progress Bars
 ├── Background Action / Data Sync                           ──> Optimistic UI
 └── Continuous / Paginated Fetching                          ──> Shimmer / Infinite Skeleton

```

### A. Skeleton Screens (Best for Structural Content)

* **When to use:** Dashboard widgets, cards, lists, feeds, or table views where the layout geometry is known before data arrives.
* **Why:** Reduces perceived latency by preparing the user's cognitive model for the incoming layout. Prevents sudden Cumulative Layout Shift (CLS).
* **Implementation Tip:** Match skeleton dimensions (height, aspect ratio, border-radius) exactly to the target rendered elements.

### B. Spinners & Indicators (Best for Unstructured / Inline Actions)

* **When to use:** Button actions ("Submitting..."), modal actions, or small inline updates where geometry cannot be predicted.
* **Rule of Thumb:** Avoid full-page spinners; they hide the page structure and increase perceived wait times.

### C. Optimistic UI (Best for High-Frequency User Actions)

* **When to use:** Likes, upvotes, bookmarking, text messaging, or status toggles.
* **How it works:** Update the UI **instantly** assuming network success. If the network request fails, roll back the state gracefully and notify the user (e.g., via a Toast notification).
* **Why:** Eliminates perceived network latency entirely for simple mutations.

### D. Progress Bars (Best for Long-Running Async Processes)

* **When to use:** Large file uploads, complex reports, or multi-step async tasks ($> 2\text{ seconds}$).
* **Why:** Deterministic progress bars reduce anxiety by giving users an explicit sense of completion.

---

## 2. Core Frontend Architecture: Handling State Transitions

In Low-Level Design (LLD), manage loading states explicitly to prevent **flicker, stale data, and layout jumps**.

### Rule 1: The 200ms Delay Threshold (Preventing Flash of Loading State)

If an API request resolves in $< 200\text{ms}$, displaying a skeleton screen or spinner for $50\text{ms}$ causes an annoying visual flash.

Use a **Delayed Loading Hook** so indicators appear only if fetching exceeds $200\text{ms}$:

```typescript
// useDelayedLoading.ts
import { useState, useEffect } from 'react';

export function useDelayedLoading(isLoading: boolean, delay = 200): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setTimeout(() => setShowLoading(true), delay);
    } else {
      setShowLoading(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showLoading;
}

```

---

### Rule 2: Explicit State Modeling over Boolean Flags

Avoid anti-pattern flag soup like `isLoading`, `isError`, `isSuccess` on the same state object. Use **Tagged Unions** or **Finite State Machines (FSM)**:

```typescript
// State Type Definition
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

```

---

### Rule 3: Component-Level Granularity with React Suspense

Break loading boundaries down into independent sub-components using **React Suspense** or **Error/Loading Boundaries**.

```tsx
// Fine-Grained Loading Isolation
<DashboardLayout>
  {/* Header loads instantly from local cache */}
  <Header />

  <div className="grid">
    {/* Analytics Widget loads independently */}
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsWidget />
    </Suspense>

    {/* Recent Activity loads independently */}
    <Suspense fallback={<ActivitySkeleton />}>
      <RecentActivityWidget />
    </Suspense>
  </div>
</DashboardLayout>

```

---

## 3. Advanced Performance Techniques

### A. Progressive Data Hydration & Stale-While-Revalidate (SWR)

Serve cached data from `localStorage` or IndexedDB immediately while revalidating fresh state in the background.

```
1. User Page Load ──> Render Cached Stale Data (Instant, 0ms)
2. Background Fetch ──> Retrieve Fresh API Response
3. Silent Revalidation ──> Update UI Smoothly without Full Skeleton Flashes

```

### B. Layout Stability (Preventing Cumulative Layout Shift - CLS)

* Always reserve layout space using CSS `min-height`, `aspect-ratio`, or absolute container sizes on skeleton loaders.
* Avoid expanding/collapsing container dimensions when replacing loading states with actual content.

---

## Summary Decision Matrix

| Loading Scenario                    | Recommended Pattern    | Target Latency             | Core System Goal                                   |
| ----------------------------------- | ---------------------- | -------------------------- | -------------------------------------------------- |
| **Initial Page Load / Feed**        | Skeleton Screen        | $200\text{ms} - 2\text{s}$ | Prevent CLS; establish layout expectation.         |
| **Form Submission / Button Action** | Inline Button Spinner  | $< 1\text{s}$              | Provide immediate feedback; disable double-clicks. |
| **Toggle / Like / Upvote**          | Optimistic UI          | $0\text{ms}$ (Instant)     | Zero perceived latency.                            |
| **Data Refresh / Pagination**       | Stale-While-Revalidate | Background                 | Zero visual disruption; preserve scroll position.  |
| **File Upload / Export**            | Progress Bar           | $> 2\text{s}$              | Provide feedback on remaining completion time.     |
