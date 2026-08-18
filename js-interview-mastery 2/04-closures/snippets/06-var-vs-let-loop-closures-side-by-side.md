# The `var` Loop Bug vs the `let` Fix, Side by Side

```js
const varResults = [];
for (var i = 0; i < 3; i++) {
  varResults.push(() => i);
}
console.log(varResults.map(fn => fn())); // [3, 3, 3]

const letResults = [];
for (let j = 0; j < 3; j++) {
  letResults.push(() => j);
}
console.log(letResults.map(fn => fn())); // [0, 1, 2]
```
