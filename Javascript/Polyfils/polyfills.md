✅ call()
✅ apply()
✅ bind()
✅ Debounce
✅ Throttle
✅ Closures
✅ Array.from()
✅ getComputedStyle()

Here is a complete, production-grade JavaScript guide covering all these core concepts, methods, and polyfills with clear explanations and interview-ready code examples.

---

### 1. `call()`, `apply()`, and `bind()`

These three methods are used to manipulate the value of `this` inside a function.

#### Differences At a Glance

| Method        | Execution                        | Argument Format            | Return Value           |
| ------------- | -------------------------------- | -------------------------- | ---------------------- |
| **`call()`**  | Executes immediately             | Comma-separated values     | Result of the function |
| **`apply()`** | Executes immediately             | Array or array-like object | Result of the function |
| **`bind()`**  | **Does not** execute immediately | Comma-separated values     | A new bound function   |

#### Code Examples & Polyfills

```javascript
const person = { name: 'Sudhir' };

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

// Native Usage
console.log(greet.call(person, 'Hello', '!'));      // "Hello, Sudhir!"
console.log(greet.apply(person, ['Hi', '.']));      // "Hi, Sudhir."

const boundGreet = greet.bind(person, 'Hey');
console.log(boundGreet('?'));                       // "Hey, Sudhir?"

```

#### Custom Polyfills

```javascript
// Polyfill for call()
Function.prototype.myCall = function (context = window, ...args) {
  context = context || window;
  const uniqueKey = Symbol('fn'); // Avoid overwriting existing properties
  context[uniqueKey] = this;

  const result = context[uniqueKey](...args);
  delete context[uniqueKey];
  return result;
};

// Polyfill for apply()
Function.prototype.myApply = function (context = window, argsArray = []) {
  context = context || window;
  const uniqueKey = Symbol('fn');
  context[uniqueKey] = this;

  const result = context[uniqueKey](...argsArray);
  delete context[uniqueKey];
  return result;
};

// Polyfill for bind()
Function.prototype.myBind = function (context = window, ...boundArgs) {
  const originalFn = this;
  return function (...runtimeArgs) {
    return originalFn.apply(context, [...boundArgs, ...runtimeArgs]);
  };
};

```

---

### 2. Debounce

Debouncing delays function execution until $N\text{ ms}$ have passed **after the user stops triggering the event**. It is ideal for search inputs, auto-save drafts, and window resize end handlers.

```javascript
/**
 * Debounce Implementation
 * @param {Function} fn - Target function
 * @param {number} delay - Cooldown delay in ms
 */
function debounce(fn, delay = 300) {
  let timerId;

  return function (...args) {
    const context = this;
    clearTimeout(timerId); // Clear timer if user triggers event again within delay

    timerId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// Usage Example (Search Input)
const handleSearch = debounce((event) => {
  console.log('📡 API Call for:', event.target.value);
}, 400);

// document.getElementById('search-input').addEventListener('input', handleSearch);

```

---

### 3. Throttle

Throttling guarantees that a function is executed **at most once every $N\text{ ms}$**, regardless of how many times the user triggers the event. It is ideal for scroll handlers, infinite scroll, and resize triggers.

```javascript
/**
 * Throttle Implementation (Leading Edge)
 * @param {Function} fn - Target function
 * @param {number} limit - Cooldown window in ms
 */
function throttle(fn, limit = 300) {
  let inThrottle = false;

  return function (...args) {
    const context = this;

    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage Example (Scroll Listener)
const handleScroll = throttle(() => {
  console.log('📜 Scroll position:', window.scrollY);
}, 200);

// window.addEventListener('scroll', handleScroll);

```

---

### 4. Closures

A **closure** is created when an inner function retains access to variables in its outer lexical scope, even after the outer function has finished executing and returned.

#### Classic Encapsulation Use Case

```javascript
function createCounter() {
  let count = 0; // Private variable encapsulated via closure

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());   // 2
// count is completely inaccessible from the global scope!

```

#### Clearing Closure Memory

Closure variables remain in memory as long as the inner function reference exists. To allow Garbage Collection to sweep closure memory, **nullify the function reference**:

```javascript
let myCounter = createCounter();
// ... usage ...
myCounter = null; // Unlocks closure variables for Garbage Collection

```

---

### 5. `Array.from()` & Its Polyfill

`Array.from()` creates a new array instance from an array-like object (e.g., `arguments`, `NodeList`) or an iterable object (e.g., `Set`, `Map`). It also accepts an optional mapping function.

```javascript
// Native Usage
console.log(Array.from('hello'));                     // ['h', 'e', 'l', 'l', 'o']
console.log(Array.from([1, 2, 3], (x) => x * 2));     // [2, 4, 6]

```

#### Custom Polyfill

```javascript
if (!Array.myFrom) {
  Array.myFrom = function (arrayLike, mapFn, thisArg) {
    if (arrayLike == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const result = [];
    const obj = Object(arrayLike);
    const len = Number(obj.length) || 0;

    for (let i = 0; i < len; i++) {
      let value = obj[i];
      if (mapFn && typeof mapFn === 'function') {
        value = mapFn.call(thisArg, value, i);
      }
      result.push(value);
    }

    return result;
  };
}

// Polyfill Verification
console.log(Array.myFrom('code')); // ['c', 'o', 'd', 'e']

```

---

### 6. `getComputedStyle()` & Its Polyfill

`window.getComputedStyle(element)` returns an object containing the resolved values of all CSS properties applied to an element after resolving external stylesheets, inline styles, and browser defaults.

```javascript
// Native Usage
const box = document.querySelector('.box');
if (box) {
  const computedStyles = window.getComputedStyle(box);
  console.log('Computed Width:', computedStyles.getPropertyValue('width'));
}

```

#### Custom Polyfill for Legacy Environments (IE8 / Legacy Runtimes)

Legacy browsers like IE8 used `element.currentStyle` instead of `window.getComputedStyle`.

```javascript
if (!window.getComputedStyle) {
  window.getComputedStyle = function (element) {
    if (!element || element.nodeType !== 1) {
      return null;
    }

    // Fallback object matching getComputedStyle interface
    const currentStyle = element.currentStyle || {};

    return {
      getPropertyValue: function (propName) {
        // Convert camelCase (fontSize) to kebab-case (font-size) if needed
        const camelProp = propName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return currentStyle[camelProp] || currentStyle[propName] || '';
      },
    };
  };
}

```

Here are production-ready, interview-tested implementations for all 8 fundamental JavaScript methods and utility patterns.

---

### 1. `Promise.all` Polyfill

`Promise.all` takes an iterable of promises and returns a single Promise that resolves to an array of the results of the input promises when **all** of them have resolved, or rejects immediately with the reason of the **first** rejected promise.

```javascript
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    // Handle non-iterable inputs
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError(`${typeof promises} is not iterable`));
    }

    const promiseArray = Array.from(promises);
    const results = [];
    let completedCount = 0;

    // Empty iterable resolves immediately to an empty array
    if (promiseArray.length === 0) {
      return resolve([]);
    }

    promiseArray.forEach((item, index) => {
      // Wrap non-promise items in Promise.resolve
      Promise.resolve(item)
        .then((value) => {
          // Preserve result order by using index rather than pushing
          results[index] = value;
          completedCount++;

          if (completedCount === promiseArray.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          // Rejects immediately on first failure
          reject(error);
        });
    });
  });
};

// Usage Example
const p1 = Promise.resolve(10);
const p2 = new Promise((res) => setTimeout(() => res(20), 100));
const p3 = 30;

Promise.myAll([p1, p2, p3]).then(console.log); // Output: [10, 20, 30]

```

---

### 2. `Promise.any` Polyfill

`Promise.any` takes an iterable of promises and returns a single Promise that resolves as soon as **any** of the input promises resolves. If **all** promises reject, it rejects with an `AggregateError` containing all rejection reasons.

```javascript
Promise.myAny = function (promises) {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError(`${typeof promises} is not iterable`));
    }

    const promiseArray = Array.from(promises);
    const errors = [];
    let rejectedCount = 0;

    if (promiseArray.length === 0) {
      return reject(new AggregateError([], 'All promises were rejected'));
    }

    promiseArray.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          // Resolves immediately on first success
          resolve(value);
        })
        .catch((error) => {
          errors[index] = error;
          rejectedCount++;

          // If all promises rejected, throw AggregateError
          if (rejectedCount === promiseArray.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    });
  });
};

// Usage Example
const pErr1 = Promise.reject('Error 1');
const pSlow = new Promise((res) => setTimeout(() => res('Winner!'), 200));

Promise.myAny([pErr1, pSlow]).then(console.log); // Output: "Winner!"

```

---

### 3. `Array.prototype.reduce` Polyfill

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  if (this == null) {
    throw new TypeError('Array.prototype.myReduce called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const array = Object(this);
  const len = array.length >>> 0; // Convert to uint32
  let accumulator;
  let startIndex = 0;

  // Check if initialValue was passed (handling undefined explicitly passed)
  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    // Find the first assigned index in sparse arrays
    while (startIndex < len && !(startIndex in array)) {
      startIndex++;
    }
    if (startIndex >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = array[startIndex++];
  }

  for (let i = startIndex; i < len; i++) {
    if (i in array) {
      accumulator = callback(accumulator, array[i], i, array);
    }
  }

  return accumulator;
};

// Usage Example
const nums = [1, 2, 3, 4];
const sum = nums.myReduce((acc, curr) => acc + curr, 0);
console.log(sum); // Output: 10

```

---

### 4. Lodash’s `flatten` Method (Supports Custom Depth)

Flattening flattens a nested array up to the specified `depth` level (defaulting to `1` in standard `flatten`).

```javascript
/**
 * Flattens array a single level or up to a specified depth.
 * @param {Array} array The array to flatten.
 * @param {number} depth Maximum recursive depth (default 1).
 */
function flatten(array, depth = 1) {
  if (!Array.isArray(array)) {
    return [];
  }

  const result = [];

  for (const item of array) {
    if (Array.isArray(item) && depth > 0) {
      // Recursively flatten if item is an array and depth permits
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }

  return result;
}

// Deep Flatten Variant (Equivalent to _.flattenDeep)
function flattenDeep(array) {
  return flatten(array, Infinity);
}

// Usage Example
console.log(flatten([1, [2, [3, [4]]]], 1)); // [1, 2, [3, [4]]]
console.log(flattenDeep([1, [2, [3, [4]]]])); // [1, 2, 3, 4]

```

---

### 5. Auto-Retry Promises with Backoff Delay

Retries an asynchronous operation up to `maxRetries` times with optional exponential backoff before throwing the final error.

```javascript
/**
 * Automatically retries a promise-returning function.
 * @param {Function} fn Function returning a promise.
 * @param {number} maxRetries Total retry attempts.
 * @param {number} delay Base delay in ms between retries.
 * @param {boolean} backoff Exponentially increase delay on each attempt.
 */
async function retryPromise(fn, maxRetries = 3, delay = 1000, backoff = true) {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > maxRetries) {
        throw new Error(`Failed after ${maxRetries} retries: ${error.message}`);
      }

      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      console.warn(`Attempt ${attempt} failed. Retrying in ${currentDelay}ms...`);
      await new Promise((res) => setTimeout(res, currentDelay));
    }
  }
}

// Usage Example
let count = 0;
const unstableApiCall = () =>
  new Promise((res, rej) => {
    count++;
    count === 3 ? res('Success!') : rej(new Error('Server Error'));
  });

retryPromise(unstableApiCall, 3, 500)
  .then(console.log)
  .catch(console.error);

```

---

### 6. Throttle Promises by Batching (Concurrency Limiter)

Processes a large array of async tasks in batched chunks of `concurrencyLimit` to avoid exhausting network or server limits.

```javascript
/**
 * Executes async tasks in parallel batches.
 * @param {Array<Function>} tasks Array of functions returning promises.
 * @param {number} limit Maximum concurrent executions.
 */
async function batchPromises(tasks, limit = 2) {
  const results = [];
  const executing = [];

  for (const [index, task] of tasks.entries()) {
    // Create task execution wrapper
    const p = Promise.resolve().then(() => task()).then((res) => {
      results[index] = res;
    });

    executing.push(p);

    // Remove finished promise from running queue
    const cleanUp = p.then(() => {
      executing.splice(executing.indexOf(p), 1);
    });

    // When concurrency limit is reached, await the fastest task to resolve
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing); // Wait for remaining tasks to complete
  return results;
}

// Usage Example
const makeTask = (id, ms) => () =>
  new Promise((res) => setTimeout(() => res(`Task ${id} done`), ms));

const tasks = [
  makeTask(1, 1000),
  makeTask(2, 500),
  makeTask(3, 300),
  makeTask(4, 800),
];

batchPromises(tasks, 2).then(console.log);

```

---

### 7. Debouncing Implementation

Delays invoking `fn` until after `delay` milliseconds have elapsed since the last time the function was called. Supports leading/trailing options.

```javascript
/**
 * Debounce Function Implementation
 * @param {Function} fn Function to debounce.
 * @param {number} delay Cooldown delay in ms.
 * @param {boolean} immediate Whether to invoke on leading edge.
 */
function debounce(fn, delay = 300, immediate = false) {
  let timerId = null;

  return function (...args) {
    const context = this;
    const callNow = immediate && !timerId;

    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    }, delay);

    if (callNow) {
      fn.apply(context, args);
    }
  };
}

// Usage Example
const onSearch = debounce((query) => console.log('API Query:', query), 400);
// onSearch('a'); onSearch('ab'); onSearch('abc'); -> Fires once after 400ms

```

---

### 8. Throttling Implementation

Guarantees function execution **at most once every `limit` milliseconds**, handling both leading edge execution and trailing timers.

```javascript
/**
 * Throttle Function Implementation
 * @param {Function} fn Function to throttle.
 * @param {number} limit Cooldown window in ms.
 */
function throttle(fn, limit = 300) {
  let inThrottle = false;
  let lastArgs = null;
  let lastContext = null;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        // Execute trailing call if inputs arrived during lock window
        if (lastArgs) {
          fn.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = this;
    }
  };
}

// Usage Example
const onScroll = throttle(() => console.log('Scroll evaluated'), 200);
// window.addEventListener('scroll', onScroll);

```

### 27. How to control tab order in DOM (explain `tabIndex`)

The `tabindex` attribute controls whether an HTML element is focusable and determines its position in the sequential keyboard navigation order (when the user presses the `Tab` key).

#### The Three `tabIndex` Values

* **`tabindex="0"`:**
* Makes non-focusable elements (like `<div>`, `<span>`, `p`) **focusable in the natural DOM order**.
* It inserts the element into the standard tab order based on its position in the HTML document.
* **Use case:** Creating custom interactive components (like a custom dropdown or button).

* **`tabindex="-1"`:**
* Makes the element **programmatically focusable** via JavaScript (`element.focus()`), but **removes it from sequential keyboard tab order**.
* The user cannot navigate to this element using the `Tab` key.
* **Use case:** Managing focus inside modals, slide-out menus, or single-page application page transitions to direct screen reader focus.

* **`tabindex="1"` (and any positive integer `> 0`):**
* Explicitly sets a custom tab order override.
* Elements with positive `tabindex` values are focused **before** any elements with `tabindex="0"` or natural focusability, ordered numerically (`1`, then `2`, then `3`, etc.).
* ⚠️ **Anti-Pattern:** Avoid using positive `tabindex` values. It disrupts the natural DOM reading order, creates severe accessibility barriers for screen reader users, and makes code difficult to maintain.

```html
<!-- NATURAL DOM TAB ORDER EXAMPLE -->

<!-- 1. Focused FIRST because of explicit positive index (Avoid in production!) -->
<input type="text" tabindex="1" placeholder="First focused" />

<!-- 2. Focused SECOND (Natural DOM order) -->
<button tabindex="0">Click Me</button>

<!-- 3. Skipped by Tab key completely, but focusable via JS -->
<div id="modal" tabindex="-1">Modal Content</div>

```

---

### 28. What is Event Capturing and Bubbling?

Event Capturing and Bubbling are the **two phases of Event Propagation** in the DOM when an event is triggered on a nested element.

```text
               ┌───────────────────────────────┐
               │         DOCUMENT / BODY       │
               └──────────────┬────────────────┘
                              │
               ┌──────────────┴────────────────┐
               │    CAPTURING PHASE (Phase 1)  │
               │    Travels DOWN to target     │
               └──────────────┬────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ TARGET PHASE │ (Phase 2)
                       └──────────────┬┘
                              │
               ┌──────────────┴────────────────┐
               │    BUBBLING PHASE (Phase 3)   │
               │    Travels UP to root         │
               └───────────────────────────────┘

```

#### 1. Capturing Phase (Trickling Phase)

* The event starts at the topmost element (`window` $\rightarrow$ `document` $\rightarrow$ `<body>`) and travels **downwards** through ancestor elements until it reaches the targeted element.
* By default, event listeners do **not** fire during this phase.

#### 2. Target Phase

* The event reaches the actual element that triggered the interaction (`event.target`).

#### 3. Bubbling Phase

* The event bubbles **upwards** from the target element, triggering listeners on parent elements all the way back up to `window`.
* **By default, almost all standard DOM event listeners operate in the Bubbling phase.**

#### Controlling Propagation in Code

```javascript
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// 1. Listening in BUBBLING Phase (Default)
parent.addEventListener('click', () => {
  console.log('Parent Clicked (Bubbling)');
});

// 2. Listening in CAPTURING Phase (Set 3rd argument `useCapture` to true)
parent.addEventListener('click', () => {
  console.log('Parent Clicked (Capturing)');
}, true); // <--- true enables capture mode

// 3. Stopping Event Propagation
child.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevents event from bubbling further up the tree!
  console.log('Child Clicked');
});

```

#### Event Delegation Pattern

Understanding bubbling enables **Event Delegation**—attaching a single event listener to a parent container to handle events triggered by its children (e.g., dynamically added list items):

```javascript
document.getElementById('shopping-list').addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('Item clicked:', event.target.innerText);
  }
});

```

---

### 29. How to override `toString` on `String.prototype`

In JavaScript, string primitives inherit methods from `String.prototype`. You can override `String.prototype.toString` by reassigning a custom function to it.

#### Implementation & Behavior

```javascript
// 1. Store original toString implementation reference
const originalStringToString = String.prototype.toString;

// 2. Override String.prototype.toString
String.prototype.toString = function () {
  // `this` refers to the String instance/primitive wrapper
  return `[Custom String]: ${originalStringToString.call(this).toUpperCase()}`;
};

// Test with String Primitive
const greeting = "hello world";
console.log(greeting.toString()); 
// Output: "[Custom String]: HELLO WORLD"

// Test with String Object
const name = new String("Sudhir");
console.log(name.toString()); 
// Output: "[Custom String]: SUDHIR"

```

#### Safe Method Modification via `Object.defineProperty`

Using `Object.defineProperty` allows you to set property attributes like `writable`, `configurable`, and `enumerable` to prevent unintended code mutation:

```javascript
Object.defineProperty(String.prototype, 'toString', {
  value: function () {
    return `Modified: ${this.slice(0, 5)}`;
  },
  writable: true,
  configurable: true,
  enumerable: false, // Matches default native prototype visibility
});

console.log("JavaScript".toString()); // Output: "Modified: JavaS"

```

⚠️ **Production Warning (Monkey Patching Anti-Pattern):**
Overriding `String.prototype.toString` modifies built-in language prototypes globally ("Monkey Patching"). Doing this in shared production applications can cause subtle bugs, break third-party npm packages, and degrade engine optimization paths.
