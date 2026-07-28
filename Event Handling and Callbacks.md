### 23. Build a class that can subscribe to and emit events

You can create a simple event emitter class with `subscribe` and `emit` methods:

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.unsubscribe(event, listener); // Returns unsubscribe function
  }

  unsubscribe(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((fn) => fn !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }
}
```

- `subscribe`: Registers a listener for a specific event.
- `unsubscribe`: Removes a specific listener.
- `emit`: Calls all listeners for the given event.

---

### 24. Write a debounce function with a cancel method

A debounce function limits how frequently a function can be called, and a `cancel` method can be added to cancel pending calls.

```javascript
function debounce(fn, delay) {
  let timer;

  const debounced = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = function () {
    clearTimeout(timer);
  };

  return debounced;
}
```

- `debounce`: Debounces the provided function.
- `cancel`: Clears any pending debounced calls.

---

### 25. Implement a throttle function with a cancel method

A throttle function ensures a function is called at most once within a specified time window. We also provide a `cancel` method to stop it from firing.

```javascript
function throttle(fn, delay) {
  let lastCall = 0;
  let timer;

  const throttled = function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          lastCall = Date.now();
          fn(...args);
        },
        delay - (now - lastCall),
      );
    }
  };

  throttled.cancel = function () {
    clearTimeout(timer);
  };

  return throttled;
}
```

- `throttle`: Throttles the execution of the function.
- `cancel`: Stops any pending calls.

---

### 26. Write your own version of the `call` method

The `call` method invokes a function with a specified `this` value and arguments.

```javascript
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis; // Handle null/undefined context by defaulting to global
  const symbol = Symbol("fn");
  context[symbol] = this;
  const result = context[symbol](...args);
  delete context[symbol];
  return result;
};
```

- `myCall`: A custom implementation of the `call` method.
- The method assigns the function to the context object temporarily, calls it with the provided arguments, and cleans up afterward.

---

### 27. Develop polyfills for `call`, `apply`, and `bind`

Here’s how you can implement your own versions of `call`, `apply`, and `bind`.

```javascript
// Polyfill for `call`
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis;
  const symbol = Symbol("fn");
  context[symbol] = this;
  const result = context[symbol](...args);
  delete context[symbol];
  return result;
};

// Polyfill for `apply`
Function.prototype.myApply = function (context, args) {
  context = context || globalThis;
  const symbol = Symbol("fn");
  context[symbol] = this;
  const result = context[symbol](...args);
  delete context[symbol];
  return result;
};

// Polyfill for `bind`
Function.prototype.myBind = function (context, ...args) {
  const fn = this;
  return function (...newArgs) {
    return fn.myCall(context, ...args, ...newArgs);
  };
};
```

- `myCall`: Works like `call`, passing arguments to the function with a specified `this` value.
- `myApply`: Similar to `call`, but takes an array of arguments.
- `myBind`: Returns a new function with a fixed `this` and initial arguments.

---

### 28. Implement a simple pub/sub pattern

Here’s a basic pub/sub pattern using an event emitter approach:

```javascript
class PubSub {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    return () => this.unsubscribe(event, callback); // Returns unsubscribe function
  }

  unsubscribe(event, callback) {
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event].filter(
      (fn) => fn !== callback,
    );
  }

  publish(event, ...args) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach((callback) => callback(...args));
  }
}
```

- `subscribe`: Registers a listener for an event.
- `unsubscribe`: Removes a listener from an event.
- `publish`: Calls all listeners for a particular event.

---

### 29. Write a custom event emitter for once-only listeners

A custom event emitter for "once" listeners only calls a listener once and then automatically removes it.

```javascript
class EventEmitterOnce {
  constructor() {
    this.events = {};
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.removeListener(event, wrapper); // Remove after first call
    };
    this.on(event, wrapper);
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  removeListener(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((fn) => fn !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }
}
```

- `once`: Subscribes to an event and ensures the listener is called only once.

---

### 30. Handle event delegation

Event delegation allows you to listen for events on a parent element and delegate handling to specific child elements.

```javascript
function addEventDelegation(parent, selector, eventType, handler) {
  parent.addEventListener(eventType, function (event) {
    const targetElement = event.target.closest(selector);
    if (targetElement) {
      handler.call(targetElement, event);
    }
  });
}
```

- This method attaches an event listener to a parent element (`parent`) and checks if the event target matches a child element (`selector`). If so, it executes the `handler`.

Example usage:

```javascript
addEventDelegation(document.body, ".button", "click", function () {
  console.log("Button clicked!");
});
```

This will handle click events on `.button` elements dynamically, even if they are added later.

---

These implementations cover a wide range of essential JavaScript concepts such as custom event emitters, function control (debounce, throttle), and manual handling of common JavaScript methods like `call`, `apply`, and `bind`.
