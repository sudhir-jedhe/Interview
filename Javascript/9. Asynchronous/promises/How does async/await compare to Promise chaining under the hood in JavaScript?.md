`async/await` is syntactic sugar built directly on top of Promises and Generators. Under the hood, an `async` function behaves like an automatically running generator function that `yield`s promises and resumes execution once those promises settle.

---

### Key Architectural Differences Under the Hood

| Dimension           | Promise Chaining (`.then()`)                                    | `async/await`                                                    |
| ------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Execution Model** | Callback-driven (each `.then` registers a callback)             | Coroutine-driven (execution suspends and resumes)                |
| **Scope & State**   | Variables exist in separate closure scopes per callback         | Variables remain in a single local execution frame               |
| **Error Handling**  | Asynchronous rejection propagation via `.catch()`               | Synchronous-style unwrapping via standard `try...catch`          |
| **Stack Traces**    | Often truncates or loses context across asynchronous boundaries | V8/engines preserve async call frames ("zero-cost async stacks") |

---

### How the JavaScript Engine Desugars `async/await`

Every `async` function implicitly returns a Promise, and every `await` suspends function execution until the target promise settles.

Consider this `async/await` function:

```javascript
async function fetchUserData(id) {
  const user = await getUser(id);
  const orders = await getOrders(user.id);
  return orders;
}

```

Under the hood, engines (and transpilers like Babel) transform this code into an abstraction using **Generators and a Runner/Coroutine**:

```javascript
function fetchUserData(id) {
  return spawn(function* () {
    const user = yield getUser(id);
    const orders = yield getOrders(user.id);
    return orders;
  });
}

// Minimal runner function representing engine-level orchestration
function spawn(generatorFn) {
  return new Promise((resolve, reject) => {
    const iterator = generatorFn();

    function step(verb, arg) {
      let result;
      try {
        result = iterator[verb](arg);
      } catch (err) {
        return reject(err);
      }

      if (result.done) {
        return resolve(result.value);
      }

      // Ensure the yielded value is a Promise, then resume or throw
      Promise.resolve(result.value).then(
        (val) => step("next", val),
        (err) => step("throw", err)
      );
    }

    step("next");
  });
}

```

---

### The Microtask Cycle of `await`

When the engine encounters an `await expr;`:

1. **Evaluation & Wrapping:** The expression is evaluated and wrapped as a promise via `Promise.resolve(expr)` (internally, the engine handles this via the native spec operation `PromiseResolve`).
2. **Suspension:** The current execution context is popped off the Call Stack, and its state (local variables, instruction pointer) is saved in memory.
3. **Queueing:** Handlers are attached to the promise to resume execution. This continuation is scheduled in the **Microtask Queue**.
4. **Resumption:** When the microtask runs:

* If fulfilled, the value replaces the `await` expression, and the function resumes execution synchronously until the next `await` or return.
* If rejected, the rejection reason is thrown at the point of the `await`, triggering an enclosing `try/catch` block.

---

### Why `async/await` Improves Developer Experience

* **Scope Sharing:** In Promise chains, passing a value from Step 1 down to Step 3 requires either nesting `.then()` blocks, mutating an outer scoped variable, or chaining tuple returns (`return [user, orders]`). In `async/await`, all variables share the same local scope throughout the function.
* **Cleaner Error Interception:** Standard `try...catch` captures both synchronous thrown errors (e.g., calling a method on `null`) and asynchronous Promise rejections identically.
* **Readable Stack Traces:** Modern JavaScript engines maintain an **Async Call Stack** for coroutines, making it easier to trace unhandled exceptions back to the caller across multiple awaits.
