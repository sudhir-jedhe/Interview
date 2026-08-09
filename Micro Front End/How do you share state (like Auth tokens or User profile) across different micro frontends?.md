Sharing state across independent micro frontends (MFEs) requires a strategy that keeps individual apps loosely coupled while ensuring shared data—like authentication tokens, user profiles, or active themes—remains synchronized across the entire platform.

Here are the **4 industry-standard architectural patterns** to manage cross-MFE state effectively.

---

### Cross-MFE State Sharing Strategies

```text
┌────────────────────────────────────────────────────────┐
│ 1. CUSTOM BROWSER EVENTS (Decoupled, Event-Driven)     │
│    window.dispatchEvent(new CustomEvent('auth:login')) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. REACTIVE OBSERVER STORE (RxJS / Zustand Store)     │
│    Exposed via Shell / Host App Context               │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. BROWSER STORAGE + STORAGE EVENT                     │
│    localStorage + window.addEventListener('storage')   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. MODULE FEDERATION SHARED SINGLETON STORE            │
│    Shared Zustand or Redux Store via Module Federation │
└────────────────────────────────────────────────────────┘

```

---

### 1. Custom Browser Events (Decoupled & Framework-Agnostic)

Using native browser events (`CustomEvent`) is the most decoupled approach. It allows micro frontends written in **different frameworks** (e.g., React, Vue, Angular) to communicate without importing shared state libraries.

#### Publisher (Auth MFE)

```javascript
// Auth Micro Frontend emits an event when user logs in
export function loginUser(userData, token) {
  // Store auth token securely (or in memory)
  sessionStorage.setItem('token', token);

  const event = new CustomEvent('app:auth-change', {
    detail: {
      isAuthenticated: true,
      user: userData,
      token: token,
    },
  });

  window.dispatchEvent(event);
}

```

#### Subscriber (Header / Cart MFE in React)

```jsx
import React, { useState, useEffect } from 'react';

export function HeaderUserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Event listener for auth changes
    const handleAuthChange = (event) => {
      const { isAuthenticated, user } = event.detail;
      setUser(isAuthenticated ? user : null);
    };

    window.addEventListener('app:auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('app:auth-change', handleAuthChange);
    };
  }, []);

  return user ? <div>Welcome, {user.name}!</div> : <button>Login</button>;
}

```

---

### 2. Host Shell Event Bus / RxJS Subject (Centralized Reactive State)

In a Shell + Remote architecture, the **Host App (Shell)** owns global application context (Authentication, Tenant Config, User Profile) and exposes an **Observable / Event Bus** to remotes.

#### Defining the Shared Auth Store (`sharedStore.js` exposed by Host)

```javascript
import { BehaviorSubject } from 'rxjs';

// Initialize with stored state or default null
const initialUser = JSON.parse(localStorage.getItem('user_profile') || 'null');

export const userSubject$ = new BehaviorSubject(initialUser);

export const authStore = {
  // Subscribe to user changes
  subscribe: (callback) => userSubject$.subscribe(callback),

  // Update user state across all MFE subscribers
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_profile');
    }
    userSubject$.next(user);
  },

  getUser: () => userSubject$.getValue(),
};

```

#### Consuming in Remote MFE (React Custom Hook)

```jsx
import { useState, useEffect } from 'react';
import { authStore } from 'hostApp/sharedStore'; // Imported via Module Federation

export function useAuthUser() {
  const [user, setUser] = useState(authStore.getUser());

  useEffect(() => {
    const subscription = authStore.subscribe((updatedUser) => {
      setUser(updatedUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, setUser: authStore.setUser };
}

```

---

### 3. Browser Storage + Storage Event (`localStorage` Sync)

For persisting authentication tokens across page reloads and synchronizing state across multiple browser tabs, use `localStorage` coupled with the native `storage` event.

#### Writing Auth State

```javascript
export function setAuthToken(token) {
  localStorage.setItem('auth_token', token);
  // Manual dispatch for same-window sync (native 'storage' event fires across OTHER tabs)
  window.dispatchEvent(new Event('storage'));
}

```

#### Reading & Syncing Auth State in Any MFE

```javascript
import { useState, useEffect } from 'react';

export function useAuthToken() {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('auth_token'));
    };

    // Syncs across browser tabs
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return token;
}

```

---

### 4. Module Federation Shared Zustand / Redux Store (React Only)

If all micro frontends are built using **React**, you can create a lightweight shared store using **Zustand** or **Redux Toolkit** and declare it as a **Singleton** in Webpack/Vite Module Federation.

#### Step 1: Configure Singleton Sharing in `webpack.config.js` or `vite.config.js`

```javascript
// Both Host and Remote configs MUST declare the store as a shared singleton
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        './src/store/useAuthStore': { singleton: true }, // Ensures single store instance in memory
      },
    }),
  ],
};

```

#### Step 2: Create Zustand Shared Store (`useAuthStore.js`)

```javascript
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

```

#### Step 3: Consume Seamlessly in Any MFE

```jsx
import { useAuthStore } from 'hostApp/useAuthStore';

export function NavigationBar() {
  const { user, logout } = useAuthStore();

  return (
    <nav>
      {user ? (
        <button onClick={logout}>Logout ({user.email})</button>
      ) : (
        <span>Please Log In</span>
      )}
    </nav>
  );
}

```

---

### Architectural Comparison Matrix

| Pattern                              | Framework Agnostic?   | Loose Coupling | Best Use Case                                                               |
| ------------------------------------ | --------------------- | -------------- | --------------------------------------------------------------------------- |
| **Custom Events**                    | **Yes** (100% Native) | Very High      | Simple event notifications (e.g., "login succeeded", "item added to cart"). |
| **RxJS / BehaviorSubject**           | **Yes**               | High           | Dynamic runtime reactivity (Host passes user profile updates to Remotes).   |
| **`localStorage` + `storage` event** | **Yes**               | High           | Persistent session tokens & multi-tab synchronization.                      |
| **Shared Zustand / Redux Store**     | No (React specific)   | Medium         | Deep, multi-variable state sharing in React-only MFE architectures.         |

---

### Golden Rules for Micro Frontend State Management

1. **Keep Global State Minimal:** Only share **Auth tokens**, **User Profile metadata**, **Theme/Locale**, and global notification toasts. Domain-specific state (e.g., Cart items, Search filters) should remain private inside their respective MFE.
2. **Treat Host as Source of Truth:** The Host Shell app should own authentication lifecycle (token acquisition, silent refresh, token expiry redirect).
3. **Never Share Giant State Trees:** Avoid passing an entire monolithic Redux store across remotes—this breaks MFE autonomy and causes massive bundle coupling.
