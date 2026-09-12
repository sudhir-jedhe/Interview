An implementation of a custom Promise class (**`MyPromise`**) complying with the Promises/A+ specification requires managing three distinct states, queueing asynchronous callbacks using microtasks, handling chained `.then()` calls, and resolving arbitrary "thenable" objects safely.

---

### Core Implementation

```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// Queues a microtask (native equivalent of Promise microtask queue)
function runMicrotask(callback) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(callback);
  } else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    process.nextTick(callback);
  } else {
    setTimeout(callback, 0);
  }
}

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;

    // Handlers stored for async resolution
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // Guard to prevent multiple state transitions
    let isSettled = false;

    const resolve = (value) => {
      if (isSettled) return;
      isSettled = true;
      // Resolve procedure handles nested promises and thenables
      resolvePromise(this, value, fulfill, reject);
    };

    const fulfill = (value) => {
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((fn) => fn());
      this.onFulfilledCallbacks = [];
    };

    const reject = (reason) => {
      if (isSettled && this.state !== PENDING) return;
      isSettled = true;
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
      this.onRejectedCallbacks = [];
    };

    // Executor is called synchronously; errors trigger automatic rejection
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // Default pass-through if not functions (A+ spec 2.2.1 & 2.2.7.3/4)
    const realOnFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
    const realOnRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err;
          };

    // Every .then returns a new promise to enable chaining
    const childPromise = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        runMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            resolvePromise(childPromise, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      const handleRejected = () => {
        runMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            resolvePromise(childPromise, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.state === FULFILLED) {
        handleFulfilled();
      } else if (this.state === REJECTED) {
        handleRejected();
      } else {
        // State is PENDING; queue until settled
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });

    return childPromise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      (val) => MyPromise.resolve(callback()).then(() => val),
      (err) =>
        MyPromise.resolve(callback()).then(() => {
          throw err;
        })
    );
  }

  // Static Helpers
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(promises);
      if (items.length === 0) return resolve([]);

      const results = new Array(items.length);
      let completed = 0;

      items.forEach((item, index) => {
        MyPromise.resolve(item).then((val) => {
          results[index] = val;
          completed += 1;
          if (completed === items.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }
}

/**
 * Promises/A+ 2.3: The Promise Resolution Procedure
 */
function resolvePromise(promise, x, resolve, reject) {
  // 2.3.1: Cyclic reference prevention
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // 2.3.2: If x is an instance of MyPromise, adopt its state
  if (x instanceof MyPromise) {
    x.then(
      (val) => resolvePromise(promise, val, resolve, reject),
      reject
    );
    return;
  }

  // 2.3.3: If x is an object or function (duck-typing thenables)
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // x is an ordinary object/function without a valid .then
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      reject(err);
    }
  } else {
    // 2.3.4: Primitive value
    resolve(x);
  }
}

```

---

### Step-by-Step Mechanism

1. **State Machine (`PENDING -> FULFILLED / REJECTED`)**:
State transitions are irreversible. The boolean flag `isSettled` ensures that once resolved or rejected, subsequent calls to `resolve()` or `reject()` are ignored.
2. **Asynchronous Dispatch (`queueMicrotask`)**:
Promises/A+ section 2.2.4 mandates that handlers passed to `.then()` must never be invoked in the current turn of the event loop. `queueMicrotask` ensures callbacks execute after the current synchronous stack empties, but before timers (`setTimeout`) run.
3. **Chaining via New Promise Instances**:
Every call to `then()` creates and returns a **new** instance of `MyPromise`. The returned value of `onFulfilled` (denoted as `x`) determines the resolution of the child promise.
4. **Promise Resolution Procedure (`resolvePromise`)**:

* **Circular Check:** Prevents infinite deadlock if a promise returns itself (`p.then(() => p)`).
* **Thenable Interoperability:** Handles native Promises, third-party libraries (Bluebird, Axios), or custom objects containing a `.then` method.
* **Single-Invocation Guarantee (`called` flag):** Protects against non-compliant third-party thenables that attempt to invoke both resolve and reject callbacks or fire them multiple times.

---

### Verification and Edge Cases

```javascript
console.log('1. Start');

const p = new MyPromise((resolve, reject) => {
  console.log('2. Inside executor (synchronous)');
  setTimeout(() => {
    resolve('Success from async task');
  }, 10);
});

p.then((res) => {
  console.log('4.', res);
  // Return a thenable inside .then chain
  return {
    then(onFulfill) {
      onFulfill('Resolved from duck-typed thenable');
    },
  };
})
  .then((res) => {
    console.log('5.', res);
    throw new Error('Error thrown inside chain');
  })
  .catch((err) => {
    console.log('6. Caught cleanly:', err.message);
  });

console.log('3. End of synchronous execution');

```

**Console Output:**

```text
1. Start
2. Inside executor (synchronous)
3. End of synchronous execution
4. Success from async task
5. Resolved from duck-typed thenable
6. Caught cleanly: Error thrown inside chain

```
