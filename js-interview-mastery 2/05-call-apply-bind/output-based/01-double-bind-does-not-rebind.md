# Output: chaining bind twice

```js
function show() { return this.x; }
const a = { x: 1 };
const b = { x: 2 };
const boundToA = show.bind(a);
console.log(boundToA.bind(b)());
```

**Answer:** `1`

**Why:** `bind` locks `this` the moment it's called; a bound function's `this` cannot be re-bound by a subsequent `.bind()` call. `boundToA.bind(b)` returns yet another wrapper function, but the underlying `this` remains `a` because the original `show.bind(a)` already permanently fixed it.
