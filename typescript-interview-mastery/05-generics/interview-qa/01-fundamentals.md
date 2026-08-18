# Generics fundamentals

**Q: What problem do generics solve that function overloading doesn't?**
A: Overloading requires you to enumerate every combination of input/output types you want to support ahead of time — three overloads for `string`, `number`, `boolean` inputs, say. Generics express the relationship once, for *any* type, and let the compiler substitute the actual type per call site. Overloading also can't express "the return type equals whatever type was passed in" for an open-ended set of types; generics do that trivially with `<T>(x: T): T`.

**Q: What does it mean that generic type parameters are "erased" at runtime?**
A: TypeScript's type system exists only at compile time — after the code is compiled to JavaScript, all type annotations, including `<T>`, are stripped out entirely. There is no `T` you can inspect with `typeof` or `instanceof` at runtime; a function compiled from `function identity<T>(x: T): T` is byte-for-byte the same JS whether it was called with a `string` or a `number`. This is why you can't write `new T()` inside a generic function or class — `T` doesn't exist as a value at runtime, only as type-checking metadata.

**Q: Can a generic type parameter have a default value, and where must it appear in the parameter list?**
A: Yes, with `<T = DefaultType>` syntax, similar to default function parameters. Defaulted type parameters must come after all non-defaulted ones in the same declaration, mirroring the rule that required function parameters can't follow optional ones — the compiler resolves type arguments positionally, left to right.

**Q: Why does `function firstElement<T>(arr: T[]): T { return arr[0]; }` type-check even though `arr` might be empty?**
A: Because indexing an array with a numeric index always returns `T`, not `T | undefined`, under default TypeScript settings — array element access isn't automatically checked against the array's actual length. Enabling `noUncheckedIndexedAccess` in `tsconfig.json` changes this and makes `arr[0]` return `T | undefined` instead, which is the more honest type for exactly this reason.
