# Output: arrow function class field vs detached regular method

```js
class Counter {
  count = 0;
  increment = () => { this.count++; };
}
const c = new Counter();
const fn = c.increment;
fn();
console.log(c.count);
```

**Answer:** `1`

**Why:** `increment` is defined as an arrow function class field, which captures `this` lexically at the point of instance creation (bound to the specific `Counter` instance), not dynamically at call time. So even when extracted and called standalone as `fn()`, it still correctly increments `c.count`. A regular method (`increment() {...}`) would have logged `NaN` or thrown, since `this` would be `undefined` in strict mode.
