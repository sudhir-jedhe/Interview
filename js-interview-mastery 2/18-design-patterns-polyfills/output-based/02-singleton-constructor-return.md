# Output: Singleton via constructor `return` override

```js
class Single {
  static #instance;
  constructor(value) {
    if (Single.#instance) return Single.#instance;
    this.value = value;
    Single.#instance = this;
  }
}

const a = new Single(1);
const b = new Single(2);
console.log(a.value, b.value, a === b);
```

**Answer:**
```
1 1 true
```

**Why:** The first `new Single(1)` creates the real instance and caches it. The second call, `new Single(2)`, detects `Single.#instance` is already set and immediately returns that cached instance instead of constructing a new one — the constructor's `return` overrides the default "return the new `this`" behavior for constructors when returning an object. `b.value` is still `1` because `b` *is* `a`.
