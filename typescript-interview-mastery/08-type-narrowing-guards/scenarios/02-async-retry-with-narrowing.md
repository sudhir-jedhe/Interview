# Building a retry helper without losing narrowing across async boundaries

You're writing a helper that retries an async operation a few times before giving up, and it needs to distinguish "retryable" errors (network timeouts) from "fatal" errors (validation failures) using a type guard — but the retry loop involves `await`, and previous narrowing needs to survive across each async step correctly, which is exactly the kind of place the closure-narrowing pitfall tends to bite.

**Approach:** Narrow the caught error immediately upon catching it (synchronously, right there in the `catch` block), and capture the narrowed reference in a `const` before any further `await` or callback happens — never rely on a narrowing performed before an `await` still holding true for code written after it.

```typescript
class RetryableError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function isRetryable(error: unknown): error is RetryableError {
  return error instanceof RetryableError;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryable(error)) {
        throw error; // fatal — narrowed to non-RetryableError, rethrow immediately
      }

      const retryableError = error; // const snapshot — safe to reference after this point
      console.warn(
        `Attempt ${attempt} failed with retryable error: ${retryableError.message}. Retrying...`
      );

      await new Promise((resolve) => setTimeout(resolve, attempt * 200));
    }
  }

  throw lastError;
}
```

Two narrowing-related decisions matter here. First, `if (!isRetryable(error)) throw error;` narrows and disposes of the non-retryable case immediately and synchronously, before any `await` — there's no closure or async gap for the narrowing to get lost across. Second, even though `error` (the `catch` binding) is itself effectively re-bound fresh on every loop iteration and isn't reassigned within an iteration, the `const retryableError = error;` line is defensive best practice: it makes the narrowed reference explicit and immune to any future refactor that might introduce a reassignment or a callback between the narrowing check and its use, which is the exact category of bug the closure-narrowing pitfall represents.
