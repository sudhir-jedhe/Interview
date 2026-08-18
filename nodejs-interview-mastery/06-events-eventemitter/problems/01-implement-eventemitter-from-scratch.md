# Problem: Implement Your Own EventEmitter From Scratch

## Problem Statement

Implement a `MyEventEmitter` class that replicates the core behavior of Node's built-in `EventEmitter`, without using the `events` module. It must support `on`, `off`, `once`, `emit`, and the special-cased `'error'` event behavior.

## Requirements

- `on(event, listener)` — registers a listener, callable multiple times for the same event.
- `off(event, listener)` — removes a specific listener by reference.
- `once(event, listener)` — registers a listener that fires only on the first matching `emit`, then auto-removes.
- `emit(event, ...args)` — synchronously invokes every listener for `event`, in registration order, passing `args`. Returns `true` if there were listeners invoked, `false` otherwise.
- Emitting `'error'` with no `'error'` listeners registered must **throw** the error (matching Node's real crash-by-default behavior) instead of silently doing nothing.
- Registering the same function reference twice must result in it being called twice (no deduplication) — matching real `EventEmitter` semantics.
- `listenerCount(event)` — bonus introspection method.

## Approach

Store listeners in a `Map<eventName, Function[]>`. `on` pushes onto (or creates) the array for that event. `emit` iterates a **copy** of the listener array (important: if a listener removes another listener during iteration, mutating the live array while iterating would skip entries or throw off indices). `once` is implemented as a thin wrapper: wrap the user's listener in a function that calls `off` on itself before invoking the real listener, then register that wrapper with `on`. The `'error'` special case is handled as an explicit check at the top of `emit`.

## Solution

```js
class MyEventEmitter {
  #listeners = new Map(); // eventName -> Function[]

  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(listener);
    return this; // support chaining, like the real API
  }

  off(event, listener) {
    const list = this.#listeners.get(event);
    if (!list) return this;

    const index = list.indexOf(listener);
    if (index !== -1) list.splice(index, 1);

    if (list.length === 0) this.#listeners.delete(event);
    return this;
  }

  once(event, listener) {
    // Wrap so the wrapper removes ITSELF (not the user's original function)
    // from the emitter the first time it runs, then delegates to the real listener.
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
    return this;
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event);

    if (event === 'error' && (!list || list.length === 0)) {
      // Replicate Node's real behavior: an unhandled 'error' event throws.
      const err = args[0] instanceof Error ? args[0] : new Error(String(args[0]));
      throw err;
    }

    if (!list || list.length === 0) return false;

    // Iterate a snapshot copy so a listener removing another listener
    // (e.g. a once() wrapper removing itself) doesn't corrupt this loop.
    for (const listener of [...list]) {
      listener(...args);
    }
    return true;
  }

  listenerCount(event) {
    return this.#listeners.get(event)?.length ?? 0;
  }
}

module.exports = { MyEventEmitter };

// --- verification ---
const ee = new MyEventEmitter();

ee.on('greet', (name) => console.log(`Hello, ${name}`));
ee.emit('greet', 'Sam'); // Hello, Sam

let onceCount = 0;
ee.once('ready', () => onceCount++);
ee.emit('ready');
ee.emit('ready');
console.log('once fired:', onceCount); // 1

ee.on('error', (err) => console.log('handled:', err.message));
ee.emit('error', new Error('boom')); // handled: boom, does not throw

try {
  new MyEventEmitter().emit('error', new Error('uncaught'));
} catch (err) {
  console.log('threw as expected:', err.message); // threw as expected: uncaught
}
```

**Why this works:** copying the listener array before iterating in `emit` avoids the classic bug where a `once()` listener's self-removal (via `splice`) shifts indices mid-iteration and causes a subsequent listener to be skipped. The `'error'` special case is checked before the "no listeners" early return, so it can throw instead of just returning `false` like every other unlistened event does.
