## After this runs, what does `useStore.getState()` return?

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  user: { name: 'Ada', age: 30 },
  theme: 'dark',
}));

useStore.setState({ user: { name: 'Grace' } }); // note: no `age` field passed

console.log(useStore.getState());
```

**Answer:**
```javascript
{ user: { name: 'Grace' }, theme: 'dark' }
```
Note: `user.age` is gone — it's `undefined`, not preserved as `30`.

**Why:** Zustand's `set`/`setState` does a *shallow* merge at the top level of the store only — `theme` is correctly preserved because it's a sibling top-level key that wasn't touched, but `user` itself is *replaced entirely* by the object passed in, not deep-merged. This surprises people coming from `this.setState` in React class components, which also only shallow-merges, but especially surprises people who assume "Redux-like" libraries merge deeply the way `{ ...state, ...changes }` intuition sometimes suggests for nested objects. To update just `user.name` while preserving `user.age`, you must spread the nested object explicitly yourself: `set((state) => ({ user: { ...state.user, name: 'Grace' } }))`. This is functionally identical to the immutable-update discipline Redux reducers require — Zustand doesn't eliminate the need for correct immutable updates on nested data, it just removes the action-type/reducer-function ceremony around them. (Zustand's `immer` middleware exists specifically to add Immer-style draft mutation for teams that want to avoid writing these nested spreads by hand, the same way RTK's `createSlice` does for Redux.)
