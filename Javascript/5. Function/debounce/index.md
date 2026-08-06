// Debouncing is a technique used to control how many times we allow a function
// to be executed over time. When a JavaScript function is debounced
// with a wait time of X milliseconds, it must wait until after X
// milliseconds have elapsed since the debounced function was last called.
// You almost certainly have encountered debouncing in your daily lives
//  before — when entering an elevator. Only after X duration of not
// pressing the "Door open" button (the debounced function not being called)
// will the elevator door actually close (the callback function is executed).

// Implement a debounce function which accepts a callback function
//  and a wait duration. Calling debounce() returns a function
// which has debounced invocations of the callback function following the behavior described above.


Implement a debounce function which accepts a callback function and a wait duration. Calling debounce() returns a function which has debounced invocations of the callback function following the behavior described above.

Here’s a comprehensive implementation of `debounce` and `throttle`, including the examples and the requested `cancel()` and `flush()` methods for `debounce`.

---

### **Debounce Implementation**

```javascript
function debounce(callback, wait) {
  let timeout;

  function debounced(...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback.apply(context, args);
    }, wait);
  }

  // Cancel method: Clears any pending invocation
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  // Flush method: Immediately invokes the function if there's a pending invocation
  debounced.flush = function () {
    if (timeout) {
      clearTimeout(timeout);
      callback();
      timeout = null;
    }
  };

  return debounced;
}

// Example usage:
let i = 0;
function increment() {
  i++;
  console.log("i:", i);
}

const debouncedIncrement = debounce(increment, 100);

// Test Cases
debouncedIncrement(); // i = 0
setTimeout(() => debouncedIncrement(), 50); // i = 0
setTimeout(() => debouncedIncrement(), 150); // i = 1 after 150ms
```

---

### **Throttle Implementation**

Throttle ensures that the callback function is invoked at most once in a specified time window.

```javascript
function throttle(callback, wait) {
  let lastExecution = 0;
  let timeout;

  function throttled(...args) {
    const context = this;
    const now = Date.now();

    if (now - lastExecution >= wait) {
      // Execute immediately if enough time has passed
      lastExecution = now;
      callback.apply(context, args);
    } else if (!timeout) {
      // Schedule for later
      const remainingTime = wait - (now - lastExecution);
      timeout = setTimeout(() => {
        lastExecution = Date.now();
        timeout = null;
        callback.apply(context, args);
      }, remainingTime);
    }
  }

  // Cancel method: Clears any scheduled execution
  throttled.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return throttled;
}

// Example usage:
let j = 0;
function log() {
  j++;
  console.log("j:", j);
}

const throttledLog = throttle(log, 100);

// Test Cases
throttledLog(); // j = 1 immediately
setTimeout(() => throttledLog(), 50); // j = 1 (too soon)
setTimeout(() => throttledLog(), 150); // j = 2 (after 100ms)
```

---

### **Differences Between Debounce and Throttle**

| Feature            | Debounce                                         | Throttle                                |
|--------------------|-------------------------------------------------|----------------------------------------|
| Behavior           | Delays execution until after a specified delay since the last invocation. | Ensures execution at most once in a specified interval. |
| Best for           | Reducing excessive API calls for rapid actions like resizing or keypress. | Regular updates like scrolling, dragging, or resizing. |
| Examples           | Search bar suggestions, form validation, window resize. | Infinite scroll, rate-limited API calls. |

---

### **Follow-Up with Debounce Methods**

- **`cancel()`**: Stops any scheduled invocation.
- **`flush()`**: Executes the callback immediately if a delayed invocation is pending.

These additions make `debounce` more flexible and powerful, particularly useful for edge cases like canceling or forcing execution in real-time.

Let me know if you need further clarification!


# Debouncing vs Throttling (Most Asked React Interview Question)

Both are performance optimisation techniques used to control how frequently a function executes.

```text
User Event
   ↓
Typing
Scrolling
Resize
Mouse Move
API Search
```

***

# 1. Debouncing

### Definition

A function executes **only after a specified delay has passed since the last event**.

```text
User Types
A
AB
ABC
ABCD

Wait 500ms
↓
API Call
```

Only **one call** is made.

***

## Debounce Implementation

```javascript
function debounce(
  fn,
  delay
) {

  let timer;

  return function(...args) {

    clearTimeout(timer);

    timer = setTimeout(() => {

      fn.apply(this, args);

    }, delay);
  };
}
```

***

## Example

```javascript
function search(val) {
  console.log(
    "API:",
    val
  );
}

const debounceSearch =
  debounce(search, 1000);

debounceSearch("R");
debounceSearch("Re");
debounceSearch("Rea");
debounceSearch("React");
```

Output:

```text
API: React
```

Only last call executes.

***

# React Search Example

```jsx
function Search() {

  const [query,
         setQuery] =
    useState("");

  const searchApi =
    debounce(value => {

      console.log(
        "Searching:",
        value
      );

    }, 500);

  return (
    <input
      onChange={e => {
        setQuery(
          e.target.value
        );

        searchApi(
          e.target.value
        );
      }}
    />
  );
}
```

### Use Cases

```text
✅ Search API
✅ Auto Save
✅ Validation
✅ Typeahead
```

***

# 2. Throttling

### Definition

Execute function **at most once during a specified interval**.

```text
Scroll Scroll Scroll Scroll

Wait 1 sec

Scroll Scroll Scroll

Wait 1 sec
```

Function executes periodically.

***

## Throttle Implementation

```javascript
function throttle(
  fn,
  delay
) {

  let shouldWait =
    false;

  return function(...args) {

    if (shouldWait)
      return;

    fn.apply(this, args);

    shouldWait = true;

    setTimeout(() => {

      shouldWait = false;

    }, delay);
  };
}
```

***

## Example

```javascript
function trackScroll() {

  console.log(
    "Scroll Event"
  );
}

const throttledScroll =
  throttle(
    trackScroll,
    1000
  );

window.addEventListener(
  "scroll",
  throttledScroll
);
```

Output:

```text
1 call every second
```

***

# React Scroll Example

```jsx
useEffect(() => {

  const handleScroll =
    throttle(() => {

      console.log(
        window.scrollY
      );

    }, 500);

  window.addEventListener(
    "scroll",
    handleScroll
  );

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );

}, []);
```

### Use Cases

```text
✅ Infinite Scroll
✅ Window Resize
✅ Mouse Move
✅ Analytics Tracking
✅ Scroll Progress
```

***

# Visual Difference

## Debounce

```text
Events

|A|B|C|D|

Wait

----------------

Execute Once
```

***

## Throttle

```text
Events

|A|B|C|D|E|F|

Execute

|----|----|----|

Every N ms
```

***

# Interview Comparison

| Feature       | Debounce         | Throttle                  |
| ------------- | ---------------- | ------------------------- |
| Executes      | After user stops | At fixed interval         |
| API Search    | ✅ Best           | ❌                         |
| Scroll Events | ❌                | ✅ Best                    |
| Resize Events | ❌                | ✅                         |
| Auto Save     | ✅                | ❌                         |
| Frequency     | One final call   | Multiple controlled calls |

***

# Lodash Example

### Debounce

```javascript
import debounce
from "lodash/debounce";

const search =
  debounce(
    value =>
      console.log(value),
    500
  );
```

***

### Throttle

```javascript
import throttle
from "lodash/throttle";

const scroll =
  throttle(
    () =>
      console.log(
        "scroll"
      ),
    1000
  );
```

***

# Real Interview Scenario

### Search Bar

```text
User types:
R
Re
Rea
Reac
React

Without Debounce
❌ 5 API Calls

With Debounce
✅ 1 API Call
```

***

### Infinite Scroll

```text
1000 scroll events

Without Throttle
❌ 1000 executions

With Throttle
✅ 1 execution every 500ms
```

***

# Senior React Interview Answer

```text
Debouncing delays function execution until
the user stops triggering an event for a
specified time period.

Throttling ensures a function executes at
most once during a specified interval.

Use Debounce for:
- Search
- Validation
- Auto-save

Use Throttle for:
- Scroll Tracking
- Resize Events
- Infinite Scrolling
- Analytics
```

### Easy Memory Trick

```text
Debounce = Wait

Throttle = Limit
```


Since you're preparing for **Senior React JS interviews**, here are the most commonly asked **Debounce & Throttle interview questions** with expected answers.

***

# 1. What is Debouncing?

### Answer

Debouncing delays function execution until the user stops triggering the event for a specified duration.

### Example

```javascript
Search

R
Re
Rea
Reac
React

Wait 500ms

API Call
```

Only one API call is made.

### Use Cases

```text
✅ Search Bar
✅ Auto Save
✅ Form Validation
✅ Typeahead Suggestions
```

***

# 2. What is Throttling?

### Answer

Throttling ensures a function executes at most once within a specified interval.

### Example

```text
Scrolling

||||||||||||||||||

Execute

|----|----|----|
```

Runs every N milliseconds.

### Use Cases

```text
✅ Scroll Event
✅ Resize Event
✅ Mouse Move
✅ Analytics Tracking
✅ Infinite Scroll
```

***

# 3. Difference Between Debounce and Throttle?

| Debounce            | Throttle                  |
| ------------------- | ------------------------- |
| Wait for inactivity | Execute periodically      |
| One final call      | Multiple controlled calls |
| Search API          | Scroll Event              |
| Auto Save           | Resize Event              |

### Interview One-Liner

```text
Debounce waits.

Throttle limits.
```

***

# 4. Implement Debounce

```javascript
function debounce(
  fn,
  delay
) {

  let timer;

  return (...args) => {

    clearTimeout(timer);

    timer =
      setTimeout(() => {

        fn(...args);

      }, delay);
  };
}
```

Usage:

```javascript
const debouncedSearch =
  debounce(
    value =>
      console.log(value),
    500
  );
```

***

# 5. Implement Throttle

```javascript
function throttle(
  fn,
  delay
) {

  let shouldWait =
    false;

  return (...args) => {

    if (shouldWait)
      return;

    fn(...args);

    shouldWait = true;

    setTimeout(() => {

      shouldWait = false;

    }, delay);

  };
}
```

***

# 6. Search Bar: Debounce or Throttle?

### Answer

```text
Debounce
```

Reason:

```text
User may type 20 characters.

Without debounce:
20 API calls.

With debounce:
1 API call.
```

***

# 7. Infinite Scroll: Debounce or Throttle?

### Answer

```text
Throttle
```

Reason:

```text
Need periodic updates
while user is scrolling.
```

***

# 8. What Problem Does Debounce Solve?

### Answer

```text
Reduces unnecessary
function calls.

Improves performance.

Prevents excessive API requests.
```

***

# 9. What Problem Does Throttle Solve?

### Answer

```text
Prevents expensive functions
from executing too frequently.
```

***

# 10. React Search Example

```jsx
const search =
  debounce(value => {

    fetchUsers(value);

  }, 500);

<input
  onChange={e =>
    search(
      e.target.value
    )
  }
/>
```

***

# 11. React Scroll Example

```jsx
useEffect(() => {

  const handleScroll =
    throttle(() => {

      console.log(
        window.scrollY
      );

    }, 500);

  window.addEventListener(
    "scroll",
    handleScroll
  );

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );

}, []);
```

***

# 12. Why Use `useCallback` with Debounce?

### Interview Question

```jsx
const search =
  debounce(...);
```

Problem:

```text
Every render creates
new debounce function.
```

Solution:

```jsx
const search =
  useCallback(
    debounce(
      value => {
        fetchData(value);
      },
      500
    ),
    []
  );
```

***

# 13. Debounce with API Search Scenario

**Question**

```text
How would you optimize
an employee search box?
```

**Answer**

```text
1. User types
2. Debounce 300-500ms
3. Call API
4. Show results
5. Cancel previous request
```

***

# 14. Can Debounced Function Be Cancelled?

```javascript
const debouncedFn =
  debounce(fn, 500);

debouncedFn.cancel();
```

(Lodash implementation)

***

# 15. Why is Lodash Debounce Preferred?

```text
✅ Battle Tested
✅ Cancel Support
✅ Flush Support
✅ Leading/Trailing Execution
✅ Optimized
```

```javascript
import debounce
from "lodash/debounce";
```

***

# 16. Senior React Scenario

**Question**

```text
Large e-commerce website.

User types in search box.

How would you optimize it?
```

**Answer**

```text
Debounce Search Input
     ↓
API Call
     ↓
Cache Results
     ↓
Show Suggestions
     ↓
Cancel Previous Request
```

***

# 17. Follow-up Coding Question (Very Common)

Implement:

```javascript
function debounce(fn, delay) {}
```

Expected Complexity:

```text
Time: O(1)
Space: O(1)
```

***

# Senior React Interview Answer

> Debouncing delays execution until the user stops triggering an event, making it ideal for search inputs and form validation. Throttling limits execution to once per interval, making it ideal for scroll, resize, and mouse events. In React applications, debouncing is commonly used with API calls to reduce server load, while throttling is used to improve rendering performance during high-frequency browser events. The most common implementation uses closures and `setTimeout`, and production applications often use Lodash's `debounce` and `throttle` utilities.
