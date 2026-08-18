# `.bind()` Is Permanent — Re-binding Has No Effect

```js
const bound1 = function() { return this.x; }.bind({ x: 1 });
const bound2 = bound1.bind({ x: 2 });
console.log(bound2());
```

**Answer:** `1`

**Why:** Once a function is bound with `.bind()`, its `this` is permanently locked — calling `.bind()` again on an already-bound function has no effect on `this`; the original binding always wins. `bound2` is effectively just `bound1` with (irrelevantly) another bind wrapper, so it still returns `1`.
