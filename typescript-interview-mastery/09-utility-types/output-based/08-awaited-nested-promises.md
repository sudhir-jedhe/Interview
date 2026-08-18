```typescript
type Deep = Promise<Promise<Promise<number>>>;

type Unwrapped = Awaited<Deep>;

async function example(): Promise<Deep> {
  return Promise.resolve(Promise.resolve(Promise.resolve(42)));
}

async function run() {
  const value = await example();
  const doubled = value * 2; // (1)
}
```

**Answer:** `Unwrapped` is `number`, fully flattened — not `Promise<Promise<number>>` or any intermediate. Line (1) compiles fine: `value` has type `number` and `doubled` is `number`.

**Why:** `Awaited<T>` is defined recursively: `type Awaited<T> = T extends null | undefined ? T : T extends object & { then(onfulfilled: infer F): any } ? F extends (value: infer V, ...args: any) => any ? Awaited<V> : never : T`. Each layer of `infer` peels off one `Promise` wrapper and then the type alias calls itself again on the result, exactly mirroring what a real `await` does at runtime when it encounters "thenable" chains — JavaScript's `await` also keeps unwrapping until it hits a non-thenable value. This is why `Awaited` needs recursion rather than a single non-recursive conditional: a naive `T extends Promise<infer V> ? V : T` would only strip one layer, leaving `Promise<Promise<number>>` after a single `Awaited<Deep>` application, which wouldn't match how `await` actually behaves on nested promises.
