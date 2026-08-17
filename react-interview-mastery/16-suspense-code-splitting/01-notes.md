# Notes: Suspense & Code Splitting

## Why code splitting matters

By default, a bundler like webpack or Vite ships one big JavaScript file containing every component in your app. Users on a slow connection pay the download and parse cost for admin panels, settings pages, and modals they'll never open just to see your landing page. Code splitting breaks the bundle into chunks that load on demand, so the initial page load only ships what's needed to render what the user actually sees first. This directly improves metrics like Time to Interactive and First Contentful Paint.

## React.lazy

`React.lazy` takes a function that returns a dynamic `import()` and returns a component that resolves lazily:

```jsx
const SettingsPanel = React.lazy(() => import("./SettingsPanel"));
```

The import itself is what triggers the bundler (webpack/Vite/Rollup) to split `SettingsPanel` into its own chunk file, downloaded only when this line actually executes. `React.lazy` only works with default exports — if your module uses named exports, you need a small wrapper:

```jsx
const Chart = React.lazy(() =>
  import("./Chart").then((module) => ({ default: module.Chart }))
);
```

## Suspense and fallback

A lazily-loaded component isn't ready synchronously — it's still being fetched over the network the first time it's rendered. `Suspense` lets you declare what to show while it's not ready:

```jsx
<Suspense fallback={<Spinner />}>
  <SettingsPanel />
</Suspense>
```

Suspense works by catching a special "not ready yet" signal thrown by a lazy component (technically, a promise) and rendering `fallback` until that promise resolves, then re-rendering with the real component. You don't need to understand the internal mechanism deeply for interviews, but you should know: `fallback` is shown for *any* descendant instance of "not ready," not just the immediate child — Suspense boundaries catch from anywhere below them in the tree, similar to how error boundaries catch from anywhere below them.

## Where to put your Suspense boundaries

You can wrap a single lazy component tightly, or wrap a whole subtree with one boundary shared by several lazy components:

```jsx
// Tight: each component gets its own loading state, staggered
<Suspense fallback={<Spinner />}><Header /></Suspense>
<Suspense fallback={<Spinner />}><Sidebar /></Suspense>

// Shared: everything waits together, one loading state
<Suspense fallback={<PageSpinner />}>
  <Header />
  <Sidebar />
</Suspense>
```

Neither is universally correct — granular boundaries avoid an all-or-nothing blocking wait but can produce layout jank as pieces pop in independently; a single boundary gives a cleaner "whole section arrives at once" feel but blocks on the slowest piece.

## Lazy-loading routes vs components

The most common and highest-value application of `React.lazy` is at the route level — each route/page is its own chunk, so navigating to `/settings` doesn't cost anything until the user actually goes there:

```jsx
const Home = React.lazy(() => import("./routes/Home"));
const Settings = React.lazy(() => import("./routes/Settings"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

Component-level splitting makes sense for genuinely heavy, conditionally-rendered pieces within a page — a rich text editor, a charting library, a modal that's rarely opened — where the weight isn't justified for every visitor.

## Error boundaries + Suspense

`React.lazy`'s dynamic import can fail (bad network, deploy just happened and the chunk hash changed). Suspense has no built-in error handling — you pair it with an error boundary, placed *outside* the Suspense boundary so it can catch failures from the lazy import itself:

```jsx
<ErrorBoundary fallback={<p>Failed to load. <button onClick={retry}>Retry</button></p>}>
  <Suspense fallback={<Spinner />}>
    <SettingsPanel />
  </Suspense>
</ErrorBoundary>
```

This gives you a complete state machine: loading (Suspense fallback), error (error boundary fallback), and success (the real component).

## Suspense for data fetching

React 18 extended Suspense beyond code splitting toward a general primitive: any code that "suspends" (throws a promise) can be caught by a Suspense boundary, including data fetching, not just lazy component code. This is the direction frameworks like Next.js (App Router) and libraries like Relay have built on. It is genuinely still evolving — plain `useEffect`-based fetching does not automatically suspend, and hooking up Suspense-compatible data fetching by hand is nontrivial and generally discouraged; you use it via a framework or library that implements the contract correctly (a cache that throws a promise while pending, then the resolved value once ready). Know the concept and be able to name it, but don't expect to write a Suspense-integrated fetcher from scratch in an interview.
