# 05 — Redux Toolkit

Redux Toolkit (RTK) is the official, opinionated way to write Redux today. It doesn't change Redux's core model (single store, pure reducers, unidirectional data flow) — it removes the boilerplate and footguns of writing that model by hand: manual action type constants, manual immutable updates, and manual store/middleware wiring.

## Key points

- **Why RTK exists** — plain Redux requires a lot of repetitive, error-prone ceremony (action types, action creators, switch reducers, manual `combineReducers`/`applyMiddleware` setup). RTK bundles `redux` + `redux-thunk` + `reselect` and gives you `configureStore`, `createSlice`, and `createAsyncThunk` to do the same job with far less code.
- **`configureStore`** — replaces `createStore`. Auto-adds the thunk middleware, Redux DevTools support, and dev-only `serializableCheck`/`immutableStateInvariantCheck` middleware, all without extra configuration. `middleware` takes a callback receiving `getDefaultMiddleware` so you extend, not replace, the defaults.
- **`createSlice`** — generates action creators and action type strings (`${name}/${reducerKey}`) from your reducer function names, and wraps each reducer with Immer so you can write `state.items.push(x)`-style "mutations" that are actually converted into safe, immutable updates under the hood.
- **`createAsyncThunk`** — generates `pending`/`fulfilled`/`rejected` action creators for an async operation from a single payload-creator function, handled in a slice's `extraReducers` via the builder callback (`builder.addCase(...)`).
- **RTK Query** — a data-fetching/caching layer built on top of RTK (`createApi`), purpose-built for server-cache state: caching, request deduplication, and tag-based cache invalidation, exposed as auto-generated React hooks. It complements, rather than replaces, `createSlice`/`createAsyncThunk`, which remain the right tool for client-owned state.

## Index

### theory/
- `01-why-redux-toolkit.md` — the boilerplate/footgun problem RTK solves, and the "batteries included" philosophy.
- `02-configure-store.md` — what `configureStore` auto-configures: thunk middleware, devtools, dev-only safety checks.
- `03-create-slice-and-immer.md` — generated actions/types, Immer draft mechanics, mutate-vs-return rules, `prepare` callbacks.
- `04-create-async-thunk.md` — generated pending/fulfilled/rejected actions, `extraReducers`, `thunkAPI`, `rejectWithValue`.
- `05-rtk-query-overview.md` — conceptual overview of `createApi`, caching, tags, auto-generated hooks.

### snippets/
- `01-configure-store-basic.js` — minimal two-slice store setup.
- `02-create-slice-counter.js` — a basic counter slice with generated actions.
- `03-create-slice-with-prepare.js` — `{ reducer, prepare }` notation with `nanoid`.
- `04-create-async-thunk-basic.js` — a bare `createAsyncThunk` and its generated action creators.
- `05-extra-reducers-builder.js` — full `extraReducers` builder-callback handling of an async thunk.
- `06-rtk-query-api-slice.js` — a minimal `createApi` slice with query/mutation and tag invalidation.
- `07-middleware-customization.js` — extending `getDefaultMiddleware` with a custom logger and serializableCheck options.

### output-based/
- `01-immer-draft-return.md` — mutating the draft *and* returning a value in the same reducer.
- `02-action-type-strings.md` — how generated action type strings are derived and can collide.
- `03-nested-mutation-array.md` — deep nested mutation and structural sharing of untouched branches.
- `04-thunk-argument-order.md` — the single-`arg` + `thunkAPI` parameter contract of payload creators.
- `05-non-serializable-warning.md` — the dev-only `serializableCheck` warning triggered by storing a `Date`.
- `06-multiple-slices-combine.md` — dispatching a hand-written action object alongside generated ones.
- `07-state-outside-immer.md` — why mutating a module-level variable inside a thunk's async body is unsafe.

### scenarios/
- `01-migrating-legacy-reducer.md` — migrating one legacy slice to RTK under deadline pressure.
- `02-optimistic-update-cart.md` — optimistic "add to cart" with precise rollback on failure.
- `03-normalized-entities-with-rtk.md` — fixing deeply nested duplicated state with `createEntityAdapter`.
- `04-shared-loading-state-multiple-thunks.md` — splitting a shared `status` flag that races across three thunks.

### interview-qa/
- `01-rtk-fundamentals-qa.md` — what RTK is, what `configureStore` gives you, action type derivation, RTK Query's role.
- `02-createslice-immer-qa.md` — Immer draft mechanics, mutate-vs-return, property reassignment, `prepare`.
- `03-async-thunk-rtk-query-qa.md` — `createAsyncThunk` generated actions, `extraReducers`, `rejectWithValue`, when to choose RTK Query.

### problems/
- `01-convert-classic-reducer-to-slice.md` — convert a hand-written action-types/actions/reducer module to `createSlice`.
- `02-async-thunk-user-profile.md` — `createAsyncThunk` for a user profile fetch with stale-response protection via `requestId`.
- `03-immer-safe-mutation-demo.md` — assertions proving Immer never mutates the real input state.

### projects/rtk-counter-cart/
- `README.md` — how to run the project and what to try.
- `package.json` — dependencies (`@reduxjs/toolkit`, `react-redux`, React, Vite).
- `src/app/store.js` — `configureStore` wiring `counterSlice` + `cartSlice`.
- `src/features/counter/counterSlice.js` — counter slice with a configurable step.
- `src/features/cart/cartSlice.js` — cart slice with quantity merging and derived-total selectors.
- `src/components/Counter.jsx` — `useSelector`/`useDispatch` counter UI.
- `src/components/Cart.jsx` — `useSelector`/`useDispatch` cart UI with a small product catalog.
- `src/App.jsx` — composes `Counter` + `Cart`.
- `src/main.jsx` — `<Provider store={store}>` root.

### assets/
- `README.md` — placeholder for original notes' images/PDFs.
