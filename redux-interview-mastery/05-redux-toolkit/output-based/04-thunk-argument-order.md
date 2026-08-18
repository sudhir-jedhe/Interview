## What does `arg` refer to in each of these three payload creators?

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

const thunkA = createAsyncThunk('a/go', async () => {
  return fetch('/api/ping').then((r) => r.json());
});

const thunkB = createAsyncThunk('b/go', async (userId) => {
  return fetch(`/api/users/${userId}`).then((r) => r.json());
});

const thunkC = createAsyncThunk('c/go', async (userId, thunkAPI) => {
  const state = thunkAPI.getState();
  return fetch(`/api/users/${userId}?role=${state.auth.role}`);
});

// dispatched as:
dispatch(thunkA());
dispatch(thunkB(42));
dispatch(thunkC(42));
```

**Answer:** `thunkA`'s payload creator takes no meaningful argument (its `_arg` slot is unused/`undefined`). `thunkB`'s single parameter, `userId`, is bound to whatever you pass to `thunkB(...)` — here, `42`. `thunkC`'s **second** parameter is always the `thunkAPI` object (`{ dispatch, getState, rejectWithValue, signal, extra, ... }`), never a second "argument" you pass yourself — `createAsyncThunk`'s payload creator is only ever called with **one** user-supplied argument, no matter how much data you need.

**Why:** `createAsyncThunk(typePrefix, payloadCreator)` calls your `payloadCreator` as `payloadCreator(arg, thunkAPI)`. The `arg` position is a single value — if you need to pass multiple pieces of data into a thunk, you must bundle them into one object: `dispatch(thunkC({ userId: 42, role: 'admin' }))` and destructure inside. A common mistake is trying `dispatch(thunkC(42, 'admin'))` expecting two independent arguments — the second value there is simply ignored, because the thunk action creator itself only accepts one argument (which becomes `action.meta.arg`), and `thunkAPI` is *always* injected by RTK itself as the second parameter of the payload creator, not something the caller controls.
