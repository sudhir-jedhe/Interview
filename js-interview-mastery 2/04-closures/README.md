# Closures

A closure is a function bundled together with references to its surrounding (lexical) environment — it lets a function keep accessing variables from an outer scope even after that outer function has finished running. Closures are the mechanism behind private state, counters/factories, memoization, currying, and the module pattern, and they underpin most idiomatic JS state-management code, including the classic `for (var i...)` loop bug you've likely already met in the scope/hoisting topic. This is one of the most heavily tested interview topics because it requires connecting several ideas at once — scope, execution context, and garbage collection — into a single coherent mental model, and it's also directly useful in day-to-day code for encapsulating state without classes.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — concept-by-concept notes: closure definition & variable lifetime, private state & the module pattern, memoization, currying, the classic loop bug (via closures), and closures vs globals/memory implications.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 8 "predict the output" questions covering live references, shared vs independent closures, and hidden state, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (a closure-based rate limiter, per-item dynamic event handlers, a stateful pipeline builder, a stale memoization cache bug), each with a worked approach.
- **`interview-qa/`** — 12 Q&A pairs grouped into 3 themed files: closure fundamentals, the loop bug/memory, and practical patterns.
- **`problems/`** — 3 hands-on coding challenges: a `once(fn)` utility, a `memoize(fn)` utility, and a private counter factory with increment/decrement/reset.
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- Precise definition of a closure (function + its lexical environment)
- How closures retain access to outer variables after the outer function returns
- Practical uses: private variables, counters/factories, memoization, currying, the module pattern
- Event handler state via closures
- The classic `for (var i=0...)` closure bug in loops and both fixes (`let`, or IIFE)
- Memory implications of closures (brief teaser — full topic covered elsewhere)
- Hands-on: a run-once utility, a general-purpose memoizer, and a fully private counter factory
