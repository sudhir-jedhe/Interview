# Problem: Pub/Sub Using a Map and Symbols as Unique Event Keys

**Goal:** Implement a simple publish/subscribe system where event "names" are `Symbol`s, guaranteeing that two different parts of a codebase can never accidentally collide on the same event even if they pick the same human-readable description.

## Implementation

```js
class EventBus {
  #listeners = new Map(); // Symbol -> Set of callback functions

  subscribe(eventSymbol, callback) {
    if (!this.#listeners.has(eventSymbol)) {
      this.#listeners.set(eventSymbol, new Set());
    }
    this.#listeners.get(eventSymbol).add(callback);
    // return an unsubscribe function — a common, ergonomic pub/sub convention
    return () => this.#listeners.get(eventSymbol)?.delete(callback);
  }

  publish(eventSymbol, payload) {
    const callbacks = this.#listeners.get(eventSymbol);
    if (!callbacks) return;
    for (const callback of callbacks) callback(payload);
  }
}
```

## Usage — Symbols prevent event-name collisions

```js
const bus = new EventBus();

// Two independent modules define their own event, both happen to be named "update"
const USER_UPDATED = Symbol('update');
const CART_UPDATED = Symbol('update');

bus.subscribe(USER_UPDATED, (user) => console.log('user changed:', user.name));
bus.subscribe(CART_UPDATED, (cart) => console.log('cart changed, total:', cart.total));

bus.publish(USER_UPDATED, { name: 'Ada' });
// user changed: Ada
bus.publish(CART_UPDATED, { total: 42 });
// cart changed, total: 42
```

Even though `USER_UPDATED` and `CART_UPDATED` share the identical description `'update'`, they're distinct `Symbol` values, so `Map`'s key comparison (identity-based) correctly keeps their listener sets separate — a string-keyed event bus (`'update'`) would have silently merged these two unrelated event streams.

## Unsubscribing

```js
const unsubscribe = bus.subscribe(USER_UPDATED, (user) => console.log('logging:', user.name));
unsubscribe(); // this specific listener is removed; others on USER_UPDATED remain
bus.publish(USER_UPDATED, { name: 'Grace' });
// (only the first, still-subscribed listener logs — the "logging:" one is gone)
```

Using a `Set` per event (rather than an array) means duplicate registrations of the exact same callback are automatically collapsed, and removal via `unsubscribe()` is an O(1) `Set.delete` rather than an array `splice`/`indexOf` scan.
