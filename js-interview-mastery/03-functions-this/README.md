## Functions & `this`

Functions in JavaScript come in three syntactic flavors — declarations, expressions, and arrow functions — and each behaves differently with respect to hoisting and, crucially, how `this` is bound inside them. This topic covers the four rules that determine what `this` refers to in a regular function call (default, implicit/method, explicit via `call`/`apply`/`bind`, and `new`), and why arrow functions opt out of having their own `this` entirely, inheriting it lexically from the enclosing scope instead. This is one of the highest-yield interview topics because `this` bugs are extremely common in real code — especially inside callbacks, event handlers, and class methods passed as references — and being able to explain precisely why a particular `this` value shows up is a strong signal of real JS fluency.

**What's covered:**
- Function declarations vs function expressions vs arrow functions (syntax + hoisting differences)
- The four ways `this` gets bound: default/global, implicit/method call, explicit call/apply/bind, `new` binding
- Arrow functions and lexical `this` (they don't have their own `this`)
- `this` inside callbacks, event handlers, and nested functions
- IIFEs and why they're used
- Named vs anonymous function expressions

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
