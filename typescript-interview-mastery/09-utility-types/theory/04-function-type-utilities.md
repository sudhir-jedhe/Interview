# ReturnType\<T\>, Parameters\<T\>, Awaited\<T\>

These three extract type information *from function and promise types* rather than object types. They're essential when you need to stay in sync with a function's signature without re-declaring it.

## `ReturnType<T>`

`ReturnType<T>` extracts the return type of a function type `T`. It's invaluable when the function's return type is complex or inferred (not explicitly annotated), and you want a named type for it elsewhere.

```typescript
function buildQuery(table: string, filters: Record<string, string>) {
  return {
    sql: `SELECT * FROM ${table} WHERE ...`,
    params: Object.values(filters),
    executedAt: new Date(),
  };
}

type Query = ReturnType<typeof buildQuery>;
// { sql: string; params: string[]; executedAt: Date }

function logQuery(query: Query): void {
  console.log(query.sql, query.params);
}
```

Note the `typeof buildQuery` — `ReturnType` takes a *function type*, not a function value, so you use `typeof` to convert a runtime function into its type before extracting.

## `Parameters<T>`

`Parameters<T>` extracts a function type's parameter list as a tuple type. This is the tool of choice for wrapper/decorator functions that need to accept "whatever arguments the original function accepts" without duplicating the parameter list.

```typescript
function fetchUser(id: string, options: { includeDeleted: boolean }) {
  /* ... */
}

type FetchUserArgs = Parameters<typeof fetchUser>;
// [id: string, options: { includeDeleted: boolean }]

function withLogging(fn: typeof fetchUser) {
  return (...args: Parameters<typeof fetchUser>): ReturnType<typeof fetchUser> => {
    console.log("calling with", args);
    return fn(...args);
  };
}
```

If `fetchUser`'s signature changes — a parameter is added, renamed, or retyped — `withLogging` updates automatically, with zero edits, because it never re-declared the signature by hand.

## `Awaited<T>`

`Awaited<T>` unwraps the value a `Promise` (or thenable) resolves to, including nested promises (`Promise<Promise<T>>` unwraps all the way down to `T`, matching real `await` semantics). It's most useful for typing the result of `async` functions, especially generic ones.

```typescript
async function fetchJson(url: string): Promise<{ status: number; body: unknown }> {
  const res = await fetch(url);
  return { status: res.status, body: await res.json() };
}

type FetchJsonResult = Awaited<ReturnType<typeof fetchJson>>;
// { status: number; body: unknown } — NOT Promise<{...}>
```

Combining `ReturnType` with `Awaited` is a very common pattern: `ReturnType<typeof asyncFn>` gives you `Promise<X>`, and wrapping it in `Awaited<...>` gives you the actual resolved `X` — exactly what you get on the other side of an `await`.

## Implementation sketch

```typescript
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

type MyParameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;

type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;
```

All three use `infer` inside a conditional type to "capture" a piece of the function or promise signature into a new type variable. `ReturnType` infers the return position, `Parameters` infers the parameter tuple, and `Awaited` recursively infers the resolved value, calling itself again in case the resolved value is itself a promise. `infer` and conditional types are the subject of topic 10.
