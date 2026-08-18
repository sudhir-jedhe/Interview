# Problem: Type a generic `debounce` preserving wrapped-function parameter types

## Problem statement

Implement a generic `debounce<T extends (...args: any[]) => void>` utility function that wraps any function `fn`, returning a new function with the *exact same parameter types* as `fn`, delaying invocation until `delayMs` milliseconds have passed since the last call. Must not use `any` for the returned function's parameters — only in the generic constraint itself.

## Requirements

- `function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number): (...args: Parameters<T>) => void`
- Calling the debounced function repeatedly within `delayMs` should reset the timer (only the last call within the window actually invokes `fn`).
- The returned function's parameter types must exactly match `fn`'s, with full autocomplete and type errors on mismatched arguments.
- Must compile under `strict: true`.

## Solution

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
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}

function updateSearchResults(query: string, page: number): void {
  console.log(`Fetching results for "${query}", page ${page}`);
}

const debouncedUpdate = debounce(updateSearchResults, 250);

debouncedUpdate("laptop", 1); // superseded by the next call before 250ms elapses
debouncedUpdate("laptop stand", 1); // this is the call that actually fires after 250ms

// debouncedUpdate("laptop stand"); // Error: Expected 2 arguments, but got 1.
// debouncedUpdate(123, 1);          // Error: Argument of type 'number' is not assignable to 'string'.
```

### Why this is the correct approach

`Parameters<T>` is a built-in conditional type that extracts a function type's parameter list as a tuple — using it (rather than re-declaring `(...args: any[])` on the returned function) means the debounced wrapper's signature stays perfectly synchronized with whatever function `debounce` is called with, for any `T`, without manual duplication. The `any[]` appearing in the generic constraint (`T extends (...args: any[]) => void`) is scoped only to describing "any function shape is acceptable as input to `debounce`" — it does not leak into the actual parameter types callers interact with, since `Parameters<T>` recovers the concrete, specific parameter types once `T` is inferred from the real argument passed to `debounce`. This is the standard, type-safe pattern for any higher-order function that wraps an arbitrary function while preserving its call signature (`throttle`, `once`, `memoize` all follow the same shape).
