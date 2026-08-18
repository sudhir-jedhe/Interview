# Default Generic Parameters and Multiple Type Parameters

Type parameters can have default values, just like function parameters, using the `<T = DefaultType>` syntax. This lets callers omit the type argument entirely and fall back to a sensible default, while still allowing full overrides when needed.

```typescript
interface FetchOptions<TResponse = unknown> {
  url: string;
  parse: (raw: string) => TResponse;
}

function fetchAndParse<TResponse = unknown>(
  options: FetchOptions<TResponse>
): TResponse {
  // simplified — imagine an actual fetch happens here
  return options.parse("{}") as TResponse;
}

interface Product {
  id: number;
  price: number;
}

// Explicit type argument
const product = fetchAndParse<Product>({
  url: "/products/1",
  parse: (raw) => JSON.parse(raw) as Product,
});

// No type argument supplied — TResponse falls back to `unknown`
// (though here it's actually inferred from `parse`'s return type instead,
// since inference takes priority over the default when possible)
```

Defaults are most valuable on types you construct manually (interfaces, classes) rather than functions, because functions usually have enough inference sources that a default rarely kicks in — for a class or interface with no obvious inference source, a default avoids forcing every caller to write `SomeType<unknown>` just to get a sane fallback.

```typescript
class EventEmitter<TPayload = void> {
  private listeners: Array<(payload: TPayload) => void> = [];

  on(listener: (payload: TPayload) => void): void {
    this.listeners.push(listener);
  }

  emit(payload: TPayload): void {
    this.listeners.forEach((l) => l(payload));
  }
}

const clickEmitter = new EventEmitter<{ x: number; y: number }>();
const tickEmitter = new EventEmitter(); // TPayload defaults to void
```

## Ordering and constraints on defaults

Type parameters with defaults must come after ones without defaults, mirroring how optional function parameters must trail required ones. Defaults can also reference earlier type parameters, which is useful for "second type defaults to the first" patterns.

```typescript
interface Result<T, E = Error> {
  ok: boolean;
  value?: T;
  error?: E;
}

// E defaults to Error unless overridden
const parsed: Result<number> = { ok: true, value: 42 };
const failed: Result<number, string> = { ok: false, error: "parse failed" };
```

## Multiple type parameters in practice

When a type or function genuinely varies along more than one independent axis, use multiple type parameters rather than trying to encode both concerns into one. A classic example is a key-value transformation utility.

```typescript
function mapValues<TObj extends Record<string, unknown>, TResult>(
  obj: TObj,
  fn: (value: TObj[keyof TObj]) => TResult
): Record<keyof TObj, TResult> {
  const result = {} as Record<keyof TObj, TResult>;
  for (const key in obj) {
    result[key] = fn(obj[key]);
  }
  return result;
}

const prices = { apple: 1.5, banana: 0.5 };
const formatted = mapValues(prices, (n) => `$${n.toFixed(2)}`);
// formatted: Record<"apple" | "banana", string>
```

## Why this matters in interviews

Default type parameters signal that you know generics are a full type-level language with their own defaulting and ordering rules, not just angle-bracket decoration. A frequent follow-up question is "why can't a defaulted type parameter appear before a non-defaulted one" — the answer mirrors default function parameters: the compiler resolves positional arguments left to right, and an ambiguous gap in the middle would break that.
