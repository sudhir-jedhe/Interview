# Interview Questions: Loops & Iterators

**Q: What's the difference between `for-in` and `for-of`?**
`for-in` enumerates the **enumerable property keys** of an object, walking up the prototype chain to include inherited enumerable keys, and yields strings. `for-of` iterates the **values** produced by an object's iterator (per `Symbol.iterator`), and only works on iterables — plain objects aren't iterable by default, so `for-of` throws on them, while `for-in` works fine on any object.

**Q: Why is `for-in` discouraged for iterating arrays?**
Because it enumerates *keys* (as strings, not numbers) and includes any enumerable properties added to the array or to `Array.prototype`, not just the numeric indices — order isn't formally guaranteed for non-integer keys either. `for-of`, `.forEach`, or a plain `for (let i = 0; ...)` loop are the correct tools for arrays since they only touch actual element values/indices.

**Q: What makes an object "iterable" in JavaScript?**
It implements a method at the well-known symbol key `Symbol.iterator` that returns an **iterator object** — an object with a `next()` method returning `{ value, done }`. Any construct that consumes iterables (`for-of`, spread, destructuring, `Array.from`, `Promise.all`) works automatically once this protocol is implemented.

**Q: What is the difference between an iterable and an iterator?**
An iterable is an object with a `[Symbol.iterator]()` method that *produces* an iterator when called. An iterator is the object actually returned — it has a `next()` method that you call repeatedly to walk through values. Arrays are iterable (calling `arr[Symbol.iterator]()` gives you a fresh iterator), but the iterator itself is a separate, stateful object tracking position.

**Q: How do generator functions relate to iterators?**
Calling a generator function (`function* gen() {}`) doesn't execute its body — it returns a generator object that conforms to both the iterator protocol (`next()`) and the iterable protocol (it has its own `Symbol.iterator` that returns itself). Each `yield` pauses execution and produces one `{ value, done: false }` result; calling `next()` again resumes execution right after that `yield`.

**Q: What's the difference between `break` and `continue`?**
`break` immediately terminates the nearest enclosing loop (or `switch`), and execution continues after the loop. `continue` skips the rest of the current iteration's body and jumps straight to the next iteration's condition check (or update expression, in a `for` loop) — the loop itself keeps running.

**Q: When would you use a labeled loop?**
When you need `break` or `continue` to affect an *outer* loop from within a nested loop — unlabeled `break`/`continue` only ever targets the innermost enclosing loop. A label (`outer: for (...) { for (...) { break outer; } }`) lets you name the outer loop and target it explicitly, avoiding a manual flag-variable workaround.

**Q: Why does `for (var i ...) { setTimeout(() => console.log(i)) }` log the final value repeatedly, but `let` fixes it?**
`var` is function-scoped, so there's only one `i` shared by every closure created inside the loop body; by the time the deferred callbacks run, the loop has finished and `i` holds its final value. `let` creates a fresh binding of `i` for *each* loop iteration, so each closure captures its own distinct snapshot of `i` at that iteration.

**Q: Can you `for-of` over a plain object like `{ a: 1, b: 2 }`?**
Not directly — plain objects don't implement `Symbol.iterator`. You need to convert it first via `Object.keys(obj)`, `Object.values(obj)`, or `Object.entries(obj)` (all of which return arrays, which *are* iterable), then `for-of` over that.

**Q: What's the difference between `Array.prototype.forEach` and `for-of` for looping arrays?**
`forEach` is a higher-order function that takes a callback and has no way to `break` or `continue` early (though `return` inside the callback just skips to the next callback invocation, mimicking `continue`) — you'd need to throw or use `.some()`/`.every()` as a workaround to exit early. `for-of` is a genuine loop statement, so `break` and `continue` (including labeled versions) work naturally.

**Q: How would you write your own custom iterable class from scratch?**
Implement `[Symbol.iterator]()` on the class (or its prototype) returning an object with a `next()` method that returns `{ value, done }`. The easiest way in practice is to make `[Symbol.iterator]` itself a generator method (`*[Symbol.iterator]() { yield ...; }`), letting the engine handle the `next()`/`done` bookkeeping for you instead of hand-writing it.
