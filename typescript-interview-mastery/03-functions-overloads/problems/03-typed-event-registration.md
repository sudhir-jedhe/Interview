# Problem: Type-safe event-handler registration keyed by event name

## Problem statement

Implement a small typed event bus with an `on(eventName, handler)` registration function and an `emit(eventName, payload)` dispatch function, where the `handler`'s argument type (for `on`) and the required `payload` type (for `emit`) are both automatically inferred from the specific event-name string literal passed — no manual casting anywhere.

## Requirements

- Define an `EventMap` interface mapping event-name string keys to payload types.
- `on<K extends keyof EventMap>(eventName: K, handler: (payload: EventMap[K]) => void): void`
- `emit<K extends keyof EventMap>(eventName: K, payload: EventMap[K]): void`
- Calling `emit` should invoke every handler registered for that event name with the payload.
- Must compile under `strict: true`, with zero use of `any` in the public API.

## Solution

```typescript
interface OrderPlacedPayload {
  orderId: string;
  totalCents: number;
}

interface UserSignedUpPayload {
  userId: number;
  email: string;
}

interface EventMap {
  "order:placed": OrderPlacedPayload;
  "user:signedUp": UserSignedUpPayload;
}

type Handler<K extends keyof EventMap> = (payload: EventMap[K]) => void;

class TypedEventBus {
  private handlers: { [K in keyof EventMap]?: Array<Handler<K>> } = {};

  on<K extends keyof EventMap>(eventName: K, handler: Handler<K>): void {
    const existing = this.handlers[eventName] ?? [];
    existing.push(handler);
    this.handlers[eventName] = existing;
  }

  emit<K extends keyof EventMap>(eventName: K, payload: EventMap[K]): void {
    const registered = this.handlers[eventName];
    registered?.forEach((handler) => handler(payload));
  }
}

const bus = new TypedEventBus();

bus.on("order:placed", (payload) => {
  // payload inferred as OrderPlacedPayload — full autocomplete
  console.log(`Order ${payload.orderId}: $${(payload.totalCents / 100).toFixed(2)}`);
});

bus.emit("order:placed", { orderId: "ORD-1", totalCents: 4999 });

// bus.emit("order:placed", { userId: 1, email: "x@example.com" }); // Error: wrong payload shape
// bus.on("unknown:event", () => {}); // Error: not assignable to keyof EventMap
```

### Why this is the correct approach

`K extends keyof EventMap` is the generic mechanism that ties `eventName`'s literal value to a specific lookup `EventMap[K]`, so both `on` and `emit` get a *different, correctly-typed* payload signature depending on which event name literal was actually passed at the call site — the same generic-lookup pattern from `scenarios/03-event-handler-registration.md`, extended here into a full bidirectional (register + dispatch) API where TypeScript also guarantees `emit`'s payload argument matches exactly what `on`'s registered handlers expect, since both derive from the same `EventMap[K]` lookup. The internal `handlers` storage type, `{ [K in keyof EventMap]?: Array<Handler<K>> }`, is a mapped type ensuring the handler array for each event key is specifically typed to that key's handler signature, not a loosely-typed catch-all array.
