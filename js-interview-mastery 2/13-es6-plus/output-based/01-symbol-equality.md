```js
const s1 = Symbol('id');
const s2 = Symbol('id');
console.log(s1 === s2);
console.log(s1.toString());
```
**Answer:**
```
false
Symbol(id)
```
**Why:** Every call to `Symbol()` produces a brand-new, completely unique value regardless of the description string passed in — the description is purely for debugging/display purposes and plays no role in equality. `s1` and `s2` are two distinct primitives even though they share the description `'id'`.
