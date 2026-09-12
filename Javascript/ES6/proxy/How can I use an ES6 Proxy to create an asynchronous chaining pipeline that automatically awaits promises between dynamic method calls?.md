To create an asynchronous chaining pipeline that automatically awaits unresolved promises between dynamic method calls, make the Proxy wrapper a **"thenable"** object (implementing a `.then()` method).

This design gives you two distinct execution models in one:

1. **Synchronous Fluent Chaining:** Methods can be chained synchronously without writing `await` at every intermediate step (`pipeline.fetchUser().computeScore().format()`).
2. **Native `await` Resolution:** Placing `await` before the chain causes the runtime to detect the `.then()` method and wait for the internal promise queue to settle.

---

### Implementation

```javascript
function createAsyncPipeline(initialValue = Promise.resolve()) {
  // Normalize incoming value to a Promise
  let currentPromise = Promise.resolve(initialValue);

  // Registry of custom async operations
  const operations = {
    sleep: async (val, ms) => {
      await new Promise((r) => setTimeout(r, ms));
      return val;
    },
    pipe: async (val, fn) => fn(val),
  };

  function createProxy() {
    // A function target allows the proxy to be callable via () as well
    const targetFn = function () {};

    return new Proxy(targetFn, {
      get(target, prop, receiver) {
        // 1. Thenable Protocol: allows `await chain` or `chain.then(...)`
        if (prop === 'then') {
          return (onFulfilled, onRejected) =>
            currentPromise.then(onFulfilled, onRejected);
        }

        if (prop === 'catch') {
          return (onRejected) => currentPromise.catch(onRejected);
        }

        if (prop === 'finally') {
          return (onFinally) => currentPromise.finally(onFinally);
        }

        // 2. Explicit value extraction via `.value()`
        if (prop === 'value') {
          return () => currentPromise;
        }

        // 3. Dynamic method interception
        return function (...args) {
          currentPromise = currentPromise.then(async (resolvedVal) => {
            // Priority A: Custom operation in the registry
            if (operations[prop]) {
              return operations[prop](resolvedVal, ...args);
            }

            // Priority B: Methods existing on the resolved value (e.g. String.trim, Array.map)
            if (resolvedVal != null && typeof resolvedVal[prop] === 'function') {
              return resolvedVal[prop](...args);
            }

            // Priority C: Methods from the global Math object
            if (typeof Math[prop] === 'function') {
              return Math[prop](resolvedVal, ...args);
            }

            throw new TypeError(
              `Property or method "${String(prop)}" does not exist on target.`
            );
          });

          // Return the proxy to sustain the chain
          return createProxy();
        };
      },

      // 4. Direct invocation support: chain((val) => val * 2)
      apply(target, thisArg, args) {
        const [fn] = args;
        if (typeof fn === 'function') {
          currentPromise = currentPromise.then(async (resolvedVal) => fn(resolvedVal));
        }
        return createProxy();
      },
    });
  }

  return createProxy();
}

```

---

### How It Works

1. **Internal Promise Queueing:**
Every time a property is called (e.g., `.fetchData()`), we append a `.then(...)` handler to `currentPromise`. We don't block JavaScript's synchronous thread while chaining methods; we queue transformations.
2. **The "Thenable" Bridge (`prop === 'then'`):**
When you do `const result = await pipeline...`, the JavaScript engine checks if the returned object has a `then` property. By forwarding `currentPromise.then`, the engine seamlessly pauses execution until the entire queued chain resolves.
3. **Built-in Prototype Delegation:**
If the resolved value has native methods matching the name (such as `Array.prototype.filter`, `String.prototype.toUpperCase`), they execute dynamically on the resolved value.

---

### Real-World Example & Usage

```javascript
// Mock async API services
const api = {
  fetchUser: async (id) => {
    // Simulates an async database call
    return { id, name: '  alex morgan  ', points: [10, 45, 80, 25] };
  },
};

async function run() {
  // We can start with a synchronous ID, call async tasks, transform data,
  // and only use a SINGLE `await` at the beginning.
  const finalScore = await createAsyncPipeline(101)
    // 1. Async network call
    .pipe((id) => api.fetchUser(id))

    // 2. Transform property (extract points array)
    .pipe((user) => user.points)

    // 3. Native Array method dynamically dispatched
    .map((p) => p * 1.5)

    // 4. Custom registry method (simulate delay)
    .sleep(100)

    // 5. Functional reduction via direct invocation `()`
    .pipe((points) => points.reduce((a, b) => a + b, 0))

    // 6. Dynamic global Math method invocation
    .round();

  console.log('Result:', finalScore); 
  // (10*1.5 + 45*1.5 + 80*1.5 + 25*1.5) = 15 + 67.5 + 120 + 37.5 = 240
}

run();

```

---

### Error Propagation Handling

Because operations are chained onto an underlying promise pipeline, errors bubble naturally to standard `.catch()` or `try/catch` blocks:

```javascript
try {
  await createAsyncPipeline('some text')
    .nonExistentMethod() // Throws TypeError inside chain
    .trim();
} catch (err) {
  console.error('Caught in try/catch:', err.message);
  // Output: Property or method "nonExistentMethod" does not exist on target.
}

```
