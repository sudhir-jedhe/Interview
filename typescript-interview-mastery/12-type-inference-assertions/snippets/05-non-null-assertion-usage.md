# Non-null assertion after a manual guard

```typescript
// Snippet: `!` used right after logic TS's narrowing can't follow across a callback
function withRetry(fn: () => void, attempts: number) {
  let lastError: Error | undefined;

  for (let i = 0; i < attempts; i++) {
    try {
      return fn();
    } catch (err) {
      lastError = err as Error;
    }
  }

  throw lastError!; // we know the loop ran at least once if we reach here
}
```
