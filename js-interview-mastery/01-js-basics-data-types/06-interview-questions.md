# JS Basics & Data Types — Interview Q&A

**Q: What are the primitive types in JavaScript?**
There are seven: `string`, `number`, `boolean`, `null`, `undefined`, `symbol` (ES2015), and `bigint` (ES2020). All other values, including arrays and functions, are of type `object` under the hood. Primitives are immutable and compared/copied by value.

**Q: What's the difference between primitive and reference types in terms of memory?**
Primitives are stored directly wherever the variable lives (stack-like storage) and are copied by value on assignment. Reference types are stored in the heap, and the variable only holds a reference (pointer) to that memory location — so assigning one variable to another copies the pointer, and both variables end up referring to the same underlying object.

**Q: Why does `typeof null` return `'object'`?**
It's a bug from the original 1995 JS implementation, where values were represented internally with a type tag, and the tag for objects happened to be `0`. `null` was represented as the all-zero null pointer, so it was misclassified as an object. It can't be fixed now without breaking existing code across the web, so it remains part of the spec permanently.

**Q: How do you correctly check if a value is `null`?**
Use strict equality: `value === null`. Don't rely on `typeof value === 'object'`, since that's also true for arrays, dates, and other objects — and don't use `!value`, since that's also true for `0`, `''`, `false`, `NaN`, and `undefined`.

**Q: What's the difference between `null` and `undefined`?**
`undefined` is the engine's default for "no value yet" — an uninitialized variable, a missing function argument, or a nonexistent object property. `null` is an explicit, developer-assigned value meaning "intentionally empty." They're loosely equal (`null == undefined` is `true`) but not strictly equal (`null === undefined` is `false`), and have different `typeof` results (`'object'` vs `'undefined'`).

**Q: Why is `NaN !== NaN`?**
Per the IEEE-754 floating point spec that JS numbers follow, `NaN` is defined to compare unequal to every value, including itself — this lets `NaN` propagate visibly through calculations rather than silently matching other invalid results. It's a deliberate spec decision, not a JS-specific quirk.

**Q: How do you check whether a value is `NaN`?**
Use `Number.isNaN(value)`, which returns `true` only if the value is exactly the `NaN` value, with no coercion. Avoid the global `isNaN(value)`, which coerces its argument to a number first and can produce false positives (e.g. `isNaN('hello')` is `true`).

**Q: How would you check if a variable is an array?**
Use `Array.isArray(value)`. `typeof` returns `'object'` for arrays just like plain objects, so it can't distinguish them. `Array.isArray` is the spec-correct, reliable check, including across iframes/realms where `instanceof Array` can fail.

**Q: Are objects passed by reference or by value in JavaScript?**
Strictly speaking, JavaScript is always "pass by value" — but for objects, the value being passed is a reference (a pointer) to the object. So reassigning the parameter inside a function doesn't affect the caller's variable, but mutating a property on the object does, because both the caller and the function are pointing at the same underlying object.

**Q: What does `const` actually guarantee?**
`const` only prevents reassignment of the variable binding itself — `const x = 5; x = 6;` throws. It says nothing about the mutability of the value if it's an object or array: `const arr = []; arr.push(1);` is perfectly legal, because `arr` still points to the same array, you're just mutating its contents.

**Q: What's the difference between `Number.isNaN` and `isNaN`?**
`Number.isNaN` checks whether a value is literally `NaN`, with no type coercion. The global `isNaN` first coerces its argument via `Number()`, so any value that becomes `NaN` after coercion (like a non-numeric string) returns `true`, even though the original value was never `NaN`. `Number.isNaN` is almost always the correct choice.

**Q: What are template literals and what advantages do they have over string concatenation?**
Template literals use backticks and support `${expression}` interpolation and multi-line strings without escape characters. They're more readable than `+`-based concatenation, avoid subtle bugs from operator precedence when mixing types, and any valid expression (including function calls) can go inside `${}`.
