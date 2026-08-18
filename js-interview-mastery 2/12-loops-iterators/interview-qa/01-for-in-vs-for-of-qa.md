# Interview Q&A: for-in vs for-of

**Q: What's the difference between `for-in` and `for-of`?**
`for-in` enumerates the **enumerable property keys** of an object, walking up the prototype chain to include inherited enumerable keys, and yields strings. `for-of` iterates the **values** produced by an object's iterator (per `Symbol.iterator`), and only works on iterables — plain objects aren't iterable by default, so `for-of` throws on them, while `for-in` works fine on any object.

**Q: Why is `for-in` discouraged for iterating arrays?**
Because it enumerates *keys* (as strings, not numbers) and includes any enumerable properties added to the array or to `Array.prototype`, not just the numeric indices — order isn't formally guaranteed for non-integer keys either. `for-of`, `.forEach`, or a plain `for (let i = 0; ...)` loop are the correct tools for arrays since they only touch actual element values/indices.

**Q: Can you `for-of` over a plain object like `{ a: 1, b: 2 }`?**
Not directly — plain objects don't implement `Symbol.iterator`. You need to convert it first via `Object.keys(obj)`, `Object.values(obj)`, or `Object.entries(obj)` (all of which return arrays, which *are* iterable), then `for-of` over that.
