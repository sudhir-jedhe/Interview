# Scope: Global, Function, and Block

Scope determines where a variable is visible. JavaScript has three kinds. **Global scope** is anything declared outside a function or block. **Function scope** applies to `var` — a `var` is visible anywhere inside the function it's declared in, regardless of nested blocks. **Block scope** applies to `let` and `const` — they're only visible inside the nearest enclosing `{ }`.

```js
function demo() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  console.log(x); // 1 — var leaked out of the if-block, still function-scoped
  console.log(y); // ReferenceError: y is not defined — let stayed inside the block
}
```

This is the core practical difference between `var` and `let`/`const`: `var` ignores block boundaries (`if`, `for`, `while`, bare `{}`) and only respects function boundaries; `let`/`const` respect both.

## Comparison table

| Aspect | Function Scope | Block Scope | Global Scope |
|---|---|---|---|
| Boundary | Function body (`function() {...}`) | Any `{ }` — `if`, `for`, `while`, bare blocks | Outside all functions/blocks |
| Applies to | `var`, function parameters | `let`, `const`, class declarations | `var` (without any wrapper), `let`/`const` at top level |
| Visibility | Anywhere inside the function, even nested blocks | Only within the enclosing `{ }` | Everywhere, including all modules if not scoped |

Prefer the narrowest scope possible for any variable — block scope when you only need it inside an `if`/`for`, function scope only when it truly needs to persist across the whole function body. The common mistake is over-relying on global scope (implicit globals from forgetting a declaration keyword), which creates naming collisions across a large codebase.
