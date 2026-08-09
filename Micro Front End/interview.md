Here is a curated list of top **Micro Frontend (MFE) interview questions for React developers**, ranging from core architectural principles to advanced React-specific integration patterns.

---

### 1. Core Architectural Concepts

#### Q1: What is a Micro Frontend architecture, and how does it differ from a Monolithic React SPA?

**Answer:**
A Micro Frontend architecture breaks a large frontend application into smaller, semi-independent micro-apps managed by distinct teams.

* **Monolith:** Single codebase, single build pipeline, single deployment artifact. A change in one feature requires rebuilding and redeploying the entire app.
* **Micro Frontend:** Multiple independent repositories/builds deployed separately. Each micro-app owns a specific domain (e.g., Auth, Checkout, Search) and mounts dynamically into a container/shell application.

#### Q2: What are the main integration strategies for Micro Frontends in React?

**Answer:**

1. **Build-Time Integration (NPM Packages / Monorepo):** Micro-apps are published as npm packages and installed as dependencies. *(Downside: Requires re-building the host app on every update).*
2. **Runtime Integration via IFrames:** Simple and isolated, but introduces poor UX, heavy memory consumption, difficult deep linking, and layout constraints.
3. **Runtime Integration via Web Components:** Micro-apps are wrapped inside Custom Elements (`<checkout-widget></checkout-widget>`). Framework-agnostic and fully isolated via Shadow DOM.
4. **Runtime Integration via Module Federation (Standard for React):** Webpack 5 / Vite Module Federation dynamically fetches remote JavaScript bundles (`remoteEntry.js`) at runtime while sharing React instances in memory.

---

### 2. React-Specific Micro Frontend Challenges

#### Q3: Why is the "Multiple React Instances" problem dangerous, and how do you solve it?

**Answer:**
If the Host app and a Remote MFE both load their own separate copies of `react` and `react-dom`:

1. **Broken React Context & Hooks:** React hooks (`useState`, `useContext`) rely on a single global React dispatcher instance. Multiple instances break hooks and throw runtime errors (e.g., *"Invalid hook call"*).
2. **Bloated Bundle Size:** Users end up downloading double or triple the size of React.

**Solution:** Declare `react` and `react-dom` as **Singletons** in your Module Federation configuration:

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0', eager: false },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: false },
  },
});

```

#### Q4: How do you handle routing across different React Micro Frontends?

**Answer:**
Cross-MFE routing requires a clear division of labor:

1. **Host/Shell App owns top-level routes:** Uses `react-router-dom` to map URL paths to Remote MFE boundaries (e.g., `/checkout/*` $\rightarrow$ `<CheckoutRemote/>`).
2. **Remote MFE owns internal sub-routes:** The Remote uses a scoped router or `basename` (e.g., `<BrowserRouter basename="/checkout">`) to handle nested navigation internally without conflicting with the parent URL.

#### Q5: How do you handle Code Splitting and Error Boundaries for Remote MFEs in React?

**Answer:**
Remote MFEs are loaded asynchronously over the network, so they can fail due to network drops or server outages. In React, you wrap remote imports with **`React.lazy`**, **`React.Suspense`**, and **`ErrorBoundary`**:

```jsx
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Asynchronously fetch remote component exposed via Module Federation
const RemoteCart = lazy(() => import('cartApp/CartWidget'));

export function CartWrapper() {
  return (
    <ErrorBoundary fallback={<div>Cart module is currently unavailable.</div>}>
      <Suspense fallback={<div>Loading Cart...</div>}>
        <RemoteCart />
      </Suspense>
    </ErrorBoundary>
  );
}

```

---

### 3. State Management & Communication

#### Q6: How do you share Global State (e.g., Auth Token or Theme) across React Micro Frontends?

**Answer:**
There are 3 primary patterns:

1. **Custom Browser Events (`window.dispatchEvent`):** Decoupled and framework-agnostic. Ideal for trigger-based updates (e.g., `'AUTH_LOGIN'`, `'CART_ADD'`).
2. **Host App Context / RxJS Subject:** The Host app maintains the master Auth context and exposes a reactive observer or shared store (`sharedStore/auth`) via Module Federation.
3. **Shared Singleton Zustand/Redux Store:** If all MFEs are React, declare a shared store module as a singleton in Module Federation so both Host and Remotes tap into the exact same store instance in memory.

#### Q7: How do you manage CSS/Styling collision between different React Micro Frontends?

**Answer:**
Without isolation, styles from MFE-A can leak into MFE-B. Solutions include:

* **CSS Modules / Tailwind CSS:** Unique hashed class names prevent collision (e.g., `.button_a8f9d`).
* **Scoped CSS-in-JS (Emotion / Styled Components):** Generates unique class names per component instance.
* **CSS Scoping/Namespacing:** Prepend custom class namespaces per team/app (e.g., `.cart-mfe .btn`).
* **Shadow DOM:** Complete DOM & CSS encapsulation (used in Web Components).

---

### Summary Cheatsheet for React MFE Interviews

| Topic                        | Best Practice / Preferred Solution                       |
| ---------------------------- | -------------------------------------------------------- |
| **Code Sharing Engine**      | Webpack 5 / Vite Module Federation                       |
| **Dependency Deduplication** | `shared: { react: { singleton: true } }`                 |
| **Loading Strategy**         | `React.lazy()` + `<Suspense/>`                           |
| **Resilience & Fallbacks**   | React `ErrorBoundary` wrappers around every remote       |
| **Global Communication**     | Native Custom Events, RxJS, or shared Zustand singleton  |
| **Styling Isolation**        | CSS Modules, CSS-in-JS, or Tailwind with unique prefixes |
