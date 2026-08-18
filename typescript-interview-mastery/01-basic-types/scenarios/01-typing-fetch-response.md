# Scenario: Typing a `fetch` JSON response

You're calling an internal API endpoint `/api/products/:id` and need to consume the JSON body safely. The endpoint's shape is documented but the raw response is untyped at the network boundary — `fetch(...).json()` returns `Promise<any>` in the standard lib types.

**Approach:** Never trust `.json()`'s `any` return directly. Type the expected shape, accept the raw parse result as `unknown`, and validate/narrow it into that shape with a type guard before using it anywhere else in the app. This turns a potential runtime `undefined is not a function` crash into a caught, handled error at the API boundary.

```typescript
interface Product {
  id: number;
  name: string;
  priceCents: number;
  inStock: boolean;
}

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Product).id === "number" &&
    typeof (value as Product).name === "string" &&
    typeof (value as Product).priceCents === "number" &&
    typeof (value as Product).inStock === "boolean"
  );
}

async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Explicitly widen `.json()`'s implicit `any` back to `unknown` at the boundary
  const data: unknown = await response.json();

  if (!isProduct(data)) {
    throw new Error("Unexpected product shape from API");
  }

  return data; // now safely typed as `Product` for every caller
}

const product = await fetchProduct(42);
console.log(product.name.toUpperCase()); // safe — TS knows `name` is a string
```

The key decision here is treating `.json()`'s result as `unknown` even though TypeScript's lib types let you get away with `any` — casting it to `unknown` first (or annotating the variable as `unknown`) is what forces the `isProduct` guard to actually run before any property access, closing the gap between "the API contract on paper" and "what the compiler will actually verify."
