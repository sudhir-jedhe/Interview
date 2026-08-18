# Output: map preserves length even with undefined returns

```js
const arr = [1, 2, 3];
const result = arr.map((n) => {
  if (n === 2) return;
  return n * 10;
});
console.log(result);
```

**Answer:** `[10, undefined, 30]`

**Why:** `map` always produces an array of the same length as the input, one output slot per input element — it does not skip or omit elements when the callback returns `undefined`. It's not a filtering operation; an explicit `return;` (or falling off the end of the function) just puts `undefined` in that slot rather than removing it.
