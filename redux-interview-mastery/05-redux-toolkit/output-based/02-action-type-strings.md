## What are the generated action type strings here?

```javascript
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    login: (state, action) => { state.user = action.payload; },
    logout: (state) => { state.user = null; },
  },
});

console.log(authSlice.actions.login('alice').type);
console.log(authSlice.actions.logout().type);

// Now imagine two slices, both defining a "reset" reducer:
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: { reset: (state) => { state.items = []; } },
});
console.log(cartSlice.actions.reset().type);
```

**Answer:**
```
auth/login
auth/logout
cart/reset
```

**Why:** `createSlice` derives every action type as the template string `` `${slice.name}/${reducerKey}` ``. This is why the `name` field isn't just a label — it's load-bearing for how dispatched actions are identified and how `extraReducers`/DevTools display them. It's also why two different slices can both have a `reset` reducer without colliding: `auth/reset` and `cart/reset` are distinct type strings even though the reducer function name is identical, because the slice name namespaces it. Interviewers sometimes follow up with "what if two slices accidentally have the *same* `name`?" — then their action types genuinely collide (e.g. both `'user/reset'`), and dispatching one will trigger both slices' `reset` reducer since Redux calls every registered reducer with every action. This is why slice names must be unique across your store.
