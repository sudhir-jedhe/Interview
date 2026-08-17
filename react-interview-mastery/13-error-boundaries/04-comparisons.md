# Comparisons

### `getDerivedStateFromError` vs `componentDidCatch`

| Aspect | `getDerivedStateFromError` | `componentDidCatch` |
|---|---|---|
| Phase | Render phase (static method, must be pure) | Commit phase (instance method, side effects allowed) |
| Purpose | Compute new state to trigger the fallback UI | React to the error — logging, analytics, reporting to an error-tracking service |
| Common mistake | Doing side effects (network calls, logging) inside it, which can run multiple times or in concurrent-rendering edge cases since it's meant to be pure | Relying on it alone to set fallback state — it doesn't return state, so you still need `getDerivedStateFromError` (or `setState` inside it) to actually change what renders |

Use both together: `getDerivedStateFromError` to flip a `hasError` flag for rendering, `componentDidCatch` to send the error details somewhere.

### Error boundaries vs `try/catch`

| Aspect | Error Boundary | `try/catch` |
|---|---|---|
| Scope | Catches render/lifecycle/constructor errors in the *entire subtree* below it, declaratively | Catches errors only in the exact synchronous block it wraps, wherever you write it |
| Handles async/event errors? | No | Yes — works for any synchronous or `await`ed code inside the try block, including event handlers |
| Common mistake | Assuming a boundary covers event handlers or promises too (it doesn't) | Wrapping every single component's render logic manually instead of using a boundary for broad, declarative coverage |

Use error boundaries for render-time crash containment across a subtree; use `try/catch` for expected, localized failures in event handlers and async code (network calls, parsing, etc.).

### Global (app-root) boundary vs per-section boundaries

| Aspect | Global boundary | Per-section boundaries |
|---|---|---|
| Blast radius on error | Entire app replaced with one fallback screen | Only the failing section shows a fallback; rest of the page keeps working |
| Setup cost | One boundary, minimal effort | More boundaries to place and maintain, more fallback UIs to design |
| Common mistake | Relying on only a global boundary, so any minor widget bug takes down the whole app | Wrapping every tiny component individually, adding overhead without meaningful isolation benefit — pick boundaries at meaningful, independently-useful UI sections |

Use a global boundary as the guaranteed last-resort safety net, and add per-section boundaries around independently-failable, non-critical widgets (third-party embeds, optional panels, less-tested features).

### Hand-rolled class boundary vs `react-error-boundary`

| Aspect | Hand-rolled class component | `react-error-boundary` library |
|---|---|---|
| Boilerplate | You write the class, state, both lifecycle methods yourself each time | Provides `<ErrorBoundary>` component + `useErrorHandler` hook, reusable across the app |
| Function-component ergonomics | Fallback UI still needs a separate component; wiring reset logic is manual | `resetErrorBoundary` and `onReset` are built in; `FallbackComponent`/`fallbackRender` props are idiomatic function-component APIs |
| Common mistake | Copy-pasting the same boundary class into multiple files, causing drift when one gets updated and others don't | Forgetting that the library's boundary still can't catch async/event errors either — `useErrorHandler` exists specifically to bridge that gap by re-throwing into render |

Use the library for consistency and less boilerplate in any non-trivial app; hand-roll only for a single, simple, one-off boundary or when avoiding the extra dependency matters.
