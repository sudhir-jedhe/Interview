# Interview Q&A: Context vs Redux

**Q: "Why not just use Context instead of Redux?" — what's the sharpest possible answer?**
A: Context is a transport mechanism (avoids prop drilling); it has no opinion on how values change over time. Redux is a state-management architecture (actions, reducers, middleware, DevTools) that happens to use Context internally as its transport. Comparing them directly is comparing a delivery truck to a warehouse's entire inventory system — you can build a small inventory system out of just a truck (`useReducer` + Context), but you're rebuilding, by hand, pieces the warehouse system already gives you: audit logs (DevTools), receiving procedures (middleware), and shelf-lookup indexes (selectors).

**Q: What specifically do you lose going from `useSelector`-based Redux to `useContext`?**
A: Primarily, subscription granularity. `useSelector` re-renders a component only when its specific selected value changes, by reference. `useContext` re-renders a component whenever the *entire* context value changes, regardless of which field the component reads — because Context has no concept of "subscribe to a slice of this value." This becomes a real performance problem once you bundle multiple independently-changing pieces of state into one Provider's value.

**Q: Is "Context is bad for frequently-changing state" universally true?**
A: Not universally — it's true for state whose *updates are frequent and independently-scoped* per consumer, because every consumer re-renders on every update regardless of relevance. It's a non-issue for state that changes rarely (a theme setting, an authenticated user object that's set once at login) or for a context whose only consumers are components that would need to re-render on any change anyway. The mitigation, when it does matter, is splitting into multiple contexts by concern, or memoizing the context value with `useMemo`.

**Q: Can you combine Context and Redux in the same app, or is it one-or-the-other?**
A: They're commonly combined, and this isn't unusual — `<Provider store={store}>` from react-redux *is* a Context provider under the hood. Teams often use Redux for shared, cross-cutting application state and plain Context for narrowly-scoped, rarely-changing values like a theme or feature-flag set, where introducing a full Redux slice would be unnecessary ceremony for something that's essentially a constant passed down the tree.
