```js
const map = new Map();
map.set(NaN, 'a');
console.log(map.get(NaN));
console.log(NaN === NaN);
```
**Answer:**
```
a
false
```
**Why:** `Map` uses the SameValueZero algorithm for key comparison, which — unlike `===` — treats `NaN` as equal to itself. So `NaN` works reliably as a `Map` key even though `NaN === NaN` is famously `false` with strict equality.
