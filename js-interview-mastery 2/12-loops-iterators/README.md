# Loops & Iterators

JavaScript gives you several loop constructs — `for`, `for-in`, `for-of`, `while`, and `do-while` — each suited to a different kind of iteration, and mixing them up is a classic source of subtle bugs (especially `for-in` on arrays). Underneath `for-of` lies the **iterable protocol**: any object that implements `Symbol.iterator` can be looped over, and understanding this protocol is what lets you build your own custom iterables and understand why generators work as iterators for free. This topic also covers loop control flow (`break`, `continue`, labeled loops) and gives a light introduction to generators (`function*`, `yield`) as the easiest way to hand-write an iterator without manually implementing `next()` yourself.

## Structure

- **`theory/`** — concept notes: classic loops (`for`/`while`/`do-while`), `for-in` vs `for-of`, `break`/`continue`/labels, the iterable protocol, and generators.
- **`snippets/`** — short runnable examples, one file each.
- **`output-based/`** — "what does this log?" questions with answers and explanations, one file each.
- **`scenarios/`** — realistic problems (a custom `Paginator` iterable, choosing a retry-loop construct, looping a `NodeList` safely, a lazy `take` utility) with a full approach and edge cases, one file each.
- **`interview-qa/`** — grouped Q&A: `for-in` vs `for-of`, iterators & generators, loop control flow.
- **`problems/`** — hands-on "implement X from scratch" challenges with full, tested solutions: a custom iterable `range(start, end)` object, a lazy generator-based `take(iterable, n)`, and a manual reimplementation of what `for...of` desugars to via the iterator protocol.
- **`from-your-notes/`** — your original standalone notes, left untouched.
- **`assets/`** — placeholder for images/PDFs from your original notes.

## What's covered
- `for`, `while`, `do-while` — classic imperative loops
- `for-in` — enumerates keys (including inherited enumerable ones) — a common bug source
- `for-of` — iterates values via the iterator protocol
- `break`/`continue` and labeled loops
- The iterable protocol (`Symbol.iterator`) — what makes something iterable
- Writing a custom iterable object by hand
- Generators (`function*`, `yield`) as a shortcut for building iterators

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
