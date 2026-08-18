# Interview Q&A — Listener Management and Async Patterns

**Q: How do you remove a specific listener, and what do you need to be able to do so?**
Use `emitter.off(event, listenerFn)` (or the older alias `removeListener`). You need a reference to the exact same function that was passed to `.on()` — anonymous inline arrow functions can't be removed later since you have no reference to compare against. Store the function in a variable if you'll need to remove it.

**Q: Does calling `.on()` with the same function twice register it twice?**
Yes. `EventEmitter` does not deduplicate listeners by reference — adding the same function reference multiple times results in it being invoked multiple times per `emit()`. Calling `.off()` once only removes a single matching instance.

**Q: How would you wait for an EventEmitter event using async/await instead of a callback?**
Use `events.once(emitter, eventName)` from the `events` module, which returns a Promise that resolves with the event's arguments on the next emission:
```js
const { once } = require('events');
const [data] = await once(emitter, 'ready');
```

**Q: What's the practical difference between an EventEmitter-based API and a Promise-based API?**
A Promise represents a single async result that settles exactly once (resolve or reject). An EventEmitter can fire the same or different named events an arbitrary number of times over its lifetime, supporting multiple independent listeners for ongoing occurrences. Use Promises for one-shot operations, EventEmitters for recurring/streaming occurrences.
