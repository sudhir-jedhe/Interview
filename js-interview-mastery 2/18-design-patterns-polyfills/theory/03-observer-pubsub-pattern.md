# Observer / Pub-Sub Pattern

Decouples the code that produces an event from the code that reacts to it. Subscribers register callbacks for named events; a publisher fires the event with data, and every subscriber gets called, without publisher and subscriber needing direct references to each other.

```js
class EventEmitter {
  #listeners = {};
  on(event, callback) {
    (this.#listeners[event] ??= []).push(callback);
    return () => this.off(event, callback); // returns an unsubscribe function
  }
  off(event, callback) {
    this.#listeners[event] = (this.#listeners[event] || []).filter(cb => cb !== callback);
  }
  emit(event, ...args) {
    (this.#listeners[event] || []).forEach(cb => cb(...args));
  }
}

const bus = new EventEmitter();
const unsubscribe = bus.on("login", (user) => console.log(`${user} logged in`));
bus.emit("login", "ana"); // "ana logged in"
unsubscribe();
bus.emit("login", "ben"); // nothing logs -- listener removed
```

## Observer/pub-sub vs. direct callback passing

| Aspect | Observer/pub-sub (event emitter) | Direct callback argument |
|---|---|---|
| Coupling | Loose — publisher doesn't know who's listening | Tight — caller must pass the exact callback at call time |
| Multiple subscribers | Trivial — just call `.on()` multiple times | Requires manually managing an array of callbacks yourself |
| Late subscription | Supported — subscribe any time before the event fires | Not possible — callback must exist before the call |
| Debuggability | Harder to trace "who's listening to what" in large systems | Easy to trace — it's just a function call |

Use pub-sub when many independent parts of a system need to react to the same event without knowing about each other (UI components reacting to a global state change). Use a direct callback when there's a single, well-defined caller-callee relationship — reaching for an event emitter there is overkill and makes the code harder to follow.

This pattern shows up throughout the DOM's own event system, Node's `EventEmitter`, and state-management libraries (Redux's store subscriptions are effectively pub-sub). See `../../17-dom-events-browser-apis/problems/03-custom-event-system.md` for a browser-flavored implementation using `EventTarget`.
