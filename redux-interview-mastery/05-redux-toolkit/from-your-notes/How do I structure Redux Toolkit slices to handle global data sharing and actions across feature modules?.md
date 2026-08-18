When structuring **Redux Toolkit (RTK)** in a large, feature-based React application, the key challenge is balancing **feature encapsulation** (keeping code modular and co-located) with **global cross-feature communication** (allowing Feature A to react to actions dispatched by Feature B).

Here is an architectural guide to structuring Redux Toolkit slices for clean data sharing and cross-feature action handling.

---

## 1. Domain-Driven Slice Structure

Group your slices inside their respective feature folders (`src/features/[feature-name]/model/`). Avoid placing all slices in a single global `src/redux/slices/` folder.

```text
src/
├── app/
│   ├── store.ts              # Root store combining feature reducers
│   └── rootReducer.ts
│
├── features/
│   ├── auth/                 # Feature 1: Auth Module
│   │   └── model/
│   │       ├── authSlice.ts  # Controls token, user profile, auth state
│   │       └── authSelectors.ts
│   │
│   ├── cart/                 # Feature 2: Shopping Cart
│   │   └── model/
│   │       ├── cartSlice.ts  # Listens to auth actions (e.g., clear cart on logout)
│   │       └── cartSelectors.ts
│   │
│   └── user/                 # Feature 3: User Settings
│       └── model/
│         ├── userSlice.ts
│         └── userSelectors.ts

```

---

## 2. Handling Cross-Feature Actions (`extraReducers`)

The biggest mistake in Redux architecture is forcing Feature A to import and dispatch actions from Feature B (e.g., `dispatch(clearCart())` inside `authSlice` or an auth component). This creates tight coupling.

Instead, use **`extraReducers`** with `builder.addCase`. This allows any slice to independently listen for and react to actions dispatched by *other* feature slices.

### Example: Clearing Cart State when User Logs Out

#### A. Auth Feature Dispatches Logout (`features/auth/model/authSlice.ts`)

```typescript
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: { id: string; name: string } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

```

#### B. Cart Feature Listens to Logout (`features/cart/model/cartSlice.ts`)

`cartSlice` listens to `auth/logout` using `extraReducers` and resets its own state automatically without coupling the Auth component to Cart logic.

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../../auth/model/authSlice'; // Import the action creator from Auth

interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
  },
  // Listen to external actions from other features
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      // Automatically reset cart state when user logs out
      state.items = [];
    });
  },
});

export const { addItem } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

```

---

## 3. Shared Global Actions (`createAction`)

When an action is truly domain-agnostic and affects multiple feature modules simultaneously (e.g., `RESET_APP_STATE` or `NOTIFICATION_TRIGGERED`), create a dedicated **shared global action** using `createAction`.

### A. Define Shared Global Action (`src/app/actions.ts`)

```typescript
import { createAction } from '@reduxjs/toolkit';

// A global action triggered during full app resets or session timeouts
export const resetEntireApp = createAction('app/resetEntireApp');

```

### B. Handle Global Action in Any Feature Slice

Any feature slice can listen to `resetEntireApp` using `extraReducers`:

```typescript
// features/user/model/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { resetEntireApp } from '../../../app/actions';

export const userSlice = createSlice({
  name: 'user',
  initialState: { preferences: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetEntireApp, () => {
      return { preferences: {} }; // Resets user state to initial
    });
  },
});

```

---

## 4. Cross-Feature Data Sharing via Reselect (`createSelector`)

Never duplicate state across slices just because Component A needs data from both `auth` and `cart`. Keep state normalized in its owner slice and derive cross-feature views using **Reselect memoized selectors**.

### Cross-Feature Selector (`features/cart/model/cartSelectors.ts`)

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

// 1. Input Selectors
const selectCartItems = (state: RootState) => state.cart.items;
const selectUser = (state: RootState) => state.auth.user;

// 2. Combined Memoized Selector
export const selectUserCartSummary = createSelector(
  [selectCartItems, selectUser],
  (items, user) => {
    return {
      userName: user ? user.name : 'Guest',
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
      isEligibleForDiscount: Boolean(user && items.length > 3),
    };
  }
);

```

---

## 5. Root Store Setup (`src/app/store.ts`)

Combine feature slice reducers into a root reducer using standard Redux Toolkit configuration.

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/model/authSlice';
import { cartReducer } from '../features/cart/model/cartSlice';
import { userReducer } from '../features/user/model/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

---

## Architectural Best Practices

1. **Slice Autonomy:** A slice should own its own piece of state exclusively. No slice should mutate state outside its own `initialState` scope.
2. **Event-Driven via `extraReducers`:** Use `extraReducers` whenever a slice needs to respond to events originating from other domain slices.
3. **Use RTK Query for Server State:** Do not store API responses in standard Redux slices manually. Use **RTK Query** for caching, fetching, and cache invalidation. Standard slices should only store true client-side UI state.
4. **Avoid Circular Imports:** If Slice A imports an action from Slice B and Slice B imports an action from Slice A, it will cause runtime errors. Resolve this by extracting the shared action to a common `app/actions.ts` file.
