### Time-Limited Cache Implementation

The problem is to create a class `TimeLimitedCache` that stores key-value pairs where each key has an expiration time associated with it. Once the time has passed, the key becomes inaccessible. Let's walk through the implementation step by step.

### Key Requirements

- **set(key, value, duration)**: This method will store a key-value pair with an expiration time (in milliseconds). If the key already exists and is unexpired, it will return `true`, otherwise, `false`. If the key already exists but is expired, it will overwrite the existing entry.
- **get(key)**: This method retrieves the value associated with the key if it's still valid (unexpired). If the key is expired or doesn't exist, it should return `-1`.
- **count()**: This method should return the count of unexpired keys.

### Code Implementation

```javascript
class TimeLimitedCache {
  constructor() {
    this.cache = new Map(); // To store key-value pairs with expiration times
  }

  // Set a key-value pair with expiration duration
  set(key, value, duration) {
    const currentTime = Date.now(); // Get current time in milliseconds
    const expirationTime = currentTime + duration; // Calculate expiration time

    let existed = false;

    if (this.cache.has(key)) {
      // If the key exists, check if the old value is expired
      const [oldValue, oldExpirationTime] = this.cache.get(key);
      if (oldExpirationTime > currentTime) {
        // If the old value is unexpired, we overwrite it and return true
        existed = true;
      }
    }

    // Store the new key, value, and expiration time
    this.cache.set(key, [value, expirationTime]);

    return existed; // Return whether the key was overwritten with an unexpired value
  }

  // Get the value of a key if it is not expired
  get(key) {
    const currentTime = Date.now(); // Get current time

    if (this.cache.has(key)) {
      const [value, expirationTime] = this.cache.get(key);
      if (expirationTime > currentTime) {
        // If the key hasn't expired, return the value
        return value;
      }
      // If the key is expired, delete it from the cache
      this.cache.delete(key);
    }

    return -1; // Return -1 if the key doesn't exist or is expired
  }

  // Count how many keys are unexpired
  count() {
    const currentTime = Date.now(); // Get current time
    let count = 0;

    // Iterate through all keys to count unexpired ones
    for (let [key, [value, expirationTime]] of this.cache.entries()) {
      if (expirationTime > currentTime) {
        count++;
      } else {
        // If expired, remove the key
        this.cache.delete(key);
      }
    }

    return count;
  }
}
```

### Explanation

1. **Constructor**:
   - Initializes an empty `Map` to store the key-value pairs with their expiration times.

2. **set(key, value, duration)**:
   - Calculates the expiration time by adding the current time (`Date.now()`) with the provided `duration`.
   - If the key already exists, we check if it is expired. If the existing key is not expired, we set the new value and return `true` indicating the key was overwritten. Otherwise, `false` is returned.
   - If the key is new, it's simply added to the cache.

3. **get(key)**:
   - If the key exists, the method checks whether it has expired by comparing the stored expiration time with the current time.
   - If expired, the key is deleted and `-1` is returned.
   - If the key is valid (not expired), the value is returned.

4. **count()**:
   - Iterates through the cache, checks whether each key is expired. If expired, the key is removed from the cache.
   - It returns the count of unexpired keys.

### Example Usage

```javascript
const cache = new TimeLimitedCache();
console.log(cache.set(1, 42, 1000)); // returns false (new key)
console.log(cache.get(1)); // returns 42
console.log(cache.count()); // returns 1

setTimeout(() => {
  console.log(cache.get(1)); // returns -1 (expired after 1000ms)
}, 1500);

const cache2 = new TimeLimitedCache();
console.log(cache2.set(1, 42, 500)); // returns false
console.log(cache2.set(2, 84, 1000)); // returns false
console.log(cache2.count()); // returns 2

setTimeout(() => {
  console.log(cache2.count()); // returns 1 (only key 2 remains)
  console.log(cache2.get(1)); // returns -1 (expired after 500ms)
  console.log(cache2.get(2)); // returns 84
}, 700);

const cache3 = new TimeLimitedCache();
console.log(cache3.set(1, 42, 500)); // returns false
console.log(cache3.set(1, 24, 1500)); // returns true (overwritten with new value and duration)
console.log(cache3.get(1)); // returns 24

setTimeout(() => {
  console.log(cache3.get(1)); // returns 24 (still valid with new duration)
}, 700);
```

### Example 2 with Timed Actions

Here’s how actions like `set`, `get`, and `count` work over time. We'll simulate the actions with a delay between each to see how the cache behaves with time constraints.

```javascript
const actions2 = [
  "TimeLimitedCache",
  "set",
  "set",
  "get",
  "get",
  "get",
  "count",
];
const values2 = [[], [1, 42, 50], [1, 50, 100], [1], [1], [1], []];
const timeDelays2 = [0, 0, 40, 50, 120, 200, 250];

const cache2 = new TimeLimitedCache();

const results2 = [];
let currentTime2 = 0;

actions2.forEach((action, index) => {
  currentTime2 = timeDelays2[index];
  if (action === "set") {
    const [key, value, duration] = values2[index];
    results2.push(cache2.set(key, value, duration));
  } else if (action === "get") {
    const [key] = values2[index];
    results2.push(cache2.get(key));
  } else if (action === "count") {
    results2.push(cache2.count());
  }
});

console.log(results2); // Output: [null, false, true, 50, 50, -1, 0]
```

### Output Explanation

- **Step 1**: Create a new cache instance (`null`).
- **Step 2**: Set key `1` with value `42` and duration `50ms` (`false` because it's a new key).
- **Step 3**: Update key `1` with value `50` and duration `100ms` (`true` because key `1` already existed).
- **Step 4**: Get key `1` immediately after setting (`50`).
- **Step 5**: Get key `1` after 120ms (`50` remains valid).
- **Step 6**: Get key `1` after 200ms (`-1` because key expired).
- **Step 7**: Count unexpired keys (`0` because key `1` is expired).

This approach handles both the time-based expiration and the cache management efficiently.

Here is the complete guide and solution for LeetCode #2622: **Cache With Time Limit** (implementing a key-value cache class with expiration timeouts per key).

---

### Solution

```javascript
var TimeLimitedCache = function() {
  this.cache = new Map();
};

/** 
 * @param {number} key
 * @param {number} value
 * @param {number} duration time until expiration in ms
 * @return {boolean} if un-expired key already existed
 */
TimeLimitedCache.prototype.set = function(key, value, duration) {
  const existing = this.cache.get(key);
  let keyExisted = false;

  if (existing) {
    // If key already exists and hasn't expired, clear its pending timeout
    clearTimeout(existing.timer);
    keyExisted = true;
  }

  // Set new expiration timer
  const timer = setTimeout(() => {
    this.cache.delete(key);
  }, duration);

  // Store value and timer reference
  this.cache.set(key, { value, timer });

  return keyExisted;
};

/** 
 * @param {number} key
 * @return {number} value associated with key or -1 if non-existent
 */
TimeLimitedCache.prototype.get = function(key) {
  if (this.cache.has(key)) {
    return this.cache.get(key).value;
  }
  return -1;
};

/** 
 * @return {number} count of non-expired keys
 */
TimeLimitedCache.prototype.count = function() {
  return this.cache.size;
};

```

---

### Alternative Implementation: ES6 `class` Syntax

If you prefer modern JavaScript ES6 classes over traditional prototype syntax:

```javascript
class TimeLimitedCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, duration) {
    const existing = this.cache.get(key);
    const keyExisted = Boolean(existing);

    if (existing) {
      clearTimeout(existing.timer);
    }

    const timer = setTimeout(() => {
      this.cache.delete(key);
    }, duration);

    this.cache.set(key, { value, timer });

    return keyExisted;
  }

  get(key) {
    return this.cache.has(key) ? this.cache.get(key).value : -1;
  }

  count() {
    return this.cache.size;
  }
}

```

---

### Usage Example

```javascript
const timeLimitedCache = new TimeLimitedCache();

console.log(timeLimitedCache.set(1, 42, 1000)); // returns false (key didn't exist)
console.log(timeLimitedCache.get(1));            // returns 42
console.log(timeLimitedCache.count());          // returns 1

// Updating key before it expires (at t = 500ms)
setTimeout(() => {
  console.log(timeLimitedCache.set(1, 50, 1000)); // returns true (key existed, resets timer for another 1000ms)
}, 500);

// At t = 1200ms
setTimeout(() => {
  console.log(timeLimitedCache.get(1));          // returns 50 (still valid due to reset!)
  console.log(timeLimitedCache.count());        // returns 1
}, 1200);

// At t = 2000ms
setTimeout(() => {
  console.log(timeLimitedCache.get(1));          // returns -1 (expired)
  console.log(timeLimitedCache.count());        // returns 0
}, 2000);

```

---

### Key Takeaways

1. **Overwriting Existing Timers:** When setting an existing un-expired key, you **must** call `clearTimeout(existing.timer)` before creating a new timer. Otherwise, the old timer will delete the key prematurely.
2. **`Map.size` for $O(1)$ Count:** By automatically deleting keys upon timeout expiration (`this.cache.delete(key)`), `this.cache.size` always reflects the exact count of active, non-expired keys.
