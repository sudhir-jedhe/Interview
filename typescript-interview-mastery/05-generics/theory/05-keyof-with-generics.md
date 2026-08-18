# keyof Combined with Generics for Type-Safe Property Access

`keyof T` produces a union of the literal string (or number/symbol) keys of `T`. On its own it's a useful introspection tool, but its real power shows up when it's combined with a generic type parameter to build functions that index into an object *safely* — the compiler verifies the key actually exists before you're allowed to use it.

```typescript
interface Order {
  id: number;
  total: number;
  status: "pending" | "shipped" | "delivered";
}

type OrderKey = keyof Order; // "id" | "total" | "status"
```

## The canonical pattern: `get<T, K extends keyof T>`

```typescript
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const order: Order = { id: 1, total: 59.99, status: "pending" };

const total = get(order, "total");   // number
const status = get(order, "status"); // "pending" | "shipped" | "delivered"
get(order, "customerId");            // Error: not a key of Order
```

Two things are happening simultaneously here. `K extends keyof T` constrains `key` to only the valid property names of whatever `T` turns out to be, and `T[K]` — an *indexed access type* — computes the exact type of that property. This is the difference between a function that merely "compiles" and one that's actually safe: without the constraint, `key: string` would let you pass any string, and `obj[key]` would have to be typed `any` or `unknown` because the compiler can't know which property you meant.

## Extending the pattern to a setter

```typescript
function set<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const updated = set(order, "status", "shipped"); // ok
set(order, "status", "cancelled");                // Error: not assignable to Order["status"]
set(order, "total", "59.99");                     // Error: string not assignable to number
```

Notice `value: T[K]` — the type of the value you're allowed to pass is *itself derived* from which key you picked. Pick `"status"` and `value` must be one of the three literal statuses; pick `"total"` and `value` must be a `number`. This kind of dependent typing is only possible because `K` is a genuine type parameter tied to `T` via `keyof`, not a plain `string`.

## Picking multiple keys safely

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

const summary = pick(order, ["id", "status"]); // { id: number; status: Order["status"] }
```

`pick` is effectively a hand-rolled version of TypeScript's built-in `Pick<T, K>` utility type, and walking through it is a good way to demonstrate that you understand what `Pick` does under the hood rather than treating it as magic.

## Why this matters in interviews

`get<T, K extends keyof T>(obj: T, key: K): T[K]` is close to the single most common "write this generic function" interview prompt, because it exercises three ideas at once: type parameter inference, constraints, and indexed access types. Being able to explain *why* the constraint is necessary (rejecting invalid keys at compile time) and *why* the return type is `T[K]` rather than `any` (preserving the exact property type per call site) is usually what separates a memorized answer from real understanding.
