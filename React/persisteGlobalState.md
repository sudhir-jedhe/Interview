To persist global state like **authentication tokens** or **user theme preferences** across page reloads in React, you combine a **global state manager** (like React Context, Zustand, or Redux Toolkit) with browser storage APIs (**`localStorage`**, **`sessionStorage`**, or **`Cookies`**).

Here are the most effective approaches ranging from lightweight React Context to modern state management solutions.

---

## 1. Lightweight Approach: React Context + `localStorage`

For simple global state (like a light/dark theme toggle), combine React Context with `localStorage`.

### Theme Persistence Example:

```tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize state directly from localStorage (lazy initialization)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light"; // SSR safety
    const saved = localStorage.getItem("app_theme") as Theme;
    return (
      saved ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  // Keep localStorage in sync whenever theme state updates
  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

---

## 2. Modern Approach: Zustand with Built-In `persist` Middleware

If you use **Zustand** for global state management, it includes a built-in `persist` middleware that automatically syncs state with `localStorage` or `sessionStorage` in a single line of code.

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: { id: string; name: string } | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth_storage", // Unique key name in localStorage
      storage: createJSONStorage(() => localStorage), // Options: localStorage, sessionStorage
    },
  ),
);
```

---

## 3. Best Practice for Security: Auth Persistence with `httpOnly` Cookies

While `localStorage` works fine for non-sensitive data like themes, **storing authentication tokens (JWTs) in `localStorage` exposes your application to XSS (Cross-Site Scripting) attacks.**

For production-grade authentication:

1. **Tokens in `httpOnly` Cookies:** Have your backend set JWT access tokens in an `httpOnly`, `Secure`, `SameSite=Strict` cookie upon login. JavaScript running in the browser cannot read this cookie, making it immune to XSS.
2. **Re-hydrate User Info on Mount:** On page reload, make an initial fetch request to a `/api/me` endpoint. The browser automatically sends the `httpOnly` cookie along, allowing your React app to populate user state safely.

```tsx
// AuthProvider.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status with backend on page mount/reload
    async function restoreSession() {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  if (isLoading) return <div>Loading app...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Which Storage Should You Use?

| Data Type                          | Recommended Storage               | Why?                                                            |
| ---------------------------------- | --------------------------------- | --------------------------------------------------------------- |
| **Theme / UI Preferences**         | `localStorage`                    | Persists indefinitely across tabs and reloads.                  |
| **Form Steps / Temporary Filters** | `sessionStorage`                  | Auto-clears when the user closes the browser tab.               |
| **Auth Tokens (JWTs)**             | `httpOnly` Cookies + Memory State | Prevents XSS attacks while remaining persistent across reloads. |

Persisting user authentication sessions across page reloads, tab switches, and distinct browser sessions requires balancing **security** (preventing XSS and CSRF attacks) with **user experience** (avoiding constant re-logins).

Here is the industry-standard architecture for achieving secure, seamless session persistence in modern web applications.

---

## The Gold Standard Architecture: Refresh Token + Access Token

Storing raw JWT access tokens in `localStorage` persists sessions across tabs and reloads, but it makes your application vulnerable to **Cross-Site Scripting (XSS)** attacks—any malicious script injected into your page can steal the token.

The standard solution uses a two-token system:

1. **Short-lived Access Token (~15 minutes):** Kept in **in-memory React state**.
2. **Long-lived Refresh Token (~7 to 30 days):** Stored in an **`httpOnly`, `Secure`, `SameSite=Strict` Cookie**.

---

## Step-by-Step Implementation

### Step 1: Set the Refresh Token in an `httpOnly` Cookie (Backend)

When the user logs in, your server generates two tokens and returns the Refresh Token in a cookie that **JavaScript cannot read or modify**:

```javascript
// Node.js / Express Example
app.post("/api/login", async (req, res) => {
  const { user, accessToken, refreshToken } = await authenticateUser(req.body);

  // Set refresh token in httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents XSS script access
    secure: true, // HTTPS only
    sameSite: "strict", // Helps mitigate CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (session persists across browser reloads/closes)
    path: "/api/auth/refresh",
  });

  // Return access token in JSON body
  res.json({ accessToken, user });
});
```

---

### Step 2: Session Re-hydration on Page Reload / Mount (Frontend)

When the user reloads the page or opens a new tab, in-memory React state is wiped clean. On application mount (`useEffect`), call a silent refresh endpoint:

```tsx
// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Re-hydrate session on initial page load / tab open
    async function restoreSession() {
      try {
        // Browser automatically sends the httpOnly refreshToken cookie
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include", // Ensure cookies are sent
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
          setUser(data.user);
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setAccessToken(null);
    setUser(null);
  };

  if (loading) return <div>Loading session...</div>;

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

### Step 3: Synchronizing Logout Across All Open Tabs

If a user logs out in **Tab A**, you want **Tab B** and **Tab C** to immediately log out without requiring a manual page refresh.

Use the browser's native **`BroadcastChannel` API** (or `window.addEventListener('storage')`) to sync auth state across tabs:

```typescript
// authSync.ts
const authChannel = new BroadcastChannel("auth_channel");

// Call this when user logs out in any tab
export function notifyLogout() {
  authChannel.postMessage({ type: "LOGOUT" });
}

// Subscribe inside your AuthProvider
export function useAuthTabSync(onLogout: () => void) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LOGOUT") {
        onLogout(); // Instantly log out this tab too
      }
    };

    authChannel.addEventListener("message", handleMessage);
    return () => authChannel.removeEventListener("message", handleMessage);
  }, [onLogout]);
}
```

---

## Comparison of Persistence Options

| Method                   | Persists Across Reloads? | Persists Across Tabs? | Persists After Browser Restart? | XSS Safe? | Recommended Use Case               |
| ------------------------ | ------------------------ | --------------------- | ------------------------------- | --------- | ---------------------------------- |
| **React State / Memory** | ❌ No                    | ❌ No                 | ❌ No                           | ✅ Yes    | Short-lived Access Tokens          |
| **`httpOnly` Cookie**    | ✅ Yes                   | ✅ Yes                | ✅ Yes (if `maxAge` set)        | ✅ Yes    | **Refresh Tokens (Best Practice)** |
| **`localStorage`**       | ✅ Yes                   | ✅ Yes                | ✅ Yes                          | ❌ No     | Non-sensitive UI data (Theme)      |
| **`sessionStorage`**     | ✅ Yes                   | ❌ No                 | ❌ No                           | ❌ No     | Single-tab form state              |

---

## Summary Checklist

1. **Access Token:** Short lifespan (~15 min), stored in React state/memory.
2. **Refresh Token:** Long lifespan (days/weeks), stored in an `httpOnly`, `Secure`, `SameSite=Strict` cookie.
3. **App Mount (`useEffect`):** Silently post to `/api/auth/refresh` to restore the in-memory access token on reload.
4. **Tab Synchronization:** Use `BroadcastChannel` to send cross-tab `LOGOUT` events in real time.
