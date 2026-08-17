To log a user out across all open tabs, you need to rely on the browser's **`storage` event**.

When one tab modifies `localStorage`, the browser fires a `storage` event in all _other_ open tabs connected to the same domain. By listening for this event, your other tabs can detect the logout, clear their own Redux state, and route the user back to the login screen.

Here is the step-by-step implementation using React, Redux Toolkit, React Router, and LocalStorage.

## 1. Create a Global Logout Hook

Create a custom hook that listens for the `storage` event. You should place this high up in your component tree (like inside `App.js`) so it mounts as soon as the app loads.

```javascript
// hooks/useCrossTabLogout.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice"; // Import your Redux logout action

export const useCrossTabLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Listen for our specific trigger key
      if (event.key === "logout_trigger") {
        // 1. Clear Redux state in this background tab
        dispatch(logout());

        // 2. Redirect this background tab to login
        navigate("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, navigate]);
};
```

## 2. Trigger the Logout in the Active Tab

When the user actually clicks the "Logout" button in their current tab, you need to update `localStorage` to notify the other tabs, clear the Redux state, and redirect.

```javascript
// components/Navbar.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Trigger the storage event for OTHER tabs
    // We use Date.now() so the value changes every time, guaranteeing the event fires.
    localStorage.setItem("logout_trigger", Date.now().toString());

    // 2. Clean up actual auth data (tokens, user info)
    localStorage.removeItem("token");
    localStorage.removeItem("logout_trigger"); // Clean up the trigger right after

    // 3. Clear Redux state in the CURRENT tab
    dispatch(logout());

    // 4. Redirect the CURRENT tab to login
    navigate("/login");
  };

  return (
    <nav>
      <button onClick={handleLogout}>Log Out</button>
    </nav>
  );
};

export default Navbar;
```

## 3. Mount the Hook in Your App Root

Finally, call your custom hook inside your main `App` component or your routing layout. It must be inside the `BrowserRouter` (or RouterProvider) context so `useNavigate` works.

```javascript
// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCrossTabLogout } from "./hooks/useCrossTabLogout";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

// Create a wrapper component to use hooks that require Router context
const AppContent = () => {
  // Initialize the listener for background tabs
  useCrossTabLogout();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
```

> **Key Insight:** The `storage` event _only_ fires in tabs other than the one that made the change. That is why you must explicitly dispatch the Redux action and route to login in both your `handleLogout` function (for the active tab) and your `useEffect` (for the background tabs).

To handle automatic logouts, you use the exact same `localStorage` trigger you built for the manual button click, but you fire it programmatically.

For a robust system, you should implement two strategies simultaneously: a **proactive timer** (catches tabs left idle) and a **reactive interceptor** (catches active tabs if a token is revoked early by the server).

## 1. The Proactive Approach: JWT Expiration Timer

You can decode the JWT to find its expiration time (`exp` claim) and set a timer. If the user leaves the tab idle, the timer expires, triggers the logout function, and fires the `localStorage` event to clean up all other background tabs.

Create a new hook and mount it in your `AppContent` component right next to your `useCrossTabLogout` hook.

```javascript
// hooks/useTokenExpiration.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode
import { logout } from "../store/authSlice";

export const useTokenExpiration = () => {
  // Assuming your token lives in Redux state
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      // JWT exp is in seconds, convert to milliseconds
      const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();

      const executeLogout = () => {
        // 1. Notify other tabs
        localStorage.setItem("logout_trigger", Date.now().toString());
        localStorage.removeItem("token");
        localStorage.removeItem("logout_trigger");

        // 2. Clear current tab state and redirect
        dispatch(logout());
        navigate("/login");
      };

      if (timeUntilExpiry <= 0) {
        // Token is already expired on load
        executeLogout();
      } else {
        // Set a timer for when the token will expire
        const timer = setTimeout(executeLogout, timeUntilExpiry);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Invalid token format", error);
      dispatch(logout());
    }
  }, [token, dispatch, navigate]);
};
```

> **Key insight:** If the user has 5 tabs open, all 5 tabs will have this timer running and will expire simultaneously. This is perfectly fine; they will all clear their local Redux state and redirect to `/login` without conflict.

## 2. The Reactive Approach: API Interceptor

Timers are great, but they fail if the server revokes the token early or if the user's local system clock is inaccurate. To catch this, you need an Axios (or fetch) interceptor.

Because interceptors live outside of the React component tree, you cannot easily use `useNavigate()`. Instead, you directly import the Redux store to clear the state, and use `window.location.href` to force a redirect.

```javascript
// services/api.js
import axios from "axios";
import { store } from "../store"; // Import your Redux store directly
import { logout } from "../store/authSlice";

const api = axios.create({
  baseURL: "https://your-api.com/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server responds with a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // 1. Trigger the storage event for OTHER tabs
      localStorage.setItem("logout_trigger", Date.now().toString());
      localStorage.removeItem("token");
      localStorage.removeItem("logout_trigger");

      // 2. Dispatch logout to the Redux store
      store.dispatch(logout());

      // 3. Force redirect to login
      // We use window.location because we are outside the React Router context
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
```

By combining both methods, you ensure that an expired session safely and immediately kicks the user out of all open tabs, whether they are actively clicking around or have walked away from their desk.

To implement a silent token refresh, your backend must provide a **refresh token** alongside your short-lived **access token**. (For security, the refresh token should ideally live in an `HttpOnly` cookie so JavaScript cannot access it directly, while the access token lives in memory or Redux).

To do this seamlessly, you need an **Axios Interceptor** that acts as a safety net. If an API request fails because the access token expired, the interceptor pauses the request, silently asks the server for a new token, and then retries the original request.

Here is how to build a robust interceptor that handles race conditions (e.g., when multiple API calls fail simultaneously).

## 1. Build the Axios Interceptor with a Queue

If a page loads and fires three API requests simultaneously with an expired token, you will get three `401 Unauthorized` errors at the exact same time. You only want to ask the server for a new token **once**.

To handle this, we use an `isRefreshing` flag and a queue to hold the other failed requests until the new token arrives.

```javascript
// services/api.js
import axios from "axios";
import { store } from "../store";
import { setCredentials, logout } from "../store/authSlice";

const api = axios.create({
  baseURL: "https://your-api.com/api",
});

// Attach the current token to every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Variables to handle concurrency
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401, and that we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If a refresh is already happening, queue this request and wait
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Call your refresh endpoint (cookies will be sent automatically if configured)
        // If using a stored refresh token, pass it in the body here
        const refreshResponse = await axios.post(
          "https://your-api.com/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // 1. Update Redux with the new token
        store.dispatch(setCredentials({ token: newAccessToken }));

        // 2. Broadcast to other tabs that the token was refreshed
        localStorage.setItem("token_refreshed", Date.now().toString());

        // 3. Process the queue with the new token
        processQueue(null, newAccessToken);

        // 4. Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token itself is expired or invalid, log the user out completely
        processQueue(refreshError, null);

        store.dispatch(logout());
        localStorage.setItem("logout_trigger", Date.now().toString());

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
```

## 2. Sync the New Token Across Tabs

When Tab A successfully refreshes the token, it updates its own Redux store. However, Tab B's Redux store still holds the old, expired token.

Just like we did for logouts, we can use the `storage` event to tell background tabs to fetch the new token from the backend (or grab it from localStorage, if you are storing it there). Add this to your existing cross-tab hook:

```javascript
// hooks/useCrossTabSync.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setCredentials } from "../store/authSlice";
import api from "../services/api";

export const useCrossTabSync = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = async (event) => {
      // Handle cross-tab logout
      if (event.key === "logout_trigger") {
        dispatch(logout());
        navigate("/login");
      }

      // Handle cross-tab token refresh
      if (event.key === "token_refreshed") {
        try {
          // Tab A refreshed the token.
          // Tab B quietly asks the server for the latest token using its HttpOnly cookie.
          const response = await api.post("/auth/refresh");
          dispatch(setCredentials({ token: response.data.accessToken }));
        } catch (error) {
          // If this fails, the user is likely fully logged out
          dispatch(logout());
          navigate("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, navigate]);
};
```

### Proactive Timer vs. Reactive Interceptor

You can combine the interceptor with the `useTokenExpiration` timer from the previous step. If you do, update the timer to trigger a refresh **1 to 2 minutes before** expiration, rather than logging the user out.

| Strategy                   | How it works                                                 | Best for                                                                         |
| -------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Reactive (Interceptor)** | Waits for a 401 error, pauses, refreshes, and retries.       | Catching unpredictable token revocations, network delays, or out-of-sync clocks. |
| **Proactive (Timer)**      | Checks JWT `exp` and calls the refresh API 60 seconds early. | Ensuring a perfectly seamless UX without ever dropping a request to a 401 error. |

To securely implement this, your backend needs to handle the refresh token entirely through HTTP headers, while sending the short-lived access token in the JSON payload.

Here is how to configure a Node.js/Express backend to securely set, read, and clear `HttpOnly` cookies. The security flags used here apply to any backend language (Python, Go, Java, etc.).

## 1. Configure CORS to Accept Credentials

Browsers block cross-origin cookies by default. If your frontend (e.g., `localhost:3000`) and backend (e.g., `localhost:4000`) run on different ports or domains, you must explicitly tell your backend to allow credentials.

```javascript
// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// 1. You MUST use a specific origin. '*' is not allowed when using credentials.
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allows cookies to be sent and received
  }),
);

// 2. Parse incoming cookies into req.cookies
app.use(cookieParser());
app.use(express.json());
```

## 2. Set the Cookie on Login

When a user successfully authenticates, generate both tokens. Send the access token to the frontend in the body, and attach the refresh token directly to the response header as a cookie.

```javascript
// routes/auth.js
app.post("/api/auth/login", async (req, res) => {
  // ... verify user credentials ...

  const accessToken = generateAccessToken(user.id); // e.g., 15 minutes
  const refreshToken = generateRefreshToken(user.id); // e.g., 7 days

  // The security configuration for your cookie
  const cookieOptions = {
    httpOnly: true, // Prevents JavaScript (XSS) from reading the cookie
    secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
    sameSite: "Strict", // Prevents CSRF attacks (use 'Lax' if frontend/backend are on different domains)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/api/auth/refresh", // Optional: Only send cookie to this specific endpoint
  };

  // Attach the cookie to the response
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // Send the access token in the body
  res.json({ accessToken });
});
```

> **Key insight:** By setting `path: '/api/auth/refresh'`, the browser will _only_ send the refresh token when the user makes a request to that exact endpoint. It will not attach it to standard API calls (like fetching a user profile), which saves bandwidth and reduces exposure.

## 3. Read the Cookie to Refresh

When your frontend Axios interceptor calls the refresh endpoint, the browser automatically includes the `HttpOnly` cookie. Your backend just needs to read it, verify it, and issue a new access token.

```javascript
app.post("/api/auth/refresh", async (req, res) => {
  // Extract the cookie parsed by cookie-parser
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Verify the token (e.g., using jsonwebtoken)
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the user still exists or if the token was revoked in your database
    // ...

    // Issue a new access token
    const newAccessToken = generateAccessToken(decoded.id);

    // Optional but recommended: Issue a NEW refresh token (Refresh Token Rotation)
    // const newRefreshToken = generateRefreshToken(decoded.id);
    // res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    // If the token is invalid or expired, clear it
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
});
```

## 4. Clear the Cookie on Logout

When the user clicks logout (or your cross-tab hook fires a logout request to the backend), you must invalidate the session on the server and tell the browser to delete the cookie.

```javascript
app.post("/api/auth/logout", async (req, res) => {
  // If you track valid refresh tokens in a database, mark it as revoked here
  // ...

  // Tell the browser to delete the cookie
  // You MUST provide the exact same options (name, path, domain) used to create it
  res.clearCookie("refreshToken", {
    path: "/api/auth/refresh",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});
```

Refresh Token Rotation (RTR) is a security measure that makes refresh tokens **single-use**.

If you use a standard, long-lived refresh token (e.g., valid for 7 days) and an attacker manages to steal it, they can continuously generate new access tokens until that 7-day period expires.

RTR solves this by rotating the refresh token every time it is used. It also implements **Reuse Detection**: if a single-use refresh token is presented to your server _twice_, the server immediately recognizes a security breach and revokes all access for that user session.

## How Reuse Detection Works

Imagine a legitimate user (Alice) and an attacker who has stolen Alice's refresh token (Token A).

| Action           | Who does it? | What happens?                                                                                                                         |
| ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Uses Token A** | Alice        | Server accepts it, gives Alice a new Access Token and a **new** Refresh Token (Token B). Token A is marked as "used" in the database. |
| **Uses Token A** | Attacker     | Server sees Token A was already used. It instantly **revokes Token B** and the entire token family.                                   |
| **Uses Token B** | Alice        | Server rejects it (it was revoked). Alice is forced to log in again.                                                                  |

Both the attacker and the legitimate user lose access. Alice has to type her password again, but the attacker is permanently locked out.

## 1. Database Setup

To implement this, your database needs to track refresh tokens and their statuses. You can store a `jti` (JSON Web Token ID) instead of the whole token.

```javascript
// Example MongoDB Schema for a RefreshToken collection
const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jti: { type: String, required: true }, // The unique ID of this token
  familyId: { type: String, required: true }, // Ties all rotated tokens together
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});
```

## 2. Generate Tokens with Unique IDs

When creating your JWT refresh token, inject a unique `jti` (UUID) into the payload.

```javascript
// utils/tokens.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateRefreshToken = (userId, familyId) => {
  const jti = crypto.randomUUID(); // Unique identifier for this specific token

  const token = jwt.sign(
    { id: userId, familyId, jti },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return { token, jti };
};
```

## 3. The Rotation and Detection Logic

Update your `/api/auth/refresh` endpoint to handle the rotation and reuse detection.

```javascript
// routes/auth.js
app.post("/api/auth/refresh", async (req, res) => {
  const incomingToken = req.cookies.refreshToken;

  if (!incomingToken) return res.status(401).json({ message: "No token" });

  try {
    // 1. Verify the signature of the incoming token
    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

    // 2. Find the token record in your database
    const tokenRecord = await RefreshToken.findOne({ jti: decoded.jti });

    if (!tokenRecord) {
      // Token doesn't exist in DB. It might be fabricated or already deleted.
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(403).json({ message: "Invalid token" });
    }

    // 3. THE TRAP: Reuse Detection
    if (tokenRecord.isUsed) {
      // 🚨 An attacker (or a network glitch) tried to use an old token!
      // Destroy the entire token family to lock everyone out.
      await RefreshToken.deleteMany({ familyId: decoded.familyId });

      res.clearCookie("refreshToken", cookieOptions);
      return res
        .status(403)
        .json({ message: "Security breach detected. Please log in again." });
    }

    // 4. Mark the current token as used
    tokenRecord.isUsed = true;
    await tokenRecord.save();

    // 5. Generate a new Access Token
    const newAccessToken = generateAccessToken(decoded.id);

    // 6. Generate a NEW Refresh Token (using the same familyId)
    const { token: newRefreshToken, jti: newJti } = generateRefreshToken(
      decoded.id,
      decoded.familyId,
    );

    // 7. Save the new refresh token to the database
    await RefreshToken.create({
      userId: decoded.id,
      jti: newJti,
      familyId: decoded.familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // 8. Send the new tokens to the client
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(403).json({ message: "Session expired" });
  }
});
```

## 4. Handling Concurrency (The Double-Refresh Problem)

If a user opens your app and it fires three simultaneous API calls with an expired access token, your frontend will try to hit the `/refresh` endpoint three times in the same millisecond.

The first request will rotate the token and mark it as used. The second and third requests will arrive, see `isUsed: true`, trigger the security breach logic, and lock the legitimate user out.

To fix this, you must rely on the **Axios Interceptor queue** we built in the previous step. By ensuring the frontend pauses all other requests and only sends **one** `/refresh` request at a time, you prevent accidental reuse lockouts while maintaining strict security against actual attackers.

Here is a complete, production-ready architecture for managing cross-tab synchronization and token refresh queues in a React application using **Axios** and the **Broadcast Channel API**.

---

## 1. Cross-Tab Communication Utility

Using the native `BroadcastChannel` API allows real-time messaging between browser tabs running on the same origin without polling `localStorage`.

```typescript
// src/utils/authChannel.ts
export type AuthMessage =
  | { type: "LOGOUT" }
  | { type: "TOKEN_REFRESHED"; accessToken: string };

const CHANNEL_NAME = "auth_channel";

class AuthBroadcastChannel {
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
    }
  }

  public postMessage(message: AuthMessage) {
    this.channel?.postMessage(message);
  }

  public subscribe(callback: (message: AuthMessage) => void) {
    if (!this.channel) return () => {};

    const handler = (event: MessageEvent<AuthMessage>) => {
      callback(event.data);
    };

    this.channel.addEventListener("message", handler);
    return () => {
      this.channel?.removeEventListener("message", handler);
    };
  }

  public close() {
    this.channel?.close();
  }
}

export const authChannel = new AuthBroadcastChannel();
```

---

## 2. Global Cross-Tab Logout Hook (`useCrossTabLogout`)

This hook handles logging out the current user, notifying other tabs to do the same, and listening for logout events emitted by sister tabs.

```typescript
// src/hooks/useCrossTabLogout.ts
import { useEffect, useCallback } from "react";
import { authChannel } from "../utils/authChannel";

export const useCrossTabLogout = (onLogoutCallback: () => void) => {
  // 1. Local trigger: Performs local cleanup & broadcasts logout to other tabs
  const logout = useCallback(() => {
    // Clear local storage / session tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Broadcast event to other open tabs
    authChannel.postMessage({ type: "LOGOUT" });

    // Perform local redirect/state reset
    onLogoutCallback();
  }, [onLogoutCallback]);

  // 2. Cross-tab listener: Listens for LOGOUT signals sent from other tabs
  useEffect(() => {
    const unsubscribe = authChannel.subscribe((message) => {
      if (message.type === "LOGOUT") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        onLogoutCallback();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [onLogoutCallback]);

  return { logout };
};
```

---

## 3. Axios Interceptor with Queue & Tab Sync

When multiple API requests fail simultaneously with `401 Unauthorized`, this interceptor ensures:

1. **Only one request triggers the refresh API endpoint**.
2. Subsequent concurrent requests are queued.
3. Upon token refresh, the new token is broadcast across open tabs.

```typescript
// src/api/axiosClient.ts
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { authChannel } from "../utils/authChannel";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// State for request queuing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Listen for tokens refreshed in OTHER tabs
authChannel.subscribe((message) => {
  if (message.type === "TOKEN_REFRESHED") {
    localStorage.setItem("accessToken", message.accessToken);
    processQueue(null, message.accessToken);
    isRefreshing = false;
  }
});

// Request Interceptor: Attach bearer token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Queue requests & Refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        // Refresh token itself expired -> Force global logout
        authChannel.postMessage({ type: "LOGOUT" });
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue pending request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post("/api/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Notify other open tabs about the new token
        authChannel.postMessage({
          type: "TOKEN_REFRESHED",
          accessToken: newAccessToken,
        });

        // Resolve queued local requests
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Broadcast logout on refresh failure
        localStorage.clear();
        authChannel.postMessage({ type: "LOGOUT" });

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
```

---

## 4. Reactive Token Expiration Hook (`useTokenExpiration`)

This hook proactively sets up a timer to auto-refresh the token **before** it expires, preventing unnecessary `401` network failures.

```typescript
// src/hooks/useTokenExpiration.ts
import { useEffect } from "react";
import { api } from "../api/axiosClient";

// Helper to parse JWT expiration timestamp
const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to ms
  } catch {
    return null;
  }
};

export const useTokenExpiration = () => {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const expTime = getTokenExpiration(token);
    if (!expTime) return;

    const now = Date.now();
    // Schedule proactive refresh 1 minute before expiration
    const refreshBuffer = 60 * 1000;
    const delay = expTime - now - refreshBuffer;

    if (delay <= 0) {
      // Token is already near expiration, trigger immediate refresh
      api.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      return;
    }

    const timer = setTimeout(() => {
      api.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
    }, delay);

    return () => clearTimeout(timer);
  }, []);
};
```

---

## 5. Mounting at App Root (`App.tsx`)

Mount the authentication listeners and proactive timers at the root level of your React tree.

```tsx
// src/App.tsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCrossTabLogout } from "./hooks/useCrossTabLogout";
import { useTokenExpiration } from "./hooks/useTokenExpiration";

export const App: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    // Reset global state (Redux/Zustand) if applicable
    navigate("/login");
  }, [navigate]);

  // Mount Cross-Tab Logout Listener
  const { logout } = useCrossTabLogout(handleLogout);

  // Mount Reactive Token Expiration Timer
  useTokenExpiration();

  return (
    <div className="app">
      <header>
        <h1>Secure Dashboard</h1>
        <button onClick={logout}>Logout All Tabs</button>
      </header>
    </div>
  );
};
```

---

## Architecture Summary

| Feature                  | Mechanism                                          | Benefit                                                                                         |
| ------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Cross-Tab Logout**     | `BroadcastChannel.postMessage({ type: 'LOGOUT' })` | Instantly logs out all open browser tabs when one tab logs out.                                 |
| **Token Refresh Queue**  | Axios Interceptor + Promise Queue (`failedQueue`)  | Prevents parallel API race conditions when multiple requests hit `401`.                         |
| **Cross-Tab Token Sync** | `BroadcastChannel` with `'TOKEN_REFRESHED'`        | Avoids redundant refresh calls from multiple tabs.                                              |
| **Proactive Expiration** | `useTokenExpiration` with `setTimeout`             | Auto-refreshes tokens before expiration, avoiding `401` errors entirely during active sessions. |

## 1. Create a Global Logout Hook

Create a custom hook called `useCrossTabLogout` that listens for the `storage` event. If the authentication token is removed from `localStorage` (or a specific logout flag is triggered) in another tab, it dispatches your Redux logout action and redirects the user via React Router.

```jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from './authSlice'; // Path to your Redux auth slice

export const useCrossTabLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Check if the logout key or auth token was cleared/changed
      if (event.key === 'auth_token' && event.newValue === null) {
        // 1. Clear Redux state
        dispatch(logout());
        
        // 2. Redirect to login screen
        navigate('/login', { replace: true });
      }
    };

    // Listen for storage changes across tabs
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch, navigate]);
};

```

---

## 2. Initialize the Hook in Your App Layout

To ensure the listener is active across all authenticated pages, invoke the hook inside a root layout component or router wrapper that renders after the user logs in.

```jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useCrossTabLogout } from './useCrossTabLogout';

const AuthAppLayout = () => {
  // Activates the cross-tab listener globally for all child routes
  useCrossTabLogout();

  return (
    <div className="app-layout">
      {/* Your main dashboard navbar, sidebar, etc. */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthAppLayout;

```

---

## 3. Triggering the Logout

When a user clicks "Logout" in **Tab A**, clear the tracked storage key. This will automatically broadcast the `storage` event to **Tab B**, **Tab C**, etc., executing the hook logic everywhere simultaneously.

```jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from './authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear LocalStorage (This triggers the event in other tabs)
    localStorage.removeItem('auth_token');

    // 2. Clear local Redux state for the current tab
    dispatch(logout());

    // 3. Redirect current tab to login
    navigate('/login', { replace: true });
  };

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
      Log Out
    </button>
  );
};

export default UserProfile;

```
