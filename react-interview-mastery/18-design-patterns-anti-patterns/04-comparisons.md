# Comparisons: Design Patterns & Anti-Patterns

### Prop drilling vs Context vs Composition

| Aspect | Prop drilling | Context | Composition (children/render props) |
|---|---|---|---|
| Coupling | Every intermediate component must know about the prop | Intermediate components stay ignorant of the value | Intermediate components just render `children`, staying generic |
| Best for | 1-2 levels deep, simple values | Global-ish concerns (theme, auth, locale) needed by many distant descendants | Passing pre-built elements/slots down through a fixed layout structure |
| Common mistake | Drilling props 4+ levels through components that never use them | Overusing context for state that changes often, causing wide re-renders of every consumer | Reaching for context when plain composition (`<Layout sidebar={<X/>}>`) would have been simpler |

Try composition first for layout-shaped problems; reach for context when a value is genuinely needed by many unrelated, deeply nested consumers.

### Controlled vs uncontrolled components

| Aspect | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | The DOM itself (accessed via `ref`) |
| Re-renders | On every keystroke/change | None from the input itself |
| Use when | You need live validation, conditional disabling, or to derive other UI from the value as it's typed | Simple forms where you only need the value on submit |
| Common mistake | Making every form field controlled by default even when nothing needs the live value, adding unnecessary re-renders | Trying to programmatically set an uncontrolled input's value outside of `defaultValue`/refs, fighting the DOM instead of just switching it to controlled |

Default to uncontrolled for simple forms; switch specific fields to controlled only when you actually need to react to changes as they happen.

### Container/Presentational split vs custom hooks

| Aspect | Container/Presentational (two components) | Custom hook (one component) |
|---|---|---|
| Structure | Forces a parent/child component hierarchy | Logic lives in a hook, UI stays in one component |
| Reusability | Reuse requires reusing the container component | Reuse the hook independently of any specific UI |
| Era | Common pre-hooks (class component era) | The default idiom since hooks |
| Common mistake | Still splitting into two components purely out of habit when a hook would be simpler | Cramming too much unrelated logic into one giant custom hook, recreating the "does too much" problem inside the hook instead of the component |

Prefer a custom hook for logic reuse today; the two-component split is still valid but is no longer the default recommendation.

### Array index as key vs stable ID as key

| Aspect | Index as key | Stable ID as key |
|---|---|---|
| Correctness on reorder/insert/delete | Breaks — state and DOM get misattributed to the wrong item | Correct — React tracks each item by its actual identity |
| Performance | Can look "fine" for static, append-only lists | Always correct, and lets React avoid unnecessary DOM node recreation for unaffected items |
| When index is acceptable | List is static, never reordered/filtered/sorted, and items have no internal state | Any dynamic list — the general default |
| Common mistake | Using index just because the item object doesn't have an obvious `id` field, instead of generating one | Regenerating a "unique" key every render (e.g., `Math.random()`), which defeats keys entirely by making everything look new on every render |
