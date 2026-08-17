# Comparisons — State & `useState`

### Direct value update vs. functional update

| Aspect | `setCount(count + 1)` | `setCount(prev => prev + 1)` |
|---|---|---|
| Reads from | The value captured in the current render's closure | The latest pending state, guaranteed up to date |
| Safe for multiple calls in one handler | No — repeated calls all use the same stale value | Yes — each call correctly builds on the last |
| Safe inside `setTimeout`/async callbacks | No — closure value can be very stale by the time it runs | Yes — always operates on current state at update time |

Default to the functional form whenever the new state depends on the previous state; use the direct form only when the new value is fully independent of prior state (e.g. `setStatus('submitted')`). The common mistake is calling the setter multiple times per handler using the direct form and expecting each call to "stack."

### Mutating state vs. creating a new reference

| Aspect | Mutating in place (`items.push(x); setItems(items)`) | Creating a new reference (`setItems(prev => [...prev, x])`) |
|---|---|---|
| Triggers re-render | Not reliably — same reference may be skipped by `Object.is` check | Always — new reference is always detected as a change |
| Works with `React.memo`/`useMemo` elsewhere | Breaks reference-equality-based optimizations | Plays correctly with reference-equality checks |
| Debuggability | Hard to trace — DevTools history/undo can't diff mutated state | Easy — each state snapshot is a distinct, comparable object |

Always create new arrays/objects for state updates — spread syntax, `.map()`/`.filter()` (which return new arrays), or object spread. The common mistake is reaching for familiar mutating array methods (`push`, `splice`, `sort`, `reverse`) directly on state.

### Lazy initial state vs. eager initial state

| Aspect | `useState(expensiveFn())` | `useState(() => expensiveFn())` |
|---|---|---|
| When the function runs | Every render (JS evaluates the argument before the call) | Only once, on the component's first mount |
| Appropriate for | Cheap, trivial initial values (`useState(0)`, `useState('')`) | Expensive computation (parsing, heavy loops, reading localStorage) |

Use the lazy form any time computing the initial value costs more than a property access or literal. The common mistake is using the eager form for something like `JSON.parse(localStorage.getItem(...))`, silently re-parsing on every render for no benefit.

### Local `useState` vs. lifting state up to a shared parent

| Aspect | State kept local in each component | State lifted to common ancestor |
|---|---|---|
| Sharing across siblings | Not possible — each instance has its own isolated copy | Both siblings read/write the same source of truth via props |
| Re-render scope | Only that component re-renders on change | Parent and all children receiving that state as a prop re-render |
| Complexity | Simple, no prop threading needed | Requires passing value + updater callback down as props |

Keep state local when only one component needs it; lift it up as soon as a sibling or ancestor needs to read or react to the same value. The common mistake is prematurely lifting all state to the top of the app "just in case," causing unnecessary re-renders of unrelated components — lift only as far up the tree as is actually needed.
