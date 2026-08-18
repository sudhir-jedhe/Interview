# Building Pub/Sub on EventEmitter, and EventEmitter vs Promises

`EventEmitter` is already a topic-based pub/sub system — `emit(topic, payload)` is publish, `on(topic, handler)` is subscribe. Wrapping it just adds naming/API sugar for a specific domain (see `snippets/07-minimal-pubsub-wrapper.md` and `problems/02-namespaced-pubsub-bus.md` for worked examples).

## EventEmitter vs Promises

| Aspect | EventEmitter | Promise |
|---|---|---|
| Number of "results" | Zero, one, or many (repeatable) | Exactly one (settles once) |
| Consumption | Multiple independent listeners | `.then()`/`await` chains, single consumption pattern (though many can attach) |
| Best for | Ongoing streams of occurrences | Single async operation completion |

Use EventEmitter for anything recurring or open-ended (a socket receiving many messages); use Promises for a single async result (one DB query). The common mistake is trying to `await emitter.emit(...)`, which does nothing useful — `emit` returns a boolean, not a promise, and doesn't wait for async listeners to finish.

If you specifically need to `await` a single upcoming event, use `events.once(emitter, eventName)` from the `events` module, which bridges the two models by returning a Promise that resolves on the next matching emission.
