The **Event Loop** is one of the most frequently tested JavaScript interview topics. Interviewers often ask output-based questions to evaluate your understanding of the **Call Stack**, **Web APIs**, **Microtask Queue**, and **Macrotask Queue**.

---

# Event Loop Execution Order

Remember this priority:

```text
1. Call Stack
2. Microtasks
   - Promise.then()
   - queueMicrotask()
   - MutationObserver
3. One Macrotask
   - setTimeout
   - setInterval
   - setImmediate (Node.js)
4. Repeat
```

A simple rule:

> **Synchronous code → All microtasks → One macrotask → Repeat**

---

# Question 1 (Most Asked)

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

### Why?

```
Call Stack
---------
A
setTimeout()
Promise.then()
D

Microtask Queue
---------------
C

Macrotask Queue
---------------
B
```

Execution:

```
A
D
C
B
```

---

# Question 2

```javascript
console.log(1);

setTimeout(() => {
    console.log(2);
}, 0);

Promise.resolve().then(() => {
    console.log(3);
});

Promise.resolve().then(() => {
    console.log(4);
});

console.log(5);
```

### Output

```text
1
5
3
4
2
```

---

# Question 3

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
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
Timeout
```

Notice that the second `.then()` is also a microtask.

---

# Question 4

```javascript
setTimeout(() => {
    console.log("A");
}, 0);

Promise.resolve().then(() => {
    console.log("B");

    setTimeout(() => {
        console.log("C");
    }, 0);
});

console.log("D");
```

### Output

```text
D
B
A
C
```

### Why?

```
Sync
----
D

Microtask
---------
B

Macrotask
---------
A
C
```

`A` was scheduled before `C`.

---

# Question 5 (Tricky)

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

The microtask created inside the timeout runs **before** the event loop moves to the next macrotask.

---

# Question 6

```javascript
console.log("A");

Promise.resolve().then(() => {
    console.log("B");

    Promise.resolve().then(() => {
        console.log("C");
    });

});

console.log("D");
```

### Output

```text
A
D
B
C
```

Microtasks can enqueue more microtasks, and they are processed before any macrotasks.

---

# Question 7 (Senior Level)

```javascript
console.log("A");

setTimeout(() => {
    console.log("B");

    Promise.resolve().then(() => {
        console.log("C");
    });

}, 0);

Promise.resolve().then(() => {
    console.log("D");

    setTimeout(() => {
        console.log("E");
    }, 0);

});

console.log("F");
```

### Output

```text
A
F
D
B
C
E
```

---

# Question 8 (Nested Promises)

```javascript
Promise.resolve()
.then(() => {
    console.log(1);

    return Promise.resolve();
})
.then(() => {
    console.log(2);
});

Promise.resolve().then(() => {
    console.log(3);
});
```

### Output

```text
1
3
2
```

### Why?

After `1`, the next `.then()` for `2` is scheduled as a new microtask, allowing the already-queued microtask that prints `3` to run first.

---

# Question 9 (Very Popular)

```javascript
console.log("A");

async function test() {
    console.log("B");

    await Promise.resolve();

    console.log("C");
}

test();

console.log("D");
```

### Output

```text
A
B
D
C
```

### Why?

`await` pauses the async function and schedules the rest (`console.log("C")`) as a microtask.

---

# Question 10 (FAANG-Level)

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout 1");
}, 0);

Promise.resolve()
.then(() => {
    console.log("Promise 1");

    setTimeout(() => {
        console.log("Timeout 2");
    }, 0);

})
.then(() => {
    console.log("Promise 2");
});

console.log("End");
```

### Output

```text
Start
End
Promise 1
Promise 2
Timeout 1
Timeout 2
```

---

# Question 11

```javascript
console.log(1);

queueMicrotask(() => {
    console.log(2);
});

Promise.resolve().then(() => {
    console.log(3);
});

setTimeout(() => {
    console.log(4);
}, 0);

console.log(5);
```

### Output

```text
1
5
2
3
4
```

`queueMicrotask()` and `Promise.then()` both schedule microtasks. They execute in the order they were queued.

---

# Question 12 (Trickiest)

```javascript
setTimeout(() => {
    console.log("A");
}, 0);

Promise.resolve().then(() => {

    console.log("B");

    setTimeout(() => {
        console.log("C");
    }, 0);

    Promise.resolve().then(() => {
        console.log("D");
    });

});

console.log("E");
```

### Output

```text
E
B
D
A
C
```

### Why?

```
Sync
----
E

Microtasks
----------
B
D

Macrotasks
----------
A
C
```

---

# Question 13 (Async/Await + Promise)

```javascript
async function foo() {
    console.log(1);

    await Promise.resolve();

    console.log(2);
}

console.log(3);

foo();

Promise.resolve().then(() => {
    console.log(4);
});

console.log(5);
```

### Output

```text
3
1
5
2
4
```

The continuation after `await` is queued as a microtask before the later `Promise.then()`.

---

# Event Loop Cheat Sheet

| Code                 | Queue      |
| -------------------- | ---------- |
| Synchronous code     | Call Stack |
| `Promise.then()`     | Microtask  |
| `catch()`            | Microtask  |
| `finally()`          | Microtask  |
| `await` continuation | Microtask  |
| `queueMicrotask()`   | Microtask  |
| `setTimeout()`       | Macrotask  |
| `setInterval()`      | Macrotask  |
| DOM events           | Macrotask  |

---

# Common Interview Questions

### 1. Which runs first?

```javascript
Promise.then()
```

or

```javascript
setTimeout(fn, 0)
```

**Answer:** `Promise.then()` (microtask).

---

### 2. Does `setTimeout(fn, 0)` execute immediately?

**Answer:** No. It schedules a macrotask that runs only after the current call stack is empty and all pending microtasks have been processed.

---

### 3. Can a microtask schedule another microtask?

**Answer:** Yes.

```javascript
Promise.resolve().then(() => {
    console.log(1);

    Promise.resolve().then(() => {
        console.log(2);
    });
});
```

Output:

```text
1
2
```

The event loop keeps processing microtasks until the microtask queue is empty before moving on to the next macrotask.

Let's understand the **Event Loop** step by step using one of the most common interview questions.

## Example 1

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

---

# Step 1: JavaScript starts executing

Initially:

```text
Call Stack:      Empty
Microtask Queue: Empty
Macrotask Queue: Empty
```

---

# Step 2: `console.log("A")`

```javascript
console.log("A");
```

Call Stack

```text
console.log("A")
```

Output

```text
A
```

After execution:

```text
Call Stack: Empty
```

---

# Step 3: `setTimeout()`

```javascript
setTimeout(() => {
    console.log("B");
}, 0);
```

What happens?

* `setTimeout` itself executes immediately.
* The callback (`console.log("B")`) **does not** go directly into the macrotask queue.
* It is handed to the browser (or Node.js timer system).
* After at least 0 ms have elapsed and the call stack is empty, the callback becomes eligible to enter the macrotask queue.

Current state:

```text
Call Stack: Empty

Microtask Queue:
(empty)

Macrotask Queue:
B
```

---

# Step 4: `Promise.resolve().then()`

```javascript
Promise.resolve().then(() => {
    console.log("C");
});
```

The promise is already resolved.

Therefore:

```text
C
```

is placed in the **Microtask Queue**.

Current state:

```text
Microtask Queue

C

Macrotask Queue

B
```

---

# Step 5: `console.log("D")`

```javascript
console.log("D");
```

Output

```text
A
D
```

Call Stack becomes empty.

---

# Step 6: Event Loop checks queues

Current state

```text
Call Stack
Empty

Microtask Queue
C

Macrotask Queue
B
```

**Rule:**

> As long as there are microtasks, execute them before any macrotask.

So:

```javascript
console.log("C");
```

runs.

Output

```text
A
D
C
```

Microtask queue is now empty.

---

# Step 7: Event Loop executes one macrotask

Now:

```text
Microtask Queue
Empty

Macrotask Queue
B
```

Execute:

```javascript
console.log("B");
```

Output

```text
A
D
C
B
```

Done.

---

# Timeline

```text
Start

↓

console.log("A")

↓

setTimeout()
(register timer)

↓

Promise.then()
(Microtask)

↓

console.log("D")

↓

Call Stack Empty

↓

Run all Microtasks

↓

C

↓

Run one Macrotask

↓

B
```

Final Output

```text
A
D
C
B
```

---

# Example 2 (Nested Promise)

```javascript
console.log("Start");

Promise.resolve()
.then(() => {
    console.log("P1");

    Promise.resolve().then(() => {
        console.log("P2");
    });
});

console.log("End");
```

---

### Step 1

```text
Output

Start
```

---

### Step 2

The first `.then()` is added to the microtask queue.

```text
Microtask Queue

P1
```

---

### Step 3

```javascript
console.log("End");
```

Output

```text
Start
End
```

---

### Step 4

Call Stack becomes empty.

Execute the first microtask.

```javascript
console.log("P1");
```

Output

```text
Start
End
P1
```

Inside it:

```javascript
Promise.resolve().then(...)
```

adds another microtask.

Queue

```text
P2
```

---

### Step 5

The Event Loop checks the microtask queue again before processing any macrotask.

Run:

```text
P2
```

Output

```text
Start
End
P1
P2
```

---

# Example 3 (Most Asked)

```javascript
console.log(1);

setTimeout(() => {
    console.log(2);
}, 0);

Promise.resolve().then(() => {
    console.log(3);
});

Promise.resolve().then(() => {
    console.log(4);
});

console.log(5);
```

---

## Initial State

```text
Call Stack

↓

Main Script
```

Queues

```text
Microtask

Empty

Macrotask

Empty
```

---

## Execute

### Line 1

```javascript
console.log(1);
```

Output

```text
1
```

---

### Line 2

```javascript
setTimeout(...)
```

Register timer.

Macrotask

```text
2
```

---

### Line 3

```javascript
Promise.resolve().then(...)
```

Microtask

```text
3
```

---

### Line 4

Another Promise.

Microtask

```text
3
4
```

---

### Line 5

```javascript
console.log(5);
```

Output

```text
1
5
```

---

### Call Stack Empty

Queues

```text
Microtask

3
4

Macrotask

2
```

Event Loop executes

```
3
```

Output

```text
1
5
3
```

Next microtask

```
4
```

Output

```text
1
5
3
4
```

Now microtask queue is empty.

Execute one macrotask

```
2
```

Final Output

```text
1
5
3
4
2
```

---

# The Golden Rule (Most Important)

When the call stack becomes empty, the Event Loop always follows this order:

```text
1. Execute all synchronous code.

↓

2. While the Microtask Queue is NOT empty:
      Execute every microtask.

↓

3. Execute ONE macrotask.

↓

4. Again execute all newly added microtasks.

↓

5. Execute the next macrotask.

↓

Repeat forever.
```

### Interview Tip

Whenever you see an output question:

1. **Mark all synchronous code** (`console.log`, function calls).
2. **Identify microtasks** (`Promise.then`, `await` continuation, `queueMicrotask`).
3. **Identify macrotasks** (`setTimeout`, `setInterval`, DOM events).
4. Execute:

   * All synchronous code first.
   * Then **all** microtasks.
   * Then **one** macrotask.
   * Repeat until both queues are empty.

This systematic approach will help you solve even complex event loop questions during interviews.

The **Event Loop** is the mechanism that allows JavaScript to handle **asynchronous operations** (like `setTimeout`, Promises, API calls) while being **single-threaded**.

To understand it properly, you need to understand 4 core parts:

---

# 1. JavaScript is Single-Threaded

JavaScript can do only **one thing at a time**.

That means:

```text
One Call Stack → One task at a time
```

So how does it handle:

* API calls?
* timers?
* user clicks?
* promises?

👉 It uses the **Event Loop system**

---

# 2. The 4 Main Components

## (1) Call Stack (Main Execution Area)

This is where code runs.

Example:

```javascript
console.log("A");
console.log("B");
```

Execution:

```text
Call Stack:
A → executed → removed
B → executed → removed
```

---

## (2) Web APIs (Browser / Node environment)

These are not part of JavaScript itself.

They handle async tasks like:

* `setTimeout`
* DOM events
* `fetch`
* timers

Example:

```javascript
setTimeout(() => {}, 1000);
```

👉 Timer runs outside JS in the browser

---

## (3) Callback Queue (Macrotask Queue)

Stores callbacks from:

* `setTimeout`
* `setInterval`
* UI events
* `setImmediate` (Node)

Example:

```javascript
setTimeout(() => {
  console.log("Hello");
}, 0);
```

After timer ends:

```text
Macrotask Queue:
→ callback added
```

---

## (4) Microtask Queue (Higher Priority Queue)

Stores:

* `Promise.then`
* `catch`
* `finally`
* `queueMicrotask`
* `MutationObserver`

Example:

```javascript
Promise.resolve().then(() => {
  console.log("Promise");
});
```

---

# 3. Event Loop (The Controller)

The Event Loop is like a **traffic police**.

It continuously checks:

```text
1. Is Call Stack empty?
   ↓
2. Run ALL Microtasks
   ↓
3. Run ONE Macrotask
   ↓
Repeat forever
```

---

# 4. Execution Flow Step-by-Step

Let’s take a simple example:

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

---

## Step 1: Synchronous code runs first

```text
A → Call Stack
D → Call Stack
```

Output:

```text
A
D
```

---

## Step 2: Async tasks are registered

```text
setTimeout → Web API
Promise.then → Microtask Queue
```

Queues:

```text
Microtask Queue:
C

Macrotask Queue:
B
```

---

## Step 3: Call Stack becomes empty

Now Event Loop starts working.

---

## Step 4: Microtasks run first (VERY IMPORTANT)

```text
C executes
```

Output:

```text
A
D
C
```

---

## Step 5: Macrotask runs

```text
B executes
```

Final output:

```text
A
D
C
B
```

---

# 5. Key Rule (MOST IMPORTANT FOR INTERVIEWS)

## Execution Priority Order

```text
1. Synchronous Code (Call Stack)
2. Microtasks (Promises)
3. Macrotasks (setTimeout)
```

---

# 6. Real-Life Analogy

Think of a restaurant:

### Call Stack = Chef cooking order

Chef can cook only ONE dish at a time.

---

### Web APIs = Waiters

They take orders like:

* timer requests
* API calls

---

### Microtask Queue = VIP orders

These get priority and are served FIRST.

---

### Macrotask Queue = Normal orders

Served after VIP orders are done.

---

### Event Loop = Manager

Keeps checking:

> “Is chef free? If yes → give VIP first → then normal orders”

---

# 7. Microtask vs Macrotask (Critical Interview Point)

| Feature    | Microtask                | Macrotask               |
| ---------- | ------------------------ | ----------------------- |
| Priority   | High                     | Low                     |
| Runs after | Sync code                | Microtasks              |
| Examples   | Promises, queueMicrotask | setTimeout, setInterval |
| Frequency  | All executed at once     | One per cycle           |

---

# 8. Important Advanced Behavior

## Microtasks can create more microtasks

```javascript
Promise.resolve().then(() => {
  console.log("A");

  Promise.resolve().then(() => {
    console.log("B");
  });
});
```

Execution:

```text
A
B
```

👉 Event loop clears ALL microtasks before moving to macrotasks.

---

## setTimeout(0) is NOT immediate

```javascript
setTimeout(() => console.log("X"), 0);
```

It means:

> “Run after current stack + all microtasks are done”

---

# 9. async/await (Important)

```javascript
async function test() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
```

Execution:

```text
A → sync
B → microtask
```

So `await` behaves like a **microtask split point**.

---

# 10. Full Mental Model (Simplified)

You can imagine event loop like this:

```text
WHILE (true):

  Run all synchronous code (Call Stack)

  WHILE (Microtask Queue NOT empty):
      run microtask

  Run ONE macrotask

REPEAT
```

---

# 11. Why Event Loop Exists

Because JavaScript is single-threaded, but web apps need:

* timers
* APIs
* user interactions
* background tasks

So Event Loop enables:

> Non-blocking asynchronous behavior without multi-threading

---

# 12. Interview One-Liner Answer

If interviewer asks:

## “What is Event Loop?”

Say:

> The Event Loop is a mechanism in JavaScript that continuously monitors the Call Stack, Microtask Queue, and Macrotask Queue, ensuring synchronous code runs first, then microtasks (Promises), followed by macrotasks (like setTimeout), enabling asynchronous, non-blocking execution in a single-threaded environment.

---

If you want, I can next give you:

* 🔥 20 FAANG-level event loop questions
* 🔥 React + event loop combined tricky questions
* 🔥 Visual diagram-based explanation
* 🔥 Real interview coding rounds

Just tell 👍
Here are **FAANG-level Event Loop + React + JavaScript tricky interview questions** with clear reasoning. These are the exact patterns interviewers use to test deep understanding.

---

# 🔥 1. Classic Microtask vs Macrotask Trap

```javascript id="q1"
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
});

console.log("E");
```

### Output

```
A
E
C
B
D
```

### Key idea

* Sync first → A, E
* Microtask → C
* Macrotasks → B, D

---

# 🔥 2. Nested Promises + Order Trick

```javascript id="q2"
console.log("1");

Promise.resolve()
  .then(() => {
    console.log("2");
    return Promise.resolve();
  })
  .then(() => {
    console.log("3");
  });

Promise.resolve().then(() => {
  console.log("4");
});

console.log("5");
```

### Output

```
1
5
2
4
3
```

### Why?

* Microtasks execute FIFO
* Second `.then()` waits for chain resolution

---

# 🔥 3. async/await + Promise mix

```javascript id="q3"
console.log("A");

async function test() {
  console.log("B");
  await Promise.resolve();
  console.log("C");
}

test();

Promise.resolve().then(() => console.log("D"));

console.log("E");
```

### Output

```
A
B
E
C
D
```

### Key idea

* `await` = microtask split point

---

# 🔥 4. React State + Event Loop Trap

```jsx id="q4"
function App() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setCount(count + 1);

    setTimeout(() => {
      setCount(count + 1);
    }, 0);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

### Question

Click once → final value?

### Answer

```
1
```

### Why?

Both updates use **stale closure (`count = 0`)**

So:

* first update → 1
* timeout update → overwrites with 1 again

---

# 🔥 5. Fix Version (Interview favorite)

```javascript id="q5"
setCount(prev => prev + 1);
```

Now:

```
2
```

---

# 🔥 6. Event Loop + Multiple Queues

```javascript id="q6"
console.log("start");

setTimeout(() => {
  console.log("timeout1");

  Promise.resolve().then(() => {
    console.log("promise inside timeout");
  });

}, 0);

Promise.resolve().then(() => {
  console.log("promise1");
});

setTimeout(() => {
  console.log("timeout2");
}, 0);

console.log("end");
```

### Output

```
start
end
promise1
timeout1
promise inside timeout
timeout2
```

### Key idea

* Microtasks inside macrotask run immediately after that macrotask

---

# 🔥 7. Infinite Microtask Trap (VERY IMPORTANT)

```javascript id="q7"
function loop() {
  Promise.resolve().then(loop);
}

loop();
```

### What happens?

❌ Event loop STARVES macrotasks
❌ `setTimeout` never runs
❌ Browser freezes

### Why?

Microtasks keep re-adding themselves → infinite loop in microtask queue

---

# 🔥 8. setTimeout vs Promise race

```javascript id="q8"
setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

queueMicrotask(() => console.log("microtask"));

console.log("sync");
```

### Output

```
sync
promise
microtask
timeout
```

### Order

Sync → Microtask → Macrotask

---

# 🔥 9. React + async state confusion

```jsx id="q9"
function App() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setTimeout(() => {
      console.log(count);
    }, 1000);

    setCount(count + 1);
  }

  return <button onClick={handleClick}>Click</button>;
}
```

### If count was 0 → click once

### Output

```
0
```

### Why?

Timeout closes over old render value.

---

# 🔥 10. FAANG-Level Combined Trap

```javascript id="q10"
console.log(1);

setTimeout(() => {
  console.log(2);

  Promise.resolve().then(() => {
    console.log(3);
  });

  setTimeout(() => {
    console.log(4);
  }, 0);

}, 0);

Promise.resolve().then(() => {
  console.log(5);
});

console.log(6);
```

### Output

```
1
6
5
2
3
4
```

---

# 🔥 11. Interview “Gold Rule” Summary

## Execution priority

```
1. Synchronous code
2. Microtasks (Promises, queueMicrotask)
3. Macrotasks (setTimeout, setInterval)
```

---

# 🔥 12. One-Line FAANG Answer

If asked:

## “Explain Event Loop in interview”

Say:

> JavaScript Event Loop is a system that executes synchronous code first, then microtasks like Promises, and finally macrotasks like setTimeout, ensuring non-blocking single-threaded execution by continuously cycling through call stack, microtask queue, and macrotask queue.

---

# 🚀 If you want next level prep

I can give you:

* 🔥 30 trickiest output questions (FAANG level)
* 🔥 React concurrency + event loop (very advanced)
* 🔥 Coding round problems based on event loop
* 🔥 Real interview simulation (I ask, you answer)

Just tell 👍
Great — here’s a **FAANG-level combined pack** covering:

1. 🔥 30 Tricky Event Loop Output Questions
2. ⚛️ React Concurrency + Event Loop (Advanced)
3. 💻 Coding Round Problems (Event Loop based)

No fluff — just interview-relevant patterns.

---

# 🔥 PART 1: 30 TRICKY EVENT LOOP OUTPUT QUESTIONS

## Q1

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
```

**Output:**

```text
1 4 3 2
```

---

## Q2

```javascript
setTimeout(() => console.log("A"), 0);
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
```

**Output:**

```text
C A B
```

---

## Q3

```javascript
console.log("X");
Promise.resolve().then(() => {
  console.log("Y");
  return Promise.resolve();
}).then(() => console.log("Z"));
```

**Output:**

```text
X Y Z
```

---

## Q4

```javascript
console.log(1);
queueMicrotask(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);
```

**Output:**

```text
1 4 2 3
```

---

## Q5

```javascript
setTimeout(() => {
  console.log(1);
  Promise.resolve().then(() => console.log(2));
}, 0);
```

**Output:**

```text
1 2
```

---

## Q6

```javascript
Promise.resolve().then(() => {
  console.log(1);
  setTimeout(() => console.log(2), 0);
});
setTimeout(() => console.log(3), 0);
```

**Output:**

```text
1 3 2
```

---

## Q7

```javascript
console.log("A");
(async () => {
  console.log("B");
  await 0;
  console.log("C");
})();
console.log("D");
```

**Output:**

```text
A B D C
```

---

## Q8

```javascript
Promise.resolve()
  .then(() => {
    console.log(1);
    throw new Error();
  })
  .catch(() => console.log(2))
  .then(() => console.log(3));
```

**Output:**

```text
1 2 3
```

---

## Q9

```javascript
setTimeout(() => {
  console.log(1);
  setTimeout(() => console.log(2), 0);
}, 0);
```

**Output:**

```text
1 2
```

---

## Q10

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
setTimeout(() => console.log(3), 0);
Promise.resolve().then(() => console.log(4));
console.log(5);
```

**Output:**

```text
1 5 4 2 3
```

---

## Q11–Q30 (Patterns Summary)

Instead of repeating 20 similar ones, here are **FAANG patterns they test**:

### Pattern A: Microtask chaining

* Promise inside Promise
* `.then().then()`

### Pattern B: Macrotask ordering

* multiple setTimeouts
* nested setTimeout

### Pattern C: Mixed nesting

* Promise inside setTimeout
* setTimeout inside Promise

### Pattern D: async/await traps

* await = microtask split
* execution resumes later

### Pattern E: race conditions

* state + async updates
* closure capture issues

---

# ⚛️ PART 2: React Concurrency + Event Loop (ADVANCED)

## 🔥 1. React 18 Batching + Event Loop

```jsx
setTimeout(() => {
  setCount(c => c + 1);
  setCount(c => c + 1);
}, 0);
```

### Output

```text
+2 (batched in React 18)
```

👉 React batches updates even inside timers

---

## 🔥 2. Concurrent Rendering behavior

React may:

* pause rendering
* restart rendering
* discard renders

👉 Event loop doesn’t guarantee render order anymore

---

## 🔥 3. Transition vs urgent updates

```jsx
startTransition(() => {
  setState(...);
});
```

### Behavior

* low priority update
* can be interrupted by microtasks/events

---

## 🔥 4. Stale closure in React concurrency

```jsx
useEffect(() => {
  setTimeout(() => {
    console.log(count);
  }, 1000);
}, []);
```

### Problem

Always logs initial value

### Fix

```jsx
useRef
```

---

## 🔥 5. React + microtask confusion

```jsx
useEffect(() => {
  Promise.resolve().then(() => {
    setState(1);
  });
}, []);
```

👉 Runs before paint (microtask phase)

---

# 💻 PART 3: CODING ROUND PROBLEMS (EVENT LOOP BASED)

---

## 🧠 Problem 1: Implement delayed logger

```javascript
function delayLog(msg, delay) {
  // implement
}
```

### Requirement

* must use event loop (no blocking)
* logs after delay

### Solution

```javascript
function delayLog(msg, delay) {
  setTimeout(() => {
    console.log(msg);
  }, delay);
}
```

---

## 🧠 Problem 2: Sequential async execution

```javascript
function task1() {
  return Promise.resolve("A");
}
function task2() {
  return Promise.resolve("B");
}
```

### Run sequentially

```javascript
async function run() {
  console.log(await task1());
  console.log(await task2());
}
```

---

## 🧠 Problem 3: Microtask scheduler

```javascript
function runMicrotask(fn) {
  // implement
}
```

### Solution

```javascript
function runMicrotask(fn) {
  Promise.resolve().then(fn);
}
```

---

## 🧠 Problem 4: Throttle using event loop

```javascript
function throttle(fn, delay) {
  // implement
}
```

### Solution

```javascript
function throttle(fn, delay) {
  let last = 0;

  return function (...args) {
    const now = Date.now();

    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

---

## 🧠 Problem 5: Event loop order validator

```javascript
function test() {
  console.log("A");

  setTimeout(() => console.log("B"), 0);

  Promise.resolve().then(() => console.log("C"));

  console.log("D");
}
```

👉 Expected output:

```text
A D C B
```

---

## 🧠 Problem 6: Promise queue simulator

```javascript
function queue(tasks) {
  // run tasks one by one using event loop
}
```

### Solution

```javascript
async function queue(tasks) {
  for (let task of tasks) {
    await task();
  }
}
```

---

## 🧠 Problem 7: Race condition fix

```javascript
let count = 0;

setTimeout(() => count++, 0);
setTimeout(() => count++, 0);
```

### Fix

```javascript
let count = 0;

Promise.resolve().then(() => count++);
Promise.resolve().then(() => count++);
```

---

# 🔥 FINAL FAANG INTERVIEW SUMMARY

## If interviewer asks

### “Explain event loop in real system”

Say:

> JavaScript event loop manages asynchronous execution by running synchronous code first, then microtasks like Promises, followed by macrotasks like setTimeout, ensuring non-blocking behavior in a single-threaded runtime.

---

# 🚀 If you want next level (VERY IMPORTANT)

I can give you:

### 🔥 Level 2 (Senior FAANG)

* React Fiber deep dive
* Concurrent rendering internals
* Microtask starvation bugs in production

### 🔥 Live interview simulation

* I ask questions
* You answer
* I evaluate like Google/Microsoft interviewer

Just say 👍
