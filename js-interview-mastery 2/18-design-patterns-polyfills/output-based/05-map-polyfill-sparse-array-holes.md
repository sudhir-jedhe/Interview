# Output: `map` polyfill and sparse array holes

```js
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) out[i] = cb(this[i], i, this);
  }
  return out;
};

const sparse = [1, , 3]; // hole at index 1
console.log(sparse.myMap(x => x * 2));
console.log(sparse.myMap(x => x * 2).length);
```

**Answer:**
```
[ 2, <1 empty item>, 6 ]
3
```

**Why:** The `i in this` check skips index 1 because it's a genuine "hole" (never assigned), not a value of `undefined`. This matches native `Array.prototype.map`'s documented behavior of skipping holes in sparse arrays, so the callback is never invoked for that index, but the resulting array still has `length` 3 with a hole preserved at index 1.
