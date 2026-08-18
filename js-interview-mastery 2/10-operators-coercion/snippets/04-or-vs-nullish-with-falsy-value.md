# || vs ?? with a legitimately falsy value

```js
function getCount(count) { return count || 10; }
function getCountFixed(count) { return count ?? 10; }
console.log(getCount(0));        // 10 — bug, 0 was treated as "missing"
console.log(getCountFixed(0));   // 0  — correct, 0 is a valid value
```
