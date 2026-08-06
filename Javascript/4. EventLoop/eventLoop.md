# JavaScript Event Loop

The **Event Loop** is the mechanism that allows JavaScript to perform asynchronous operations even though JavaScript is **single-threaded**.

***

# Why Do We Need Event Loop?

JavaScript can execute only:

```text
One Task At A Time
```

using the:

```text
Call Stack
```

Example:

```javascript
console.log("A");
console.log("B");
console.log("C");
```

Output:

```text
A
B
C
```

Everything executes synchronously.

***

# JavaScript Runtime Architecture

```text
┌───────────────┐
│   Call Stack  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Web APIs     │
│ setTimeout    │
│ Fetch API     │
│ DOM Events    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Callback Queue│
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Event Loop    │
└───────────────┘
```

***

# Basic Example

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");
```

***

## Execution

### Step 1

```javascript
console.log("Start");
```

Output:

```text
Start
```

***

### Step 2

```javascript
setTimeout(...)
```

moves to:

```text
Web API
```

***

### Step 3

```javascript
console.log("End");
```

Output:

```text
End
```

***

### Step 4

Call Stack becomes empty.

Event Loop moves callback from:

```text
Callback Queue
```

to:

```text
Call Stack
```

Output:

```text
Timeout
```

***

## Final Output

```text
Start
End
Timeout
```

***

# Microtask Queue vs Callback Queue

Interview Favourite.

There are two queues:

```text
1. Microtask Queue
2. Callback Queue
```

***

## Microtasks

Created by:

```javascript
Promise.then()
Promise.catch()
queueMicrotask()
MutationObserver()
```

***

## Macrotasks (Callback Queue)

Created by:

```javascript
setTimeout()
setInterval()
DOM Events
setImmediate()
```

***

# Example

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise");
  });

console.log("End");
```

***

## Output

```text
Start
End
Promise
Timeout
```

***

# Why?

Because:

```text
Microtask Queue
      ↑ Higher Priority

Callback Queue
      ↓ Lower Priority
```

Event Loop always executes:

```text
All Microtasks
Before
Any Macrotask
```

***

# Advanced Example

```javascript
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve()
  .then(() => {
    console.log(3);
  });

console.log(4);
```

Output:

```text
1
4
3
2
```

***

# Async Await and Event Loop

```javascript
async function test() {

  console.log("A");

  await Promise.resolve();

  console.log("B");
}

test();

console.log("C");
```

Output:

```text
A
C
B
```

***

## Why?

```javascript
await
```

creates a microtask.

Execution:

```text
A
C
(Microtask)
B
```

***

# React Example

```jsx
function App() {

  const handleClick = () => {

    console.log("1");

    Promise.resolve()
      .then(() =>
        console.log("2")
      );

    setTimeout(() =>
      console.log("3"), 0);

    console.log("4");
  };

  return (
    <button
      onClick={handleClick}
    >
      Click
    </button>
  );
}
```

Output:

```text
1
4
2
3
```

***

# Event Loop Interview Diagram

```text
Call Stack

console.log(1)
setTimeout()
Promise.then()

      ↓

Microtask Queue
---------------
Promise.then()

      ↓

Callback Queue
--------------
setTimeout()

      ↓

Event Loop

Executes:
1. Stack
2. Microtasks
3. Macrotasks
```

***

# Tricky Interview Question

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");
  })
  .then(() => {
    console.log("D");
  });

console.log("E");
```

### Output

```text
A
E
C
D
B
```

### Reason

```text
1. Synchronous Code

A
E

2. Microtasks

C
D

3. Macrotasks

B
```

***

# Browser vs Node.js

### Browser

Queues:

```text
Call Stack
Microtask Queue
Callback Queue
```

***

### Node.js

Additional phases:

```text
Timers
Pending Callbacks
Poll
Check
Close
```

Interviewers may ask this for senior roles.

***

# Senior React Interview Answer

> JavaScript is single-threaded and executes code using a Call Stack. Asynchronous operations such as `setTimeout`, `fetch`, and DOM events are handled by browser APIs and placed into queues. The Event Loop continuously checks whether the Call Stack is empty and moves queued callbacks for execution. Microtasks created by `Promise.then()`, `async/await`, and `queueMicrotask()` are always executed before macrotasks such as `setTimeout()` and DOM events. Understanding the Event Loop is important in React because state updates, async API calls, effects, and Promise-based operations all interact with the browser's scheduling mechanism.

# 1. Async Tasks in the Event Loop

JavaScript is **single-threaded**, but async tasks are handled using browser APIs and the Event Loop.

## Example

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timer Done");
}, 2000);

fetch("/users")
  .then(() => {
    console.log("API Done");
  });

console.log("End");
```

### Execution Flow

```text
Call Stack

Start
setTimeout
fetch
End
```

Output immediately:

```text
Start
End
```

After async operations complete:

```text
API Done
Timer Done
```

***

# 2. Microtask vs Macrotask

One of the most common React interviews questions.

***

## Macrotasks

Examples:

```javascript
setTimeout()
setInterval()
DOM Events
MessageChannel
```

Placed in:

```text
Macrotask Queue
```

***

## Microtasks

Examples:

```javascript
Promise.then()
Promise.catch()
Promise.finally()
queueMicrotask()
async/await
```

Placed in:

```text
Microtask Queue
```

***

# Example

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3");
  });

console.log("4");
```

Output:

```text
1
4
3
2
```

***

## Why?

### Synchronous Code

```javascript
1
4
```

***

### Microtasks

```javascript
3
```

Promise callback executes first.

***

### Macrotasks

```javascript
2
```

setTimeout executes later.

***

# More Advanced Example

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");
  })
  .then(() => {
    console.log("D");
  });

console.log("E");
```

Output:

```text
A
E
C
D
B
```

***

# Async/Await Uses Microtasks

```javascript
async function test() {
  console.log("1");

  await Promise.resolve();

  console.log("2");
}

test();

console.log("3");
```

Output:

```text
1
3
2
```

Explanation:

```text
await
↓
Promise
↓
Microtask Queue
```

***

# Event Loop Diagram

```text
┌─────────────┐
│ Call Stack  │
└──────┬──────┘
       │
       ▼

Microtask Queue
---------------
Promise.then
await

       │
       ▼

Macrotask Queue
---------------
setTimeout
setInterval
Click Events

       │
       ▼

Event Loop
```

Priority:

```text
1. Call Stack

2. All Microtasks

3. One Macrotask

4. Repeat
```

***

# 3. How Event Loop Affects React Rendering

React heavily relies on:

```text
Promises
Async APIs
Scheduling
Browser Event Loop
```

React's runtime and scheduler are built around scheduling and prioritising work. Files related to React DOM and the React scheduler are present in your enterprise codebase, showing React's scheduling infrastructure. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Propeller%20Group%201/codebase/corporate-learning-system-main/frontend/node_modules/react-dom/cjs/react-dom.development.js?web=1), [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Group4_Submission/code/packages/web-ui/node_modules/.vite/deps/chunk-5KRG5KYA.js?web=1)

***

## Example 1: State Update

```jsx
function App() {
  const [count,
         setCount] =
    useState(0);

  const handleClick =
    () => {

      setCount(c => c + 1);

      console.log(count);
    };

  return (
    <button
      onClick={handleClick}
    >
      {count}
    </button>
  );
}
```

Output:

```text
Old Count
```

Why?

```text
React schedules update
       ↓
Event Handler Finishes
       ↓
React Re-renders
```

State updates are not applied immediately.

***

## Example 2: Promise + React

```jsx
function App() {

  const [
    users,
    setUsers
  ] = useState([]);

  useEffect(() => {

    Promise.resolve([
      "Sudhir"
    ]).then(data => {

      setUsers(data);

      console.log(
        "Promise Finished"
      );
    });

  }, []);

  return null;
}
```

Flow:

```text
Component Mount
      ↓
Promise Scheduled
      ↓
Microtask Queue
      ↓
setState
      ↓
React Re-render
```

***

## Example 3: Blocking the Event Loop

```javascript
function expensiveTask() {

  const start =
    Date.now();

  while (
    Date.now() -
    start <
    5000
  ) {}
}

expensiveTask();
```

Problem:

```text
UI Freeze
React Can't Render
Browser Can't Paint
```

The Event Loop is blocked.

***

## Better Approach

```javascript
setTimeout(() => {
  expensiveTask();
}, 0);
```

or

```javascript
requestIdleCallback()
```

or

```javascript
Web Worker
```

***

# React Rendering Timeline

```text
User Click
    ↓
Event Handler
    ↓
setState()
    ↓
React Schedules Update
    ↓
Call Stack Empty
    ↓
Reconciliation
    ↓
Virtual DOM Diff
    ↓
DOM Update
    ↓
Browser Paint
```

***

# Senior React Interview Answer

> JavaScript's Event Loop coordinates execution between the Call Stack, Microtask Queue, and Macrotask Queue. Microtasks such as `Promise.then()` and `async/await` always execute before macrotasks like `setTimeout()`. This directly affects React because state updates, Promise-based API calls, effects, and React's scheduler all depend on the Event Loop. When a state update is triggered, React schedules rendering work, performs reconciliation, updates the Virtual DOM, and finally commits changes to the Real DOM. Long-running synchronous code can block the Event Loop, preventing React from rendering and causing UI freezes.

# Event Loop Example: Promises vs setTimeout

## Code

```javascript
console.log("1");

setTimeout(() => {
  console.log("2 - setTimeout");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3 - Promise");
  });

console.log("4");
```

## Output

```text
1
4
3 - Promise
2 - setTimeout
```

## Why?

### Step 1: Synchronous Code

```javascript
console.log("1");
console.log("4");
```

Output:

```text
1
4
```

***

### Step 2: Promise

```javascript
Promise.then()
```

goes to:

```text
Microtask Queue
```

***

### Step 3: setTimeout

```javascript
setTimeout()
```

goes to:

```text
Macrotask Queue
```

***

### Step 4: Event Loop

Priority:

```text
Call Stack
   ↓
Microtasks
   ↓
Macrotasks
```

Therefore:

```text
3
2
```

***

# More Complex Example

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");
  })
  .then(() => {
    console.log("D");
  });

queueMicrotask(() => {
  console.log("E");
});

console.log("F");
```

Output:

```text
A
F
C
E
D
B
```

Reason:

```text
Sync Code
A
F

Microtasks
C
E
D

Macrotasks
B
```

***

# How React Schedules State Updates

React doesn't immediately update the DOM when you call:

```jsx
setCount(count + 1);
```

Instead it schedules work.

***

## Example

```jsx
function App() {

  const [
    count,
    setCount
  ] = useState(0);

  const handleClick = () => {

    setCount(count + 1);

    console.log(count);
  };

  return (
    <button
      onClick={handleClick}
    >
      {count}
    </button>
  );
}
```

***

## First Click

Current:

```javascript
count = 0
```

You click:

```javascript
setCount(1);
console.log(count);
```

Output:

```text
0
```

Not:

```text
1
```

***

## Why?

React schedules the update.

Flow:

```text
Click Event
      ↓
Event Handler
      ↓
setState()
      ↓
React Queues Update
      ↓
Handler Finishes
      ↓
React Reconciliation
      ↓
Virtual DOM Update
      ↓
DOM Commit
      ↓
Paint
```

***

# React Batching

React batches multiple updates.

```jsx
const handleClick = () => {

  setCount(c => c + 1);

  setCount(c => c + 1);

  setCount(c => c + 1);
};
```

Result:

```text
+3
```

Not:

```text
3 Separate Renders
```

Because React groups updates before rendering.

***

# React Event Priority

Modern React Scheduler assigns priorities to updates.

React uses a scheduling mechanism internally to prioritise work and yield control back to the browser when needed. React's scheduler implementation and React DOM runtime contain priority-based scheduling concepts.

Conceptually:

```text
High Priority
-------------
User Input
Typing
Click

Medium Priority
---------------
Network Updates

Low Priority
------------
Background Rendering
Prefetching
```

Example:

```jsx
import {
  startTransition
} from "react";

function Search() {

  const [
    query,
    setQuery
  ] = useState("");

  const [
    results,
    setResults
  ] = useState([]);

  function handleChange(e) {

    setQuery(
      e.target.value
    );

    startTransition(() => {

      setResults(
        expensiveFilter()
      );

    });
  }
}
```

React prioritises:

```text
Typing
   ↑

Filter Results
   ↓
```

so the UI stays responsive.

***

# Impact of Blocking the Event Loop

## Bad Example

```javascript
function blockThread() {

  const start =
    Date.now();

  while (
    Date.now() - start <
    5000
  ) {}
}

blockThread();
```

***

## What Happens?

```text
Event Loop Blocked
```

React cannot:

```text
❌ Render
❌ Process User Input
❌ Execute Promises
❌ Run Effects
❌ Paint UI
```

Browser freezes.

***

## Example in React

```jsx
function App() {

  const handleClick = () => {

    setCount(c => c + 1);

    // Blocking work
    for (
      let i = 0;
      i < 10000000000;
      i++
    ) {}
  };

  return (
    <button
      onClick={handleClick}
    >
      Click
    </button>
  );
}
```

User clicks.

Expected:

```text
Count updates
```

Actual:

```text
UI freezes first
```

The render cannot happen until the loop completes.

***

# Better Solutions

### 1. Break Work into Chunks

```javascript
setTimeout(() => {
  processChunk();
}, 0);
```

***

### 2. Use Web Workers

```text
Heavy Calculations
      ↓
Web Worker Thread
```

UI remains responsive.

***

### 3. React Transition API

```jsx
startTransition(() => {
  updateLargeList();
});
```

Lower priority update.

***

# Interview Answer

### Event Loop Priority

```text
1. Call Stack

2. Microtask Queue
   - Promise.then
   - async/await
   - queueMicrotask

3. Macrotask Queue
   - setTimeout
   - setInterval
   - DOM Events
```

### React + Event Loop

```text
User Action
      ↓
setState
      ↓
React Scheduler
      ↓
Reconciliation
      ↓
DOM Update
      ↓
Browser Paint
```

### Blocking Event Loop

```text
Long Synchronous Tasks
        ↓
Freeze UI
        ↓
No Rendering
        ↓
Poor User Experience
```

**Senior React takeaway:** React performance is not just about Virtual DOM. If you block the JavaScript event loop with heavy synchronous work, React cannot render, process state updates, or respond to user interactions, regardless of how efficient the Virtual DOM is.

# 1. React's `startTransition()` and Event Loop Impact

`startTransition()` was introduced in React 18 for **non-urgent updates**.

It tells React:

```text
High Priority → User Input
Low Priority  → Expensive UI Updates
```

***

## Without startTransition

```jsx
function Search() {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const handleChange = (e) => {
    const value = e.target.value;

    setQuery(value);

    // Expensive operation
    const filtered =
      hugeList.filter(item =>
        item.includes(value)
      );

    setResults(filtered);
  };

  return (
    <input
      value={query}
      onChange={handleChange}
    />
  );
}
```

### Problem

```text
Type Character
      ↓
Filter 50,000 Items
      ↓
UI Freezes
```

Typing becomes laggy.

***

## With startTransition

```jsx
import {
  startTransition
} from "react";

function Search() {

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const handleChange =
    (e) => {

      const value =
        e.target.value;

      // Urgent Update
      setQuery(value);

      // Non-Urgent Update
      startTransition(() => {

        const filtered =
          hugeList.filter(item =>
            item.includes(value)
          );

        setResults(filtered);

      });
    };

  return (
    <input
      value={query}
      onChange={handleChange}
    />
  );
}
```

***

## What Happens Internally?

```text
User Types
     ↓
setQuery()
     ↓
High Priority
     ↓
Input Updates Immediately

Meanwhile

setResults()
     ↓
Low Priority
     ↓
React Can Yield
     ↓
Render Later
```

***

### Event Loop Impact

Without transition:

```text
Input
 ↓
Heavy Render
 ↓
UI Blocked
```

With transition:

```text
Input
 ↓
High Priority Render
 ↓
Browser Remains Responsive
 ↓
Low Priority Work Later
```

***

# 2. Event Loop Blocking UI in React

## Example

```jsx
function App() {

  const [
    count,
    setCount
  ] = useState(0);

  const handleClick =
    () => {

      setCount(c => c + 1);

      // Heavy Task
      const start =
        Date.now();

      while (
        Date.now() -
        start <
        5000
      ) {}
    };

  return (
    <button
      onClick={handleClick}
    >
      {count}
    </button>
  );
}
```

***

## Expected

```text
Click
↓
Count Updates
```

***

## Actual

```text
Click
↓
Browser Frozen 5 Seconds
↓
Count Updates
```

***

## Why?

JavaScript is single-threaded.

```text
Call Stack Busy
       ↓
React Can't Render
       ↓
Browser Can't Paint
       ↓
User Can't Interact
```

Even though:

```jsx
setCount()
```

was called first, React cannot commit the update until the blocking task finishes.

***

## Timeline

```text
Click Event
      ↓
setState()
      ↓
Long Loop (5 sec)
      ↓
Call Stack Clears
      ↓
React Render
      ↓
DOM Update
      ↓
Browser Paint
```

***

## Better Solution

### Break Work into Chunks

```javascript
setTimeout(() => {
  processChunk();
}, 0);
```

***

### Web Worker

```text
Heavy Calculation
       ↓
Worker Thread
       ↓
Main UI Free
```

***

### React Transition

```jsx
startTransition(() => {
  updateHugeList();
});
```

***

# 3. How React Batches State Updates Internally

React does **not render immediately** after each `setState`.

***

## Example

```jsx
function Counter() {

  const [
    count,
    setCount
  ] = useState(0);

  const handleClick =
    () => {

      setCount(c => c + 1);

      setCount(c => c + 1);

      setCount(c => c + 1);
    };

  return (
    <button
      onClick={handleClick}
    >
      {count}
    </button>
  );
}
```

***

## Result

```text
0 → 3
```

Not:

```text
0 → 1
1 → 2
2 → 3
```

***

## Why?

React batches updates.

Internally:

```text
Click Event
      ↓
Update Queue

+1
+1
+1

      ↓
Single Render
      ↓
Final State = 3
```

***

# React Batching Example

```jsx
const handleClick = () => {

  setName("Sudhir");

  setAge(10);

  setCity("Pune");
};
```

React performs:

```text
1 Render
```

Instead of:

```text
3 Renders
```

***

# React 18 Automatic Batching

### Before React 18

```jsx
setTimeout(() => {

  setCount(c => c + 1);

  setName("Sudhir");

});
```

Produced:

```text
2 Renders
```

***

### React 18+

Now React automatically batches:

```jsx
setTimeout(() => {

  setCount(c => c + 1);

  setName("Sudhir");

});
```

Result:

```text
1 Render
```

***

# Interview Priority Order

Think of React updates like this:

```text
Highest Priority
---------------
Typing
Click
Input

Medium
------
State Updates

Low
---
Transitions
Large Lists
Background Rendering
```

Example:

```jsx
setInputValue()
```

Priority:

```text
Urgent
```

Example:

```jsx
startTransition(() => {
  setFilteredUsers();
});
```

Priority:

```text
Non-Urgent
```

***

# Senior React Interview Answer

> React uses a scheduler to prioritise rendering work. Updates triggered by typing, clicks, and user interactions are generally treated as urgent, while updates wrapped inside `startTransition()` are considered non-urgent and may be interrupted to keep the UI responsive. React batches multiple state updates into a single render cycle to reduce unnecessary re-renders. However, React still runs on the JavaScript main thread, so if the event loop is blocked by long-running synchronous code, React cannot render, process updates, or respond to user input until that work completes. This is why techniques such as batching, transitions, code splitting, and Web Workers are important for maintaining UI responsiveness.

If you're preparing for **Senior React interviews**, you don't need 100 examples memorised. You need to master the **15–20 patterns** that interviewers keep repeating.

# Golden Rule

```text
1. Execute Call Stack

2. Execute ALL Microtasks
   - Promise.then
   - catch
   - finally
   - await

3. Execute ONE Macrotask
   - setTimeout
   - setInterval

4. Repeat
```

***

# Example 1

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

### Output

```text
A
D
C
B
```

***

# Example 2

```javascript
console.log(1);

Promise.resolve().then(() => {
  console.log(2);
});

Promise.resolve().then(() => {
  console.log(3);
});

console.log(4);
```

### Output

```text
1
4
2
3
```

***

# Example 3

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise1");
  })
  .then(() => {
    console.log("Promise2");
  });

console.log("End");
```

### Output

```text
Start
End
Promise1
Promise2
Timer
```

***

# Example 4 (Promise Reject)

```javascript
console.log("A");

Promise.reject()
  .catch(() => {
    console.log("B");
  });

console.log("C");
```

### Output

```text
A
C
B
```

***

# Example 5

```javascript
setTimeout(() => {
  console.log("Timeout 1");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

setTimeout(() => {
  console.log("Timeout 2");
}, 0);
```

### Output

```text
Promise
Timeout 1
Timeout 2
```

***

# Example 6 (async await)

```javascript
async function test() {
  console.log("A");

  await Promise.resolve();

  console.log("B");
}

test();

console.log("C");
```

### Output

```text
A
C
B
```

***

# Example 7

```javascript
async function test() {
  console.log("1");

  await Promise.resolve();

  console.log("2");

  await Promise.resolve();

  console.log("3");
}

test();

console.log("4");
```

### Output

```text
1
4
2
3
```

***

# Example 8

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

async function fn() {
  console.log("C");

  await Promise.resolve();

  console.log("D");
}

fn();

console.log("E");
```

### Output

```text
A
C
E
D
B
```

***

# Example 9

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");

  Promise.resolve().then(() => {
    console.log("3");
  });

}, 0);

Promise.resolve().then(() => {
  console.log("4");
});

console.log("5");
```

### Output

```text
1
5
4
2
3
```

***

# Example 10 (Most Asked)

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");
  });

queueMicrotask(() => {
  console.log("D");
});

console.log("E");
```

### Output

```text
A
E
C
D
B
```

***

# Example 11 (Nested Promise)

```javascript
Promise.resolve()
  .then(() => {
    console.log("1");

    Promise.resolve().then(() => {
      console.log("2");
    });
  })
  .then(() => {
    console.log("3");
  });
```

### Output

```text
1
2
3
```

***

# Example 12 (Nested Timeout)

```javascript
setTimeout(() => {

  console.log("1");

  setTimeout(() => {
    console.log("2");
  }, 0);

}, 0);
```

### Output

```text
1
2
```

***

# Example 13

```javascript
console.log("Start");

Promise.resolve()
  .then(() => {
    console.log("P1");
  });

setTimeout(() => {
  console.log("T1");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("P2");
  });

console.log("End");
```

### Output

```text
Start
End
P1
P2
T1
```

***

# Example 14 (Async + Timeout)

```javascript
async function test() {

  console.log("A");

  setTimeout(() => {
    console.log("B");
  }, 0);

  await Promise.resolve();

  console.log("C");
}

test();

console.log("D");
```

### Output

```text
A
D
C
B
```

***

# Example 15 (React Interview Favourite)

```jsx
function App() {

  const handleClick = () => {

    console.log("1");

    Promise.resolve().then(() => {
      console.log("2");
    });

    setTimeout(() => {
      console.log("3");
    }, 0);

    console.log("4");
  };

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

### Output

```text
1
4
2
3
```

***

# Super Tricky Example

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");

    return Promise.resolve();
  })
  .then(() => {
    console.log("D");
  });

Promise.resolve()
  .then(() => {
    console.log("E");
  });

console.log("F");
```

### Output

```text
A
F
C
E
D
B
```

***

# Interview Shortcut

Whenever you see code:

### Step 1

Run all sync code

```text
console.log
function calls
```

***

### Step 2

Collect Microtasks

```text
Promise.then
catch
finally
await
queueMicrotask
```

***

### Step 3

Collect Macrotasks

```text
setTimeout
setInterval
```

***

### Step 4

Execute

```text
Sync
↓
Microtasks
↓
Macrotasks
```

# Senior React Interview One-Line Answer

```text
Call Stack
    ↓
Microtask Queue
(Promise, await)

    ↓
Macrotask Queue
(setTimeout)

    ↓
Event Loop
```

**Always remember: *Promises and async/await execute before setTimeout, even if setTimeout has 0ms delay.***
