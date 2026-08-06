If by **`listenTo`** you mean the common interview question similar to an **EventEmitter** API:

```js
obj.listenTo("click", callback);
obj.emit("click");
```

then `listenTo` is essentially a **subscription mechanism**.

***

# Basic Implementation

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  listenTo(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);

    return () => {
      this.events[eventName] =
        this.events[eventName].filter(
          (cb) => cb !== callback
        );
    };
  }

  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName].forEach((cb) =>
      cb(...args)
    );
  }
}
```

This pattern is commonly used in EventEmitter/pub-sub implementations. [\[greatfrontend.com\]](https://www.greatfrontend.com/questions/javascript/event-emitter), [\[frontprep.com\]](https://www.frontprep.com/javascript-coding/event-emitter)

***

# Usage

```js
const emitter = new EventEmitter();

const unsubscribe =
  emitter.listenTo(
    "message",
    (data) => {
      console.log(
        "Received:",
        data
      );
    }
  );

emitter.emit(
  "message",
  "Hello World"
);
```

Output

```text
Received: Hello World
```

***

# Unsubscribe

```js
unsubscribe();

emitter.emit(
  "message",
  "Hello Again"
);
```

Output

```text
(no output)
```

***

# Production Version

Uses `Map` + `Set`.

```js
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  listenTo(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(
        eventName,
        new Set()
      );
    }

    this.events
      .get(eventName)
      .add(callback);

    return {
      release: () => {
        this.events
          .get(eventName)
          ?.delete(callback);
      },
    };
  }

  emit(eventName, ...args) {
    const listeners =
      this.events.get(eventName);

    if (!listeners) {
      return;
    }

    listeners.forEach((callback) =>
      callback(...args)
    );
  }
}
```

This approach is similar to interview EventEmitter implementations that support subscribe/listen and emit operations. [\[towardsdev.com\]](https://towardsdev.com/javascript-interview-implement-an-event-emitter-class-8e983a2c3b12), [\[frontendlead.com\]](https://frontendlead.com/coding-questions/javascript-event-emitter-guide)

***

# Example

```js
const emitter =
  new EventEmitter();

const sub =
  emitter.listenTo(
    "userLoggedIn",
    (user) => {
      console.log(
        `Welcome ${user}`
      );
    }
  );

emitter.emit(
  "userLoggedIn",
  "Sudhir"
);
```

Output:

```text
Welcome Sudhir
```

***

# React Interview Follow-up

A common use case:

```js
eventBus.listenTo(
  "themeChanged",
  updateTheme
);

eventBus.emit(
  "themeChanged",
  "dark"
);
```

Useful for:

* Global notifications
* Analytics events
* Toast systems
* Cross-component communication

If you're referring to a **specific BFE.dev / Frontend Interview "Implement listenTo()"** problem statement, share the exact requirements and I'll provide the exact solution expected by that question.
