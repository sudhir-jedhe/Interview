# Modeling an order status state machine with valid transitions

You're building the backend for an e-commerce order system. Orders move through a fixed set of statuses (`pending → paid → shipped → delivered`, with `cancelled` reachable from `pending` or `paid` only), and the API needs to reject invalid transitions (e.g., going straight from `pending` to `delivered`) at the point a status change is requested, with the status values also serialized directly into JSON API responses.

**Approach:** Use a literal union rather than an enum for the status type itself, since the values need to travel directly through JSON with no import/conversion friction on either the frontend or backend, and model valid transitions as a `Record` keyed by the current status, which — as a side effect — forces you to account for every status when the union is extended later.

```typescript
type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

class InvalidTransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Cannot transition order from "${from}" to "${to}"`);
  }
}

function transition(current: OrderStatus, next: OrderStatus): OrderStatus {
  if (!VALID_TRANSITIONS[current].includes(next)) {
    throw new InvalidTransitionError(current, next);
  }
  return next;
}

transition("pending", "paid");     // "paid"
transition("pending", "delivered"); // throws InvalidTransitionError
```

The `Record<OrderStatus, OrderStatus[]>` type on `VALID_TRANSITIONS` is doing real work here: if a future engineer adds `"refunded"` to the `OrderStatus` union without updating `VALID_TRANSITIONS`, the object literal fails to compile immediately, at the exact declaration site, rather than shipping a state machine that silently treats the new status as having no valid transitions at all (which is what would happen if `VALID_TRANSITIONS` were typed loosely as `Record<string, OrderStatus[]>` instead). Choosing a literal union over an enum here specifically avoids two friction points that would otherwise show up constantly: API responses containing `"pending"` as a raw string would need casting to satisfy an enum-typed field, and the frontend (a separate codebase, in a typical setup) would need to import the same enum definition just to compare against it, whereas a literal union's values are just ordinary strings everywhere.
