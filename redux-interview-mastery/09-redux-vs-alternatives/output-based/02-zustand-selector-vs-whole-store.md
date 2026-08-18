## Which of these two components re-renders when `increment` is called, and which doesn't need to?

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  otherFlag: false,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function ComponentA() {
  const state = useStore(); // subscribes to the WHOLE store
  console.log('A render', state.count);
  return null;
}

function ComponentB() {
  const otherFlag = useStore((state) => state.otherFlag); // subscribes to ONE field
  console.log('B render', otherFlag);
  return null;
}
```

**Answer:** Calling `increment()` causes `ComponentA` to re-render, and `ComponentB` does **not** re-render.

**Why:** Zustand's hook, when called with a selector function (`useStore(state => state.otherFlag)`), subscribes the component only to changes in that selector's return value, using `Object.is` by default to compare the previous and new selected value — functionally the same mechanism as `useSelector` in react-redux. `ComponentA` calls `useStore()` with *no* selector, which is Zustand's shorthand for "give me the whole store object and re-render on any change to any field" — the Zustand equivalent of subscribing to the entire Redux root state. This is a genuine footgun for engineers new to Zustand who don't realize omitting the selector opts them out of the library's main render-optimization feature; the fix is always to pass a selector (`useStore(state => state.count)`) unless you deliberately need the whole store's shape.
