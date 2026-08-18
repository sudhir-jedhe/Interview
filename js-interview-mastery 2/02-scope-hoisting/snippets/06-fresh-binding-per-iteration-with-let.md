# Block Scope Creates a Fresh Binding Each Time in a Loop with `let`

```js
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map(fn => fn())); // [0, 1, 2] — each closure captured its own i
```
