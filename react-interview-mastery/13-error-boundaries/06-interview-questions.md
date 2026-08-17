# Interview Questions

**Q: What is an error boundary and what problem does it solve?**
It's a component that catches JavaScript errors thrown during rendering anywhere in its child subtree, and shows a fallback UI instead of letting the error unmount the entire application. Without one, React 16+ unmounts the whole component tree on any uncaught render error, producing a blank white screen.

**Q: Why must error boundaries be class components?**
They rely on `static getDerivedStateFromError(error)` and `componentDidCatch(error, info)`, two lifecycle methods that only exist on class components. There is no hook equivalent — React hasn't shipped a `useErrorBoundary`-style hook, making this one of the last remaining cases where a class component is required in idiomatic modern React.

**Q: What's the difference between `getDerivedStateFromError` and `componentDidCatch`?**
`getDerivedStateFromError` runs during the render phase, must be pure, and returns the state update used to render the fallback UI. `componentDidCatch` runs during the commit phase, after the fallback has already rendered, and is where you perform side effects like logging the error to a monitoring service.

**Q: List the categories of errors an error boundary catches.**
Errors thrown during rendering, in lifecycle methods (e.g., `componentDidMount`), and in constructors of any component in the tree below the boundary.

**Q: List the categories of errors an error boundary does NOT catch, and how you'd handle each instead.**
Event handler errors (handle with `try/catch` inside the handler), asynchronous errors like rejected promises or `setTimeout` callbacks (catch manually and convert to state, optionally re-throw during render to funnel into a boundary), server-side rendering errors (handle separately around the SSR render call), and errors thrown by the boundary component itself (requires a separate parent boundary).

**Q: Can an error boundary catch an error thrown by its own fallback UI?**
No. A boundary cannot catch errors it produces itself, including errors in its fallback render path — that requires a different, ancestor error boundary above it. This is why fallback components should be kept minimal and not depend on the same state/context that may have caused the original crash.

**Q: What does `componentDidCatch`'s second argument, `errorInfo`, contain, and what's it used for?**
It contains a `componentStack` string showing which component in the tree threw the error, which is invaluable for logging/debugging in production since minified stack traces alone often aren't enough to locate the failing component.

**Q: How would you implement a "Try Again" button on an error boundary, and what's a common pitfall?**
Add a method that resets `hasError` to `false` via `setState`, which re-renders the (previously failing) children fresh. The pitfall: if the failure is deterministic (bad data, not a transient issue), simply resetting state and re-rendering the same children with the same bad input will throw again immediately — a real fix often needs to also change the underlying input (refetch data, reset a `key` to force full remount, or navigate the user elsewhere).

**Q: What is `react-error-boundary` and why would you use it over writing your own boundary class?**
It's a widely used library providing a ready-made `<ErrorBoundary>` component with `FallbackComponent`/`fallbackRender` props, a built-in `resetErrorBoundary` callback, and a `useErrorHandler` hook for surfacing async/event errors into the render phase. It removes the repetitive class-component boilerplate and standardizes reset/fallback conventions across a codebase.

**Q: How would you use an error boundary's `resetErrorBoundary` (or equivalent) together with async error handling?**
Catch the async error (e.g., in a `.catch()`), store it in state, then re-throw it synchronously during the next render (`if (error) throw error;`). The nearest error boundary catches this re-thrown error normally; its `resetErrorBoundary`/reset callback can then clear that error state before remounting children, giving async failures the same declarative fallback/retry UX as render errors.

**Q: How would you decide between one global error boundary and many section-scoped boundaries in a real app?**
Always keep one global boundary as a last-resort safety net for unexpected failures anywhere. Add section-scoped boundaries around independently-failable, non-critical UI — third-party embeds, optional widgets, less-tested feature areas — so a failure there degrades gracefully instead of taking down the whole page. Avoid wrapping every tiny component individually; that adds overhead without meaningful additional isolation.

**Q: Does wrapping a component in `React.memo` or using hooks like `useMemo`/`useCallback` inside it change how error boundaries interact with it?**
No. `memo`/`useMemo`/`useCallback` only affect whether/how often a component re-renders or recomputes values — they have no bearing on error propagation. An error thrown during that component's render is caught by the nearest ancestor boundary exactly the same way regardless of memoization.
