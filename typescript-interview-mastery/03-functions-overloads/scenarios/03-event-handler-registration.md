# Scenario: Registering event handlers where the handler's argument type depends on the event name

You're building a small internal event bus. Callers register handlers with `on(eventName, handler)`, and each event name has its own distinct payload shape — a `"user:created"` event carries a `User`, an `"order:placed"` event carries an `Order`. You want `handler`'s parameter type to be inferred automatically from the `eventName` string literal, with no manual casting at the call site.

**Approach:** Define an event map interface (event name -> payload type), then make `on`'s `handler` parameter type a lookup into that map using a generic key constrained to the map's keys — `EventMap[K]` — so TypeScript infers the correct payload type purely from which literal was passed as `eventName`.

```typescript
interface User {
  id: number;
  email: string;
}

interface Order {
  id: string;
  totalCents: number;
}

interface EventMap {
  "user:created": User;
  "order:placed": Order;
  "session:expired": { userId: number };
}

function on<K extends keyof EventMap>(
  eventName: K,
  handler: (payload: EventMap[K]) => void,
): void {
  // (a real implementation would register `handler` in a listener registry keyed by eventName)
  console.log(`Registered handler for "${eventName}"`);
}

on("user:created", (payload) => {
  // payload is inferred as `User` — full autocomplete on .id / .email
  console.log(`New user: ${payload.email}`);
});

on("order:placed", (payload) => {
  // payload is inferred as `Order`
  console.log(`Order ${payload.id}: $${(payload.totalCents / 100).toFixed(2)}`);
});

// on("user:created", (payload: Order) => {}); // Error: Order isn't assignable to the (payload: User) parameter expected
// on("unknown:event", () => {});               // Error: Argument of type '"unknown:event"' is not assignable to keyof EventMap
```

The generic `K extends keyof EventMap` is the mechanism: TypeScript infers `K` from the literal string passed as `eventName`, then uses that exact `K` to look up `EventMap[K]` for the expected `handler` parameter type — so `"user:created"` and `"order:placed"` each drive a *different*, correctly-typed `handler` signature from the same `on` function, with zero casts and a compile error for both unknown event names and mismatched handler payload types. This pattern (a lookup-map keyed by a literal string parameter) generalizes to any "dispatch by string tag" API: Redux action creators, DOM-like custom event systems, and RPC method routers all use the same shape.
