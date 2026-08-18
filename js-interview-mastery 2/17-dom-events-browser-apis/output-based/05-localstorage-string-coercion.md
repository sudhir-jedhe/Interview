# Output: `localStorage` coerces everything to strings

```js
localStorage.setItem("count", 5);
const stored = localStorage.getItem("count");
console.log(typeof stored, stored + 1);
```

**Answer:**
```
string 51
```

**Why:** `localStorage` only stores strings — `setItem` coerces the number `5` to `"5"`. `getItem` returns that string, so `stored + 1` performs string concatenation (`"5" + 1` → `"51"`), not numeric addition, since `+` with a string operand concatenates rather than converts.
