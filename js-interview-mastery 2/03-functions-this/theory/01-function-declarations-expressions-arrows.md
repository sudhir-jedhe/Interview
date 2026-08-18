# Function Declarations, Function Expressions, and Arrow Functions

A **function declaration** has a name and stands on its own as a statement; it's fully hoisted (see the scope/hoisting topic).

```js
function add(a, b) { return a + b; }
```

A **function expression** creates a function as part of an expression, usually assigned to a variable. It's only hoisted according to the variable keyword's rules, not the function's.

```js
const add = function(a, b) { return a + b; };
```

An **arrow function** is a more concise expression syntax introduced in ES6, with one critical semantic difference beyond syntax: it does not have its own `this`, `arguments`, or `super`.

```js
const add = (a, b) => a + b;
```

## Comparison table

| Aspect | Function Declaration | Function Expression | Arrow Function |
|---|---|---|---|
| Syntax | `function foo() {}` | `const foo = function() {}` | `const foo = () => {}` |
| Hoisting | Fully hoisted (name + body) | Only the variable binding is hoisted, per `var`/`let`/`const` rules | Same as function expression |
| Own `this` | Yes — determined by call site | Yes — determined by call site | No — inherits `this` lexically |
| Has `arguments` object | Yes | Yes | No — must use rest params (`...args`) |
| Usable as constructor (`new`) | Yes | Yes | No — throws `TypeError` |

Use function declarations for top-level named utilities you want hoisted. Use regular function expressions when you need your own `this`/`arguments` or need the function to be a constructor. Use arrow functions for callbacks where you want to preserve the enclosing `this` (e.g. inside class methods, array callbacks referencing instance state). The common mistake is using an arrow function for an object method that needs `this` to refer to the object — it won't (see `03-arrow-functions-and-lexical-this.md`).
