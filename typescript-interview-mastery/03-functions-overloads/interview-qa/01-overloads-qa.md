# Interview Q&A: Function Overloads

**Q: How does TypeScript decide which overload signature a given call matches?**
A: It checks overload signatures in the order they're written, top to bottom, and uses the first one whose parameter types the call site's arguments satisfy. This means more specific overloads must be declared before more general ones — if a general overload (e.g. accepting `string | number`) is listed first, it will match calls that a more specific overload below it (e.g. accepting just `string`) was meant to catch, and the specific overload becomes unreachable.

**Q: Is the implementation signature (the one with a function body) part of the callable overload set?**
A: No. The implementation signature exists purely so the function's body typechecks against every case the declared overloads promise to handle — it is invisible to callers. You can only call the function with argument combinations that match one of the declared overload signatures above it, even if the implementation signature's own parameter types would technically be broad enough to accept some other combination.

**Q: When would you use overloads instead of a single function with a union parameter type?**
A: When the function's *return type* (or the valid shape of a later parameter) depends on which specific literal type or shape an earlier argument had — something a plain union parameter can't express, since a union-typed parameter forces every caller to deal with the union of all possible outputs regardless of what they actually passed in. If the input/output relationship is uniform across all valid inputs (e.g. `identity<T>(x: T): T`), a generic is simpler and preferred over overloads.

**Q: What's a downside of overloads compared to a well-designed generic function?**
A: Overloads require manually keeping every signature and the implementation signature in sync as the function evolves — adding a new call shape means writing a new overload signature and updating the implementation to actually handle it, with no compiler assistance ensuring you didn't forget a case. A generic function with a single signature scales more gracefully and is easier to maintain, so overloads are best reserved for a small, stable number of genuinely distinct call shapes (typically 2-4), not as a default tool for polymorphic functions.
