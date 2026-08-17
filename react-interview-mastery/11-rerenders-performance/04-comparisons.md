# Comparisons

### `React.memo` vs `useMemo` vs `useCallback`

| Aspect | `React.memo` | `useMemo` / `useCallback` |
|---|---|---|
| What it does | Wraps a *component*, skips re-render if props are shallowly equal | Wraps a *value/function*, keeps the same reference across renders unless dependencies change |
| Where it's used | Around the component definition/export | Inside the parent that passes props down |
| Common mistake | Wrapping a component in `memo` but the parent still passes new object/array/function literals as props, so it never actually skips | Adding dependencies that change every render (e.g. an inline object) which defeats the memoization entirely |

Use `memo` on leaf/list-row components that render often with the same props; pair it with `useMemo`/`useCallback` on the parent to actually stabilize those props. Neither is useful alone if the other side isn't stable.

### Re-render vs DOM update (commit)

| Aspect | Re-render | DOM update (commit) |
|---|---|---|
| What happens | Component function re-executes, produces new React elements | React diffs new/old element trees and applies the minimal set of real DOM mutations |
| Cost | Usually cheap (JS function call + diffing) | More expensive; layout/paint work on actual DOM nodes |
| Common mistake | Assuming "re-render" means "the DOM changed" and therefore optimizing renders that produce identical output | Not realizing that avoiding a re-render (via `memo`) is what actually skips the diff — the diff itself is usually not the bottleneck for small trees |

Optimize DOM churn (e.g., virtualization) when the tree is large or updates are frequent and visible in profiling; don't reflexively optimize re-renders that never touch the DOM.

### Array index keys vs stable ID keys

| Aspect | Index as key | Stable unique ID as key |
|---|---|---|
| Behavior on reorder/insert/delete | React misattributes identity — items shift and get the wrong internal state/DOM node | React correctly tracks each item, moving/removing/inserting the right DOM node |
| When it's "safe" | List is static, never reordered/filtered/sorted, no per-item state | Any list that can change order or membership |
| Common mistake | Using `index` "just to silence the key warning" on a dynamic, filterable, or sortable list | None generally — but reusing a non-unique field (e.g. `label`) as key causes the same class of bug |

Use a stable ID from your data (`item.id`) whenever the list can reorder or its membership can change; index keys are only acceptable for genuinely static, append-only-at-the-end lists.

### Full list render vs virtualized list

| Aspect | Rendering all items | Virtualized (`react-window`) |
|---|---|---|
| DOM nodes | One per item, grows linearly with data | Roughly constant — only visible rows + buffer |
| Complexity | Simple, works with normal CSS layout (e.g., variable height flows naturally) | Requires fixed/estimated row heights, more setup, harder to combine with some CSS (e.g., `:nth-child`) |
| Common mistake | Rendering thousands of rows "because it works in dev" and only discovering jank on real/large datasets | Reaching for virtualization on small lists (<100 items) where it adds complexity for no measurable benefit |

Use plain rendering by default; switch to virtualization only once profiling shows the DOM node count itself (not JS logic) is the bottleneck, typically in the hundreds-to-thousands-of-rows range.
