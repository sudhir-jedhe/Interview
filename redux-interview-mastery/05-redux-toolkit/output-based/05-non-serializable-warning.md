## Will this trigger a console warning in development?

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { from: null, to: null },
  reducers: {
    setDateRange(state, action) {
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
  },
});

const store = configureStore({ reducer: { filters: filtersSlice.reducer } });

store.dispatch(
  filtersSlice.actions.setDateRange({
    from: new Date('2024-01-01'),
    to: new Date('2024-01-31'),
  })
);
```

**Answer:** Yes — in a development build, `configureStore`'s default `serializableCheck` middleware will log a warning like `A non-serializable value was detected in the state, in the path: filters.from ...` (and a similar one for the dispatched action's payload).

**Why:** `Date` objects are not plain serializable data — RTK's serializability check specifically flags values that aren't plain objects/arrays/primitives (it treats class instances, functions, `Map`/`Set`, Promises, and `Date` objects as non-serializable by default). This check exists because Redux's whole value proposition — time-travel debugging, action replay, persisting/rehydrating state — assumes state and actions can be serialized to JSON and back losslessly; a `Date` silently becomes a string (or breaks entirely) on `JSON.stringify`/`parse`, defeating that.

It's a warning, not a thrown error, so the app keeps working — but the fix is either to store dates as ISO strings/timestamps (`from: date.toISOString()`, converting back to a `Date` only in the component/selector layer that needs one) or, if you have a specific justified case, to configure `serializableCheck: { ignoredPaths: ['filters.from', 'filters.to'] }` in `configureStore`'s middleware options. The senior-engineer default is "store primitives, not Date instances" — reaching for the ignore-list config is the exception, not the norm.
