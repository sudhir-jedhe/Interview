# Output: Independent closure scopes per call

```js
function outer() {
  let count = 0;
  return function increment() {
    return ++count;
  };
}

const counterA = outer();
const counterB = outer();
console.log(counterA(), counterA(), counterB());
```

**Answer:**
```
1 2 1
```

**Why:** Each call to `outer()` creates a brand-new closure scope with its own `count` variable. `counterA` and `counterB` are two independent closures, so incrementing one has no effect on the other's `count` — a classic demonstration that closures capture variables by reference to their own scope instance, not a shared global.
