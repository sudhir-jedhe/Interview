# Output: Array destructuring a string

```js
const [x, y, z] = 'hi';
console.log(x, y, z);
```

**Answer:** `h i undefined`

**Why:** Strings are iterable (iterating yields each character), so array destructuring works on them directly. `'hi'` only has two characters, so the third binding `z` has nothing to pull and becomes `undefined` — destructuring never throws for "missing" positions, it just yields `undefined`.
