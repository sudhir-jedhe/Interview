While both **Single-SPA** and **Webpack Module Federation** are popular solutions for implementing Micro Frontends, they operate at completely different levels of the application stack and solve distinct problems.

The key distinction is:

* **Single-SPA** is an **in-browser routing and lifecycle orchestrator**.
* **Webpack Module Federation** is a **runtime code-sharing and module-bundling mechanism**.

---

### Architectural Core Differences

```text
SINGLE-SPA (Orchestrator Level)
┌────────────────────────────────────────────────────────┐
│ Single-SPA Router (Root Config)                        │
│ ├─► Path: /app1  ──► Mounts App 1 (React)              │
│ ├─► Path: /app2  ──► Mounts App 2 (Vue)                │
│ └─► Path: /app3  ──► Mounts App 3 (Angular)            │
└────────────────────────────────────────────────────────┘
* Manages when micro-apps mount/unmount based on URL routes.

MODULE FEDERATION (Code / Asset Sharing Level)
┌────────────────────────────────────────────────────────┐
│ Host Application                                       │
│ ├── Dynamically fetches remoteEntry.js at runtime      │
│ ├── Imports <Button /> from Remote MFE                 │
│ └── Shares singletons (e.g. React instance in memory)  │
└────────────────────────────────────────────────────────┘
* Manages how code/components/libraries are loaded dynamically.

```

---

### Feature-by-Feature Comparison

| Feature                       | Single-SPA                                                                                 | Webpack Module Federation                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Primary Focus**             | Page lifecycle management (mounting, unmounting, routing).                                 | Dynamic code splitting, runtime component/library sharing.                                                 |
| **Operating Level**           | Application / Router level.                                                                | Module / Bundler level.                                                                                    |
| **Multi-Framework Support**   | **Native & Core Strength:** Mix React, Vue, Angular, Svelte on the same page effortlessly. | Framework agnostic, but works best when micro-frontends share similar tech stacks (e.g., all React).       |
| **Granularity**               | **Coarse-grained:** Designed primarily to mount full pages/applications per route.         | **Fine-grained & Flexible:** Share full pages, sub-components (e.g., `<Button/>`), or utility functions.   |
| **Dependency Sharing**        | Uses SystemJS / Import Maps (`<script type="importmap">`) or external script tags.         | Native Webpack plugin (`ModuleFederationPlugin`) handles version negotiation and singletons automatically. |
| **Build Tooling Requirement** | Bundler agnostic (works with Webpack, Vite, Rollup, or raw JS).                            | Tied to **Webpack 5+** (or Vite via `@originjs/vite-plugin-federation`).                                   |

---

### 1. Single-SPA (The Application Orchestrator)

Single-SPA provides a top-level **root config** that listens to URL changes and controls when micro-applications are booted, mounted, or unmounted from the DOM.

#### Key Mechanics

* **Lifecycle Hooks:** Every Single-SPA app exposes three mandatory lifecycle functions: `bootstrap()`, `mount()`, and `unmount()`.
* **Framework Wrapper Wrappers:** Provides helper wrappers like `single-spa-react` or `single-spa-vue` to turn standard framework apps into mountable micro-frontends.

```javascript
// single-spa root config (registering apps by route)
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@org/navbar',
  app: () => import('@org/navbar'),
  activeWhen: ['/'], // Always mounted
});

registerApplication({
  name: '@org/checkout',
  app: () => import('@org/checkout'),
  activeWhen: ['/checkout'], // Mounted only on /checkout
});

start();

```

---

### 2. Webpack Module Federation (The Module Exposer & Consumer)

Introduced in Webpack 5, Module Federation allows JavaScript applications to dynamically load code from other builds at **runtime**, without hard build-time dependencies or npm publishing.

#### Key Mechanics

* **Exposes & Remotes:** One application "exposes" modules, while another application lists it as a "remote" to consume those modules.
* **Smart Dependency Deduplication:** If both Host and Remote use `react@18`, Module Federation automatically downloads React once and shares the instance in memory.

```javascript
// webpack.config.js (Remote App exposing a component)
new ModuleFederationPlugin({
  name: 'remoteApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Header': './src/components/Header',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

```

---

### Can You Use Single-SPA and Module Federation Together?

**Yes! In fact, this is a common architecture in enterprise applications.**

* **Single-SPA** handles top-level routing, URL matching, and mounting/unmounting different team micro-apps on the screen.
* **Module Federation** acts as the underlying loading mechanism for Single-SPA to fetch remote code bundles and share global libraries (like React or design system UI components) without duplicate downloads.

---

### Summary Recommendation

* **Choose Single-SPA if:** You are migrating a large legacy application (e.g., embedding an old Angular app inside a new React app) or building a platform where different teams use **different frontend frameworks** on different routes.
* **Choose Webpack Module Federation if:** Your teams are using the **same stack (e.g., all React or all Vue)** and your primary goal is sharing UI components, utility modules, and dependencies at runtime across independently deployed apps.
