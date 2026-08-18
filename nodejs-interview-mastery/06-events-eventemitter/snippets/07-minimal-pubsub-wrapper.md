# Minimal Typed Pub/Sub Wrapper Built on EventEmitter

A small wrapper class that exposes `publish`/`subscribe` naming on top of an internal `EventEmitter`, returning an unsubscribe function for convenience.

```js
const { EventEmitter } = require('events');

class PubSub {
  #emitter = new EventEmitter();

  publish(topic, payload) {
    this.#emitter.emit(topic, payload);
  }

  subscribe(topic, handler) {
    this.#emitter.on(topic, handler);
    return () => this.#emitter.off(topic, handler); // unsubscribe function
  }
}

const bus = new PubSub();
const unsubscribe = bus.subscribe('order.created', (order) =>
  console.log('New order:', order.id)
);
bus.publish('order.created', { id: 42 }); // New order: 42
unsubscribe();
bus.publish('order.created', { id: 43 }); // nothing logged
```

The `#emitter` private field keeps the underlying `EventEmitter` fully encapsulated — consumers only ever interact through `publish`/`subscribe`, not raw `.on`/`.emit`. For a version that also supports namespaced wildcard subscriptions (e.g. `'user.*'`), see `problems/02-namespaced-pubsub-bus.md`.
