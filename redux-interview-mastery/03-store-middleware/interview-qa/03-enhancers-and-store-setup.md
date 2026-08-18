# Interview Q&A: Enhancers and Store Setup

**Q: Is `applyMiddleware` a middleware or an enhancer?**
A: An enhancer. It's a function that, given `createStore`, returns a new `createStore`-shaped function which produces a store whose `dispatch` has been wrapped with the composed middleware chain. It's passed as `createStore`'s third argument (the enhancer slot) — there's no separate "middleware slot" in the raw `createStore` API; `applyMiddleware` is simply the standard, built-in enhancer for installing middleware.

**Q: What can a store enhancer do that a middleware cannot?**
A: Middleware only intercepts the flow of dispatched actions on their way to the reducer — it can't change what `getState()` returns beyond what the reducer computes, add new methods to the store object, or alter how the store is constructed. An enhancer wraps the entire `createStore` function, so it can replace or augment any part of the resulting store — `getState`, `subscribe`, add wholly new methods, or intercept construction itself (e.g., rehydrating state from persisted storage before the store even exists). Redux DevTools is implemented as an enhancer specifically because it needs whole-state snapshotting and replacement (for time travel), which is outside what a `store => next => action` middleware can express.

**Q: How do `configureStore`'s `middleware` option and manually calling `applyMiddleware` relate?**
A: `configureStore` handles enhancer/middleware wiring for you, including a sensible default (thunk plus dev-mode immutability/serializability checks) and DevTools integration, all built on top of the same underlying `applyMiddleware`/enhancer mechanism that classic `createStore` exposes directly. Passing a `middleware` callback to `configureStore` (`(getDefaultMiddleware) => getDefaultMiddleware().concat(myMiddleware)`) is the modern equivalent of manually calling `applyMiddleware(thunk, ..., myMiddleware)` — `configureStore` is a convenience wrapper, not a different underlying mechanism.

**Q: If you need both custom middleware and a custom enhancer, how do you combine them?**
A: Use Redux's `compose` utility to combine `applyMiddleware(...)` (itself an enhancer) with any other enhancer, then pass the composed result as `createStore`'s third argument: `createStore(rootReducer, compose(applyMiddleware(thunk, logger), someOtherEnhancer))`. `configureStore` handles this composition internally when you pass both a `middleware` option and an `enhancers` option, so manual `compose` calls are mostly only needed with classic `createStore`.
