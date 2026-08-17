# Functions & `this` — Comparisons

## Function Declaration vs Function Expression vs Arrow Function

| Aspect | Function Declaration | Function Expression | Arrow Function |
|---|---|---|---|
| Syntax | `function foo() {}` | `const foo = function() {}` | `const foo = () => {}` |
| Hoisting | Fully hoisted (name + body) | Only the variable binding is hoisted, per `var`/`let`/`const` rules | Same as function expression |
| Own `this` | Yes — determined by call site | Yes — determined by call site | No — inherits `this` lexically |
| Has `arguments` object | Yes | Yes | No — must use rest params (`...args`) |
| Usable as constructor (`new`) | Yes | Yes | No — throws `TypeError` |

Use function declarations for top-level named utilities you want hoisted. Use regular function expressions when you need your own `this`/`arguments` or need the function to be a constructor. Use arrow functions for callbacks where you want to preserve the enclosing `this` (e.g. inside class methods, array callbacks referencing instance state). The common mistake is using an arrow function for an object method that needs `this` to refer to the object — it won't.

## Implicit Binding vs Explicit Binding vs `new` Binding

| Aspect | Implicit (`obj.method()`) | Explicit (`fn.call(obj)` / `.apply(obj)` / `.bind(obj)`) | `new` binding (`new Fn()`) |
|---|---|---|---|
| How `this` is set | Automatically, based on the object before the dot at call time | Manually specified as the first argument | A brand-new object is created and set as `this` |
| Can be overridden by another rule? | Yes — explicit and `new` binding both take precedence | `bind()` is permanent (a "hard" bound function can't be re-bound); `call`/`apply` are per-call | Highest precedence — always wins if `new` is used |
| Typical use case | Normal object method calls | Borrowing methods, fixing `this` for callbacks | Creating instances from a constructor function/class |

Understand the precedence order (`new` > explicit > implicit > default) because real bugs often come from an object method being passed as a callback, losing implicit binding, and needing to be re-bound explicitly. The common mistake is assuming a method keeps its `this` just because it "belongs" to an object — `this` binding happens at call time, not definition time (except for arrow functions).

## Regular Function `this` vs Arrow Function `this`

| Aspect | Regular Function | Arrow Function |
|---|---|---|
| `this` source | Determined dynamically by how the function is called | Determined statically by where the function is defined (lexical scope) |
| Affected by `call`/`apply`/`bind`? | Yes | No — these have no effect on an arrow function's `this` |
| Affected by being a method vs standalone call? | Yes — changes `this` | No — always the same as the enclosing scope, regardless of how it's invoked |

Use regular functions for object methods, event handlers where you want `this` to be the element/caller, and anywhere `call`/`apply`/`bind` control is needed. Use arrow functions for nested callbacks inside methods where you want to keep referring to the outer `this`. The most common mistake is defining an object's methods as arrow functions (breaking `this`) or using a regular function for a nested callback inside a method (losing the outer `this` unintentionally).

## IIFE vs Regular Function Declaration

| Aspect | IIFE | Regular Function Declaration |
|---|---|---|
| Execution | Runs immediately upon definition | Runs only when explicitly called |
| Reusability | Typically one-time use, not named/reusable | Reusable, callable by name any number of times |
| Purpose | Create an isolated scope, run setup code once | Define reusable logic |

Use an IIFE when you need a private, one-off scope — for example wrapping async top-level code (`(async () => { ... })()`) or legacy module patterns. Use a regular declared function for anything you intend to call more than once. The common mistake is reaching for an IIFE where block scoping (`let`/`const` inside a bare `{ }`) or an ES module would be simpler and equally effective in modern JS.
