JavaScript is a **single-threaded, non-blocking, asynchronous** programming language. To execute asynchronous code (like `setTimeout`, `fetch`, or `Promise.then`) without freezing the user interface or blocking main thread execution, the JavaScript engine relies on four cooperating components:

1. **Call Stack**
2. **Web APIs / Node.js C++ Bindings**
3. **Microtask Queue**
4. **Macrotask Queue** (Task Queue)

---

## 1. The Core Components

### A. The Call Stack

The Call Stack is a standard **Last-In, First-Out (LIFO)** stack that tracks where the JavaScript engine is in execution.

* Whenever a function is invoked, its **Execution Context** is pushed onto the stack.
* Whenever a function returns or completes, its Execution Context is popped off the stack.
* JavaScript can only execute code when it is on the top of the Call Stack.

### B. Web APIs / Environment APIs

Async operations (such as HTTP requests via `fetch()`, timers like `setTimeout()`, DOM event listeners, or file operations in Node.js) do not execute directly on the main thread. Instead, they are handed off to browser background threads or Node.js C++ bindings.

Once the background thread finishes the task, it pushes the associated callback function into one of two queues.

### C. Microtask Queue

A high-priority queue reserved for lightweight asynchronous callbacks that need to run immediately after the current execution frame finishes.

* **What goes here:**
* `Promise` callbacks (`.then()`, `.catch()`, `.finally()`)
* `queueMicrotask()`
* `async / await` resumptions (the code following an `await` expression)
* `MutationObserver`
* `process.nextTick()` *(Node.js specific — technically prioritized even ahead of standard microtasks)*

### D. Macrotask Queue (Task Queue)

A standard queue for heavier, discrete asynchronous tasks.

* **What goes here:**
* `setTimeout()` / `setInterval()`
* `setImmediate()` *(Node.js / IE)*
* User interaction events (e.g., `click`, `keydown`, `scroll`)
* Network requests / I/O callbacks
* `requestAnimationFrame()` *(runs right before browser repaints, adjacent to macrotasks)*

---

## 2. The Event Loop Algorithm

The **Event Loop** is a continuous, single-threaded loop running inside the browser or Node.js runtime. Its job is to monitor the Call Stack and move tasks from the queues onto the Call Stack when it is empty.

```
       ┌────────────────────────────────────────────────────────┐
       │                       CALL STACK                       │
       └───────────────────────────▲────────────────────────────┘
                                   │ (Only when stack is empty!)
                                   │
             ┌─────────────────────┴─────────────────────┐
             │                 EVENT LOOP                │
             └───────────▲───────────────────▲───────────┘
                         │                   │
                         │ Priority 1        │ Priority 2 (1 task per cycle)
                         │                   │
               ┌─────────┴──────────┐      ┌─┴──────────────────┐
               │  MICROTASK QUEUE   │      │  MACROTASK QUEUE   │
               │  (Drained fully!)  │      │  (1 task at a time)│
               └────────────────────┘      └────────────────────┘

```

### The Rules of the Event Loop Loop

1. **Execute Synchronous Code:** Run synchronous code from top to bottom on the Call Stack until the stack is completely empty.
2. **Drain Microtasks Fully:** Check the **Microtask Queue**. If there are callbacks in the Microtask Queue, pop and execute them on the Call Stack **one by one until the Microtask Queue is completely empty**.

* *Critical Detail:* If a microtask schedules *another* microtask, that new microtask is added to the back of the current queue and **executed in the exact same tick**.

1. **Render Update (Browsers only):** If a browser paint is due (~60Hz / 16.6ms cycle), the browser updates the DOM layout and repaints the screen.
2. **Execute ONE Macrotask:** Check the **Macrotask Queue**. Dequeue and execute **exactly ONE macrotask** on the Call Stack.
3. **Loop Back:** Repeat from Step 2 (Check Microtask Queue again).

> 💡 **Key Takeaway:** The Microtask Queue **always has higher priority** than the Macrotask Queue. The Event Loop will never execute a macrotask if there are pending microtasks.

---

## 3. Step-by-Step Code Execution Example

Let's trace a famous interview code snippet to see how the stack and queues interact in real time.

```javascript
console.log('1: Sync');

setTimeout(() => {
  console.log('2: Macrotask (Timeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask 1');
}).then(() => {
  console.log('4: Microtask 2');
});

console.log('5: Sync');

```

### Execution Timeline

| Step  | Call Stack Action             | Queues State        | Console Output |
| ----- | ----------------------------- | ------------------- | -------------- |
| **1** | Runs `console.log('1: Sync')` | **Micro:** `[]`<br> |

<br>**Macro:** `[]` | `'1: Sync'` |
| **2** | Registers `setTimeout(..., 0)`. Browser hands off timer to Web API. Timer finishes instantly. | **Micro:** `[]`<br>

<br>**Macro:** `[cb_timeout]` |  |
| **3** | Resolves `Promise.resolve()`. Registers `.then()` callback into Microtask Queue. | **Micro:** `[cb_micro1]`<br>

<br>**Macro:** `[cb_timeout]` |  |
| **4** | Runs `console.log('5: Sync')` | **Micro:** `[cb_micro1]`<br>

<br>**Macro:** `[cb_timeout]` | `'5: Sync'` |
| **5** | **Call Stack is now empty!** Event Loop checks Microtask Queue. Pops `cb_micro1`. | **Micro:** `[]`<br>

<br>**Macro:** `[cb_timeout]` | `'3: Microtask 1'` |
| **6** | `cb_micro1` returns a promise, queuing the second `.then()` callback (`cb_micro2`). | **Micro:** `[cb_micro2]`<br>

<br>**Macro:** `[cb_timeout]` |  |
| **7** | Event Loop drains Microtask Queue before moving to Macrotasks. Pops `cb_micro2`. | **Micro:** `[]`<br>

<br>**Macro:** `[cb_timeout]` | `'4: Microtask 2'` |
| **8** | Microtask Queue is empty. Event Loop moves to Macrotask Queue. Pops `cb_timeout`. | **Micro:** `[]`<br>

<br>**Macro:** `[]` | `'2: Macrotask (Timeout)'` |

### Final Console Output

```text
1: Sync
5: Sync
3: Microtask 1
4: Microtask 2
2: Macrotask (Timeout)

```

---

## 4. Common Pitfalls & Edge Cases

### A. Infinite Microtask Loop (Freezing the UI / Unresponsiveness)

Because the Event Loop **drains the Microtask Queue completely** before yielding control back to the browser or picking up macrotasks, recursively queuing microtasks will starve the Macrotask Queue and completely freeze the application.

```javascript
// ❌ DANGEROUS: Freezes the UI permanently!
function infiniteMicrotask() {
  Promise.resolve().then(infiniteMicrotask);
}
infiniteMicrotask();
// The browser can NEVER repaint or process click events because 
// the Microtask Queue never reaches 0 length!

```

Contrast this with recursive `setTimeout()`:

```javascript
// ✅ SAFE: Does not freeze the UI!
function recursiveTimeout() {
  setTimeout(recursiveTimeout, 0);
}
recursiveTimeout();
// Each call schedules ONE macrotask. The Event Loop processes 1 macrotask, 
// allows UI repaints and user clicks, and then picks up the next macrotask.

```

---

### B. `async / await` Engine Mechanics

An `async` function executes synchronously until it hits an `await` expression:

```javascript
async function foo() {
  console.log('A');
  await bar();
  console.log('B'); // ◄ This code runs as a MICROTASK!
}

async function bar() {
  console.log('C');
}

console.log('Start');
foo();
console.log('End');

```

**Output:**

```text
Start
A
C
End
B

```

**Why?**

1. `'Start'` logs synchronously.
2. `foo()` is invoked $\rightarrow$ logs `'A'`.
3. `bar()` is invoked synchronously $\rightarrow$ logs `'C'` and returns a resolved Promise.
4. The `await` keyword pauses execution of `foo()` and schedules everything *below* the `await` line into the **Microtask Queue**.
5. Control returns to the main thread $\rightarrow$ logs `'End'`.
6. Call Stack becomes empty $\rightarrow$ Event Loop picks up microtask $\rightarrow$ logs `'B'`.

---

## Summary Comparison Matrix

| Queue / Concept     | Priority             | Emptying Strategy                              | Examples                                               |
| ------------------- | -------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| **Call Stack**      | **Highest** (Active) | Immediate LIFO execution                       | Synchronous code, function invocation                  |
| **Microtask Queue** | **High**             | Drained **100% completely** per tick           | `Promise.then`, `queueMicrotask`, `await` continuation |
| **Render Phase**    | **Medium**           | ~16ms frame schedule                           | DOM updates, `requestAnimationFrame`                   |
| **Macrotask Queue** | **Lowest**           | **1 task per tick**, then re-checks microtasks | `setTimeout`, `setInterval`, DOM click events, I/O     |
