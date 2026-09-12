Memory leaks in front-end applications occur when references to objects, DOM elements, or handlers that are no longer needed are unintentionally retained in memory, preventing the JavaScript garbage collector from reclaiming them.

---

### Common Use Case: Dynamic Component Lifecycle (Event Listeners & Timers)

A classic scenario is a component that subscribes to global events (like window resize, scroll, or websockets) or starts an interval timer, but fails to clean them up when removed from the DOM.

#### The Bad Example (Memory Leak)

In this implementation, every time the component mounts and unmounts, a new listener and interval remain pinned in the global scope. Closures retain the entire component scope in memory indefinitely:

```javascript
class BadStockWidget {
  constructor(container) {
    this.container = container;
    this.data = new Array(100000).fill("payload"); // Large object in memory
    this.init();
  }

  init() {
    // 1. Uncleaned Global Listener: Keeps `this` reachable via the window object
    window.addEventListener('resize', () => {
      console.log('Window resized', this.data.length);
    });

    // 2. Uncleaned Interval: Ticks forever, keeping `this` in memory
    setInterval(() => {
      console.log('Fetching live updates...', this.data.length);
    }, 1000);
  }

  destroy() {
    // Only removes visual elements; listeners and timers stay alive
    this.container.innerHTML = '';
  }
}

```

---

### How to Control and Avoid It

To prevent leaks, follow these core principles:

* **Tear down subscriptions and timers** explicitly during destruction or unmounting.
* **Keep references to event handlers** so they can be removed with `removeEventListener`.
* **Use `AbortController**` to cancel fetch requests and clean up multiple event listeners simultaneously.
* **Use `WeakMap` or `WeakRef**` when associating metadata with DOM nodes or objects that should be garbage collected when the node itself is removed.

---

#### The Good Example (Clean Memory Management)

```javascript
class ControlledStockWidget {
  constructor(container) {
    this.container = container;
    this.data = new Array(100000).fill("payload");
    this.abortController = new AbortController();
    this.intervalId = null;

    this.init();
  }

  init() {
    const { signal } = this.abortController;

    // 1. Pass AbortSignal to auto-remove event listener upon abort()
    window.addEventListener(
      'resize',
      () => {
        console.log('Window resized', this.data.length);
      },
      { signal }
    );

    // 2. Retain the timer ID so it can be cleared
    this.intervalId = setInterval(() => {
      console.log('Fetching live updates...', this.data.length);
    }, 1000);
  }

  destroy() {
    // Clean up timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Clean up all event listeners bound to this signal at once
    this.abortController.abort();

    // Clear DOM and release internal references
    this.container.innerHTML = '';
    this.data = null;
  }
}

```

---

### React Functional Component Equivalent

In modern frameworks like React, handle this in the `useEffect` cleanup return function:

```javascript
import React, { useEffect, useState } from 'react';

function StockWidget() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const handleResize = () => {
      console.log('Window resized');
    };

    window.addEventListener('resize', handleResize, { signal: controller.signal });

    const intervalId = setInterval(() => {
      console.log('Fetching live updates...');
    }, 1000);

    // Explicit cleanup callback triggered before unmount or re-run
    return () => {
      controller.abort(); // Cleans up resize listener
      clearInterval(intervalId); // Cleans up interval
    };
  }, []);

  return <div>Stock Widget Active</div>;
}

```

---

### Key Takeaways for Controlling Leaks

* **Event Listeners**: Always pair `addEventListener` with `removeEventListener`, or pass an `AbortSignal`.
* **Timers**: Store timer references and always execute `clearInterval` or `clearTimeout`.
* **Detached DOM Nodes**: Avoid storing references to DOM elements in global or long-lived JavaScript arrays/objects after they have been removed from the document tree.
* **Observables & Streams**: Call `.unsubscribe()` or use operators like `takeUntilDestroyed` (Angular) / `takeUntil`.
