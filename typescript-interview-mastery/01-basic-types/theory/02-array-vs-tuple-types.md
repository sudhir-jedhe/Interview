# Array Types vs Tuple Types

Arrays and tuples both compile to plain JavaScript arrays at runtime, but TypeScript tracks very different information about their shape at the type level. Understanding when to reach for each is a core "do you actually model data correctly" interview signal.

## Array types: T[] vs Array<T>

`T[]` and `Array<T>` are 100% equivalent — the former is syntactic sugar for the latter. Both describe an array of unknown length where every element has the same type.

```typescript
const skus: string[] = ["SKU-001", "SKU-002"];
const prices: Array<number> = [19.99, 24.5];

// Equivalent for generics and unions too
const rows: Array<{ id: number; qty: number }> = [];
const mixed: (string | number)[] = ["A1", 1, "B2"];
```

Style guides differ on which to prefer. `T[]` reads cleaner for simple element types; `Array<T>` is sometimes preferred for complex unions or when consistency with other generic syntax (`Map<K, V>`, `Promise<T>`) matters. Functionally there is no difference — the compiler emits identical types either way.

## readonly arrays

Prevent mutation of the array reference itself:

```typescript
const roles: readonly string[] = ["admin", "editor"];
// roles.push("viewer"); // Error: Property 'push' does not exist on type 'readonly string[]'

// Equivalent alternate syntax
const roles2: ReadonlyArray<string> = ["admin", "editor"];
```

## Tuple types: fixed length, fixed position

A tuple is an array where TypeScript pins down the type of *each position* and the *exact length*. Use tuples when order and position carry meaning — coordinates, key-value pairs, or fixed-format rows.

```typescript
type Coordinate = [x: number, y: number];
const origin: Coordinate = [0, 0];

// Named tuple members (labels) improve editor hints without changing runtime behavior
type HttpResult = [status: number, body: string];

function logResult([status, body]: HttpResult): void {
  console.log(`${status}: ${body}`);
}
```

Unlike a same-shaped array type (`(number | string)[]`), a tuple enforces both count and per-slot type:

```typescript
let pair: [string, number] = ["age", 30];
// pair = [30, "age"];       // Error: types are swapped
// pair = ["age", 30, true]; // Error: Source has 3 element(s) but target allows only 2
```

## Optional and rest elements in tuples

Tuples support `?` for optional trailing elements and `...T[]` for a variable-length rest segment, letting you model "at least N, optionally more" shapes precisely.

```typescript
// Optional element: length is 1 or 2
type NameParts = [first: string, last?: string];
const full: NameParts = ["Ada", "Lovelace"];
const single: NameParts = ["Cher"];

// Rest element: at least 2 fixed, then any number of extras
type LogEntry = [level: "info" | "warn" | "error", message: string, ...meta: unknown[]];
const entry: LogEntry = ["error", "Payment failed", { orderId: 42 }, { retry: true }];

// Rest can also appear for leading/middle segments as of TS 4.0+, though trailing is most common
type Padded = [first: number, ...rest: string[], last: boolean];
```

## When to choose which

Reach for a tuple when the position of each element has distinct, fixed semantics (a `[lat, lng]` pair, a `useState()`-style `[value, setValue]` return, a parsed CSV row). Reach for an array when you have a homogeneous, arbitrary-length collection (a list of `User` objects, a list of tag strings). Mixing them up — using an array type for positional data — throws away the compiler's ability to catch swapped or missing values.
