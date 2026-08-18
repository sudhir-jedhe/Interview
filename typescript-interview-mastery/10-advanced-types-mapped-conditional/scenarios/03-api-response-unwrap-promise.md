# Scenario: Typing a Generic Data-Fetching Hook's Resolved Value

You're writing a `useAsyncData` hook that accepts any async function (an API call, a database query, a file read) and needs to expose the *resolved* value's type to the component using it — not the `Promise<...>` wrapper type, and correctly, even if the async function's return type happens to itself resolve to another promise-like value.

```typescript
async function fetchOrder(orderId: string): Promise<{ id: string; total: number }> {
  const res = await fetch(`/api/orders/${orderId}`);
  return res.json();
}
```

**Approach:** Build a custom `UnwrapPromise<T>` conditional type with `infer`, recursive so it handles arbitrarily nested thenables, and combine it with `ReturnType` so the hook works for *any* async function passed in, not just `fetchOrder`.

```typescript
type UnwrapPromise<T> = T extends Promise<infer V> ? UnwrapPromise<V> : T;

function useAsyncData<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  ...args: Parameters<F>
): { data: UnwrapPromise<ReturnType<F>> | null; loading: boolean } {
  // simplified — real implementation would useState/useEffect
  return { data: null, loading: true };
}

const { data } = useAsyncData(fetchOrder, "order_123");
// data: { id: string; total: number } | null — NOT Promise<{...}> | null
```

Why recursion matters here specifically: `ReturnType<F>` gives you `Promise<{ id: string; total: number }>` directly for `fetchOrder`, and a single-layer unwrap would suffice for this one case. But `useAsyncData` is generic — it has to handle *any* async function a consumer passes in, including ones that might resolve to another promise (a real if unusual pattern, e.g. a function that returns `Promise.resolve(anotherAsyncCall())` without awaiting internally). A non-recursive unwrap would leave `data` typed as `Promise<X> | null` in that edge case, which is wrong and would surface as a confusing type error deep in a component that tries to use `data` as if it were already resolved. Building `UnwrapPromise` to match real `await` semantics (recurse until non-thenable) removes this entire class of edge-case bugs for every consumer of the hook, not just the ones who happen to test the nested case.
