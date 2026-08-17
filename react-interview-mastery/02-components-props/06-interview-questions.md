# Interview Questions — Components & Props

**Q: What is a function component, and what's the minimal contract it must fulfill?**
A function component is a plain JavaScript function that accepts a single `props` object as its argument and returns something React can render — JSX, a string, a number, an array of these, or `null`. React calls it during render whenever the component needs to (re-)appear in the tree, passing a fresh `props` object each time.

**Q: Why are props described as "read-only"?**
Because a component should never modify the `props` object it receives — that data is owned by the parent that passed it down. This is a discipline React relies on: it assumes that if the same props reference is passed again, nothing has changed (useful for optimizations like `React.memo`'s shallow comparison), and it only re-renders in response to `setState`/`useState` calls, not object mutations. Mutating props directly doesn't trigger a re-render and can corrupt state that other components share by reference.

**Q: What is `props.children`, and where does it come from?**
It's a special prop automatically populated with whatever is nested between a component's opening and closing JSX tags. It lets a component act as a generic container/wrapper without knowing what will be rendered inside it — the basis for components like `Modal`, `Card`, or `Layout`.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

**Q: What is prop drilling, and why is it considered a problem?**
It's passing data through several layers of components via props purely so a deeply nested descendant can access it, even though the intermediate components don't use that data themselves. It's not a bug, but it couples every intermediate component's signature to data it doesn't care about, making refactors (renaming/moving that data) touch every layer in between and making the intermediate components harder to reuse independently.

**Q: What are the main ways to avoid prop drilling?**
Context (for cross-cutting, infrequently-changing data like theme/auth/locale), composition (passing already-built JSX elements as props/`children` instead of raw data, so intermediate layers don't need to know about it), and, for larger apps, a dedicated state management library. Composition is often underused and solves the problem without adding Context's re-render considerations.

**Q: How do you set default values for props in a function component?**
Via default parameters in destructuring: `function Button({ label = 'Submit' }) {...}`. This is the modern idiom; the older `Component.defaultProps = {...}` static property pattern still works but is deprecated for function components as of recent React versions and is mainly seen in legacy class-component code.

**Q: What's the difference between a prop being `undefined` and a prop not being passed at all?**
Nothing, for the purposes of default values — both trigger a destructuring default, since JavaScript's default-parameter mechanism activates specifically when a value is `undefined`. Explicitly passing `null`, however, does *not* trigger the default, since `null` is a defined value; the component receives `null` as-is.

**Q: What does "controlled" vs. "presentational" mean as a component design heuristic, and is it an official React concept?**
It's not an official React API distinction, just a naming convention/heuristic. A presentational (or "dumb") component renders purely based on the props it receives and holds no business logic or external state — highly reusable and easy to test in isolation. A controlling (or "container") component owns state, data fetching, and business logic, and passes values plus callback props down to presentational children. This separation makes UI pieces reusable independent of where their data comes from.

**Q: How do you forward arbitrary HTML attributes (like `onClick`, `disabled`, `aria-*`) through a wrapper component without listing each one explicitly?**
Use the rest/spread pattern: destructure the props your component cares about, and spread the rest onto the underlying element.

```jsx
function PrimaryButton({ children, ...rest }) {
  return <button className="btn-primary" {...rest}>{children}</button>;
}
```

**Q: Why does mutating an array or object prop not cause a re-render, even though the underlying data visibly changed?**
Because React only re-renders in response to a `setState`/reducer dispatch call — it never inspects prop or state values for changes on its own. Mutating an array with `.push()`/`.sort()` (etc.) in place changes the contents but keeps the same object reference, and nothing about that action calls a setter, so no re-render is scheduled. It's also unsafe for components using `React.memo`, whose shallow prop comparison would see the *same reference* and conclude nothing changed even if you did trigger a render some other way.

**Q: When would you reach for TypeScript instead of PropTypes for prop validation?**
Essentially always on a new project. PropTypes only validates at runtime, in development, and only when the component actually renders with a given set of props — it gives no compile-time safety or editor autocomplete. TypeScript validates prop shapes during development and at build time, catches mismatches before code ever runs, and provides full IDE autocomplete/refactor support, all with zero runtime cost since types are erased at compile time. PropTypes mostly persists in legacy JavaScript-only codebases not (yet) migrated to TypeScript.
