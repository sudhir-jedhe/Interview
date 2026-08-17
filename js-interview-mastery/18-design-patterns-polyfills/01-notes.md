# Notes: Design Patterns & Polyfills

## Module pattern

Before ES modules existed, JavaScript had no built-in way to keep variables private to a file — everything leaked into the global scope. The module pattern uses an IIFE (Immediately Invoked Function Expression) plus closures to create a private scope, exposing only what you choose on a returned object.

```js
const Counter = (function () {
  let count = 0; // private, inaccessible from outside
  function increment() {
    count += 1;
    return count;
  }
  function reset() {
    count = 0;
  }
  return { increment, reset }; // public API
})();

Counter.increment(); // 1
console.log(Counter.count); // undefined -- truly private
```

This pattern is largely superseded by native ES modules (`import`/`export`, which have file-level privacy by default), but it still shows up in interviews because it demonstrates a real understanding of closures and scope.

## Singleton pattern

Guarantees a class/module has exactly one instance, with a single global access point to it. In JS, this is usually simpler than in class-heavy languages, since you can just export a single object literal — module systems already cache modules, so `import` naturally gives you singleton behavior.

```js
class Logger {
  static #instance;
  constructor() {
    if (Logger.#instance) return Logger.#instance;
    this.logs = [];
    Logger.#instance = this;
  }
  log(msg) { this.logs.push(msg); }
}

const a = new Logger();
const b = new Logger();
console.log(a === b); // true -- same instance
```

## Observer / pub-sub pattern

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

## Factory pattern

A function that creates and returns objects without requiring `new` or exposing the concrete class being instantiated. Useful when object creation involves branching logic or you want to hide implementation details behind a simple creation API.

```js
function createShape(type, size) {
  switch (type) {
    case "circle": return { type, area: () => Math.PI * size ** 2 };
    case "square": return { type, area: () => size ** 2 };
    default: throw new Error(`Unknown shape: ${type}`);
  }
}

createShape("circle", 2).area(); // 12.566...
```

## Debounce and throttle

Both limit how often a function runs in response to rapid, repeated triggers, but with different guarantees. **Debounce** waits until calls stop for a quiet period, then fires once. **Throttle** fires at a steady maximum rate no matter how continuously the trigger fires.

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

## Polyfills: the general approach

A polyfill reimplements a native method's exact observable behavior — argument order, `this` handling, edge cases with sparse arrays or empty input — using only older, more widely supported language features. The general process: (1) read the spec/MDN carefully for edge cases (what happens with no callback? with holes in the array? with a `thisArg`?), (2) write the "happy path" first, (3) then handle documented edge cases one at a time, testing against the real native version's behavior as a reference.

```js
if (!Array.prototype.myMap) {
  Array.prototype.myMap = function (callback, thisArg) {
    if (typeof callback !== "function") throw new TypeError(`${callback} is not a function`);
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (i in this) { // respect sparse arrays -- skip holes, matching native map
        result[i] = callback.call(thisArg, this[i], i, this);
      }
    }
    return result;
  };
}
```

`Array.prototype.reduce` is trickier because of the optional initial value: if omitted, the first array element becomes the accumulator and iteration starts from index 1, and calling `reduce` on an empty array with no initial value must throw a `TypeError`.

`Promise.all` polyfills need to track resolution order (results must preserve input order even though promises can settle out of order) and reject immediately if *any* input promise rejects, without waiting for the others.
