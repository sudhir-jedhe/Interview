# Redeclaration Rules: `var` Allows It Silently, `let` Throws

```js
var x = 1;
var x = 2;
console.log(x); // 2 — no error

let y = 1;
try {
  eval('let y = 2;'); // SyntaxError inside eval to avoid crashing the whole snippet
} catch (e) {
  console.log(e.constructor.name); // 'SyntaxError'
}
```
