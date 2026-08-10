In modern front-end system design, **routing** and **protected routes** form the core navigation architecture of single-page applications (SPAs).

Here is how routing works conceptually, followed by the strategies for seamless navigation, and a complete production-grade implementation in React.

---

## 1. Routing & Protected Routes in Front-End Architecture

### Front-End Routing (Client-Side Routing)

Unlike traditional multi-page applications (MPAs) where every navigation sends a GET request to a backend server for a new HTML page, client-side routing Intercepts URL changes in the browser.

The router parses the browser URL (`window.location.pathname`) using the HTML5 History API (`pushState`, `replaceState`, `popstate` event) and dynamically renders the corresponding UI tree without triggering a full-page reload.

### Protected Routes

A **Protected Route** is a structural guard wrapper placed around restricted UI components. It evaluates a dynamic state check (authentication status, JWT validity, user permissions, user roles) before resolving the route:

* **Authenticated/Authorized:** Renders the requested child view.
* **Unauthenticated/Unauthorized:** Intercepts rendering, redirects the browser to an access control view (e.g., `/login` or `/unauthorized`), and optionally stores the requested URL to perform a post-login redirect back to the intended path.

---

## 2. Techniques for Dynamic, Seamless Navigation

To achieve instantaneous transitions without UI jank, white flashes, or layout shifts, apply these core techniques:

1. **Code-Splitting & Route Pre-fetching:** Split the bundle by route chunk (`React.lazy`). When a user hovers over a navigation link or button, pre-fetch the dynamic `import()` for that page in the background before they click.
2. **Optimistic UI & Suspense Granular Boundaries:** Wrap lazy routes in fallback skeletons. Render skeleton views instantly while assets load.
3. **State Retention Across Navigation:** Keep global layout frames (Header, Sidebar, Navigation Rail) mounted outside route transition zones so only the content body re-renders.
4. **Scroll Restoration Control:** Automatically restore scroll position on back/forward browser button clicks, while scrolling to top on new route pushes.

---

## 3. Production React Implementation

Here is a complete, scalable routing setup featuring dynamic auth context, protected route wrappers, pre-fetched lazy loading, suspense fallbacks, and scroll control.

### Step 1: Auth Context (`AuthContext.js`)

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate reading session/token from storage or API
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

```

---

### Step 2: Protected Route Guard (`ProtectedRoute.js`)

```jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="spinner-loader">Checking permissions...</div>;
  }

  // Redirect to login if unauthenticated, preserving intended URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based Access Control (RBAC) check
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

```

---

### Step 3: Seamless Navigation Hook with Route Pre-fetching (`useSeamlessNavigate.js`)

```jsx
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook providing navigation with asset pre-fetching for instant page transitions.
 */
export const useSeamlessNavigate = () => {
  const navigate = useNavigate();

  const prefetchRoute = (factory) => {
    try {
      factory(); // Triggers React.lazy / dynamic import() download ahead of time
    } catch (e) {
      // Ignore prefetch network errors
    }
  };

  return { navigate, prefetchRoute };
};

```

---

### Step 4: Scroll Restoration Controller (`ScrollToTop.js`)

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

```

---

### Step 5: Master App Router Assembly (`App.js`)

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { ScrollToTop } from './ScrollToTop';
import { useSeamlessNavigate } from './useSeamlessNavigate';

// Lazy-loaded route chunks
const HomeImport = () => import('./pages/Home');
const DashboardImport = () => import('./pages/Dashboard');
const AdminImport = () => import('./pages/Admin');

const Home = lazy(HomeImport);
const Dashboard = lazy(DashboardImport);
const Admin = lazy(AdminImport);

const Navigation = () => {
  const { prefetchRoute } = useSeamlessNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <h2>Front-End System</h2>
      <div>
        <Link 
          to="/" 
          onMouseEnter={() => prefetchRoute(HomeImport)}
          style={styles.link}
        >
          Home
        </Link>
        <Link 
          to="/dashboard" 
          onMouseEnter={() => prefetchRoute(DashboardImport)}
          style={styles.link}
        >
          Dashboard (Protected)
        </Link>
        <Link 
          to="/admin" 
          onMouseEnter={() => prefetchRoute(AdminImport)}
          style={styles.link}
        >
          Admin (Role Protected)
        </Link>
        
        {isAuthenticated ? (
          <button onClick={() => { logout(); navigate('/'); }} style={styles.button}>
            Logout ({user?.name})
          </button>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = (role) => {
    login({ name: 'Jane Doe', role });
    navigate(from, { replace: true });
  };

  return (
    <div style={styles.page}>
      <h1>Login View</h1>
      <p>Select role to authenticate:</p>
      <button onClick={() => handleLogin('user')} style={styles.button}>Login as Regular User</button>
      <button onClick={() => handleLogin('admin')} style={{ ...styles.button, marginLeft: 10 }}>Login as Admin</button>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navigation />
        
        <main style={styles.main}>
          {/* Suspense handles layout stability during chunk fetch */}
          <Suspense fallback={<div style={styles.skeleton}>Loading view assets...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<div style={styles.page}>403 - Access Denied</div>} />

              {/* Protected User Route */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Route with RBAC */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<div style={styles.page}>404 - Page Not Found</div>} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#1e293b', color: '#fff' },
  link: { color: '#38bdf8', marginRight: '1rem', textDecoration: 'none' },
  button: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  main: { padding: '2rem' },
  page: { padding: '2rem', background: '#f8fafc', borderRadius: '8px' },
  skeleton: { padding: '3rem', textAlign: 'center', background: '#e2e8f0', borderRadius: '8px', color: '#64748b' }
};

```

How do you handle automatic JWT token refresh and session expiration handling during route transitions in React?

Handling automatic JWT token refresh and session expiration during route transitions requires coordinating **Axios/Fetch interceptors**, **React Router navigation guards**, and a **centralized authentication context**.

The goal is to ensure tokens are silently refreshed before or upon expiration without dropping the user's current route or state, while cleanly evicting expired sessions.

---

## 1. System Architecture & Lifecycle Flow

```
  Route Navigation / Data Fetch Triggered
                    |
                    v
         [ Axios / Fetch Request ]
                    |
                    +---> Token Valid? ---> Continue to API & Render Route
                    |
                    +---> Token Expired (401 Response)
                                |
                                v
               [ Single-Flight Refresh Lock ]
                   /                        \
      (First Request)                      (Concurrent Requests)
             |                                       |
    Executes Refresh Call                    Queued in Promise Buffer
             |                                       |
   +---------+---------+                             |
   |                   |                             |
[Success]          [Failed]                          v
   |                   |                Wait for First Request to finish,
Store new         Trigger Session       then retry with NEW Token
Tokens &          Expiration & 
Retry Original    Redirect to Login
Request

```

---

## 2. Token Storage Architecture & Token Lifecycle

* **Access Token (Short-Lived, ~15 mins):** Kept in **In-Memory React State** (or closure variables). Storing access tokens in `localStorage` exposes them to XSS attacks.
* **Refresh Token (Long-Lived, ~7 days):** Stored in an **`HttpOnly`, `SameSite=Strict`, `Secure` cookie** managed by the server, OR stored in `localStorage` if strictly necessary due to cross-domain setup. Using `HttpOnly` cookies prevents JavaScript from accessing the refresh token directly.

---

## 3. Production Implementation in React

### Step 1: Axios Client with Concurrency Lock & Promise Queue (`apiClient.js`)

When multiple API requests fire simultaneously during a route transition (e.g., fetching user profile, notifications, and analytics on Dashboard mount), an expired token will cause *all* requests to return a `401 Unauthorized`.

To avoid making multiple parallel `/refresh` API calls, use a **single-flight refresh queue mechanism**.

```javascript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com',
  withCredentials: true, // Crucial to send HttpOnly Refresh Cookie
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Memory store for short-lived access token
let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

// 1. Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    if (inMemoryAccessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Catch 401 and Handle Silent Refresh
export const setupResponseInterceptor = (onSessionExpired) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if error is 401 and not already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Prevent infinite loop if refresh token itself returns 401
        if (originalRequest.url === '/auth/refresh') {
          onSessionExpired();
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
          // Queue all concurrent requests while refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // Call endpoint to fetch a new access token
          const response = await apiClient.post('/auth/refresh');
          const { accessToken } = response.data;

          setAccessToken(accessToken);
          processQueue(null, accessToken);

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          onSessionExpired(); // Hard log out user
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

```

---

### Step 2: Auth Context with Proactive Expiration Pre-Check (`AuthContext.js`)

Rather than relying purely on reactive `401` interceptors, evaluate JWT payload expiration (`exp`) **proactively** during route transitions.

```jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setAccessToken, setupResponseInterceptor, apiClient } from './apiClient';

const AuthContext = createContext(null);

// Utility to parse JWT claims without external library
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleLogout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    // Optionally trigger API logout to clear HttpOnly cookie
    apiClient.post('/auth/logout').catch(() => {});
  }, []);

  // Setup Axios interceptors on mount
  useEffect(() => {
    setupResponseInterceptor(handleLogout);
  }, [handleLogout]);

  // Check initial authentication state (e.g., page refresh)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await apiClient.post('/auth/refresh');
        const { accessToken, userData } = response.data;
        setAccessToken(accessToken);
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Helper function called by Protected Route Guards before rendering a new page.
   * Proactively checks if token is about to expire (< 30 seconds left).
   */
  const checkOrRefreshToken = async () => {
    const token = getAccessToken();
    if (!token) return false;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;

    // Token has less than 30 seconds left -> Refresh proactively
    if (timeUntilExpiry < 30) {
      try {
        const res = await apiClient.post('/auth/refresh');
        setAccessToken(res.data.accessToken);
        return true;
      } catch (e) {
        handleLogout();
        return false;
      }
    }

    return true; // Token is still valid
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isInitializing,
        logout: handleLogout,
        checkOrRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

```

---

### Step 3: Route Transition Protection Guard (`ProtectedRoute.js`)

Wrap sensitive routes with an async validation step that checks and refreshes credentials **before** mounting the target view component.

```jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, isInitializing, checkOrRefreshToken } = useAuth();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (user) {
        const valid = await checkOrRefreshToken();
        if (isMounted) {
          setIsTokenValid(valid);
          setIsCheckingToken(false);
        }
      } else {
        if (isMounted) {
          setIsCheckingToken(false);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]); // Re-verify on every route transition

  if (isInitializing || isCheckingToken) {
    return <div className="loading-screen">Verifying Session...</div>;
  }

  if (!user || !isTokenValid) {
    // Preserve current URL in location.state for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

```

---

## 4. Key Security & Design Edge Cases

| Scenario                                        | Architectural Solution                                                                                                                                                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Multiple Parallel API Calls on Route Change** | Managed by the **`isRefreshing` flag and `failedQueue` array** in the Axios response interceptor. Subsequent calls wait in a pending promise queue until the primary refresh completes.                          |
| **User Inactive in Background Tab**             | Use the `Page Visibility API` (`document.addEventListener('visibilitychange')`). When `document.visibilityState === 'visible'`, fire `checkOrRefreshToken()` so the app updates before the user interacts again. |
| **Expired Refresh Token (Hard Session Expiry)** | Interceptor receives a `401` from `/auth/refresh`. Instantly clears in-memory state, rejects queued promises, and forces a redirect to `/login` using the router.                                                |
| **XSS Defense**                                 | Keep the short-lived access token strictly in JavaScript closure memory (`inMemoryAccessToken`) and long-lived credentials in `HttpOnly` cookies. Never write access tokens to `localStorage`.                   |

How do you synchronize authentication state and logouts across multiple browser tabs using BroadcastChannel in React?

Synchronizing authentication state and logout events across multiple browser tabs requires a multi-tab communication mechanism. The **`BroadcastChannel` API** is ideal for this because it allows same-origin browser contexts (tabs, windows, iframe, or web workers) to pass real-time messages directly without going through a server or polling `localStorage`.

Here is a production-ready design using React, `BroadcastChannel`, and Axios.

---

## 1. System Architecture

```
+--------------------------+                      +--------------------------+
|          TAB A           |                      |          TAB B           |
|  (User clicks "Logout")  |                      |    (Passive View Tab)    |
+--------------------------+                      +--------------------------+
             |                                                 |
             v                                                 v
  [ Local Session Clean ]                             [ BroadcastChannel ]
             |                                                 |
             +---> Emits Message: { type: 'LOGOUT' } --------->| (Receives Message)
                                                               |
                                                               v
                                                    [ Clears Local Memory ]
                                                               |
                                                               v
                                                    [ Redirects to /login ]

```

---

## 2. Event Payload Schema

A standardized message schema prevents race conditions and type errors:

```typescript
type AuthEventType = 'LOGOUT' | 'LOGIN' | 'TOKEN_REFRESHED';

interface AuthChannelMessage {
  type: AuthEventType;
  payload?: {
    user?: any;
    accessToken?: string;
    timestamp: number;
  };
}

```

---

## 3. Implementation in React

### Step 1: Broadcaster Utility & Custom Hook (`useAuthBroadcast.js`)

Using a custom React hook encapsulates `BroadcastChannel` initialization, message dispatching, and teardown logic on unmount.

```javascript
import { useEffect, useRef, useCallback } from 'react';

const CHANNEL_NAME = 'auth_channel';

export const useAuthBroadcast = (onMessageReceived) => {
  const channelRef = useRef(null);

  useEffect(() => {
    // 1. Initialize channel on the same origin
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    // 2. Listen for events broadcast from other tabs
    channel.onmessage = (event) => {
      if (event.data && onMessageReceived) {
        onMessageReceived(event.data);
      }
    };

    // 3. Clean up on unmount
    return () => {
      channel.close();
    };
  }, [onMessageReceived]);

  // Dispatcher method to broadcast messages to all OTHER tabs
  const broadcast = useCallback((type, payload = {}) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type,
        payload: {
          ...payload,
          timestamp: Date.now(), // Helps ignore stale events
        },
      });
    }
  }, []);

  return { broadcast };
};

```

---

### Step 2: Global Integration (`AuthContext.js`)

Integrate `BroadcastChannel` into your global `AuthContext` so that when a user logs in, logs out, or receives a new access token in Tab A, all other open tabs immediately sync their local state.

```jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuthBroadcast } from './useAuthBroadcast';
import { setAccessToken, apiClient } from './apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Helper to purge local memory state
  const clearLocalAuth = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  // Handle messages received from other tabs
  const handleCrossTabMessage = useCallback((message) => {
    switch (message.type) {
      case 'LOGOUT':
        // Another tab logged out -> Purge local memory & state immediately
        clearLocalAuth();
        break;

      case 'LOGIN':
        // Another tab logged in -> Update user profile and token
        setAccessToken(message.payload.accessToken);
        setUser(message.payload.user);
        break;

      case 'TOKEN_REFRESHED':
        // Another tab ran silent refresh -> Sync token to memory
        setAccessToken(message.payload.accessToken);
        break;

      default:
        break;
    }
  }, [clearLocalAuth]);

  // Initialize Broadcast Channel hook
  const { broadcast } = useAuthBroadcast(handleCrossTabMessage);

  // 1. Triggered on explicit user logout OR session expiration
  const logout = useCallback(async (notifyOthers = true) => {
    clearLocalAuth();

    // Call server to invalidate HttpOnly cookie / session
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }

    if (notifyOthers) {
      // Broadcast logout event to all other open tabs
      broadcast('LOGOUT');
    }
  }, [clearLocalAuth, broadcast]);

  // 2. Triggered on successful login
  const login = useCallback((userData, accessToken) => {
    setAccessToken(accessToken);
    setUser(userData);

    // Notify other tabs to log in automatically
    broadcast('LOGIN', { user: userData, accessToken });
  }, [broadcast]);

  // 3. Triggered when token refresh completes in one tab
  const notifyTokenRefreshed = useCallback((newAccessToken) => {
    setAccessToken(newAccessToken);
    broadcast('TOKEN_REFRESHED', { accessToken: newAccessToken });
  }, [broadcast]);

  return (
    <AuthContext.Provider value={{ user, login, logout, notifyTokenRefreshed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

```

---

### Step 3: Browser Fallback Mechanism (for older browsers)

While `BroadcastChannel` is supported across all modern browsers, you can build a clean fallback using the `window.addEventListener('storage')` event.

```javascript
import { useEffect } from 'react';

// Fallback utility for legacy environments
export const useStorageFallback = (onLogout) => {
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') return; // Skip if BroadcastChannel is supported

    const handleStorageChange = (event) => {
      // Fires when localStorage is altered in another tab
      if (event.key === 'app_logout_signal') {
        onLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [onLogout]);

  const triggerStorageLogout = () => {
    if (typeof BroadcastChannel === 'undefined') {
      localStorage.setItem('app_logout_signal', Date.now().toString());
    }
  };

  return { triggerStorageLogout };
};

```

---

## 4. Key Edge Cases & Safeguards

| Challenge                                   | Solution Strategy                                                                                                                                                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Self-Messaging Avoidance**                | `BroadcastChannel.postMessage()` **automatically skips sending to itself** by design. Only *other* tabs listening on the channel receive the event.                                                                                               |
| **Duplicate `/auth/refresh` Calls**         | When access tokens expire, only **one tab** should send a request to the server. Use `BroadcastChannel` to emit `TOKEN_REFRESHED` so background tabs update their in-memory token instantly without making redundant HTTP calls.                  |
| **Handling Tab Inactivity / Sleeping Tabs** | Web browsers throttle JS execution in background tabs. When a user switches back to an inactive tab, combine `BroadcastChannel` state updates with a quick `document.addEventListener('visibilitychange')` check to ensure credentials are valid. |

How do you implement a cross-tab single-flight token refresh lock using Web Locks API or BroadcastChannel in React?

When multiple tabs are open simultaneously and an access token expires, every tab might try to trigger a `/auth/refresh` request at the same time. This leads to **thundering herd issues**, race conditions, and invalidation errors (especially when the backend uses refresh token rotation, where using an old refresh token twice invalidates the entire session).

To solve this, you can implement a **cross-tab single-flight refresh lock**. The **Web Locks API** (`navigator.locks`) is the gold standard for this because it provides true distributed lock semantics across browser contexts natively, while `BroadcastChannel` distributes the newly acquired token to waiting tabs.

---

## 1. System Architecture & Lock Flow

```
   TAB A (Acquires Lock)                         TAB B (Blocked on Lock)
             |                                             |
   Request Lock: 'auth_refresh'                  Request Lock: 'auth_refresh'
             |                                             |
      [ Lock GRANTED ]                              [ Lock WAITING ]
             |                                             |
Sends POST /auth/refresh API                               |
             |                                             |
             v                                             |
    Received New Token                                     |
             |                                             |
Broadcasts: TOKEN_REFRESHED ------------------------------>| Receives TOKEN_REFRESHED
             |                                             |
      [ Lock RELEASED ]                                    |
                                                    [ Lock GRANTED ]
                                                           |
                                                Detects fresh token already 
                                                acquired -> Bypasses API call!

```

---

## 2. Cross-Tab Refresh Lock Manager (`tokenRefreshLock.js`)

This module encapsulates the Web Locks API coordination with a `BroadcastChannel` notification network and a fallback for legacy browsers without Web Locks support.

```javascript
import { getAccessToken, setAccessToken } from './apiClient';

const LOCK_NAME = 'cross_tab_auth_refresh_lock';
const CHANNEL_NAME = 'cross_tab_auth_channel';

// Central BroadcastChannel for dynamic token sync across tabs
const authChannel = typeof BroadcastChannel !== 'undefined' 
  ? new BroadcastChannel(CHANNEL_NAME) 
  : null;

/**
 * Main cross-tab single-flight refresh coordinator.
 * @param {Function} refreshApiCall Async function that performs the actual HTTP refresh request.
 * @returns {Promise<string>} The new access token.
 */
export async function executeSingleFlightRefresh(refreshApiCall) {
  const initialToken = getAccessToken();

  // 1. Check if Web Locks API is supported natively
  if ('locks' in navigator) {
    return navigator.locks.request(LOCK_NAME, async () => {
      // INSIDE THE LOCK:
      // Another tab might have acquired the lock first and refreshed the token while we were waiting!
      const currentToken = getAccessToken();
      if (currentToken && currentToken !== initialToken) {
        // Token was already updated by the previous lock holder -> Skip API call
        return currentToken;
      }

      // We are the leader tab -> Perform the actual network request
      return await performRefreshAndBroadcast(refreshApiCall);
    });
  }

  // 2. Fallback for older environments without Web Locks API
  return await fallbackSingleFlightRefresh(refreshApiCall, initialToken);
}

/**
 * Executes the refresh API call and broadcasts the new token to all sibling tabs.
 */
async function performRefreshAndBroadcast(refreshApiCall) {
  try {
    const response = await refreshApiCall();
    const { accessToken } = response.data;

    // Update in-memory token for the leader tab
    setAccessToken(accessToken);

    // Broadcast new token to all follower tabs
    if (authChannel) {
      authChannel.postMessage({
        type: 'TOKEN_REFRESHED',
        accessToken,
        timestamp: Date.now(),
      });
    }

    return accessToken;
  } catch (error) {
    // Notify follower tabs if refresh failed completely
    if (authChannel) {
      authChannel.postMessage({
        type: 'TOKEN_REFRESH_FAILED',
        error: error.message,
        timestamp: Date.now(),
      });
    }
    throw error;
  }
}

/**
 * Fallback mechanism using BroadcastChannel + Promise Race for legacy browsers.
 */
function fallbackSingleFlightRefresh(refreshApiCall, initialToken) {
  return new Promise((resolve, reject) => {
    let resolved = false;

    // Listen for broadcast from another tab currently refreshing
    const handleMessage = (event) => {
      if (resolved) return;

      if (event.data?.type === 'TOKEN_REFRESHED') {
        resolved = true;
        cleanup();
        setAccessToken(event.data.accessToken);
        resolve(event.data.accessToken);
      } else if (event.data?.type === 'TOKEN_REFRESH_FAILED') {
        resolved = true;
        cleanup();
        reject(new Error(event.data.error));
      }
    };

    const cleanup = () => {
      if (authChannel) {
        authChannel.removeEventListener('message', handleMessage);
      }
    };

    if (authChannel) {
      authChannel.addEventListener('message', handleMessage);
    }

    // Set a small delay before attempting to execute to give leader tab precedence
    setTimeout(async () => {
      if (resolved) return;

      const currentToken = getAccessToken();
      if (currentToken && currentToken !== initialToken) {
        resolved = true;
        cleanup();
        return resolve(currentToken);
      }

      try {
        const newToken = await performRefreshAndBroadcast(refreshApiCall);
        resolved = true;
        cleanup();
        resolve(newToken);
      } catch (err) {
        resolved = true;
        cleanup();
        reject(err);
      }
    }, Math.floor(Math.random() * 50)); // Jitter delay
  });
}

// Global listener to update token in background tabs as soon as broadcast arrives
if (authChannel) {
  authChannel.addEventListener('message', (event) => {
    if (event.data?.type === 'TOKEN_REFRESHED') {
      setAccessToken(event.data.accessToken);
    }
  });
}

```

---

## 3. Integrating with Axios Interceptor (`apiClient.js`)

Plug `executeSingleFlightRefresh` directly into your Axios response interceptor. This makes intra-tab and cross-tab concurrency handling completely transparent to your UI components.

```javascript
import axios from 'axios';
import { executeSingleFlightRefresh } from './tokenRefreshLock';

export const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com',
  withCredentials: true, // Sends HttpOnly cookie containing Refresh Token
});

let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  if (inMemoryAccessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// Response Interceptor: Handles 401 with Cross-Tab Lock
let intraTabRefreshingPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/auth/refresh') {
        // Refresh token failed -> Force Logout across all tabs
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Deduplicate requests within the SAME tab
        if (!intraTabRefreshingPromise) {
          intraTabRefreshingPromise = executeSingleFlightRefresh(() =>
            apiClient.post('/auth/refresh')
          ).finally(() => {
            intraTabRefreshingPromise = null;
          });
        }

        const newAccessToken = await intraTabRefreshingPromise;

        // Retry original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

```

---

## 4. Key Architectural Considerations

| Feature                                   | Mechanism / Standard                                                                                                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mutual Exclusion Across Tabs**          | Handled natively by **`navigator.locks.request()`**. Only one tab holds the lock at any given time; all other tabs block asynchronously until it releases.                                          |
| **Crash Safety (Tab Closure)**            | If a leader tab crashes or is closed mid-request, the Web Locks API **automatically releases the held lock** so waiting tabs can acquire it without deadlocking.                                    |
| **Double-Check Pattern**                  | Before executing `/auth/refresh`, the tab that acquires the lock verifies if `getAccessToken()` has changed. If another tab released the lock right before it, it reuses the new token immediately. |
| **Intra-Tab vs. Cross-Tab Deduplication** | **Intra-tab** requests reuse `intraTabRefreshingPromise` within the module scope. **Cross-tab** requests wait on the Web Lock queue.                                                                |
