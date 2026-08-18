# Interview Q&A: ReturnType, Parameters, Awaited

**Q1: Why do you need `typeof` when writing `ReturnType<typeof someFunction>`?**
A: `ReturnType<T>` expects a *type* argument, but `someFunction` on its own is a value (an identifier referring to a runtime function), not a type. `typeof someFunction` converts that value into its corresponding type at the type level — TypeScript's `typeof` operator has this dual meaning (runtime operator vs. type-query operator) depending on whether it appears in an expression or a type position.

**Q2: How does `ReturnType` behave with an overloaded function?**
A: It only picks up the **last** overload signature in the declaration list — it does not produce a union of all overloads' return types. This is a well-known limitation; if you need the return type of a specific (non-last) overload, `ReturnType` alone can't get it, and you typically have to restructure the function or manually replicate the signature.

**Q3: What's the practical value of `Parameters<T>` in a decorator/wrapper function?**
A: It lets a higher-order function accept "whatever arguments the wrapped function accepts" as a typed rest-parameter tuple — `(...args: Parameters<F>) => ...` — without hand-writing or duplicating the original parameter list. If the wrapped function's signature changes, the wrapper's accepted arguments update automatically, eliminating an entire class of "wrapper is out of sync with the function it wraps" bugs.

**Q4: Why is `Awaited<T>` recursive instead of just unwrapping one layer of `Promise`?**
A: Because that's how real `await` behaves — JavaScript's `await` keeps unwrapping "thenables" until it reaches a non-thenable value, including cases like `Promise<Promise<Promise<T>>>` (which can arise from `async` functions returning other promises, or `Promise.resolve` given a promise). A single-layer `T extends Promise<infer V> ? V : T` would leave residual `Promise<...>` wrapping in nested cases; `Awaited`'s recursive definition calls itself on the inferred value so it fully flattens, matching runtime semantics exactly.
