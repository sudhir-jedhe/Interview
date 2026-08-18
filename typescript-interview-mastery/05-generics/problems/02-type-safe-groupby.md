# Implement a type-safe groupBy&lt;T, K extends keyof T&gt;

## Problem

Implement `groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]>` that groups an array of objects by the value at a given property, chosen by key name (not by an arbitrary callback), so the compiler rejects a key that doesn't exist on `T`.

## Solution

```typescript
function groupBy<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (const item of items) {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }

  return result;
}
```

## Usage

```typescript
interface Order {
  id: number;
  status: "pending" | "shipped" | "delivered";
  region: "us" | "eu" | "apac";
}

const orders: Order[] = [
  { id: 1, status: "pending", region: "us" },
  { id: 2, status: "shipped", region: "eu" },
  { id: 3, status: "pending", region: "us" },
];

const byStatus = groupBy(orders, "status");
// { pending: [order1, order3], shipped: [order2] }

const byRegion = groupBy(orders, "region");
// { us: [...], eu: [...] }

groupBy(orders, "customerName"); // Error: not a key of Order
```

## Discussion

`String(item[key])` is necessary because object keys in JavaScript (and hence `Record<string, T[]>`) are always strings — grouping by a `number` or boolean-valued property still needs its value stringified to become a valid key. The `K extends keyof T` constraint is what rejects `groupBy(orders, "customerName")` at compile time instead of silently producing an empty group at runtime. A stricter version could return `Partial<Record<T[K] extends PropertyKey ? T[K] : string, T[]>>` to preserve the literal value types as keys rather than collapsing everything to `Record<string, T[]>`, at the cost of a noticeably more complex signature — a reasonable trade to discuss but usually overkill for everyday code.
