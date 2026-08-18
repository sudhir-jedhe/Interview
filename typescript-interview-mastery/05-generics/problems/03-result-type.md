# Implement a generic Result&lt;T, E&gt; type and a safe unwrap function

## Problem

Model a success/failure wrapper commonly used instead of throwing exceptions for expected, recoverable errors (validation failures, not-found lookups, parse errors). Implement:

- A `Result<T, E>` discriminated union with `ok: true` / `ok: false` branches.
- Helper constructors `ok(value)` and `err(error)`.
- An `unwrap` function that returns the success value or throws (for cases where failure truly is exceptional), and a separate `unwrapOr` that returns a fallback instead of throwing.

## Solution

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw result.error instanceof Error
    ? result.error
    : new Error(String(result.error));
}

function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}
```

## Usage

```typescript
function parsePort(raw: string): Result<number, string> {
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return err(`"${raw}" is not a valid port number`);
  }
  return ok(port);
}

const good = parsePort("8080");
const bad = parsePort("not-a-number");

if (good.ok) {
  console.log(good.value.toFixed(0)); // narrowed to number
}

console.log(unwrapOr(bad, 3000)); // 3000, no exception thrown
unwrap(bad); // throws Error('"not-a-number" is not a valid port number')
```

## Discussion

`Result<T, E>` is a discriminated union on the `ok` field — checking `result.ok` narrows the whole object, giving you `value: T` in the `true` branch and `error: E` in the `false` branch with no casting. `ok`'s return type is `Result<T, never>` rather than `Result<T, E>` because a successful result carries no error of any type — `never` is the type-level way of saying "this branch is impossible here," and it still unifies correctly wherever a `Result<T, E>` is expected, since `Result<T, never>` is assignable to `Result<T, E>` for any `E`. This pattern is popular in codebases that want to force callers to explicitly handle failure (the type system won't let you access `.value` without checking `.ok` first) as an alternative to `try`/`catch`, where nothing in a function's signature indicates it can throw.
