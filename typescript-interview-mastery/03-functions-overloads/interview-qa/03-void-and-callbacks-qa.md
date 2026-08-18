# Interview Q&A: void Semantics and Callback Typing

**Q: If a function's return type is `void`, does that mean it always returns `undefined` at runtime?**
A: Not necessarily. `void` describes "the return value is not meant to be used by the caller," not "the return value is literally `undefined`." A function typed to return `void` at a call site (particularly when it's a callback parameter typed `() => void`) is allowed to actually return a real value under the hood — TypeScript simply won't let the caller treat the call's result as anything other than `void`/`undefined`, even though the concrete runtime value returned might be a number, object, or anything else.

**Q: Why does TypeScript allow passing a function that returns a value where a `void`-returning callback is expected?**
A: For ergonomics with common JavaScript idioms — most notably `array.forEach(x => otherArray.push(x))`, where `Array.prototype.push` returns the new array length (a `number`), but you don't want to be forced to wrap the arrow function in braces (`x => { otherArray.push(x); }`) just to explicitly discard that return value. This leniency is scoped specifically to callback *parameters* typed `void`, not to `void`-typed variables or return type annotations directly.

**Q: What's the danger of this `void`-callback leniency in practice?**
A: It silently accepts `async` functions (which always return `Promise<void>`, not `void`) wherever a synchronous `void`-returning callback is expected, since a `Promise` is just another "value" that gets ignored under the rule. This can hide fire-and-forget async bugs — an async callback passed to something like `array.forEach(asyncHandler)` will have its returned promise chain silently dropped, meaning any rejection inside it becomes an unhandled promise rejection that the type checker never flagged.

**Q: How do you type a callback parameter to correctly handle both sync and async implementations?**
A: Union the parameter's return type explicitly: `(item: T) => void | Promise<void>`. Inside the calling function, you then handle both cases deliberately — e.g. collecting results and `await Promise.all(...)`-ing any promises returned — rather than relying on the ambient `void`-callback leniency to silently swallow whichever kind of function was actually passed. Linters like `@typescript-eslint/no-misused-promises` also help catch cases the type system alone permits but that are usually unintentional.
