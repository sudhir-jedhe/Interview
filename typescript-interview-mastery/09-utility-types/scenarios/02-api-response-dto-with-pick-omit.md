# Scenario: Shaping API Response DTOs from a Database Model

Your ORM model for `Order` includes internal-only columns (soft-delete flags, audit timestamps, foreign key IDs meant for joins) that shouldn't appear verbatim in the JSON your REST API returns. You need two DTOs: a list view (compact) and a detail view (fuller, still curated).

```typescript
interface OrderRecord {
  id: string;
  customerId: string;
  totalCents: number;
  currency: string;
  lineItems: { sku: string; qty: number; priceCents: number }[];
  status: "pending" | "paid" | "shipped" | "cancelled";
  internalRiskScore: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Approach:** Use `Pick` for the list DTO (small, explicit surface) and `Omit` for the detail DTO (mostly everything, minus a short blocklist of internal-only fields) — the same allowlist-vs-blocklist trade-off from the public-profile scenario, but applied per endpoint based on how much of the model each endpoint should expose.

```typescript
type OrderListItemDTO = Pick<OrderRecord, "id" | "totalCents" | "currency" | "status">;

type OrderDetailDTO = Omit<OrderRecord, "internalRiskScore" | "deletedAt" | "customerId">;

function toListItem(order: OrderRecord): OrderListItemDTO {
  const { id, totalCents, currency, status } = order;
  return { id, totalCents, currency, status };
}

function toDetail(order: OrderRecord): OrderDetailDTO {
  const { internalRiskScore, deletedAt, customerId, ...rest } = order;
  return rest;
}
```

The list endpoint deliberately doesn't need `Omit` — it only needs four fields, so an explicit `Pick` is both shorter and safer. The detail endpoint needs most of the record, so blocklisting the three internal fields with `Omit` is far less verbose than allowlisting the other seven.

To avoid the two DTOs drifting apart when `OrderRecord` changes, add a lightweight compile-time check that both DTOs remain subsets of the record with no overlap on the blocked fields:

```typescript
type _NoLeakInList = Extract<keyof OrderListItemDTO, "internalRiskScore" | "deletedAt">; // should be `never`
type _NoLeakInDetail = Extract<keyof OrderDetailDTO, "internalRiskScore" | "deletedAt">; // should be `never`
```

If either alias resolves to something other than `never`, a sensitive field snuck into a response DTO — worth wiring into a type-level test file that CI runs through `tsc --noEmit`.
