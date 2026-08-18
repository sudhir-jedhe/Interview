# Problem: A custom event system for cross-component communication

**Task:** Build a way for independent, decoupled pieces of code (e.g., widgets on a dashboard) to communicate without holding direct references to each other — a component "emits" a named event with data, and any number of other components can "listen" for it.

Two valid approaches are shown: using the browser's built-in `EventTarget`, and a hand-rolled emitter (useful when you need this to also work outside a browser, e.g. in Node).

## Approach 1: Using `EventTarget`

Any browser (and modern Node) environment has `EventTarget` built in — you can either extend it or instantiate it directly rather than writing your own pub-sub from scratch.

```js
class AppBus extends EventTarget {
  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

const bus = new AppBus();

// Widget A subscribes:
function onDateRangeChanged(e) {
  console.log("chart widget refetching for range:", e.detail);
}
bus.addEventListener("dateRangeChanged", onDateRangeChanged);

// Widget B publishes, with no knowledge of who's listening:
bus.emit("dateRangeChanged", { from: "2026-01-01", to: "2026-01-31" });
// logs: "chart widget refetching for range: { from: '2026-01-01', to: '2026-01-31' }"

// Cleanup, e.g. on widget teardown:
bus.removeEventListener("dateRangeChanged", onDateRangeChanged);
```

`CustomEvent`'s `detail` property is the standard place to attach a payload; `dispatchEvent`/`addEventListener`/`removeEventListener` come for free, including support for `{ once: true }` and the capture/bubble machinery if you ever nest buses.

## Approach 2: A hand-rolled emitter

Useful in non-DOM contexts (plain Node modules, testing harnesses) or when you want a smaller, dependency-free API surface than `EventTarget` provides.

```js
class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(callback);
    return () => this.off(event, callback); // convenience unsubscribe function
  }

  off(event, callback) {
    this.#listeners.get(event)?.delete(callback);
  }

  emit(event, ...args) {
    this.#listeners.get(event)?.forEach((callback) => callback(...args));
  }

  once(event, callback) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      callback(...args);
    };
    return this.on(event, wrapper);
  }
}

const emitter = new EventEmitter();

const unsubscribe = emitter.on("login", (user) => console.log(`${user} logged in`));
emitter.emit("login", "ana"); // "ana logged in"

emitter.once("login", (user) => console.log(`(once) welcome ${user}`));
emitter.emit("login", "ben"); // "ben logged in" AND "(once) welcome ben"
emitter.emit("login", "carla"); // "carla logged in" only -- the once() listener already fired

unsubscribe();
emitter.emit("login", "dee"); // nothing logs for the original listener -- it was removed
```

## Design notes

- Using a `Set` per event name (rather than an array) makes `off()` an O(1) removal and naturally de-duplicates identical callback references.
- Returning an unsubscribe function from `on()` is a small but important ergonomic detail — it avoids callers needing to keep the original callback reference around just to remove it later.
- `EventTarget` is the right default choice in a browser: it's built-in, well-understood, integrates with DevTools, and supports the standard event options. Reach for a hand-rolled emitter only when you need it to run somewhere `EventTarget` isn't available, or want a deliberately smaller/different API (like `once()` built in, as above).
