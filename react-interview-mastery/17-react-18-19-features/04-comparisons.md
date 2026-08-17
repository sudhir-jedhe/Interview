# Comparisons: React 18/19 Features

### useTransition vs useDeferredValue

| Aspect | `useTransition` | `useDeferredValue` |
|---|---|---|
| What you wrap | A state *update* (`startTransition(() => setX(...))`) | A *value* you already have (often a prop or state you don't control) |
| Gives you | An `isPending` boolean | A deferred version of the value to compare against the current one |
| Use when | You control the state setter causing the expensive work | You only have the value itself, not the setter (e.g., it's a prop) |
| Common mistake | Wrapping the urgent update (like the input's own `setText`) in the transition, defeating the point | Comparing `deferredValue !== value` incorrectly or forgetting to memoize the expensive computation, so it still runs every render |

Prefer `useTransition` when you're the one calling `setState`; reach for `useDeferredValue` when a value flows in from outside your control.

### Automatic batching: React 17 vs React 18

| Aspect | React 17 | React 18 (with `createRoot`) |
|---|---|---|
| Batching in event handlers | Yes | Yes |
| Batching in `setTimeout`/promises/native listeners | No — each `setState` triggers its own render | Yes — batched automatically |
| Opt-out mechanism | N/A (already unbatched outside handlers) | `flushSync` forces an immediate, unbatched commit |
| Common mistake | Assuming async-context updates always batch, writing code that (unknowingly) relied on React 17's forced separate renders | Upgrading to React 18 without testing code that relied on the old unbatched-outside-handlers behavior (e.g., checking intermediate DOM state between updates) |

Know this as a real, cited behavior change — it's one of the most commonly asked "what changed in React 18" questions.

### Server Components vs Client Components

| Aspect | Server Components | Client Components |
|---|---|---|
| Where they render | Server only | Client (and optionally pre-rendered on the server for initial HTML) |
| Client JS shipped | None for that component | Ships its JS bundle, hydrates in the browser |
| Can use state/effects/event handlers | No | Yes |
| Can access server resources directly (DB, filesystem) | Yes | No — needs an API or Server Action |
| Common mistake | Trying to use `useState`/`onClick` in a Server Component (build error) | Marking everything `"use client"` out of habit, losing the zero-JS benefit for content that never needed interactivity |

Default to Server Components for static/data-display content in an RSC-enabled framework; add `"use client"` only where you actually need interactivity, state, or browser APIs.

### useEffect vs useSyncExternalStore for subscribing to external stores

| Aspect | `useEffect` + `useState` (manual subscription) | `useSyncExternalStore` |
|---|---|---|
| Concurrent-rendering safety | Can "tear" — different components may read inconsistent snapshots mid-concurrent-render | Designed specifically to avoid tearing, guarantees a consistent snapshot |
| Boilerplate | You write subscribe/unsubscribe and state syncing yourself | Purpose-built hook, less code once you know the API |
| When to use | Rare cases where you're not actually reading a shared external mutable store | Any time you subscribe a component to state that lives outside React (browser APIs, external stores, some state libraries) |
| Common mistake | Using `useEffect` to sync external store state, which works most of the time but can subtly tear under concurrent features | Reaching for it for ordinary React state, where it's unnecessary — it's meant for genuinely external stores |

Most app developers won't call `useSyncExternalStore` directly — it mainly matters when writing or evaluating a state-management library's internals.
