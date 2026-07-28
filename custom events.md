Creating custom events in JavaScript is a powerful feature that allows you to define your own event types and manage specific application behavior beyond the default browser events. Here's a detailed guide on how to implement custom events and how to use them in different scenarios:

### How to Create Custom Events

You can create and dispatch custom events in JavaScript using the `Event` constructor and the `dispatchEvent()` method.

#### Steps:

1. **Create the Custom Event**: Use the `Event` constructor to create a new event.
2. **Dispatch the Event**: Trigger the event with `dispatchEvent()` on an element.
3. **Listen for the Event**: Add an event listener to the element to handle the event when it’s triggered.

#### Example Code:

```javascript
// Step 1: Create a custom event
const customEvent = new Event("myCustomEvent");

// Step 2: Attach an event listener to listen for the event
document.addEventListener("myCustomEvent", function (e) {
  console.log("Custom event triggered!", e);
});

// Step 3: Dispatch the custom event
document.dispatchEvent(customEvent);
```

### Custom Events with Additional Data

If you need to pass additional data with the custom event, you can use the `CustomEvent` constructor, which allows you to include a `detail` property.

#### Example with Data:

```javascript
// Step 1: Create a custom event with additional data
const customEventWithData = new CustomEvent("userLoggedIn", {
  detail: { userId: 123, username: "john_doe" },
});

// Step 2: Attach an event listener to handle the event
document.addEventListener("userLoggedIn", function (e) {
  console.log("User logged in:", e.detail.username);
});

// Step 3: Dispatch the custom event with the data
document.dispatchEvent(customEventWithData);
```

### Practical Use Cases for Custom Events

#### 1. **Building Custom UI Components**

Imagine you’re creating a draggable element, and you want to trigger events when the drag operation starts, moves, and ends.

```javascript
const dragStartEvent = new CustomEvent("drag-start", {
  detail: { x: 0, y: 0 },
});

const dragEndEvent = new CustomEvent("drag-end", {
  detail: { x: 100, y: 100 },
});

// Dispatch custom drag events
document.querySelector("#draggableElement").dispatchEvent(dragStartEvent);
document.querySelector("#draggableElement").dispatchEvent(dragEndEvent);
```

#### 2. **Real-Time Updates**

In real-time applications, like a chat interface, custom events can be used to instantly update the UI when new messages arrive.

```javascript
const newMessageEvent = new CustomEvent("new-message", {
  detail: { message: "Hello, world!", timestamp: Date.now() },
});

document.addEventListener("new-message", function (e) {
  console.log("New message:", e.detail.message);
});

// Simulate receiving a new message
document.dispatchEvent(newMessageEvent);
```

#### 3. **Integration with Libraries**

For data-driven visualizations, custom events can trigger updates when underlying data changes, syncing the visual components with the data.

```javascript
const dataUpdatedEvent = new CustomEvent("data-updated", {
  detail: { data: [1, 2, 3, 4, 5] },
});

document.addEventListener("data-updated", function (e) {
  // Update the chart or visual component with new data
  console.log("Data updated:", e.detail.data);
});

// Dispatch the event when new data is available
document.dispatchEvent(dataUpdatedEvent);
```

#### 4. **Testing Automation**

Custom events can be used in automated testing to simulate user interactions, such as clicks or key presses.

```javascript
const simulateClickEvent = new CustomEvent("simulate-click");

document
  .querySelector("#button")
  .addEventListener("simulate-click", function () {
    console.log("Button was clicked programmatically");
  });

// Trigger the custom click event
document.querySelector("#button").dispatchEvent(simulateClickEvent);
```

### Key Concepts in Custom Events

- **`Event` vs `CustomEvent`**: The `Event` constructor creates a basic event with no additional data. The `CustomEvent` constructor extends `Event` and allows passing custom data through the `detail` property.
- **Event Listeners**: Use `addEventListener()` to listen for custom events and handle them asynchronously.
- **Dispatching Events**: Use `dispatchEvent()` to trigger the custom event on a DOM element or document.

### Summary

Custom events are a great way to enhance the flexibility and interactivity of your web applications. By using `Event` or `CustomEvent`, you can define and handle your own event types, facilitating better communication between components or modules. Whether it's for UI components, real-time updates, integrations, or testing, custom events provide powerful tools for dynamic interaction within your web app.

Here's my take: In JavaScript, you can create and dispatch custom events using the **`CustomEvent`** constructor along with the DOM **`dispatchEvent()`** method.

This is the standard pattern for decoupling component logic or broadcasting custom state changes across your application without tight dependencies.

---

### Step-by-Step Implementation

Creating a custom event involves three steps:

1. **Define/Instantiate** the event using `new CustomEvent()`.
2. **Listen** for the event using `addEventListener()`.
3. **Dispatch** (trigger) the event using `dispatchEvent()`.

```javascript
// 1. Define the Custom Event
// Pass custom payload data inside the 'detail' property!
const userLoginEvent = new CustomEvent("userLogin", {
  detail: {
    username: "alex_dev",
    role: "admin",
    timestamp: Date.now(),
  },
  bubbles: true, // Allows the event to bubble up through the DOM tree
  cancelable: true, // Allows event.preventDefault() to stop the action
});

// 2. Add an Event Listener (Target can be document, window, or any DOM element)
document.addEventListener("userLogin", (event) => {
  // Access custom payload data via event.detail
  const { username, role } = event.detail;
  console.log(`🎉 Welcome back, ${username}! (Role: ${role})`);
});

// 3. Dispatch/Trigger the Custom Event
document.dispatchEvent(userLoginEvent);
```

---

### Real-World Example: Component Communication

Here is how custom events can be used to send messages from a child element up to a parent component (or the `document`):

```javascript
// Function simulating a Shopping Cart Checkout action
function handleCheckout(cartItems) {
  const checkoutButton = document.querySelector("#checkout-btn");

  // Create an event to notify the rest of the application
  const cartClearedEvent = new CustomEvent("cart:cleared", {
    detail: {
      itemCount: cartItems.length,
      status: "success",
    },
    bubbles: true, // Enables DOM bubbling
  });

  // Dispatch from the specific button element
  checkoutButton.dispatchEvent(cartClearedEvent);
}

// Global listener listening for cart updates
document.addEventListener("cart:cleared", (e) => {
  console.log(`Cart updated: ${e.detail.itemCount} items were processed.`);
});
```

---

### Key Options & Configuration

When instantiating `new CustomEvent(eventName, options)`:

| Option           | Type      | Default | Purpose                                                       |
| ---------------- | --------- | ------- | ------------------------------------------------------------- |
| **`detail`**     | `any`     | `null`  | The payload data passed to event listeners (`e.detail`).      |
| **`bubbles`**    | `boolean` | `false` | Whether the event bubbles up through parent DOM elements.     |
| **`cancelable`** | `boolean` | `false` | Whether the event can be canceled using `e.preventDefault()`. |

---

### Custom Event vs. `Event` Constructor

- **`new Event('click')`:** Used for generic DOM events without custom data payloads.
- **`new CustomEvent('login', { detail: {...} })`:** Designed specifically for passing custom application data in the `detail` property.

How do you build a pure JavaScript EventEmitter class (Pub/Sub pattern) without relying on DOM elements?

Here's my take: To build a pure JavaScript **EventEmitter** (Publish/Subscribe pattern), you maintain an in-memory dictionary where keys represent event names and values are arrays of subscriber callback functions.

This pattern allows components to communicate asynchronously without coupling to DOM elements or relying on browser events.

---

### Production-Ready EventEmitter Implementation

This class supports subscribing (`on`), one-time handlers (`once`), publishing (`emit`), unsubscribing (`off`), and bulk listener management:

```javascript
class EventEmitter {
  constructor() {
    // Map to store event names and array of listener callbacks
    this._events = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {Function} Unsubscribe function for easy cleanup
   */
  on(event, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }

    if (!this._events.has(event)) {
      this._events.set(event, []);
    }

    this._events.get(event).push(listener);

    // Return a handy unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Subscribe to an event ONCE. Auto-unsubscribes after first invocation.
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   */
  once(event, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }

    // Wrapper function that invokes the original listener and then removes itself
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };

    // Store reference to original listener so off(event, listener) still works
    wrapper.originalListener = listener;

    this.on(event, wrapper);
  }

  /**
   * Publish/Trigger an event, invoking all registered listeners with arguments.
   * @param {string} event - Event name
   * @param {...any} args - Arguments passed to listeners
   * @returns {boolean} True if event had listeners, false otherwise
   */
  emit(event, ...args) {
    if (!this._events.has(event)) {
      return false;
    }

    // Clone the array to safely handle listeners that call off() during execution
    const listeners = [...this._events.get(event)];

    listeners.forEach((listener) => {
      try {
        listener.apply(this, args);
      } catch (err) {
        console.error(`Error in event listener for "${event}":`, err);
      }
    });

    return true;
  }

  /**
   * Remove a specific listener from an event.
   * @param {string} event - Event name
   * @param {Function} listener - Callback to remove
   */
  off(event, listener) {
    if (!this._events.has(event)) return this;

    const listeners = this._events.get(event);

    const filtered = listeners.filter(
      (fn) => fn !== listener && fn.originalListener !== listener,
    );

    if (filtered.length > 0) {
      this._events.set(event, filtered);
    } else {
      this._events.delete(event);
    }

    return this;
  }

  /**
   * Remove all listeners for a given event, or all events entirely.
   * @param {string} [event] - Optional event name
   */
  removeAllListeners(event) {
    if (event) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
  }
}
```

---

### Step-by-Step Usage Example

```javascript
const emitter = new EventEmitter();

// 1. Regular Subscription
const unsubscribeUserLogin = emitter.on("user:login", (user) => {
  console.log(`[Analytics] Logged in user: ${user.name}`);
});

// 2. Additional Subscriber on same event
emitter.on("user:login", (user) => {
  console.log(`[UI] Updating header profile for ${user.name}`);
});

// 3. One-Time Subscription
emitter.once("app:init", () => {
  console.log("🚀 App initialized! (Runs only once)");
});

// --- Triggering Events ---

emitter.emit("app:init");
// Output: "🚀 App initialized! (Runs only once)"

emitter.emit("app:init");
// Output: (Nothing happens — auto-unsubscribed!)

emitter.emit("user:login", { name: "Sarah", id: 101 });
// Output:
// [Analytics] Logged in user: Sarah
// [UI] Updating header profile for Sarah

// --- Unsubscribing ---

unsubscribeUserLogin(); // Clean up using returned function

emitter.emit("user:login", { name: "Alex", id: 102 });
// Output:
// [UI] Updating header profile for Alex  (Analytics listener was removed)
```

---

### Key Design Considerations

1. **Array Cloning in `emit`:** Cloning `const listeners = [...this._events.get(event)]` before iteration prevents subtle bugs if a callback unsubscribes itself during execution.
2. **`Map` for Performance:** Using a native `Map` object provides faster lookups, insertions, and deletions ($\mathcal{O}(1)$) compared to standard plain objects.
3. **Error Isolation:** Wrapping `listener.apply()` in a `try...catch` ensures an unhandled error inside one subscriber does not crash or stop other listeners from executing.

How do custom DOM events interact with modern frameworks like React or Web Components?

Here's my take: Custom DOM events interact differently depending on whether you are working with **Web Components** (where custom events are native) or **React** (which uses a Synthetic Event system).

---

### 1. Web Components (Native Custom Events)

Custom elements natively dispatch `CustomEvent` instances to communicate upward to parent components or containers.

#### Dispatching from a Custom Element

Inside a Web Component, trigger custom events using `this.dispatchEvent()`. Crucially, set `bubbles: true` and `composed: true` so the event can **cross the Shadow DOM boundary** into the main document tree.

```javascript
class UserProfileCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <button id="follow-btn">Follow User</button>
    `;

    this.shadowRoot
      .querySelector("#follow-btn")
      .addEventListener("click", () => {
        // Dispatch custom event across Shadow DOM boundary
        this.dispatchEvent(
          new CustomEvent("user-followed", {
            detail: { userId: "usr_99", timestamp: Date.now() },
            bubbles: true, // Let it bubble up parent DOM nodes
            composed: true, // CRITICAL: Allows event to cross Shadow DOM boundary
          }),
        );
      });
  }
}

customElements.define("user-profile-card", UserProfileCard);
```

#### Why `composed: true` Matters

By default, native DOM events dispatched inside a Shadow Root stop at the Shadow Boundary. Setting `composed: true` allows the event to escape the Shadow Root into the outer light DOM so parent wrappers can listen for it normally.

---

### 2. Custom Events in React

React uses its own **Synthetic Event System**, which wraps native events and delegates them at the root level. Because of this, React handles custom events differently depending on the React version.

#### React 19+ Behavior

React 19 natively supports Web Components and Custom Events! You can listen directly to custom DOM events on custom element JSX tags like standard props:

```jsx
// Works seamlessly in React 19+
function ParentApp() {
  const handleFollow = (e) => {
    console.log("Followed user ID:", e.detail.userId);
  };

  return <user-profile-card onuser-followed={handleFollow} />;
}
```

#### React 18 & Earlier (Ref Pattern)

In React 18 and earlier, JSX props like `onCustomEvent={...}` do **not** register native event listeners on custom elements. You must attach a native `addEventListener` manually using a React `ref` or `useEffect`:

```jsx
import { useEffect, useRef } from "react";

function LegacyReactWrapper() {
  const cardRef = useRef(null);

  useEffect(() => {
    const cardNode = cardRef.current;
    if (!cardNode) return;

    // Handler to extract e.detail payload
    const handleCustomEvent = (event) => {
      console.log("User followed payload:", event.detail);
    };

    // Attach native DOM event listener
    cardNode.addEventListener("user-followed", handleCustomEvent);

    // Cleanup listener on unmount
    return () =>
      cardNode.removeEventListener("user-followed", handleCustomEvent);
  }, []);

  return <user-profile-card ref={cardRef} />;
}
```

---

### Comparison Summary

| Feature / Environment   | Web Components (Shadow DOM)            | React 18 & Earlier                  | React 19+                         |
| ----------------------- | -------------------------------------- | ----------------------------------- | --------------------------------- |
| **Listener Syntax**     | `element.addEventListener('my-event')` | Manual `ref` + `useEffect` listener | JSX Prop (`onmy-event={...}`)     |
| **Shadow DOM Crossing** | Requires `composed: true`              | Requires `composed: true`           | Requires `composed: true`         |
| **Event Type**          | Native `CustomEvent`                   | Native `CustomEvent`                | Synthetic / Native hybrid wrapper |
| **Data Payload Access** | `e.detail`                             | `e.detail`                          | `e.detail`                        |
