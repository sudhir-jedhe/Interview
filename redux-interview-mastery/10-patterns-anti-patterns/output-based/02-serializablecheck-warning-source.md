## What warning does RTK's default middleware log, and which line caused it?

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const uploadSlice = createSlice({
  name: 'upload',
  initialState: { status: 'idle', file: null, startedAt: null },
  reducers: {
    uploadStarted(state, action) {
      state.status = 'uploading';
      state.file = action.payload.file;         // line X
      state.startedAt = new Date();              // line Y
    },
  },
});

const store = configureStore({ reducer: { upload: uploadSlice.reducer } });

store.dispatch(uploadSlice.actions.uploadStarted({ file: new File([], 'photo.png') }));
```

**Answer:** RTK's default `serializableCheck` middleware logs a console warning like:
```
A non-serializable value was detected in the state, in the path: `upload.startedAt`. Value: Sat Jan 01 2026 ...
A non-serializable value was detected in the state, in the path: `upload.file`. Value: File {...}
```
Both `state.startedAt = new Date()` and `state.file = action.payload.file` (a `File` object, which is a browser `Blob` subclass — a class instance, not plain data) trigger the check.

**Why:** `configureStore` enables `serializableCheck` by default in development, which recursively walks both dispatched actions and the resulting state tree looking for values that aren't plain serializable data (checking for functions, `Symbol`s, `Map`/`Set`, class instances, and non-JSON-safe values like `Date` and `Promise`). It's a dev-only safety net specifically because these values silently break Redux DevTools' state serialization and can cause subtle bugs in equality checks. The fix here: store `startedAt` as `Date.now()` (a plain number) instead of a `Date` instance, and don't store the raw `File` object in Redux state at all — keep the `File` reference in local component state or a ref for the actual upload call, and store only serializable metadata about it in Redux (`fileName: file.name, fileSize: file.size`) if that metadata needs to be globally accessible.
