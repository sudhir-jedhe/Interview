# Output: Labeled break exits the outer loop entirely

```js
let result = '';
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 2) break outer;
    result += `${i}${j} `;
  }
}
console.log(result);
```

**Answer:** `00 01 `

**Why:** `break outer` (labeled break) exits the outer loop entirely, not just the inner one. On `i=0, j=0` and `i=0, j=1` the condition is false and the string accumulates; the moment `j` reaches `2` (still with `i=0`), the labeled break terminates both loops immediately, so `i` never reaches `1`.
