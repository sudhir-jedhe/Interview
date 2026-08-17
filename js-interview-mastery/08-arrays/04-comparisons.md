# Comparisons: Arrays

## Mutating vs non-mutating methods

| Aspect | Mutating (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`) | Non-mutating (`map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`) |
|---|---|---|
| Original array | Changed in place | Left untouched |
| Return value | Often not the array itself (length, removed items) — except `sort`/`reverse` which return the mutated array | Always a new array |
| Safe with shared/state-managed data (React, Redux) | No — causes missed re-renders / stale references | Yes — designed for immutable update patterns |

Use non-mutating methods by default in any codebase with shared references or state management, and reserve mutating methods for clearly-owned local arrays where in-place efficiency matters. The most common mistake is calling `.sort()` or `.reverse()` directly on a prop/state array, not realizing it mutates the original even though it also "conveniently" returns something you can assign.

## map vs forEach vs reduce

| Aspect | `map` | `forEach` | `reduce` |
|---|---|---|---|
| Return value | New array, same length | `undefined` | Any accumulated value |
| Typical use | Transform each element 1:1 | Side effects (logging, DOM updates) | Fold to a single value (sum, object, grouped data) |
| Chainable | Yes | No (returns `undefined`) | Depends on what it returns |

Use `map` when you want a same-length transformed array, `forEach` when you're just iterating for side effects and don't need a return value, and `reduce` when the desired output isn't naturally one-per-input (totals, grouping, deduplication). The common mistake is using `forEach` and expecting to capture a transformed array from its return value — it's always `undefined`.

## find/findIndex vs some/every

| Aspect | `find` / `findIndex` | `some` / `every` |
|---|---|---|
| Return type | Element / index (or `undefined` / `-1`) | Boolean |
| Use case | You need the matching item itself | You only need to know if a condition holds |
| Short-circuits | Yes | Yes |

Use `find`/`findIndex` when you need the actual matching data; use `some`/`every` when you only need a yes/no answer, since returning a boolean is cheaper to reason about and avoids accidentally treating a found object as truthy/falsy logic (an object is always truthy, so misusing `find` in an `if` works but is less explicit than `some`).

## flat vs flatMap

| Aspect | `flat(depth)` | `flatMap(fn)` |
|---|---|---|
| Purpose | Flatten an already-nested array | Map then flatten one level, in one pass |
| Depth control | Any depth, including `Infinity` | Always exactly depth `1` |
| Performance | One pass over existing structure | Single pass instead of `.map().flat()` (two passes) |

Use `flat` when you already have nested data and just need to unwrap it. Use `flatMap` when your mapping function itself produces arrays (e.g., splitting one input into multiple outputs) — it's more efficient and more idiomatic than chaining `.map(...).flat()`. The common mistake is reaching for `flatMap` when you need more than one level of flattening — it can't go deeper than 1, you'd need `.map(fn).flat(depth)` instead.
