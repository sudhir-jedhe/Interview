# Scenario: A feature needs cancellable, sequenced async flows — is thunk still the right tool?

**Problem:** A "live search" feature needs to: debounce keystrokes, cancel any in-flight search request when a newer keystroke arrives (to avoid a slow, stale response overwriting a faster, newer one), and show a "searching..." indicator only if the request takes longer than 300ms (to avoid UI flicker for fast responses). The current thunk-based implementation is accumulating manual `AbortController` bookkeeping, timer IDs stored in module-level variables, and started to have race-condition bugs where a stale response occasionally does overwrite fresher data.

**Approach:**
1. Acknowledge thunk's actual scope honestly: thunk is a thin, general-purpose "let dispatch accept a function" mechanism — it provides no built-in support for cancellation, sequencing, or debouncing; all of that has to be hand-rolled with vanilla JS primitives (`AbortController`, `setTimeout`, manually tracked "is this still the latest request" flags), which is exactly the kind of bookkeeping that's easy to get subtly wrong under real-world timing.
   ```javascript
   // Thunk with manual cancellation bookkeeping — this is what starts to hurt
   let currentController = null;
   function search(query) {
     return async (dispatch) => {
       if (currentController) currentController.abort();
       currentController = new AbortController();
       const thisController = currentController;
       try {
         const res = await fetch(`/api/search?q=${query}`, { signal: thisController.signal });
         if (thisController.signal.aborted) return; // stale, ignore
         dispatch({ type: 'search/succeeded', payload: await res.json() });
       } catch (err) {
         if (err.name !== 'AbortError') dispatch({ type: 'search/failed', payload: err.message });
       }
     };
   }
   ```
2. Present the alternatives honestly, as a tradeoff rather than "thunk is wrong": Redux Toolkit's **RTK Query** is purpose-built for exactly this class of problem (request deduplication, automatic cancellation on unmount/param change, caching) and would eliminate most of this hand-rolled logic for a data-fetching use case; **Redux Saga**'s generator-based `takeLatest` effect natively expresses "cancel the previous instance of this flow when a new one starts," which is precisely the debounce/cancel-stale-request pattern being hand-built here.
3. Make the call based on team context, not novelty: if the app already has a couple of other flows with similar cancellation/sequencing needs, the fixed cost of introducing Saga or RTK Query pays for itself; if this is an isolated case, a well-tested, encapsulated custom hook (`useDebouncedSearch`) wrapping the existing thunk might be a smaller, more contained fix than adopting a new async paradigm app-wide.
4. In this case: recommend RTK Query specifically, since the feature is fundamentally "fetch data based on changing parameters, don't let stale responses win" — exactly RTK Query's core use case — while a fully generator-based Saga would be a heavier paradigm shift for a codebase that doesn't otherwise use sagas.

The point for an interview: knowing thunk's implementation (a ~5-line middleware) is exactly what lets you reason clearly about what it *doesn't* give you for free, and make an informed call about when to reach for a more specialized tool instead of forcing thunk to do something it wasn't designed for.
