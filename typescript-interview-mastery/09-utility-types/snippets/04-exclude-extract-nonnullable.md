# Snippet: Exclude, Extract, and NonNullable narrowing a union

```typescript
// Filter a status union down to just the variants each handler cares about.

type OrderStatus = "draft" | "placed" | "shipped" | "delivered" | "cancelled" | null;

type ActiveStatus = Exclude<NonNullable<OrderStatus>, "cancelled">;
// "draft" | "placed" | "shipped" | "delivered"

type TerminalStatus = Extract<OrderStatus, "delivered" | "cancelled">;
// "delivered" | "cancelled"

function isActive(status: OrderStatus): status is ActiveStatus {
  return status !== null && status !== "cancelled";
}

function describeTerminal(status: TerminalStatus): string {
  return status === "delivered" ? "Order complete" : "Order cancelled";
}
```
