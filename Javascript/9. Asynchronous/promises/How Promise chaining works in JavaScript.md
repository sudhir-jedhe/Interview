Promise chaining works because every call to `.then()`, `.catch()`, or `.finally()` returns a **brand new Promise**. This allows you to link asynchronous actions sequentially without nesting callbacks into "callback hell."

---

### The Fundamental Rule

Whenever a handler inside `.then(callback)` runs, the state of the **new** returned Promise depends on what `callback` does:

| Callback Behavior                        | State of Returned Promise     | Downstream Receives                               |
| ---------------------------------------- | ----------------------------- | ------------------------------------------------- |
| Returns a primitive/object (`return 42`) | **Resolved**                  | The returned value (`42`)                         |
| Returns nothing (`return;` or implicit)  | **Resolved**                  | `undefined`                                       |
| Returns another Promise                  | **Pending** (adopts its fate) | The eventual resolved value of that inner promise |
| Throws an error (`throw new Error(...)`) | **Rejected**                  | The thrown error                                  |

---

### Step-by-Step Execution Flow

Consider this sequence:

```javascript
fetchUser(1)
  .then((user) => {
    console.log("User fetched:", user.name);
    return fetchOrders(user.id); // 1. Returns a new promise
  })
  .then((orders) => {
    console.log("Orders fetched:", orders.length);
    return orders[0].total;     // 2. Returns a plain value
  })
  .then((total) => {
    console.log("First order total:", total);
    // 3. Implicitly returns undefined
  })
  .catch((error) => {
    console.error("An error occurred anywhere above:", error.message);
  });

```

Here is how the engine processes each step:

1. **`fetchUser(1)` runs:** It returns `Promise A`.
2. **First `.then()` executes when `Promise A` resolves:**

* Receives `user`.
* Calls `fetchOrders(user.id)`, which returns an asynchronous `Promise B`.
* Because a promise is returned, the outer promise "unwraps" `Promise B` and pauses downstream execution until `Promise B` settles.

1. **Second `.then()` executes when `Promise B` resolves:**

* Receives `orders`.
* Returns `orders[0].total` (a synchronous value, like `99.99`).
* The returned promise resolves immediately with `99.99`.

1. **Third `.then()` executes immediately:**

* Receives `total` (`99.99`).
* Returns nothing, resolving downstream with `undefined`.

---

### Error Propagation and Fall-Through

Rejections travel down the chain until they encounter a rejection handler or `.catch()`:

```
[Promise] ──> .then() ──> [Throws Error]
                             │
            .then() (skipped)│
                             │
            .then() (skipped)│
                             ▼
                         .catch() ──> (Chain recovers unless re-thrown)

```

* If an error occurs in any step, all intermediate `.then(onFulfilled)` callbacks are skipped.
* Once a `.catch()` handles the error and does not re-throw, it returns a normal value (or `undefined`), meaning subsequent `.then()` handlers will continue executing.

---

### Common Pitfalls

* **Forgetting to `return`:**

```javascript
// ❌ Broken: Next .then() won't wait and receives undefined
fetchUser().then(user => {
  fetchOrders(user.id);
}).then(orders => console.log(orders)); // undefined

// ✅ Fixed: Explicitly return the promise
fetchUser().then(user => {
  return fetchOrders(user.id);
}).then(orders => console.log(orders));

```

* **Nesting inside `.then()` (Recreating callback hell):**

```javascript
// ❌ Anti-pattern: Nested promises
getUser().then(user => {
  getProfile(user.id).then(profile => {
    getSettings(profile.id).then(settings => { ... });
  });
});

// ✅ Fixed: Return and chain flatly
getUser()
  .then(user => getProfile(user.id))
  .then(profile => getSettings(profile.id))
  .then(settings => { ... });

```
