Microfrontends are the future of web development.

When implemented correctly,
They can transform your app's architecture.

So build better apps today.
Follow these steps to develop microfrontends.

1. Identify Microfrontend Boundaries: Break down your app into logical, independent components.
2. Select a Framework or Library: Use Single-SPA or Module Federation for seamless integration.
3. Set Up Independent Repositories: Maintain separate versioning and deployments for each microfrontend.
4. Build Communication and State Management: Use custom events or shared state tools like Redux.
5. Routing and Navigation: Ensure smooth transitions with built-in or custom routing solutions.
6. Deployment Strategy: Deploy each microfrontend independently using CI/CD pipelines.
7. Implement a Shell Application: Load different microfrontends as users interact with the app.
8. Testing: Use end-to-end tools like Cypress or Playwright for smooth integration.

Example Tools and Libraries for Building Microfrontends:

- Single-SPA: Orchestrates different microfrontends on the same page.
- Webpack Module Federation: Facilitates module sharing.
- qiankun: Popular in the Vue ecosystem.
- Federated Modules (in Next.js): Supports microfrontends in Next.js apps.

That is a great, concise 8-step roadmap for implementing a Micro-Frontend (MFE) architecture! You've captured all the core pillars—from domain decomposition down to deployment and end-to-end testing.

To help you frame this for **Senior/Lead System Design interviews** or architectural discussions, here are a few critical nuances and production "gotchas" to pair with your list:

---

## Strategic Nuances & Real-World Gotchas

### 1. Step 1 (Boundaries): Use Domain-Driven Design (DDD)

Breaking down an app into "components" can lead to micro-frontend sprawl (e.g., making a simple header or button its own MFE). Instead, break apps down by **Bounded Contexts** (e.g., Checkout Domain, Search/Catalog Domain, User Account Domain). Rule of thumb: _If two features change together every release, they belong in the same Micro-Frontend._

### 2. Step 3 (Repositories): Polyrepo vs. Monorepo

While independent repositories (Polyrepos) offer isolated permissions, many modern enterprises use a **Monorepo with Turborepo or Nx**. Monorepos allow independent deployments per MFE while ensuring shared TypeScript types, unified linting, and atomic dependency updates across workspace packages.

### 3. Step 4 (State): Strict Isolation First

Sharing global state (like a central Redux store) creates tight runtime coupling between MFEs—meaning a change in one team's reducer can crash another team's widget. The modern best practice is **Zero Shared Feature State**. Keep feature state local (React Query/Zod), and use **Versioned Custom Browser Events** (`window.dispatchEvent`) solely for global triggers like `auth:logout` or `theme:change`.

### 4. Step 6 (Deployments): Independent Manifests & Canary Releases

To truly deploy MFEs independently without rebuilding the Shell app, use dynamic manifest resolution (like **Module Federation Dashboard** or **Import Maps**). The Shell fetches a `manifest.json` at runtime that points to the latest remote assets (`remoteEntry.js`), enabling instant canary deployments and zero-downtime rollbacks.

### 5. Step 7 (The Shell App): Add Resiliency Limits

A failure in a remote MFE should never bring down the entire page. Always wrap dynamically imported remote components in **React Suspense** and **Error Boundaries** to render graceful fallback UI if a remote CDN or bundle fails to load.

---

What are the main architectural differences and trade-offs between Webpack Module Federation and Single-SPA?

Both **Webpack Module Federation** and **single-spa** are industry-standard frameworks for building Micro-Frontends (MFEs), but they approach the problem from fundamentally different architectural paradigms.

**Module Federation** is a **build-tool level module sharing protocol**, whereas **single-spa** is a **client-side lifecycle and router orchestrator**.

---

## 1. Core Architectural Differences

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SINGLE-SPA (Lifecycle Framework)                      │
│                                                                             │
│  ┌──────────────┐      ┌───────────────────────────┐      ┌──────────────┐  │
│  │  Page Shell  │ ───► │  Single-SPA Router Engine │ ───► │ Mounted App  │  │
│  └──────────────┘      └───────────────────────────┘      └──────────────┘  │
│                                                                             │
│  * Orchestrates full applications via lifecycle methods (bootstrap, mount, unmount).│
│  * Requires framework wrappers (@single-spa/react, @single-spa/angular).    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    MODULE FEDERATION (Module Bundler Engine)                │
│                                                                             │
│  ┌──────────────┐      ┌───────────────────────────┐      ┌──────────────┐  │
│  │ Host Build   │ ───► │ Shared Runtime Container  │ ───► │ Exposed Component│
│  └──────────────┘      └───────────────────────────┘      └──────────────┘  │
│                                                                             │
│  * Shares code at the JS module/component level (like dynamic imports).     │
│  * Native to Webpack 5 / Rspack / Vite via runtime container protocol.      │
└─────────────────────────────────────────────────────────────────────────────┘

```

### A. Paradigm: Applications vs. Code Chunks

- **single-spa:** Treats micro-frontends as **standalone applications**. It listens to URL changes and mounts/unmounts entire application sub-trees into specified DOM containers based on active route matching.
- **Module Federation:** Treats micro-frontends as **dynamic JavaScript modules**. It allows an application to dynamically import JavaScript code (components, hooks, functions, stores) from another build target at runtime as if it were a local file.

### B. Polyglot Support (Multi-Framework)

- **single-spa:** **Native Polyglot.** Specifically designed to allow different frameworks (React, Angular, Vue 2/3, Svelte) to coexist on the same page by providing framework-specific lifecycle adapters (`single-spa-react`, `single-spa-angular`).
- **Module Federation:** **Framework-Agnostic, but React/Vue-centric in practice.** While it can share raw JS bundles across frameworks, sharing UI components seamlessly across different framework runtimes requires additional custom Web Component wrappers.

### C. Dependency Management & Code Sharing

- **single-spa:** Relies on **SystemJS / Browser Import Maps** (`<script type="systemjs-importmap">`) for shared dependencies. You must manually define shared libraries (e.g., `react`, `lodash`) in an import map and mark them as `external` in your bundler setup.
- **Module Federation:** Uses **Automated Runtime Container Sharing**. You configure shared libraries in `webpack.config.js` with `singleton: true` and `requiredVersion`. Module Federation handles runtime version negotiation, fallback resolution, and duplicate bundle elimination automatically.

---

## 2. Comparison & Trade-off Matrix

| Feature                          | Single-SPA                                        | Webpack Module Federation                                     |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| **Primary Level of Granularity** | Full Page Apps / Big Routes                       | Granular Components, Utility Libraries, Page Apps             |
| **Routing Mechanism**            | Centralized single-spa lifecycle router           | Standard Framework Routers (e.g., `react-router-dom`)         |
| **Shared Dependency Resolution** | Manual (Import Maps + SystemJS)                   | Automatic (Webpack Runtime Container & `shared` rules)        |
| **Developer Experience (DX)**    | High setup overhead; requires SystemJS wiring     | Near-native DX (feels like standard `React.lazy()` imports)   |
| **Framework Diversity**          | Best for mixed React + Angular + Vue apps         | Best when all MFEs share the same ecosystem (e.g., all React) |
| **Next.js / SSR Support**        | Complex / Limited native SSR capabilities         | Supported via `@module-federation/nextjs-mf`                  |
| **Build System Dependency**      | Bundler-agnostic (Webpack, Rollup, Vite, Esbuild) | Requires Webpack 5, Rspack, or Vite Module Federation plugin  |

---

## 3. When to Choose Which?

### Choose Single-SPA if:

1. **You are migrating legacy heterogeneous apps:** You have a massive legacy app written in Angular/Vue that you need to run side-by-side with a new React app on the same page.
2. **You want bundler independence:** Some teams use Vite, others use Webpack, and others use Angular CLI, and you don't want to enforce a unified build-tooling strategy across teams.
3. **Your decomposition is purely route-based:** Each micro-frontend maps strictly to a distinct top-level page URL (`/dashboard`, `/checkout`, `/settings`).

### Choose Webpack / Vite Module Federation if:

1. **You want deep component-level integration:** You need to embed remote widgets, search bars, or headers directly inside another team's layout without full-page re-mounts.
2. **You want to eliminate duplicate libraries automatically:** You want automatic runtime version negotiation for shared singletons like React, Redux, and Design System components.
3. **You are in a unified framework ecosystem (e.g., all React):** Your engineering teams use the same core framework and want seamless developer ergonomics (`React.lazy(() => import('remote/Widget'))`).

---

## Can You Use Both Together?

**Yes.** In large enterprise setups, organizations often use **single-spa as the top-level page orchestrator** (handling macro route mounting between React, Angular, and legacy apps) and **Module Federation within React sub-domains** to share components, UI libraries, and micro-widgets dynamically across teams.

How does Module Federation handle shared singleton version negotiation and fallback resolution under the hood?

At runtime, Webpack Module Federation handles shared dependencies through a **two-phase negotiation protocol**: **Initialization** and **Factory Request**.

Instead of embedding shared packages inside an application's main bundle, Module Federation abstracts shared dependencies into an isolated runtime data structure known as the **Share Scope** (typically accessed in the browser console via `window.__webpack_share_scopes__.default`).

Here is a step-by-step breakdown of how version negotiation, singleton enforcement, and fallback resolution operate under the hood.

---

## Phase 1: Share Scope Registration (Initialization)

When the Host application or any Remote application boots up, before executing component code, its generated `remoteEntry.js` script initializes its container by calling its `init()` method.

During `init()`, the container inspects its own `shared` configuration and registers its available library versions into the global **Share Scope object**.

### Conceptual Structure of `__webpack_share_scopes__.default`:

```javascript
window.__webpack_share_scopes__.default = {
  react: {
    "18.2.0": {
      get: () => console.log("Loading 18.2.0 factory..."), // Returns promise resolving to module
      from: "hostApp",
      loaded: 0, // 0 = unregistered/unloaded, 1 = loaded in memory
    },
    "18.1.0": {
      get: () => console.log("Loading 18.1.0 factory..."),
      from: "productMFE",
      loaded: 0,
    },
  },
};
```

---

## Phase 2: Version Negotiation & Resolution Algorithm

When a component calls `import('react')`, Webpack's shared runtime interceptor intercepts the request and evaluates the registered candidates in the Share Scope using the **SemVer Satisfaction Rules**:

```
                       Shared Dependency Request
                                   │
                                   ▼
                       Is `singleton: true` set?
                        ┌──────────┴──────────┐
                     YES│                     │NO
                        ▼                     ▼
             Find Highest Version          Find Best Matching
            among ALL registered          SemVer satisfying `requiredVersion`
                        │                     │
                        ▼                     ▼
            Satisfies `requiredVersion`    Satisfies `requiredVersion`
            or `strictVersion: false`??       of consuming app?
             ┌──────────┴──────────┐           ┌──────┴──────┐
          YES│                     │NO      YES│             │NO
             ▼                     ▼           ▼             ▼
      Use Highest Reg    Throw Error /      Use Highest  Download Fallback
      Singleton Version   Warn Consumer    Compatible    Bundle / Fail
                                             Version

```

---

## Under the Hood: Singleton vs. Non-Singleton Resolution

### Scenario A: Standard Shared Dependency (`singleton: false`)

If `singleton: false` (or omitted), Module Federation prioritizes **version compatibility over single-instance purity**:

1. **Check Highest Compatible Match:** Webpack checks if any version registered in `__webpack_share_scopes__.default` satisfies the consumer's `requiredVersion` SemVer range (e.g., `^18.0.0`).
2. **Reuse Existing Version:** If a compatible version exists (e.g., `18.2.0`), the consumer uses that shared instance—preventing duplicate network downloads.
3. **Fallback Resolution:** If no registered version satisfies the SemVer range, the consumer **falls back** to downloading its own bundled copy of the dependency included in its own build assets.

---

### Scenario B: Singleton Dependency (`singleton: true`)

For libraries like `react`, `react-dom`, or state containers where multiple instances break internal registries, `singleton: true` overrides standard SemVer isolation:

1. **Select Global Highest Version:** Regardless of individual `requiredVersion` declarations, Module Federation picks the **highest version registered across all loaded containers** in `__webpack_share_scopes__.default`.
2. **Warn/Fail on Strict Version Mismatch:**

- If `strictVersion: false` (default): If the highest version violates a remote's `requiredVersion`, Webpack logs a console warning but **forces the remote to use the highest version anyway** to preserve singleton integrity.
- If `strictVersion: true`: If the highest version violates `requiredVersion`, the application **throws a runtime error** rather than risking execution with an incompatible version.

---

## How Fallbacks Work (`eager` vs. Asynchronous)

When a fallback is needed because no registered module satisfies the constraints:

1. **Asynchronous Chunks (Default):** The consumer issues an asynchronous fetch request to download its local fallback chunk from its CDN endpoint.
2. **Eager Consumption (`eager: true`):** The dependency is bundled directly into the container's initial entry payload. While this guarantees instant availability, it increases initial bundle size and limits the runtime's ability to negotiate down to a smaller shared chunk.

---

## Summary Configuration Reference

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      shared: {
        react: {
          singleton: true, // Enforce a single runtime instance across host and remotes
          strictVersion: true, // Throw a runtime error if version constraints are violated
          requiredVersion: "^18.2.0", // SemVer constraint used during negotiation
          eager: false, // Load chunk asynchronously on demand
        },
      },
    }),
  ],
};
```

In **single-spa**, **SystemJS** and **Import Maps** work together as a dynamic, browser-native-style module loading system.

Unlike Module Federation (which relies on Webpack/Vite runtime containers), single-spa delegates dependency management and module resolution to the browser level via SystemJS and JSON-based Import Maps.

---

## The Core Concept: How They Work Together

```
   Import Map (JSON)
┌───────────────────────────────┐
│ "react": ".../react.min.js"   │
│ "@mfe/navbar": ".../main.js"  │
└───────────────┬───────────────┘
                │ Resolves URLs
                ▼
      SystemJS Module Loader
┌───────────────────────────────┐
│  System.import('@mfe/navbar') │
└───────────────┬───────────────┘
                │ Fetches & Executes
                ▼
   Isolated Micro-Frontend App

```

1. **Import Maps** act as a **URL lookup table** mapping bare module specifiers (like `"react"` or `"@mfe/navbar"`) to absolute CDN or server URLs.
2. **SystemJS** acts as a **universal browser module loader** (a polyfill for ES modules) that intercepts dynamic `System.import()` calls, consults the Import Map, and loads JavaScript files at runtime.

---

## Step 1: Defining the Import Map

In a single-spa architecture, the **Root Config (Shell)** includes an Import Map in its `index.html`:

```html
<!-- index.html (Root Shell) -->
<script type="systemjs-importmap">
  {
    "imports": {
      "react": "https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js",
      "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js",
      "@company/navbar": "https://cdn.company.com/navbar/v2/main.js",
      "@company/checkout": "https://cdn.company.com/checkout/v1/main.js"
    }
  }
</script>

<script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.0/dist/system.min.js"></script>
```

---

## Step 2: Shared Dependencies via Webpack `externals`

To prevent every micro-frontend from bundling its own copy of heavy libraries (like React or Lodash), micro-frontend builds mark these shared libraries as **externals**.

### Micro-Frontend Webpack Config (`@company/navbar`):

```javascript
// webpack.config.js
module.exports = {
  // Tell Webpack NOT to bundle React or ReactDOM
  externals: ["react", "react-dom"],
  output: {
    libraryTarget: "system", // Output bundle as a SystemJS module
  },
};
```

When `@company/navbar` runs `import React from 'react'`, Webpack compiles this to `System.register(["react"], ...)` instead of embedding React's code into the output file.

---

## Step 3: Registration & Dynamic Loading in single-spa

The single-spa root application registers micro-frontends using `System.import()`. When a user navigates to a route, single-spa dynamically fetches the required bundle URL defined in the Import Map:

```javascript
// root-config.js (Shell)
import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@company/navbar",
  // System.import consults the Import Map to find @company/navbar's URL
  app: () => System.import("@company/navbar"),
  activeWhen: ["/"],
});

registerApplication({
  name: "@company/checkout",
  app: () => System.import("@company/checkout"),
  activeWhen: ["/checkout"],
});

start();
```

---

## Step-by-Step Execution Flow at Runtime

1. **Browser Bootstraps:** The Root Shell loads `index.html`. SystemJS reads the `<script type="systemjs-importmap">`.
2. **Shared Library Caching:** When `@company/navbar` demands `"react"`, SystemJS resolves `"react"` to the CDN URL in the Import Map, downloads it **once**, and keeps it in the SystemJS module registry in memory (`System.registry`).
3. **Route Navigation:** User navigates to `/checkout`. single-spa triggers `System.import("@company/checkout")`.
4. **Dependency Reuse:** `@company/checkout` also requires `"react"`. SystemJS checks its registry, sees React is already loaded in memory, and instantly reuses the existing instance without issuing a new network request.

---

## Dynamic Import Maps & Independent Deployments

The biggest advantage of the SystemJS + Import Map approach in single-spa is **zero-rebuild independent deployments**:

1. Team Checkout deploys `v1.2.0` of `@company/checkout` to their CDN (`[https://cdn.company.com/checkout/v1.2.0/main.js](https://cdn.company.com/checkout/v1.2.0/main.js)`).
2. Their CI/CD pipeline updates a dynamic Import Map service (e.g., using **[import-map-deployer](https://github.com/single-spa/import-map-deployer)** or an API gateway endpoint).
3. The next user who refreshes the browser fetches the updated `importmap.json` and immediately receives the new checkout bundle—**without needing to rebuild or re-deploy the Root Shell application**.

---

## Trade-offs Summary

| Aspect                      | SystemJS + Import Maps (single-spa)                           | Module Federation                              |
| --------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| **Dependency Resolution**   | Manual (explicitly mapped in JSON)                            | Automatic (runtime container negotiation)      |
| **Version Flexibility**     | Harder to run multiple versions of shared libs simultaneously | Built-in SemVer matching & automatic fallbacks |
| **Deployment Independence** | High (updating JSON file switches remote URLs)                | High (requires remote manifest or dashboard)   |
| **Setup Overhead**          | Requires SystemJS output formatting & map orchestration       | Requires Webpack 5 / Vite plugin configuration |

How do I set up dynamic manifest resolution for Module Federation to deploy micro-frontends without rebuilding the shell app?

To deploy micro-frontends (MFEs) independently without rebuilding or redeploying the shell (host) application, you must replace **build-time static remote URLs** with **runtime dynamic manifest resolution**.

Instead of hardcoding `[https://cdn.example.com/mfe/remoteEntry.js](https://cdn.example.com/mfe/remoteEntry.js)` into the shell's Webpack/Vite build config, the shell fetches a `manifest.json` file at runtime (or calls a config service) to determine where remote assets live.

There are two primary ways to set this up: using the official **Modern Module Federation Runtime Engine (`@module-federation/enhanced`)** or using **Webpack Promise-Based Remotes**.

---

## Method 1: Using Modern Module Federation Runtime Engine (Recommended)

Modern Module Federation (v2.0+) moves container initialization from build-time configuration into a **runtime JavaScript SDK** (`@module-federation/enhanced`).

### Step 1: Remote App Generates its `mf-manifest.json`

Enable manifest generation in your remote applications.

```javascript
// remote-mfe/webpack.config.js
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "cartApp",
      filename: "remoteEntry.js",
      exposes: {
        "./CartWidget": "./src/CartWidget",
      },
      manifest: true, // Emits `mf-manifest.json` on build
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};
```

When built, the remote automatically emits an `mf-manifest.json` file alongside its bundle containing version metadata and entry paths.

---

### Step 2: Shell App Fetches the Manifest Dynamically

In your shell app, configure `remotes` using the manifest entry points.

```javascript
// shell/webpack.config.js
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shellApp",
      // Point remote names directly to their manifest URLs
      remotes: {
        cartApp: "cartApp@http://cdn.company.com/cart/latest/mf-manifest.json",
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};
```

---

### Step 3: Runtime Registration via SDK (Zero-Rebuild Deployment)

To update endpoints dynamically without _any_ shell build step, initialize remotes in JavaScript at runtime using `init()`:

```typescript
// shell/src/initFederation.ts
import { init, loadRemote } from "@module-federation/enhanced/runtime";

export async function setupMicroFrontends() {
  // 1. Fetch live manifest configuration from a config endpoint or CDN
  const res = await fetch("https://api.company.com/v1/mfe-manifest");
  const manifest = await res.json();

  /* Example JSON returned by API:
    {
      "cartApp": "https://cdn.company.com/cart/v2.1.0/mf-manifest.json",
      "productApp": "https://cdn.company.com/product/v1.4.2/mf-manifest.json"
    }
  */

  // 2. Dynamically initialize the Module Federation runtime container
  init({
    name: "shellApp",
    remotes: Object.entries(manifest).map(([name, entry]) => ({
      name,
      entry: entry as string,
    })),
  });
}
```

#### Consume in React components:

```tsx
// shell/src/App.tsx
import React, { useEffect, useState, Suspense } from "react";
import { loadRemote } from "@module-federation/enhanced/runtime";
import { setupMicroFrontends } from "./initFederation";

// Dynamic lazy loader helper
const RemoteCart = React.lazy(async () => {
  return loadRemote("cartApp/CartWidget");
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setupMicroFrontends().then(() => setIsReady(true));
  }, []);

  if (!isReady) return <div>Initializing micro-frontends...</div>;

  return (
    <div>
      <h1>Shell Header</h1>
      <Suspense fallback={<div>Loading Remote Cart...</div>}>
        <RemoteCart />
      </Suspense>
    </div>
  );
}
```

---

## Method 2: Webpack 5 Promise-Based External Remotes (Legacy / Native Webpack)

If you are using classic Webpack 5 without extra plugins, you can use **Promise-based dynamic remotes** directly in your `webpack.config.js`.

### Step 1: Configure the Shell Webpack Config

Pass a stringified JS `Promise` to the `remotes` field. Webpack executes this inline promise at runtime before requesting the module.

```javascript
// shell/webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shellApp",
      remotes: {
        cartApp: `promise new Promise((resolve, reject) => {
          // 1. Fetch remote entry URL from your central API/manifest
          fetch('https://api.company.com/v1/mfe-manifest')
            .then(res => res.json())
            .then(manifest => {
              const remoteUrl = manifest.cartApp; // e.g. "https://cdn.com/cart/remoteEntry.js"
              
              // 2. Inject script tag into DOM dynamically
              const script = document.createElement('script');
              script.src = remoteUrl;
              script.onload = () => {
                // 3. Resolve the window container object created by remoteEntry.js
                const proxy = {
                  get: (request) => window.cartApp.get(request),
                  init: (arg) => {
                    try {
                      return window.cartApp.init(arg);
                    } catch(e) {
                      console.error('Remote init error:', e);
                    }
                  }
                };
                resolve(proxy);
              };
              script.onerror = reject;
              document.head.appendChild(script);
            })
            .catch(reject);
        })`,
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};
```

---

## The CI/CD Zero-Downtime Deployment Lifecycle

To deploy a micro-frontend with zero shell rebuilds, set up your release pipeline as follows:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Step 1: Team Cart builds & uploads JS assets to S3/CDN               │
│  `https://cdn.company.com/cart/v2.1.0/remoteEntry.js`                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Step 2: CI/CD updates the central Manifest Registry / DB              │
│  API update: PATCH /v1/mfe-manifest -> { "cartApp": "v2.1.0/..." }    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Step 3: Users refresh the Shell page                                  │
│  Shell fetches updated manifest and loads the new v2.1.0 code instantly│
└────────────────────────────────────────────────────────────────────────┘

```

---

## Best Practices for Manifest-Driven Deployments

1. **Manifest Caching:** Serve `manifest.json` with a short HTTP TTL (e.g., `Cache-Control: max-age=60, s-maxage=60`) or invalidate it through your API Gateway when publishing releases.
2. **Feature Flags & Canary Rollouts:** Use your manifest endpoint to return different URLs per user session (e.g., serving `v2.0.0-canary` to 10% of users while 90% receive `v1.9.0`).
3. **Graceful Fallbacks:** If the manifest fetch fails or a remote CDN is down, handle network rejection inside `React.lazy()` / `ErrorBoundary` so the shell continues rendering remaining widgets.
