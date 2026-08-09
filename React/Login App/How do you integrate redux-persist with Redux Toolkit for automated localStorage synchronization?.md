Integrating **`redux-persist`** with **Redux Toolkit (RTK)** automates the synchronization of your Redux state with `localStorage` (or `sessionStorage`), ensuring user state persists across page reloads without needing manual `localStorage` calls inside individual reducers.

Here is a complete setup using RTK and `redux-persist`.

---

### Step 1: Install Dependencies

```bash
npm install @reduxjs/toolkit react-redux redux-persist

```

---

### Step 2: Configure Redux Store with `redux-persist` (`app/store.js`)

You need to wrap your root reducer (or specific feature reducers) with `persistReducer` and configure RTK's middleware to ignore non-serializable actions dispatched internally by `redux-persist`.

```javascript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

// 1. Configure Persistence Settings
const persistConfig = {
  key: 'root', // Key in localStorage
  storage,    // Storage engine (localStorage)
  whitelist: ['auth', 'cart'], // Only persist these slices (optional)
  // blacklist: ['search'],    // Exclude specific slices from persisting (optional)
};

// 2. Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

// 3. Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure Redux Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist internal action types to prevent serialization warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create Persistor Engine
export const persistor = persistStore(store);

```

---

### Step 3: Wrap App with `PersistGate` (`index.js` or `main.jsx`)

The `<PersistGate>` component delays rendering your app's UI until the persisted state has been retrieved and rehydrated into the Redux store.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* PersistGate delays rendering until rehydration is complete */}
      <PersistGate loading={<div>Loading saved session...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

```

---

### Step 4: Write Clean Reducers (`features/auth/authSlice.js`)

Notice how your reducers **no longer need any `localStorage.setItem` or `getItem` calls**. Redux Toolkit manages normal state updates, and `redux-persist` handles synchronization in the background.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

```

---

### Step 5: Clearing Persisted State on Logout

When a user logs out, you may want to completely purge the persisted state from `localStorage`:

```javascript
import { persistor } from './app/store';
import { logout } from './features/auth/authSlice';

// Inside your UI Component / Logout Handler
const handleLogout = () => {
  dispatch(logout());
  persistor.purge(); // Permanently deletes the stored state from localStorage
};

```

---

### Key Options Summary

| Configuration Option | Description                                               | Example                                                          |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `key`                | The key name used in `localStorage`                       | `key: 'root'`                                                    |
| `storage`            | Storage engine choice                                     | `import storageSession from 'redux-persist/lib/storage/session'` |
| `whitelist`          | Array of slice names to persist (ignores unlisted slices) | `whitelist: ['auth']`                                            |
| `blacklist`          | Array of slice names to exclude from persistence          | `blacklist: ['uiModal']`                                         |
