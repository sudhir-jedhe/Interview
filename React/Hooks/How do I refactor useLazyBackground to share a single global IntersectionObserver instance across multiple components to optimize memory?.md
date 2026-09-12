To share an `IntersectionObserver` across components, create a module-level observer manager that uses a `Map` keyed by observer options (e.g., matching `rootMargin` and `threshold`) and a `WeakMap` mapping each watched DOM element to its specific callback.

This avoids spawning dozens or hundreds of observer instances on image-heavy pages, saving browser memory while maintaining individual component lifecycle isolation.

---

### 1. The Global Observer Manager (`observerManager.ts`)

```typescript
type ObserverCallback = (entry: IntersectionObserverEntry) => void;

interface ObserverInstance {
  observer: IntersectionObserver;
  callbacks: WeakMap<Element, ObserverCallback>;
  observedCount: number;
}

// Cache observers keyed by their serialized options (e.g., "0px 0px 200px 0px|0")
const observerRegistry = new Map<string, ObserverInstance>();

function getObserverKey(rootMargin: string, threshold: number | number[]): string {
  const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : threshold.toString();
  return `${rootMargin}|${thresholdKey}`;
}

export function observeElement(
  element: Element,
  callback: ObserverCallback,
  options: { rootMargin?: string; threshold?: number | number[] } = {}
): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: trigger immediately if not supported
    callback({ isIntersecting: true } as IntersectionObserverEntry);
    return () => {};
  }

  const rootMargin = options.rootMargin || '0px 0px 200px 0px';
  const threshold = options.threshold ?? 0;
  const key = getObserverKey(rootMargin, threshold);

  let record = observerRegistry.get(key);

  if (!record) {
    const callbacks = new WeakMap<Element, ObserverCallback>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cb = callbacks.get(entry.target);
        if (cb) {
          cb(entry);
        }
      });
    }, { rootMargin, threshold });

    record = { observer, callbacks, observedCount: 0 };
    observerRegistry.set(key, record);
  }

  // Register element and callback
  record.callbacks.set(element, callback);
  record.observer.observe(element);
  record.observedCount++;

  // Return unregister/cleanup function
  return () => {
    const activeRecord = observerRegistry.get(key);
    if (!activeRecord) return;

    activeRecord.observer.unobserve(element);
    activeRecord.callbacks.delete(element);
    activeRecord.observedCount--;

    // Clean up observer instance if no elements are using it
    if (activeRecord.observedCount <= 0) {
      activeRecord.observer.disconnect();
      observerRegistry.delete(key);
    }
  };
}

```

---

### 2. Refactored `useLazyBackground.ts`

Now the hook delegates observation to the shared manager:

```typescript
import { useState, useEffect, useRef, CSSProperties } from 'react';
import { observeElement } from './observerManager';

export interface UseLazyBackgroundOptions {
  src?: string;
  rootMargin?: string;
  threshold?: number | number[];
}

export interface UseLazyBackgroundResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  style: CSSProperties;
  isLoaded: boolean;
  isError: boolean;
}

export function useLazyBackground<T extends HTMLElement = HTMLDivElement>({
  src,
  rootMargin = '0px 0px 200px 0px',
  threshold = 0,
}: UseLazyBackgroundOptions): UseLazyBackgroundResult<T> {
  const ref = useRef<T | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) return;

    setIsLoaded(false);
    setIsError(false);
    setActiveSrc(null);

    const element = ref.current;
    if (!element) return;

    let isCancelled = false;

    // Register with shared manager
    const unobserve = observeElement(
      element,
      (entry) => {
        if (entry.isIntersecting) {
          // Unobserve as soon as it enters to satisfy the "load once" pattern
          unobserve();

          // Off-screen preload
          const img = new Image();
          img.src = src;

          img.onload = () => {
            if (!isCancelled) {
              setActiveSrc(src);
              setIsLoaded(true);
            }
          };

          img.onerror = () => {
            if (!isCancelled) {
              setIsError(true);
            }
          };
        }
      },
      { rootMargin, threshold }
    );

    return () => {
      isCancelled = true;
      unobserve();
    };
  }, [src, rootMargin, threshold]);

  const style: CSSProperties = activeSrc
    ? { backgroundImage: `url("${activeSrc}")` }
    : {};

  return { ref, style, isLoaded, isError };
}

```

---

### Why This Design Is Optimal

* **`WeakMap` for Callbacks:** Prevents memory leaks by ensuring DOM nodes held in memory by the browser can be garbage-collected without dangling callback references.
* **Option Keying (`Map`):** Elements sharing identical `rootMargin` and `threshold` are grouped into a single `IntersectionObserver`. If different components require different margins, the manager automatically isolates them into distinct instances.
* **Auto-Teardown:** When all elements using a specific config unmount, `observer.disconnect()` is called and the entry is removed from the registry to avoid lingering event listeners.
