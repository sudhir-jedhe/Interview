# Problem 1: Write an Ambient Declaration for an Untyped Library

## Task

The following untyped JS library, `tiny-emitter`, is installed as a dependency but ships no types and has no `@types/tiny-emitter` package available:

```javascript
// node_modules/tiny-emitter/index.js
function createEmitter() {
  const listeners = {};
  return {
    on(event, callback) {
      (listeners[event] ||= []).push(callback);
    },
    emit(event, ...args) {
      (listeners[event] || []).forEach((cb) => cb(...args));
    },
    off(event, callback) {
      listeners[event] = (listeners[event] || []).filter((cb) => cb !== callback);
    },
  };
}
module.exports = { createEmitter };
```

Write a `.d.ts` file so this library can be imported with full type safety, including generic event-payload typing so `on`/`emit` for a given event name agree on the payload's shape.

## Solution

```typescript
// types/tiny-emitter.d.ts
declare module "tiny-emitter" {
  export interface Emitter<Events extends Record<string, unknown[]>> {
    on<E extends keyof Events>(event: E, callback: (...args: Events[E]) => void): void;
    emit<E extends keyof Events>(event: E, ...args: Events[E]): void;
    off<E extends keyof Events>(event: E, callback: (...args: Events[E]) => void): void;
  }

  export function createEmitter<Events extends Record<string, unknown[]>>(): Emitter<Events>;
}
```

```typescript
// usage.ts
import { createEmitter } from "tiny-emitter";

interface OrderEvents {
  placed: [orderId: string, totalCents: number];
  cancelled: [orderId: string, reason: string];
}

const emitter = createEmitter<OrderEvents>();

emitter.on("placed", (orderId, totalCents) => {
  console.log(`Order ${orderId} placed for $${(totalCents / 100).toFixed(2)}`);
});

emitter.emit("placed", "ord_1", 4999); // typed correctly
// emitter.emit("placed", "ord_1", "not a number"); // Error: wrong payload type
// emitter.emit("shipped", "ord_1");                // Error: "shipped" isn't in OrderEvents
```

**Why this works:** The declared `createEmitter<Events>` is generic over an event-name-to-payload-tuple map (`Record<string, unknown[]>`), and `Emitter<Events>`'s `on`/`emit`/`off` methods are each generic over `E extends keyof Events`, using `Events[E]` (indexed access into the map) to derive the correct argument tuple for whichever event name is passed. This means the ambient declaration doesn't just describe the library's *shape* generically — it lets each consumer supply their own concrete event map (`OrderEvents` here) and get fully checked, per-event payload types, catching both wrong-payload and unknown-event-name mistakes at compile time, despite the underlying JS implementation having no type information at all.
