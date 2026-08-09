Handling expired JWT tokens and silent refresh during route navigation requires coordinating your **Auth State**, **React Router Guards**, and your **HTTP Client (Axios or Fetch)**.

---

## The Architecture & Strategy

1. **Short-Lived Access Token (In-Memory) + Long-Lived Refresh Token (HttpOnly Cookie):**

* **Access Token:** Stored in JavaScript memory (React state/context). Expires quickly (e.g., 15 minutes).
* **Refresh Token:** Stored in a secure `HttpOnly`, `SameSite=Strict`, `Secure` cookie (immune to XSS). Expires in days/weeks.

1. **Dual-Layer Interception:**

* **Layer 1 (Pre-route check):** Before rendering a protected route, verify if the access token exists and isn't expired. If missing or expired, attempt a silent refresh before loading the page.
* **Layer 2 (API Interceptor):** If a background request hits `401 Unauthorized` mid-session, automatically pause failed requests, obtain a new token via refresh endpoint, and retry failed calls seamlessly.

---

## Step 1: Centralized Auth Context with Silent Refresh

Manage token state and implement `checkAuth` / `refreshToken` logic in an Auth Context.

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Silent refresh call using HttpOnly refresh cookie
  const refreshToken = useCallback(async () => {
    try {
      // Endpoint expects HttpOnly cookie sent automatically via credentials: 'include'
      const response = await api.post('/auth/refresh');
      const { newAccessToken, userDetails } = response.data;
      
      setAccessToken(newAccessToken);
      setUser(userDetails);
      return newAccessToken;
    } catch (error) {
      // Refresh failed or cookie expired -> clear auth state
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  // Initial check on app load/refresh
  useEffect(() => {
    async function initAuth() {
      await refreshToken();
      setIsInitializing(false);
    }
    initAuth();
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, setAccessToken, refreshToken, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

```

---

## Step 2: Axios Interceptor for 401 Recovery & Request Queueing

When multiple API requests fail simultaneously due to an expired access token, you must queue pending requests so you only send **one** refresh request rather than duplicate calls.

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send HttpOnly cookies
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue subsequent failed requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/auth/refresh');
        const { newAccessToken } = response.data;

        // Attach new token to retry header
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Redirect to login if refresh token itself is expired or invalid
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

```

---

## Step 3: Protecting Navigation in React Router v6

Integrate initialization loading states in your route guard so navigation doesn't prematurely boot users to `/login` before silent refresh finishes.

```jsx
// src/components/RequireAuth.jsx
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ allowedRoles }) {
  const { user, isInitializing } = useAuth();
  const location = useLocation();

  // 1. Prevent screen flash / premature redirect while checking refresh token on app start
  if (isInitializing) {
    return <div className="loading-spinner">Verifying session...</div>;
  }

  // 2. Unauthenticated -> Redirect to login with intent location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Unauthorized role -> Redirect
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

```

---

## Summary Flow of Events

```
User Navigates to /dashboard
           │
           ▼
 Is App Initializing? ───(Yes)───► Show Spinner & Call GET /auth/refresh
           │                                 │
          (No)                    ┌──────────┴──────────┐
           │                      ▼                     ▼
           │                 Success (200)         Failure (401)
           │                 Set Token/User        Clear State
           │                      │                     │
           ▼                      └──────────┬──────────┘
  Is User Authenticated?                     │
      ├── (No) ──► Redirect to /login ───────┘
      └── (Yes) ──► Render Route Component
                       │
                       ▼
            Subsequent API Request
                       │
             Received 401 Unauthorized?
               ├── (No) ──► Return Data
               └── (Yes) ─► Queue Call -> Trigger Silent Refresh
                             ├── Success ─► Retry Queued Requests
                             └── Failure ─► Logout & Redirect to /login

```

---

## Key Interview Talking Points

1. **Why JavaScript memory instead of `localStorage`?** `localStorage` is vulnerable to **XSS (Cross-Site Scripting)** attacks. If an attacker injects malicious code, they can read `localStorage.getItem('token')`. In-memory storage combined with HttpOnly cookies for refresh tokens mitigates XSS and CSRF risk.
2. **Preventing Race Conditions:** The `failedQueue` and `isRefreshing` flags in Axios prevent multiple concurrent requests (e.g., loading 5 widgets on a dashboard at once) from spamming the `/auth/refresh` endpoint simultaneously.
3. **Handling Unsolicited Tab Expiry:** If the user leaves the tab idle for hours, the `isInitializing` flag combined with interceptors ensures smooth recovery the moment they interact or refresh.
