# Output: sparse arrays skip holes during iteration

```js
const arr = [1, , 3];
console.log(arr.length);
console.log(arr.map((n) => n * 2));
arr.forEach((n) => console.log("visited", n));
```

**Answer:** `3`, then `[2, <1 empty item>, 6]`, then only `"visited 1"` and `"visited 3"` (the hole is never visited)

**Why:** `[1, , 3]` creates a sparse array with an actual "hole" at index 1, not a stored `undefined`. `.length` counts holes (it's `3`). But iteration methods like `map` and `forEach` explicitly skip holes — `map` preserves the hole in its output rather than computing a value for it, and `forEach`'s callback is simply never invoked for that index.
