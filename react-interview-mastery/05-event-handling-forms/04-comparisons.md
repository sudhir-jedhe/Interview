# Comparisons — Event Handling & Forms

### Controlled vs. uncontrolled inputs

| Aspect | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | The DOM itself; React reads it on demand via `ref` |
| Validation / conditional UI | Trivial — state is always current, can disable/validate on every keystroke | Requires reading the DOM value explicitly when needed |
| Boilerplate | More — needs state + handler per field | Less — no state wiring needed for simple cases |

Use controlled inputs as the default for most application forms, especially anything needing live validation, formatting, or derived UI. Use uncontrolled for simple one-off forms, integrating third-party non-React widgets, or `<input type="file">` (which can't be controlled by React at all). The common mistake is mixing the two on the same input — passing both `value` and `defaultValue`, or passing `value` without `onChange` — which produces a "changing an uncontrolled input to controlled" warning or a frozen field.

### `onClick` handler with `preventDefault` vs. `onSubmit` on the `<form>`

| Aspect | `preventDefault()` in a button's `onClick` | `preventDefault()` in the form's `onSubmit` |
|---|---|---|
| Covers Enter-key submission | No — only cancels that specific click's default action | Yes — fires regardless of whether submission was triggered by click or Enter key |
| Correctness for accessible forms | Incomplete | Correct — matches how forms are meant to be submitted |

Always attach submission logic to the form's `onSubmit`, not a button's `onClick`, so both mouse and keyboard (Enter) submission paths are handled uniformly. The common mistake is only wiring `onClick` on a "Submit" button, which silently breaks Enter-to-submit — an accessibility and UX regression that's easy to miss in manual testing if you always click.

### Debouncing vs. throttling input handlers

| Aspect | Debounce | Throttle |
|---|---|---|
| Behavior | Waits for a pause in activity, then fires once | Fires at most once per fixed interval, regardless of activity |
| Best for | Search-as-you-type, autosave — where only the "final" value matters | Scroll/resize handlers — where you want steady periodic updates during continuous activity |
| Typical implementation in React | `useEffect` + `setTimeout`, cleanup clears the pending timeout | `useRef` to track last-fired timestamp, or a dedicated utility |

Use debounce when you only care about the value once the user stops interacting (e.g., don't fire a search API call after every keystroke). Use throttle when you need to keep responding periodically throughout continuous activity (e.g., updating a progress indicator during scroll). The common mistake is debouncing a scroll handler, which causes visible lag versus the desired continuous feedback that throttling provides.

### React's `stopPropagation()` vs. native DOM `stopPropagation()` interaction

| Aspect | `stopPropagation()` on a React SyntheticEvent | Native `addEventListener` handler on a real DOM ancestor |
|---|---|---|
| What it stops | Further React-registered handlers up the component tree | Nothing on its own — native bubbling happens independent of React's delegated dispatch |
| Interaction | Calling it in a React handler does NOT stop a native listener attached directly via `addEventListener` from also firing | Unaffected by React's synthetic stopPropagation |

Be aware of this when integrating third-party libraries that attach native listeners (e.g., a "click outside to close" library listening on `document`), since a React child's `stopPropagation()` won't shield your component from them. The common mistake is assuming `stopPropagation()` inside a React handler provides the same guarantee as it would in an all-native-DOM codebase, then being surprised when an unrelated native listener still fires.
