# Each Closure Instance Is Independent

```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const c1 = makeCounter();
const c2 = makeCounter();
console.log(c1(), c1(), c2()); // 1 2 1 — c2 has its own separate count
```
