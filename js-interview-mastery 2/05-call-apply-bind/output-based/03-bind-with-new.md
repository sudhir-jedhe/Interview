# Output: calling a bound function with new

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.bind(null, 5);
const p = new BoundPoint(10);
console.log(p.x, p.y);
```

**Answer:** `5 10`

**Why:** `Point.bind(null, 5)` pre-fills the first argument (`x = 5`) and would normally lock `this` to `null` — but per spec, when a bound function is invoked with `new`, the bound `this` value is ignored, and `new` constructs a fresh object as usual. The pre-bound argument (`5`) still applies, so `x` is `5`, and the remaining argument passed to `new BoundPoint(10)` fills `y`, giving `10`.
