When using `async/await` inside `Array.prototype.forEach()`, the loop **does not wait for async operations to complete** before moving to the next element or continuing execution after the loop.

This happens because of how `.forEach()` is implemented under the hood.

---

### The Problem: Why `forEach` Ignores `await`

Here is a typical example of buggy code:

```javascript
async function processItems(items) {
  console.log('Start');

  items.forEach(async (item) => {
    const result = await fetchItemData(item); // ⚠️ await does NOT pause the loop!
    console.log(`Finished ${item}`);
  });

  console.log('Done'); // Runs immediately before any fetches complete!
}

processItems([1, 2, 3]);

// Output:
// Start
// Done           <-- Logged before item processing finishes!
// Finished 1
// Finished 2
// Finished 3

```

#### What is happening under the hood?

`Array.prototype.forEach()` is a synchronous higher-order function. Its internal implementation looks conceptually like this:

```javascript
// Conceptual implementation of Array.prototype.forEach
Array.prototype.myForEach = function(callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this); // Simply invokes the callback function!
  }
};

```

When you pass an `async` function as a callback:

1. Every `async` function in JavaScript returns a **Promise** immediately upon execution.
2. `.forEach()` executes the callback for index 0. The callback returns a pending Promise.
3. `.forEach()` **completely ignores the returned Promise** and instantly invokes the callback for index 1, index 2, and so on.
4. `.forEach()` finishes executing synchronously, and execution continues past the loop while all your Promises are still pending in the background.

---

### Solutions: How to Fix It

Depending on whether you want your async operations to run **sequentially** (one after another) or **in parallel** (all at once), here are the correct patterns:

---

#### Solution 1: Sequential Execution (Use `for...of` loop)

If each item must wait for the previous item to finish processing before starting:

```javascript
async function processItemsSequentially(items) {
  console.log('Start');

  for (const item of items) {
    const result = await fetchItemData(item); // ✅ Pauses loop until Promise resolves
    console.log(`Finished ${item}`);
  }

  console.log('Done'); // Runs ONLY after all items are done
}

```

**Why it works:** The standard `for...of` loop executes within the scope of the parent `async` function, so `await` actually pauses the loop iteration.

---

#### Solution 2: Parallel Execution (Use `map()` + `Promise.all()`)

If all items can be processed simultaneously (faster performance):

```javascript
async function processItemsInParallel(items) {
  console.log('Start');

  // 1. Create an array of pending Promises using .map()
  const promises = items.map(async (item) => {
    const result = await fetchItemData(item);
    console.log(`Finished ${item}`);
    return result;
  });

  // 2. Wait for all promises to resolve simultaneously
  const results = await Promise.all(promises);

  console.log('Done'); // Runs after ALL promises complete
}

```

**Why it works:** `.map()` collects the returned Promises into an array, and `Promise.all()` pauses execution until every Promise in that array resolves.

---

#### Solution 3: Controlled Batch/Concurrency Execution (Using `p-limit` pattern)

If you have thousands of items and running them all in parallel via `Promise.all()` would overwhelm your server or API rate limits:

```javascript
async function processItemsInBatches(items, batchSize = 2) {
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    
    // Process current batch in parallel
    await Promise.all(chunk.map(async (item) => {
      await fetchItemData(item);
    }));
  }
}

```

---

### Summary Checklist

| Method                        | Behavior with `async/await`                         | Use Case                                                |
| ----------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| **`forEach()`**               | ❌ **Broken** (Fires & forgets, ignores Promises)    | **Never** use for async operations.                     |
| **`for...of`**                | ✅ **Sequential** (Processes items 1-by-1 in series) | Order matters, or rate limits require sequential calls. |
| **`map()` + `Promise.all()**` | ✅ **Parallel** (Processes all items simultaneously) | Maximum performance when items are independent.         |
