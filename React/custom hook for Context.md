Here is a complete, production-ready pattern for creating a React Context. It includes the Provider, the `useMemo` optimization to prevent render thrashing, and a custom hook with strict error handling.

```jsx
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

// 1. Create the Context
// We pass `null` as the default value to strictly catch when the hook is used outside the provider.
const AuthContext = createContext(null);

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use useCallback for functions so their memory references stay stable
  const login = useCallback(async (username) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ name: username, role: 'admin' });
      setIsLoading(false);
    }, 1000);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // 3. Optimize the Provider Value with useMemo
  // This is critical. If we passed `value={{ user, isLoading, login, logout }}` directly,
  // it would create a brand new object on EVERY render of AuthProvider, forcing EVERY
  // consuming component to re-render, even if the data inside didn't change.
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    login,
    logout
  }), [user, isLoading, login, logout]); 
  // The object is only recreated when one of these specific dependencies changes.

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Create the Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  // 5. Error Handling
  // If the context is null, it means the developer forgot to wrap the component tree in <AuthProvider>
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider component tree.');
  }

  return context;
}

```

### Why this pattern is the industry standard

## 1. The Error Handling

If you export the context object directly and a developer uses it outside the provider, the value will default to whatever you passed into `createContext()`. If that was an empty object, the app might fail silently or throw a cryptic `Cannot read properties of undefined` error deep in the component later on.

By defaulting to `null` and actively throwing an error in the custom hook, you get an immediate, descriptive error pointing exactly to the architectural mistake.

## 2. The `useMemo` Optimization

React checks for context updates using referential equality (`Object.is`).
If you write `<AuthContext.Provider login user, value="{{" }}>`, you are creating a new object literal in memory on every single render of the Provider. This bypasses React's bailout mechanisms and forces all child consumers to re-render. Wrapping the value in `useMemo` ensures the memory reference stays identical unless the actual underlying state changes.

## 3. Total Encapsulation

The consumer components never need to know that `AuthContext` or `useContext` even exists. They simply import the hook and use it:

```jsx
import { useAuth } from './AuthContext';

function UserProfile() {
  // Clean, simple, and strongly typed if using TypeScript
  const { user, logout } = useAuth(); 

  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

```
