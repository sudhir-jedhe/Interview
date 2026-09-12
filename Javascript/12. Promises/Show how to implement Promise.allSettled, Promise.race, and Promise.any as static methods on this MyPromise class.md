Here is the implementation of `Promise.allSettled`, `Promise.race`, and `Promise.any` added as static methods on the `MyPromise` class, matching the ECMAScript specification.

---

### Implementation

```javascript
class MyPromise {
  // ... (previous constructor, then, catch, finally, resolve, reject, all)

  /**
   * Promise.allSettled:
   * Resolves when all promises have either fulfilled or rejected.
   * Never rejects. Returns an array of descriptor objects:
   *   { status: 'fulfilled', value } OR { status: 'rejected', reason }
   */
  static allSettled(iterable) {
    return new MyPromise((resolve) => {
      const items = Array.from(iterable);
      if (items.length === 0) return resolve([]);

      const results = new Array(items.length);
      let settledCount = 0;

      items.forEach((item, index) => {
        MyPromise.resolve(item).then(
          (value) => {
            results[index] = { status: 'fulfilled', value };
            settledCount += 1;
            if (settledCount === items.length) {
              resolve(results);
            }
          },
          (reason) => {
            results[index] = { status: 'rejected', reason };
            settledCount += 1;
            if (settledCount === items.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }

  /**
   * Promise.race:
   * Settles as soon as the FIRST promise settles (fulfills OR rejects).
   * Adopts that first promise's value or rejection reason.
   * If passed an empty iterable, it remains pending forever (per spec).
   */
  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(iterable);

      // An empty iterable never settles
      for (const item of items) {
        MyPromise.resolve(item).then(resolve, reject);
      }
    });
  }

  /**
   * Promise.any:
   * Resolves as soon as ANY promise fulfills (first to fulfill).
   * Ignores rejections until ALL promises reject.
   * If all reject (or iterable is empty), rejects with an AggregateError.
   */
  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(iterable);

      // Per spec: empty iterable rejects immediately with AggregateError
      if (items.length === 0) {
        return reject(
          new AggregateError([], 'All promises were rejected')
        );
      }

      const errors = new Array(items.length);
      let rejectedCount = 0;

      items.forEach((item, index) => {
        MyPromise.resolve(item).then(
          (value) => {
            // First fulfillment wins immediately
            resolve(value);
          },
          (reason) => {
            errors[index] = reason;
            rejectedCount += 1;

            // When every item has rejected, reject with AggregateError
            if (rejectedCount === items.length) {
              reject(
                new AggregateError(errors, 'All promises were rejected')
              );
            }
          }
        );
      });
    });
  }
}

```

---

### Behavior Comparison Table

| Method           | Resolves When                             | Rejects When                              | Empty Iterable Result         |
| ---------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------- |
| **`all`**        | **All** fulfill                           | **Any** rejects (first rejection)         | Resolves to `[]`              |
| **`allSettled`** | **All** settle (fulfill or reject)        | **Never** rejects                         | Resolves to `[]`              |
| **`race`**       | **Any** settles (first fulfill or reject) | **Any** settles (first fulfill or reject) | Stays **pending** forever     |
| **`any`**        | **Any** fulfills (first fulfillment)      | **All** reject                            | Rejects with `AggregateError` |

---

### Verification and Edge Cases

```javascript
const wait = (ms, val, fail = false) =>
  new MyPromise((res, rej) =>
    setTimeout(() => (fail ? rej(val) : res(val)), ms)
  );

// 1. Testing MyPromise.allSettled
MyPromise.allSettled([
  wait(10, 'A'),
  wait(20, new Error('B failed'), true),
  'Immediate value',
]).then((results) => {
  console.log('allSettled results:', results);
  /*
  [
    { status: 'fulfilled', value: 'A' },
    { status: 'rejected', reason: Error: B failed },
    { status: 'fulfilled', value: 'Immediate value' }
  ]
  */
});

// 2. Testing MyPromise.race
MyPromise.race([
  wait(50, 'Slow Success'),
  wait(10, 'Fast Error', true),
]).catch((err) => {
  console.log('race winner (settled first):', err); // Fast Error
});

// 3. Testing MyPromise.any
MyPromise.any([
  wait(10, 'Fast Failure', true),
  wait(30, 'First Successful'),
  wait(50, 'Second Successful'),
]).then((winner) => {
  console.log('any winner (first fulfillment):', winner); // First Successful
});

// 4. Testing MyPromise.any when all reject
MyPromise.any([
  wait(10, 'Error 1', true),
  wait(20, 'Error 2', true),
]).catch((aggErr) => {
  console.log('all failed error type:', aggErr instanceof AggregateError); // true
  console.log('collected errors in order:', aggErr.errors); // ['Error 1', 'Error 2']
});

```

---

### Key Specification Nuances Handled

* **Preserving Indices:** Both `allSettled` and `any` store items by fixed index (`results[index] = ...` / `errors[index] = ...`). This guarantees the output array order corresponds to the original input order, regardless of which asynchronous task resolves first.
* **Non-Promise Wrapping:** Every item is wrapped via `MyPromise.resolve(item)` before listening, ensuring plain values (like strings or numbers) settle correctly on the microtask turn.
* **`Array.from(iterable)`:** Accepts any valid JavaScript iterable (such as `Set`, `Map.values()`, or generators), matching native behavior.
