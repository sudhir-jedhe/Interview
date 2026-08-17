# Comparisons — Components & Props

### Props vs. State

| Aspect | Props | State |
|---|---|---|
| Owner | Passed in from parent | Owned/managed by the component itself |
| Mutability | Read-only from the receiving component's perspective | Mutable via its setter function |
| Who triggers updates | Parent re-renders and passes new props | Component calls its own `useState`/`useReducer` setter |

Use props for data a component receives from outside; use state for data a component manages internally. The common mistake is copying an incoming prop into local state (`useState(props.value)`) as a way to "modify" it locally, which desyncs from the parent and is usually better solved by lifting the state up or using a callback prop.

### `children` vs. explicit named props for composition

| Aspect | `children` | Named prop (e.g. `header`, `footer`) |
|---|---|---|
| Flexibility | Accepts arbitrary nested JSX, most general | Only accepts what you assign to that specific slot |
| Multiple "slots" | Only one `children` per component | Can have several named slots simultaneously |
| Readability at call site | Nesting reads like normal markup | More explicit about which content goes where |

Use `children` for single-slot wrapper/container components (`Card`, `Modal`, `Layout`'s main area); use named props when a component needs multiple distinct content regions at once (e.g. `<Layout header={<Nav />} sidebar={<Filters />}>{content}</Layout>`). The common mistake is trying to cram multiple unrelated pieces of content into a single `children` and then using fragile array indexing or `React.Children` utilities to pick them apart — named props are simpler.

### Prop drilling vs. Context vs. composition

| Aspect | Prop drilling | Context | Composition (pass elements as props/children) |
|---|---|---|---|
| Setup cost | None — just pass props | Requires a Provider + `useContext` calls | Requires restructuring how components are nested |
| Coupling | Every intermediate component's signature is coupled to data it doesn't use | Consumers subscribe directly, no intermediate coupling | Intermediate components don't need to know about the data at all |
| Best for | Shallow trees, 1-2 levels | Cross-cutting, rarely-changing data (theme, auth, locale) | Avoiding drilling without needing global/shared state at all |

Use plain prop drilling for shallow component trees where it's still easy to trace. Reach for Context when data genuinely needs to be read by many components at different depths and doesn't change on every keystroke (frequent updates through Context can cause broad re-renders). Reach for composition first when the "problem" is actually just deeply nested layout — passing already-built elements down often removes the need for Context entirely. The common mistake is jumping straight to Context/a state library for a problem that composition would solve more simply.

### PropTypes vs. TypeScript for validating props

| Aspect | PropTypes | TypeScript |
|---|---|---|
| When errors surface | Runtime, console warning in dev only | Compile time, in the editor and build |
| Autocomplete/IDE support | None | Full IDE autocomplete and refactor support |
| Production overhead | Slight runtime cost (usually stripped in prod) | Zero runtime cost (types erased at build) |

Use TypeScript by default on any new project needing prop validation; `PropTypes` is mainly relevant for legacy plain-JavaScript codebases that aren't migrating to TS. The common mistake is treating `PropTypes` as equivalent safety to TypeScript — it only catches issues when the component actually renders with bad props during development, not before you ship. Deeper TypeScript prop-typing patterns live in a separate TypeScript-focused repo.
