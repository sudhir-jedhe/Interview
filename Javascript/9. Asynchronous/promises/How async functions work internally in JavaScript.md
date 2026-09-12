Under the hood, `async` functions are not a completely separate runtime primitive. Instead, the JavaScript engine implements them as a **cooperative state machine** built on top of two core primitives: **Generators** (pausable/resumable execution contexts) and **Promises** (event-loop-driven task scheduling), managed directly via the **Microtask Queue**.

---

### 1. The Core Mental Model: Generators + Runner

Conceptually, the JavaScript engine turns every `async/await` function into a generator wrapped in an automatic runner (historically known as the `spawn` or `co` routine pattern).

Consider this `async` code:

```javascript
async function fetchUserWorkflow(id) {
  const user = await fetchUser(id);
  const permissions = await fetchPermissions(user.role);
  return permissions;
}

```

The engine desugars and compiles this logic into roughly the following generator-driven construct:

```javascript
function fetchUserWorkflow(id) {
  // Wrap the logic in an auto-advancing coroutine runner
  return runner(function* () {
    const user = yield fetchUser(id);
    const permissions = yield fetchPermissions(user.role);
    return permissions;
  });
}

function runner(generatorFn) {
  return new Promise((resolve, reject) => {
    const iterator = generatorFn();

    function step(verb, arg) {
      let result;
      try {
        // Resume generator execution up to the next yield/return
        result = iterator[verb](arg);
      } catch (err) {
        return reject(err); // Thrown errors reject the outer Promise
      }

      if (result.done) {
        return resolve(result.value); // Returned value resolves the outer Promise
      }

      // Ensure the yielded value is a Promise and wait for it
      Promise.resolve(result.value).then(
        (val) => step('next', val),   // Send resolved value back into the function
        (err) => step('throw', err)   // Re-throw rejected error at the await site
      );
    }

    step('next');
  });
}

```

---

### 2. Execution Contexts: How `await` Pauses Without Blocking

JavaScript is single-threaded. When synchronous code hits a long loop, it freezes the entire thread because the call stack is blocked. `await` does not block the thread; it **suspends the execution context**.

#### Call Stack Mechanics

1. **Entering the function:** When an `async` function is invoked, an **Execution Context** (containing its local variables, lexical environment, and instruction pointer) is pushed onto the Call Stack.
2. **Hit an `await`:**

* The expression right of `await` is evaluated.
* The engine wraps the evaluated value into a native Promise using the internal abstract operation `PromiseResolve`.
* The current execution context is **popped off the Call Stack** and saved in memory (on the Heap).
* The function returns a pending outer Promise to its caller immediately. The caller continues running synchronously.

1. **Queueing Continuation:**

* The engine attaches fulfillment and rejection callbacks to the inner Promise.
* These callbacks are registered with the **Microtask Queue**.

1. **Resumption:**

* When the awaited Promise settles, its reaction callback in the Microtask Queue becomes ready.
* When the Call Stack becomes completely empty, the Event Loop drains the Microtask Queue.
* The engine restores the saved Execution Context back onto the Call Stack, restores its local variable scope, and resumes execution right where it paused.

```
Synchronous Code Runs
        │
Hits `await expr`
        │
   ┌────┴──────────────────────────────────────┐
   │ 1. Evaluate expr & create Promise         │
   │ 2. Save function frame to heap            │
   │ 3. Pop function from Call Stack           │
   │ 4. Return pending Promise to caller       │
   └────┬──────────────────────────────────────┘
        │
Call Stack continues with other tasks
        │
Awaited Promise fulfills ──> Enqueues continuation to Microtask Queue
        │
Call Stack clears ──> Event Loop runs microtask:
   ┌────┴──────────────────────────────────────┐
   │ 1. Push saved frame back to Call Stack    │
   │ 2. Inject resolved value into variable    │
   │ 3. Resume synchronous execution           │
   └───────────────────────────────────────────┘

```

---

### 3. V8's Internal Optimization (ECMAScript Spec Shift)

In early implementations of the ES2017 specification, an `await` was relatively expensive because it created **three separate microtask ticks** and **two extra internal promises** per `await`.

In modern engines (e.g., V8 v7.2+):

1. **Promise Elimination:** Instead of creating intermediate wrapper promises, the engine checks if the expression is already a native Promise. If it is, it attaches listeners directly without re-wrapping.
2. **Microtask Reduction:** Modern engines downsized the suspension cost so that awaiting a resolved native Promise takes only **one microtask tick** instead of three.

#### Proof via Tick Order

```javascript
async function demo() {
  console.log('1: Inside demo before await');
  await null; // Even awaiting a non-promise yields 1 microtask tick!
  console.log('2: Inside demo after await');
}

console.log('3: Synchronous start');
demo();
console.log('4: Synchronous end');

// Output:
// 3: Synchronous start
// 1: Inside demo before await
// 4: Synchronous end
// 2: Inside demo after await

```

`1` prints synchronously because `demo()` starts synchronously. As soon as it hits `await null`, the rest of `demo()` is scheduled as a microtask, allowing `4` to execute before `2`.

---

### 4. Zero-Cost Async Stack Traces

In traditional Promise chains (`.then(fn)`), whenever an error is thrown inside an asynchronous callback, the original call stack that called `.then()` has already finished and disappeared. The resulting stack trace often shows only internal promise frames:

```
Error: Something broke
    at myCallback (app.js:12:9)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)

```

Because modern engines preserve suspended execution contexts on the heap for `async/await`, the engine can inspect the chain of suspended parent contexts and synthesize a complete **asynchronous stack trace** across turns of the event loop with practically zero runtime overhead when no error is thrown.

---

### Summary Checklist

* **Compilation:** Treated internally as auto-resuming generator state machines.
* **Non-blocking:** `await` pops the function context off the stack and preserves it in heap memory; the main thread never freezes.
* **Scheduling:** Resumption is governed strictly by the **Microtask Queue**, executing immediately after the current synchronous stack empties before macrotasks (like `setTimeout`) run.
* **Return Value:** Every `async` function always returns a Promise; values returned explicitly become `Promise.resolve(val)`, and unhandled thrown errors become `Promise.reject(err)`.
