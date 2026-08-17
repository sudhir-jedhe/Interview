## `call`, `apply`, and `bind`

`call`, `apply`, and `bind` are the three built-in ways to explicitly control what `this` refers to inside a function, overriding whatever `this` a normal call site would produce. `call` and `apply` invoke the function immediately with a given `this` (differing only in how they accept extra arguments — comma-separated vs an array), while `bind` returns a brand-new function permanently locked to a given `this`, without invoking it. This topic covers all three methods, real use cases like borrowing array methods for array-like objects and partial application, and building a `Function.prototype.myBind` polyfill from scratch — a very common "write it yourself" interview exercise that tests whether you actually understand `this` binding rather than just knowing the API.

**What's covered:**
- What each of `call`, `apply`, and `bind` does and how their argument signatures differ
- Practical use cases: borrowing array methods for array-like objects, partial application with `bind`, controlling `this` in callbacks
- Writing a polyfill for `Function.prototype.myBind`, with full explanation
- How `bind` interacts with `new`

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
