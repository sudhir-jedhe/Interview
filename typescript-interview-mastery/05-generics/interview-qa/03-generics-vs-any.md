# Generics vs any vs unknown

**Q: Why is `function wrap<T>(x: T): T[]` better than `function wrap(x: any): any[]`?**
A: The generic version preserves a link between the input type and the output type — pass a `number`, get back `number[]`; pass a `User`, get back `User[]`, all checked by the compiler at every call site. The `any` version accepts anything and returns something the compiler will let you treat as anything, including calling nonexistent methods or passing the result somewhere that expects a completely different shape, with no error until it fails at runtime.

**Q: Is `unknown` a drop-in replacement for a generic type parameter?**
A: No. `unknown` is safer than `any` because it forces narrowing before use, but a function like `(x: unknown) => unknown` still throws away the *relationship* between what went in and what came out — every caller has to re-narrow the return value independently. A generic `(x: T) => T` keeps that relationship intact automatically; the caller already knows the exact return type without narrowing anything.

**Q: If generics are erased at runtime just like type annotations, what's actually different about how the compiler treats `any` versus a type parameter `T`?**
A: `any` explicitly disables type checking for that value — every operation on it is accepted, no matter how nonsensical, and that "no type checking" status spreads to anything derived from it. `T`, in contrast, is checked normally; the compiler just doesn't know the concrete type yet at the point where the generic function is defined, and resolves it per call site using inference or explicit type arguments. Both vanish from the compiled JavaScript, but only `any` actually suppresses errors along the way — `T` is fully type-checked, just parametrically.

**Q: Give a concrete example where using `any` instead of a generic causes a real bug to slip through.**
A: `function firstOf(arr: any) { return arr[0]; }` called with `firstOf([1,2,3]).toUpperCase()` compiles cleanly and crashes at runtime with "toUpperCase is not a function." The generic version, `function firstOf<T>(arr: T[]): T | undefined`, infers `T = number` from the array and rejects `.toUpperCase()` on the result at compile time, catching the bug before the code ever runs.
