# Problem: Namespaced Pub/Sub Message Bus with Wildcard Subscriptions

## Problem Statement

Build a `MessageBus` on top of Node's `EventEmitter` that supports dot-namespaced event names (e.g. `'user.created'`, `'user.deleted'`, `'order.created'`) and wildcard-ish subscriptions using a trailing `*` (e.g. subscribing to `'user.*'` receives every `user.` event, and subscribing to `'*'` receives everything).

## Requirements

- `bus.publish(topic, payload)` — publishes an exact topic (e.g. `'user.created'`). Topics themselves are never wildcards, only subscriptions can be.
- `bus.subscribe(pattern, handler)` — pattern can be an exact topic (`'user.created'`), a namespace wildcard (`'user.*'`, matching any topic starting with `user.`), or the global wildcard (`'*'`, matching everything). Returns an unsubscribe function.
- A single `publish` call must invoke every matching subscriber exactly once, regardless of how many patterns match (an exact match, a wildcard match, and the global wildcard should all fire independently, but each handler fires once).
- Must not use a real regex-based general glob — just the simple `prefix.*` / exact / `*` cases described above, kept efficient with plain string operations.

## Approach

Use one internal `EventEmitter` per exact topic namespace is unnecessary complexity — instead, keep a single internal `EventEmitter` and always `emit` the exact topic, but *also* walk the topic's namespace segments and emit a synthetic wildcard event per segment level. `'user.created'` publishes internally as `'user.created'` and `'user.*'`, plus the global `'*'`. Subscribers just call `.on()` on the internal emitter with the literal pattern they want, so matching is delegated entirely to the underlying EventEmitter's exact-name matching — no runtime pattern parsing needed.

## Solution

```js
const { EventEmitter } = require('events');

class MessageBus {
  #emitter = new EventEmitter();

  constructor() {
    // A namespaced bus can legitimately have many independent listeners
    // (many services subscribing to '*' or to their own namespace).
    this.#emitter.setMaxListeners(50);
    this.#emitter.on('error', (err) => {
      // Never let a subscriber's error crash the whole bus / process.
      console.error('MessageBus subscriber error:', err);
    });
  }

  publish(topic, payload) {
    if (topic.includes('*')) {
      throw new Error('publish() topics must be exact, not wildcards');
    }

    const envelope = { topic, payload };

    // Exact topic listeners.
    this.#emitter.emit(topic, envelope);

    // Namespace wildcard listeners: 'user.created' -> also notify 'user.*'.
    const namespace = topic.split('.')[0];
    if (namespace !== topic) {
      this.#emitter.emit(`${namespace}.*`, envelope);
    }

    // Global wildcard listeners.
    this.#emitter.emit('*', envelope);
  }

  subscribe(pattern, handler) {
    const wrapped = (envelope) => {
      try {
        handler(envelope.payload, envelope.topic);
      } catch (err) {
        this.#emitter.emit('error', err);
      }
    };
    this.#emitter.on(pattern, wrapped);
    return () => this.#emitter.off(pattern, wrapped);
  }
}

module.exports = { MessageBus };

// --- verification ---
const bus = new MessageBus();
const seen = [];

bus.subscribe('user.created', (payload) => seen.push(['exact', payload.id]));
bus.subscribe('user.*', (payload, topic) => seen.push(['namespace', topic, payload.id]));
bus.subscribe('*', (payload, topic) => seen.push(['global', topic]));

bus.publish('user.created', { id: 1 });
bus.publish('order.created', { id: 2 });

console.log(seen);
// [
//   [ 'exact', 1 ],
//   [ 'namespace', 'user.created', 1 ],
//   [ 'global', 'user.created' ],
//   [ 'global', 'order.created' ]
// ]
```

**Why this works:** instead of parsing subscriber patterns against every published topic at publish time (an O(subscribers) scan per publish), `publish` simply emits under a small, fixed set of synthetic event names derived from the topic (`exact`, `namespace.*`, `*`). Matching is then just Node's built-in exact-name listener lookup on the internal `EventEmitter`, which is O(1) per listener list — the "wildcard" behavior is really just publishing to multiple precomputed channels at once. Wrapping every subscriber handler in a try/catch that re-routes to the bus's own `'error'` event means one bad subscriber can't crash unrelated publishers or the process.
