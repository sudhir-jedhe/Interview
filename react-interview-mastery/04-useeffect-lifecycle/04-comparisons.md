# Comparisons — `useEffect` & Lifecycle

### No dependency array vs. empty array vs. array with values

| Aspect | `useEffect(fn)` | `useEffect(fn, [])` | `useEffect(fn, [a, b])` |
|---|---|---|---|
| Runs | After every render | Once, after initial mount only | After mount, then again whenever `a` or `b` changes |
| Typical use case | Rare — usually a sign of a missing dep array | One-time setup with no reactive dependencies | Synchronizing with specific reactive values |
| Risk | Easy to cause performance issues / loops if it also sets state | Stale closures if it references props/state not in the (empty) deps | Correct, as long as the array is exhaustive |

Reach for the array-with-values form as the default; use `[]` only when the effect genuinely reads no reactive values (or only refs, which don't need to be listed). The common mistake is using `[]` to "run once" while still referencing props/state inside, silently freezing those values via a stale closure.

### `useEffect` vs. `useLayoutEffect`

| Aspect | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Timing | After the browser paints | Synchronously after DOM mutations, before paint |
| Blocks visual update | No | Yes — delays paint until it finishes |
| Typical use case | Data fetching, subscriptions, logging, most side effects | DOM measurement + synchronous adjustment (positioning, scroll, avoiding flicker) |

Default to `useEffect` for nearly everything; reach for `useLayoutEffect` specifically when skipping it would cause a visible flash of incorrect layout (e.g., measuring an element's size and repositioning something based on it). The common mistake is using `useLayoutEffect` by default "to be safe," which unnecessarily blocks painting and can hurt perceived performance.

### Effects vs. event handlers for triggering side effects

| Aspect | Side effect in `useEffect` | Side effect directly in an event handler |
|---|---|---|
| Trigger | Runs in response to a *render* (declaratively tied to changed values) | Runs in direct response to a *user action* |
| Best for | Syncing with external systems based on current props/state (subscriptions, fetches keyed on an id) | One-off actions caused by a specific interaction (submit a form, log an analytics click) |
| Common mistake | Putting user-action-triggered logic in an effect keyed on a flag toggled by the handler — indirect and hard to trace | Missing cases where the value also needs to update on non-interactive causes (e.g., prop changing externally) |

Put logic in an event handler when it's fundamentally "this specific click/submit should do X"; put it in an effect when it's "this component's state should always reflect Y based on current props/state," including via routes other than that one handler. The common mistake is using an effect to react to a state flag that only your own handler ever sets — that's just a more roundabout way of writing an event handler and adds an extra render cycle.

### Missing dependency vs. exhaustive dependency array

| Aspect | Missing a dependency the effect reads | Exhaustive dependency array (all reactive values listed) |
|---|---|---|
| Correctness | Silently stale — effect keeps using old captured value | Correct — effect always re-runs with fresh values when needed |
| Lint support | Flagged by `react-hooks/exhaustive-deps` (should not be disabled without a very good reason) | Passes lint cleanly |
| Common fallout | Bugs that only appear intermittently, hard to reproduce (classic stale closure) | Sometimes over-triggers the effect if a dependency changes reference every render (needs `useMemo`/`useCallback` or restructuring) |

Keep the dependency array exhaustive by default and solve "it re-runs too often" by stabilizing the *values* (memoizing objects/functions, depending on primitives instead of whole objects), not by removing them from the array. The common mistake is disabling the lint rule and manually curating deps to control timing, which reintroduces stale closures the rule exists to prevent.
