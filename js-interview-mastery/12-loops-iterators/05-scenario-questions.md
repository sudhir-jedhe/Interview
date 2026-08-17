# Scenario Questions: Loops & Iterators

**You're building a `Paginator` class that wraps a large dataset and needs to support `for (const page of paginator)` to iterate through pages of a fixed size, fetching lazily. How do you make an arbitrary class instance work with `for-of`, and what edge cases (empty dataset, last partial page) matter?**

**Approach:**
Implement `[Symbol.iterator]` (most cleanly via a generator method) so the class itself is iterable:

```js
class Paginator {
  constructor(items, pageSize) {
    this.items = items;
    this.pageSize = pageSize;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.items.length; i += this.pageSize) {
      yield this.items.slice(i, i + this.pageSize);
    }
  }
}

const p = new Paginator([1, 2, 3, 4, 5], 2);
for (const page of p) console.log(page);
// [1, 2]
// [3, 4]
// [5]
```
Using a generator (`*[Symbol.iterator]`) avoids manually managing `next()`/`done` state. Edge cases: an empty `items` array produces zero pages (the loop body never runs — no special-casing needed since `slice` handles it gracefully); a dataset not evenly divisible by `pageSize` naturally yields a shorter final page because `slice` just returns whatever is left, no out-of-bounds errors. If pages need to be fetched from a server rather than sliced from memory, you'd make the generator method `async *[Symbol.iterator]` and consume it with `for await...of` instead.

---

**You need a `retryUntilSuccess(fn, maxAttempts)` helper that calls a possibly-throwing synchronous function, retrying up to `maxAttempts` times, and returns the first successful result — or re-throws the last error if all attempts fail. Which loop construct fits best and why?**

**Approach:**
A `for` loop with an explicit counter is the clearest fit because you need both a bounded attempt count and the ability to break out on success:

```js
function retryUntilSuccess(fn, maxAttempts) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn(); // success — exit immediately
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${attempt} failed: ${err.message}`);
    }
  }
  throw lastError;
}
```
`return` inside the `try` block inside the loop is enough to exit early on success — no explicit `break` needed since we're returning from the function entirely. A `do-while` is tempting since you always want at least one attempt, but `for` is more idiomatic here because the primary variable of interest (`attempt`) is naturally a counter with a known upper bound; `do-while` would require a separately declared counter variable outside the loop, adding no real benefit.

---

**You're given a `NodeList` from `document.querySelectorAll(...)` and need to loop through it, skip any element with a `data-disabled` attribute, and stop entirely once you've processed 5 valid elements. What loop and control-flow constructs do you use, and what's the gotcha with `NodeList`?**

**Approach:**
`NodeList` (from `querySelectorAll`, as opposed to `getElementsByClassName`) is iterable, so `for-of` works directly, combined with `continue` to skip and `break` to cap:

```js
const nodes = document.querySelectorAll('.item');
let processed = 0;
for (const node of nodes) {
  if (node.hasAttribute('data-disabled')) continue;
  console.log(node.textContent);
  processed++;
  if (processed === 5) break;
}
```
The gotcha: `querySelectorAll` returns a **static** `NodeList` (a snapshot at call time), so it's safe to iterate even if the DOM changes afterward — but `getElementsByClassName`/`getElementsByTagName` return a **live** `HTMLCollection`, which is *not* directly iterable with `for-of` in older environments and, more dangerously, updates in real time as the DOM changes, so mutating matched elements mid-loop can cause elements to be skipped or visited twice. Always confirm which one you're dealing with before looping and mutating.

---

**You want to build a lazy `take(iterable, n)` utility that returns the first `n` values from any iterable (array, Set, generator, even an infinite generator) without consuming more than necessary. How would generators make this trivial, and why would a naive array-based approach fail on infinite sequences?**

**Approach:**
```js
function* take(iterable, n) {
  let count = 0;
  for (const value of iterable) {
    if (count >= n) return;
    yield value;
    count++;
  }
}

function* naturals() {
  let i = 1;
  while (true) yield i++;
}

console.log([...take(naturals(), 5)]);
// [ 1, 2, 3, 4, 5 ]
```
A naive approach like `[...iterable].slice(0, n)` would fail catastrophically on `naturals()` because the spread operator tries to fully exhaust the iterable *before* slicing — since `naturals()` never terminates, this would hang forever (or crash with an out-of-memory error). The generator-based `take` avoids this by pulling values one at a time via `for-of`'s internal `next()` calls and explicitly `return`ing (which signals the outer generator to also stop) as soon as `n` values have been yielded — nothing beyond the `n`th value of the source iterable is ever computed.
