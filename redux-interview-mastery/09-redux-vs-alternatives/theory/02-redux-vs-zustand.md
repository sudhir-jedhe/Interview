# Redux vs Zustand

Zustand is the most common "why does my team use Redux and not this" question in 2024+ interviews, because it directly targets Redux's most criticized property: boilerplate.

## The boilerplate difference, concretely

A Redux Toolkit counter slice:

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => { state.value += 1; },
    decremented: (state) => { state.value -= 1; },
  },
});

export const { incremented, decremented } = counterSlice.actions;
const store = configureStore({ reducer: { counter: counterSlice.reducer } });

// Component:
// const value = useSelector((state) => state.counter.value);
// const dispatch = useDispatch();
// dispatch(incremented());
```

The equivalent in Zustand:

```javascript
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
  decrement: () => set((state) => ({ value: state.value - 1 })),
}));

// Component:
// const value = useCounterStore((state) => state.value);
// const increment = useCounterStore((state) => state.increment);
// increment();
```

Zustand collapses "action creator + action type + reducer + selector wiring" into one plain object with methods that call `set` directly. There's no `<Provider>` required — `useCounterStore` is a standalone hook, importable and usable anywhere, including outside React components (useful for non-component code like WebSocket handlers).

## What you're trading away

Zustand's flexibility is also its cost for larger teams:

- **No action-type convention.** Redux's `{ type, payload }` shape, enforced everywhere, means any engineer can look at DevTools' action log and understand *what happened* without reading component code. Zustand's `set` calls can be named however each engineer likes, and without discipline, "what changed and why" becomes harder to audit from the outside.
- **No built-in middleware ecosystem to the same depth.** Zustand has middleware (`persist`, `devtools`, `immer`) but the ecosystem and conventions around async flows, undo/redo, and action-based logging are far more mature and standardized in Redux, particularly for large codebases with many contributors.
- **Less structural enforcement.** Redux's separation of actions/reducers/selectors is opinionated by design — it's harder to "cheat" and couple state shape to a specific component's needs. Zustand doesn't enforce that separation; a store can become a grab-bag of mixed concerns if a team doesn't self-impose conventions.

## When each wins

Zustand wins for small-to-medium apps, prototypes, or teams that value speed and minimal ceremony over enforced structure — you get most of the ergonomic benefits (no prop drilling, selective subscriptions via its selector-based hook API, no unnecessary re-renders) with a fraction of the code. Redux (specifically Redux Toolkit) wins when you need the enforced conventions, the mature async/middleware ecosystem, or you're joining/scaling a large team where "everyone writes state updates the same way" has real value independent of raw code volume. See `04-when-redux-still-wins.md` for the fuller decision framework.
