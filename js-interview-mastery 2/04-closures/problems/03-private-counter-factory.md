# Problem: Implement a Private Counter Factory

## Problem Statement

Implement `createCounter(initialValue)`, a factory function that returns an object with `increment()`, `decrement()`, `reset()`, and `value()` methods, where the underlying counter state is completely hidden — not accessible or mutable from outside except through those four methods.

## Requirements

- `increment(step = 1)` increases the counter by `step` (default `1`) and returns the new value.
- `decrement(step = 1)` decreases the counter by `step` and returns the new value.
- `reset()` restores the counter to its original `initialValue` and returns it.
- `value()` returns the current value without mutating it.
- The internal counter variable must not be reachable as a property on the returned object (no `counter.count`, no `counter._count`).
- Each call to `createCounter` must produce a fully independent counter.

## Approach

Declare the counter state as a local variable inside `createCounter`, and return a plain object whose methods are all defined inside that same function body — each one forms a closure over the shared local state. Since nothing outside `createCounter` has a scope-chain path to that local variable, and the returned object never assigns it to a property, it's genuinely private: the only way to read or change it is through the exposed methods.

## Solution

```js
function createCounter(initialValue = 0) {
  let count = initialValue; // private — lives only in this closure

  return {
    increment(step = 1) {
      count += step;
      return count;
    },
    decrement(step = 1) {
      count -= step;
      return count;
    },
    reset() {
      count = initialValue;
      return count;
    },
    value() {
      return count;
    },
  };
}

module.exports = { createCounter };

// --- verification ---
const counterA = createCounter();
console.log(counterA.value());     // 0
console.log(counterA.increment()); // 1
console.log(counterA.increment(5)); // 6
console.log(counterA.decrement(2)); // 4
console.log(counterA.reset());      // 0
console.log(counterA.count);        // undefined — no direct access to internal state

const counterB = createCounter(100);
console.log(counterB.value());      // 100 — independent starting point
counterA.increment();
console.log(counterB.value());      // 100 — completely unaffected by counterA's mutations
```

**Why this works:** `count` and `initialValue` exist only inside `createCounter`'s function scope; the four returned methods are the only code in the entire program with a scope-chain path down into that scope, because they were literally written inside it. Since the returned object never does anything like `return { count, increment, ... }` (which would expose the raw value as a property), there is no way — not even indirectly — for outside code to read or overwrite `count` except by calling one of the exposed methods. Each call to `createCounter` creates a brand-new function execution with its own fresh `count`, which is why `counterA` and `counterB` never interfere with each other.
