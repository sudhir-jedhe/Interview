When API calls trigger continuously during scrolling (e.g., infinite scrolling, scroll-based analytics, or floating header updates), it creates an **API flood** that blocks the browser main thread, exhausts network bandwidth, and wastes server resources.

Here is a step-by-step strategy to optimize scroll-triggered API calls from basic throttling to advanced production-grade patterns.

---

### Solution Matrix

```text
┌────────────────────────────────────────────────────────┐
│ SCROLL OPTIMIZATION STRATEGIES                         │
├────────────────────────────────────────────────────────┤
│ 1. Throttling (Rate-limit execution frequency)          │
│ 2. Intersection Observer (Eliminate scroll listeners)  │
│ 3. Request Abort via AbortController (Cancel stale)   │
│ 4. Request Deduplication & Caching                     │
│ 5. Virtualization (DOM Windowing for large lists)      │
└────────────────────────────────────────────────────────┘

```

---

### 1. Replace Scroll Listeners with `IntersectionObserver` (Best for Infinite Scroll)

Listening to `window.addEventListener('scroll')` executes code dozens of times per second.

Instead of listening to scroll position manually, place a tiny `<div>` sentinel element at the bottom of your list and use the browser's native **`IntersectionObserver` API**. It fires an event **only** when the sentinel element becomes visible on screen.

#### ✅ React Implementation

```jsx
import React, { useEffect, useRef } from 'react';

export function InfiniteScrollList({ fetchNextPage, hasMore, isLoading }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    // 1. Create observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // Only trigger API if the sentinel is visible, more data exists, and not currently loading
        if (target.isIntersecting && hasMore && !isLoading) {
          fetchNextPage();
        }
      },
      {
        root: null,       // Browser viewport
        rootMargin: '200px', // Pre-fetch 200px before user reaches the exact bottom
        threshold: 0.1,
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    // Cleanup observer on unmount
    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [fetchNextPage, hasMore, isLoading]);

  return (
    <div>
      {/* List items rendering */}
      
      {/* 2. Sentinel Target Element */}
      <div ref={sentinelRef} style={{ height: '20px' }}>
        {isLoading && <p>Loading more items...</p>}
      </div>
    </div>
  );
}

```

---

### 2. Throttling Scroll Listeners (If Scroll Position Tracking is Mandatory)

If you must calculate exact pixel scroll position (e.g., updating a scroll progress indicator), use **Throttling**. Throttling guarantees that a function is executed at most once every $X$ milliseconds (e.g., once every 200ms or 300ms), no matter how fast the user scrolls.

#### ✅ Throttle Implementation

```javascript
// Utility: Throttle Function
function throttle(func, limit = 200) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage in Component
useEffect(() => {
  const handleScroll = throttle(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      fetchData();
    }
  }, 300); // Executed at most once every 300ms

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

```

---

### 3. Cancel In-Flight Requests (`AbortController`)

If the user scrolls rapidly and triggers page 2, page 3, and page 4 in quick succession, older pending network requests must be cancelled so they don't consume bandwidth or overwrite newer state out of order.

```javascript
import { useEffect, useRef } from 'react';
import axios from 'axios';

export function useAbortableFetch() {
  const abortControllerRef = useRef(null);

  const fetchPage = async (page) => {
    // 1. Cancel previous pending request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. Create new AbortController instance
    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.get(`/api/data?page=${page}`, {
        signal: abortControllerRef.current.signal,
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Previous scroll fetch aborted');
      } else {
        console.error('API Error:', error);
      }
    }
  };

  return { fetchPage };
}

```

---

### 4. Deduplicate Requests using TanStack Query (React Query)

Using dedicated data-fetching tools like **TanStack Query** (`useInfiniteQuery`) or **RTK Query** provides built-in protections out of the box:

* **Automatic Deduplication:** Prevents making duplicate requests for the same page/cursor.
* **`isFetchingNextPage` Lock:** Prevents user actions from firing parallel requests while a page is loading.
* **Caching:** Keeps previously fetched pages cached in memory.

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

function ProductFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchProductsApi(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  // Combine with IntersectionObserver safely
  // isFetchingNextPage ensures ONLY ONE request runs at a time
}

```

---

### 5. DOM Virtualization (`react-window` / `react-virtualized`)

If the user scrolls endlessly and fetches hundreds of pages, rendering 10,000+ elements into the DOM will cause the entire browser tab to freeze, regardless of how efficient your API calls are.

Use **DOM Virtualization** to render only the items currently visible in the viewport ($\sim 10\text{--}20$ items), recycling DOM nodes as the user scrolls.

```jsx
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style, data }) => (
  <div style={style}>Item {data[index].name}</div>
);

function VirtualizedFeed({ items }) {
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
      itemData={items}
    >
      {Row}
    </List>
  );
}

```

---

### Summary Checklist for Production

| Problem                                         | Root Cause                 | Best Solution                                               |
| ----------------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| **`scroll` listener firing 60+ times/sec**      | Heavy window scroll events | Use **`IntersectionObserver`**                              |
| **Rapid API calls firing on fast fling scroll** | Unthrottled trigger calls  | Apply **Throttling (200-300ms)**                            |
| **Old pages returning out-of-order**            | Network race conditions    | Cancel stale fetches with **`AbortController`**             |
| **Duplicate network calls for same page**       | Unlocked state calls       | Lock execution with `isFetching` flag or **TanStack Query** |
| **Browser lagging after thousands of items**    | Excess DOM nodes           | Implement **List Virtualization (`react-window`)**          |
