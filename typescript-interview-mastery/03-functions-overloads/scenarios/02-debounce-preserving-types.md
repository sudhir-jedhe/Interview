# Scenario: A generic `debounce` that preserves the wrapped function's parameter types

You're building a search-as-you-type feature and need a `debounce` utility that wraps any function, delaying its execution until a pause in calls, while fully preserving the wrapped function's parameter types for callers — no `any`, no loss of autocomplete on the debounced function's arguments.

**Approach:** Use a generic constrained to a function type (`T extends (...args: any[]) => void`), and derive the wrapper's parameter type directly from `T` using `Parameters<T>` rather than re-declaring the parameter list by hand — this keeps the debounced function's signature perfectly in sync with the original, even if it changes later.

```typescript
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

function searchProducts(query: string, category: string): void {
  console.log(`Searching "${query}" in ${category}`);
}

const debouncedSearch = debounce(searchProducts, 300);

debouncedSearch("wireless mouse", "electronics"); // fully typed — autocompletes as (query, category)
// debouncedSearch("wireless mouse"); // Error: Expected 2 arguments, but got 1.
// debouncedSearch(42, "electronics"); // Error: Argument of type 'number' is not assignable to 'string'.
```

The constraint `T extends (...args: any[]) => void` intentionally uses `any[]` only in the *constraint* (to accept any function shape generically) — the actual call sites remain fully type-checked because `Parameters<T>` extracts the real, concrete parameter tuple from whatever specific function `T` was inferred to be at the call to `debounce`. This is the standard pattern for "wrap an arbitrary function, keep its exact signature" utilities (`throttle`, `memoize`, `once` follow the identical shape) — it avoids both the unsafety of typing the wrapper's parameters as `any[]` directly and the tedium of manually re-declaring every wrapped function's parameter list.
