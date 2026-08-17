# Interview Questions: React 18/19 Features

**Q: What is concurrent rendering, and does it make React "faster"?**
Concurrent rendering means React can start rendering an update, pause it midway if something more urgent comes in (like user input), work on the urgent update, and then resume or discard the paused one. It doesn't make any single render computationally faster — it makes the app feel more responsive by letting React prioritize urgent work over less important work, rather than blocking the main thread on whatever render started first.

**Q: What does `useTransition` actually do, and what does the `isPending` flag mean?**
It gives you a function (`startTransition`) to wrap a state update in, telling React that update is non-urgent and can be interrupted by higher-priority updates. `isPending` is `true` while that transitioned update is still being processed, letting you show a subtle loading indicator without blocking the rest of the UI.

**Q: When would you use `useDeferredValue` instead of `useTransition`?**
`useDeferredValue` is for when you have a value (often a prop, or state you don't directly control the setter for) and want a lagging, deferred version of it for an expensive computation, rather than wrapping the update that produced it. `useTransition` requires you to control the `setState` call itself; `useDeferredValue` works even when you only receive the value from elsewhere.

**Q: What changed with batching in React 18?**
In React 17, multiple `setState` calls were only batched into a single re-render when they occurred inside a React event handler; calls made inside `setTimeout`, promise callbacks, or native event listeners each triggered their own separate render. React 18 (via `createRoot`) batches automatically in all of these contexts, reducing unnecessary re-renders app-wide without any code changes.

**Q: How would you opt out of automatic batching for a specific update?**
Wrap the `setState` call in `flushSync` from `react-dom`, which forces React to apply that update and re-render synchronously before continuing, rather than batching it with other updates. This should be rare — it's an escape hatch for edge cases (like needing the DOM to reflect an update before a subsequent synchronous measurement), not a default habit.

**Q: What is a React Server Component, conceptually, and how is it different from server-side rendering (SSR)?**
A Server Component renders exclusively on the server and never ships its JavaScript to the client at all — there's no hydration for it, and it can directly access server-only resources like a database. Traditional SSR still renders the *same* client component code on the server for the initial HTML, but that component's JS is still sent to the browser afterward to hydrate and become interactive; RSC components skip that entirely because they have no client-side behavior to hydrate.

**Q: What does the `"use client"` directive do?**
Placed at the top of a file in an RSC-enabled framework, it marks that module (and everything it imports) as a Client Component boundary — it opts into client-side rendering, enabling hooks like `useState`, event handlers, and browser APIs, at the cost of shipping JS to the browser. Without it, components default to Server Components in that framework's convention.

**Q: What is `"use server"` for, and how is it different from a normal API route?**
It marks a function as a Server Action — callable directly from client-side code (e.g., a form's `action`) but guaranteed to execute on the server, letting you perform server-only work (database writes, secrets access) without manually defining and wiring a separate REST/API endpoint. The framework handles serializing the call across the network boundary.

**Q: What is `useId` for, and why shouldn't you use it as a list key?**
It generates a stable, unique ID string per component instance, primarily intended for linking accessibility attributes like `htmlFor`/`id` or `aria-describedby`, and it's designed to match consistently between server-rendered and client-hydrated markup. It's unsuitable as a list `key` because it's tied to a component instance's position/identity in the tree, not to the identity of a specific data item — list keys should come from stable data (like an item's database ID), not from `useId`.

**Q: What problem does `useSyncExternalStore` solve that `useEffect` + `useState` doesn't fully solve?**
It guarantees a consistent snapshot of an external (non-React) data source across all components reading it within the same concurrent render, preventing "tearing" — a bug where different parts of the UI briefly show inconsistent values from the same store during a concurrent update. A manual `useEffect`/`useState` subscription can't make that same consistency guarantee under concurrent rendering.

**Q: If you're not writing a state management library, do you need to reach for `useSyncExternalStore` yourself?**
Rarely — it's a low-level primitive mostly used internally by library authors (e.g., Redux, Zustand bindings) or for direct subscriptions to browser APIs (`navigator.onLine`, `matchMedia`). Most application code either uses React's own state or a library that already wraps `useSyncExternalStore` correctly.
