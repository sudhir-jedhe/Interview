# Scope & Hoisting — Notes

## Scope: where a variable is visible

JavaScript has three kinds of scope. **Global scope** is anything declared outside a function or block. **Function scope** applies to `var` — a `var` is visible anywhere inside the function it's declared in, regardless of nested blocks. **Block scope** applies to `let` and `const` — they're only visible inside the nearest enclosing `{ }`.

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

## `var` vs `let` vs `const`

`var` can be redeclared and reassigned freely within the same scope — no error, just silently overwritten:

```js
var a = 1;
var a = 2; // fine
```

`let` can be reassigned but not redeclared in the same scope:

```js
let b = 1;
b = 2;      // fine
let b = 3;  // SyntaxError: Identifier 'b' has already been declared
```

`const` can be neither reassigned nor redeclared — but as covered in the basics topic, it only locks the *binding*, not the contents of an object it points to:

```js
const c = 1;
c = 2; // TypeError: Assignment to constant variable.
```

## Hoisting: when a declaration becomes usable

JS engines process code in two conceptual passes: a **creation phase** that scans for declarations before running anything, and an **execution phase** that runs the code top to bottom. Hoisting is a name for what happens to declarations during the creation phase — but *how* each declaration type is hoisted differs sharply.

`var` declarations are hoisted **and initialized to `undefined`** immediately. This is why reading a `var` before its declaration line doesn't throw — it just gives you `undefined`:

```js
console.log(x); // undefined — hoisted, not yet assigned
var x = 5;
console.log(x); // 5
```

`let` and `const` are also hoisted (the engine knows about them from the top of the block), but they're **not initialized**. They sit in the **Temporal Dead Zone (TDZ)** — the span from the start of the block to the actual declaration line — during which accessing them throws a `ReferenceError`, not `undefined`:

```js
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

The TDZ exists to catch bugs early: silently getting `undefined` (as `var` does) can mask real logic errors, whereas throwing forces you to notice the ordering problem immediately.

## Function declarations vs function expressions

Function *declarations* are fully hoisted — both the name and the function body — so you can call them before their line in the source:

```js
greet(); // 'hi' — works, fully hoisted
function greet() { console.log('hi'); }
```

Function *expressions* (including arrow functions) assigned to a variable follow that variable's hoisting rules. If assigned via `var`, the variable is hoisted as `undefined`, so calling it early throws "not a function":

```js
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() { console.log('hi'); };
```

If assigned via `let`/`const`, it's in the TDZ, so calling it early throws a `ReferenceError` instead.

## Lexical scoping and the scope chain

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

## The classic `var` loop bug

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs: 3, 3, 3
```

Because `var` is function-scoped (here, effectively global), there's only **one** `i` shared by all three timeout callbacks. By the time any callback runs (after the loop finishes and the call stack clears), `i` is `3`. Switching to `let` fixes this because `let` creates a **new binding of `i` for each loop iteration**, so each closure captures its own distinct `i`:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs: 0, 1, 2
```
