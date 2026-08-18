# Interview Q&A — `null`, `undefined`, and `typeof`

**Q: Why does `typeof null` return `'object'`?**
It's a bug from the original 1995 JS implementation, where values were represented internally with a type tag, and the tag for objects happened to be `0`. `null` was represented as the all-zero null pointer, so it was misclassified as an object. It can't be fixed now without breaking existing code across the web, so it remains part of the spec permanently.

**Q: How do you correctly check if a value is `null`?**
Use strict equality: `value === null`. Don't rely on `typeof value === 'object'`, since that's also true for arrays, dates, and other objects — and don't use `!value`, since that's also true for `0`, `''`, `false`, `NaN`, and `undefined`.

**Q: What's the difference between `null` and `undefined`?**
`undefined` is the engine's default for "no value yet" — an uninitialized variable, a missing function argument, or a nonexistent object property. `null` is an explicit, developer-assigned value meaning "intentionally empty." They're loosely equal (`null == undefined` is `true`) but not strictly equal (`null === undefined` is `false`), and have different `typeof` results (`'object'` vs `'undefined'`).

**Q: How would you check if a variable is an array?**
Use `Array.isArray(value)`. `typeof` returns `'object'` for arrays just like plain objects, so it can't distinguish them. `Array.isArray` is the spec-correct, reliable check, including across iframes/realms where `instanceof Array` can fail.
