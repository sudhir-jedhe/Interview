# Scenario: Parsing an Untyped API Response

Your app calls `fetch("/api/orders/123")` and gets back `unknown`-shaped JSON. A previous engineer wrote `const order = (await res.json()) as Order;` everywhere this pattern occurs, and the team has been seeing intermittent `Cannot read properties of undefined` crashes in production whenever the backend omits an optional field or the API contract silently changes.

**Approach:**

The root problem is that `as Order` is an unchecked assertion — it makes the compiler happy without verifying the actual JSON matches `Order` at runtime. The fix is to validate at the boundary where untyped data enters the system, and only assert (or better, let inference do the work) after validation succeeds.

```typescript
interface Order {
  id: string;
  total: number;
  items: { sku: string; qty: number }[];
}

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.total === "number" &&
    Array.isArray(v.items) &&
    v.items.every(
      (i) =>
        typeof i === "object" &&
        i !== null &&
        typeof (i as Record<string, unknown>).sku === "string" &&
        typeof (i as Record<string, unknown>).qty === "number"
    )
  );
}

async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);
  const data: unknown = await res.json();

  if (!isOrder(data)) {
    throw new Error(`Malformed order response for id=${id}`);
  }

  return data; // narrowed to Order by the type guard, no assertion needed
}
```

The single `value as Record<string, unknown>` inside `isOrder` is the *only* assertion in the whole flow, and it's a safe, narrow one — it's just widening `unknown` to something indexable so we can check property types, not claiming the full `Order` shape yet. Everywhere else, `data` is proven to be an `Order` through actual runtime checks, and TypeScript's control-flow narrowing takes it from there via the `value is Order` type predicate.

For larger schemas, the same approach scales better with a validation library (`zod`, `io-ts`, or similar) that derives both the runtime check and the static type from one schema definition, eliminating the risk of the guard and the interface silently drifting apart as fields are added. The key lesson for this scenario: an assertion should be the *last* step after validation, never a substitute for it.
