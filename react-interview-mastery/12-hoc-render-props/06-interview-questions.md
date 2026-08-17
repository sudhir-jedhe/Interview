# Interview Questions

**Q: What is a higher-order component, in one sentence?**
A function that takes a component as an argument and returns a new component that wraps it with additional props, behavior, or rendering logic — `withX(Component) => EnhancedComponent`.

**Q: What is the render props pattern?**
A pattern where a component accepts a function as a prop (commonly `children` or `render`) and calls that function — usually with some internal state — to determine what to render, letting the consumer control the UI while the provider controls the logic.

**Q: Give a concrete example of "wrapper hell" and why it's a problem.**
Stacking HOCs like `withAuth(withTheme(withData(Component)))` produces a component tree of `WithAuth > WithTheme > WithData > Component` in DevTools. It's a problem because it adds indirection when debugging (which layer sets which prop?), adds render overhead for each wrapper, and makes it harder to trace where a given prop actually originates.

**Q: Why do multiple HOCs risk naming collisions, and how do hooks avoid this?**
If two HOCs each inject a prop with the same name (e.g., both call it `status` or `data`), whichever is applied closer to the wrapped component (or spreads its prop last) silently wins, with no compile-time warning. Custom hooks avoid this because each hook returns a value that the consuming component explicitly destructures and names itself — there's no implicit merging of props from independent sources.

**Q: Rewrite a simple `withLoading` HOC as a custom hook usage instead.**
```jsx
// HOC version
function withLoading(Wrapped) {
  return ({ isLoading, ...rest }) => isLoading ? <Spinner /> : <Wrapped {...rest} />;
}

// Hook version — no extra wrapper component needed
function Profile({ isLoading, user }) {
  if (isLoading) return <Spinner />;
  return <h1>{user.name}</h1>;
}
```
The hook version just inlines the condition; no separate enhancer function or wrapper component is needed since there's no cross-component state to share.

**Q: What must a well-behaved HOC do to avoid breaking the components it wraps?**
Pass through unrelated props via `{...rest}`, avoid mutating the wrapped component (never do `Wrapped.someProperty = x`), copy static methods if the wrapped component has any (historically via `hoist-non-react-statics`), and set a `displayName` so DevTools shows something readable instead of an anonymous function.

**Q: Are HOCs and render props still used in modern React codebases? Where?**
Yes, mainly at library integration boundaries where the library itself hasn't exposed a hook API — e.g., some older Redux (`connect()`), certain component libraries, or error boundaries, which must be class components and therefore can't be pure hooks. For application-level shared logic you write yourself, custom hooks are the default choice today.

**Q: Why can't error boundaries be replaced by a hook the way most HOCs have been?**
Error boundaries rely on the class component lifecycle methods `static getDerivedStateFromError` and `componentDidCatch`, which have no hook equivalent — there is no `useErrorBoundary` hook in React because catching render errors requires intercepting the render/commit cycle at a level hooks don't expose. A HOC like `withErrorBoundary(Component)` is a legitimate, still-current pattern because it wraps a class-based boundary around any function component.

**Q: What's a subtle bug that can occur with render props and `React.memo`?**
If the provider component wraps the render-prop function's invocation in something meant to be memoized (or a child of it is `memo`-wrapped), passing a new inline arrow function as the render prop every render defeats that memoization, since the function reference changes every time — identical to the inline-function-as-prop issue outside of render props.

**Q: How would you type a HOC in TypeScript, at a high level, and why is it more awkward than typing a hook?**
You need generics to preserve the wrapped component's prop type while adding/removing the props the HOC injects, e.g. `function withLoading<P>(Wrapped: ComponentType<P>): ComponentType<P & { isLoading: boolean }>`. It's more awkward than a hook because a hook just declares its own input/output types directly, while a HOC has to correctly merge, subtract, and forward generic prop types across two component boundaries.

**Q: What's the practical difference in the DevTools component tree between using a hook and using a HOC for the same shared logic?**
A hook adds zero extra entries to the tree — the logic executes inside the existing component's call frame. A HOC adds one extra named component per wrapper (e.g., `WithLoading`) that appears as a real node in the tree, which is directly inspectable but also adds visual/structural noise as more wrappers stack.

**Q: If you must support both React DevTools clarity and cross-cutting concerns like theming, which would you choose today — a hook or a HOC — and why?**
A hook (`useTheme()` reading from a context) — it keeps the tree flat, avoids naming collisions if combined with other hooks, and is trivially composable with other hooks in the same component without any wrapper nesting. Reach for a HOC only if the concern must operate as a wrapper for reasons hooks structurally can't address, like error boundaries.
