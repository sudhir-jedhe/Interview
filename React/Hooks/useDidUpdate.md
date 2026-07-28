`useDidUpdate` is a custom hook that behaves like `useEffect`, **but skips the initial render** and only runs on updates.

---

# Basic Implementation

```tsx
import { useEffect, useRef } from "react";

export function useDidUpdate(callback: () => void, dependencies: any[]) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    callback();
  }, dependencies);
}
```

---

# Usage

### Normal `useEffect`

Runs on mount + updates

```tsx
useEffect(() => {
  console.log("API Call");
}, [searchText]);
```

Output:

```text
Initial Render ✅
Subsequent Updates ✅
```

---

### `useDidUpdate`

Runs only on updates

```tsx
useDidUpdate(() => {
  console.log("API Call");
}, [searchText]);
```

Output:

```text
Initial Render ❌
Subsequent Updates ✅
```

---

# Example: Search Component

```tsx
import { useState } from "react";
import { useDidUpdate } from "./useDidUpdate";

export default function Search() {
  const [query, setQuery] = useState("");

  useDidUpdate(() => {
    console.log("Searching:", query);

    // API call
    fetch(`/api/search?q=${query}`);
  }, [query]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Behaviour

```text
Component Mounted
❌ API not called

Type "react"
✅ API called

Type "reactjs"
✅ API called
```

---

# Production Version (Supports Cleanup)

```tsx
import { useEffect, useRef } from "react";

type EffectCallback = () => void | (() => void);

export function useDidUpdate(
  callback: EffectCallback,
  deps: React.DependencyList,
) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    return callback();
  }, deps);
}
```

---

# TypeScript Generic Version

```tsx
import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export const useDidUpdate = (effect: EffectCallback, deps?: DependencyList) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return effect();
    }

    mounted.current = true;
  }, deps);
};
```

---

# Real Interview Scenarios

### 1. API Call on Filter Change

```tsx
useDidUpdate(() => {
  fetchProducts(filters);
}, [filters]);
```

Avoids unnecessary API call on page load.

---

### 2. Form Autosave

```tsx
useDidUpdate(() => {
  saveDraft(formData);
}, [formData]);
```

Only save after user changes something.

---

### 3. Analytics Tracking

```tsx
useDidUpdate(() => {
  analytics.track("Selected Category");
}, [selectedCategory]);
```

Don't fire analytics on initial render.

---

# Advanced Version Using Previous Values

```tsx
import { useEffect, useRef } from "react";

export function useDidUpdate<T>(
  value: T,
  callback: (previous: T | undefined, current: T) => void,
) {
  const isMounted = useRef(false);
  const previousValue = useRef<T>();

  useEffect(() => {
    if (isMounted.current) {
      callback(previousValue.current, value);
    } else {
      isMounted.current = true;
    }

    previousValue.current = value;
  }, [value]);
}
```

### Usage

```tsx
useDidUpdate(count, (prev, current) => {
  console.log(`Count changed from ${prev} to ${current}`);
});
```

---

# Senior React Interview Follow-up

When asked **"Why not use useEffect?"**, explain:

| Hook           | Initial Render | Updates |
| -------------- | -------------- | ------- |
| `useEffect`    | ✅             | ✅      |
| `useDidUpdate` | ❌             | ✅      |

`useDidUpdate` is useful when:

- API calls should happen only after user interaction
- Form auto-save shouldn't run on page load
- Analytics events shouldn't fire on initial mount
- Expensive computations should be skipped on first render

This is a common custom hook question in Senior React/Frontend Lead interviews because it demonstrates understanding of `useEffect`, refs, component lifecycle, and reusable hook design.
