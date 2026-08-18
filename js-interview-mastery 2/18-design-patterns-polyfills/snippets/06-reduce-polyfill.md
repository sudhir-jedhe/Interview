# Snippet: Polyfill for `Array.prototype.reduce`, including the no-initial-value edge case

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

console.log([1, 2, 3].myReduce((a, b) => a + b));    // 6 (no initial value: starts from index 1)
console.log([1, 2, 3].myReduce((a, b) => a + b, 10)); // 16
```
