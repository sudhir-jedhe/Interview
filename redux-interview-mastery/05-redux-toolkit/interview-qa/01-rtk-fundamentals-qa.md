# Interview Q&A: Redux Toolkit Fundamentals

**Q1: What problem does Redux Toolkit solve, and is it a different library from Redux?**

A: It's not a different library — it's the officially recommended way to write Redux, built on top of the same core `redux` package. It solves the boilerplate and footgun problems of "vanilla" Redux: manually written action type constants, action creators, switch-statement reducers with manual immutable spreading, and manual store setup (middleware, devtools). RTK bundles `redux`, `redux-thunk`, and `reselect`, and provides `configureStore`, `createSlice`, and `createAsyncThunk` as opinionated, batteries-included APIs that produce the same store/action/reducer model with far less code and fewer ways to get it wrong.

**Q2: What does `configureStore` give you automatically that plain `createStore` didn't?**

A: Three things without any extra configuration: the thunk middleware (so you can dispatch functions, not just plain action objects), Redux DevTools Extension integration (auto-disabled in production), and two development-only safety checks — `serializableCheck` (warns if actions/state contain non-serializable values like class instances, functions, or `Date`/`Map` objects) and `immutableStateInvariantCheck` (detects accidental direct state mutation outside Immer). Both checks are stripped out in production builds for performance.

**Q3: How does `createSlice` decide the action type strings, and why does that matter?**

A: The type is always `` `${name}/${reducerKey}` ``, where `name` is the slice's `name` field and `reducerKey` is the key of the reducer function inside the `reducers` object. It matters because it removes an entire class of bugs — mistyped action type string constants — and because it means slice `name`s must be unique across the store; two slices with the same `name` and a reducer of the same key would produce colliding type strings, and Redux dispatches every action to every registered reducer, so both would fire.

**Q4: Someone on your team says "RTK Query replaces `createSlice` and `createAsyncThunk`." Do you agree?**

A: No — they solve different problems. `createSlice`/`createAsyncThunk` are the right tools for state you own and manage yourself, including hand-rolled async flows. RTK Query is specifically for *server-cache* state — data whose source of truth lives on a server and is mirrored into the client with caching, deduplication, and invalidation semantics. Most real apps use both: RTK Query (or `createAsyncThunk`) for API data, and `createSlice` for genuine client-only state like form inputs, modal visibility, or UI preferences. Reaching for RTK Query doesn't eliminate the need to model client state well.
