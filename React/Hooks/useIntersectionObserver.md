Here is a production-ready, highly flexible `useIntersectionObserver` hook. It supports ref targets, element targets, freeze-once-visible behavior (ideal for lazy loading images), and custom observer options (`threshold`, `root`, `rootMargin`).

```jsx
import { useEffect, useState, useRef } from "react";

/**
 * Custom hook to track the intersection state of a DOM element using IntersectionObserver.
 *
 * @param {React.RefObject|HTMLElement|null} target - Element or Ref to observe.
 * @param {Object} options - IntersectionObserver configuration options.
 * @param {Element|null} [options.root=null] - Viewport element used for checking visibility.
 * @param {string} [options.rootMargin="0px"] - Margin around root element.
 * @param {number|number[]} [options.threshold=0] - Visibility threshold ratio(s).
 * @param {boolean} [options.freezeOnceVisible=false] - If true, freezes state once element becomes visible (ideal for lazy loading).
 * @returns {IntersectionObserverEntry|null} The current intersection entry state.
 */
export function useIntersectionObserver(
  target,
  {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    freezeOnceVisible = false,
  } = {}
) {
  const [entry, setEntry] = useState(null);

  // Freeze check state to prevent unnecessary updates after initial visibility
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  // Use refs for callback options to prevent observer re-creation on inline option changes
  const optionsRef = useRef({ root, rootMargin, threshold, freezeOnceVisible });
  useEffect(() => {
    optionsRef.current = { root, rootMargin, threshold, freezeOnceVisible };
  });

  useEffect(() => {
    // Resolve target DOM node (supports RefObject or raw HTMLElement)
    const element = target && "current" in target ? target.current : target;

    // Skip setup if window/IntersectionObserver missing, no element target, or state frozen
    if (
      typeof window === "undefined" ||
      !window.IntersectionObserver ||
      !element ||
      frozen
    ) {
      return;
    }

    const { root, rootMargin, threshold } = optionsRef.current;

    const observer = new IntersectionObserver(
      ([firstEntry]) => {
        setEntry(firstEntry);
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [target, frozen]);

  return entry;
}

```

---

### Usage Examples

#### 1. Image Lazy Loading (`freezeOnceVisible`)

```jsx
import { useRef } from "react";

function LazyImage({ src, alt }) {
  const imgRef = useRef(null);
  
  // Freeze observation once intersecting so it stays loaded
  const entry = useIntersectionObserver(imgRef, {
    rootMargin: "200px", // Preload image 200px before scrolling into view
    freezeOnceVisible: true,
  });

  const isVisible = Boolean(entry?.isIntersecting);

  return (
    <div ref={imgRef} style={{ minHeight: "200px", background: "#f0f0f0" }}>
      {isVisible ? (
        <img src={src} alt={alt} style={{ width: "100%", display: "block" }} />
      ) : (
        <span>Loading placeholder...</span>
      )}
    </div>
  );
}

```

#### 2. Scroll Animation Tracker

```jsx
import { useRef } from "react";

function AnimatedSection({ children }) {
  const sectionRef = useRef(null);
  
  const entry = useIntersectionObserver(sectionRef, {
    threshold: 0.5, // Triggers when 50% of the section is visible
  });

  const isVisible = Boolean(entry?.isIntersecting);

  return (
    <section
      ref={sectionRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.6s ease-out",
      }}
    >
      {children}
    </section>
  );
}

```

#### 3. Infinite Scroll Sentinel

```jsx
import { useRef, useEffect } from "react";

function InfiniteList({ loadMore, hasMore }) {
  const sentinelRef = useRef(null);

  const entry = useIntersectionObserver(sentinelRef, {
    rootMargin: "100px",
  });

  const isVisible = Boolean(entry?.isIntersecting);

  useEffect(() => {
    if (isVisible && hasMore) {
      loadMore();
    }
  }, [isVisible, hasMore, loadMore]);

  return (
    <div>
      {/* Rendered item list */}
      <div ref={sentinelRef} style={{ height: "20px" }} />
    </div>
  );
}

```

---

### Key Features

* **Lazy Loading Friendly (`freezeOnceVisible`):** Automatically disconnects observation once the element comes into view, saving CPU overhead for images or static lazy components.
* **Ref & Element Flexible:** Accepts standard React `useRef` objects or raw DOM elements seamlessly.
* **Option Stabilization:** Prevents observer teardown/re-creation loops if inline configuration objects (`{ threshold: 0.5 }`) are passed directly in component renders.
* **SSR Safe:** Safely checks `IntersectionObserver` availability before running client-side setup.

Here is a production-ready `useIntersectionObserver` React hook. It uses a **callback ref** pattern so it works reliably with conditionally rendered elements, dynamic lists, and component state changes.

It supports options for `freezeOnceVisible` (ideal for image lazy-loading and entrance animations), custom `root` / `rootMargin` / `threshold` values, and full SSR compatibility.

```jsx
import { useState, useCallback, useRef } from "react";

/**
 * Custom hook to monitor DOM element visibility using IntersectionObserver.
 *
 * @param {Object} [options] - Configuration options.
 * @param {Element|null} [options.root=null] - The element that is used as the viewport for checking visibility.
 * @param {string} [options.rootMargin="0px"] - Margin around the root (e.g. "100px" to pre-trigger lazy loads).
 * @param {number|number[]} [options.threshold=0] - Single number or array of numbers indicating visible ratio thresholds.
 * @param {boolean} [options.freezeOnceVisible=false] - If true, stops observing once the element becomes visible.
 * @param {boolean} [options.initialIsIntersecting=false] - Initial fallback visibility state before observer connects.
 * @returns {[Function, IntersectionObserverEntry|null, boolean]} A tuple containing [refCallback, entry, isIntersecting].
 */
export function useIntersectionObserver(options = {}) {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    freezeOnceVisible = false,
    initialIsIntersecting = false,
  } = options;

  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);

  const observerRef = useRef(null);
  const frozenRef = useRef(false);

  // Store options in ref to keep options stable without re-creating callback ref
  const optionsRef = useRef({ root, rootMargin, threshold, freezeOnceVisible });
  optionsRef.current = { root, rootMargin, threshold, freezeOnceVisible };

  const ref = useCallback((node) => {
    // Clean up previous observer instance
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Skip if element was already frozen as visible
    if (frozenRef.current) return;

    if (node && typeof IntersectionObserver !== "undefined") {
      const { root, rootMargin, threshold, freezeOnceVisible } = optionsRef.current;

      observerRef.current = new IntersectionObserver(
        ([latestEntry]) => {
          const isElementIntersecting = latestEntry.isIntersecting;

          setEntry(latestEntry);
          setIsIntersecting(isElementIntersecting);

          // Freeze state if configured (e.g., for lazy loading images or entrance animations)
          if (isElementIntersecting && freezeOnceVisible) {
            frozenRef.current = true;
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          }
        },
        { root, rootMargin, threshold }
      );

      observerRef.current.observe(node);
    }
  }, []);

  return [ref, entry, isIntersecting];
}

```

---

### Usage Examples

#### 1. Image Lazy Loading with Pre-fetching Margin

```jsx
function LazyImage({ src, alt }) {
  // Triggers 200px BEFORE the image scrolls into the visible viewport
  const [imgRef, , isVisible] = useIntersectionObserver({
    rootMargin: "200px",
    freezeOnceVisible: true, // Stop observing once loaded
  });

  return (
    <div
      ref={imgRef}
      style={{
        minHeight: "300px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isVisible ? (
        <img src={src} alt={alt} style={{ width: "100%", display: "block" }} />
      ) : (
        <span>Loading placeholder...</span>
      )}
    </div>
  );
}

```

#### 2. Scroll Triggered Animation

```jsx
function AnimatedCard() {
  const [cardRef, , isVisible] = useIntersectionObserver({
    threshold: 0.3, // Requires 30% of card to be visible
    freezeOnceVisible: true,
  });

  return (
    <div
      ref={cardRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        padding: "24px",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Fade & Slide In Title</h3>
      <p>This content animates smoothly as soon as 30% enters the viewport.</p>
    </div>
  );
}

```

#### 3. Infinite Scroll / Trigger at Bottom of List

```jsx
function InfiniteScrollList({ fetchNextPage, hasNextPage, isLoading }) {
  const [loadMoreRef, , isIntersecting] = useIntersectionObserver({
    threshold: 1.0, // Triggers when the sentinel element is fully visible
  });

  // Call fetchNextPage when sentinel intersects
  if (isIntersecting && hasNextPage && !isLoading) {
    fetchNextPage();
  }

  return (
    <div>
      {/* Item list rendering */}
      <div ref={loadMoreRef} style={{ height: "20px", margin: "10px 0" }}>
        {isLoading && <p>Loading more items...</p>}
      </div>
    </div>
  );
}

```

---

### Key Features

* **Callback Ref Pattern:** Guarantees observer binding even on dynamically mounted components, conditional renders, or list items that swap in and out of DOM.
* **`freezeOnceVisible` Performance Mode:** Disconnects the observer as soon as the element becomes visible—ideal for lazy images, single-fire animations, or tracking pixels to save GPU/CPU memory.
* **Full `IntersectionObserverEntry` Payload:** Returns `[ref, entry, isIntersecting]`, giving you access to `intersectionRatio`, `boundingClientRect`, and `target` whenever needed.
* **SSR Safe:** Gracefully skips observer attachment when `IntersectionObserver` is undefined on the server.
