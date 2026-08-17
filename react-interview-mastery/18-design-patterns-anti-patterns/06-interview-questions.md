# Interview Questions: Design Patterns & Anti-Patterns

**Q: What is a compound component, and when would you use one?**
It's a pattern where a parent component implicitly shares state with its children via context, letting you compose a flexible API (`<Tabs><Tabs.Tab/><Tabs.Tab/></Tabs>`) instead of a single component with a rigid prop shape (like an array of tab configs). Use it when you want consumers to control layout/order/composition of related pieces while the parent still coordinates shared state like "which tab is active."

**Q: What's the difference between controlled and uncontrolled components, and when would you pick one over the other?**
A controlled component's value lives in React state and is driven by `value`/`onChange`; an uncontrolled component lets the DOM hold the value, read via a `ref` when needed (with `defaultValue` for the initial value). Pick controlled when you need to react to every change (validation, conditionally disabling other fields); pick uncontrolled for simple forms where you only care about the value at submit time and want to avoid re-rendering on every keystroke.

**Q: Is the container/presentational pattern still relevant with hooks?**
Less so as a strict rule — custom hooks now extract stateful logic without requiring a forced two-component split, so the separation of "logic" and "display" concerns is usually achieved with `const data = useSomeHook()` inside one component. The underlying principle (keep data logic separate from rendering logic) is still good practice; the specific two-component structural pattern is just no longer the default way to achieve it.

**Q: Why is prop drilling considered an anti-pattern, and what are the alternatives?**
It couples every intermediate component to props it doesn't itself use, just to relay them further down, making refactors and renames expensive since you have to touch every layer in between. Alternatives are composition (pass pre-built elements as `children` or named slot props so intermediate components stay generic) and context (for values genuinely needed by many distant, unrelated descendants).

**Q: Why is mutating state directly (e.g., `array.push()` then `setState(array)`) a bug, not just a style nit?**
React decides whether to re-render by comparing the new state reference to the old one; if you mutate the existing array/object and pass the same reference back to `setState`, React may not detect a change and can skip re-rendering, or produce inconsistent behavior depending on internals you shouldn't rely on. The fix is always to create a new reference — spread into a new array/object — so React's comparison correctly detects the change.

**Q: Why is using an array index as a `key` problematic, specifically?**
React uses `key` to match elements across renders to the correct component instance. When a list is reordered, filtered, or has items inserted/removed, index-based keys cause React to associate the wrong data with an existing DOM node/component instance, since the index no longer corresponds to the same logical item — this shows up as bugs like local state (a typed input value, an open/closed toggle) sticking to the wrong row after a reorder.

**Q: When, if ever, is index-as-key acceptable?**
When the list is static — never reordered, filtered, sorted, or has items inserted/removed in the middle — and the items have no internal state tied to their identity. In that narrow case, index and identity are equivalent, so there's no correctness risk, though reaching for a stable ID is still the safer default habit.

**Q: What's wrong with a component that fetches data, holds a dozen unrelated state variables, and renders a huge JSX tree all in one file?**
It's hard to test in isolation, hard to review (any change risks touching unrelated logic), and hard to reuse any single piece of its behavior elsewhere. The fix is decomposition: extract data-fetching into a custom hook, break the JSX into smaller components each with a focused responsibility, and let the original component become a thin composition of the pieces.

**Q: When is it wrong to use `useEffect` to keep one piece of state in sync with another?**
Whenever the "synced" value can be computed directly from existing props/state during render — an effect in that case adds an unnecessary extra render cycle and can briefly show a stale/incorrect value before the effect catches up, in addition to more code than a plain derived expression. `useEffect` should be reserved for synchronizing with something *outside* React (the DOM, a subscription, a network request), not for keeping two pieces of React state consistent with each other.

**Q: Why is having many sibling components each independently fetch the same or overlapping data a problem, and how do you fix it?**
It duplicates identical network requests, delays rendering (each component waits on its own round trip instead of sharing one), and makes cache invalidation impossible to reason about since there's no single source of truth for the data. Fix it by lifting the fetch to a common ancestor and passing data down, or by introducing a shared cache (a simple module-level cache, context, or a library like React Query) so identical requests are deduplicated and shared across consumers.

**Q: How would you explain the "presentational vs container" split to someone who's only ever written class components before, in terms of what changed?**
In the class-component era, reusing stateful logic across components required patterns like higher-order components or render props, which naturally pushed you toward splitting a "smart" data-owning component from a "dumb" rendering component. Hooks let you extract and reuse that stateful logic directly as a function (a custom hook) without needing to wrap or nest components at all, so the same separation of concerns no longer requires a specific component hierarchy — the logic/UI split becomes a function/JSX split within one component instead.
