# Output: Array spread copies primitive elements independently

```js
const a = [1, 2, 3];
const b = [...a];
b.push(4);
console.log(a, b);
```

**Answer:** `[ 1, 2, 3 ] [ 1, 2, 3, 4 ]`

**Why:** Array spread creates a new top-level array. Since the elements are primitives, this is a true independent copy — pushing onto `b` cannot affect `a`. (This would differ if the elements were objects being mutated in place.)
