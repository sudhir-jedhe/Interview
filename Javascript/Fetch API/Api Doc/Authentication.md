Since you're a React/MERN developer, the most common approach is **JWT Authentication + Authorization Token**. Your resume materials also reference **JWT Token authentication & authorization** experience. [\[Sudhir Jedhe \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7BA89AE396-7B6C-4A05-A3AC-97D9041CF73C%7D&file=Sudhir%20Jedhe.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Sudhir Jedhe 2 \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7BF58C5747-96DD-4F3E-BB6A-900C2EBA385C%7D&file=Sudhir%20Jedhe%202.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Sudhir Jedhe 1 \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B0F186879-6F34-478A-82AD-A41D783B1961%7D&file=Sudhir%20Jedhe%201.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

# Authentication vs Authorization

### Authentication

```text
Who are you?
```

Example:

```text
Username + Password
```

Server verifies user.

***

### Authorization

```text
What are you allowed to do?
```

Example:

```text
Admin
User
Manager
```

JWT token typically contains:

```json
{
  "userId": 101,
  "role": "admin"
}
```

***

# React JWT Authentication Flow

```text
Login
   ↓
Backend Verify User
   ↓
Generate JWT Token
   ↓
Send Token To React
   ↓
Store Token
   ↓
Attach Token To API Calls
   ↓
Backend Validates Token
```

***

# 1. Login API

```jsx
const login = async () => {

  const response =
    await fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        "Content-Type":
          "application/json"
      }
    });

  const data =
    await response.json();

  localStorage.setItem(
    "token",
    data.token
  );
};
```

Example Token:

```text
eyJhbGciOiJIUzI1Ni...
```

***

# 2. Send Authorization Header

Every protected API call sends:

```jsx
const token =
  localStorage.getItem(
    "token"
  );

fetch("/users", {
  headers: {
    Authorization:
      `Bearer ${token}`
  }
});
```

Request:

```http
GET /users

Authorization:
Bearer eyJhbGc...
```

***

# 3. Axios Interceptor (Most Asked)

Instead of repeating headers everywhere.

```jsx
import axios from "axios";

const api = axios.create({
  baseURL:
    "https://api.app.com"
});

api.interceptors.request.use(
  config => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default api;
```

Usage:

```jsx
api.get("/users");
```

Token added automatically.

***

# 4. Auth Context

Senior React Pattern.

```jsx
import {
  createContext,
  useState
} from "react";

export const AuthContext =
  createContext();

export function AuthProvider({
  children
}) {

  const [token,
         setToken] =
    useState(
      localStorage.getItem(
        "token"
      )
    );

  const login = token => {

    setToken(token);

    localStorage.setItem(
      "token",
      token
    );
  };

  const logout = () => {

    setToken(null);

    localStorage.removeItem(
      "token"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

***

# 5. Protected Route

```jsx
import { Navigate }
  from
  "react-router-dom";

function ProtectedRoute({
  children
}) {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {

    return (
      <Navigate
        to="/login"
      />
    );
  }

  return children;
}
```

Usage:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

***

# 6. Role Based Authorization

Token Payload:

```json
{
  "userId": 1,
  "role": "admin"
}
```

React:

```jsx
function AdminPage() {

  const user = {
    role: "admin"
  };

  return user.role ===
    "admin"
    ? <AdminPanel />
    : <AccessDenied />;
}
```

***

# 7. Token Expiry Handling

Backend:

```text
401 Unauthorized
```

React:

```jsx
api.interceptors.response.use(
  response => response,

  error => {

    if (
      error.response.status ===
      401
    ) {

      localStorage.removeItem(
        "token"
      );

      window.location =
        "/login";
    }

    return Promise.reject(
      error
    );
  }
);
```

***

# Security Best Practices

### ❌ Avoid

```javascript
localStorage
```

for highly sensitive applications.

***

### ✅ Better

```text
HttpOnly Cookies
Secure Cookies
SameSite Cookies
```

because JavaScript cannot directly read them.

***

### Always

```text
✅ HTTPS
✅ Token Expiry
✅ Refresh Tokens
✅ Role Validation on Server
✅ Logout on Expiry
✅ Authorization Header
```

***

# Senior React Interview Answer

> In React applications, authentication is typically implemented using JWT tokens. After a successful login, the backend returns a JWT access token, which is stored and attached to API requests using the `Authorization: Bearer <token>` header. React commonly uses Context API, Redux, or custom hooks to manage authentication state. Protected routes restrict unauthenticated users, while role-based authorization controls access based on claims stored in the token. Axios interceptors are often used to automatically attach tokens and handle token expiration, 401 responses, and logout flows.

Since you've worked with **JWT Authentication & Authorization in React/Node.js applications**, here's the **Senior React production-ready approach** for token refresh and role-based protection.

# 1. Token Refresh Handling (Axios Interceptor)

## Flow

```text
Access Token Expired
        ↓
API Returns 401
        ↓
Refresh Token API
        ↓
New Access Token
        ↓
Retry Original Request
```

***

## authApi.js

```jsx
import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

api.interceptors.request.use(
  config => {

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  response => response,

  async error => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        const response =
          await axios.post(
            "/refresh-token",
            {
              refreshToken
            }
          );

        const newToken =
          response.data.accessToken;

        localStorage.setItem(
          "accessToken",
          newToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(
          originalRequest
        );

      } catch {

        localStorage.clear();

        window.location =
          "/login";
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;
```

***

# 2. Storing Tokens Securely

This is a very common senior interview question.

***

## ❌ LocalStorage

```javascript
localStorage.setItem(
  "token",
  token
);
```

Problem:

```text
Accessible via JavaScript
Susceptible to XSS attacks
```

***

## ✅ Better: HttpOnly Cookies

```text
HttpOnly
Secure
SameSite
```

Backend:

```http
Set-Cookie:
refreshToken=abc123;
HttpOnly;
Secure;
SameSite=Strict
```

Benefits:

```text
Cannot be read via JS
Automatic browser handling
More secure
```

***

## Recommended Production Pattern

```text
Access Token
    → Memory / State

Refresh Token
    → HttpOnly Cookie
```

Flow:

```text
Login
   ↓
Access Token (short lifetime)
   ↓
Refresh Token Cookie
   ↓
Auto Refresh
```

***

# 3. Role-Based Route Protection

Token Payload:

```json
{
  "userId": 101,
  "role": "admin"
}
```

***

## Auth Context

```jsx
import {
  createContext,
  useContext
} from "react";

export const AuthContext =
  createContext();

export const useAuth =
  () =>
    useContext(
      AuthContext
    );
```

***

## Protected Route

```jsx
import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "./AuthContext";

function ProtectedRoute({
  children,
  roles
}) {

  const {
    user
  } = useAuth();

  if (!user) {

    return (
      <Navigate
        to="/login"
      />
    );
  }

  if (
    roles &&
    !roles.includes(
      user.role
    )
  ) {

    return (
      <Navigate
        to="/403"
      />
    );
  }

  return children;
}

export default ProtectedRoute;
```

***

## Route Configuration

```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute
      roles={["admin"]}
    >
      <AdminPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager"
  element={
    <ProtectedRoute
      roles={[
        "admin",
        "manager"
      ]}
    >
      <ManagerPage />
    </ProtectedRoute>
  }
/>
```

***

# UI Authorization Example

Even with route protection:

```jsx
const { user } = useAuth();

return (
  <>
    {user.role === "admin" && (
      <button>
        Delete User
      </button>
    )}
  </>
);
```

***

# JWT Decode Example

```jsx
import jwtDecode
  from "jwt-decode";

const token =
  localStorage.getItem(
    "accessToken"
  );

const user =
  jwtDecode(token);

console.log(user.role);
```

Token:

```json
{
  "sub": "101",
  "role": "admin",
  "exp": 1780000000
}
```

***

# Enterprise Architecture

```text
React App
    ↓
Auth Context
    ↓
Axios Interceptor
    ↓
Access Token

      ↓

Backend

      ↓

Refresh Token Cookie
```

***

# Senior React Interview Answer

> In production React applications, access tokens should be short-lived and attached through Axios interceptors using the `Authorization: Bearer <token>` header. When a token expires, a response interceptor can call a refresh-token endpoint, receive a new access token, and retry the failed request. For security, refresh tokens should be stored in HttpOnly Secure cookies rather than LocalStorage. Role-based authorisation can be implemented using protected routes that verify user roles from JWT claims and redirect unauthorised users to dedicated access-denied pages. This pattern scales well for enterprise applications using React, Redux/Context API, Node.js, and JWT authentication.

You're asking about three advanced JWT/auth topics commonly asked in Senior React interviews:

1. **Secure token storage with HttpOnly cookies**
2. **Token expiry + automatic logout**
3. **Role-based UI rendering**
4. **Multiple tabs and shared credentials**

Your own React/MERN profile references experience with **JWT Token Authentication & Authorization**, which is the same architecture typically discussed in these interviews.

# 1. Secure Token Storage with HttpOnly Cookies

## Recommended Architecture

```text
Access Token
   ↓
React State / Memory

Refresh Token
   ↓
HttpOnly Cookie
```

### Login Flow

```text
User Login
    ↓
Backend Validates Credentials
    ↓
Returns Access Token
    ↓
Sets Refresh Token Cookie
```

Backend response:

```http
Set-Cookie:
refreshToken=xyz123;
HttpOnly;
Secure;
SameSite=Strict;
```

### Why HttpOnly?

```text
✅ JavaScript cannot read it
✅ Better XSS protection
✅ Browser sends cookie automatically
```

### React Login

```jsx
const login = async () => {

  const response =
    await fetch("/login", {
      method: "POST",
      credentials: "include"
    });

  const data =
    await response.json();

  setAccessToken(
    data.accessToken
  );
};
```

Notice:

```javascript
credentials: "include"
```

allows cookies to be sent.

***

# 2. Handling Token Expiry + Logout

## Automatic Refresh Flow

```text
Access Token Expires
        ↓
API Returns 401
        ↓
Refresh Endpoint
        ↓
New Access Token
        ↓
Retry Request
```

## Axios Example

```jsx
api.interceptors.response.use(
  response => response,

  async error => {

    if (
      error.response?.status === 401
    ) {

      try {

        const response =
          await axios.post(
            "/refresh",
            {},
            {
              withCredentials: true
            }
          );

        const token =
          response.data.accessToken;

        setAccessToken(token);

        return api(
          error.config
        );

      } catch {

        logout();
      }
    }

    return Promise.reject(error);
  }
);
```

***

## Logout Function

```jsx
function logout() {

  setUser(null);

  setAccessToken(null);

  localStorage.removeItem(
    "user"
  );

  navigate("/login");
}
```

***

## Check JWT Expiry

```jsx
import jwtDecode
  from "jwt-decode";

const tokenInfo =
  jwtDecode(token);

if (
  tokenInfo.exp * 1000 <
  Date.now()
) {

  logout();
}
```

Token contains:

```json
{
  "sub": "101",
  "role": "admin",
  "exp": 1780000000
}
```

***

# 3. Role-Based UI Rendering with JWT Claims

Example claim:

```json
{
  "id": 101,
  "role": "admin"
}
```

***

## Auth Context

```jsx
const {
  user
} = useAuth();
```

***

## Conditional Rendering

```jsx
function Navigation() {

  const {
    user
  } = useAuth();

  return (

    <>
      <Link to="/">
        Home
      </Link>

      {user.role ===
        "admin" && (

        <Link
          to="/admin"
        >
          Admin
        </Link>

      )}

    </>

  );
}
```

***

## Multiple Roles

```jsx
const allowedRoles = [
  "admin",
  "manager"
];

const canAccess =
  allowedRoles.includes(
    user.role
  );
```

***

## Component Level Authorisation

```jsx
{
  user.role === "admin" && (
    <button>
      Delete User
    </button>
  );
}
```

***

# 4. Multiple Tabs / Shared Credentials

This is a common enterprise application challenge.

## Problem

```text
Tab 1 Login
Tab 2 Open
Tab 3 Open

User Logs Out
      ↓
Other Tabs Still Active
```

***

## Solution: Storage Event

### Listen for Auth Changes

```jsx
useEffect(() => {

  function handleStorage(
    event
  ) {

    if (
      event.key === "logout"
    ) {

      navigate("/login");
    }
  }

  window.addEventListener(
    "storage",
    handleStorage
  );

  return () => {

    window.removeEventListener(
      "storage",
      handleStorage
    );
  };

}, []);
```

***

### Logout

```jsx
function logout() {

  localStorage.setItem(
    "logout",
    Date.now()
  );

  localStorage.removeItem(
    "user"
  );

  navigate("/login");
}
```

***

## Result

```text
Tab 1 Logout
      ↓
Storage Event Fires
      ↓
Tab 2 Logout
      ↓
Tab 3 Logout
```

***

# Better Approach: BroadcastChannel API

Modern browsers support:

```javascript
const channel =
  new BroadcastChannel(
    "auth"
  );
```

### Logout

```javascript
channel.postMessage(
  "logout"
);
```

### Other Tabs

```javascript
channel.onmessage =
  event => {

    if (
      event.data ===
      "logout"
    ) {

      logout();
    }
  };
```

***

# Enterprise-Grade Architecture

```text
React App
    ↓
Auth Context
    ↓
Access Token (Memory)
    ↓
Axios Interceptor
    ↓
API Calls

Refresh Token
    ↓
HttpOnly Secure Cookie

Multi-Tab Sync
    ↓
Storage Event /
BroadcastChannel
```

# Senior React Interview Answer

> In production React applications, access tokens should preferably be kept in memory while refresh tokens are stored in HttpOnly Secure cookies. When the access token expires, the frontend attempts a refresh-token call and retries failed requests. If refresh fails, the user is logged out and redirected to the login screen. JWT claims such as roles can drive both route protection and UI-level authorisation. For multi-tab scenarios, applications commonly use the browser `storage` event or the BroadcastChannel API so that login and logout actions remain synchronised across all open tabs.

For a **production-grade React + Node.js JWT architecture**, the recommended pattern is:

```text
Access Token
    ↓
Memory (React State)

Refresh Token
    ↓
HttpOnly Cookie
```

Your resume materials explicitly mention experience with JWT-based Authentication & Authorization.

***

# 1. Secure HttpOnly Cookie Setup (Node.js/Express)

## Backend Login API

```js
const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  const user = {
    id: 101,
    role: "admin"
  };

  const accessToken = jwt.sign(
    user,
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    user,
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  );

  res.json({
    accessToken,
    user
  });
});
```

### Cookie Security

```text
httpOnly  ✅ JS cannot read it
secure    ✅ HTTPS only
sameSite  ✅ CSRF protection
```

***

## React Login Request

```jsx
const login = async () => {

  const response =
    await fetch("/login", {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })
    });

  const data =
    await response.json();

  setAccessToken(
    data.accessToken
  );
};
```

***

# 2. Sync Logout Across Multiple Tabs

## Problem

```text
Tab 1
Tab 2
Tab 3

User clicks Logout in Tab 1

Tab 2 still logged in ❌
Tab 3 still logged in ❌
```

***

## Solution 1: Storage Event

### AuthProvider.jsx

```jsx
useEffect(() => {

  const handler =
    (event) => {

      if (
        event.key === "logout"
      ) {

        navigate("/login");
      }
    };

  window.addEventListener(
    "storage",
    handler
  );

  return () => {

    window.removeEventListener(
      "storage",
      handler
    );
  };

}, []);
```

***

### Logout Function

```jsx
function logout() {

  localStorage.setItem(
    "logout",
    Date.now()
  );

  localStorage.removeItem(
    "user"
  );

  navigate("/login");
}
```

***

## Flow

```text
Logout Tab 1
        ↓
Storage Event Fires
        ↓
Tab 2 Logout
        ↓
Tab 3 Logout
```

***

# Better Solution: BroadcastChannel API

## Create Channel

```jsx
const authChannel =
  new BroadcastChannel(
    "auth"
  );
```

***

## Logout

```jsx
function logout() {

  authChannel.postMessage(
    "logout"
  );
}
```

***

## Listen

```jsx
useEffect(() => {

  authChannel.onmessage =
    event => {

      if (
        event.data ===
        "logout"
      ) {

        navigate("/login");
      }
    };

}, []);
```

***

## Flow

```text
Tab 1 Logout
       ↓
BroadcastChannel
       ↓
Tab 2 Logout
       ↓
Tab 3 Logout
```

***

# 3. Role-Based UI Rendering (Multiple Roles)

## JWT Payload

```json
{
  "id": 101,
  "name": "Sudhir",
  "roles": [
    "admin",
    "manager"
  ]
}
```

***

## Auth Context

```jsx
const {
  user
} = useAuth();
```

***

## Helper

```jsx
const hasRole =
  (...roles) =>
    roles.some(role =>
      user.roles.includes(
        role
      )
    );
```

***

## Navigation Example

```jsx
<nav>

  <Link to="/">
    Home
  </Link>

  {hasRole("admin") && (

    <Link to="/admin">
      Admin
    </Link>

  )}

  {hasRole(
    "admin",
    "manager"
  ) && (

    <Link to="/reports">
      Reports
    </Link>

  )}

</nav>
```

***

## Button Rendering

```jsx
{
  hasRole("admin") && (

    <button>
      Delete User
    </button>

  )
}
```

***

## Multiple Roles

```jsx
{
  hasRole(
    "admin",
    "manager",
    "supervisor"
  ) && (

    <button>
      Export Report
    </button>

  )
}
```

***

# Protected Route by Role

```jsx
function ProtectedRoute({
  roles,
  children
}) {

  const { user } =
    useAuth();

  const allowed =
    roles.some(role =>
      user.roles.includes(
        role
      )
    );

  if (!allowed) {

    return (
      <Navigate
        to="/403"
      />
    );
  }

  return children;
}
```

Usage:

```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute
      roles={["admin"]}
    >
      <AdminPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/reports"
  element={
    <ProtectedRoute
      roles={[
        "admin",
        "manager"
      ]}
    >
      <ReportsPage />
    </ProtectedRoute>
  }
/>
```

***

# Senior React Interview Answer

> In enterprise React applications, access tokens are typically kept in memory while refresh tokens are stored in secure HttpOnly cookies. When a user logs out, synchronisation across browser tabs can be achieved through the Storage Event or BroadcastChannel API. JWT claims containing roles are used for route protection and conditional UI rendering. For multiple-role authorisation, helper functions verify whether the user's role array contains any permitted roles before rendering routes, menus, buttons, or administrative functionality. This approach is commonly used in React, Node.js, JWT, and OAuth-based architectures.

A clean **React Context logout** implementation should:

```text
✅ Clear user state
✅ Remove tokens
✅ Clear cached data
✅ Redirect to login
✅ Sync logout across tabs
✅ Call backend logout API (optional)
```

The internal authentication documentation also references protected routes, authentication, authorization, and logout flows in a React-based architecture. [\[Documentation \| Word\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/_layouts/15/Doc.aspx?sourcedoc=%7B9B4622C6-69CF-4B3B-9B35-D56C8A817F59%7D&file=Documentation.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

# Auth Context Example

## AuthContext.jsx

```jsx
import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext();

export const useAuth =
  () => useContext(AuthContext);

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  //-----------------------
  // LOGIN
  //-----------------------

  const login = (
    userData,
    accessToken
  ) => {

    setUser(userData);

    setToken(accessToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      accessToken
    );
  };

  //-----------------------
  // LOGOUT
  //-----------------------

  const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

***

# Using Logout

```jsx
import { useAuth }
  from "./AuthContext";

function Header() {

  const { logout } =
    useAuth();

  return (

    <button
      onClick={logout}
    >
      Logout
    </button>

  );
}
```

***

# Logout + React Router

Typically you redirect after logout.

```jsx
import {
  useNavigate
} from "react-router-dom";

function Header() {

  const navigate =
    useNavigate();

  const { logout } =
    useAuth();

  const handleLogout =
    () => {

      logout();

      navigate("/login");
    };

  return (
    <button
      onClick={
        handleLogout
      }
    >
      Logout
    </button>
  );
}
```

***

# Logout with Backend API

Many enterprise apps invalidate refresh tokens.

```jsx
const logout = async () => {

  try {

    await fetch(
      "/api/logout",
      {
        method: "POST",
        credentials: "include"
      }
    );

  } catch (error) {

    console.error(error);
  }

  setUser(null);
  setToken(null);

  localStorage.clear();
};
```

***

# Multi-Tab Logout Sync

If logout occurs in one tab:

```text
Tab 1
Tab 2
Tab 3
```

all tabs should logout.

## Logout

```jsx
function logout() {

  localStorage.setItem(
    "logout",
    Date.now()
  );

  localStorage.removeItem(
    "token"
  );

  setUser(null);
}
```

***

## Listen

```jsx
useEffect(() => {

  const handleStorage =
    event => {

      if (
        event.key ===
        "logout"
      ) {

        setUser(null);
      }
    };

  window.addEventListener(
    "storage",
    handleStorage
  );

  return () => {

    window.removeEventListener(
      "storage",
      handleStorage
    );
  };

}, []);
```

Result:

```text
Logout Tab 1
      ↓
Tab 2 Logout
      ↓
Tab 3 Logout
```

***

# Production Logout Flow

```text
User Clicks Logout
        ↓
Backend Logout API
        ↓
Invalidate Refresh Token
        ↓
Clear React Context
        ↓
Clear Cache
        ↓
Clear Local Storage
        ↓
Redirect Login
        ↓
Broadcast Logout To Tabs
```

***

# React Query / Redux Cleanup (Important)

If using React Query:

```jsx
queryClient.clear();
```

If using Redux:

```jsx
dispatch(resetStore());
```

This prevents old user data from appearing after logout.

***

# Senior React Interview Answer

> Logout in React Context is typically implemented by clearing authentication state, removing access tokens, invalidating refresh tokens on the backend, clearing cached application data, and redirecting the user to the login page. In enterprise applications, logout should also be synchronised across browser tabs using the `storage` event or `BroadcastChannel` API so that all active sessions are terminated consistently.

# 1. Logout Sync with BroadcastChannel API

`BroadcastChannel` is cleaner than the `storage` event because it allows direct communication between tabs.

## AuthContext.jsx

```jsx
import {
  createContext,
  useEffect,
  useState
} from "react";

const AuthContext =
  createContext();

const authChannel =
  new BroadcastChannel("auth");

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const logout =
    async () => {

      try {

        await fetch(
          "/api/logout",
          {
            method: "POST",
            credentials: "include"
          }
        );

      } finally {

        setUser(null);
        setToken(null);

        localStorage.removeItem(
          "token"
        );

        // notify all tabs
        authChannel.postMessage({
          type: "LOGOUT"
        });
      }
    };

  useEffect(() => {

    authChannel.onmessage =
      event => {

        if (
          event.data.type ===
          "LOGOUT"
        ) {

          setUser(null);
          setToken(null);
        }
      };

    return () => {
      authChannel.close();
    };

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

### Flow

```text
Tab 1 Logout
      ↓
BroadcastChannel Message
      ↓
Tab 2 Logout
      ↓
Tab 3 Logout
```

***

# 2. Clear React Query Cache on Logout

Very important in enterprise applications.

Without cache clearing:

```text
Logout User A
      ↓
Login User B
      ↓
User A data may briefly appear ❌
```

## Using React Query

```jsx
import { useQueryClient }
  from "@tanstack/react-query";

function useLogout() {

  const queryClient =
    useQueryClient();

  return async () => {

    try {

      await fetch(
        "/api/logout",
        {
          method: "POST",
          credentials: "include"
        }
      );

    } finally {

      queryClient.clear();

      localStorage.clear();

      window.location =
        "/login";
    }
  };
}
```

***

## More Selective Cleanup

```jsx
queryClient.removeQueries({
  queryKey: ["users"]
});

queryClient.removeQueries({
  queryKey: ["profile"]
});

queryClient.removeQueries({
  queryKey: ["dashboard"]
});
```

***

# 3. Backend Refresh Token Invalidation

This is one of the most important JWT interview topics.

## Problem

If logout only clears frontend state:

```text
Token Still Exists On Server
         ↓
Stolen Token Can Be Used
```

***

## Recommended Flow

```text
User Logout
      ↓
Frontend Calls Logout API
      ↓
Server Deletes Refresh Token
      ↓
Cookie Removed
      ↓
Access Ends
```

***

## Express Logout API

```js
app.post(
  "/logout",
  async (req, res) => {

    const refreshToken =
      req.cookies.refreshToken;

    // remove token from DB

    await TokenModel.deleteOne({
      token: refreshToken
    });

    res.clearCookie(
      "refreshToken",
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      }
    );

    return res.json({
      success: true
    });
  }
);
```

***

# Refresh Token Table

```js
{
  userId: 101,
  token: "xyz123",
  expiresAt: "2026-07-10"
}
```

Logout:

```js
delete token record
```

Result:

```text
Refresh Request
       ↓
Token Not Found
       ↓
401 Unauthorized
```

***

# Enterprise Architecture

```text
React
  ↓
Auth Context
  ↓
Axios Interceptor
  ↓
Access Token

Refresh Token
  ↓
HttpOnly Cookie

Logout
  ↓
Backend Invalidate Refresh Token
  ↓
Clear React Query Cache
  ↓
BroadcastChannel
  ↓
All Tabs Logout
```

***

# Senior React Interview Answer

> In production applications, logout should do more than remove a JWT from local state. The frontend should call a logout endpoint that invalidates the refresh token on the server and clears the HttpOnly cookie. After logout, React Query caches should be cleared to prevent stale user data from appearing. For multi-tab support, the BroadcastChannel API can broadcast a logout event so that all open tabs immediately clear authentication state and redirect to the login screen. Authentication and role-based access patterns using protected routes and RBAC are common in React applications.

# 1. Logout with React Router Redirect

A common enterprise logout flow is:

```text
Logout
  ↓
Backend Logout API
  ↓
Clear Auth State
  ↓
Clear Cache
  ↓
Redirect Login
```

## AuthContext.jsx

```jsx
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const logout = async () => {

    try {

      await fetch(
        "/api/logout",
        {
          method: "POST",
          credentials: "include"
        }
      );

    } finally {

      // Clear React Query Cache
      queryClient.clear();

      // Remove Auth Data
      localStorage.removeItem(
        "accessToken"
      );

      sessionStorage.clear();

      // Redirect
      navigate(
        "/login",
        {
          replace: true
        }
      );
    }
  };

  return logout;
}
```

***

## Header Component

```jsx
function Header() {

  const logout =
    useLogout();

  return (
    <button
      onClick={logout}
    >
      Logout
    </button>
  );
}
```

***

# 2. Clear Redux Store on Logout

Very important in banking, fintech, and enterprise applications.

## Problem

Without clearing Redux:

```text
User A Logout
      ↓
User B Login
      ↓
User A Data Still Exists ❌
```

***

## Create Auth Action

```jsx
export const LOGOUT =
  "LOGOUT";
```

***

## Root Reducer

```jsx
import {
  combineReducers
} from "@reduxjs/toolkit";

const appReducer =
  combineReducers({
    auth: authReducer,
    users: usersReducer,
    profile: profileReducer
  });

export const rootReducer =
  (state, action) => {

    if (
      action.type ===
      "LOGOUT"
    ) {

      state = undefined;
    }

    return appReducer(
      state,
      action
    );
  };
```

***

## Logout Function

```jsx
import {
  useDispatch
} from "react-redux";

function LogoutButton() {

  const dispatch =
    useDispatch();

  const logout =
    () => {

      dispatch({
        type: "LOGOUT"
      });
    };

  return (
    <button
      onClick={logout}
    >
      Logout
    </button>
  );
}
```

***

## Effect

```text
Before Logout

Redux Store
-------------
auth
users
profile
dashboard

After Logout

Redux Store
-------------
Initial State
```

***

# 3. Refresh Token Expiry Handling on Backend

This is a very common Senior React / Node.js interview question.

***

## JWT Architecture

```text
Access Token
    ↓
15 Minutes

Refresh Token
    ↓
7 Days
```

***

## Login Flow

```text
User Login
      ↓
Issue Access Token
      ↓
Issue Refresh Token
      ↓
Store Refresh Token
```

***

## Refresh Request

```http
POST /refresh-token
```

Cookie:

```http
refreshToken=abc123
```

***

## Backend Refresh Endpoint

```js
app.post(
  "/refresh-token",
  async (req, res) => {

    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {

      return res.status(401)
        .json({
          message:
            "Missing refresh token"
        });
    }

    const storedToken =
      await TokenModel.findOne({
        token: refreshToken
      });

    if (!storedToken) {

      return res.status(401)
        .json({
          message:
            "Invalid refresh token"
        });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      (
        err,
        payload
      ) => {

        if (err) {

          return res.status(401)
            .json({
              message:
                "Token expired"
            });
        }

        const accessToken =
          jwt.sign(
            {
              id: payload.id,
              role: payload.role
            },
            process.env.ACCESS_SECRET,
            {
              expiresIn: "15m"
            }
          );

        return res.json({
          accessToken
        });
      }
    );
  }
);
```

***

# Token Expired Flow

```text
Access Token Expired
       ↓
Frontend Calls Refresh
       ↓
Refresh Token Expired
       ↓
401 Unauthorized
       ↓
Frontend Logout
       ↓
Redirect Login
```

***

# Refresh Token Rotation (Best Practice)

Instead of reusing:

```text
Old Refresh Token
```

Issue:

```text
New Refresh Token
```

every refresh request.

Flow:

```text
Refresh Request
      ↓
Generate New Access Token
      ↓
Generate New Refresh Token
      ↓
Delete Old Refresh Token
```

Benefits:

```text
✅ Better Security
✅ Prevent Token Replay
✅ Enterprise Standard
```

***

# Complete Production Logout Flow

```text
User Click Logout
       ↓
POST /logout
       ↓
Delete Refresh Token DB Record
       ↓
Clear HttpOnly Cookie
       ↓
Clear React Query Cache
       ↓
Clear Redux Store
       ↓
Broadcast Logout
       ↓
Redirect Login
```

***

# Senior React Interview Answer

> On logout, the frontend should clear React Context state, React Query cache, Redux store data, local/session storage, and redirect the user using React Router. The backend should invalidate the refresh token by removing it from persistent storage and clearing the HttpOnly cookie. If a refresh token has expired, the refresh endpoint must return `401 Unauthorized`, after which the frontend should force logout and navigate the user to the login page. This ensures both security and consistent session management across the application.
