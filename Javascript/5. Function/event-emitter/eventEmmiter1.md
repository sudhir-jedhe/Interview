Below is a **clean implementation** of the `EventEmitter` class using a modern ES6 approach and also providing a prototype-based alternative. It incorporates the considerations and clarifications you outlined.

### Modern ES6 Class Implementation

```javascript
export default class EventEmitter {
  constructor() {
    // Use Object.create(null) to avoid prototype pollution.
    this._events = Object.create(null);
  }

  /**
   * Registers a listener for the given event.
   * @param {string} eventName - The name of the event.
   * @param {Function} listener - The callback function.
   * @returns {EventEmitter} - The instance for chaining.
   */
  on(eventName, listener) {
    if (!Object.hasOwn(this._events, eventName)) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(listener);
    return this;
  }

  /**
   * Removes the first occurrence of the specified listener for the given event.
   * @param {string} eventName - The name of the event.
   * @param {Function} listener - The callback function to remove.
   * @returns {EventEmitter} - The instance for chaining.
   */
  off(eventName, listener) {
    if (!Object.hasOwn(this._events, eventName)) {
      return this;
    }

    const listeners = this._events[eventName];
    const index = listeners.findIndex((item) => item === listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
    return this;
  }

  /**
   * Emits an event, invoking all registered listeners with the provided arguments.
   * @param {string} eventName - The name of the event.
   * @param {...any} args - Arguments to pass to the listeners.
   * @returns {boolean} - True if the event had listeners, false otherwise.
   */
  emit(eventName, ...args) {
    if (
      !Object.hasOwn(this._events, eventName) ||
      this._events[eventName].length === 0
    ) {
      return false;
    }

    const listeners = this._events[eventName].slice();
    listeners.forEach((listener) => listener.apply(null, args));
    return true;
  }
}
```

---

### Prototype-Based Implementation

```javascript
export default function EventEmitter() {
  this._events = Object.create(null);
}

/**
 * Registers a listener for the given event.
 * @param {string} eventName - The name of the event.
 * @param {Function} listener - The callback function.
 * @returns {EventEmitter} - The instance for chaining.
 */
EventEmitter.prototype.on = function (eventName, listener) {
  if (!Object.hasOwn(this._events, eventName)) {
    this._events[eventName] = [];
  }
  this._events[eventName].push(listener);
  return this;
};

/**
 * Removes the first occurrence of the specified listener for the given event.
 * @param {string} eventName - The name of the event.
 * @param {Function} listener - The callback function to remove.
 * @returns {EventEmitter} - The instance for chaining.
 */
EventEmitter.prototype.off = function (eventName, listener) {
  if (!Object.hasOwn(this._events, eventName)) {
    return this;
  }

  const listeners = this._events[eventName];
  const index = listeners.findIndex((item) => item === listener);

  if (index !== -1) {
    listeners.splice(index, 1);
  }
  return this;
};

/**
 * Emits an event, invoking all registered listeners with the provided arguments.
 * @param {string} eventName - The name of the event.
 * @param {...any} args - Arguments to pass to the listeners.
 * @returns {boolean} - True if the event had listeners, false otherwise.
 */
EventEmitter.prototype.emit = function (eventName, ...args) {
  if (
    !Object.hasOwn(this._events, eventName) ||
    this._events[eventName].length === 0
  ) {
    return false;
  }

  const listeners = this._events[eventName].slice();
  listeners.forEach((listener) => listener.apply(null, args));
  return true;
};
```

---

### Example Input/Output

```javascript
const emitter = new EventEmitter();

function greet(name) {
  console.log(`Hello, ${name}!`);
}

function farewell(name) {
  console.log(`Goodbye, ${name}!`);
}

// Register events
emitter.on("greet", greet).on("greet", farewell);

// Emit event
emitter.emit("greet", "Alice");
// Output:
// Hello, Alice!
// Goodbye, Alice!

// Remove one listener
emitter.off("greet", greet);

// Emit event again
emitter.emit("greet", "Bob");
// Output:
// Goodbye, Bob!

// Emit non-existent event
console.log(emitter.emit("nonexistent")); // Output: false
```

This clean implementation and demonstration showcase a fully functional `EventEmitter` that handles all outlined use cases and edge cases effectively.