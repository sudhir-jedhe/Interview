Using the **Intersection Observer API** in React is one of the most efficient ways to implement **on-demand content loading** (also known as lazy loading, infinite scroll, or deferred rendering).

Unlike traditional scroll event listeners, `IntersectionObserver` offloads visibility checks to the browser's GPU/browser thread, avoiding layout thrashing and main-thread lag.

---

# 1. The Core Architecture: Infinite Scroll / On-Demand Component

Here is a clean, reusable custom hook pattern and component implementation for triggering content loads when an element scrolls into the viewport.

### A. Custom Reusable Hook: `useIntersectionObserver`

```tsx
import { useEffect, useState, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverProps = {}
): [RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;
  const targetRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    // Skip observing if freezeOnceVisible is true and element is already visible
    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsVisible(isElementIntersecting);

        // If we only need to trigger once (e.g., lazy loading images/components)
        if (isElementIntersecting && freezeOnceVisible) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [targetRef, isVisible];
}

```

---

### B. Infinite Scroll / On-Demand Data Fetching Component

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface Item {
  id: number;
  title: string;
}

export function OnDemandList() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Set rootMargin so content starts loading 200px BEFORE entering the viewport
  const [sentinelRef, isIntersecting] = useIntersectionObserver({
    rootMargin: '200px',
    threshold: 0,
  });

  // Mock API Call
  const fetchMoreData = useCallback(async (pageNum: number) => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: (pageNum - 1) * 10 + i + 1,
      title: `On-Demand Item #${(pageNum - 1) * 10 + i + 1}`,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setLoading(false);

    if (pageNum >= 5) setHasMore(false); // Stop fetching after 5 pages
  }, []);

  // Trigger fetch when Sentinel becomes visible
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      fetchMoreData(page);
      setPage((prev) => prev + 1);
    }
  }, [isIntersecting, hasMore, loading, page, fetchMoreData]);

  return (
    <div className="container">
      <h1>On-Demand Content Stream</h1>

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="card">
            {item.title}
          </li>
        ))}
      </ul>

      {/* Sentinel Element placed at the bottom of the list */}
      {hasMore && (
        <div ref={sentinelRef} className="sentinel-loader">
          {loading ? <p>Loading more content...</p> : <div style={{ height: '20px' }} />}
        </div>
      )}

      {!hasMore && <p className="end-message">You've reached the end!</p>}
    </div>
  );
}

```

---

# 2. Key Optimization Strategies

### A. Prefetching with `rootMargin`

Instead of waiting for the loader sentinel to hit the viewport ($0\text{px}$ margin), pass a negative/positive `rootMargin` like `'200px'`. This triggers data fetching **200px before the user reaches the bottom of the page**, creating a completely seamless, zero-wait experience.

### B. Unobserving after Initial Trigger (`freezeOnceVisible`)

For lazy-loading static components or heavy UI panels (e.g., charts, maps, image galleries), unobserve the DOM node immediately once it enters the viewport to save memory CPU overhead:

```tsx
// Loads an expensive component only when scrolled into view
function LazyWidget() {
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin: '100px',
    freezeOnceVisible: true, // Stops observing once triggered
  });

  return (
    <div ref={ref} style={{ minHeight: '300px' }}>
      {isVisible ? <HeavyChartComponent /> : <SkeletonLoader />}
    </div>
  );
}

```

### C. Prevent Infinite Trigger Loops

* Ensure the sentinel element or skeleton loader has a **defined minimum height** (e.g., `min-height: 20px`). If the target sentinel has a height of `0px` and the list is empty, it may trigger continuous execution loops.
* Combine `isIntersecting` checks with a explicit `loading` state flag (`!loading`) to prevent duplicate overlapping network calls.

---

# 3. Native Alternative: `loading="lazy"` vs `IntersectionObserver`

* **Use Native `loading="lazy"**` for basic `<img>` and `<iframe>` elements. The browser handles native image lazy-loading automatically without JS.
* **Use `IntersectionObserver**` for API data fetching, infinite scrolling, delayed video playback, complex UI component mounting, and trigger tracking/analytics.
