# Functions & `this` — Interview Q&A

**Q: What are the four rules for determining `this` in JavaScript?**
In order of precedence, highest to lowest: (1) `new` binding — calling a function with `new` sets `this` to the newly created object; (2) explicit binding — `call`, `apply`, or `bind` set `this` directly; (3) implicit binding — calling a function as a method (`obj.method()`) sets `this` to the object before the dot; (4) default binding — a plain, unqualified function call sets `this` to the global object in non-strict mode, or `undefined` in strict mode.

**Q: Why don't arrow functions have their own `this`?**
By design, arrow functions were introduced specifically to solve the recurring problem of `this` getting lost in nested callbacks. Instead of binding `this` based on how they're called, arrow functions simply don't have a `this` binding of their own — any reference to `this` inside one is resolved via normal lexical scope lookup, finding whatever `this` was in the nearest enclosing non-arrow function (or the global/module `this` if there is none).

**Q: What happens if you call `.bind()` on an arrow function?**
Nothing useful — `bind()` (along with `call`/`apply`) has no effect on an arrow function's `this`, since arrow functions never consult the caller-supplied `this` in the first place. You can still call `.bind()` on one to pre-fill arguments (partial application), but the `thisArg` you pass is silently ignored.

**Q: What's the difference between `call`, `apply`, and how do they relate to `this`?**
Both `call` and `apply` invoke a function immediately with an explicitly specified `this`. `call` takes subsequent arguments individually (`fn.call(thisArg, a, b, c)`), while `apply` takes them as a single array (`fn.apply(thisArg, [a, b, c])`). Both are ways of implementing rule 3 (explicit binding) for `this`.

**Q: If you extract a method from an object and call it standalone, why does `this` break?**
`this` for a regular function is determined at call time by the call site, not by where the function was originally defined or attached. Extracting `const fn = obj.method` and calling `fn()` invokes it as a plain function call with no object before the dot, so implicit binding never applies — it falls through to default binding, giving `this` as the global object or `undefined`.

**Q: How does `this` behave inside a regular function passed as a `setTimeout` callback versus an arrow function?**
A regular function passed to `setTimeout` is invoked by the timer mechanism as a plain function call, so `this` inside it follows default binding (global object or `undefined`), not whatever object it might have been "attached to" syntactically. An arrow function passed instead inherits `this` lexically from whatever scope it was defined in — typically the enclosing method — which is why arrow functions are the standard fix for `this`-in-callback bugs.

**Q: What is an IIFE and what problem does it solve?**
An Immediately Invoked Function Expression is a function that's defined and called in the same expression: `(function() { ... })()`. It creates an isolated function scope that executes once, historically used to avoid leaking variables into the global scope before block-scoping (`let`/`const`) existed, and still used today to wrap one-off setup logic or top-level `async` code.

**Q: What's the difference between a function declaration and a function expression?**
A function declaration is a standalone statement (`function foo() {}`) that's fully hoisted, meaning it can be called before its line in the source. A function expression creates a function as part of an expression, most commonly assigned to a variable (`const foo = function() {}`), and is only hoisted according to that variable's declaration rules (`var`, `let`, or `const`), not as a callable function.

**Q: Can arrow functions be used as constructors with `new`?**
No — calling an arrow function with `new` throws `TypeError: X is not a constructor`. This is a deliberate restriction, since arrow functions lack their own `this` binding (which `new` needs to set) and also lack an internal `[[Construct]]` method that the `new` operation requires.

**Q: What does a named function expression give you that an anonymous one doesn't?**
A named function expression (`const f = function inner() { ... }`) can reference itself by its internal name for recursion, without that name leaking into the enclosing scope — only `f` is visible outside, `inner` is only visible inside the function body. This is particularly useful when you want safe self-reference even if the outer variable gets reassigned later.

**Q: What's the difference between `this` in a regular function and `this` in a class method?**
Both use the same four `this`-binding rules, since class methods are just functions attached to the prototype (or instance, for class fields). The key practical difference is that class bodies are always implicitly in strict mode, so calling a class method as a detached, unbound function results in `this` being `undefined` rather than falling back to the global object.

**Q: Once you call `.bind()` on a function, can you re-bind it to a different `this` later?**
No — `bind()` produces a new function with a permanently fixed `this` (a "hard-bound" function). Calling `.bind()` again on that already-bound function creates yet another wrapper, but the original bound `this` still wins; you cannot override it with a later `bind`, `call`, or `apply`.

**Q: Why might using arrow functions for every object method be a mistake?**
Because arrow functions don't create their own `this`, an object literal's arrow-function "method" won't have `this` refer to the object — it captures whatever `this` was in scope where the object literal itself was written (often the module top level, which is `undefined` or the global object). Object and class methods that need to access instance/object state via `this` should use regular functions or ES6 method shorthand, not arrow functions.
