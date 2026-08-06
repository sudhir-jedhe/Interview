Building a high-performance Infinite Scroll component in React using the **IntersectionObserver API** is significantly better than listening to scroll events (`window.addEventListener('scroll')`).

It avoids main-thread layout thrashing, doesn't require scroll event debouncing, and only executes code when the target "sentinel" element physically intersects with the viewport.

---

### System Architecture & Sentinel Pattern

```text
 ┌────────────────────────────────────────────────────────┐
 │ Viewport Container                                     │
 │                                                        │
 │  ┌──────────────────────────────────────────────────┐  │
 │  │ Item 1                                           │  │
 │  ├──────────────────────────────────────────────────┤  │
 │  │ Item 2                                           │  │
 │  ├──────────────────────────────────────────────────┤  │
 │  │ ...                                              │  │
 │  ├──────────────────────────────────────────────────┤  │
 │  │ Item N                                           │  │
 │  └──────────────────────────────────────────────────┘  │
 │                                                        │
 │  ┌──────────────────────────────────────────────────┐  │
 │  │ [ SENTINEL ELEMENT ] (Invisible Target Ref)      │  │
 │  └──────────────────────────────────────────────────┘  │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼ Intersects Viewport!
             [ IntersectionObserver Callback ]
                             │
                             ▼ Triggers
                    `fetchNextPage()`

```

---

## 1. Reusable Custom Hook (`useInfiniteScroll.ts`)

This hook abstracts the `IntersectionObserver` logic and cleans up memory automatically to prevent leaks.

```typescript
import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  threshold?: number; // 0.0 to 1.0 (default 1.0 = 100% visible)
  rootMargin?: string; // Pre-fetch buffer e.g. '200px' before visible
}

export function useInfiniteScroll({
  isLoading,
  hasNextPage,
  onLoadMore,
  threshold = 1.0,
  rootMargin = '200px', // Pre-fetch 200px before reaching the end for instant loading
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      // Trigger fetch ONLY IF:
      // 1. Target is intersecting the viewport (or rootMargin boundary)
      // 2. We are not currently loading
      // 3. There are more pages to fetch
      if (target.isIntersecting && !isLoading && hasNextPage) {
        onLoadMore();
      }
    },
    [isLoading, hasNextPage, onLoadMore]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    // Disconnect any existing observer before recreating
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new IntersectionObserver
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null, // Default: viewport
      rootMargin, // Pre-fetch trigger margin
      threshold,
    });

    // Start observing the sentinel element
    observerRef.current.observe(element);

    // CLEANUP: Disconnect observer when component unmounts or deps change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, rootMargin, threshold]);

  return { sentinelRef };
}

```

---

## 2. Infinite Scroll React Component (`InfiniteList.tsx`)

Here is the implementation integrating our custom hook, featuring loading skeletons and an end-of-list indicator.

```tsx
import React, { useState, useCallback } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';

interface Item {
  id: string;
  title: string;
  description: string;
}

export const InfiniteList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  // Simulated Async API Call
  const fetchPageData = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    console.log(`📡 Fetching page ${page}...`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response generator
    const newItems: Item[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `item_p${page}_${i}`,
      title: `Item #${(page - 1) * 10 + i + 1}`,
      description: `This is the detailed description for item ${(page - 1) * 10 + i + 1}.`,
    }));

    setItems((prev) => [...prev, ...newItems]);
    setIsLoading(false);
    setPage((prevPage) => prevPage + 1);

    // Stop infinite fetching after 5 pages (mock boundary limit)
    if (page >= 5) {
      setHasNextPage(false);
    }
  }, [page, isLoading, hasNextPage]);

  // Hook setup
  const { sentinelRef } = useInfiniteScroll({
    isLoading,
    hasNextPage,
    onLoadMore: fetchPageData,
    rootMargin: '300px', // Triggers loading 300px BEFORE reaching bottom
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>High-Performance Infinite Scroll</h2>

      {/* Rendered Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{item.title}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{item.description}</p>
          </div>
        ))}
      </div>

      {/* SENTINEL ELEMENT: The observer watches this invisible DIV */}
      <div ref={sentinelRef} style={{ height: '20px', margin: '10px 0' }} />

      {/* Loading Skeletons */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {[1, 2].map((n) => (
            <div
              key={n}
              style={{
                height: '70px',
                borderRadius: '8px',
                backgroundColor: '#f1f5f9',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          ))}
        </div>
      )}

      {/* End of Content Indicator */}
      {!hasNextPage && (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginTop: '20px' }}>
          🎉 You've reached the end of the list!
        </p>
      )}
    </div>
  );
};

```

---

## Key Performance Advantages

1. **`rootMargin: '300px'` (Perceived Zero Latency):** Setting a negative or positive `rootMargin` tells `IntersectionObserver` to trigger `onLoadMore()` *before* the user actually scrolls to the very bottom. By pre-fetching 300px ahead, users experience seamless scrolling without seeing loading spinners.
2. **Main-Thread Optimization:** Unlike scroll event listeners that execute on every scroll pixel movement (requiring main-thread CPU time), `IntersectionObserver` is managed directly by the browser's render pipeline asynchronously.
3. **Automatic Cleanup:** Disconnecting the observer on component unmount guarantees no lingering callbacks or memory leaks in React.
