# Output: chaining mutating methods returns the same reference

```js
const arr = [3, 1, 2];
console.log(arr.reverse().sort((a, b) => a - b) === arr);
```

**Answer:** `true`

**Why:** Both `reverse()` and `sort()` mutate the array in place and return a reference to that same array (not a copy), so chaining them still operates on and returns the original `arr` throughout. The final comparison `=== arr` is comparing the same object reference to itself.
