# Functions & `this`

Functions in JavaScript come in three syntactic flavors — declarations, expressions, and arrow functions — and each behaves differently with respect to hoisting and, crucially, how `this` is bound inside them. This topic covers the four rules that determine what `this` refers to in a regular function call (default, implicit/method, explicit via `call`/`apply`/`bind`, and `new`), and why arrow functions opt out of having their own `this` entirely, inheriting it lexically from the enclosing scope instead. This is one of the highest-yield interview topics because `this` bugs are extremely common in real code — especially inside callbacks, event handlers, and class methods passed as references — and being able to explain precisely why a particular `this` value shows up is a strong signal of real JS fluency.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — concept-by-concept notes: the three function forms, the four `this`-binding rules & precedence, arrow functions & lexical `this`, `this` in callbacks/event handlers, IIFEs, and named vs anonymous function expressions.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 8 "predict the output" questions covering detached methods, arrow-function pitfalls, constructor overrides, and bind precedence, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (fixing lost `this` in class event handlers, a `thisArg` parameter design, arrow functions breaking object methods, a `this`-preserving `once` utility), each with a worked approach.
- **`interview-qa/`** — 12 Q&A pairs grouped into 3 themed files: `this`-binding rules, arrow functions, and function declaration forms/IIFEs.
- **`problems/`** — 3 hands-on coding challenges: a `bindContext`/`myBind` polyfill focused on `this` resolution, a walkthrough inferring `this` across all four call styles, and a simple `this`-aware event-emitter class.
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- Function declarations vs function expressions vs arrow functions (syntax + hoisting differences)
- The four ways `this` gets bound: default/global, implicit/method call, explicit call/apply/bind, `new` binding
- Arrow functions and lexical `this` (they don't have their own `this`)
- `this` inside callbacks, event handlers, and nested functions
- IIFEs and why they're used
- Named vs anonymous function expressions
- Hands-on: a from-scratch `bind` polyfill, systematically inferring `this` for every call style, and a `this`-correct event emitter
