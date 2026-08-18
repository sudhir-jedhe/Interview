# Type guards, discriminated unions, and exhaustiveness

**Q: What is a type predicate, and how does `function isFoo(x: unknown): x is Foo` differ from `function isFoo(x: unknown): boolean`?**
A: A type predicate (`x is Foo`) is special return-type syntax that tells the compiler "if this function returns `true`, narrow the argument to `Foo` in the calling code." A plain `boolean` return gives the caller a runtime answer but no compile-time narrowing — code after an `if (isFoo(x))` check would still see `x`'s original, wider type unless the predicate form is used.

**Q: Does TypeScript verify that a type guard's implementation actually matches its declared predicate?**
A: No. The compiler trusts the predicate at face value; it never inspects the function body to confirm the check is logically sound. A type guard whose implementation is too loose (or simply wrong) will still narrow the variable as claimed, and any resulting mismatch between the narrowed type and the actual runtime value surfaces only later, potentially as a runtime crash rather than a compile error.

**Q: What makes a union "discriminated," and why does the discriminant need to be a literal type?**
A: A discriminated union is a union of object types sharing one common property (the discriminant) where each member gives that property a distinct literal type — e.g., `status: "loading"` vs `status: "success"`. The discriminant must be a specific literal, not a general type like `string`, because narrowing works by comparing the discriminant's value against each member's literal; if the field were typed `string` in even one member, the compiler couldn't distinguish that member from the others by checking the discriminant's value alone.

**Q: What does `never` represent, and how does the `assertNever` pattern use it to catch missing switch cases?**
A: `never` is the type of a value that provably cannot occur. In a `switch` over every member of a discriminated union, if each `case` correctly handles one member, the variable's type inside `default` is narrowed to `never` — nothing is left. Passing that value to a function typed `(x: never) => never` compiles only when the narrowing genuinely reached `never`; if a new union member is added without a matching `case`, the `default` branch's narrowed type is no longer `never`, and the call to the `never`-typed parameter fails to compile, flagging the gap immediately.
