# Scenario: Implementing `Array.prototype.map` matching native behavior exactly

**You're asked in an interview to implement `Array.prototype.map` from scratch, matching native behavior exactly, including edge cases. What do you need to handle beyond the simple loop?**

**Approach:**
Beyond the basic transform-and-collect loop: `map` must throw if called with a non-function callback, must pass `(element, index, array)` to the callback, must support an optional `thisArg` for the callback's `this` binding, and — a commonly missed detail — must skip holes in sparse arrays (never invoking the callback for indices that were never assigned, while still preserving the hole at that index in the output).

```js
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }
  const result = new Array(this.length); // preserves length even with holes
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};
```

See `../problems/02-array-and-promise-polyfills.md` for `filter` and `Promise.all` implemented with the same rigor.
