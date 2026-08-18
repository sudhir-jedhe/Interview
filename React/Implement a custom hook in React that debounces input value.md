Here is a standard, typed implementation of a `useDebounce` hook in React using TypeScript.

**The Hook (`useDebounce.ts`)**

```typescript
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value.
 *
 * @param value The value to debounce (e.g. search query, form input)
 * @param delay Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value or delay changes before the timeout completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

```

---

**Usage Example (`SearchBar.tsx`)**

```tsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch) {
      // Trigger API fetch or expensive filtering here
      console.log('Fetching results for:', debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div style={{ padding: '1rem' }}>
      <input
        type="text"
        value={search}
        placeholder="Type to search..."
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '250px' }}
      />
      <p>Immediate input: <strong>{search}</strong></p>
      <p>Debounced value: <strong>{debouncedSearch}</strong></p>
    </div>
  );
}

```

---

**Key Details**

* **Cleanup Function:** The `return () => clearTimeout(timer)` inside `useEffect` cancels the pending timer on every keystroke before setting a new one, ensuring only the last keystroke triggers the update.
* **Generic Typing (`<T>`):** Supports strings, numbers, objects, or arrays without casting.

A callback-debouncing hook delays the invocation of a function until a specified time has elapsed since its last call, while providing control methods like `cancel` and `flush`.

**The Hook (`useDebouncedCallback.ts`)**

```typescript
import { useRef, useEffect, useMemo } from 'react';

type AnyFunction = (...args: any[]) => any;

export interface DebouncedState<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

/**
 * Custom hook to debounce a callback function.
 *
 * @param callback The function to execute after the delay
 * @param delay Delay in milliseconds (default: 500ms)
 * @returns Debounced function with .cancel() and .flush() helpers
 */
export function useDebouncedCallback<T extends AnyFunction>(
  callback: T,
  delay = 500
): DebouncedState<T> {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<T>(callback);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  // Keep callback reference updated without resetting the timer
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up any pending timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    const cancel = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastArgsRef.current = null;
    };

    const flush = () => {
      if (timeoutRef.current && lastArgsRef.current) {
        const args = lastArgsRef.current;
        cancel();
        callbackRef.current(...args);
      }
    };

    const debounced = (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastArgsRef.current = null;
        timeoutRef.current = null;
        callbackRef.current(...args);
      }, delay);
    };

    debounced.cancel = cancel;
    debounced.flush = flush;

    return debounced as DebouncedState<T>;
  }, [delay]);
}

```

---

**Usage Example (`LiveSearchInput.tsx`)**

```tsx
import React, { useState } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';

export default function LiveSearchInput() {
  const [searchTerm, setSearchTerm] = useState('');

  // The debounced handler
  const debouncedFetch = useDebouncedCallback((query: string) => {
    console.log('Dispatching API request for:', query);
  }, 400);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetch(value);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Type to trigger API..."
        style={{ padding: '8px', width: '260px' }}
      />
      <div style={{ marginTop: '8px' }}>
        <button onClick={debouncedFetch.cancel} style={{ marginRight: '6px' }}>
          Cancel Pending
        </button>
        <button onClick={debouncedFetch.flush}>
          Flush Immediately
        </button>
      </div>
    </div>
  );
}

```

---

**Key Design Considerations**

* **`callbackRef` for Stale Closure Prevention:** Updating `callbackRef.current` in `useEffect` ensures the debounced call always uses the freshest state and props without resetting the active debounce timer.
* **`useMemo` Stability:** The returned debounced wrapper maintains a stable identity between renders as long as `delay` does not change.
* **`cancel` & `flush` Utilities:** `cancel` discards any scheduled execution, while `flush` triggers pending calls immediately (useful on form submit or unmount).

Choosing between `useDebounce` (value debouncing) and `useDebouncedCallback` (function debouncing) comes down to **state ownership**, **re-render cost**, and **control flow**.

| Criterion                | `useDebounce` (Value)                                                              | `useDebouncedCallback` (Function)                                   |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Primary Mechanism**    | React State (`useState` + `useEffect`)                                             | Mutable Reference (`useRef` + `setTimeout`)                         |
| **Component Re-renders** | **2+ renders per change:** Immediate input render + delayed debounced value render | **1 render per change:** Only the immediate UI input updates        |
| **Best Used For**        | Declarative data flow, React Query / SWR keys, derived state                       | Imperative calls, direct API triggers, fire-and-forget side effects |
| **Manual Controls**      | ❌ Hard to cancel or flush manually                                                 | ✅ Direct access to `.cancel()` and `.flush()`                       |
| **Uncontrolled Inputs**  | ❌ Requires component-managed state                                                 | ✅ Works directly on uncontrolled inputs / DOM events                |

---

**1. Re-render Overhead & Performance**

* **`useDebounce`:** Triggers a state update inside the hook when the timer completes. This forces a second re-render of the component hosting the hook to propagate the new debounced value. If that component renders heavy child trees, this extra cycle carries measurable render cost.
* **`useDebouncedCallback`:** Does not hold state. It executes the provided function outside of React’s render lifecycle unless the callback explicitly calls a state setter. The component only re-renders when local input state changes.

---

**2. Declarative vs. Imperative Integration**

* **`useDebounce` (Declarative):** Fits naturally into reactive ecosystems like **TanStack Query**, **SWR**, or `useEffect` dependency arrays:

```tsx
const debouncedQuery = useDebounce(query, 300);
const { data } = useQuery(['search', debouncedQuery], () => fetchResults(debouncedQuery));

```

The query library automatically manages request cancellation, deduplication, and caching as the debounced value changes.

* **`useDebouncedCallback` (Imperative):** Better for direct, trigger-based actions like auto-saving forms, analytics tracking, or calling third-party libraries:

```tsx
const debouncedSave = useDebouncedCallback((draft) => api.saveDraft(draft), 1000);

```

---

**3. State Management & Input Handling**

* **Controlled vs. Uncontrolled:** `useDebounce` requires an existing piece of React state to track and delay. If you want to use uncontrolled inputs (`ref`) or listen to raw DOM events (`window.onresize`, `onScroll`), `useDebounce` adds unnecessary boilerplate, whereas `useDebouncedCallback` attaches directly to the event handler.
* **Stale Closure Risks:** `useDebounce` relies on standard dependency array updates in `useEffect`. `useDebouncedCallback` requires careful implementation (typically caching the latest function in a `useRef`) to avoid invoking stale props/state when the delay elapses.

---

**Summary Recommendation**

* Use **`useDebounce`** when the delayed value itself drives UI rendering or feeds directly into data-fetching libraries (e.g., TanStack Query).
* Use **`useDebouncedCallback`** for event handlers, mutations, autosave workflows, or when you need explicit lifecycle controls like `.cancel()` on unmount or `.flush()` on form submit.

Throttling guarantees that a function is executed **at most once per specified time window**, regardless of how many times the event fires. This makes it ideal for continuous events like `scroll`, `resize`, or pointer tracking.

---

**The Hook (`useThrottledCallback.ts`)**

This implementation supports:

* **Immediate leading execution** (runs on the very first event).
* **Trailing edge execution** (runs the final arguments after the interval if calls kept coming).
* **Stale-closure safety** via `useRef`.
* **`cancel`** and **`flush`** controls.

```typescript
import { useRef, useEffect, useMemo } from 'react';

type AnyFunction = (...args: any[]) => any;

export interface ThrottledState<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export interface ThrottleOptions {
  leading?: boolean;   // default: true
  trailing?: boolean;  // default: true
}

/**
 * Custom hook to throttle a callback function.
 *
 * @param callback The function to throttle
 * @param delay Throttle window in milliseconds (default: 300ms)
 * @param options Leading/trailing execution options
 * @returns Throttled function with .cancel() and .flush() helpers
 */
export function useThrottledCallback<T extends AnyFunction>(
  callback: T,
  delay = 300,
  options: ThrottleOptions = {}
): ThrottledState<T> {
  const { leading = true, trailing = true } = options;

  const callbackRef = useRef<T>(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  // Keep latest callback reference without invalidating the throttled function
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up any pending timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    const cancel = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastArgsRef.current = null;
    };

    const flush = () => {
      if (timeoutRef.current && lastArgsRef.current) {
        const args = lastArgsRef.current;
        cancel();
        lastExecTimeRef.current = Date.now();
        callbackRef.current(...args);
      }
    };

    const throttled = (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastExecTimeRef.current;

      lastArgsRef.current = args;

      // Handle leading edge execution
      if (!lastExecTimeRef.current && !leading) {
        lastExecTimeRef.current = now;
      }

      const remaining = delay - elapsed;

      // If the delay period has passed, run immediately
      if (remaining <= 0 || remaining > delay) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastExecTimeRef.current = now;
        lastArgsRef.current = null;
        callbackRef.current(...args);
      } else if (trailing && !timeoutRef.current) {
        // Schedule the trailing call for the end of the window
        timeoutRef.current = setTimeout(() => {
          lastExecTimeRef.current = leading ? Date.now() : 0;
          timeoutRef.current = null;
          if (lastArgsRef.current) {
            const trailingArgs = lastArgsRef.current;
            lastArgsRef.current = null;
            callbackRef.current(...trailingArgs);
          }
        }, remaining);
      }
    };

    throttled.cancel = cancel;
    throttled.flush = flush;

    return throttled as ThrottledState<T>;
  }, [delay, leading, trailing]);
}

```

---

**Usage Example: Throttled Window Scroll Listener**

```tsx
import React, { useState, useEffect } from 'react';
import { useThrottledCallback } from './useThrottledCallback';

export default function ScrollIndicator() {
  const [scrollY, setScrollY] = useState(0);

  // Throttled scroll handler: fires at most once every 200ms
  const handleScroll = useThrottledCallback(() => {
    setScrollY(window.scrollY);
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // cancel any trailing calls on unmount
    };
  }, [handleScroll]);

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, background: '#eee', padding: '8px 12px' }}>
      Scroll position: <strong>{scrollY}px</strong>
    </div>
  );
}

```

---

**Value Throttling (`useThrottle`)**

If you need a throttled **state value** instead of a callback function:

```typescript
import { useState, useEffect, useRef } from 'react';

export function useThrottle<T>(value: T, delay = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const elapsed = Date.now() - lastExecuted.current;

    if (elapsed >= delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

```

---

**Key Differences: Throttle vs Debounce**

* **Debounce:** Delays execution until activity **pauses** for `N` ms (e.g., search typeaheads, window resize end).
* **Throttle:** Enforces a **maximum execution frequency** (at most once every `N` ms) while activity is continuously happening (e.g., scroll position tracking, game loop updates, drag-and-drop coordinate logging).

An `IntersectionObserver` hook tracks the visibility of a DOM element relative to a viewport or container. Using a **callback ref** ensures the observer automatically attaches and detaches even when elements mount or unmount dynamically.

---

**The Hook (`useIntersectionObserver.ts`)**

```typescript
import { useState, useCallback, useRef } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean; // Keep visible state true once triggered (useful for lazy loading images)
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isFrozen = freezeOnceVisible && entry?.isIntersecting;

  // Callback ref attaches to the target DOM node
  const ref = useCallback(
    (node: HTMLElement | null) => {
      // Disconnect any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Do not observe if unsupported, no node, or frozen after first visibility
      if (!node || isFrozen || typeof IntersectionObserver === 'undefined') {
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([newEntry]) => {
          setEntry(newEntry);
        },
        { threshold, root, rootMargin }
      );

      observerRef.current.observe(node);
    },
    [threshold, root, rootMargin, isFrozen]
  );

  return {
    ref,
    entry,
    isIntersecting: !!entry?.isIntersecting,
  };
}

```

---

**Use Case 1: Infinite Scroll Sentinel**

Place a lightweight sentinel element at the bottom of the list to trigger page loads when approaching the viewport.

```tsx
import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

export default function InfiniteScrollList() {
  const [items, setItems] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
  const [isLoading, setIsLoading] = useState(false);

  // Trigger 200px before the bottom element touches the viewport
  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (isIntersecting && !isLoading) {
      setIsLoading(true);
      // Simulate API pagination
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          ...Array.from({ length: 20 }, (_, i) => prev.length + i + 1),
        ]);
        setIsLoading(false);
      }, 500);
    }
  }, [isIntersecting, isLoading]);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <ul>
        {items.map((item) => (
          <li key={item} style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
            Item #{item}
          </li>
        ))}
      </ul>

      {/* Sentinel element to trigger next page */}
      <div ref={sentinelRef} style={{ height: '20px', textAlign: 'center' }}>
        {isLoading && <p>Loading more items...</p>}
      </div>
    </div>
  );
}

```

---

**Use Case 2: Lazy-Loaded Image with `freezeOnceVisible**`

```tsx
import React from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholderSrc?: string;
}

export function LazyImage({ src, alt, placeholderSrc }: LazyImageProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: '100px',
    freezeOnceVisible: true, // Disconnect observer once loaded to save memory
  });

  return (
    <div
      ref={ref}
      style={{
        minHeight: '200px',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isIntersecting ? (
        <img src={src} alt={alt} style={{ width: '100%', display: 'block' }} />
      ) : (
        placeholderSrc && <img src={placeholderSrc} alt="placeholder" />
      )}
    </div>
  );
}

```

---

**Key Implementation Highlights**

* **Callback Ref vs. `useRef`:** A standard `useRef` does not trigger a re-run of `useEffect` when conditional rendering mounts or unmounts the node. A `useCallback` ref guarantees the observer binds the exact moment the element renders.
* **`freezeOnceVisible`:** Critical for one-time operations like lazy images or entry animations. Once `isIntersecting` becomes true, the observer disconnects to avoid memory leaks.
* **`rootMargin`:** Pre-fetches content before it enters the viewport (e.g., `'200px'` loads the next page before the user hits the exact bottom).
A reusable `useResizeObserver` hook tracks changes to a DOM element’s size (width, height, border-box, or content-box). Using a **callback ref** ensures the observer binds immediately when conditional rendering mounts or unmounts the element, avoiding missed initial measurements.

---

**The Hook (`useResizeObserver.ts`)**

```typescript
import { useState, useCallback, useRef } from 'react';

export interface Size {
  width: number | undefined;
  height: number | undefined;
}

export interface UseResizeObserverOptions {
  box?: ResizeObserverBoxOptions; // 'content-box' | 'border-box' | 'device-pixel-content-box'
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions = {}
) {
  const { box = 'content-box' } = options;
  const [size, setSize] = useState<Size>({ width: undefined, height: undefined });
  const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback(
    (node: T | null) => {
      // Disconnect existing observer instance
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || typeof ResizeObserver === 'undefined') {
        return;
      }

      observerRef.current = new ResizeObserver(([firstEntry]) => {
        if (!firstEntry) return;

        setEntry(firstEntry);

        // Prefer modern box size arrays, fallback to contentRect
        if (box === 'border-box' && firstEntry.borderBoxSize?.length > 0) {
          const borderSize = firstEntry.borderBoxSize[0];
          setSize({
            width: Math.round(borderSize.inlineSize),
            height: Math.round(borderSize.blockSize),
          });
        } else if (box === 'content-box' && firstEntry.contentBoxSize?.length > 0) {
          const contentSize = firstEntry.contentBoxSize[0];
          setSize({
            width: Math.round(contentSize.inlineSize),
            height: Math.round(contentSize.blockSize),
          });
        } else {
          // Standard fallback
          const { width, height } = firstEntry.contentRect;
          setSize({
            width: Math.round(width),
            height: Math.round(height),
          });
        }
      });

      observerRef.current.observe(node, { box });
    },
    [box]
  );

  return {
    ref,
    width: size.width,
    height: size.height,
    entry,
  };
}

```

---

**Usage Example: Container-Aware Responsive Card**

```tsx
import React from 'react';
import { useResizeObserver } from './useResizeObserver';

export default function ResponsiveWidget() {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();

  // Determine layout mode based on element's own width rather than viewport
  const isCompact = width !== undefined && width < 400;

  return (
    <div
      ref={ref}
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '100%',
        minWidth: '200px',
        backgroundColor: isCompact ? '#f9fafb' : '#ffffff',
      }}
    >
      <p style={{ margin: 0 }}>
        Current dimensions: <strong>{width ?? 0}px</strong> × <strong>{height ?? 0}px</strong>
      </p>
      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          flexDirection: isCompact ? 'column' : 'row',
          gap: '8px',
        }}
      >
        <button style={{ flex: 1, padding: '8px' }}>Action 1</button>
        <button style={{ flex: 1, padding: '8px' }}>Action 2</button>
      </div>
    </div>
  );
}

```

---

**Key Technical Details**

* **`inlineSize` & `blockSize` vs `contentRect`:** The modern `ResizeObserver` specification provides `contentBoxSize` and `borderBoxSize` containing `inlineSize` (width in horizontal writing modes) and `blockSize` (height). The hook reads these first for sub-pixel accuracy and falls back to `contentRect`.
* **Callback Ref Attachment:** Binding via `useCallback` handles dynamic mounting, lazy-loaded components, and tabs without missing the first layout pass or creating orphaned observer listeners.
* **Avoiding Infinite Loops:** Updating state inside a `ResizeObserver` callback can trigger the browser warning `ResizeObserver loop limit exceeded` if the state change alters the observed element's size. Rounding values (`Math.round`) and measuring parent containers instead of children prevents oscillation loops.
