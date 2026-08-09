Here is a production-ready, SSR-safe `useBreakpoint` hook built on top of the native `window.matchMedia` API. It uses `useSyncExternalStore` (React 18+) to ensure layout stability without visual flicker or re-renders.

```jsx
import { useSyncExternalStore } from "react";

const DEFAULT_BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

export function useBreakpoint(query, breakpoints = DEFAULT_BREAKPOINTS) {
  // Resolve media query string from breakpoint name or raw media query
  const mediaQuery = breakpoints[query] || query;

  const subscribe = (callback) => {
    if (typeof window === "undefined") return () => {};

    const matchMedia = window.matchMedia(mediaQuery);
    matchMedia.addEventListener("change", callback);

    return () => matchMedia.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(mediaQuery).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

```

### Usage Examples

#### 1. Standard Breakpoint Names

```jsx
function Navigation() {
  const isDesktop = useBreakpoint("lg"); // matches >= 1024px

  return (
    <nav>
      {isDesktop ? <DesktopMenu /> : <MobileDrawer />}
    </nav>
  );
}

```

#### 2. Raw Media Queries / Custom Breakpoints

```jsx
function ThemeAwareImage() {
  // Accepts standard CSS media queries directly
  const isDark = useBreakpoint("(prefers-color-scheme: dark)");
  const isMobilePortrait = useBreakpoint("(max-width: 639px) and (orientation: portrait)");

  return <div>{/* Render responsive variants */}</div>;
}

```

### Key Features

* **Zero Event Thrashing:** Unlike listening to `window.resize`, `matchMedia` only fires when crossing threshold boundaries.
* **React 18 Concurrent-Safe:** Uses `useSyncExternalStore` to avoid layout tearing and ensure synchronization across simultaneous state updates.
* **SSR Safe:** Handles server snapshots gracefully without hydration mismatch errors in Next.js or Remix.
