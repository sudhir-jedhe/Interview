# Interview Q&A: Iterators & Generators

**Q: What makes an object "iterable" in JavaScript?**
It implements a method at the well-known symbol key `Symbol.iterator` that returns an **iterator object** — an object with a `next()` method returning `{ value, done }`. Any construct that consumes iterables (`for-of`, spread, destructuring, `Array.from`, `Promise.all`) works automatically once this protocol is implemented.

**Q: What is the difference between an iterable and an iterator?**
An iterable is an object with a `[Symbol.iterator]()` method that *produces* an iterator when called. An iterator is the object actually returned — it has a `next()` method that you call repeatedly to walk through values. Arrays are iterable (calling `arr[Symbol.iterator]()` gives you a fresh iterator), but the iterator itself is a separate, stateful object tracking position.

**Q: How do generator functions relate to iterators?**
Calling a generator function (`function* gen() {}`) doesn't execute its body — it returns a generator object that conforms to both the iterator protocol (`next()`) and the iterable protocol (it has its own `Symbol.iterator` that returns itself). Each `yield` pauses execution and produces one `{ value, done: false }` result; calling `next()` again resumes execution right after that `yield`.

**Q: How would you write your own custom iterable class from scratch?**
Implement `[Symbol.iterator]()` on the class (or its prototype) returning an object with a `next()` method that returns `{ value, done }`. The easiest way in practice is to make `[Symbol.iterator]` itself a generator method (`*[Symbol.iterator]() { yield ...; }`), letting the engine handle the `next()`/`done` bookkeeping for you instead of hand-writing it.
