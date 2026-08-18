To share React Context or global state between a Host and Remote application in Vite Module Federation, you must ensure two foundational requirements:

1. **Singleton React Instance:** Both Host and Remote must share the exact same runtime instance of `react` and `react-dom`. If both bundle their own React, React will treat `Context.Provider` and `useContext` as belonging to two different symbol trees, causing `useContext` to return `undefined` (or the default value).
2. **Centralized Store / Context Definition:** The Context object or state atom must either be:

* Exported by a dedicated shared package/npm workspace, OR
* Defined in the Host and shared with Remotes, OR
* Defined in a Remote and imported by the Host.

Here are the two primary ways to implement this using `@originjs/vite-plugin-federation`.

---

### Approach 1: React Context (Host Exposes Context & Provider)

In this setup, the Host defines the `AuthContext` and `AuthProvider`, wraps its application tree with it, and exposes it so the Remote can import and consume the exact same context instance.

#### 1. Configure Singleton Sharing in Both Vite Configs

Both `host/vite.config.ts` and `remote/vite.config.ts` must configure `react` and `react-dom` in `shared`:

```typescript
// host/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      filename: 'remoteEntry.js',
      // Host exposes the AuthContext and Provider
      exposes: {
        './AuthContext': './src/context/AuthContext.tsx',
      },
      remotes: {
        remoteApp: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
  },
  server: { port: 5000 },
});

```

```typescript
// remote/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      exposes: {
        './UserProfile': './src/components/UserProfile.tsx',
      },
      remotes: {
        // Remote references the host to consume the context
        hostApp: 'http://localhost:5000/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
  },
  server: { port: 5001, cors: true },
  preview: { port: 5001, cors: true },
});

```

---

#### 2. Define Context & Provider in Host (`host/src/context/AuthContext.tsx`)

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr_101',
    name: 'Sarah Connor',
    role: 'Admin',
  });

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

```

---

#### 3. Wrap Host Root with Provider (`host/src/App.tsx`)

```tsx
import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

const RemoteUserProfile = lazy(() => import('remoteApp/UserProfile'));

function HostContent() {
  const { user, logout, login } = useAuth();

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2>Host Shell</h2>
      <p>Current User in Host: <strong>{user ? user.name : 'Logged out'}</strong></p>
      
      {user ? (
        <button onClick={logout}>Log Out (from Host)</button>
      ) : (
        <button onClick={() => login({ id: '1', name: 'John Doe', role: 'User' })}>
          Log In
        </button>
      )}

      <hr style={{ margin: '20px 0' }} />

      <Suspense fallback={<div>Loading Remote Component...</div>}>
        <RemoteUserProfile />
      </Suspense>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <HostContent />
    </AuthProvider>
  );
}

export default App;

```

---

#### 4. Consume the Context inside Remote Component (`remote/src/components/UserProfile.tsx`)

```tsx
import React from 'react';
// Import context hook exposed from Host
import { useAuth } from 'hostApp/AuthContext';

export const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '16px', border: '1px solid #7c3aed', borderRadius: '8px' }}>
      <h3 style={{ color: '#7c3aed', margin: '0 0 10px 0' }}>Remote User Profile</h3>
      {user ? (
        <div>
          <p>Name: <strong>{user.name}</strong></p>
          <p>Role: <code>{user.role}</code></p>
          <button onClick={logout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout from inside Remote
          </button>
        </div>
      ) : (
        <p>No user authenticated.</p>
      )}
    </div>
  );
};

export default UserProfile;

```

---

### Approach 2: Lightweight Shared Store (Zustand / Nano Stores)

If you want state to be framework-agnostic or avoid bidirectional remote dependencies (Host depending on Remote, and Remote depending on Host), share an external store package (like Zustand or Nano Stores) via the `shared` config.

#### 1. Add Store to `shared` in Both Configs

```typescript
// in both host/vite.config.ts and remote/vite.config.ts
shared: ['react', 'react-dom', 'zustand']

```

#### 2. Define the Store in a Shared Package or Host

```typescript
// sharedStore.ts
import { create } from 'zustand';

interface SessionState {
  token: string | null;
  user: { name: string } | null;
  setSession: (token: string, user: { name: string }) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  user: null,
  setSession: (token, user) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
}));

```

Because `zustand` is declared as a shared singleton, both Host and Remote update and subscribe to the exact same store instance in memory.

---

### Summary Checklist for Shared State in Vite MF

| Requirement                         | Setting / Action                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| **Avoid duplicate React instances** | `shared: ['react', 'react-dom']` in both host and remote configs.                        |
| **Top-Level Await support**         | `build.target: 'esnext'` in both configs.                                                |
| **CORS enablement**                 | `server.cors: true` and `preview.cors: true` on the Remote.                              |
| **Context Provider placement**      | The Provider component must wrap the subtree *above* the remote component's mount point. |
