# 1. useBoolean

```jsx
import { useState } from "react";

export function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);

  return {
    value,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
    toggle: () => setValue((v) => !v),
  };
}
```

This is a clean, standard implementation of a custom `useBoolean` React hook.

Here are a few quick notes on its design and potential improvements depending on how you plan to use it:

### Key Highlights

* **Functional toggle state updates:** Using `setValue((v) => !v)` in `toggle` avoids stale closures, which is the correct pattern.
* **Readable API:** Returning named functions (`setTrue`, `setFalse`, `toggle`) makes consumer code much cleaner than manually calling `setValue(true)`.

### Production Recommendations

If you plan to use this in a component where child components depend on these callbacks via `React.memo` or inside `useEffect` dependencies, you should memoize the return object or callbacks with `useCallback` and `useMemo` so their references remain stable between renders:

```jsx
import { useState, useCallback, useMemo } from "react";

export function useBoolean(initial = false) {
  const [value, setValue] = useState(Boolean(initial));

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);

  return useMemo(
    () => ({
      value,
      setValue,
      setTrue,
      setFalse,
      toggle,
    }),
    [value, setTrue, setFalse, toggle]
  );
}

```

*Added features in this version:*

1. **`useCallback` / `useMemo`:** Keeps function references stable to prevent unnecessary re-renders in children.
2. **`setValue` exposed:** Exposing the raw setter provides a fallback if a consumer needs to pass a dynamic boolean value.
3. **`Boolean(initial)`:** Ensures non-boolean initial values are coerced safely.
