### Multi-Tenant React Application Interview Questions

Architecting a **Multi-Tenant React Application**—where a single frontend codebase serves multiple distinct clients or organizations (tenants) with customized branding, isolated data contexts, and feature flags—is a favorite advanced topic in senior full-stack interviews.

The most common multi-tenant React interview questions focus on specific technical pillars.

---

### 1. Tenant Resolution & Routing Architecture

#### Q: How do you identify the current tenant on the frontend when the app loads?

- **Answer:** Tenant resolution typically happens through one of three strategies:

1. **Subdomain-based:** (e.g., `acme.app.com` or `tenant1.saas.com`). Extracted via `window.location.hostname`.
2. **Path-based:** (e.g., `[app.com/acme/dashboard](https://app.com/acme/dashboard)`). Extracted via React Router's dynamic URL parameters (`/app/:tenantId/*`).
3. **Custom Domain:** (e.g., `portal.acmeclient.com`). Handled via reverse proxy (like Nginx/Cloudflare) mapping to the main React application and injecting tenant headers or flags.

- **Code Example (Subdomain Extraction):**

```javascript
const getTenantFromSubdomain = () => {
  const host = window.location.hostname; // e.g., "acme.myapp.com"
  const parts = host.split(".");
  // Assuming local development or standard structure
  if (parts.length > 2 && parts[0] !== "www") {
    return parts[0]; // "acme"
  }
  return null; // Default or fallback tenant
};
```

#### Q: How do you configure React Router to handle dynamic tenant path prefixes gracefully?

- **Answer:** If your app uses path-based tenancy (`/tenant-a/dashboard`, `/tenant-b/dashboard`), you use a layout wrapper route with a parameter slot (`/:tenantId/*`) to capture the tenant context across all nested routes.
- **Code Example:**

```jsx
import { Routes, Route, useParams, Outlet } from "react-router-dom";

const TenantLayout = () => {
  const { tenantId } = useParams();
  // Validate tenant or store in context here
  return (
    <TenantProvider tenantId={tenantId}>
      <div className="tenant-shell">
        <Outlet /> {/* Renders tenant-specific pages */}
      </div>
    </TenantProvider>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/:tenantId" element={<TenantLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

---

### 2. Tenant-Specific Branding & Theming (Dynamic UI)

#### Q: How do you dynamically apply tenant-specific branding (logos, primary colors, typography) at runtime in React without hardcoding styles?

- **Answer:**

1. Fetch tenant metadata (theme config JSON) from the backend API during the initial app boot or route resolution phase.
2. Inject these values dynamically into **CSS Custom Properties (CSS Variables)** on the root HTML element or container wrapper.
3. Use CSS variables inside your Tailwind configuration or vanilla CSS modules.

- **Code Example:**

```jsx
import { useEffect } from "react";

const useTenantTheme = (themeConfig) => {
  useEffect(() => {
    if (!themeConfig) return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", themeConfig.primaryColor);
    root.style.setProperty("--border-radius", themeConfig.borderRadius);
    // Change favicon or document title dynamically
    document.title = themeConfig.companyName;
    document.getElementById("favicon").href = themeConfig.logoUrl;
  }, [themeConfig]);
};
```

---

### 3. State Management & API Data Isolation

#### Q: How do you ensure that all outgoing API requests from your React app automatically target the correct tenant data without manual overhead?

- **Answer:** Use an Axios or Fetch wrapper (instance) that automatically attaches the active tenant identifier either as a custom header (e.g., `X-Tenant-ID`) or includes it in the base URL configuration.
- **Code Example:**

```javascript
import axios from "axios";

const createTenantApi = (tenantId) => {
  const api = axios.create({
    baseURL: "https://api.saasplatform.com/v1",
    headers: {
      "X-Tenant-ID": tenantId,
    },
    withCredentials: true,
  });
  return api;
};

// Usage inside a React Context provider
export const TenantApiContext = React.createContext(null);
```

#### Q: How do you handle tenant-specific feature flags (e.g., Tenant A has a "Beta Analytics" feature enabled, but Tenant B does not)?

- **Answer:** Combine the tenant configuration payload fetched on boot with a React Higher-Order Component (HOC) or custom feature-flag hook.
- **Code Example:**

```jsx
const useFeatureFlag = (featureKey) => {
  const { features } = useTenantContext(); // Provided by Tenant Provider
  return !!features?.[featureKey];
};

const BetaAnalyticsWidget = () => {
  const isEnabled = useFeatureFlag("beta_analytics");
  if (!isEnabled) return null;
  return <AdvancedCharts />;
};
```

---

### 4. Security & Performance Challenges in Multi-Tenant Frontends

#### Q: What are the security risks of caching data in a client-side state manager (like Redux or React Query) in a shared multi-tenant device or public terminal?

- **Answer:** If a user logs out and another user from a _different_ tenant logs into the same browser instance, cached queries in memory or persistent client storage (localStorage/IndexedDB) can leak sensitive cross-tenant data.
- **Mitigation:**

1. Implement a complete cache purge function (`queryClient.clear()` or Redux store reset) inside your global logout handler.
2. Avoid storing sensitive tenant payload data in `localStorage` long-term; rely on memory-based state caches with short TTLs.

Would you like to explore how to implement multi-tenant SSR (Server-Side Rendering) with Next.js for better SEO and initial load performance?

### Multi-Tenant React Application Interview Questions

Architecting a **Multi-Tenant React Application**—where a single frontend codebase serves multiple distinct clients or organizations (tenants) with customized branding, isolated data contexts, and feature flags—is a favorite advanced topic in senior full-stack interviews.

The most common multi-tenant React interview questions focus on specific technical pillars.

---

### 1. Tenant Resolution & Routing Architecture

#### Q: How do you identify the current tenant on the frontend when the app loads?

- **Answer:** Tenant resolution typically happens through one of three strategies:

1. **Subdomain-based:** (e.g., `acme.app.com` or `tenant1.saas.com`). Extracted via `window.location.hostname`.
2. **Path-based:** (e.g., `[app.com/acme/dashboard](https://app.com/acme/dashboard)`). Extracted via React Router's dynamic URL parameters (`/app/:tenantId/*`).
3. **Custom Domain:** (e.g., `portal.acmeclient.com`). Handled via reverse proxy (like Nginx/Cloudflare) mapping to the main React application and injecting tenant headers or flags.

- **Code Example (Subdomain Extraction):**

```javascript
const getTenantFromSubdomain = () => {
  const host = window.location.hostname; // e.g., "acme.myapp.com"
  const parts = host.split(".");
  // Assuming local development or standard structure
  if (parts.length > 2 && parts[0] !== "www") {
    return parts[0]; // "acme"
  }
  return null; // Default or fallback tenant
};
```

#### Q: How do you configure React Router to handle dynamic tenant path prefixes gracefully?

- **Answer:** If your app uses path-based tenancy (`/tenant-a/dashboard`, `/tenant-b/dashboard`), you use a layout wrapper route with a parameter slot (`/:tenantId/*`) to capture the tenant context across all nested routes.
- **Code Example:**

```jsx
import { Routes, Route, useParams, Outlet } from "react-router-dom";

const TenantLayout = () => {
  const { tenantId } = useParams();
  // Validate tenant or store in context here
  return (
    <TenantProvider tenantId={tenantId}>
      <div className="tenant-shell">
        <Outlet /> {/* Renders tenant-specific pages */}
      </div>
    </TenantProvider>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/:tenantId" element={<TenantLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

---

### 2. Tenant-Specific Branding & Theming (Dynamic UI)

#### Q: How do you dynamically apply tenant-specific branding (logos, primary colors, typography) at runtime in React without hardcoding styles?

- **Answer:**

1. Fetch tenant metadata (theme config JSON) from the backend API during the initial app boot or route resolution phase.
2. Inject these values dynamically into **CSS Custom Properties (CSS Variables)** on the root HTML element or container wrapper.
3. Use CSS variables inside your Tailwind configuration or vanilla CSS modules.

- **Code Example:**

```jsx
import { useEffect } from "react";

const useTenantTheme = (themeConfig) => {
  useEffect(() => {
    if (!themeConfig) return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", themeConfig.primaryColor);
    root.style.setProperty("--border-radius", themeConfig.borderRadius);
    // Change favicon or document title dynamically
    document.title = themeConfig.companyName;
    document.getElementById("favicon").href = themeConfig.logoUrl;
  }, [themeConfig]);
};
```

---

### 3. State Management & API Data Isolation

#### Q: How do you ensure that all outgoing API requests from your React app automatically target the correct tenant data without manual overhead?

- **Answer:** Use an Axios or Fetch wrapper (instance) that automatically attaches the active tenant identifier either as a custom header (e.g., `X-Tenant-ID`) or includes it in the base URL configuration.
- **Code Example:**

```javascript
import axios from "axios";

const createTenantApi = (tenantId) => {
  const api = axios.create({
    baseURL: "https://api.saasplatform.com/v1",
    headers: {
      "X-Tenant-ID": tenantId,
    },
    withCredentials: true,
  });
  return api;
};

// Usage inside a React Context provider
export const TenantApiContext = React.createContext(null);
```

#### Q: How do you handle tenant-specific feature flags (e.g., Tenant A has a "Beta Analytics" feature enabled, but Tenant B does not)?

- **Answer:** Combine the tenant configuration payload fetched on boot with a React Higher-Order Component (HOC) or custom feature-flag hook.
- **Code Example:**

```jsx
const useFeatureFlag = (featureKey) => {
  const { features } = useTenantContext(); // Provided by Tenant Provider
  return !!features?.[featureKey];
};

const BetaAnalyticsWidget = () => {
  const isEnabled = useFeatureFlag("beta_analytics");
  if (!isEnabled) return null;
  return <AdvancedCharts />;
};
```

---

### 4. Security & Performance Challenges in Multi-Tenant Frontends

#### Q: What are the security risks of caching data in a client-side state manager (like Redux or React Query) in a shared multi-tenant device or public terminal?

- **Answer:** If a user logs out and another user from a _different_ tenant logs into the same browser instance, cached queries in memory or persistent client storage (localStorage/IndexedDB) can leak sensitive cross-tenant data.
- **Mitigation:**

1. Implement a complete cache purge function (`queryClient.clear()` or Redux store reset) inside your global logout handler.
2. Avoid storing sensitive tenant payload data in `localStorage` long-term; rely on memory-based state caches with short TTLs.

Would you like to explore how to implement multi-tenant SSR (Server-Side Rendering) with Next.js for better SEO and initial load performance?

Providing a full, runnable code snippet for all 100 enterprise multi-tenant items in a single message would span thousands of lines. Instead, here is a **comprehensive, production-grade end-to-end architecture** that merges React frontend multi-tenancy (routing, dynamic branding, scoped caching, and API layers) with Node.js backend enforcement (subdomain parsing, tenant isolation, and secure middleware).

---

### Part 1: Node.js & Express Backend (Multi-Tenant API)

#### 1. Multi-Tenant Middleware (`middleware/tenantMiddleware.js`)

This middleware resolves the tenant from either a custom header (`X-Tenant-ID`) or a subdomain, validates it against the database, and injects it into `req.tenant`.

```javascript
const Tenant = require("../models/Tenant"); // Mongoose Model

const resolveTenant = async (req, res, next) => {
  try {
    // Extract tenant identifier from header or subdomain
    const tenantId = req.headers["x-tenant-id"] || req.subdomains[0];

    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context missing" });
    }

    const tenant = await Tenant.findOne({ slug: tenantId, status: "ACTIVE" });
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found or inactive" });
    }

    req.tenant = tenant; // Attach tenant object to request
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = resolveTenant;
```

#### 2. Tenant-Isolated Data Controller (`controllers/resourceController.js`)

Ensures data queries are strictly scoped to the current tenant ID to prevent data leakage (IDOR prevention).

```javascript
const Resource = require("../models/Resource");

exports.getResources = async (req, res) => {
  try {
    // Automatically scope database query using req.tenant._id
    const resources = await Resource.find({ tenantId: req.tenant._id });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const newResource = await Resource.create({
      ...req.body,
      tenantId: req.tenant._id, // Enforce tenant mapping on write
    });
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 3. Express Server Setup (`server.js`)

```javascript
const express = require("express");
const cors = require("cors");
const resolveTenant = require("./middleware/tenantMiddleware");
const resourceRoutes = require("./routes/resourceRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Apply tenant resolution middleware globally to all API routes
app.use("/api", resolveTenant, resourceRoutes);

app.listen(5000, () =>
  console.log("Multi-tenant backend running on port 5000"),
);
```

---

### Part 2: React Frontend (Multi-Tenant App)

#### 1. Tenant Context & Dynamic Branding Provider (`context/TenantContext.jsx`)

Resolves the tenant on initialization, injects CSS variables for custom branding, and provides tenant feature flags.

```jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantConfig = async () => {
      try {
        // Extract subdomain or fallback for local development
        const hostname = window.location.hostname;
        const tenantSlug =
          hostname.split(".")[0] === "localhost"
            ? "acme-corp"
            : hostname.split(".")[0];

        const { data } = await axios.get(
          `http://localhost:5000/api/tenant-config/${tenantSlug}`,
        );
        setTenant(data);

        // Dynamically inject CSS variables for branding
        const root = document.documentElement;
        root.style.setProperty("--primary-color", data.theme.primaryColor);
        root.style.setProperty("--border-radius", data.theme.borderRadius);

        // Dynamically update document metadata
        document.title = data.companyName;
      } catch (err) {
        console.error("Failed to load tenant configuration", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantConfig();
  }, []);

  if (loading) return <div className="tenant-loader">Loading workspace...</div>;

  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
```

#### 2. Tenant-Scoped API Client (`api/tenantApi.js`)

Automatically injects the active tenant ID into the headers of every outgoing HTTP request.

```javascript
import axios from "axios";

const createTenantApi = (tenantSlug) => {
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "X-Tenant-ID": tenantSlug,
    },
    withCredentials: true,
  });

  return api;
};

export default createTenantApi;
```

#### 3. Tenant-Aware Routing Shell (`App.jsx`)

Handles path-based or subdomain-based routing blocks safely.

```jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Outlet,
} from "react-router-dom";
import { TenantProvider, useTenant } from "./context/TenantContext";

const TenantDashboardLayout = () => {
  const tenant = useTenant();

  return (
    <div className="app-shell" style={{ borderColor: "var(--primary-color)" }}>
      <header>
        <img src={tenant.logoUrl} alt={tenant.companyName} />
        <h1>Welcome to {tenant.companyName}</h1>
      </header>
      <main>
        <Outlet /> {/* Renders nested tenant modules */}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <TenantProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TenantDashboardLayout />}>
            <Route
              path="dashboard"
              element={<div>Tenant Dashboard View</div>}
            />
            <Route path="settings" element={<div>Tenant Settings View</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TenantProvider>
  );
}
```

### Real-World Multi-Tenant Scenario: SaaS Helpdesk Application (Node.js & React)

#### The Business Scenario

Imagine you are building a B2B SaaS Helpdesk platform (like Zendesk).

- **Tenant A** (`acme.helpdesk.com`) is a retail store. Their brand color is **Blue**, and they have a custom feature flag enabled for "Live Chat".
- **Tenant B** (`globex.helpdesk.com`) is a tech enterprise. Their brand color is **Green**, and they _do not_ have live chat enabled; instead, they require strict AI ticket summarization.
- **The Goal:** A single React frontend and a single Node.js backend must dynamically brand themselves, isolate ticket data strictly between tenants, and conditionally render features based entirely on which subdomain or tenant slug the user accesses.

---

### Part 1: Node.js Backend (Tenant Resolution & Isolated Data APIs)

#### 1. Tenant Model & Configuration Seed (`models/Tenant.js`)

```javascript
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g., 'acme'
  companyName: { type: String, required: true },
  theme: {
    primaryColor: { type: String, default: "#007bff" },
    logoUrl: { type: String },
  },
  features: {
    liveChat: { type: Boolean, default: false },
    aiSummary: { type: Boolean, default: false },
  },
  status: { type: String, enum: ["ACTIVE", "SUSPENDED"], default: "ACTIVE" },
});

module.exports = mongoose.model("Tenant", tenantSchema);
```

#### 2. Ticket Model (Data Isolation Model) (`models/Ticket.js`)

```javascript
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "Resolved"], default: "Open" },
});

module.exports = mongoose.model("Ticket", ticketSchema);
```

#### 3. Tenant Resolver Middleware (`middleware/tenantMiddleware.js`)

```javascript
const Tenant = require("../models/Tenant");

const resolveTenant = async (req, res, next) => {
  try {
    // Read tenant from custom header or subdomain
    const tenantSlug = req.headers["x-tenant-slug"] || req.subdomains[0];

    if (!tenantSlug) {
      return res
        .status(400)
        .json({ error: "Multi-tenant context missing: No tenant specified" });
    }

    const tenant = await Tenant.findOne({ slug: tenantSlug, status: "ACTIVE" });
    if (!tenant) {
      return res
        .status(404)
        .json({ error: "Tenant workspace not found or inactive" });
    }

    req.tenant = tenant; // Attach tenant config to request
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = resolveTenant;
```

#### 4. Express Server & Ticket Routes (`server.js`)

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const resolveTenant = require("./middleware/tenantMiddleware");
const Tenant = require("./models/Tenant");
const Ticket = require("./models/Ticket");

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// 1. Public endpoint to fetch tenant branding and feature flags on frontend boot
app.get("/api/tenant-config/:slug", async (req, res) => {
  const tenant = await Tenant.findOne({
    slug: req.params.slug,
    status: "ACTIVE",
  });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  res.json(tenant);
});

// 2. Protected Multi-Tenant API Route Group
const ticketRouter = express.Router();
ticketRouter.use(resolveTenant); // Enforce tenant lookup

// Get tickets strictly scoped to current tenant
ticketRouter.get("/tickets", async (req, res) => {
  const tickets = await Ticket.find({ tenantId: req.tenant._id });
  res.json(tickets);
});

// Create ticket mapped to current tenant
ticketRouter.post("/tickets", async (req, res) => {
  const ticket = await Ticket.create({
    ...req.body,
    tenantId: req.tenant._id, // Enforce secure mapping
  });
  res.status(201).json(ticket);
});

app.use("/api", ticketRouter);

mongoose
  .connect("mongodb://localhost:27017/multitenant_helpdesk")
  .then(() =>
    app.listen(5000, () => console.log("Backend running on port 5000")),
  );
```

---

### Part 2: React Frontend (Dynamic Branding, Context, and Scoped UI)

#### 1. Tenant Provider (`context/TenantContext.jsx`)

```jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initTenant = async () => {
      try {
        // Extract subdomain (e.g., "acme" from "acme.localhost" or "acme.helpdesk.com")
        const hostParts = window.location.hostname.split(".");
        const tenantSlug = hostParts.length > 2 ? hostParts[0] : "acme"; // Fallback to 'acme' for local testing

        const { data } = await axios.get(
          `http://localhost:5000/api/tenant-config/${tenantSlug}`,
        );
        setTenant(data);

        // Dynamically apply brand theme variables
        const root = document.documentElement;
        root.style.setProperty("--primary-brand", data.theme.primaryColor);
        document.title = `${data.companyName} Support Portal`;
      } catch (err) {
        console.error("Failed to resolve tenant workspace", err);
      } finally {
        setLoading(false);
      }
    };

    initTenant();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        Loading Workspace...
      </div>
    );
  if (!tenant)
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        Workspace Not Found
      </div>
    );

  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
```

#### 2. Tenant-Scoped API Client (`api/axiosInstance.js`)

```javascript
import axios from "axios";

// Factory function creates an axios client pre-configured with the tenant slug header
export const createTenantClient = (tenantSlug) => {
  return axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "X-Tenant-Slug": tenantSlug,
    },
    withCredentials: true,
  });
};
```

#### 3. Helpdesk Dashboard Component (`pages/Dashboard.jsx`)

```jsx
import React, { useState, useEffect } from "react";
import { useTenant } from "../context/TenantContext";
import { createTenantClient } from "../api/axiosInstance";

export default function Dashboard() {
  const tenant = useTenant();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const api = createTenantClient(tenant.slug);
      const { data } = await api.get("/tickets");
      setTickets(data);
    };
    fetchTickets();
  }, [tenant]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      {/* Dynamic Header branded to Tenant */}
      <header
        style={{
          borderBottom: `4px solid var(--primary-brand)`,
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{tenant.companyName} Helpdesk</h2>
        <span
          style={{
            background: "var(--primary-brand)",
            color: "#fff",
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
          }}
        >
          Workspace: {tenant.slug.toUpperCase()}
        </span>
      </header>

      {/* Conditionally Render Features based on Tenant Configuration */}
      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <main style={{ flex: 2 }}>
          <h3>Support Tickets</h3>
          <ul>
            {tickets.map((t) => (
              <li
                key={t._id}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              >
                <strong>{t.title}</strong> -{" "}
                <span style={{ color: "var(--primary-brand)" }}>
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        </main>

        <aside
          style={{
            flex: 1,
            background: "#f9f9f9",
            padding: "1.5rem",
            borderRadius: "8px",
          }}
        >
          <h3>Workspace Tools</h3>
          {tenant.features.liveChat ? (
            <div
              style={{
                background: "#e6f4ea",
                padding: "1rem",
                borderRadius: "4px",
                color: "#137333",
              }}
            >
              🟢 Live Chat Support is Active
            </div>
          ) : (
            <p style={{ color: "#666" }}>
              Live Chat is disabled for your plan.
            </p>
          )}

          {tenant.features.aiSummary && (
            <div
              style={{
                background: "#e8f0fe",
                padding: "1rem",
                borderRadius: "4px",
                color: "#1a73e8",
                marginTop: "1rem",
              }}
            >
              🤖 AI Ticket Summarization Enabled
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
```

### Architect-Level Multi-Tenant System Design Interview Question

> **The Question:**
> "Design a multi-tenant enterprise SaaS platform using React (frontend) and Node.js (backend) that supports **three isolation tiers** based on customer pricing:
>
> 1. **Pooled (Shared DB, Shared Schema):** Multiple tenants share the same database and collection, isolated entirely via software logic (`tenantId`).
> 2. **Isolated Schema (Shared DB, Separate Schemas/Namespaces):** Tenants share the same database instance, but each enterprise tenant has their own isolated namespace/schema (e.g., PostgreSQL schemas) to satisfy strict regulatory compliance.
> 3. **Isolated Database (Dedicated DB instance):** Enterprise VIP tenants get their own completely dedicated physical database cluster.
>
> _How do you architect your Node.js backend data access layer (ORM/ODM routing) and your React frontend state management/routing pipeline to handle this transparently without rewriting application logic for every tier?_

---

### Architectural Solution & Strategy

To achieve this without spaghetti code, you must implement **Dynamic Connection and Schema Routing** on the backend, paired with **Tenant-Context-Aware Client Boundary Hydration** on the frontend.

---

### Part 1: Node.js Enterprise Backend Architecture

Instead of hardcoding database queries, you build a **Tenant Connection Resolver & Data Access Layer (DAL) Factory**.

#### 1. Dynamic Database & Schema Connection Manager (`config/tenantDb.js`)

```javascript
const mongoose = require("mongoose"); // Or Sequelize/Knex for SQL schemas

// Caches active database connections or schema models to prevent connection pool exhaustion
const connectionCache = {};

const getTenantModel = async (tenant, ModelDefinition) => {
  let dbConnection;

  if (tenant.isolationTier === "DEDICATED_DB") {
    // Tier 3: Dedicated Database Instance per Tenant
    if (!connectionCache[tenant.slug]) {
      connectionCache[tenant.slug] = mongoose.createConnection(tenant.dbUri);
    }
    dbConnection = connectionCache[tenant.slug];
  } else {
    // Tier 1 (Pooled) & Tier 2 (Isolated Namespace/Schema)
    // For SQL (Postgres), you'd dynamically switch schemas. For MongoDB, you use a shared connection with tenantId query scoping.
    dbConnection = mongoose.connection;
  }

  // Return the model bound to the correct connection / schema context
  return (
    dbConnection.models[ModelDefinition.modelName] ||
    dbConnection.model(ModelDefinition.modelName, ModelDefinition.schema)
  );
};

module.exports = getTenantModel;
```

#### 2. Advanced Multi-Tier Tenant Middleware (`middleware/enterpriseTenantMiddleware.js`)

```javascript
const Tenant = require("../models/TenantMaster");

const enterpriseTenantResolver = async (req, res, next) => {
  try {
    const tenantSlug = req.headers["x-tenant-slug"] || req.subdomains[0];
    const tenant = await Tenant.findOne({ slug: tenantSlug });

    if (!tenant || tenant.status !== "ACTIVE") {
      return res
        .status(404)
        .json({ error: "Tenant workspace invalid or suspended" });
    }

    // Attach tenant profile and tier metadata to request
    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = enterpriseTenantResolver;
```

#### 3. Enterprise Repository / Controller Pattern (`controllers/ticketController.js`)

```javascript
const getTenantModel = require("../config/tenantDb");
const TicketSchemaDef = require("../models/schemas/TicketSchema");

exports.getTickets = async (req, res) => {
  try {
    // Dynamically resolve the correct model based on tenant's isolation tier
    const TicketModel = await getTenantModel(req.tenant, TicketSchemaDef);

    let query = {};
    // If Tier 1 (Pooled), enforce software-level tenantId filtering
    if (req.tenant.isolationTier === "POOLED") {
      query.tenantId = req.tenant._id;
    }

    const tickets = await TicketModel.find(query);
    res.json({ tier: req.tenant.isolationTier, data: tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

### Part 2: React Enterprise Frontend Architecture

On the frontend, the UI must abstract away how data is stored on the backend while managing strict tenant session persistence, micro-frontend module federation limits, and isolated global state caching.

#### 1. Enterprise Tenant Context & Feature Registry (`context/EnterpriseTenantContext.jsx`)

```jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const EnterpriseTenantContext = createContext(null);

export const EnterpriseTenantProvider = ({ children }) => {
  const [tenantContext, setTenantContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapTenant = async () => {
      try {
        const subdomain = window.location.hostname.split(".")[0];
        // Fetch tenant metadata, security compliance flags, and tier capabilities
        const { data } = await axios.get(
          `https://api.saasplatform.com/v1/meta/resolve?subdomain=${subdomain}`,
        );

        setTenantContext(data); // { slug, isolationTier, branding, securityPolicies }

        // Apply strict enterprise security headers/policies client-side if mandated
        if (data.securityPolicies.forceStrictCSP) {
          console.info("Enterprise strict CSP enforced for tenant:", data.slug);
        }
      } catch (err) {
        window.location.href = "/error/tenant-not-found";
      } finally {
        setLoading(false);
      }
    };

    bootstrapTenant();
  }, []);

  if (loading)
    return (
      <div className="enterprise-loader">Initializing Secure Workspace...</div>
    );

  return (
    <EnterpriseTenantContext.Provider value={tenantContext}>
      {children}
    </EnterpriseTenantContext.Provider>
  );
};

export const useEnterpriseTenant = () => useContext(EnterpriseTenantContext);
```

#### 2. Tenant-Scoped API Client Factory (`api/enterpriseApiClient.js`)

```javascript
import axios from "axios";

export const createEnterpriseApiClient = (tenantSlug, isolationTier) => {
  const client = axios.create({
    baseURL: "https://api.saasplatform.com/v1",
    headers: {
      "X-Tenant-Slug": tenantSlug,
      "X-Isolation-Tier": isolationTier, // Assists edge load balancers in routing requests to appropriate DB shards
    },
    withCredentials: true,
  });

  // Enterprise Error Interceptor: Handle cross-tenant leakage or shard migrations gracefully
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 409 &&
        error.response?.data?.code === "DB_MIGRATION_IN_PROGRESS"
      ) {
        window.location.href = "/maintenance/shard-migrating";
      }
      return Promise.reject(error);
    },
  );

  return client;
};
```
