# Interview Q&A: Reselect and Memoization Mechanics

**Q1: Explain exactly how `createSelector`'s memoization works, step by step.**

A: `createSelector(inputSelectors, resultFn)` returns a new function. On each call, it first runs every input selector against the current arguments, producing an array of input values. It compares each of those against the corresponding value from the *previous* call using reference equality (`===`) by default. If every input is unchanged, it skips calling `resultFn` entirely and returns the previously cached result — the exact same reference as last time. If any input differs, it calls `resultFn` with the new inputs, caches both the new inputs and the new result (by default, a cache of size 1 — only the most recent call is remembered), and returns the new result.

**Q2: Why does `useSelector` care about a selector returning the same reference across calls?**

A: `useSelector`'s default change-detection is `===` comparison between the selector's return value on the current render and its return value on the previous render; if they differ, React-Redux triggers a re-render of that component. A non-memoized selector that derives a new array/object every call (e.g., via `.filter`) always produces a new reference, so `useSelector` always sees "changed" and always re-renders — even when the actual derived contents are identical to before. A memoized selector returning the *same* reference when nothing relevant changed lets `useSelector` correctly conclude "no meaningful change, skip re-rendering."

**Q3: What's the difference between an "input selector" and the "result function" in `createSelector`, and does it matter where you put logic?**

A: Input selectors are the first argument (an array, or several positional arguments) — simple functions of `state` (and any extra args) whose *outputs* are what memoization actually compares. The result function is the last argument — it receives the input selectors' outputs as its own arguments and does the real derivation work. It matters where logic lives because `createSelector` only skips re-running the *result function*; it always runs every input selector on every call, unconditionally. If you put expensive computation inside an "input selector" instead of the result function, you get zero benefit from memoization for that computation — it runs every time regardless.

**Q4: Someone claims wrapping every single selector in `createSelector` "for safety" is always a good idea. Do you agree?**

A: No. `createSelector` adds a small amount of bookkeeping overhead (running input selectors, comparing them) on every call, which is wasted if the selector doesn't actually create a new reference each time — a plain property read like `(state) => state.user.name` has nothing to memoize. Reserve `createSelector` for selectors whose result function does real derivation work that creates new references (filter/map/sort/aggregate) or is otherwise nontrivial to compute; for simple reads, a plain function is both simpler and marginally faster.
