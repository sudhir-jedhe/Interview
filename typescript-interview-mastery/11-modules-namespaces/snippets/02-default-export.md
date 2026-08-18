# Snippet: a single default export for a focused module

```typescript
// A module whose entire purpose is one thing, a reasonable default-export case.

interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
}

export default async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < options.maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, options.delayMs));
    }
  }
  throw lastError;
}

// Elsewhere: import withRetry from "./withRetry";
```
