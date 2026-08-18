# Output-Based: `MaxListenersExceededWarning` from repeated `.on()` calls

```js
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

function attachHandler() {
  emitter.on('event', () => {});
}
for (let i = 0; i < 11; i++) attachHandler();
```

**Answer:** A `MaxListenersExceededWarning` is printed to stderr after the 11th listener is attached to the same event.

**Why:** `EventEmitter` defaults to warning once more than 10 listeners are registered for the same event name, since that's often a symptom of a leak (e.g., a subscribe function called repeatedly without ever unsubscribing). It's just a warning, not an error — the listeners still work — but in a long-running server this pattern usually means a closure (and whatever it references) is accumulating in memory with each additional, never-removed listener.
