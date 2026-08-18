# Output: pushing onto a frozen array

```js
const frozen = Object.freeze([1, 2, 3]);
frozen.push(4);
```

**Answer:** Throws `TypeError: Cannot add property 3, object is not extensible` (in strict mode / ES modules); silently fails otherwise but the array stays `[1,2,3]`.

**Why:** Arrays are objects, so `Object.freeze` applies. `push` tries to add a new index and set `.length`, both of which are blocked by the frozen, non-extensible array. Array mutator methods run in strict mode internally in modern engines, so this throws.
