Here is a production-ready custom React hook, `useLazyBackground`, written in TypeScript. It uses `IntersectionObserver` to defer loading the image until the element approaches the viewport, preloads the image off-DOM, and handles smooth transitions, loading states, and error states.

---

### 1. The Custom Hook Implementation

```tsx
import { useState, useEffect, useRef, CSSProperties } from 'react';

export interface UseLazyBackgroundOptions {
  /** The URL of the high-res image to lazy load */
  src?: string;
  /** Margin around the root. Default loads 200px before reaching viewport. */
  rootMargin?: string;
  /** Percentage of target visibility before triggering. Default: 0 */
  threshold?: number | number[];
}

export interface UseLazyBackgroundResult<T extends HTMLElement> {
  /** Attach this ref to the container DOM element */
  ref: React.RefObject<T | null>;
  /** CSS properties containing the active background-image */
  style: CSSProperties;
  /** Whether the image has fully downloaded and is displaying */
  isLoaded: boolean;
  /** Whether the image download failed */
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

    // Reset state if src changes
    setIsLoaded(false);
    setIsError(false);
    setActiveSrc(null);

    const element = ref.current;
    if (!element) return;

    // Fallback for SSR or older browsers without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setActiveSrc(src);
      setIsLoaded(true);
      return;
    }

    let isCancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 1. Unobserve immediately so it only triggers once
          observer.unobserve(element);

          // 2. Preload image in the background before updating state
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

    observer.observe(element);

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [src, rootMargin, threshold]);

  const style: CSSProperties = activeSrc
    ? { backgroundImage: `url("${activeSrc}")` }
    : {};

  return { ref, style, isLoaded, isError };
}

```

---

### 2. Example Usage in a Component

```tsx
import React from 'react';
import { useLazyBackground } from './useLazyBackground';

interface HeroCardProps {
  title: string;
  imageUrl: string;
}

export function HeroCard({ title, imageUrl }: HeroCardProps) {
  const { ref, style, isLoaded, isError } = useLazyBackground<HTMLDivElement>({
    src: imageUrl,
    rootMargin: '0px 0px 300px 0px', // Fetch 300px early
  });

  return (
    <div
      ref={ref}
      style={style}
      className={`card-container ${isLoaded ? 'loaded' : 'loading'} ${
        isError ? 'error' : ''
      }`}
    >
      <div className="card-overlay">
        <h2>{title}</h2>
        {isError && <span className="badge-error">Failed to load image</span>}
      </div>
    </div>
  );
}

```

---

### 3. Complementary CSS Styles

```css
.card-container {
  min-height: 400px;
  width: 100%;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  /* Fallback placeholder color */
  background-color: #e5e7eb;
  
  /* Smooth fade-in once the background is populated */
  transition: opacity 0.3s ease-in-out;
}

.card-container.loading {
  opacity: 0.8;
}

.card-container.loaded {
  opacity: 1;
}

.card-container.error {
  background-color: #fee2e2;
}

.card-overlay {
  padding: 24px;
  color: white;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  border-radius: inherit;
  height: 100%;
}

```

---

### Key Architectural Details

* **Preloading via `new Image()`:** Updating the React state directly when the element intersects causes the browser to begin downloading the image, which can result in a blank/white flash while the bytes download. Preloading in an off-screen `Image()` instance ensures `backgroundImage` is set only after the resource is fully available in the browser cache.
* **Race Condition Prevention:** The `isCancelled` flag inside `useEffect` ensures that if a component unmounts while the image is downloading, no state updates fire against an unmounted component.
* **One-time Trigger (`observer.unobserve`):** Unobserving upon the first intersection stops ongoing thread overhead and prevents unnecessary re-renders when the user scrolls back and forth.
* **Configurable `rootMargin`:** Setting a positive margin on the bottom (e.g., `300px`) starts the network request before the user scrolls the element into view, providing a seamless visual experience.
