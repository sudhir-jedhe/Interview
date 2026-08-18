# Problem 2: Implement UnwrapPromise\<T\> with infer

## Task

Implement `UnwrapPromise<T>`, a conditional type using `infer` that extracts the fully-resolved value type from `T`, matching real `await` semantics:

Requirements:
1. If `T` is `Promise<V>`, resolve to `V`.
2. If `V` is itself a `Promise`, keep unwrapping until you reach a non-promise value (arbitrary nesting depth).
3. If `T` is not a `Promise` at all, resolve to `T` unchanged.
4. Verify it against a plain value, a single-wrapped promise, and a triple-nested promise.

## Solution

```typescript
type UnwrapPromise<T> = T extends Promise<infer V> ? UnwrapPromise<V> : T;

// --- Verification ---

type A = UnwrapPromise<string>;                            // string
type B = UnwrapPromise<Promise<number>>;                   // number
type C = UnwrapPromise<Promise<Promise<Promise<boolean>>>>; // boolean

async function fetchNestedPromise(): Promise<Promise<{ id: string }>> {
  return Promise.resolve({ id: "u1" }) as any;
}

type FetchResult = UnwrapPromise<ReturnType<typeof fetchNestedPromise>>;
// { id: string } — fully flattened, matching what `await fetchNestedPromise()` actually yields
```

**Why this works:** `T extends Promise<infer V>` structurally matches `T` against the shape "a Promise wrapping something," capturing that something as `V`. The key design decision is the recursive call `UnwrapPromise<V>` in the true branch instead of just returning `V` directly — each time the pattern matches, the type alias re-invokes itself on the newly-captured inner type, so a triple-nested promise gets unwrapped three times, once per recursive step, until `V` is finally something that doesn't match `Promise<infer V>` anymore and falls through to the `: T` base case. This mirrors what a JavaScript `await` actually does at runtime: it doesn't just unwrap one layer, it keeps resolving thenables until it hits a non-thenable value — which is exactly why TypeScript's real built-in `Awaited<T>` utility (introduced in TS 4.5) is defined recursively rather than as a single-layer conditional.

**Edge case worth knowing:** the real `Awaited<T>` in the standard library is more defensive than this — it also handles arbitrary "thenable" objects (anything with a `.then()` method, not just the `Promise` class specifically) and guards against a `then` method that never resolves. For interview purposes, the recursive `Promise<infer V>` pattern above captures the core mechanism correctly.
