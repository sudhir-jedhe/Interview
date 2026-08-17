# Interview Questions — JSX & Rendering Basics

**Q: What is JSX, and does the browser understand it directly?**
No. JSX is a syntax extension that isn't valid JavaScript on its own — browsers can't execute it. A build tool (Babel, the TypeScript compiler, esbuild/SWC) transpiles it into plain function calls, either `React.createElement(type, props, children)` or, with the modern automatic runtime, calls to `jsx`/`jsxs` from `react/jsx-runtime`. Those calls return plain JavaScript objects (React elements) describing the UI, which is what actually ships to the browser.

**Q: What's the difference between a React element and a component?**
An element is a plain, immutable object describing what to render (`{ type, props }`) — cheap to create, thrown away every render. A component is a function (or class) that takes props and returns elements. You render components by referencing them in JSX (`<MyComponent />`), which produces an element whose `type` is the function itself; React later calls that function to figure out what to actually render.

**Q: Why can't you return two sibling elements from a component without a wrapper?**
Because JSX compiles to a single function call that returns one value. `<A /><B />` isn't a JSX expression at all — it's two separate expressions with no top-level container, which is invalid syntax. Wrap them in a real DOM element or in a `Fragment` (`<>...</>`) to satisfy the "single root" requirement without adding an unwanted DOM node.

**Q: What is the Virtual DOM, and why does React use it?**
It's an in-memory tree of plain JS objects (React elements) representing the desired UI state. On each render, React builds a new virtual tree and diffs it against the previous one (reconciliation), computing the minimal set of real DOM operations needed to reach the new state, then applies them in a batch during the commit phase. This avoids the cost of doing full DOM rebuilds and lets React's diffing algorithm centralize update logic rather than having every component manually manage imperative DOM mutations.

**Q: What role does the `key` prop play in list rendering, and what goes wrong without it?**
`key` gives React a stable identity for each item in a list so it can match elements between renders by "what they are" rather than by position. Without keys (or with unstable keys like array index on a reorderable/filterable list), React falls back to matching by position, which can cause it to reuse the wrong DOM node/component instance for a given piece of data — manifesting as state (like focus, input values, animation state) appearing to "stick" to the wrong row after insertions, deletions, or reorders.

**Q: Why does `{count && <Badge />}` sometimes render a stray `0`?**
`&&` in JavaScript returns its left operand when that operand is falsy, not the boolean `false`. If `count` is `0`, the expression evaluates to `0`, and React does render numbers (unlike `false`/`null`/`undefined`, which are skipped). The fix is to ensure the left side is an actual boolean, e.g. `count > 0 && <Badge />`.

**Q: What's the difference between conditional rendering with `&&`/ternary versus an early `return`?**
`&&` and ternaries live inline inside the JSX tree and are best for small, localized branching. An early `return` exits the component function before building any JSX for that render path at all, which is clearer when an entire component has one dominant "empty/error/loading" state to short-circuit on. Overusing deeply nested ternaries inside JSX hurts readability; that's usually a sign to switch to an early return or extract a sub-component.

**Q: How does React batch state updates, and did this change in React 18?**
Batching means React groups multiple `setState` calls that happen within the same tick into a single re-render instead of one re-render per call. Before React 18, this only happened automatically inside React event handlers; updates inside `setTimeout`, promises, or native event listeners each triggered separate synchronous re-renders. React 18's automatic batching extends this to those cases too, so multiple state updates anywhere in a single synchronous block of work are batched by default (opt out per-update with `flushSync` if you truly need synchronous re-rendering).

**Q: Can you put an `if` statement directly inside JSX curly braces?**
No — `{}` in JSX only accepts expressions, and `if` is a statement, not an expression. You either compute the value before the `return` using a normal `if`, use an expression-based construct like a ternary or `&&` inside the JSX, or use an early `return` at the top of the component to skip rendering the rest of the tree.

**Q: What does "reconciliation" mean, and what's the type-based heuristic React uses?**
Reconciliation is the process of diffing the new element tree against the previous one to determine the minimal DOM changes needed. React's core heuristic: if an element at a given position has the same type as before, React keeps the underlying DOM/component instance and just updates its props/state; if the type changes, React tears down the old subtree (unmounting it, losing its state) and mounts a completely new one in its place. This is why swapping between differently-typed components at the same tree position — rather than branching inside one component — causes unwanted state loss.

**Q: Is `className` the same thing in JSX as `class` in HTML?**
Functionally, yes — it sets the CSS class — but the prop is literally named `className` in JSX because JSX props are just JavaScript object keys passed to `createElement`, and `class` is a reserved word in JavaScript. Similarly `for` becomes `htmlFor`. This is a common source of confusion for developers copy-pasting HTML directly into JSX.
