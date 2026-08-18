## Why doesn't the UI update after this "fix"?

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let cachedProfile = null;

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (id) => {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  cachedProfile = data; // a developer tries to "cache" it here for convenience
  return data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null },
  reducers: {
    // a developer, trying to be clever, adds this reducer to "sync" the cache:
    useCachedProfile(state) {
      state.profile = cachedProfile; // reads a module-level variable, not action.payload
    },
  },
});
```

**Answer:** It technically "works" in the sense that `useCachedProfile` does update `state.profile`, but this is a serious anti-pattern that will bite the team: `cachedProfile` is mutable module-level state living *outside* Redux entirely, so it's invisible to DevTools, can't be time-traveled, isn't reset between tests, and — worst of all — is a race condition waiting to happen if two `fetchProfile` calls for different users are in flight concurrently, since the last one to resolve silently overwrites `cachedProfile` regardless of dispatch order.

**Why:** The `async` function passed to `createAsyncThunk` runs entirely *outside* Immer's `produce` — Immer only wraps the case reducers inside `createSlice`'s `reducers`/`extraReducers`, not arbitrary async code. So `cachedProfile = data` here is a genuine, real mutation of a real JS variable, not a tracked Immer draft mutation — there's no immutability protection for anything you do inside a thunk's async body itself. The correct pattern is to let `fetchProfile`'s return value flow through the normal `fulfilled` action and payload (`action.payload`), and never keep parallel "shadow" copies of Redux-managed data in module-level variables, closures, or component instance fields. If the goal was actually caching, that's precisely the problem `createAsyncThunk` (or RTK Query) already solves by storing the result in the one source of truth: the Redux store itself.
