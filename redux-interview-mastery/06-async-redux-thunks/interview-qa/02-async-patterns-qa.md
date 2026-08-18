# Interview Q&A: Async Patterns — Cancellation, Races, Debouncing

**Q1: How do you cancel an in-flight fetch when a React component using a thunk unmounts?**

A: Pass an `AbortController`'s `signal` into the `fetch` call from inside the thunk (`fetch(url, { signal })`), created in the component's `useEffect`, and call `controller.abort()` in the effect's cleanup function. Inside the thunk, catch `AbortError` specifically and treat it as a silent, expected cancellation rather than dispatching a `rejected`/failure action — the request didn't fail, it was intentionally stopped. It's also good practice to pair this with a state-based guard (e.g., checking that the request's id/subject still matches "the current one" before dispatching `fulfilled`) to cover races that abort alone doesn't fully close, like a same-component prop change that doesn't fully unmount.

**Q2: Two requests for the same data are dispatched close together (e.g., user clicks a filter twice quickly). How do you make sure the older response doesn't overwrite the newer one if they resolve out of order?**

A: Tag each dispatch with a unique, monotonically distinguishing identifier (a counter, a timestamp, or `createAsyncThunk`'s built-in `requestId`), store "which id is current" in state (or a closure variable) when the request starts, and in the success/failure handler, compare the response's id against the current one — if it doesn't match, discard the response instead of applying it. This is necessary because network response order isn't guaranteed to match request order; relying on "the last one dispatched, in code, is the last one to resolve" is not a safe assumption.

**Q3: How would you implement debounced search-as-you-type with a thunk, and what's the pitfall people miss?**

A: Split the "update visible input text" dispatch (must stay instant, on every keystroke) from the "actually fire the network request" dispatch (should be delayed via `setTimeout`, with each new keystroke clearing the previous timer via `clearTimeout`). The pitfall: debouncing alone reduces the *number* of requests but doesn't eliminate the possibility that two distinct debounced requests still resolve out of order over a variable-latency connection — so a staleness check (comparing the resolved query against the current state) is still needed on top of debouncing, not instead of it.

**Q4: What's the difference between debouncing and throttling in this context, and does it matter for Redux specifically?**

A: Debouncing delays execution until a pause in activity (fires once, `delayMs` after the *last* event in a burst); throttling limits execution to at most once per fixed interval regardless of how many events occur (fires periodically *during* a burst, not just after). For search-as-you-type, debouncing is almost always the right choice — you want the final, settled query, not intermediate ones. Throttling is more relevant for things like a "sync scroll position" action, where you want periodic updates during continuous activity rather than a single delayed final one. Redux itself has no opinion on this — it's purely a question of how the thunk (or saga's `debounce`/`throttle` effect) decides when to call `dispatch`.
