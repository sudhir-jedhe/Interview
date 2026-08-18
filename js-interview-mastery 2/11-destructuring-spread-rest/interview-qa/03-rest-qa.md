# Interview Q&A: Rest

**Q: What's the difference between spread and rest syntax if they look identical?**
Both use `...`, but the direction of data flow differs based on position. Spread appears where a value is being *produced* — inside an array/object literal or a function call — and it expands an iterable/object into individual elements. Rest appears where a value is being *consumed* or *bound* — in a function's parameter list or on the left side of a destructuring assignment — and it collects multiple remaining values into a single array or object.

**Q: What's the practical benefit of rest parameters over the old `arguments` object?**
Rest parameters produce a genuine `Array` instance, so you get `.map`, `.filter`, `.reduce`, etc. directly without converting it first. `arguments` is only array-*like* (has `length` and indices but no array methods), and it isn't available at all inside arrow functions — arrow functions lexically inherit `arguments` from their enclosing non-arrow scope, which is rarely what you want.

**Q: Can rest parameters be used anywhere in a parameter list?**
No — a rest parameter must be the last parameter in the list, and there can be only one. `function f(...args, last)` is a `SyntaxError`. This mirrors object rest destructuring, where `...rest` must also come last in the pattern.

**Q: What's the difference between `[a, b] = [b, a]` swap syntax and using a temporary variable?**
Functionally they produce the same result, but the destructuring swap avoids declaring an extra temp variable and reads as a single atomic intent ("swap these two"). Internally, the right-hand side array literal `[b, a]` is fully evaluated first (capturing both original values), and only then are `a` and `b` reassigned from it — so there's no risk of one assignment clobbering a value the other still needs.
