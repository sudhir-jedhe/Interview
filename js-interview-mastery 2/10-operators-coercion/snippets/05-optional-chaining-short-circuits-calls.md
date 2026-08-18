# Optional chaining short-circuits function calls too

```js
let called = false;
function sideEffect() { called = true; return "result"; }
const obj = { fn: null };
const result = obj.fn?.();
console.log(result, called); // undefined false — sideEffect-style call never happens
```
