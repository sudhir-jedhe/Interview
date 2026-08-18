# Independent Closures Per Factory Call

```js
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}
const add10 = makeAdder(10);
const add20 = makeAdder(20);
console.log(add10(5), add20(5), add10(100));
```

**Answer:** `15 25 110`

**Why:** Each call to `makeAdder` creates a distinct closure with its own `x`. `add10` and `add20` are independent functions with independently captured `x` values (`10` and `20` respectively) — calling one doesn't affect the other's captured state.
