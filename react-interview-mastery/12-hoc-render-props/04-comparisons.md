# Comparisons

### HOC vs Render Props

| Aspect | Higher-Order Component | Render Props |
|---|---|---|
| Shape | Function that takes a component, returns a new component: `withX(Comp)` | Component that takes a function-as-prop (often `children` or `render`) and calls it to get JSX |
| Composition | Nested wrapping: `withA(withB(withC(Comp)))` — creates extra tree depth per layer | Nested function calls in JSX: `<A>{() => <B>{() => <C>...}}</B>}</A>` — also nests, but as markup indentation rather than component tree depth |
| Common mistake | Forgetting to forward `...rest` props or set `displayName`, breaking prop passthrough or DevTools readability | Recreating the render-prop function inline every render, defeating any memoization on the provider component |

Both solve the same problem (share stateful logic across components); prefer neither for new code — reach for a custom hook instead. Recognize both when reading legacy code or library APIs.

### HOC / Render Props vs Custom Hooks

| Aspect | HOC / Render Props | Custom Hooks |
|---|---|---|
| Component tree impact | Adds wrapper component(s) to the tree ("wrapper hell"), visible in DevTools | Zero extra components — logic lives inside the consuming component's function body |
| Prop naming collisions | Real risk when stacking multiple HOCs/render props that inject same-named props/values | None — each hook's return value is destructured with whatever local names the consumer chooses |
| Common mistake | Stacking too many enhancers, making it hard to trace which layer provides which prop | Violating the Rules of Hooks (calling conditionally, in loops) since hook composition relies on consistent call order |

Default to custom hooks for new shared logic. Only reach for a HOC/render-prop when hooks genuinely can't express the requirement (see below).

### `children` as function vs named `render` prop

| Aspect | `children` as function | Named `render` prop |
|---|---|---|
| Syntax | `<Comp>{(state) => <div/>}</Comp>` — reads like normal JSX children | `<Comp render={(state) => <div/>} />` — explicit prop name |
| Clarity | Can be confusing since `children` is usually elements, not a function — easy to misuse | Self-documenting; obvious at a glance that this prop is a render function |
| Common mistake | Mixing function children with regular element children on the same component (only one is valid at a time) | Forgetting `render` while also passing regular `children`, causing confusion about which one the component actually uses |

Functionally interchangeable — pick based on codebase convention; `render` is more explicit for newcomers, `children` reads more naturally at the call site.

### HOC used purely for gating (loading/auth) vs HOC used for library integration

| Aspect | Gating HOC (e.g. `withLoading`) | Library-integration HOC (e.g. legacy `connect()`, `withRouter`) |
|---|---|---|
| Replaceable by hooks today? | Yes, trivially — `if (isLoading) return <Spinner/>` inline, or a custom hook | Only if the library itself exposes a hook API; otherwise the HOC is the library's supported integration point |
| Common mistake | Writing new gating HOCs today instead of just inlining the condition or using a hook | Trying to force a hook-only rewrite of a HOC that a third-party library requires, causing brittle workarounds |

Write gating logic inline or as a hook; keep using library-provided HOCs as-is when the library hasn't shipped a hook equivalent.
