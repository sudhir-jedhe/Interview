# Output: slice vs substring with negative indices

```js
console.log("abc".slice(-2));
console.log("abc".substring(-2));
console.log("abc".slice(1, -1));
```

**Answer:** `"bc"`, `"abc"`, `"b"`

**Why:** `slice` interprets a negative index as counting from the end of the string, so `-2` means "start 2 characters before the end," giving `"bc"`. `substring` clamps any negative argument to `0`, so `-2` becomes `0` and it returns the whole string. `slice(1, -1)` starts at index 1 and ends 1 character before the end, extracting just `"b"` from `"abc"`.
