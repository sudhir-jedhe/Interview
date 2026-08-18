# Array Destructuring

Array destructuring unpacks values by position. You can skip elements by leaving a slot empty, provide defaults for `undefined` values, and even swap two variables without a temp variable:

```js
const [a, , c] = [1, 2, 3];        // a = 1, c = 3 (skip index 1)
const [x = 10, y = 20] = [5];      // x = 5, y = 20 (default only applies to undefined)

let m = 1, n = 2;
[m, n] = [n, m];                   // swap: m = 2, n = 1
```

Defaults only kick in when the value at that position is `undefined` — not `null`, not `0`, not `''`. This trips people up: `const [a = 5] = [null]` gives `a = null`, not `5`.

## Array destructuring vs object destructuring

| Aspect | Array Destructuring | Object Destructuring |
|---|---|---|
| Matches by | Position/index | Property name |
| Skipping | `const [, b] = arr` (empty slot) | Not applicable — just don't name the key |
| Renaming | Rename by choosing the variable name directly | `const { key: newName } = obj` |
| Source requirement | Any iterable | Any object (or value coercible to one) |

Use array destructuring when order is meaningful and fixed (like `[state, setState] = useState()`); use object destructuring when you care about named fields regardless of order (like config objects). A common mistake is trying to skip a property in object destructuring the way you skip an array element — object destructuring has no positional "empty slot" concept, you simply omit the key.
