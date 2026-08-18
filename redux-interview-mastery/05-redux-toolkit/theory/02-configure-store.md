# configureStore: Good Defaults, Zero Ceremony

`configureStore` is RTK's replacement for Redux's `createStore`. The simplest possible usage looks almost too easy compared to classic Redux setup:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import cartReducer from '../features/cart/cartSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
  },
});

export default store;
```

That `reducer` object is doing the job `combineReducers` used to do explicitly — each key becomes a top-level slice of state (`state.counter`, `state.cart`), and `configureStore` calls `combineReducers` internally when you pass an object. You can still pass a single already-combined reducer function if you prefer.

What you get "for free" that used to require manual setup:

**1. The thunk middleware, pre-installed.** No need to `applyMiddleware(thunk)` yourself — `configureStore` calls `getDefaultMiddleware()` internally, which includes `redux-thunk`. This is why every RTK app can dispatch a function action creator (a thunk) without any extra wiring.

**2. Redux DevTools Extension support, pre-wired.** `configureStore` automatically composes the devtools enhancer when the browser extension is present, and it's disabled automatically in production builds by checking `process.env.NODE_ENV`.

**3. Development-only safety middleware.** This is the part interviewers love to probe. `getDefaultMiddleware()` includes two checks that only run in development (they're stripped in production for performance):

- **`serializableCheck`** — walks every dispatched action and every piece of state after each action, warning if it finds non-serializable values (Promises, class instances, Maps, functions, `Date` objects, etc.). Redux's design assumes state and actions are plain serializable data — that's what makes time-travel debugging and persistence possible. This check exists to catch violations early instead of finding out three months later that redux-persist silently dropped a field.
- **`immutableStateInvariantCheck`** — deep-freezes (effectively) and compares state before/after each dispatch to detect accidental direct mutation outside of Immer's control, e.g. a reducer that isn't using `createSlice`.

```javascript
// Customizing middleware while keeping the RTK defaults
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore a specific action type that legitimately carries a File object
        ignoredActions: ['upload/setFile'],
      },
    }).concat(loggerMiddleware),
});
```

Note the pattern: `middleware` takes a *callback* that receives `getDefaultMiddleware`, not a plain array. This lets RTK give you the defaults to extend rather than forcing you to reassemble the whole array (and accidentally drop the thunk middleware) every time you want to add one custom middleware like a logger.

`configureStore` also accepts `devTools` (boolean or options object), `preloadedState`, and `enhancers` for advanced cases, but for the overwhelming majority of apps the two-line `reducer` object above is the entire store setup. The interview-relevant point: RTK didn't add new capabilities Redux didn't have — thunk middleware and devtools existed before RTK too — it just made "the correct setup" the path of least resistance instead of something you had to know to assemble by hand.
