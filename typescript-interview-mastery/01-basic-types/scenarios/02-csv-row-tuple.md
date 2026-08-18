# Scenario: Modeling a parsed CSV row

You're ingesting a CSV export of orders where every row has a fixed, known column order: `orderId,customerEmail,totalCents,shippedAt`. You need a type that captures "exactly these 4 values, in this order, with these types" so that a typo like swapping columns is caught at compile time.

**Approach:** Use a labeled tuple type rather than an array type or a loosely-typed `string[]`. Tuples are the correct tool exactly when data has fixed length and positional meaning, which is precisely what a CSV row is.

```typescript
type OrderRow = [
  orderId: string,
  customerEmail: string,
  totalCents: number,
  shippedAt: string | null,
];

function parseOrderRow(rawLine: string): OrderRow {
  const [orderId, customerEmail, totalCentsRaw, shippedAtRaw] = rawLine.split(",");

  return [
    orderId,
    customerEmail,
    Number(totalCentsRaw),
    shippedAtRaw === "" ? null : shippedAtRaw,
  ];
}

function formatOrderRow([orderId, customerEmail, totalCents, shippedAt]: OrderRow): string {
  const status = shippedAt === null ? "not shipped" : `shipped ${shippedAt}`;
  return `Order ${orderId} (${customerEmail}): $${(totalCents / 100).toFixed(2)} — ${status}`;
}

const row = parseOrderRow("ORD-1001,ada@example.com,4999,2026-08-01");
console.log(formatOrderRow(row));
```

Because `OrderRow` is a tuple, the destructuring parameter list in `formatOrderRow` is guaranteed to line up correctly — if a future refactor reorders the columns in `parseOrderRow`'s return, every consumer that destructures `OrderRow` gets a compile error at the mismatched type rather than silently reading `customerEmail` where `totalCents` was expected. If the CSV column set could grow or shrink dynamically, a tuple would be the wrong choice — you'd want an object type with named keys instead, since tuples are best for a small, stable, positionally-meaningful set of fields.
