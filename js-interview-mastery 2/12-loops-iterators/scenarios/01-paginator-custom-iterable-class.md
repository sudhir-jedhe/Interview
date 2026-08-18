# Scenario: Building a `Paginator` class that supports `for-of`

You're building a `Paginator` class that wraps a large dataset and needs to support `for (const page of paginator)` to iterate through pages of a fixed size, fetching lazily. How do you make an arbitrary class instance work with `for-of`, and what edge cases (empty dataset, last partial page) matter?

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
