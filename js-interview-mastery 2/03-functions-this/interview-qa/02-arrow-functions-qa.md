# Interview Q&A — Arrow Functions and `this`

**Q: Why don't arrow functions have their own `this`?**
By design, arrow functions were introduced specifically to solve the recurring problem of `this` getting lost in nested callbacks. Instead of binding `this` based on how they're called, arrow functions simply don't have a `this` binding of their own — any reference to `this` inside one is resolved via normal lexical scope lookup, finding whatever `this` was in the nearest enclosing non-arrow function (or the global/module `this` if there is none).

**Q: What happens if you call `.bind()` on an arrow function?**
Nothing useful — `bind()` (along with `call`/`apply`) has no effect on an arrow function's `this`, since arrow functions never consult the caller-supplied `this` in the first place. You can still call `.bind()` on one to pre-fill arguments (partial application), but the `thisArg` you pass is silently ignored.

**Q: How does `this` behave inside a regular function passed as a `setTimeout` callback versus an arrow function?**
A regular function passed to `setTimeout` is invoked by the timer mechanism as a plain function call, so `this` inside it follows default binding (global object or `undefined`), not whatever object it might have been "attached to" syntactically. An arrow function passed instead inherits `this` lexically from whatever scope it was defined in — typically the enclosing method — which is why arrow functions are the standard fix for `this`-in-callback bugs.

**Q: Can arrow functions be used as constructors with `new`?**
No — calling an arrow function with `new` throws `TypeError: X is not a constructor`. This is a deliberate restriction, since arrow functions lack their own `this` binding (which `new` needs to set) and also lack an internal `[[Construct]]` method that the `new` operation requires.
