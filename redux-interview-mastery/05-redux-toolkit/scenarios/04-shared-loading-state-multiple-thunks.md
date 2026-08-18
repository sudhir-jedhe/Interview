# Scenario: One `status: 'loading'` Flag Is Lying to the UI

A settings page dispatches three independent `createAsyncThunk`s on mount — `fetchAccountInfo`, `fetchBillingInfo`, `fetchNotificationPrefs` — all writing into the same slice, and the slice has a single shared `status` field flipped to `'loading'`/`'succeeded'`/`'failed'` by all three thunks' `pending`/`fulfilled`/`rejected` cases. QA reports the loading spinner disappears as soon as the *fastest* of the three requests finishes, even though the other two are still in flight, and sometimes it shows "failed" forever because one thunk's `rejected` case overwrote another's later `fulfilled`.

**Approach:** Give each async operation its own status field instead of sharing one, and only render an aggregate "loading" state by deriving it (e.g., via a selector) from the individual statuses — never by having the reducers themselves race to write a shared flag.

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAccountInfo = createAsyncThunk('settings/fetchAccount', async () => {
  return fetch('/api/account').then((r) => r.json());
});
export const fetchBillingInfo = createAsyncThunk('settings/fetchBilling', async () => {
  return fetch('/api/billing').then((r) => r.json());
});
export const fetchNotificationPrefs = createAsyncThunk('settings/fetchPrefs', async () => {
  return fetch('/api/notification-prefs').then((r) => r.json());
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    account: { data: null, status: 'idle', error: null },
    billing: { data: null, status: 'idle', error: null },
    notificationPrefs: { data: null, status: 'idle', error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountInfo.pending, (state) => { state.account.status = 'loading'; })
      .addCase(fetchAccountInfo.fulfilled, (state, action) => {
        state.account.status = 'succeeded';
        state.account.data = action.payload;
      })
      .addCase(fetchAccountInfo.rejected, (state, action) => {
        state.account.status = 'failed';
        state.account.error = action.error.message;
      })
      .addCase(fetchBillingInfo.pending, (state) => { state.billing.status = 'loading'; })
      .addCase(fetchBillingInfo.fulfilled, (state, action) => {
        state.billing.status = 'succeeded';
        state.billing.data = action.payload;
      })
      .addCase(fetchBillingInfo.rejected, (state, action) => {
        state.billing.status = 'failed';
        state.billing.error = action.error.message;
      })
      .addCase(fetchNotificationPrefs.pending, (state) => { state.notificationPrefs.status = 'loading'; })
      .addCase(fetchNotificationPrefs.fulfilled, (state, action) => {
        state.notificationPrefs.status = 'succeeded';
        state.notificationPrefs.data = action.payload;
      })
      .addCase(fetchNotificationPrefs.rejected, (state, action) => {
        state.notificationPrefs.status = 'failed';
        state.notificationPrefs.error = action.error.message;
      });
  },
});

export default settingsSlice.reducer;

// Aggregate view is derived, not stored — this is the fix for the flickering spinner
export const selectSettingsPageStatus = (state) => {
  const statuses = [
    state.settings.account.status,
    state.settings.billing.status,
    state.settings.notificationPrefs.status,
  ];
  if (statuses.some((s) => s === 'failed')) return 'failed';
  if (statuses.some((s) => s === 'loading')) return 'loading';
  if (statuses.every((s) => s === 'succeeded')) return 'succeeded';
  return 'idle';
};
```

The root cause of the original bug is treating three genuinely independent async operations as if they were one — a shared `status: string` field can only ever hold the *last write wins* result, which is meaningless when three writers race concurrently. Splitting status per-operation makes each thunk's lifecycle correct in isolation, and computing the page-level spinner/error state as a pure derived selector (rather than another piece of stored state that some fourth reducer has to remember to update) keeps there being exactly one source of truth for each of the three requests, with the "are we still loading anything" answer always consistent with them.
