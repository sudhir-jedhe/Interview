# Output: + evaluated left to right

```js
console.log(1 + "2" + 3);
console.log(1 + 2 + "3");
console.log("1" + 2 + 3);
```

**Answer:** `"123"`, `"33"`, `"123"`

**Why:** `+` evaluates strictly left to right with no special-casing beyond "if either side is a string, concatenate." Line 1: `1 + "2"` is `"12"` (mixed → concat) then `"12" + 3` is `"123"`. Line 2: `1 + 2` is `3` (both numbers → arithmetic) then `3 + "3"` is `"33"`. Line 3: `"1" + 2` is `"12"` then `"12" + 3` is `"123"`. Operand order determines whether the first operation is numeric or string-based, which cascades through the rest of the chain.
