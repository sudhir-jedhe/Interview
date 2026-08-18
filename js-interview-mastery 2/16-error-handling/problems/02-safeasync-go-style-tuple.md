# Problem: `safeAsync(fn)` — Go-Style `[error, result]` Tuples

**Goal:** Implement a wrapper that catches errors from an async function and returns a `[error, result]` tuple instead of throwing — similar to Go's idiomatic `result, err := doSomething()` pattern, avoiding scattered `try`/`catch` blocks throughout calling code.

## Implementation

```js
async function safeAsync(promiseOrFn) {
  try {
    const result = typeof promiseOrFn === "function" ? await promiseOrFn() : await promiseOrFn;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}
```

Accepting either a function *or* an already-created promise makes the utility flexible for both `safeAsync(() => fetchUser(id))` and `safeAsync(fetchUser(id))` call styles.

## Usage

```js
async function loadProfile(id) {
  const [err, user] = await safeAsync(() => fetchUser(id));
  if (err) {
    console.error("failed to load user:", err.message);
    return null; // caller handles the failure inline, no try/catch needed here
  }

  const [ordersErr, orders] = await safeAsync(() => fetchOrders(user.id));
  if (ordersErr) {
    // partial success is fine here — the profile can render without order history
    console.warn("failed to load orders, showing profile without them:", ordersErr.message);
    return { ...user, orders: [] };
  }

  return { ...user, orders };
}
```

## A typed-tuple variant with a discriminated result object

Some codebases prefer a named-property version over a positional tuple, trading a little verbosity for clearer call sites:

```js
async function safeAsyncResult(fn) {
  try {
    return { ok: true, value: await fn() };
  } catch (error) {
    return { ok: false, error };
  }
}

const result = await safeAsyncResult(() => fetchUser(id));
if (!result.ok) {
  console.error(result.error.message);
} else {
  console.log(result.value);
}
```

## Key implementation details interviewers probe for

- **Never lets an error escape `safeAsync` itself**: the whole point is that callers no longer need `try`/`catch` — every call site becomes a plain `if (err)` check, which especially helps in code with many sequential independent async steps that each need individual error handling (contrast with a single `try`/`catch` around all of them, which stops at the first failure).
- **Preserves the original error object**: unlike swallowing and returning a generic message, the real `Error` (with its `stack`, `name`, custom subclass, etc. — see `problems/01-custom-error-hierarchy.md`) is passed through unchanged, so callers can still `instanceof` check it if needed.
- **This is a stylistic choice, not a strict improvement**: `[err, result]` tuples avoid `try`/`catch` boilerplate but push the responsibility of *remembering* to check `err` onto every call site, exactly the same discipline problem Node-style `(err, data)` callbacks always had — it's a preference, not a fix for a fundamental error-handling flaw.
