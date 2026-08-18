# Polyfills: The General Approach

A polyfill reimplements a native method's exact observable behavior — argument order, `this` handling, edge cases with sparse arrays or empty input — using only older, more widely supported language features. The general process: (1) read the spec/MDN carefully for edge cases (what happens with no callback? with holes in the array? with a `thisArg`?), (2) write the "happy path" first, (3) then handle documented edge cases one at a time, testing against the real native version's behavior as a reference.

```js
if (!Array.prototype.myMap) {
  Array.prototype.myMap = function (callback, thisArg) {
    if (typeof callback !== "function") throw new TypeError(`${callback} is not a function`);
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (i in this) { // respect sparse arrays -- skip holes, matching native map
        result[i] = callback.call(thisArg, this[i], i, this);
      }
    }
    return result;
  };
}
```

`Array.prototype.reduce` is trickier because of the optional initial value: if omitted, the first array element becomes the accumulator and iteration starts from index 1, and calling `reduce` on an empty array with no initial value must throw a `TypeError`.

```js
Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue;
  let startIndex = 0;
  if (acc === undefined) {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) acc = callback(acc, this[i], i, this);
  }
  return acc;
};
```

`Promise.all` polyfills need to track resolution order (results must preserve input order even though promises can settle out of order) and reject immediately if *any* input promise rejects, without waiting for the others.

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    if (remaining === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = value; // order preserved by index, regardless of settle order
          if (--remaining === 0) resolve(results);
        },
        reject // any single rejection rejects the whole thing immediately
      );
    });
  });
}
```

**General strategy when asked to write a polyfill you've never implemented before:** start from the documented behavior (arguments accepted, return value, `this` handling), implement the straightforward happy path first, then work through documented edge cases one at a time (empty input, wrong argument types, optional parameters) — testing each against how the real native method behaves. It's more valuable to talk through the edge cases out loud than to silently produce a perfect implementation, since it shows you understand the spec, not just the common case.

Full, tested-against-edge-cases implementations of `Array.prototype.map`, `Array.prototype.filter`, and `Promise.all` are in `../problems/02-array-and-promise-polyfills.md`.
