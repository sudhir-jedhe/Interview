# Interview Q&A: Thunk Fundamentals

**Q1: Why can't a Redux reducer just do the fetch itself?**

A: Reducers must be pure functions — `(state, action) => newState`, always producing the same output for the same input, with no side effects. Network requests are inherently async and non-deterministic (timing, failure, external state), which breaks purity. Redux's core (`createStore`/`dispatch`) also only accepts synchronous plain-object actions by default — there's no built-in way to "wait" for something before running reducers. Async logic has to live somewhere else in the pipeline: middleware, which sits between `dispatch` and the reducers and is explicitly allowed to be impure.

**Q2: Explain exactly what `redux-thunk` does, mechanically.**

A: It's a middleware that inspects every dispatched value; if it's a function, the middleware calls that function directly with `(dispatch, getState, extraArgument)` instead of forwarding it to `next`/the reducers. If it's a plain object, it's passed through unchanged. An "action creator" that returns a function instead of a `{ type, ... }` object is called a thunk. The thunk function can then call `dispatch` as many times as it wants, whenever it wants (including after awaiting async work), using the exact same `dispatch` the rest of the app uses — it's not a special dispatch, just the same one, called from inside a function instead of from a component.

**Q3: What error do you get if you dispatch a thunk without the thunk middleware registered, and why?**

A: `Error: Actions must be plain objects. Instead, the actual type was: 'function'.` Redux's default `dispatch` (with no middleware, or with middleware that doesn't handle functions) validates that every dispatched value is a plain object with a `type` field, and throws otherwise. Without middleware recognizing "this is a function, treat it specially," a dispatched thunk function is just an invalid action as far as the base store implementation is concerned.

**Q4: What's the standard three-action pattern for a single async operation, and why three instead of just dispatching the result when it's ready?**

A: Pending, fulfilled, rejected — dispatched at request-start, request-success, and request-failure respectively. Three states are needed (not just "dispatch when done") because the UI has to represent "in flight" (loading spinner) distinctly from either terminal outcome, and `pending` must dispatch synchronously the moment the async call is *initiated*, not after it resolves — otherwise there's no way to show a loading indicator at all. Modeling this as a `status` enum (`idle | loading | succeeded | failed`) rather than a loose `isLoading` boolean plus a separately-defaulted `error` avoids representing impossible combinations, like "not loading, no error, but also no data and it's unclear why."
