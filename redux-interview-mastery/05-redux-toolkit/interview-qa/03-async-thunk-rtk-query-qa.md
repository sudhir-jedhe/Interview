# Interview Q&A: createAsyncThunk and RTK Query

**Q1: Walk through exactly what `createAsyncThunk('user/fetch', payloadCreator)` generates.**

A: It returns a thunk action creator function, and it also attaches three plain action creators to that function as properties: `.pending` (type `'user/fetch/pending'`, dispatched immediately when the thunk starts), `.fulfilled` (type `'user/fetch/fulfilled'`, dispatched with `action.payload` set to whatever your `payloadCreator` returned, once its promise resolves), and `.rejected` (type `'user/fetch/rejected'`, dispatched if the promise throws or if you call `thunkAPI.rejectWithValue(...)`). When you `dispatch(thunkActionCreator(arg))`, RTK internally dispatches `pending`, awaits your async logic, then dispatches `fulfilled` or `rejected` based on the outcome — the exact sequence you'd hand-write with plain `redux-thunk`, just generated for you.

**Q2: Why do you handle `createAsyncThunk`'s actions in `extraReducers` instead of `reducers`?**

A: Because the three action creators (`pending`/`fulfilled`/`rejected`) are created by `createAsyncThunk` itself, independently of and typically before the `createSlice` call — they don't originate from a key in that slice's `reducers` map, so `createSlice` has no way to auto-generate a matching action creator for them (there's nothing to generate; they already exist). `extraReducers` is specifically the mechanism for a slice to respond to actions it doesn't itself define — using the builder callback's `builder.addCase(actionCreator, reducerFn)`, which also gives full TypeScript inference of the payload shape.

**Q3: What's the difference between letting a thunk's promise reject naturally vs. calling `rejectWithValue`?**

A: If your payload creator just throws (or an `await`ed call rejects) without calling `rejectWithValue`, RTK still dispatches the `rejected` action, but `action.payload` is `undefined` — the error ends up on `action.error` (a serialized version of the `Error`, with `message`/`name`/`stack`). If you call `return thunkAPI.rejectWithValue(someSerializableErrorShape)`, that value becomes `action.payload` on the `rejected` action instead — which is useful because your `rejected` reducer can then read a predictable, serializable, UI-appropriate error shape (e.g. `{ status: 404, message: 'Not found' }`) from `action.payload` rather than parsing a generic `Error` object.

**Q4: When would you choose `createAsyncThunk` over RTK Query, given RTK Query exists?**

A: `createAsyncThunk` is still the right choice for async operations that aren't really "fetch and cache a resource" — a one-off action like "submit this form and navigate away," a background job, a multi-step process that dispatches several different thunks and coordinates other state changes, or anything where you want full manual control over what state means and when it's fetched. RTK Query is optimized specifically for the "GET a resource, cache it, dedupe concurrent requests for it, invalidate it on writes" pattern; forcing something that doesn't fit that shape (e.g., a complex wizard flow with side effects between steps) into RTK Query endpoints is often more awkward than a couple of well-organized thunks.
