# Output: + vs other arithmetic operators with strings

```js
console.log("5" + 3);
console.log("5" - 3);
console.log("5" * "2");
```

**Answer:** `"53"`, `2`, `10`

**Why:** `+` is overloaded — if either operand is a string, it performs string concatenation. `-` and `*` (and `/`) are never overloaded for strings; they always coerce both operands to numbers first, so `"5" - 3` becomes `5 - 3 = 2` and `"5" * "2"` becomes `5 * 2 = 10`. `+` is the one arithmetic-looking operator that behaves completely differently depending on operand types.
