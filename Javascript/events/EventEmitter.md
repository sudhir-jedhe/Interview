Here is the complete guide and solution for LeetCode #2694: **Event Emitter** (designing a custom subscribe/emit event handler class in JavaScript).

---

### Solution

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map(); // Event name -> Array of callback functions
  }

  /**
   * @param {string} eventName
   * @param {Function} callback
   * @return {Object} containing unsubscribe method
   */
  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners = this.events.get(eventName);
    listeners.push(callback);

    return {
      unsubscribe: () => {
        const index = listeners.indexOf(callback);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * @param {string} eventName
   * @param {Array} args
   * @return {Array} results of invoking all callbacks subscribed to eventName
   */
  emit(eventName, args = []) {
    if (!this.events.has(eventName)) {
      return [];
    }

    const listeners = this.events.get(eventName);
    const results = [];

    for (const callback of listeners) {
      results.push(callback(...args));
    }

    return results;
  }
}

```

---

### Alternative Implementation Approaches

#### 1. Plain Object Storage (`{}`)

Using a standard JavaScript object instead of a `Map`:

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);

    return {
      unsubscribe: () => {
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
      }
    };
  }

  emit(eventName, args = []) {
    if (!this.events[eventName]) return [];
    return this.events[eventName].map(callback => callback(...args));
  }
}

```

#### 2. Using `Set` for $O(1)$ Unsubscriptions

Using a `Set` allows $O(1)$ removal during `unsubscribe` instead of an $O(n)$ array lookup via `indexOf` or `filter`:

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const listeners = this.events.get(eventName);
    listeners.add(callback);

    return {
      unsubscribe: () => {
        listeners.delete(callback);
      }
    };
  }

  emit(eventName, args = []) {
    if (!this.events.has(eventName)) return [];

    const results = [];
    for (const callback of this.events.get(eventName)) {
      results.push(callback(...args));
    }
    return results;
  }
}

```

---

### Usage Examples

#### Example 1: Basic Subscription and Emit

```javascript
const emitter = new EventEmitter();

// Subscribe to onClick event
const sub = emitter.subscribe('onClick', (a, b) => a + b);

console.log(emitter.emit('onClick', [1, 2])); 
// Output: [3]

```

#### Example 2: Multiple Callbacks for Same Event

```javascript
const emitter = new EventEmitter();

emitter.subscribe('firstEvent', () => 5);
emitter.subscribe('firstEvent', () => 6);

console.log(emitter.emit('firstEvent')); 
// Output: [5, 6]

```

#### Example 3: Unsubscribing

```javascript
const emitter = new EventEmitter();

const sub1 = emitter.subscribe('firstEvent', (x) => x + 1);
const sub2 = emitter.subscribe('firstEvent', (x) => x + 2);

sub1.unsubscribe(); // Removes sub1

console.log(emitter.emit('firstEvent', [5])); 
// Output: [7]

```

---

### Key Takeaways

1. **Callback Return Values:** Unlike Node.js's built-in `EventEmitter` (which returns boolean status), LeetCode #2694 requires `emit` to return an array of all return values from the executed callbacks in the exact order they were subscribed.
2. **Dynamic Unsubscription:** Returning an object with an `unsubscribe()` method closure retains access to the specific callback reference and event list via closure scope.
3. **Unsubscribed Event Safety:** If an event has no active subscriptions or all subscribers were unsubscribed, calling `emit()` must safely return an empty array `[]`.
