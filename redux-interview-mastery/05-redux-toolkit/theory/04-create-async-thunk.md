# createAsyncThunk: Standardized Async Action Lifecycles

Before RTK, handling an async request in Redux meant hand-writing three action creators and three case-reducer branches every single time: one for "request started" (to flip on a loading spinner), one for "request succeeded" (to store the data), one for "request failed" (to store the error). It's the same shape every time, and `createAsyncThunk` exists to stop you from re-deriving it.

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, thunkAPI) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      // reject with a serializable value, not the raw Error
      return thunkAPI.rejectWithValue(await response.json());
    }
    return response.json(); // becomes action.payload of the fulfilled action
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});
```

## What `createAsyncThunk` generates

Calling `createAsyncThunk('user/fetchProfile', payloadCreator)` returns a thunk action creator, and as a side effect it also creates **three plain action creators** you don't have to write:

- `fetchUserProfile.pending` → type `'user/fetchProfile/pending'`, dispatched synchronously the moment the thunk starts running.
- `fetchUserProfile.fulfilled` → type `'user/fetchProfile/fulfilled'`, dispatched when the payload creator's promise resolves; `action.payload` is whatever you returned.
- `fetchUserProfile.rejected` → type `'user/fetchProfile/rejected'`, dispatched if the promise throws, or if you explicitly call `thunkAPI.rejectWithValue(...)`.

You dispatch it exactly like a normal thunk: `dispatch(fetchUserProfile(userId))`. Internally, `createAsyncThunk` wraps your `payloadCreator` in a function that dispatches `pending`, awaits your async logic, and dispatches `fulfilled` or `rejected` based on the outcome — the same manual pattern you'd write by hand with `redux-thunk` alone, just generated.

## `extraReducers`, not `reducers`

Because the three async action types are generated *outside* the slice (by `createAsyncThunk`, before `createSlice` even runs), a slice can't reference them inside its `reducers` map — reducers only auto-generates actions for reducer functions defined in that same object. Instead, you handle them in `extraReducers`, using the **builder callback** notation (`builder.addCase(...)`), which is the recommended API over the older object-map syntax because it's fully typed and gives you autocomplete for the action's payload shape.

## `thunkAPI` and `rejectWithValue`

The payload creator's second argument, conventionally called `thunkAPI`, exposes `dispatch`, `getState`, `signal` (an `AbortController` signal — useful for cancellation), `extra` (whatever "extra argument" was configured on the thunk middleware, often an API client), and `rejectWithValue`. Calling `rejectWithValue(errorPayload)` is important: if you just `throw` a raw `Error`, RTK still dispatches `rejected`, but `action.payload` is `undefined` and the message ends up on the non-serializable `action.error` object — `rejectWithValue` lets you put a serializable, UI-friendly error shape onto `action.payload` instead, which is what your `rejected` reducer above reads.

`createAsyncThunk` doesn't replace `redux-thunk` — it's built on top of it and still needs the thunk middleware present, which `configureStore` provides by default. It removes the "write three actions and three reducer cases by hand every time" tax, nothing more, nothing less.
