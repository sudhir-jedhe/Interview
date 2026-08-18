# Lexical Scoping and the Scope Chain

JS uses **lexical scoping**: a function's access to outer variables is determined by *where it's physically written in the source*, not by who calls it. When a variable is referenced, the engine looks it up in the current scope, then walks outward through each enclosing scope — the **scope chain** — until it finds it or reaches the global scope and throws `ReferenceError`.

```js
const outer = 'outer value';
function a() {
  function b() {
    console.log(outer); // found by walking up the scope chain to global
  }
  b();
}
```

The scope chain is fixed at the point a function is *defined*, not where it's *called* — this is what "lexical" means, as opposed to "dynamic" scoping (which some other languages use, where a function's access to outer variables would depend on the call stack at runtime). This is also the exact mechanism that makes closures possible: an inner function keeps its link to the outer scope's variables via the scope chain, even after the outer function has returned (see the dedicated closures topic for the full treatment).
