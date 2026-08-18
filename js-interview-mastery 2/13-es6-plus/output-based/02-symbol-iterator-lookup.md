```js
const obj = {};
console.log(obj[Symbol.iterator]);
console.log(typeof obj.toString);
```
**Answer:**
```
undefined
function
```
**Why:** Plain objects don't have a `Symbol.iterator` method by default (that's why `for-of` fails on them), but they do inherit ordinary string-keyed methods like `toString` from `Object.prototype`. This contrasts symbol-keyed lookups (opt-in, rare) with the standard prototype chain (always present).
