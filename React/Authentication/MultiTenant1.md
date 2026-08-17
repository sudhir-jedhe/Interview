This is an advanced architectural topic. In a frontend interview, building a Multi-Tenant app tests your knowledge of **System Design, Routing, Security, and State Management**.

A Multi-Tenant application is a single codebase that serves multiple clients (tenants). Each tenant usually gets their own custom branding, feature flags, and isolated data, often accessed via a subdomain (`companyA.yourapp.com`) or URL path (`[yourapp.com/companyA](https://yourapp.com/companyA)`).

> **Repo Organization Tip:** Save this comprehensive guide inside `09-System-Design-Concepts/scenario-problems/multi-tenant-react-architecture.md`.

Here is the complete architectural blueprint and implementation for a Multi-Tenant React App.

---

# Architecture: Multi-Tenant React Application

## The Core Pillars

To build a scalable multi-tenant app, you must solve four specific problems in a strict order:

1. **Tenant Resolution:** Figuring out *who* the tenant is before the app loads.
2. **State & Config Management:** Loading the tenant's specific theme and feature flags.
3. **Authentication & Authorization:** Securing routes based on the user's role *within that specific tenant*.
4. **Routing:** Structuring the router to handle tenant-specific paths.

---

1. **Tenant Resolution (The Entry Point):**
Before React renders the main app, you must determine the tenant. This is usually done by reading the URL (subdomain or path).

```javascript
// utils/tenantResolver.js
export function getTenantId() {
  // Example 1: Subdomain strategy (e.g., apple.myapp.com)
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  
  // Example 2: Path strategy (e.g., myapp.com/apple)
  const pathname = window.location.pathname;
  const pathTenant = pathname.split('/')[1];

  // Assuming we use path strategy for this example
  return pathTenant || 'default'; 
}

```

1. **Tenant State Management (Context + Zustand/Redux):**
Once you know the tenant, fetch their configuration (logos, colors, enabled features) and store it globally. We use a React Context Provider to block the app from rendering until this data loads.

```jsx
// context/TenantContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTenantId } from '../utils/tenantResolver';

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [tenantConfig, setTenantConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const tenantId = getTenantId();

  useEffect(() => {
    // Fetch specific config from your API
    fetch(`/api/tenants/${tenantId}/config`)
      .then(res => res.json())
      .then(data => {
        setTenantConfig(data);
        // Apply dynamic theme (CSS Variables)
        document.documentElement.style.setProperty('--primary-color', data.primaryColor);
        setLoading(false);
      });
  }, [tenantId]);

  if (loading) return <div>Loading Tenant Workspace...</div>;

  return (
    <TenantContext.Provider value={{ tenantId, config: tenantConfig }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);

```

1. **Authentication & Role-Based Authorization (RBAC):**
In a multi-tenant app, a user might be an `Admin` in Tenant A, but only a `Viewer` in Tenant B. Your authentication token (JWT) should contain tenant-specific roles.

```jsx
// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTenant } from '../context/TenantContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const { tenantId } = useTenant();

  if (!isAuthenticated) {
    return <Navigate to={`/${tenantId}/login`} replace />;
  }

  // Check if user has the required role FOR THIS SPECIFIC TENANT
  const userRoleInTenant = user.tenantRoles[tenantId]; 
  
  if (!allowedRoles.includes(userRoleInTenant)) {
    return <Navigate to={`/${tenantId}/unauthorized`} replace />;
  }

  return <Outlet />; // Render the protected component
}

```

1. **Dynamic Routing Configuration:**
Tie it all together using React Router v6. All routes are prefixed with the `:tenantId` or wrapped in the `TenantProvider` if using subdomains.

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/:tenantId/login" element={<Login />} />
          
          {/* Protected Routes: Require 'Admin' or 'Editor' */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Editor']} />}>
            <Route path="/:tenantId/dashboard" element={<Dashboard />} />
          </Route>

          {/* Protected Routes: Require 'Admin' only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/:tenantId/settings" element={<Settings />} />
          </Route>
        </Routes>
      </TenantProvider>
    </BrowserRouter>
  );
}

```

1. **API Interceptors (Axios):**
Every time the app makes an API call, the backend needs to know which tenant the data belongs to. Configure Axios to inject the `X-Tenant-ID` into every outgoing request automatically.

```javascript
// api/axiosClient.js
import axios from 'axios';
import { getTenantId } from '../utils/tenantResolver';

const axiosClient = axios.create({
  baseURL: 'https://api.yourdomain.com',
});

// Inject Tenant ID into headers automatically
axiosClient.interceptors.request.use((config) => {
  const tenantId = getTenantId();
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  
  // Also attach Auth token here
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

export default axiosClient;

```

---

### Interview Talking Points for this Architecture

* **Data Isolation:** By enforcing `X-Tenant-ID` in the Axios interceptor, we ensure the frontend never accidentally requests or leaks data from another workspace.
* **Performance:** We load the `TenantConfig` (colors, logos) before the app mounts, meaning the user won't see a "flash" of the wrong theme.
* **Scalability:** Because the React router paths and API calls are dynamic based on the URL, onboarding a new tenant requires *zero* frontend code changes.

**Show me how to dynamically apply branding, themes, and CSS variables for different tenants in a React app.**

This is a perfect addition to your System Design folder. In interviews, when asked about multi-tenant theming, the absolute best approach to discuss is **CSS Variables (Custom Properties)**.

Unlike loading separate `.css` files (which bloats your bundle and requires a new deployment for every new client), CSS variables allow you to fetch a JSON configuration from your backend and inject it directly into the browser at runtime.

> **Repo Organization Tip:** Save this content inside `09-System-Design-Concepts/scenario-problems/dynamic-theming.md`.

---

# Scenario: Dynamic Branding & Theming for Multi-Tenant Apps

**The Task:** Implement a system where different tenants logging into the same React application see their own company's primary colors, fonts, and border-radius styles without requiring separate CSS files or rebuilds.

## The Strategy: JSON to CSS Variables

1. **The API returns JSON:** The backend sends a configuration object containing the tenant's brand settings.
2. **React injects the variables:** We map the JSON keys to CSS variables and inject them into the `document.documentElement` (`:root`).
3. **CSS uses the variables:** All styles (or Tailwind classes) reference these native CSS variables.

---

### Step 1: The Tenant Configuration (Mock API Response)

When your app loads, it makes a request to `/api/tenant/:id/config`. It receives a JSON object like this:

```json
{
  "tenantId": "acme-corp",
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#1e40af",
    "backgroundColor": "#f8fafc",
    "fontFamily": "'Inter', sans-serif",
    "buttonRadius": "8px"
  },
  "logoUrl": "https://cdn.example.com/acme-logo.png"
}

```

### Step 2: The Theme Provider Component

Create a utility function to apply these styles, and call it inside your `TenantProvider` (or a dedicated `ThemeProvider`) right after fetching the config.

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Utility function to inject CSS variables into the DOM
const applyThemeToDOM = (themeConfig) => {
  const root = document.documentElement;
  
  // Map JSON properties to CSS variables
  root.style.setProperty('--theme-primary', themeConfig.primaryColor);
  root.style.setProperty('--theme-secondary', themeConfig.secondaryColor);
  root.style.setProperty('--theme-bg', themeConfig.backgroundColor);
  root.style.setProperty('--theme-font', themeConfig.fontFamily);
  root.style.setProperty('--theme-radius', themeConfig.buttonRadius);
};

const ThemeContext = createContext(null);

export function ThemeProvider({ tenantId, children }) {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Fetch the theme for the specific tenant
    fetch(`/api/tenants/${tenantId}/theme`)
      .then(res => res.json())
      .then(data => {
        setTheme(data);
        applyThemeToDOM(data.theme); // Inject styles
        setLoading(false);
      })
      .catch(err => console.error("Failed to load theme", err));
  }, [tenantId]);

  // Prevent app from rendering until theme is applied to avoid "flashing"
  if (loading) return <div className="loader">Loading workspace...</div>;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

```

### Step 3: Using the Variables

Now, your application's CSS never needs to know *which* tenant is logged in. It just uses the variables.

**Vanilla CSS (`styles.css`):**

```css
/* Fallback values in case the API fails */
:root {
  --theme-primary: #000000;
  --theme-secondary: #333333;
  --theme-bg: #ffffff;
  --theme-font: 'Arial', sans-serif;
  --theme-radius: 4px;
}

body {
  background-color: var(--theme-bg);
  font-family: var(--theme-font);
}

.tenant-button {
  background-color: var(--theme-primary);
  border-radius: var(--theme-radius);
  color: white;
  padding: 10px 20px;
  border: none;
}

.tenant-button:hover {
  background-color: var(--theme-secondary);
}

```

**Tailwind CSS Integration (`tailwind.config.js`):**
If you are using Tailwind, you can map your Tailwind utility classes directly to your injected CSS variables! This is a massive flex in an interview.

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Now you can use `bg-primary` or `text-primary` in your React components!
        primary: 'var(--theme-primary)',
        secondary: 'var(--theme-secondary)',
        background: 'var(--theme-bg)',
      },
      fontFamily: {
        tenant: 'var(--theme-font)',
      },
      borderRadius: {
        tenant: 'var(--theme-radius)',
      }
    },
  },
  plugins: [],
}

```

---

## 🧠 Key Interview Talking Points

If you explain this setup to an interviewer, make sure to highlight these three advantages:

1. **Zero Bundle Bloat:** We don't need a separate CSS file for every tenant. We have one CSS file (or Tailwind config), and the browser paints the colors dynamically. This scales infinitely.
2. **Preventing FOUC (Flash of Unstyled Content):** Notice how `ThemeProvider` returns a loading state until the fetch is complete and `applyThemeToDOM` runs. This guarantees the user never sees default colors before their brand colors pop in.
3. **White-label Friendly:** By keeping the `logoUrl` in the API response, we can dynamically render `<img src={theme.logoUrl} alt="Company Logo" />` in our Navigation bar, making the app entirely white-labeled for the client.

**Explain how to implement feature flags in a multi-tenant React app so some clients get beta features while others don't.**

This is a crucial pattern for enterprise applications. Feature flags allow you to decouple **code deployment** from **feature release**. You can merge code into production safely, but only turn it on for specific tenants (like early-adopter beta testers).

> **Repo Organization Tip:** Save this content inside `09-System-Design-Concepts/scenario-problems/feature-flags.md`.

---

# Scenario: Feature Flags in a Multi-Tenant App

**The Task:** Implement a system where a specific component or page (like a new "Beta Dashboard") is only visible to tenants who have that feature explicitly enabled in their database configuration.

## The Strategy

1. **The API Payload:** The backend tenant configuration includes an array or object of enabled features.
2. **The Context:** Store these flags globally in React Context when the app loads.
3. **The Hook:** Create a `useFeatureFlag` hook to check permissions in logic.
4. **The Wrapper:** Create a `<FeatureGuard>` component to declaratively wrap UI elements.
5. **Code Splitting (Advanced):** Use `React.lazy` so tenants without the feature don't even download the JavaScript for it.

---

### Step 1: The API Response

When fetching the tenant config, the backend includes a `features` object. Using an object (hash map) instead of an array makes checking flags an $O(1)$ operation instead of $O(n)$.

```json
{
  "tenantId": "acme-corp",
  "features": {
    "beta-dashboard": true,
    "ai-assistant": false,
    "advanced-analytics": true
  }
}

```

### Step 2: The Hook and Context Wrapper

We extend our existing `TenantContext` (from the previous architectural steps) to expose these flags.

```jsx
import React, { createContext, useContext } from 'react';

// Assuming we fetched config and stored it in context
const FeatureFlagContext = createContext({});

export function FeatureFlagProvider({ features, children }) {
  return (
    <FeatureFlagContext.Provider value={features}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// Custom Hook for logic-based checks
export function useFeatureFlag(featureName) {
  const features = useContext(FeatureFlagContext);
  // Returns true if the feature exists and is true, otherwise false
  return !!features[featureName]; 
}

```

### Step 3: The `<FeatureGuard>` Component

For clean JSX, we build a wrapper component. If the flag is true, it renders the children. If false, it renders an optional fallback (or nothing at all).

```jsx
import React from 'react';
import { useFeatureFlag } from './useFeatureFlag';

export function FeatureGuard({ feature, fallback = null, children }) {
  const isEnabled = useFeatureFlag(feature);

  if (!isEnabled) {
    return fallback;
  }

  return <>{children}</>;
}

```

### Step 4: Using It in the Application

Now you can control UI visibility declaratively or conditionally inside your components.

```jsx
import React from 'react';
import { FeatureGuard } from './FeatureGuard';
import { useFeatureFlag } from './useFeatureFlag';

export default function Sidebar() {
  const isAiEnabled = useFeatureFlag('ai-assistant');

  const handleAiClick = () => {
    if (!isAiEnabled) return;
    // Execute AI logic...
  };

  return (
    <nav>
      <a href="/home">Home</a>
      <a href="/settings">Settings</a>

      {/* Declarative usage for UI elements */}
      <FeatureGuard feature="beta-dashboard" fallback={<span>Upgrade to see Beta!</span>}>
        <a href="/beta">Beta Dashboard</a>
      </FeatureGuard>

      {/* Hook usage for logic or event handlers */}
      <button 
        onClick={handleAiClick} 
        className={isAiEnabled ? 'btn-active' : 'btn-disabled'}
      >
        Ask AI
      </button>
    </nav>
  );
}

```

---

## 🧠 Key Interview Talking Points

If an interviewer asks you to build or explain a feature flag system, mentioning these three concepts will elevate you from a mid-level to a senior-level candidate:

1. **Decoupling Deployment vs. Release:** Feature flags allow the team to practice Continuous Integration (CI). You can deploy half-finished features to production safely hidden behind a flag. Marketing decides when to "release" it by flipping the flag in the database, requiring zero code deployments.
2. **Granular Rollouts & Canary Testing:** Explain how this system allows you to roll out a risky feature to 5% of tenants first. If errors spike, you flip the database flag to `false` and instantly roll it back without needing to revert Git commits or redeploy the frontend.
3. **Optimizing Bundle Size with React.lazy:** A naive feature flag still forces the user to download the hidden component's code. Mention that for large features (like an entire dashboard), you would combine `<FeatureGuard>` with `React.lazy()` and `<Suspense>`. This ensures the JavaScript for the beta feature is only fetched over the network if the flag is actually `true`.

**How do I configure my local environment and React Router to test subdomain-based multi-tenancy?**

This is a fantastic technical challenge. Testing subdomains locally trips up a lot of developers because `localhost` doesn't naturally support wildcards, and React Router only cares about the *path* (everything after the slash), not the *domain*.

Here is how you set up your local OS, your bundler, and React Router to make subdomain-based multi-tenancy work seamlessly.

> **Repo Organization Tip:** Save this content inside `09-System-Design-Concepts/scenario-problems/subdomain-routing.md`.

---

# Scenario: Configuring Subdomain Routing Locally

**The Task:** We want `company-a.localhost:3000` to load Tenant A's data, and `company-b.localhost:3000` to load Tenant B's data, with normal React Router paths like `/dashboard`.

## Step 1: Fooling Your Local Machine

By default, your browser doesn't know what `company-a.localhost` is. You have two ways to fix this:

**The Pro-Tip Method (Easiest): Use `lvh.me**`
Instead of using `localhost`, use `lvh.me` (Local Virtual Host). It is a free public DNS record that maps `*.lvh.me` directly to `127.0.0.1`.

* You don't need to change any OS settings.
* Just visit `[http://company-a.lvh.me:3000](http://company-a.lvh.me:3000)` in your browser.

**The Manual Method (Editing the hosts file)**
If you are offline or prefer strict `localhost`, edit your OS hosts file:

* **Mac/Linux:** `/etc/hosts`
* **Windows:** `C:\Windows\System32\drivers\etc\hosts`
Add these lines:

```text
127.0.0.1   company-a.localhost
127.0.0.1   company-b.localhost

```

## Step 2: Configure Your Bundler (Vite)

Modern bundlers like Vite might block requests from unrecognized hosts for security reasons. You need to explicitly allow them in your `vite.config.js`.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Allows Vite to accept requests from our subdomains
    allowedHosts: ['company-a.localhost', 'company-b.localhost', '.lvh.me'] 
  }
});

```

## Step 3: Extracting the Subdomain in React

We need a utility to parse the `window.location.hostname` before the app renders.

```javascript
// utils/getTenant.js
export function getTenantFromSubdomain() {
  const hostname = window.location.hostname;
  
  // Example: 'company-a.lvh.me' -> ['company-a', 'lvh', 'me']
  // Example: 'company-b.localhost' -> ['company-b', 'localhost']
  const parts = hostname.split('.');
  
  // If we have a subdomain, return it. Otherwise, return null or 'public'.
  // (Adjust the logic based on your production base domain length)
  if (parts.length >= 2 && parts[0] !== 'www') {
    return parts[0]; 
  }
  
  return 'public'; // Fallback for the main landing page
}

```

## Step 4: React Router Configuration

The beautiful thing about the subdomain strategy is that **React Router doesn't need to know about the tenant ID**. Because the tenant is in the URL *host* (not the path), your router paths look completely normal!

```jsx
// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getTenantFromSubdomain } from './utils/getTenant';

// Components
import TenantDashboard from './pages/TenantDashboard';
import PublicLandingPage from './pages/PublicLandingPage';

export default function App() {
  const tenantId = getTenantFromSubdomain();

  // If there is NO subdomain, render the public marketing site
  if (tenantId === 'public' || !tenantId) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLandingPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If there IS a subdomain, render the Tenant Application
  return (
    <BrowserRouter>
      {/* We pass the tenantId down via Context or directly as a prop */}
      <TenantProvider tenantId={tenantId}>
        <Routes>
          {/* Notice there is no /:tenantId prefix here! */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<TenantDashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </TenantProvider>
    </BrowserRouter>
  );
}

```

---

## 🧠 Key Interview Talking Points

If asked to compare Subdomain vs. Path-based multi-tenancy (`tenant.app.com` vs `[app.com/tenant](https://app.com/tenant)`), bring up these senior-level points:

| Feature                 | Subdomain (`tenant.app.com`)                                                                     | Path-Based (`[app.com/tenant](https://app.com/tenant)`)            |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **Routing Complexity**  | **Low:** Paths stay clean (`/dashboard`).                                                        | **High:** Every route needs the prefix (`/:tenant/dashboard`).     |
| **White-labeling**      | **Easy:** You can map custom domains (CNAME) like `app.client.com` to your server.               | **Impossible:** Clients can't map their own domains to a URL path. |
| **Cookies & Security**  | **Tricky:** You must configure cookie domains carefully (e.g., `Domain=.app.com`) to share auth. | **Easy:** All tenants share the exact same root domain.            |
| **CORS (Cross-Origin)** | **Strict:** API requests from `tenant.app.com` to `api.app.com` require CORS headers.            | **Ignored:** Everything shares the same origin.                    |

**Explain how to handle CORS and authentication cookies safely when using subdomains in a React/Node app.**

This is a quintessential senior-level backend/frontend integration question. When you move to a subdomain architecture (`tenant-a.myapp.com` talking to `api.myapp.com`), the browser suddenly treats your frontend and backend as **entirely different websites**.

By default, the browser will block API requests (CORS errors) and refuse to attach authentication cookies.

> **Repo Organization Tip:** Save this content inside `09-System-Design-Concepts/scenario-problems/cors-and-cookies-subdomains.md`.

---

# Scenario: CORS and Cookies Across Subdomains

**The Task:** Configure a Node.js/Express backend and a React/Axios frontend so that a user logging into `tenant-a.myapp.com` receives an `HttpOnly` secure cookie that is automatically sent with API requests to `api.myapp.com`.

## 1. The Frontend Configuration (React + Axios)

By default, fetch requests and Axios do **not** send cookies to a different origin. You must explicitly tell your HTTP client to include credentials.

```javascript
// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.myapp.com', // Your centralized API
  
  // 🚨 CRITICAL: Tells the browser to send cookies in cross-origin requests
  withCredentials: true 
});

export default axiosClient;

```

## 2. The Backend CORS Configuration (Node/Express)

Because `tenant-a.myapp.com` and `api.myapp.com` are different origins, you need CORS. But you can't just set `Access-Control-Allow-Origin: *` because the browser strictly forbids using the `*` wildcard when `withCredentials` is true.

Instead, you must dynamically check the origin and allow it if it ends with your base domain.

```javascript
// server.js (Node/Express)
const express = require('express');
const cors = require('cors');

const app = express();

// 1. Dynamic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Regex to allow 'localhost' for dev, or any subdomain of 'myapp.com'
    const allowedPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)?(localhost:\d+|myapp\.com)$/;
    
    if (allowedPattern.test(origin)) {
      callback(null, true); // Mirror the origin back
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  
  // 🚨 CRITICAL: Must be true to allow the browser to accept the cookie
  credentials: true 
};

app.use(cors(corsOptions));

```

## 3. The Backend Cookie Configuration

When the user logs in, the backend generates a JWT or session ID and attaches it as an `HttpOnly` cookie.

If you just set a cookie normally, the browser ties it strictly to `api.myapp.com`. `tenant-a.myapp.com` won't be allowed to use it. You must configure the `domain` attribute to allow sharing across the base domain.

```javascript
// controllers/authController.js

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // ... verify user and generate JWT ...
  const token = "jwt_token_string_here";

  res.cookie('auth_token', token, {
    // 🚨 CRITICAL: The leading dot means "myapp.com AND all its subdomains"
    domain: process.env.NODE_ENV === 'production' ? '.myapp.com' : 'localhost',
    
    // Security Best Practices
    httpOnly: true,  // JavaScript (React) cannot read the cookie (prevents XSS)
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
    
    // 'Lax' allows the cookie to be sent on top-level navigations across subdomains
    sameSite: 'Lax', 
    
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  });

  res.status(200).json({ message: "Login successful" });
});

```

---

## 🧠 Key Interview Talking Points

To ace this discussion, make sure you emphasize the security implications of these choices:

| Concept                     | Why it matters                                            | What happens if you get it wrong                                                                                     |
| --------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **`withCredentials: true`** | Tells the browser it's safe to send cookies cross-origin. | Users will log in, the cookie will be set, but subsequent API calls will act like the user is logged out.            |
| **`domain: '.myapp.com'`**  | Expands the cookie's scope.                               | The cookie is locked to the API domain. The frontend subdomains won't "see" it, and the browser won't attach it.     |
| **`httpOnly: true`**        | Hides the cookie from `document.cookie`.                  | If your React app has an XSS vulnerability (e.g., rendering dangerous user input), hackers can steal the token.      |
| **No wildcard CORS (`*`)**  | Browser security mechanism.                               | If you set `origin: '*'` while using credentials, the browser throws a fatal error and blocks the response entirely. |
