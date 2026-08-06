Here's a complete implementation of the `EventEmitter` class in JavaScript based on the requirements and features outlined above.

### Implementation

```javascript
class EventEmitter {
  constructor() {
    // Store events and their associated listeners
    this.events = {};
  }

  /**
   * Adds a listener for the specified event.
   * @param {string} eventName - The name of the event.
   * @param {Function} listener - The callback function to be invoked when the event is emitted.
   * @returns {EventEmitter} The EventEmitter instance (for chaining).
   */
  on(eventName, listener) {
    if (typeof eventName !== "string" || typeof listener !== "function") {
      throw new Error("Invalid event name or listener.");
    }

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
    return this;
  }

  /**
   * Removes a specific listener for the specified event.
   * @param {string} eventName - The name of the event.
   * @param {Function} listener - The callback function to be removed.
   * @returns {EventEmitter} The EventEmitter instance (for chaining).
   */
  off(eventName, listener) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (registeredListener) => registeredListener !== listener
      );
    }
    return this;
  }

  /**
   * Emits the specified event, invoking all its listeners with the provided arguments.
   * @param {string} eventName - The name of the event.
   * @param {...any} args - Arguments to pass to the listeners.
   * @returns {boolean} True if the event had listeners, false otherwise.
   */
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => listener(...args));
      return true;
    }
    return false;
  }
}

// Example Usage

const emitter = new EventEmitter();

// Define a listener for addition
function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}

// Subscribe to "foo" event
emitter.on("foo", addTwoNumbers);
emitter.emit("foo", 2, 5);
// Output: The sum is 7

// Add another listener for multiplication
emitter.on("foo", (a, b) => console.log(`The product is ${a * b}`));
emitter.emit("foo", 4, 5);
// Output:
// The sum is 9
// The product is 20

// Remove the addition listener
emitter.off("foo", addTwoNumbers);
emitter.emit("foo", -3, 9);
// Output: The product is -27

// Chained calls
emitter
  .on("bar", (msg) => console.log(`Listener 1: ${msg}`))
  .on("bar", (msg) => console.log(`Listener 2: ${msg}`));
emitter.emit("bar", "Chaining works!");
// Output:
// Listener 1: Chaining works!
// Listener 2: Chaining works!
```

### Features Implemented
1. **Isolation**: Each `EventEmitter` instance has isolated event storage.
2. **Chaining**: `on` and `off` methods return the instance for method chaining.
3. **Validation**: Input validation for `eventName` and `listener`.
4. **Emit Confirmation**: The `emit` method returns `true` if listeners exist, otherwise `false`.
5. **Event Removal**: Specific listeners can be removed using the `off` method.

This implementation adheres to common patterns used in event-driven programming and mimics the behavior of the Node.js `EventEmitter` class.


# Event Emitter in React

**Event Emitter** is a pattern used for communication between unrelated components without direct parent-child relationships.

Think of it as:

```text
Publisher
    ↓
Event

Subscriber
```

Similar to:

```text
WhatsApp Group

One user sends message
       ↓
All subscribers receive it
```

***

# Why Use Event Emitter?

React normally uses:

```text
Parent → Child (Props)
Child → Parent (Callbacks)
```

Problem:

```text
Component A
        ↔
Component Z

No direct connection
```

Event Emitter solves this.

***

# Custom Event Emitter Implementation

## eventEmitter.js

```javascript
class EventEmitter {

  constructor() {
    this.events = {};
  }

  on(eventName, listener) {

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(listener);
  }

  emit(eventName, data) {

    const listeners =
      this.events[eventName];

    if (!listeners) return;

    listeners.forEach(listener =>
      listener(data)
    );
  }

  off(eventName, listener) {

    if (!this.events[eventName])
      return;

    this.events[eventName] =
      this.events[eventName].filter(
        l => l !== listener
      );
  }
}

export default new EventEmitter();
```

***

# Component A (Publisher)

```jsx
import emitter from "./eventEmitter";

function Header() {

  const handleLogin = () => {

    emitter.emit(
      "USER_LOGIN",
      {
        id: 101,
        name: "Sudhir"
      }
    );

  };

  return (
    <button
      onClick={handleLogin}
    >
      Login
    </button>
  );
}
```

***

# Component B (Subscriber)

```jsx
import {
  useEffect,
  useState
} from "react";

import emitter
  from "./eventEmitter";

function Profile() {

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    const handleLogin =
      data => {

        setUser(data);

      };

    emitter.on(
      "USER_LOGIN",
      handleLogin
    );

    return () => {

      emitter.off(
        "USER_LOGIN",
        handleLogin
      );

    };

  }, []);

  return (
    <div>
      {user?.name}
    </div>
  );
}
```

***

# Flow

```text
Header Component
      ↓

emit(
 "USER_LOGIN"
)

      ↓

EventEmitter

      ↓

Profile Component

      ↓

Update State
```

***

# Real World React Use Cases

## Notification System

```javascript
emitter.emit(
  "SHOW_TOAST",
  {
    type: "success",
    message: "Saved"
  }
);
```

Subscriber:

```javascript
emitter.on(
  "SHOW_TOAST",
  showToast
);
```

***

## Global Modal

```javascript
emitter.emit(
  "OPEN_MODAL",
  {
    title:
      "Delete User"
  }
);
```

***

## Analytics

```javascript
emitter.emit(
  "TRACK_EVENT",
  {
    page: "Dashboard"
  }
);
```

***

## Cross Component Refresh

```javascript
emitter.emit(
  "REFRESH_USERS"
);
```

Users component:

```javascript
emitter.on(
  "REFRESH_USERS",
  fetchUsers
);
```

***

# Using Node.js EventEmitter

```bash
npm install events
```

```javascript
import EventEmitter
from "events";

export default
new EventEmitter();
```

***

# Event Emitter vs Context API

| Feature                 | Event Emitter | Context API |
| ----------------------- | ------------- | ----------- |
| Component Communication | ✅             | ✅           |
| Shared State            | ❌             | ✅           |
| Re-render Consumers     | ❌             | ✅           |
| Fire-and-Forget Events  | ✅             | ❌           |
| Notifications           | ✅             | ✅           |
| Authentication State    | ❌             | ✅           |

***

# Event Emitter vs Redux

| Feature            | Event Emitter | Redux |
| ------------------ | ------------- | ----- |
| State Storage      | ❌             | ✅     |
| Event Broadcasting | ✅             | ✅     |
| Debuggable         | ❌             | ✅     |
| Time Travel        | ❌             | ✅     |
| Complex Apps       | ❌             | ✅     |

***

# React Interview Questions

### What is Event Emitter?

> A publish-subscribe pattern where components can emit events and other components can listen to them.

***

### When would you use it?

```text
✅ Toast Notifications
✅ Analytics Events
✅ Global Modals
✅ Cross Component Communication
✅ Refresh Events
```

***

### Why not use Event Emitters for everything?

```text
❌ Hard to debug
❌ No state history
❌ Can create hidden dependencies
❌ Difficult to scale
```

For application state prefer:

```text
Context API
Redux Toolkit
Zustand
React Query
```

***

# Senior React Interview Answer

> Event Emitter follows the Publish-Subscribe pattern. A component emits an event and any subscribed component receives it. It is useful for loosely coupled communication such as notifications, analytics tracking, modal management, and refresh triggers. However, it is not a state management solution. For shared application state, React Context, Redux Toolkit, Zustand, or React Query are generally preferred.
