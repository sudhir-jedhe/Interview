Micro-Frontends (MFEs) extend the concepts of backend microservices to the frontend. Instead of building a single, monolithic React Single Page Application (SPA), a large web application is broken down into smaller, independent, semi-autonomous frontend applications that run together seamlessly in the browser.

---

### What is a Micro-Frontend?

In a monolithic architecture, a single team (or multiple teams working in one repository) owns the entire codebase. A bug in the checkout module can break the home page build, and every deployment requires building and testing the entire site.

With Micro-Frontends:

* **Domain Ownership:** Team A owns the *Product Catalog* MFE, Team B owns the *Checkout* MFE, and Team C owns the *User Account* MFE.
* **Independent Deployments:** Team B can deploy a fix to the Checkout MFE in 2 minutes without re-compiling or re-deploying Team A's Product Catalog.
* **Autonomous Tech Stack (Optional):** While usually kept consistent, different MFEs *can* technically run on different React versions or even different frameworks (e.g., React alongside Vue).

---

### Architectural Approaches to Micro-Frontends in React

There are four primary patterns for implementing Micro-Frontends. Choosing the right one depends on your performance, routing, and deployment requirements:

```
                  ┌────────────────────────┐
                  │    Host Application    │
                  │  (Shell / Layout / Router)
                  └───────────┬────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │ (Runtime Import)   │ (Runtime Import)   │ (Runtime Import)
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Header Remote  │  │ Search / Catalog│  │ Checkout Remote │
│  (Team Shared)  │  │  (Team Alpha)   │  │   (Team Beta)   │
└─────────────────┘  └─────────────────┘  └─────────────────┘

```

#### 1. Webpack / Vite Module Federation (Runtime Integration — Recommended)

This is the modern industry standard for React SPAs. **Module Federation** allows a host application to dynamically import compiled React components from a remote server at runtime via a lightweight `remoteEntry.js` file.

* **Pros:** Dynamic runtime loading, shared singletons (e.g., loaded once across all apps: `react`, `react-dom`, `tanstack-query`), instant deployment updates without re-building the host shell.
* **Cons:** Requires bundler-level configuration and disciplined shared dependency management.

#### 2. Web Components (Custom Elements)

Each micro-frontend is wrapped inside a native browser Custom Element (`<checkout-mfe />`).

* **Pros:** Framework-agnostic hard encapsulation; uses native browser Shadow DOM for total CSS and style isolation.
* **Cons:** Harder to share React contexts (Theme, Auth) across boundaries; slightly higher runtime overhead if multiple React instances are mounted.

#### 3. Build-Time Integration (NPM Packages / Workspaces)

Micro-frontends are published as separate private NPM packages and installed as dependencies into a main container app.

* **Pros:** Simple, type-safe, low setup complexity.
* **Cons:** **Not a true MFE in spirit.** Updating a child component requires re-building, re-testing, and re-deploying the entire host application.

#### 4. Server-Side Integration (e.g., Next.js Multi-Zones)

Routing happens at the reverse proxy or CDN level (e.g., Nginx, Cloudflare Workers). Requests to `/catalog/*` route to Server A, while requests to `/checkout/*` route to Server B.

* **Pros:** Great for SEO, fast initial page loads, simple operational isolation.
* **Cons:** Navigating between zones triggers a full browser page refresh unless using complex cross-zone routing setups.

---

### Step-by-Step Implementation with Module Federation

Here is how a Host app (Shell) imports a Remote app (`checkout`) using Webpack Module Federation:

#### Step A: Remote Configuration (`checkout-mfe/webpack.config.js`)

Expose components so the host can fetch them.

```javascript
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  name: 'checkoutApp',
  filename: 'remoteEntry.js',
  exposes: {
    './CartWidget': './src/components/CartWidget.tsx', // Expose the component
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'checkoutApp',
      filename: 'remoteEntry.js',
      exposes: {
        './CartWidget': './src/components/CartWidget.tsx',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.0.0' },
      },
    }),
  ],
};

```

#### Step B: Host Configuration (`shell-app/webpack.config.js`)

Define remote URLs.

```javascript
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  name: 'shell',
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        checkoutApp: 'checkoutApp@https://checkout.mycompany.com/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.0.0' },
      },
    }),
  ],
};

```

#### Step C: Consuming the Remote Component in Host (`shell-app/src/App.tsx`)

```tsx
import React, { Suspense, lazy } from 'react';

// Dynamically import from remote entry at runtime
const RemoteCartWidget = lazy(() => import('checkoutApp/CartWidget'));

export function App() {
  return (
    <div className="app-shell">
      <header>
        <h1>Store Shell</h1>
        <Suspense fallback={<div>Loading Cart...</div>}>
          <RemoteCartWidget />
        </Suspense>
      </header>
    </div>
  );
}

```

---

### Key Engineering Challenges & Solutions

#### 1. Cross-MFE Communication

**Anti-Pattern:** Sharing a single global Redux/Zustand store across micro-frontends. This tightly couples apps and breaks independent deployments.
**Best Practice:**

* **Custom Browser Events:** Use native event targets (`window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: 3 } }))`).
* **URL Search Params:** Pass lightweight state via query strings (`/checkout?step=payment&userId=123`).

#### 2. CSS & Style Bleed

When multiple MFEs run on the same page, CSS rule collisions can break layouts across teams.

* Use **Tailwind CSS** with team-specific prefixes (`prefix: 'checkout-'` in `tailwind.config.js`).
* Use **CSS Modules** or **Scoped CSS-in-JS** (Styled Components / Emotion).

#### 3. Error Isolation (Resilience)

If a remote MFE server crashes or returns a 500 error, it must not take down the entire page.

* Wrap all remote imports in **React Error Boundaries**:

```tsx
<ErrorBoundary fallback={<FallbackCartWidget />}>
  <Suspense fallback={<CartSkeleton />}>
    <RemoteCartWidget />
  </Suspense>
</ErrorBoundary>

```

#### 4. Repo Organization: Monorepo vs. Multi-Repo

* **Monorepo (Turborepo / Nx):** Recommended for small-to-medium orgs. All MFEs live in one repo for shared TypeScript configs and easy local debugging, but deploy independently.
* **Multi-Repo:** Best for large enterprises with strict access controls where teams cannot share access to source code.

---

### When Should You (and Shouldn't You) Use Micro-Frontends?

#### ✅ Good Fits

* Large engineering organizations (50+ developers) divided into distinct domain teams.
* Applications where different sub-domains need completely separate release cycles.
* Enterprise migration strategy (e.g., slowly replacing a legacy React 16 app with React 19 micro-apps slice by slice).

#### ❌ Bad Fits

* Small or medium teams (< 20 developers).
* Startups building MVP products where requirements change rapidly across all domains.
* Applications requiring ultra-tight UI integration where micro-frontend boundaries create unnecessary infrastructure overhead.

Setting up **Turborepo** with **Webpack Module Federation** gives you the best of both worlds: local developer velocity with shared TypeScript types and linting in a single repository, alongside independent, runtime-decoupled deployments for production.

Here is a complete, step-by-step setup for a Turborepo monorepo containing a **Host (Shell)** app, a **Remote (Header)** micro-frontend, and a **Shared UI Package**.

---

### Project Architecture Overview

```text
mfe-monorepo/
├── apps/
│   ├── host/                     # Host / Shell App (Port 3000)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── bootstrap.tsx
│   │   │   ├── index.ts
│   │   │   └── decl.d.ts         # Remote TypeScript module declarations
│   │   ├── webpack.config.js
│   │   └── package.json
│   │
│   └── remote-header/            # Remote Micro-Frontend App (Port 3001)
│       ├── src/
│       │   ├── Header.tsx        # Exposed component
│       │   ├── bootstrap.tsx
│       │   └── index.ts
│       ├── webpack.config.js
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared Build-Time Components (Design Tokens)
│   └── config-typescript/        # Shared tsconfig bases
│
├── turbo.json                    # Turborepo task pipeline configuration
└── package.json                  # Root pnpm/npm workspace manifest

```

---

### Step 1: Root Workspace Configuration

#### `package.json` (Root)

Configure pnpm or npm workspaces at the root level.

```json
{
  "name": "mfe-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}

```

#### `turbo.json` (Root)

Configure task caching and execution pipelines. We set `persistent: true` for development servers to prevent Turborepo from blocking tasks.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}

```

---

### Step 2: Configure the Remote MFE (`remote-header`)

The Remote application exposes its internal `Header` component for runtime consumption by the Host.

#### `apps/remote-header/webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for cross-origin dynamic loading
    },
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'swc-loader', // Fast compilation
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteHeader',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/Header.tsx', // Expose Header component
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

```

#### `apps/remote-header/src/Header.tsx`

```tsx
import React from 'react';

export interface HeaderProps {
  title?: string;
  user?: { name: string };
}

export default function Header({ title = 'Default Portal Title', user }: HeaderProps) {
  return (
    <header style={{ padding: '16px', background: '#0f172a', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>
        <div>{user ? `Welcome, ${user.name}` : <button>Login</button>}</div>
      </div>
    </header>
  );
}

```

#### Bootstrap Pattern (`apps/remote-header/src/index.ts` & `bootstrap.tsx`)

Module Federation requires asynchronous loading of shared dependencies before executing React code.

`src/index.ts`:

```typescript
import('./bootstrap');
export {};

```

`src/bootstrap.tsx`:

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Header title="Standalone Remote Header Mode" />);
}

```

---

### Step 3: Configure the Host Application (`host`)

The Host imports `remoteHeader` dynamically at runtime.

#### `apps/host/webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'swc-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // Point to the local dev server running the remote
        remoteHeader: 'remoteHeader@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

```

#### TypeScript Types Declaration (`apps/host/src/decl.d.ts`)

Provide type definitions for remote modules so TypeScript doesn't throw `Cannot find module` errors.

```typescript
declare module 'remoteHeader/Header' {
  import React from 'react';
  
  export interface HeaderProps {
    title?: string;
    user?: { name: string };
  }

  const Header: React.ComponentType<HeaderProps>;
  export default Header;
}

```

#### Consuming the Remote (`apps/host/src/App.tsx`)

Wrap the dynamic remote component in `React.lazy` and a robust `ErrorBoundary`.

```tsx
import React, { Suspense, lazy } from 'react';

// Lazy-load from the remote entry
const RemoteHeader = lazy(() => import('remoteHeader/Header'));

// Error Boundary for resilient failure handling
class RemoteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <header style={{ padding: '16px', background: '#fee2e2' }}>Header Unavailable</header>;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <RemoteErrorBoundary>
        <Suspense fallback={<div style={{ height: '60px', background: '#e2e8f0' }}>Loading Header...</div>}>
          <RemoteHeader title="Enterprise Micro-Frontend Shell" user={{ name: "Alex" }} />
        </Suspense>
      </RemoteErrorBoundary>

      <main style={{ padding: '20px' }}>
        <h1>Main Application Content</h1>
        <p>This is hosted inside the primary shell application.</p>
      </main>
    </div>
  );
}

```

---

### Step 4: Run Dev Environment with Turborepo

Run the following command at the root of your monorepo:

```bash
pnpm dev

```

Turborepo will execute `npm run dev` across all apps in parallel:

* **Remote Header:** Runs at `http://localhost:3001` (Exposes `http://localhost:3001/remoteEntry.js`)
* **Host Shell:** Runs at `http://localhost:3000` (Fetches remote header assets automatically)

---

### Key Production & CI/CD Practices for Turborepo MFEs

1. **Environment-Based Remote URLs:** Avoid hardcoding `http://localhost:3001`. Use runtime environment variables in Webpack:

```javascript
const REMOTE_HEADER_URL = process.env.REMOTE_HEADER_URL || 'http://localhost:3001';

remotes: {
  remoteHeader: `remoteHeader@${REMOTE_HEADER_URL}/remoteEntry.js`,
}

```

1. **Selective Remote Deployments:** In CI/CD pipelines, use Turborepo's filtering (`turbo run build --filter=remote-header`) so you only build and deploy the specific micro-frontend that changed.
2. **Shared Singletons:** Always ensure core framework dependencies (`react`, `react-dom`, `@tanstack/react-query`) are listed in `shared` with `singleton: true` across all `webpack.config.js` files to ensure only one instance is loaded in browser memory.

Setting up **Turborepo** with **Webpack Module Federation** gives you the best of both worlds: local developer velocity with shared TypeScript types and linting in a single repository, alongside independent, runtime-decoupled deployments for production.

Here is a complete, step-by-step setup for a Turborepo monorepo containing a **Host (Shell)** app, a **Remote (Header)** micro-frontend, and a **Shared UI Package**.

---

### Project Architecture Overview

```text
mfe-monorepo/
├── apps/
│   ├── host/                     # Host / Shell App (Port 3000)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── bootstrap.tsx
│   │   │   ├── index.ts
│   │   │   └── decl.d.ts         # Remote TypeScript module declarations
│   │   ├── webpack.config.js
│   │   └── package.json
│   │
│   └── remote-header/            # Remote Micro-Frontend App (Port 3001)
│       ├── src/
│       │   ├── Header.tsx        # Exposed component
│       │   ├── bootstrap.tsx
│       │   └── index.ts
│       ├── webpack.config.js
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared Build-Time Components (Design Tokens)
│   └── config-typescript/        # Shared tsconfig bases
│
├── turbo.json                    # Turborepo task pipeline configuration
└── package.json                  # Root pnpm/npm workspace manifest

```

---

### Step 1: Root Workspace Configuration

#### `package.json` (Root)

Configure pnpm or npm workspaces at the root level.

```json
{
  "name": "mfe-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}

```

#### `turbo.json` (Root)

Configure task caching and execution pipelines. We set `persistent: true` for development servers to prevent Turborepo from blocking tasks.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}

```

---

### Step 2: Configure the Remote MFE (`remote-header`)

The Remote application exposes its internal `Header` component for runtime consumption by the Host.

#### `apps/remote-header/webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for cross-origin dynamic loading
    },
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'swc-loader', // Fast compilation
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteHeader',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/Header.tsx', // Expose Header component
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

```

#### `apps/remote-header/src/Header.tsx`

```tsx
import React from 'react';

export interface HeaderProps {
  title?: string;
  user?: { name: string };
}

export default function Header({ title = 'Default Portal Title', user }: HeaderProps) {
  return (
    <header style={{ padding: '16px', background: '#0f172a', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>
        <div>{user ? `Welcome, ${user.name}` : <button>Login</button>}</div>
      </div>
    </header>
  );
}

```

#### Bootstrap Pattern (`apps/remote-header/src/index.ts` & `bootstrap.tsx`)

Module Federation requires asynchronous loading of shared dependencies before executing React code.

`src/index.ts`:

```typescript
import('./bootstrap');
export {};

```

`src/bootstrap.tsx`:

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Header title="Standalone Remote Header Mode" />);
}

```

---

### Step 3: Configure the Host Application (`host`)

The Host imports `remoteHeader` dynamically at runtime.

#### `apps/host/webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'swc-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // Point to the local dev server running the remote
        remoteHeader: 'remoteHeader@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

```

#### TypeScript Types Declaration (`apps/host/src/decl.d.ts`)

Provide type definitions for remote modules so TypeScript doesn't throw `Cannot find module` errors.

```typescript
declare module 'remoteHeader/Header' {
  import React from 'react';
  
  export interface HeaderProps {
    title?: string;
    user?: { name: string };
  }

  const Header: React.ComponentType<HeaderProps>;
  export default Header;
}

```

#### Consuming the Remote (`apps/host/src/App.tsx`)

Wrap the dynamic remote component in `React.lazy` and a robust `ErrorBoundary`.

```tsx
import React, { Suspense, lazy } from 'react';

// Lazy-load from the remote entry
const RemoteHeader = lazy(() => import('remoteHeader/Header'));

// Error Boundary for resilient failure handling
class RemoteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <header style={{ padding: '16px', background: '#fee2e2' }}>Header Unavailable</header>;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <RemoteErrorBoundary>
        <Suspense fallback={<div style={{ height: '60px', background: '#e2e8f0' }}>Loading Header...</div>}>
          <RemoteHeader title="Enterprise Micro-Frontend Shell" user={{ name: "Alex" }} />
        </Suspense>
      </RemoteErrorBoundary>

      <main style={{ padding: '20px' }}>
        <h1>Main Application Content</h1>
        <p>This is hosted inside the primary shell application.</p>
      </main>
    </div>
  );
}

```

---

### Step 4: Run Dev Environment with Turborepo

Run the following command at the root of your monorepo:

```bash
pnpm dev

```

Turborepo will execute `npm run dev` across all apps in parallel:

* **Remote Header:** Runs at `http://localhost:3001` (Exposes `http://localhost:3001/remoteEntry.js`)
* **Host Shell:** Runs at `http://localhost:3000` (Fetches remote header assets automatically)

---

### Key Production & CI/CD Practices for Turborepo MFEs

1. **Environment-Based Remote URLs:** Avoid hardcoding `http://localhost:3001`. Use runtime environment variables in Webpack:

```javascript
const REMOTE_HEADER_URL = process.env.REMOTE_HEADER_URL || 'http://localhost:3001';

remotes: {
  remoteHeader: `remoteHeader@${REMOTE_HEADER_URL}/remoteEntry.js`,
}

```

1. **Selective Remote Deployments:** In CI/CD pipelines, use Turborepo's filtering (`turbo run build --filter=remote-header`) so you only build and deploy the specific micro-frontend that changed.
2. **Shared Singletons:** Always ensure core framework dependencies (`react`, `react-dom`, `@tanstack/react-query`) are listed in `shared` with `singleton: true` across all `webpack.config.js` files to ensure only one instance is loaded in browser memory.
