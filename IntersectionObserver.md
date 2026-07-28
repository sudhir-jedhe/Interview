The **`IntersectionObserver` API** provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

It is the standard, high-performance way to handle tasks like **infinite scrolling**, **lazy-loading images**, **scroll-triggered animations**, and **ad visibility tracking** without polluting the main thread with continuous `scroll` event listeners.

---

### Core Syntax & Basic Example

```javascript
// 1. Define the callback function
const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log("Element is in view!", entry.target);

      // Optional: Stop observing if you only need to trigger once (e.g., lazy loading)
      // observer.unobserve(entry.target);
    }
  });
};

// 2. Configure observer options
const options = {
  root: null, // Default is null (uses the browser viewport)
  rootMargin: "0px", // Margin around the root (e.g., '100px' to pre-trigger)
  threshold: 0.5, // 0.0 to 1.0 (0.5 means 50% of the target must be visible)
};

// 3. Instantiate the observer
const observer = new IntersectionObserver(callback, options);

// 4. Start observing target element(s)
const target = document.querySelector("#my-element");
observer.observe(target);
```

---

### Key Concepts & Configuration Options

#### Options Object

- **`root`**: The element used as the viewport for checking visibility. Must be an ancestor of the target. If `null` or omitted, it defaults to the browser viewport.
- **`rootMargin`**: Offsets applied to the root element's bounding box (syntax similar to CSS `margin`: e.g., `'10px 20px 30px 40px'`).
- _Tip:_ Using `'200px'` allows you to trigger lazy loads **before** the user actually scrolls to the element.

- **`threshold`**: A single number or an array of numbers between `0.0` and `1.0`.
- `0.0`: Triggers as soon as the first pixel enters the viewport.
- `1.0`: Triggers only when 100% of the element is visible.
- `[0, 0.25, 0.5, 0.75, 1.0]`: Triggers callback every time visibility crosses a 25% threshold step.

#### The `IntersectionObserverEntry` Object

Inside your callback, each `entry` provides details about the intersection state:

- **`entry.isIntersecting`**: Boolean — `true` if the target element intersects with the root.
- **`entry.intersectionRatio`**: Number — The percentage ($0.0$ to $1.0$) of the target currently visible.
- **`entry.target`**: The DOM element being observed.
- **`entry.boundingClientRect`**: Bounding rectangle of the target element.
- **`entry.intersectionRect`**: Bounding rectangle of the visible region of the target element.

---

### Common Real-World Use Cases

#### 1. Reusable React Custom Hook (`useIntersectionObserver`)

```tsx
import { useEffect, useRef, useState } from "react";

export function useIsVisible(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [options]);

  return { targetRef, isVisible };
}
```

#### 2. Native Image Lazy Loading Fallback / Custom Lazy Loader

```javascript
const lazyImages = document.querySelectorAll("img.lazy");

const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src; // Swap placeholder with real data-src URL
        img.classList.remove("lazy");
        observer.unobserve(img); // Stop observing once loaded
      }
    });
  },
  { rootMargin: "100px" },
); // Preload 100px before scrolling into view

lazyImages.forEach((img) => imageObserver.observe(img));
```

---

### Performance Advantages vs `scroll` Events

| Strategy                                | Performance Impact                                                                                                                                 | Main Thread Usage                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **`window.addEventListener('scroll')`** | Poor — Fires continuously on every pixel scrolled. Requires manual `getBoundingClientRect()` calls which trigger browser reflows/layout thrashing. | Heavy (causes UI stutter unless debounced/throttled) |
| **`IntersectionObserver`**              | Excellent — Asynchronous callbacks executed off the main animation thread. Runs only when intersection thresholds are crossed.                     | Non-blocking                                         |
