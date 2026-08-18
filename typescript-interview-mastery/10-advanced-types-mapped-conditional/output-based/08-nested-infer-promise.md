```typescript
type UnwrapOnce<T> = T extends Promise<infer V> ? V : T;

type A = UnwrapOnce<Promise<Promise<string>>>;

async function loadUser(): Promise<Promise<{ id: string }>> {
  return Promise.resolve({ id: "u1" }) as any;
}

async function run() {
  const result = await loadUser();
  const id = result.id; // (1)
}
```

**Answer:** `A` is `Promise<string>`, NOT `string` — only one layer is stripped. Line (1) compiles fine and `result` has type `{ id: string }`, fully unwrapped — `await` at runtime (and in TypeScript's control-flow typing for `await`) keeps unwrapping nested thenables until it hits a non-promise value, unlike `UnwrapOnce`.

**Why:** `UnwrapOnce` matches `Promise<infer V>` exactly once: for `Promise<Promise<string>>`, `V` is inferred as `Promise<string>` (whatever sits directly inside the outer `Promise<...>`), and the conditional returns that `V` as-is without checking whether it's itself another promise. Real `await` semantics, and TypeScript's built-in `Awaited<T>`, are recursive — they call themselves again on the inferred value until it's no longer thenable. This mismatch between a naive single-layer unwrap and real recursive-await behavior is precisely the motivation for the `UnwrapPromise<T>` problem at the end of this topic: a correct implementation must recurse.
