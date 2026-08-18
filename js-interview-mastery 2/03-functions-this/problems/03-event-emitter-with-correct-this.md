# Problem: Implement a Simple Event-Emitter Class Relying on Correct `this` Binding

## Problem Statement

Implement a minimal `EventEmitter` class with `on(event, listener)`, `off(event, listener)`, and `emit(event, ...args)` methods. The class must be usable safely even when its methods are detached and passed around as callbacks (e.g. `emitter.on = someOtherFn` is out of scope, but `const on = emitter.on.bind(emitter)` should keep working correctly) — the design must explicitly account for how `this` behaves inside class methods versus how it can be lost.

## Requirements

- `on(event, listener)` registers a listener for `event`; multiple listeners per event are supported.
- `off(event, listener)` removes a specific listener.
- `emit(event, ...args)` calls every registered listener for `event`, passing `args`, with each listener's own `this` handled correctly (listeners registered as arrow functions should keep their lexical `this`; listeners registered as regular functions should receive the emitter as `this`, matching how most real event-emitter APIs behave).
- The emitter's own methods must not accidentally rely on `this` being `emitter` if they've been detached — demonstrate the failure mode and the fix (binding in the constructor).

## Approach

Store listeners in a `Map` keyed by event name, as an instance property (accessed via `this.listeners`, which only works correctly as long as `this` really is the emitter instance when a method runs). Because class methods are just functions and lose their implicit binding when detached, bind the public methods in the constructor so the emitter's own API remains safe to pass around — the same fix used for class components in UI frameworks. When invoking listeners inside `emit`, call them with `listener.call(this, ...args)` so a regular-function listener receives the emitter as `this` (mirroring Node's real `EventEmitter`), while an arrow-function listener simply ignores that and uses its own lexical `this` as always.

## Solution

```js
class EventEmitter {
  constructor() {
    this.listeners = new Map(); // event name -> Set of listener functions

    // Bind the public API so these methods stay correct even if detached,
    // e.g. `const emit = emitter.emit; emit('x')` would otherwise lose `this`
    // and throw when trying to read `this.listeners` inside emit().
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.emit = this.emit.bind(this);
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(listener);
    return this;
  }

  off(event, listener) {
    this.listeners.get(event)?.delete(listener);
    return this;
  }

  emit(event, ...args) {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return false;

    // `.call(this, ...)` gives regular-function listeners access to the emitter
    // via `this`, matching Node's real EventEmitter behavior. Arrow-function
    // listeners ignore the supplied `this` entirely (they use their own lexical
    // `this`), so this composes correctly with either style.
    for (const listener of eventListeners) {
      listener.call(this, ...args);
    }
    return true;
  }
}

module.exports = { EventEmitter };

// --- verification ---
const emitter = new EventEmitter();

// Regular-function listener: receives the emitter as `this`.
emitter.on('greet', function (name) {
  console.log(`Hello ${name}, from`, this === emitter ? 'the emitter' : 'somewhere else');
});

// Arrow-function listener: keeps its own lexical `this` (undefined at module top level here).
const logger = {
  prefix: '[LOG]',
  attach(emitterInstance) {
    emitterInstance.on('greet', (name) => {
      console.log(this.prefix, `greet event: ${name}`); // `this` is `logger`, via lexical scope
    });
  },
};
logger.attach(emitter);

emitter.emit('greet', 'Sam');
// Hello Sam, from the emitter
// [LOG] greet event: Sam

// Demonstrate why the constructor-bind matters: detach `emit` and call it standalone.
const detachedEmit = emitter.emit;
detachedEmit('greet', 'Detached'); // still works — because emit was bound in the constructor
```

**Why this works:** binding `on`/`off`/`emit` in the constructor converts them from "regular functions that rely on implicit binding at the call site" into "functions with a permanently fixed `this`," which is exactly the same fix used for class-based UI component event handlers (see `../scenarios/01-fixing-lost-this-in-class-event-handlers.md`). Using `listener.call(this, ...args)` inside `emit` is what lets the emitter offer `this`-as-emitter to regular-function listeners (a common convenience in real event-emitter APIs) without breaking arrow-function listeners, since `call` has no effect on an arrow function's `this` — it simply keeps using whatever it lexically captured.
