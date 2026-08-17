# Closures — Scenario Questions

### 1. You need to implement a rate limiter that only allows a wrapped function to be called once every N milliseconds — calls within the cooldown window should be silently ignored (not queued, unlike debounce/throttle-with-trailing-call). How would you build it using closures?

**Approach:**

```js
function rateLimit(fn, intervalMs) {
  let lastCallTime = 0; // captured in closure, persists across every call to the returned function
  return function(...args) {
    const now = Date.now();
    if (now - lastCallTime >= intervalMs) {
      lastCallTime = now;
      return fn.apply(this, args);
    }
    // silently ignored — outside the allowed window
  };
}

const logAction = rateLimit((action) => console.log('action:', action), 1000);
logAction('click'); // runs immediately
logAction('click'); // ignored, called too soon
setTimeout(() => logAction('click'), 1100); // runs, 1100ms later
```

The closure over `lastCallTime` is what makes this work — it's private state shared across every invocation of the wrapped function, invisible and untouchable from outside. Edge cases to consider: `this` must be forwarded with `apply(this, args)` in case the wrapped function is used as an object method; if the rate limiter needs to be reset externally (e.g. for testing), you'd need to expose an additional method on the returned function (e.g. `wrapped.reset = () => { lastCallTime = 0; }`), which is easy to add since it's just another closure over the same variable.

---

### 2. Your app renders a list of buttons dynamically from an array of items, and each button's click handler needs to know which item it corresponds to. Using a `for` loop with `var`, every button ends up referencing the last item. Diagnose and fix it, including a version that doesn't rely on `let`.

**Approach:**

```js
const items = ['Apple', 'Banana', 'Cherry'];
const container = document.createElement('div');

// Buggy: every click handler closes over the same shared `i`
for (var i = 0; i < items.length; i++) {
  const btn = document.createElement('button');
  btn.textContent = items[i];
  btn.addEventListener('click', () => console.log('clicked:', items[i])); // always items[3] -> undefined
  container.appendChild(btn);
}
```

**Fix with `let`** (simplest, preferred in modern code):

```js
for (let i = 0; i < items.length; i++) {
  const btn = document.createElement('button');
  btn.textContent = items[i];
  btn.addEventListener('click', () => console.log('clicked:', items[i])); // correct per-button item
  container.appendChild(btn);
}
```

**Fix without `let`** (using `forEach`, which creates a new function scope — and thus a new closure — per callback invocation, sidestepping the issue entirely):

```js
items.forEach(function(item, i) {
  const btn = document.createElement('button');
  btn.textContent = item;
  btn.addEventListener('click', () => console.log('clicked:', item)); // `item` is a fresh param per call
  container.appendChild(btn);
});
```

The `forEach` version works because each call to the callback gets its own `item`/`i` parameters — function parameters are scoped per invocation just like `let`. This is a good general lesson: array iteration methods (`forEach`, `map`, `filter`) sidestep the classic `var` loop bug automatically, since they're implemented as repeated function calls rather than a single shared-scope loop.

---

### 3. You're asked to implement a `pipe`/compose-style function pipeline where intermediate functions can be added dynamically and the pipeline remembers previously added steps between calls, similar to a builder pattern. How would closures help here?

**Approach:**

```js
function createPipeline() {
  const steps = []; // private list, only mutable through the returned methods
  return {
    addStep(fn) {
      steps.push(fn);
      return this; // allow chaining
    },
    run(input) {
      return steps.reduce((value, step) => step(value), input);
    }
  };
}

const pipeline = createPipeline();
pipeline
  .addStep(x => x + 1)
  .addStep(x => x * 2)
  .addStep(x => x - 3);

console.log(pipeline.run(5)); // ((5+1)*2)-3 = 9
console.log(pipeline.run(10)); // ((10+1)*2)-3 = 19 — steps persist across calls
```

The `steps` array is private state captured by both `addStep` and `run` via closure — nothing outside `createPipeline` can access or corrupt it directly, and it persists across multiple `.run()` calls because it lives in the enclosing function's scope, not inside `run` itself. This is a natural extension of the module pattern: a stateful object built entirely from closures instead of a class, useful when you want encapsulation without the ceremony of `class`/`this`.

---

### 4. A memoized function in your app is unexpectedly returning stale results after the underlying data source changes, even though the memoization was implemented "correctly" using a closure cache. What's the likely root cause, and how do you fix it?

**Approach:** Memoization assumes the wrapped function is pure — same input always produces the same output. If the function actually depends on external mutable state (a database, a global variable, the current time) in addition to its argument, caching by argument alone becomes incorrect once that external state changes.

```js
let taxRate = 0.08;
function memoize(fn) {
  const cache = new Map();
  return (price) => {
    if (cache.has(price)) return cache.get(price);
    const result = fn(price);
    cache.set(price, result);
    return result;
  };
}
const getTotal = memoize((price) => price * (1 + taxRate));

console.log(getTotal(100)); // 108, cached under key 100
taxRate = 0.10; // external state changed
console.log(getTotal(100)); // still 108 — stale! taxRate change isn't reflected
```

Fixes: (1) include every relevant input in the cache key, e.g. memoize on `(price, taxRate)` as a composite key, restoring purity with respect to the cache; (2) add an explicit cache invalidation mechanism — expose a `clearCache()` closure method that resets the `Map`, called whenever the external dependency changes; (3) if the function is fundamentally impure (depends on unpredictable external state like current time or a live database), reconsider whether memoization is appropriate at all, or add a TTL (time-to-live) to cache entries so they expire rather than persisting forever.
