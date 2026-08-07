# Implement Event-Driven Key-Value Store

This is a great **Frontend / JavaScript System Design** interview question.

It combines:

✅ Key-Value Store

✅ Observer Pattern

✅ Pub/Sub

✅ Event-Driven Architecture

✅ State Management

✅ API Design

Event-driven systems typically use a publish-subscribe (Pub/Sub) or observer pattern where subscribers listen for changes and are notified when events occur. [\[skilled.dev\]](https://skilled.dev/course/pub-sub-and-event-driven-programming), [\[javascript...english.io\]](https://javascript.plainenglish.io/building-resilient-frontend-systems-with-event-driven-javascript-1bda090b9620), [\[medium.com\]](https://medium.com/@ignatovich.dm/implementing-the-pub-sub-pattern-in-javascript-a-guide-for-beginners-44714a76d8c7)

***

# Problem Statement

Implement:

```js
const store = new EventStore();

store.set("name", "Sudhir");

store.get("name");

store.on("name", (oldVal, newVal) => {
  console.log(oldVal, newVal);
});

store.set("name", "John");
```

Output

```text
Sudhir John
```

***

# Expected API

```js
store.set(key, value);

store.get(key);

store.has(key);

store.delete(key);

store.on(key, callback);

store.off(key, callback);
```

***

# Data Structure

```text
Store
 ├── values
 │     ├── name => Sudhir
 │     └── age => 30
 │
 └── listeners
       ├── name => [fn1, fn2]
       └── age => [fn3]
```

A common implementation stores values separately from event subscribers/listeners. [\[javascript...english.io\]](https://javascript.plainenglish.io/big-tech-interview-question-build-a-key-value-store-with-listeners-abe34c15b93a), [\[medium.com\]](https://medium.com/@ignatovich.dm/implementing-the-pub-sub-pattern-in-javascript-a-guide-for-beginners-44714a76d8c7)

***

# Basic Solution

```js
class EventStore {
  constructor() {
    this.data = new Map();

    this.listeners =
      new Map();
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }

  set(key, value) {
    const oldValue =
      this.data.get(key);

    this.data.set(
      key,
      value
    );

    this.emit(
      key,
      oldValue,
      value
    );
  }

  delete(key) {
    const oldValue =
      this.data.get(key);

    this.data.delete(
      key
    );

    this.emit(
      key,
      oldValue,
      undefined
    );
  }

  on(key, callback) {
    if (
      !this.listeners.has(
        key
      )
    ) {
      this.listeners.set(
        key,
        new Set()
      );
    }

    this.listeners
      .get(key)
      .add(callback);
  }

  off(key, callback) {
    this.listeners
      .get(key)
      ?.delete(
        callback
      );
  }

  emit(
    key,
    oldVal,
    newVal
  ) {
    const handlers =
      this.listeners.get(
        key
      );

    if (!handlers) {
      return;
    }

    handlers.forEach(
      callback =>
        callback(
          oldVal,
          newVal
        )
    );
  }
}
```

***

# Usage

```js
const store =
  new EventStore();

store.on(
  "name",
  (
    oldValue,
    newValue
  ) => {
    console.log(
      `Changed:
      ${oldValue}
      ->
      ${newValue}`
    );
  }
);

store.set(
  "name",
  "Sudhir"
);

store.set(
  "name",
  "John"
);
```

Output

```text
Changed:
undefined -> Sudhir

Changed:
Sudhir -> John
```

***

# Improve: Avoid Duplicate Events

Don't emit if value didn't change.

```js
set(key, value) {
  const oldValue =
      this.data.get(key);

  if (
      Object.is(
          oldValue,
          value
      )
  ) {
      return;
  }

  this.data.set(
      key,
      value
  );

  this.emit(
      key,
      oldValue,
      value
  );
}
```

Avoiding unnecessary notifications when values do not change is a commonly discussed design improvement for listener-based stores. [\[javascript...english.io\]](https://javascript.plainenglish.io/big-tech-interview-question-build-a-key-value-store-with-listeners-abe34c15b93a)

***

# Global Change Events

```js
store.on(
  "*",
  event => {
    console.log(
      event
    );
  }
);
```

Event:

```js
{
  key: "name",
  oldValue: "Sudhir",
  newValue: "John"
}
```

***

# Unsubscribe Support

```js
on(key, callback) {
  ...

  return () =>
      this.off(
          key,
          callback
      );
}
```

Usage:

```js
const unsubscribe =
  store.on(
    "name",
    callback
  );

unsubscribe();
```

Returning an unsubscribe handler is a common Pub/Sub design pattern. [\[javascript...english.io\]](https://javascript.plainenglish.io/big-tech-interview-question-build-a-key-value-store-with-listeners-abe34c15b93a), [\[medium.com\]](https://medium.com/@ignatovich.dm/implementing-the-pub-sub-pattern-in-javascript-a-guide-for-beginners-44714a76d8c7)

***

# React Store Version

```js
const store =
  new EventStore();
```

```tsx
function useStore(key) {
  const [value,
    setValue] =
      useState(
        store.get(key)
      );

  useEffect(() => {
    return store.on(
      key,
      (
        _,
        newValue
      ) => {
        setValue(
          newValue
        );
      }
    );
  }, [key]);

  return value;
}
```

Usage:

```tsx
const name =
  useStore("name");
```

***

# Advanced Version

Support namespaced events:

```js
store.on(
  "user:name",
  callback
);

store.on(
  "user:*",
  callback
);

store.on(
  "*",
  callback
);
```

***

# Complexity

### Set

```text
O(k)

k = listeners on key
```

### Get

```text
O(1)
```

### Subscribe

```text
O(1)
```

### Unsubscribe

```text
O(1)
```

(using `Set`)

***

# Senior Interview Answer

> I would implement the store using a `Map` for values and a second `Map` for listeners. When `set()` updates a value, the store emits a change event to all subscribers. This follows the Observer/Pub-Sub pattern, keeps components loosely coupled, supports subscriptions and unsubscriptions, and forms the foundation of event-driven state management systems. [\[skilled.dev\]](https://skilled.dev/course/pub-sub-and-event-driven-programming), [\[javascript...english.io\]](https://javascript.plainenglish.io/building-resilient-frontend-systems-with-event-driven-javascript-1bda090b9620), [\[linkedin.com\]](https://www.linkedin.com/pulse/event-driven-programming-observer-pattern-javascript-aman-yerpude-efddf)

Your implementation outline and API design for an **Event-Driven Key-Value Store** are solid. It clearly shows how state storage (`Map`) interacts with event dispatching (Pub/Sub) to form the foundation of state management systems like Zustand or Redux.

To bring this implementation to a **senior production-grade standard**, three critical technical considerations must be addressed:

1. **`useSyncExternalStore` for React:** Custom hooks built with basic `useState` + `useEffect` suffer from **tearing** in React 18+ concurrent rendering.
2. **Wildcard & Namespaced Event Matching:** Supporting `user:*` and `*` requires structured prefix routing during the `emit()` phase.
3. **Safe Async & Error Handling in Callbacks:** A throwing callback in one subscriber should never break execution for other listeners.

---

### Production-Grade EventStore Implementation

This comprehensive solution includes **wildcards (`*`)**, **namespaced channels (`user:*`)**, **unsubscribe handlers**, **error isolation**, and **deep/shallow equality prevention**.

```javascript
class EventStore {
  constructor() {
    this.data = new Map();
    this.listeners = new Map(); // key -> Set<callback>
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }

  set(key, value) {
    const oldValue = this.data.get(key);

    // 1. Prevent duplicate emissions using Object.is
    if (this.data.has(key) && Object.is(oldValue, value)) {
      return false;
    }

    this.data.set(key, value);
    this.emit(key, oldValue, value);
    return true;
  }

  delete(key) {
    if (!this.data.has(key)) {
      return false;
    }

    const oldValue = this.data.get(key);
    this.data.delete(key);
    this.emit(key, oldValue, undefined);
    return true;
  }

  /**
   * Subscribe to a key, namespace pattern ('user:*'), or global wildcard ('*')
   * @returns {Function} Unsubscribe cleanup function
   */
  on(keyPattern, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Listener callback must be a function');
    }

    if (!this.listeners.has(keyPattern)) {
      this.listeners.set(keyPattern, new Set());
    }

    const handlers = this.listeners.get(keyPattern);
    handlers.add(callback);

    // Returns O(1) unsubscribe function
    return () => {
      this.off(keyPattern, callback);
    };
  }

  off(keyPattern, callback) {
    const handlers = this.listeners.get(keyPattern);
    if (handlers) {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.listeners.delete(keyPattern);
      }
    }
  }

  /**
   * Dispatches events to key-specific, namespace ('prefix:*'), and global ('*') listeners
   */
  emit(key, oldValue, newValue) {
    const matchedCallbacks = new Set();

    // 1. Exact Key Matching
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => matchedCallbacks.add(cb));
    }

    // 2. Namespaced Wildcards (e.g. 'user:name' matches 'user:*')
    if (key.includes(':')) {
      const namespace = key.split(':')[0];
      const namespacePattern = `${namespace}:*`;
      if (this.listeners.has(namespacePattern)) {
        this.listeners.get(namespacePattern).forEach(cb => matchedCallbacks.add(cb));
      }
    }

    // 3. Global Wildcard '*'
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => matchedCallbacks.add(cb));
    }

    // 4. Safely execute callbacks (Isolate subscriber errors)
    const eventPayload = { key, oldValue, newValue };
    matchedCallbacks.forEach(callback => {
      try {
        callback(oldValue, newValue, eventPayload);
      } catch (error) {
        console.error(`Error in EventStore listener for key "${key}":`, error);
      }
    });
  }
}

```

---

### React Concurrent Mode Integration (`useSyncExternalStore`)

In modern React (React 18+), building state subscriptions via `useEffect` + `useState` causes **tearing** (where different components render different state snapshots during a concurrent render pass).

The correct pattern is **`useSyncExternalStore`**:

```tsx
import { useSyncExternalStore, useCallback } from 'react';

const globalStore = new EventStore();

/**
 * Production-ready concurrent React hook for EventStore
 */
export function useStore(key) {
  // 1. Define subscription function for useSyncExternalStore
  const subscribe = useCallback(
    (onStoreChange) => {
      // Subscribe to key changes and notify React
      return globalStore.on(key, () => onStoreChange());
    },
    [key]
  );

  // 2. Define snapshot getter
  const getSnapshot = useCallback(() => {
    return globalStore.get(key);
  }, [key]);

  // 3. React manages synchronization safely across concurrent transitions
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

```

---

### Comparison of Subscriber Patterns

| Strategy                          | Basic `useState` + `useEffect`       | Modern `useSyncExternalStore`             |
| --------------------------------- | ------------------------------------ | ----------------------------------------- |
| **React 18 Concurrent Rendering** | Susceptible to **Tearing**           | **Tearing-free & Thread-safe**            |
| **Initial Render Value**          | Requires initial state setup         | Synchronous snapshot read                 |
| **Cleanup Logic**                 | Manual return in `useEffect`         | Handled automatically by React runtime    |
| **SSR Support**                   | Triggers hydration mismatch warnings | Supports 3rd `getServerSnapshot` argument |

Extending an event-driven store to support **async queues** and **priority listeners** requires two key architectural shifts:

1. **Priority Scheduling:** Subscribers must be stored in an ordered collection (e.g., a **Max-Heap** or a sorted array) ordered by weight/priority rather than insertion order.
2. **Async Execution Pipelines:** Event dispatching changes from a fire-and-forget sync loop into a **Queue/Pipeline runner** that supports sequential (`await`), parallel (`Promise.all`), or middleware-style execution.

---

### Core Concepts & Architecture

```
                 emit(key, value)
                        │
                        ▼
            ┌───────────────────────┐
            │  Async Event Queue    │  <-- Buffers events (Debounce / Batch)
            └───────────┬───────────┘
                        │ (Process Queue)
                        ▼
            ┌───────────────────────┐
            │ Priority Dispatcher   │  <-- Sorts subscribers by priority
            └───────────┬───────────┘
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
[Priority: 100]   [Priority: 50]    [Priority: 10]
 (e.g., Auth Check) (e.g., Sync UI)   (e.g., Analytics)

```

---

### Production Implementation

Here is a full implementation featuring **Priority Listeners**, **Async Execution Control (Waterfall vs. Parallel)**, and **Cancellable Event Pipelines**:

```javascript
class PriorityAsyncEventStore {
  constructor() {
    this.data = new Map();
    // Maps key -> Array<{ priority: number, callback: Function, async: boolean }>
    this.listeners = new Map();
    // Async event processing queue
    this.eventQueue = [];
    this.isProcessingQueue = false;
  }

  get(key) {
    return this.data.get(key);
  }

  /**
   * Subscribe to changes with priority and execution options.
   * Higher priority numbers run FIRST (e.g., 100 runs before 0).
   */
  on(key, callback, options = {}) {
    const { priority = 0 } = options;

    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    const subscriber = { priority, callback };
    const queue = this.listeners.get(key);

    // Insert subscriber in sorted position (higher priority first)
    const insertIndex = queue.findIndex(sub => sub.priority < priority);
    if (insertIndex === -1) {
      queue.push(subscriber);
    } else {
      queue.splice(insertIndex, 0, subscriber);
    }

    // Return O(1) Unsubscribe handler
    return () => {
      const currentQueue = this.listeners.get(key);
      if (currentQueue) {
        this.listeners.set(key, currentQueue.filter(sub => sub.callback !== callback));
      }
    };
  }

  /**
   * Set a key and queue an asynchronous change event
   */
  async set(key, value, mode = 'waterfall') {
    const oldValue = this.data.get(key);

    if (this.data.has(key) && Object.is(oldValue, value)) {
      return false;
    }

    this.data.set(key, value);

    // Enqueue event for processing
    return new Promise((resolve, reject) => {
      this.eventQueue.push({ key, oldValue, newValue: value, mode, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process queued events sequentially to maintain ordering guarantees
   */
  async processQueue() {
    if (this.isProcessingQueue || this.eventQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      try {
        await this.dispatchAsync(event);
        event.resolve(true);
      } catch (err) {
        console.error(`[EventStore] Failed to process event for key "${event.key}":`, err);
        event.reject(err);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Dispatch listeners based on execution mode
   */
  async dispatchAsync({ key, oldValue, newValue, mode }) {
    const subscribers = this.listeners.get(key) || [];
    if (subscribers.length === 0) return;

    // Create a context object allowing high-priority listeners to stop propagation
    const eventContext = {
      key,
      oldValue,
      newValue,
      isCancelled: false,
      stopPropagation() {
        this.isCancelled = true;
      }
    };

    if (mode === 'waterfall') {
      // MODE 1: Waterfall / Sequential (High priority completes BEFORE lower priority runs)
      for (const { callback } of subscribers) {
        if (eventContext.isCancelled) break; // Stop pipeline if cancelled
        await callback(oldValue, newValue, eventContext);
      }
    } else if (mode === 'parallel') {
      // MODE 2: Parallel (All listeners start concurrently, but priority sorted invocation)
      const promises = subscribers.map(({ callback }) =>
        Promise.resolve().then(() => callback(oldValue, newValue, eventContext))
      );
      await Promise.allSettled(promises);
    }
  }
}

```

---

### Real-World Example & Usage

#### Scenario: User Authentication State Change

We have three listeners with different priorities:

1. **Auth Validator (Priority 100):** Must validate the token asynchronously **first**. If invalid, stops propagation.
2. **Database Sync (Priority 50):** Persists session data.
3. **Analytics (Priority 0):** Sends non-blocking telemetry.

```javascript
const store = new PriorityAsyncEventStore();

// Low Priority Listener (Analytics)
store.on('user', async (oldVal, newVal) => {
  console.log('[Analytics] Logging login for:', newVal.name);
}, { priority: 0 });

// High Priority Listener (Validation / Guard)
store.on('user', async (oldVal, newVal, ctx) => {
  console.log('[Auth Guard] Validating user session...');
  
  // Simulate async API validation delay
  await new Promise(r => setTimeout(r, 100));

  if (!newVal.token) {
    console.log('[Auth Guard] Invalid token! Cancelling event pipeline.');
    ctx.stopPropagation(); // Prevents lower priority listeners from running!
  }
}, { priority: 100 });

// Medium Priority Listener (UI Sync)
store.on('user', async (oldVal, newVal) => {
  console.log('[UI Sync] Rendering user dashboard for:', newVal.name);
}, { priority: 50 });

// --- EXECUTION TEST ---
async function run() {
  console.log('--- TEST 1: Valid Login ---');
  await store.set('user', { name: 'Alice', token: 'valid-secret-123' });

  console.log('\n--- TEST 2: Invalid Login (Pipeline Cancelled) ---');
  await store.set('user', { name: 'Bob', token: null });
}

run();

```

#### Output Log

```text
--- TEST 1: Valid Login ---
[Auth Guard] Validating user session...
[UI Sync] Rendering user dashboard for: Alice
[Analytics] Logging login for: Alice

--- TEST 2: Invalid Login (Pipeline Cancelled) ---
[Auth Guard] Validating user session...
[Auth Guard] Invalid token! Cancelling event pipeline.

```

---

### Key Architectural Modes Explained

| Mode / Feature                             | How It Works                                                                    | Primary Use Case                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Priority Queue**                         | Maintains an array ordered by `priority` field ($O(N)$ insertion, $O(1)$ read). | Ensuring Guards/Validators run before UI or Analytics.         |
| **Waterfall (`await`)**                    | Awaits each listener sequentially before starting the next.                     | Workflows where step $B$ depends on async step $A$ completing. |
| **Parallel (`Promise.allSettled`)**        | Fires all callbacks simultaneously in order of priority.                        | Fast notifications where tasks don't block each other.         |
| **Event Cancellation (`stopPropagation`)** | Allows high-priority listeners to halt remaining listeners.                     | Access control, input validation, and rate limiting.           |

Extending an event-driven store to support **async queues** and **priority listeners** requires two key architectural shifts:

1. **Priority Scheduling:** Subscribers must be stored in an ordered collection (e.g., a **Max-Heap** or a sorted array) ordered by weight/priority rather than insertion order.
2. **Async Execution Pipelines:** Event dispatching changes from a fire-and-forget sync loop into a **Queue/Pipeline runner** that supports sequential (`await`), parallel (`Promise.all`), or middleware-style execution.

---

### Core Concepts & Architecture

```
                 emit(key, value)
                        │
                        ▼
            ┌───────────────────────┐
            │  Async Event Queue    │  <-- Buffers events (Debounce / Batch)
            └───────────┬───────────┘
                        │ (Process Queue)
                        ▼
            ┌───────────────────────┐
            │ Priority Dispatcher   │  <-- Sorts subscribers by priority
            └───────────┬───────────┘
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
[Priority: 100]   [Priority: 50]    [Priority: 10]
 (e.g., Auth Check) (e.g., Sync UI)   (e.g., Analytics)

```

---

### Production Implementation

Here is a full implementation featuring **Priority Listeners**, **Async Execution Control (Waterfall vs. Parallel)**, and **Cancellable Event Pipelines**:

```javascript
class PriorityAsyncEventStore {
  constructor() {
    this.data = new Map();
    // Maps key -> Array<{ priority: number, callback: Function, async: boolean }>
    this.listeners = new Map();
    // Async event processing queue
    this.eventQueue = [];
    this.isProcessingQueue = false;
  }

  get(key) {
    return this.data.get(key);
  }

  /**
   * Subscribe to changes with priority and execution options.
   * Higher priority numbers run FIRST (e.g., 100 runs before 0).
   */
  on(key, callback, options = {}) {
    const { priority = 0 } = options;

    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    const subscriber = { priority, callback };
    const queue = this.listeners.get(key);

    // Insert subscriber in sorted position (higher priority first)
    const insertIndex = queue.findIndex(sub => sub.priority < priority);
    if (insertIndex === -1) {
      queue.push(subscriber);
    } else {
      queue.splice(insertIndex, 0, subscriber);
    }

    // Return O(1) Unsubscribe handler
    return () => {
      const currentQueue = this.listeners.get(key);
      if (currentQueue) {
        this.listeners.set(key, currentQueue.filter(sub => sub.callback !== callback));
      }
    };
  }

  /**
   * Set a key and queue an asynchronous change event
   */
  async set(key, value, mode = 'waterfall') {
    const oldValue = this.data.get(key);

    if (this.data.has(key) && Object.is(oldValue, value)) {
      return false;
    }

    this.data.set(key, value);

    // Enqueue event for processing
    return new Promise((resolve, reject) => {
      this.eventQueue.push({ key, oldValue, newValue: value, mode, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process queued events sequentially to maintain ordering guarantees
   */
  async processQueue() {
    if (this.isProcessingQueue || this.eventQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      try {
        await this.dispatchAsync(event);
        event.resolve(true);
      } catch (err) {
        console.error(`[EventStore] Failed to process event for key "${event.key}":`, err);
        event.reject(err);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Dispatch listeners based on execution mode
   */
  async dispatchAsync({ key, oldValue, newValue, mode }) {
    const subscribers = this.listeners.get(key) || [];
    if (subscribers.length === 0) return;

    // Create a context object allowing high-priority listeners to stop propagation
    const eventContext = {
      key,
      oldValue,
      newValue,
      isCancelled: false,
      stopPropagation() {
        this.isCancelled = true;
      }
    };

    if (mode === 'waterfall') {
      // MODE 1: Waterfall / Sequential (High priority completes BEFORE lower priority runs)
      for (const { callback } of subscribers) {
        if (eventContext.isCancelled) break; // Stop pipeline if cancelled
        await callback(oldValue, newValue, eventContext);
      }
    } else if (mode === 'parallel') {
      // MODE 2: Parallel (All listeners start concurrently, but priority sorted invocation)
      const promises = subscribers.map(({ callback }) =>
        Promise.resolve().then(() => callback(oldValue, newValue, eventContext))
      );
      await Promise.allSettled(promises);
    }
  }
}

```

---

### Real-World Example & Usage

#### Scenario: User Authentication State Change

We have three listeners with different priorities:

1. **Auth Validator (Priority 100):** Must validate the token asynchronously **first**. If invalid, stops propagation.
2. **Database Sync (Priority 50):** Persists session data.
3. **Analytics (Priority 0):** Sends non-blocking telemetry.

```javascript
const store = new PriorityAsyncEventStore();

// Low Priority Listener (Analytics)
store.on('user', async (oldVal, newVal) => {
  console.log('[Analytics] Logging login for:', newVal.name);
}, { priority: 0 });

// High Priority Listener (Validation / Guard)
store.on('user', async (oldVal, newVal, ctx) => {
  console.log('[Auth Guard] Validating user session...');
  
  // Simulate async API validation delay
  await new Promise(r => setTimeout(r, 100));

  if (!newVal.token) {
    console.log('[Auth Guard] Invalid token! Cancelling event pipeline.');
    ctx.stopPropagation(); // Prevents lower priority listeners from running!
  }
}, { priority: 100 });

// Medium Priority Listener (UI Sync)
store.on('user', async (oldVal, newVal) => {
  console.log('[UI Sync] Rendering user dashboard for:', newVal.name);
}, { priority: 50 });

// --- EXECUTION TEST ---
async function run() {
  console.log('--- TEST 1: Valid Login ---');
  await store.set('user', { name: 'Alice', token: 'valid-secret-123' });

  console.log('\n--- TEST 2: Invalid Login (Pipeline Cancelled) ---');
  await store.set('user', { name: 'Bob', token: null });
}

run();

```

#### Output Log

```text
--- TEST 1: Valid Login ---
[Auth Guard] Validating user session...
[UI Sync] Rendering user dashboard for: Alice
[Analytics] Logging login for: Alice

--- TEST 2: Invalid Login (Pipeline Cancelled) ---
[Auth Guard] Validating user session...
[Auth Guard] Invalid token! Cancelling event pipeline.

```

---

### Key Architectural Modes Explained

| Mode / Feature                             | How It Works                                                                    | Primary Use Case                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Priority Queue**                         | Maintains an array ordered by `priority` field ($O(N)$ insertion, $O(1)$ read). | Ensuring Guards/Validators run before UI or Analytics.         |
| **Waterfall (`await`)**                    | Awaits each listener sequentially before starting the next.                     | Workflows where step $B$ depends on async step $A$ completing. |
| **Parallel (`Promise.allSettled`)**        | Fires all callbacks simultaneously in order of priority.                        | Fast notifications where tasks don't block each other.         |
| **Event Cancellation (`stopPropagation`)** | Allows high-priority listeners to halt remaining listeners.                     | Access control, input validation, and rate limiting.           |
