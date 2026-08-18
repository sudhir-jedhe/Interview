## `call`, `apply`, and `bind`

`call`, `apply`, and `bind` are the three built-in ways to explicitly control what `this` refers to inside a function, overriding whatever `this` a normal call site would produce. `call` and `apply` invoke the function immediately with a given `this` (differing only in how they accept extra arguments — comma-separated vs an array), while `bind` returns a brand-new function permanently locked to a given `this`, without invoking it. This topic covers all three methods, real use cases like borrowing array methods for array-like objects and partial application, and building `Function.prototype.myCall`/`myApply`/`myBind` polyfills from scratch — a very common "write it yourself" interview exercise that tests whether you actually understand `this` binding rather than just knowing the API.

### Structure

- `theory/` — concept write-ups: call vs apply, bind fundamentals, how bind interacts with `new`, method borrowing & partial application, and bind vs arrow functions vs currying.
- `snippets/` — one short runnable example per file.
- `output-based/` — "what does this log?" questions with full explanations.
- `scenarios/` — realistic problems (filtering a `NodeList`, an analytics tracker, a mode-prefixed logger, implementing `myApply`) with worked solutions.
- `interview-qa/` — Q&A grouped into fundamentals, bind deep-dive, method borrowing/partial application, and edge cases.
- `problems/` — hands-on implementation challenges with full solutions: `myCall`/`myApply`/`myBind` polyfills, borrowing array methods for array-likes, and a `partial(fn, ...presetArgs)` utility.
- `assets/` — placeholder for supporting images/PDFs from original notes.

**What's covered:**
- What each of `call`, `apply`, and `bind` does and how their argument signatures differ
- Practical use cases: borrowing array methods for array-like objects, partial application with `bind`, controlling `this` in callbacks
- Writing polyfills for `Function.prototype.myCall`, `myApply`, and `myBind`, with full explanation
- How `bind` interacts with `new`
- `bind`-based partial application vs currying, and bind vs arrow function lexical `this`

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
