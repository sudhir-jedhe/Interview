# Interview Questions

**Q: What are the three things that cause a React function component to re-render?**
Its own state changing (`useState`/`useReducer`), its parent re-rendering (regardless of whether props changed), or a context value it consumes changing. Props changing on their own don't cause a re-render — they matter only as a side effect of the parent re-rendering.

**Q: Does a prop changing cause a re-render if the parent didn't re-render?**
No — a component can only receive new props as part of its parent re-rendering and passing different values down. There's no mechanism for a prop to change "in isolation" without the parent function re-running.

**Q: What does `React.memo` actually compare, and what's the most common way it fails to help?**
It does a shallow comparison (`Object.is`) of each prop against the previous render's value. It fails most often when the parent passes inline object/array/function literals (`style={{...}}`, `onClick={() => ...}`), which create a new reference on every render even if the contents are identical, so the comparison always reports "changed."

**Q: Is re-rendering the same thing as updating the DOM? Why does the distinction matter?**
No. A re-render is React calling your component function and producing a new element tree; a DOM update (commit) only happens for the specific nodes that actually differ after React diffs the new tree against the old one. The distinction matters because most re-renders are cheap and produce zero DOM changes — chasing re-renders as if they're inherently expensive leads to premature `memo`/`useMemo` overuse.

**Q: When should you reach for `React.memo`, and when is it a waste of effort?**
Reach for it on components that render frequently with genuinely stable props — typically leaf components or list rows where the parent re-renders often but a given row's data rarely changes. It's a waste on components that render cheaply anyway, or whose props are unstable references from the parent (you'd need `useMemo`/`useCallback` upstream too, which adds its own overhead) — measure with the Profiler first.

**Q: Why is using array index as `key` dangerous for dynamic lists?**
`key` tells React which DOM node/state corresponds to which logical item across renders. Index ties that identity to position, not to the item. If the list reorders, inserts, or deletes anywhere but the end, items shift index and React reuses the wrong node/state for the wrong item — most visibly breaking uncontrolled inputs or component-local state inside list rows.

**Q: What is virtualization, and when should you use a library like `react-window`?**
Virtualization renders only the list rows currently in (or near) the viewport, recycling a small, roughly constant number of DOM nodes as the user scrolls, instead of mounting every row up front. Reach for it once a list is long enough (typically hundreds to thousands of rows) that DOM node count — not render logic — is the measured bottleneck; it adds setup complexity (fixed/estimated row heights) that isn't worth it for short lists.

**Q: How does splitting a component differ from memoizing it, as a performance strategy?**
Memoizing (via `memo`) tries to *skip* a re-render after it's already been triggered. Splitting a component moves fast-changing state into its own smaller component so the re-render trigger never reaches the rest of the tree in the first place — it addresses the cause rather than short-circuiting the effect, and doesn't depend on prop reference stability to work.

**Q: A context provider's `value` is `{ theme, setTheme }` created inline in the provider component's body. What's the performance problem, and how do you fix it?**
Every render of the provider creates a new `value` object, so every consumer of that context re-renders on every provider render, even if `theme` itself hasn't changed. Fix by memoizing the value: `const value = useMemo(() => ({ theme, setTheme }), [theme])` (with `setTheme` from `useState`, which is already stable).

**Q: How would you use the React DevTools Profiler to confirm a re-render is unnecessary?**
Record a session while performing the suspect interaction, then inspect the flamegraph/ranked chart for that commit. Check which components rendered and use the "why did this render" info; if a component shows up but its rendered output (and DOM diff) is identical to before, and its props/state/context genuinely didn't need to change, that's an unnecessary re-render worth fixing — typically via `memo` plus stabilized props, or by splitting state.

**Q: Give an example of an inline prop that silently breaks memoization, and how to fix it.**
`<Row style={{ padding: 8 }} />` passed to a `memo`-wrapped `Row` creates a new object every render, so `memo`'s shallow comparison never matches. Fix by hoisting the object to a module-level constant (if truly static) or wrapping it in `useMemo(() => ({ padding: 8 }), [])` if it depends on props/state.

**Q: Why doesn't `useCallback` alone guarantee a component avoids re-rendering?**
`useCallback` only stabilizes the *function reference* passed as a prop — the child still needs to be wrapped in `React.memo` to actually skip re-rendering when that prop (and all others) is unchanged. Using `useCallback` without `memo` on the receiving component has no effect on whether that component re-renders.
