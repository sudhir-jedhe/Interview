# Problem: Polyfills for `Array.prototype.map`, `Array.prototype.filter`, and `Promise.all`

**Task:** Reimplement these three built-ins from scratch, matching native observable behavior, including their documented edge cases. (Checked first: neither `08-arrays/` nor `14-async-js/` in this repo already implement these polyfills, so they're covered here in full.)

## `Array.prototype.map`

```js
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }
  const result = new Array(this.length); // preserves length even with holes
  for (let i = 0; i < this.length; i++) {
    if (i in this) { // skip holes in sparse arrays -- never call back for them
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

console.log([1, 2, 3].myMap(x => x * 2));            // [2, 4, 6]
console.log([1, , 3].myMap(x => x * 2));              // [2, <1 empty item>, 6]
console.log([1, 2].myMap(function (x) { return this.factor * x; }, { factor: 10 })); // [10, 20]
```

## `Array.prototype.filter`

```js
Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

console.log([1, 2, 3, 4].myFilter(x => x % 2 === 0)); // [2, 4]
console.log([1, , 3].myFilter(() => true));            // [1, 3] -- holes are skipped, never even tested
console.log([].myFilter(() => true));                  // [] -- empty input is fine, no special-casing needed
```

Unlike `map`, `filter`'s output length is generally different from the input's, so — unlike `map` — there's no reason to pre-size the result array; holes are simply never visited (`i in this` is `false`) so they never make it into the output either, which matches native behavior of `filter` never producing holes in its result.

## `Promise.all`

```js
function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const results = new Array(promises.length);
    let remaining = promises.length;

    if (remaining === 0) {
      resolve(results); // empty input resolves immediately with []
      return;
    }

    promises.forEach((item, index) => {
      Promise.resolve(item).then( // non-promise values are treated as already-resolved
        (value) => {
          results[index] = value; // preserve input order, not settle order
          remaining -= 1;
          if (remaining === 0) resolve(results);
        },
        (err) => reject(err) // first rejection wins immediately, doesn't wait for the rest
      );
    });
  });
}

myPromiseAll([
  new Promise((r) => setTimeout(() => r("slow"), 100)),
  Promise.resolve("fast"),
  42, // a plain value, not a promise
]).then(console.log);
// ["slow", "fast", 42] -- after ~100ms, order matches input order

myPromiseAll([Promise.resolve(1), Promise.reject("boom"), Promise.resolve(3)])
  .catch((err) => console.log("rejected with:", err));
// "rejected with: boom" -- fires as soon as the rejection settles, doesn't wait for the third promise
```

## Edge cases each polyfill deliberately handles

- **`map`/`filter`**: non-function callback throws `TypeError`; sparse array holes are skipped (never invoke the callback, `map` preserves the hole in output); optional `thisArg` is respected via `.call(thisArg, ...)`.
- **`Promise.all`**: empty input resolves immediately; non-promise values are wrapped via `Promise.resolve`; result order always matches input order regardless of settle order; the very first rejection short-circuits everything else.
