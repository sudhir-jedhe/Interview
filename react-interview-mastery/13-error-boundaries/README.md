# Error Boundaries

Error boundaries are React's mechanism for catching JavaScript errors thrown during rendering anywhere in a component subtree, logging them, and displaying a fallback UI instead of unmounting the whole app — and they remain one of the few things in React that still require a class component, since there's no hook equivalent to `componentDidCatch`/`getDerivedStateFromError`. This topic covers exactly what they catch (render, lifecycle, and constructor errors in the tree below them) versus what they explicitly don't (event handlers, async code, SSR, and errors within the boundary itself), practical fallback UI patterns, the `react-error-boundary` library as the standard ergonomic wrapper, and how to think about boundary granularity — one global boundary versus many small ones per section.

## What's covered
- Error boundaries as class components (`componentDidCatch`, `getDerivedStateFromError`)
- What they catch vs. what they don't (event handlers, async code, SSR, boundary's own errors)
- Fallback UI patterns
- `react-error-boundary` conceptually
- Boundary granularity: global vs. per-section

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
