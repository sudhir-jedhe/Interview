# Interview Questions: Destructuring, Spread & Rest

**Q: What's the difference between spread and rest syntax if they look identical?**
Both use `...`, but the direction of data flow differs based on position. Spread appears where a value is being *produced* — inside an array/object literal or a function call — and it expands an iterable/object into individual elements. Rest appears where a value is being *consumed* or *bound* — in a function's parameter list or on the left side of a destructuring assignment — and it collects multiple remaining values into a single array or object.

**Q: When do default values apply during destructuring?**
Only when the extracted value is strictly `undefined` — never for `null`, `0`, `''`, or `false`. This is a deliberate design choice: `undefined` means "nothing was provided here," while `null` is treated as an intentional value. `const { a = 1 } = { a: null }` yields `a === null`, not `1`.

**Q: Does object spread `{ ...obj }` produce a deep or shallow copy?**
Shallow. It copies the object's own enumerable properties one level deep — primitive values are copied by value, but any property whose value is itself an object or array is copied by reference, so mutating a nested structure on the copy also mutates it on the original. A true deep copy requires `structuredClone`, a recursive utility, or a library like lodash's `cloneDeep`.

**Q: Can you destructure `null` or `undefined`?**
No — attempting to destructure `null` or `undefined` throws a `TypeError`, because destructuring internally tries to read properties off the value, and you can't read properties off `null`/`undefined`. This is why function parameters that destructure an options object usually need a `= {}` fallback: `function f({ x } = {}) {}`.

**Q: What's the practical benefit of rest parameters over the old `arguments` object?**
Rest parameters produce a genuine `Array` instance, so you get `.map`, `.filter`, `.reduce`, etc. directly without converting it first. `arguments` is only array-*like* (has `length` and indices but no array methods), and it isn't available at all inside arrow functions — arrow functions lexically inherit `arguments` from their enclosing non-arrow scope, which is rarely what you want.

**Q: How would you skip elements when destructuring an array?**
Leave the slot empty between commas: `const [, second, , fourth] = arr;`. There's no equivalent shorthand for objects because object destructuring already only pulls the keys you explicitly name — skipping is simply "don't mention that key."

**Q: What happens if you spread an object with getter properties?**
The getter is invoked once at spread time, and the *resulting value* is copied as a plain data property onto the new object — the getter itself is not carried over. So `{ ...objWithGetter }` gives you a snapshot value, not a live-computed property.

**Q: Can rest parameters be used anywhere in a parameter list?**
No — a rest parameter must be the last parameter in the list, and there can be only one. `function f(...args, last)` is a `SyntaxError`. This mirrors object rest destructuring, where `...rest` must also come last in the pattern.

**Q: How do you merge two arrays while removing duplicates, using spread?**
Combine spread with `Set`: `[...new Set([...arr1, ...arr2])]`. The two arrays are concatenated via spread into a single array, `Set` deduplicates by value equality (using SameValueZero), and spreading the `Set` back into an array literal converts it back to a plain array.

**Q: What's the difference between `[a, b] = [b, a]` swap syntax and using a temporary variable?**
Functionally they produce the same result, but the destructuring swap avoids declaring an extra temp variable and reads as a single atomic intent ("swap these two"). Internally, the right-hand side array literal `[b, a]` is fully evaluated first (capturing both original values), and only then are `a` and `b` reassigned from it — so there's no risk of one assignment clobbering a value the other still needs.

**Q: If you destructure a property that doesn't exist on an object, does it throw?**
No — it simply yields `undefined` for that binding (or the default value, if one is provided). Destructuring never throws for a *missing key*; it only throws if you try to destructure `null`/`undefined` itself, or if you try to destructure a nested path where an intermediate value is `null`/`undefined` (e.g., `{ a: { b } } = { a: null }` throws because you can't read `b` off `null`).
