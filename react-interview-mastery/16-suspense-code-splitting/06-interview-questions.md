# Interview Questions: Suspense & Code Splitting

**Q: What problem does code splitting solve?**
Without it, the entire app ships as one JavaScript bundle, forcing every user to download code for features/routes they may never use, which slows down initial load. Code splitting breaks the app into smaller chunks that load on demand — typically per-route — so the initial payload only contains what's needed to render the first screen, improving metrics like Time to Interactive.

**Q: How does `React.lazy` work under the hood, at a conceptual level?**
`React.lazy(() => import('./X'))` wraps a dynamic `import()`, which the bundler turns into a separate chunk fetched over the network at runtime. The first time the lazy component is rendered, the import hasn't resolved yet, so React "suspends" — internally the component throws the pending promise — and the nearest `Suspense` boundary catches it and shows its fallback until the promise resolves, then re-renders with the real component.

**Q: Why does `React.lazy` require a default export?**
`React.lazy` expects the resolved module to have a `default` property containing the component, matching how `import()` resolves ES modules with a default export. If your component is a named export, you need a `.then()` wrapper that remaps it: `import('./X').then(m => ({ default: m.X }))`.

**Q: What is the `fallback` prop for, and what can it contain?**
It's the UI `Suspense` renders while any descendant within its boundary is suspended (not ready). It can be any valid JSX — a spinner, a skeleton screen, `null`, or nothing meaningful — React doesn't impose special constraints on it beyond it being a valid element.

**Q: Does `Suspense` catch errors, like an error boundary does?**
No. `Suspense` only handles the "pending" case (a thrown promise). A failed dynamic import (e.g., a 404 on the chunk) is a thrown error, not a promise, and propagates up uncaught unless you pair `Suspense` with an actual error boundary placed above it in the tree.

**Q: Where should you place an error boundary relative to a Suspense boundary for lazy-loaded components?**
Above (as an ancestor of) the `Suspense` boundary, so it can catch failures from the lazy import itself as well as any render errors inside the suspended subtree. If placed inside the `Suspense` boundary, it can still catch render errors from the resolved component, but conventionally it's placed outside so one boundary cleanly handles both loading and error states for the whole subtree.

**Q: What's the difference between lazy-loading at the route level vs the component level?**
Route-level splitting creates one chunk per page, so navigating between pages only downloads what's needed for the destination — this is almost always worth doing and has the biggest overall impact. Component-level splitting targets specific heavy, conditionally-rendered pieces within a page (an editor, a chart library, a modal) that aren't needed for the initial render of that page.

**Q: If you wrap multiple lazy components in a single shared `Suspense` boundary, what's the loading behavior?**
The whole subtree is treated as one unit: the fallback stays visible until *every* suspending component in that subtree is ready, then they all appear together. To let each one appear independently as soon as it's ready, you need separate, nested `Suspense` boundaries around each one.

**Q: What does "Suspense for data fetching" mean, and is it something you implement yourself with `useEffect`?**
It's the broader React 18 direction where any async operation that "suspends" (not just lazy component code) can be caught by a `Suspense` boundary — including data fetching, if the fetching mechanism is built to throw a promise while pending and resolve to a cached value once ready. Plain `useEffect` fetching does not do this automatically; Suspense-integrated data fetching is provided by frameworks (Next.js App Router, Relay) or libraries designed for it, not something you typically hand-roll.

**Q: Does using `React.lazy` reduce total code shipped, or just when it's shipped?**
Just when — the total bytes downloaded over a full user session touching every feature can be the same or even slightly more (due to extra request overhead per chunk). The win is deferring cost: the *initial* load is smaller, and unused code for features a user never visits may never be downloaded at all.

**Q: What happens if you forget the `Suspense` boundary around a lazy component entirely?**
React throws an error at render time telling you a suspended component was rendered outside of a `Suspense` boundary — there's no silent fallback behavior; a boundary is required somewhere in the ancestor chain for `React.lazy` to work.
