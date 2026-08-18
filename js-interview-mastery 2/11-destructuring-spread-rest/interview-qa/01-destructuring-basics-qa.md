# Interview Q&A: Destructuring Basics

**Q: When do default values apply during destructuring?**
Only when the extracted value is strictly `undefined` — never for `null`, `0`, `''`, or `false`. This is a deliberate design choice: `undefined` means "nothing was provided here," while `null` is treated as an intentional value. `const { a = 1 } = { a: null }` yields `a === null`, not `1`.

**Q: Can you destructure `null` or `undefined`?**
No — attempting to destructure `null` or `undefined` throws a `TypeError`, because destructuring internally tries to read properties off the value, and you can't read properties off `null`/`undefined`. This is why function parameters that destructure an options object usually need a `= {}` fallback: `function f({ x } = {}) {}`.

**Q: How would you skip elements when destructuring an array?**
Leave the slot empty between commas: `const [, second, , fourth] = arr;`. There's no equivalent shorthand for objects because object destructuring already only pulls the keys you explicitly name — skipping is simply "don't mention that key."

**Q: If you destructure a property that doesn't exist on an object, does it throw?**
No — it simply yields `undefined` for that binding (or the default value, if one is provided). Destructuring never throws for a *missing key*; it only throws if you try to destructure `null`/`undefined` itself, or if you try to destructure a nested path where an intermediate value is `null`/`undefined` (e.g., `{ a: { b } } = { a: null }` throws because you can't read `b` off `null`).
