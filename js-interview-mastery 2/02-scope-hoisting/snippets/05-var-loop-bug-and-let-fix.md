# The `var`-in-Loop Closure Bug and the `let` Fix

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var loop:', i), 0);
}
// logs after sync code finishes: 'var loop: 3' x3

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let loop:', j), 0);
}
// logs: 'let loop: 0', 'let loop: 1', 'let loop: 2'
```
