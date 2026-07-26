### Common JWT (JSON Web Token) Interview Questions & Answers

JSON Web Tokens (JWT) are a core building block of modern web application architecture, especially in React and Node.js stacks. Interviewers love asking about JWTs to test your understanding of cryptography, stateless authentication, security vulnerabilities, and lifecycle management.

Here are the most frequently asked JWT interview questions, categorized by difficulty and focus.

---

### 1. Conceptual Questions

#### Q: What is a JWT, and what are its three core parts?

- **Answer:** A JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts separated by dots (`.`):

1. **Header:** Contains the token type (JWT) and the signing algorithm being used (e.g., `HS256` or `RS256`).
2. **Payload:** Contains the _claims_ (statements about an entity, such as user ID, role, and expiration timestamp like `exp`).
3. **Signature:** Created by combining the encoded header, encoded payload, and a secret/private key using the algorithm specified in the header. It guarantees that the token has not been tampered with.

#### Q: How does stateless authentication with JWT work?

- **Answer:** Unlike traditional session-based authentication (where the server stores session IDs in memory or a database/Redis), a JWT is **stateless**.

1. The user logs in with credentials.
2. The server verifies them and signs a JWT containing user details.
3. The server sends this token back to the client.
4. For subsequent requests, the client sends the token back (e.g., via Authorization header or cookie).
5. The server **does not check a database**. Instead, it cryptographically verifies the token's signature using its secret key. If valid, it trusts the payload.

---

### 2. Security & Vulnerability Questions

#### Q: What is the "None" algorithm attack in JWTs?

- **Answer:** Early JWT libraries allowed an attacker to tamper with the header of a JWT, change the algorithm field to `"alg": "none"`, strip out the signature entirely, and send it to the server. If the server implementation blindly trusted the header and skipped signature verification when `alg` was `none`, the attacker could inject any arbitrary payload (e.g., changing their role to `admin`) without knowing the secret key.
- **Mitigation:** Ensure your backend JWT verification library is modern and explicitly configured to reject the `none` algorithm.

#### Q: What is the difference between Symmetric (HS256) and Asymmetric (RS256) signing algorithms?

- **HS256 (HMAC with SHA-256):** Uses a **single shared secret key** to both sign and verify the token.
- _Risk:_ If you have microservices that need to verify tokens, every service must possess the secret key, increasing the surface area for exposure.

- **RS256 (RSA with SHA-256):** Uses an **asymmetric key pair**. A private key is used by the auth server to _sign_ the token, and a public key is distributed to other services or clients to _verify_ the token.
- _Benefit:_ Even if a resource server is compromised, attackers cannot forge new tokens because they don't have the private key.

---

### 3. Lifecycle & Token Management Questions

#### Q: Since JWTs are stateless, how do you handle logout or revoke a token before it expires?

- **Answer:** Because the server doesn't track tokens, a valid JWT remains valid until its `exp` time is reached, even if the user clicks "Logout." To fix this, developers use strategies like:

1. **Token Blacklisting / Revocation List:** When a user logs out, store the token's unique ID (`jti`) or the token itself in a fast, in-memory cache like **Redis** with an expiration matching the token's remaining lifetime. Your backend auth middleware checks this blacklist on every request.
2. **Short-Lived Access Tokens + Refresh Tokens:** Issue access tokens that expire very quickly (e.g., 5–15 minutes) combined with a long-lived refresh token stored securely. If a user logs out, you simply delete or invalidate the refresh token in your database.

#### Q: How do you handle token expiration gracefully in a React frontend without disrupting the user?

- **Answer:**

1. When an API call fails with a `401 Unauthorized` due to an expired access token, intercept the error using an **Axios Interceptor**.
2. Automatically trigger a background request to the Node.js backend's `/refresh-token` endpoint (sending the refresh token via a secure `HttpOnly` cookie).
3. If the refresh token is valid, the backend issues a new access token.
4. The interceptor catches the new token, retries the original failed API request seamlessly, and the user experiences zero interruption.

### Advanced JWT Scenario: Implementing a Dual-Token System (Access + Refresh Token) with Complete Code

A common and critical interview task is writing or explaining the dual-token architecture: using a **short-lived Access Token** for fast authorization checks and a **long-lived Refresh Token** (stored securely in an `HttpOnly` cookie) to maintain the session.

Below is a complete, production-style implementation demonstrating this pattern across a Node.js/Express backend and a React frontend.

---

### Part 1: Node.js (Backend) Implementation

#### 1. Generating and Issuing Tokens on Login

When a user authenticates successfully, you issue both an access token (sent in the JSON body) and a refresh token (saved in an `HttpOnly` cookie).

```javascript
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Mongoose or Sequelize model

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }, // Short lived
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }, // Long lived
  );

  return { accessToken, refreshToken };
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to DB (to allow revocation/rotation tracking)
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token securely in an HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token and user info in body
    res.status(200).json({ accessToken, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 2. The Token Refresh Endpoint

When the access token expires, the client calls this endpoint. The server validates the `HttpOnly` cookie and issues a new access token.

```javascript
exports.refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);

    const refreshToken = cookies.refreshToken;

    // Check if user exists with this refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(403); // Reuse detection / Invalid token

    // Verify refresh token signature
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err || user._id.toString() !== decoded.userId) {
        return res.sendStatus(403);
      }

      // Generate a fresh Access Token
      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" },
      );

      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

### Part 2: React (Frontend) Implementation

#### Handling Token Injection & Automatic Refresh via Axios Interceptors

Instead of managing token expiration manually inside components, you configure an Axios interceptor to catch `401 Unauthorized` responses, request a new access token silently, and retry the original request.

```javascript
import axios from "axios";

// Create a custom axios instance
const api = axios.create({
  baseURL: "https://api.domain.com",
  withCredentials: true, // Crucial: allows cookies (refreshToken) to be sent automatically
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// 1. Request Interceptor: Attach Access Token to headers
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response Interceptor: Catch expired token and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried retrying yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint to get a new access token
        const { data } = await axios.get(
          "https://api.domain.com/auth/refresh",
          {
            withCredentials: true,
          },
        );

        accessToken = data.accessToken;

        // Update header and retry original failed request
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token also expired or is invalid -> Force logout/redirect to login
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
```

### Advanced JWT Architecture Scenarios & Implementation Code

The following collection presents **12 technical scenarios** related to JSON Web Tokens (JWT) in a Node.js and React stack, complete with implementation code.

---

### Scenario 1: Preventing the "None" Algorithm Exploit

> **The Problem:** An attacker modifies the JWT header to `"alg": "none"`, strips the signature, and injects custom payloads.
> **Solution:** Explicitly restrict allowed algorithms during verification.

```javascript
const jwt = require("jsonwebtoken");

const verifyTokenSafely = (token, secret) => {
  try {
    // Explicitly enforce algorithms to prevent 'none' algorithm bypasses
    return jwt.verify(token, secret, { algorithms: ["HS256"] });
  } catch (err) {
    throw new Error("Unauthorized: Invalid token signature or algorithm");
  }
};
```

---

### Scenario 2: Stateless Token Blacklisting Using Redis

> **The Problem:** Instantly revoking a valid JWT on user logout when there is no database session layer.
> **Solution:** Store the token's unique identifier (`jti`) or token hash in Redis with an expiry matching the token's remaining life.

```javascript
const redis = require("redis");
const client = redis.createClient();

// Blacklist token on logout
const blacklistToken = async (token, expiresInSeconds) => {
  await client.setEx(`bl_${token}`, expiresInSeconds, "revoked");
};

// Middleware check
const checkBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const isBlacklisted = await client.get(`bl_${token}`);
  if (isBlacklisted)
    return res.status(401).json({ message: "Token has been revoked" });
  next();
};
```

---

### Scenario 3: Asymmetric Key Validation (RS256) for Microservices

> **The Problem:** Sharing a single symmetric secret across multiple internal microservices exposes the entire system if one service is breached.
> **Solution:** Use an RSA public/private key pair.

```javascript
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Resource Server only needs the public key to verify
const PUBLIC_KEY = fs.readFileSync("./public.pem", "utf8");

const verifyMicroserviceToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid public key signature" });
  }
};
```

---

### Scenario 4: Handling Concurrent Token Refresh Race Conditions in React

> **The Problem:** Multiple API requests fire simultaneously when an access token expires, triggering multiple simultaneous `/refresh` requests and breaking the queue.
> **Solution:** Implement a request queue flag in the Axios interceptor.

```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Inside Axios Response Interceptor error handler:
if (error.response?.status === 401 && !originalRequest._retry) {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.get("/auth/refresh");
      setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);
      originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
      resolve(api(originalRequest));
    } catch (err) {
      processQueue(err, null);
      reject(err);
    } finally {
      isRefreshing = false;
    }
  });
}
```

---

### Scenario 5: Rotating Secrets Without Global Logouts

> **The Problem:** Changing your application secret logs out every active user instantly.
> **Solution:** Implement dual-secret verification support during transition periods.

```javascript
const verifyWithSecretRotation = (token) => {
  const currentSecret = process.env.JWT_CURRENT_SECRET;
  const previousSecret = process.env.JWT_PREVIOUS_SECRET;

  try {
    return jwt.verify(token, currentSecret);
  } catch (err) {
    // Fall back to previous secret during rotation window
    return jwt.verify(token, previousSecret);
  }
};
```

---

### Scenario 6: Enforcing Audience (`aud`) and Issuer (`iss`) Validation

> **The Problem:** An attacker generates a valid JWT on a secondary microservice and submits it to your primary payment API.
> **Solution:** Validate explicit claims like `aud` and `iss` inside verification options.

```javascript
const verifyStrictClaims = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: "https://auth.mycompany.com",
    audience: "https://api.mycompany.com/payments",
  });
};
```

---

### Scenario 7: Handling Clock Skew Across Distributed Node Servers

> **The Problem:** Minor time differences between microservice containers cause valid tokens to fail with `TokenExpiredError`.
> **Solution:** Set a clock tolerance window.

```javascript
const verifyWithClockSkew = (token) => {
  // Allow a 30-second leeway for minor server clock drift
  return jwt.verify(token, process.env.JWT_SECRET, { clockTolerance: 30 });
};
```

---

### Scenario 8: User Session Invalidation via Token Versioning

> **The Problem:** You need to wipe out a user's access everywhere (e.g., password reset) without complex blacklists.
> **Solution:** Store a `tokenVersion` counter in the user database and embed it inside the JWT payload.

```javascript
// Issue token with version
const token = jwt.sign({ userId: user._id, v: user.tokenVersion }, secret);

// Middleware validation check against database or cache
const validateTokenVersion = async (req, res, next) => {
  const decoded = jwt.verify(req.token, secret);
  const user = await User.findById(decoded.userId);

  if (user.tokenVersion !== decoded.v) {
    return res
      .status(401)
      .json({ message: "Session invalidated due to security change" });
  }
  next();
};
```

---

### Scenario 9: React Context Integration with Decoded JWT Payloads

> **The Problem:** The React app needs to extract user metadata (roles, IDs) immediately on page load without making an extra `/me` network request.
> **Solution:** Decode the token safely on the frontend using a lightweight library like `jwt-decode`.

```javascript
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.userId, role: decoded.role });
      } catch (err) {
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### Scenario 10: Protecting Against Replay Attacks via `jti` Tracking

> **The Problem:** An attacker intercepts a valid one-time transaction token and replays it.
> **Solution:** Ensure every token has a unique `jti` claim and mark it as consumed in Redis immediately.

```javascript
const preventReplayAttack = async (req, res, next) => {
  const decoded = jwt.verify(req.headers.authorization.split(" ")[1], secret);
  const tokenJti = decoded.jti;

  const exists = await client.get(`jti_${tokenJti}`);
  if (exists)
    return res.status(403).json({ message: "Replay attack detected" });

  // Mark jti as consumed for the duration of its life
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  await client.setEx(`jti_${tokenJti}`, ttl, "consumed");
  next();
};
```

---

### Scenario 11: Sanitizing Payload Data to Prevent Information Disclosure

> **The Problem:** Developers accidentally put sensitive internal properties (like password hashes or internal billing models) inside the JWT payload.
> **Solution:** Explicitly map allowed claims during token generation.

```javascript
const createSafePayload = (userDoc) => {
  // Explicitly pick non-sensitive fields
  return {
    sub: userDoc._id,
    role: userDoc.role,
    email: userDoc.email,
    // NEVER include: password, salt, creditCard, ssn
  };
};
```

---

### Scenario 12: React Router Lazy Route Guard with Pre-validation

> **The Problem:** A user clicks a link, and React renders the protected shell layout briefly before the token validation catches a failure.
> **Solution:** Validate token expiration status synchronously before layout mounting.

```javascript
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RequireValidToken = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
```

### Complete End-to-End Implementation: Login, Authentication, and Role-Based Authorization

This complete, production-ready example demonstrates a full cycle:

1. **Node.js/Express Backend:** Handles user registration, secure login, dual-token issuance (Access + Refresh tokens stored in `HttpOnly` cookies), verification middleware, and role-based access control (RBAC).
2. **React Frontend:** Handles login state management, Axios interceptors with automatic token refreshing, and protected React routing based on roles.

---

### Part 1: Node.js & Express Backend

#### 1. Models (`models/User.js`)

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "editor"], default: "user" },
  refreshToken: { type: String },
});

module.exports = mongoose.model("User", userSchema);
```

#### 2. Auth Controller (`controllers/authController.js`)

```javascript
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate Tokens Helper
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

// Login Endpoint
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token securely in DB for rotation/revocation
    user.refreshToken = refreshToken;
    await user.save();

    // Set HttpOnly Cookie for Refresh Token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token and role back in JSON body
    res.status(200).json({ accessToken, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh Token Endpoint
exports.refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);

  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(403); // Forbidden (Reuse detected or revoked)

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.userId)
      return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken });
  });
};
```

#### 3. Auth & RBAC Middleware (`middleware/authMiddleware.js`)

```javascript
const jwt = require("jsonwebtoken");

// 1. Verify Access Token Middleware
exports.verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Token expired or invalid" });
    req.user = decoded; // { userId, role }
    next();
  });
};

// 2. Role-Based Access Control (RBAC) Middleware
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};
```

#### 4. Express App Setup (`server.js`)

```javascript
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { login, refresh } = require("./controllers/authController");
const { verifyJWT, checkRole } = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Public Routes
app.post("/api/auth/login", login);
app.get("/api/auth/refresh", refresh);

// Protected User Route
app.get("/api/dashboard", verifyJWT, (req, res) => {
  res.json({ message: `Welcome user with ID: ${req.user.userId}` });
});

// Protected Admin-Only Route
app.delete(
  "/api/admin/users/:id",
  verifyJWT,
  checkRole(["admin"]),
  (req, res) => {
    res.json({ message: `Admin successfully deleted user ${req.params.id}` });
  },
);

app.listen(5000, () => console.log("Server running on port 5000"));
```

---

### Part 2: React Frontend

#### 1. API Client with Auto-Refresh Interceptor (`api/axios.js`)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Essential to send/receive HttpOnly cookies
});

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};

// Attach Access Token to requests
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle expired tokens automatically using response interceptors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/refresh",
          {
            withCredentials: true,
          },
        );
        accessToken = data.accessToken;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
```

#### 2. Protected Route Component (`components/ProtectedRoute.jsx`)

```jsx
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setAccessToken } from "../api/axios";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);

    // Check token expiration
    if (Date.now() >= decoded.exp * 1000) {
      return <Navigate to="/login" replace />;
    }

    // Check Role Authorization
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    setAccessToken(token); // Sync memory token
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

#### 3. Application Router (`App.jsx`)

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Regular User & Admin Protected Route */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "editor"]} />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Strict Admin-Only Protected Route */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Session-Based vs. Token-Based Authentication: Architectural Deep Dive

When designing full-stack applications in React and Node.js, choosing between **Session-Based Authentication (Stateful)** and **Token-Based Authentication (Stateless/JWT)** is a fundamental architecture decision.

---

### Part 1: Core Differences (The Comparison)

| Feature                               | Session-Based (Stateful)                                                       | Token-Based (Stateless / JWT)                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Where is state stored?**            | Server-side (Memory, Redis, or Database session store).                        | Client-side (Encoded inside the JWT payload sent on every request).                                     |
| **How does the client authenticate?** | Sends a unique **Session ID** via an `HttpOnly` cookie.                        | Sends a **JWT** via the `Authorization: Bearer <token>` header or `HttpOnly` cookie.                    |
| **Server Validation**                 | The server looks up the Session ID in its active store/cache on every request. | The server cryptographically verifies the token's signature without touching a database.                |
| **Revocation / Logout**               | Instant (Simply delete the session record from server memory/Redis).           | Harder to revoke instantly before expiration unless using a blacklist/token versioning.                 |
| **Scaling & Microservices**           | Requires shared central session storage (like Redis) across servers.           | Highly scalable across distributed services since any service with the public/secret key can verify it. |

---

### Part 2: Complete Scenario & Implementation: Session-Based Authentication

> **The Scenario:**
> You are building a high-security internal banking dashboard. Regulatory compliance demands that if an administrator revokes a user's session, the system must terminate access **instantly** across all open browser windows without waiting for token expiration. Session-based authentication handles this natively because the server holds the state.

#### 1. Node.js Backend (Express + `express-session` + Redis)

```javascript
const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Initialize Redis Client for centralized session storage
const redisClient = createClient();
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "super-secret-session-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// Login Endpoint (Creates Session)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "secret") {
    // Attach user metadata to req.session (Stored in Redis)
    req.session.userId = "609c1234567890abcdef1234";
    req.session.role = "admin";
    return res.json({ message: "Logged in successfully via Session" });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// Protected Route Middleware Check
const requireSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Unauthorized: No active session" });
  }
  next();
};

app.get("/api/dashboard", requireSession, (req, res) => {
  res.json({ message: `Welcome user ${req.session.userId}, session active.` });
});

// Logout Endpoint (Destroys Session instantly in Redis)
app.post("/api/logout", requireSession, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Could not log out" });
    res.clearCookie("connect.sid"); // Clear session cookie name
    res.json({ message: "Logged out successfully" });
  });
});

app.listen(5000, () => console.log("Session backend running on port 5000"));
```

#### 2. React Frontend (Session-Based Client)

```jsx
import axios from "axios";

// Configure axios to always send and receive cookies automatically
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const login = async () => {
  await api.post("/login", { username: "admin", password: "secret" });
  window.location.href = "/dashboard";
};

const checkDashboard = async () => {
  try {
    const { data } = await api.get("/dashboard");
    console.log(data.message);
  } catch (err) {
    console.error("Session expired or missing");
  }
};
```

---

### Part 3: Complete Scenario & Implementation: Token-Based Authentication (JWT)

> **The Scenario:**
> You are building a high-traffic public mobile application and a React web dashboard. Third-party microservices deployed across different regions need to verify user permissions instantly without making centralized database lookups or querying a main session cluster. Token-based stateless authentication satisfies this requirement.

#### 1. Node.js Backend (Express + JWT)

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const JWT_SECRET = "super-secret-jwt-key";

// Login Endpoint (Issues a signed stateless JWT)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "user" && password === "password") {
    const payload = { userId: "12345", role: "user" };

    // Sign token with 15-minute expiration
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

    return res.json({ accessToken: token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// Stateless Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token expired or invalid" });
    req.user = decoded; // Attached decoded payload (userId, role)
    next();
  });
};

app.get("/api/protected-data", verifyToken, (req, res) => {
  res.json({
    message: `Access granted via JWT for user ID: ${req.user.userId}`,
  });
});

app.listen(4000, () => console.log("Token backend running on port 4000"));
```

#### 2. React Frontend (Token-Based Client with Header Injection)

```jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

let inMemoryToken = null;

export const setAuthToken = (token) => {
  inMemoryToken = token;
};

// Automatically inject JWT into headers on every request
api.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers["Authorization"] = `Bearer ${inMemoryToken}`;
  }
  return config;
});

const login = async () => {
  const { data } = await api.post("/login", {
    username: "user",
    password: "password",
  });
  setAuthToken(data.accessToken); // Store token in memory (or local storage)
  console.log("Token acquired and attached successfully");
};
```

### Real-World Use Case Scenarios: Session vs. Token-Based Architecture

To master authentication choices in an interview, you must know **when** to apply each pattern based on system topology, client constraints, and security requirements.

Below are **6 real-world scenarios** (3 for Sessions, 3 for Tokens) mapped directly to functional code examples spanning Node.js and React.

---

### Part 1: Session-Based Use Cases (Stateful)

#### Scenario 1: High-Security Financial App Requiring Instant Administrative Revocation

- **The Context:** A banking portal needs to instantly lock out a compromised user account. Because sessions are stateful and tracked on the server (e.g., Redis), deleting the session key revokes access **instantly**, avoiding token expiration delays.

##### Implementation Code (Node.js & React)

```javascript
// Node.js Backend: Instant Logout & Session Destruction
app.post("/api/admin/revoke-user", requireAdminSession, async (req, res) => {
  const { targetUserId } = req.body;

  // Scan or delete target user session from Redis store immediately
  const sessionKeys = await redisClient.keys(`sess:*`);
  for (const key of sessionKeys) {
    const data = await redisClient.get(key);
    if (data && JSON.parse(data).userId === targetUserId) {
      await redisClient.del(key); // Terminate session instantly
    }
  }
  res.json({ message: "User session forcefully terminated." });
});
```

---

#### Scenario 2: Monolithic E-Commerce Cart Persistence

- **The Context:** An online store tracks lightweight shopping cart data tied to anonymous or logged-in users. Session data storage on the server minimizes client-side payload complexity.

##### Implementation Code (Node.js Backend)

```javascript
// Node.js Backend: Attaching Cart State to Server Session
app.post("/api/cart/add", (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(req.body.item);
  res.json({ totalItems: req.session.cart.length });
});
```

---

#### Scenario 3: Single-Domain Browser-Only Application (CSRF Defense via SameSite Cookies)

- **The Context:** Your application lives entirely on `app.company.com` and has no external mobile clients or public APIs. Using `HttpOnly`, `Secure`, `SameSite=Strict` cookies completely prevents JavaScript access, mitigating XSS token-theft vectors.

##### Implementation Code (Node.js Backend Cookie Configuration)

```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Immune to document.cookie XSS theft
      secure: true, // Requires HTTPS
      sameSite: "strict", // Protects against cross-site request forgery
    },
  }),
);
```

---

### Part 2: Token-Based / JWT Use Cases (Stateless)

#### Scenario 4: Cross-Domain Microservices Ecosystem (SSO)

- **The Context:** Your company operates multiple domains (`auth.company.com`, `dashboard.company.com`, `reports.company.com`). A cryptographically signed JWT allows independent downstream services to verify user identity using a public key without querying a centralized database.

##### Implementation Code (Node.js Microservice Verification via RS256 Public Key)

```javascript
const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync("./public.pem", "utf8");

const verifyMicroserviceAccess = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded; // Stateless validation successful across domains
    next();
  });
};
```

---

#### Scenario 5: Decoupled Native Mobile App & Public Third-Party REST APIs

- **The Context:** Your React app is now packaged into a React Native mobile application alongside a public developer API. Mobile clients cannot handle browser cookie jars natively as reliably as standard web browsers, making explicit Bearer token headers mandatory.

##### Implementation Code (React Frontend Axios Request Interceptor)

```javascript
import axios from "axios";

const api = axios.create({ baseURL: "https://api.company.com/v1" });
let storedJwtToken = null;

export const setClientToken = (token) => {
  storedJwtToken = token;
};

api.interceptors.request.use((config) => {
  if (storedJwtToken) {
    config.headers["Authorization"] = `Bearer ${storedJwtToken}`;
  }
  return config;
});
```

---

#### Scenario 6: Edge Computing / Serverless Functions (AWS Lambda / Cloudflare Workers)

- **The Context:** Your API routes are deployed to serverless edge functions that scale to zero and do not maintain persistent memory or fast network connections to a central Redis session cluster. JWTs allow instant stateless validation at the edge.

##### Implementation Code (Cloudflare Worker / Node Edge Function Verification)

```javascript
// Edge-compatible lightweight JWT claim validation
import { jwtVerify } from "jose";

export async function handleEdgeRequest(request, env) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    return new Response(
      JSON.stringify({ status: "Authorized Edge Request", user: payload }),
      { status: 200 },
    );
  } catch (err) {
    return new Response("Unauthorized Edge Access", { status: 403 });
  }
}
```
