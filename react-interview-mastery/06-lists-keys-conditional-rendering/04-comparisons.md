# Comparisons: Lists, Keys & Conditional Rendering

### Index-as-key vs stable-id-as-key

| Aspect | Index as key | Stable ID as key |
|---|---|---|
| Correctness on reorder/filter/insert | Breaks — state/DOM gets attached to the wrong item | Correct — React tracks the item wherever it moves |
| Performance | Slightly cheaper to compute (no lookup needed) | Negligible cost difference in practice |
| When it's acceptable | Static list that never reorders and has no per-item state | Always safe; the default choice |

Use stable IDs (database id, UUID, or a unique field) by default. The most common mistake is reaching for `index` out of habit even when the list is filterable or sortable, then being confused when unrelated rows' local state (inputs, toggles) appears to "jump" between rows.

### `&&` vs ternary vs early return for conditional rendering

| Aspect | `condition && <X/>` | `condition ? <X/> : <Y/>` | Early `return` |
|---|---|---|---|
| Best for | Show-or-nothing, single branch | Two mutually exclusive branches | Whole-component gating (loading/error/empty states) |
| Falsy-value pitfall | Yes — `0`/`NaN` render literally | No pitfall (both branches explicit) | No pitfall |
| Readability at scale | Degrades with multiple conditions | Degrades with nested ternaries | Best readability for multi-state components |

Use `&&` for simple boolean-only conditions, ternaries for exactly two branches, and early returns when a component has 3+ distinct states. The most common mistake is chaining `&&` on a value that can be `0`, `NaN`, or `''` without coercing it to a boolean first.

### Unmount-based conditional rendering vs CSS-based hiding

| Aspect | `{show && <Component/>}` | `<div style={{display: show ? 'block' : 'none'}}><Component/></div>` |
|---|---|---|
| Component state | Reset every time it's hidden then shown again | Preserved — component stays mounted |
| Effects (`useEffect`) | Cleanup runs on hide, setup reruns on show | Do not re-run just from visibility toggling |
| Cost | Cheaper DOM (fewer nodes when hidden) | Keeps DOM nodes around, higher memory/DOM cost |

Use unmounting when you want a clean slate each time (forms that should reset, modals). Use CSS-based hiding when you need to preserve state or avoid expensive remounts (e.g., tab panels with scroll position or unsaved input). The most common mistake is unmounting a component (like a `Timer` or form) and being surprised its internal state didn't persist across a toggle.
