A **`useMediaQuery`** custom hook allows React components to react to CSS media queries dynamically.

Common uses:

✅ Mobile / Tablet / Desktop detection  
✅ Dark mode detection  
✅ Responsive components  
✅ Conditional rendering  
✅ SSR-safe responsive layouts

---

# Basic Implementation

```tsx
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string) => {
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
```

---

# Usage

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

return <div>{isMobile ? "Mobile View" : "Desktop View"}</div>;
```

---

# Example: Responsive Navigation

```tsx
function Navigation() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return <>{isMobile ? <MobileMenu /> : <DesktopMenu />}</>;
}
```

---

# SSR-Safe Version (Next.js)

Avoids:

```text
ReferenceError: window is not defined
```

```tsx
import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const getMatch = () => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
```

---

# Design System Hook

A pattern commonly used in enterprise React applications.

```tsx
export function useBreakpoint() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}
```

Usage:

```tsx
const { isMobile, isTablet, isDesktop } = useBreakpoint();
```

---

# Dark Mode Detection

```tsx
const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
```

Usage:

```tsx
return (
  <div>
    Theme:
    {prefersDarkMode ? "Dark" : "Light"}
  </div>
);
```

---

# Senior Frontend Interview Version

Supports multiple breakpoints.

## `useResponsive.ts`

```tsx
import { useMediaQuery } from "./useMediaQuery";

export function useResponsive() {
  return {
    xs: useMediaQuery("(max-width: 575px)"),

    sm: useMediaQuery("(min-width: 576px) and (max-width: 767px)"),

    md: useMediaQuery("(min-width: 768px) and (max-width: 991px)"),

    lg: useMediaQuery("(min-width: 992px) and (max-width: 1199px)"),

    xl: useMediaQuery("(min-width: 1200px)"),
  };
}
```

---

# Optimised Single Listener Version

Avoid creating multiple `matchMedia` listeners.

```tsx
import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const update = () => setMatches(media.matches);

    update();

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
```

---

# Example in a Design System

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

const dropdownPlacement = isMobile ? "bottom" : "right";

const modalSize = isMobile ? "full-screen" : "medium";
```

---

# Interview Discussion Points

### Why not use `window.innerWidth`?

```tsx
window.innerWidth;
```

Problems:

- Doesn't automatically react to viewport changes
- Needs manual resize listeners
- Doesn't support media features like:
  - dark mode
  - orientation
  - reduced motion

---

### Benefits of `matchMedia`

```tsx
window.matchMedia();
```

✅ Native browser API

✅ Event-driven

✅ Supports all CSS media features

✅ Better performance

---

### Common Queries

```tsx
"(max-width: 768px)"

"(min-width: 1024px)"

"(orientation: portrait)"

"(prefers-color-scheme: dark)"

"(prefers-reduced-motion: r


educe)"
```

---

# Production-Ready API

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

const isDark = useMediaQuery("(prefers-color-scheme: dark)");

const isPortrait = useMediaQuery("(orientation: portrait)");
```

This is the level of implementation and explanation typically expected in a **Senior React / Frontend Lead interview**, especially when discussing custom hooks, responsive design systems, and reusable UI architecture.

Here is a production-ready `useMediaQuery` hook built using `useSyncExternalStore` (React 18+). It provides real-time media query evaluation, zero layout tearing in concurrent mode, and full SSR hydration safety.

```jsx
import { useSyncExternalStore, useCallback } from "react";

/**
 * Custom hook to evaluate and subscribe to CSS media query changes.
 * Uses useSyncExternalStore for concurrent-safe updates and SSR compatibility.
 *
 * @param {string} query - Standard CSS media query string (e.g. '(min-width: 768px)').
 * @param {boolean} [serverFallback=false] - Fallback boolean value returned during SSR rendering.
 * @returns {boolean} True if the media query matches, false otherwise.
 */
export function useMediaQuery(query, serverFallback = false) {
  // Subscribe to matchMedia change events
  const subscribe = useCallback(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);

      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  // Get current snapshot on client side
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return serverFallback;
    }
    return window.matchMedia(query).matches;
  }, [query, serverFallback]);

  // Get snapshot on server side (SSR / static generation)
  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

```

---

### Usage Examples

#### 1. Responsive Screen Breakpoints

```jsx
function ResponsiveHeader() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  return (
    <header>
      {isDesktop && <DesktopNavigation />}
      {isTablet && <TabletNavigation />}
      {!isDesktop && !isTablet && <MobileMenuDrawer />}
    </header>
  );
}

```

#### 2. System Preference Detection (Dark Mode / Reduced Motion)

```jsx
function AccessibilityAwareComponent() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div
      style={{
        backgroundColor: prefersDarkMode ? "#1a1a1a" : "#ffffff",
        transition: prefersReducedMotion ? "none" : "all 0.3s ease",
      }}
    >
      Accessibility Settings Aware Content
    </div>
  );
}

```

---

### Key Features

- **React 18 Concurrent-Safe:** Uses `useSyncExternalStore` to avoid layout tearing and ensure synchronization across concurrent state updates.
- **SSR Hydration Safe:** Accepts a `serverFallback` parameter (defaulting to `false`) to prevent client-server HTML hydration mismatches in Next.js, Remix, or Gatsby.
- **Event Listener Cleanup:** Uses `addEventListener("change")` with proper cleanup to eliminate listener leaks when components unmount or queries update.
- **Zero Event Thrashing:** Fires updates *only* when the specified media query state flips between `true` and `false` (unlike `window.resize` listeners).
