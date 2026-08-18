# Interview Q&A: Parameters (Optional, Default, Rest, this)

**Q: What's the type difference between an optional parameter (`x?: string`) and a default parameter (`x: string = "foo"`) inside the function body?**
A: An optional parameter's type inside the body is `T | undefined`, since the caller might genuinely omit it and no fallback value is provided — you must guard before using it as a plain `T`. A default parameter's type inside the body is plain `T`, because TypeScript knows that by the time the function body runs, the parameter has definitely been assigned a concrete value — either the caller's argument or the default expression — so no `undefined` case needs to be handled.

**Q: Can a required parameter follow an optional or default parameter in a declaration?**
A: No. TypeScript enforces a strict ordering: required parameters first, then optional (`?`) or default-valued parameters, then at most one rest parameter last. This is because arguments are matched positionally — allowing a required parameter after an optional one would make it ambiguous which call-site argument maps to which parameter whenever the optional one is omitted.

**Q: What does declaring a `this` parameter on a function actually do, and does it exist at runtime?**
A: It's a compile-time-only annotation (always the first parameter in the declaration) that tells TypeScript what type `this` is expected to be when the function is called, and the compiler checks call sites against it — including catching "detached" method calls where a method is passed around as a plain callback and loses its intended receiver. It produces no actual runtime parameter; it's fully erased from the emitted JavaScript and doesn't affect the function's `.length` or how arguments are passed.

**Q: Why can't arrow functions declare a `this` parameter?**
A: Arrow functions don't have their own `this` binding at all — they lexically capture `this` from the enclosing scope at the point they're defined, rather than having a dynamic receiver determined by how they're called. Since there's no call-time `this` to type-check against, TypeScript disallows the `this` parameter syntax on arrow functions entirely (`An arrow function cannot have a 'this' parameter`), and it's exactly this lexical-capture behavior that makes arrow functions the right choice for callbacks where you want `this` to remain whatever it already was in the surrounding scope (e.g. inside a class method).
