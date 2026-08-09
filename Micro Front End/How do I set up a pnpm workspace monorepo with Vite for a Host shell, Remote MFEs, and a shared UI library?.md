Setting up a **pnpm workspace monorepo** with Vite gives you an ultra-fast development environment using pnpm’s strict dependency resolution and Vite’s native ES Module server.

Here is a step-by-step guide to building a production-ready monorepo containing:

1. **`shared-ui`**: A local package for shared components and design tokens.
2. **`checkout-mfe`**: A Remote Micro-Frontend exposing components via `@module-federation/vite`.
3. **`host-shell`**: The main Host Shell consuming both the local `shared-ui` package and the federated `checkout-mfe`.

---

## 1. Monorepo Directory Layout

Create the directory structure and root files:

```text
my-mfe-monorepo/
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── package.json             # Root package.json (workspace scripts)
├── packages/
│   └── shared-ui/           # Shared Component Library
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── Button.tsx
│           └── index.ts
└── apps/
    ├── checkout-mfe/        # Remote MFE (Port 3001)
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── src/
    │       └── CheckoutFlow.tsx
    └── host-shell/          # Host Container (Port 3000)
        ├── package.json
        ├── vite.config.ts
        └── src/
            ├── App.tsx
            └── remotes.d.ts

```

---

## 2. Root Monorepo Configuration

### A. Define `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'apps/*'

```

### B. Root `package.json`

```json
{
  "name": "my-mfe-monorepo",
  "private": true,
  "scripts": {
    "dev:ui": "pnpm --filter shared-ui dev",
    "dev:checkout": "pnpm --filter checkout-mfe dev",
    "dev:host": "pnpm --filter host-shell dev",
    "dev": "pnpm --parallel --filter \"./apps/*\" dev",
    "build": "pnpm --recursive build"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}

```

---

## 3. Package 1: Shared UI Library (`packages/shared-ui`)

This is a local workspace package consumed by both apps.

### A. `packages/shared-ui/package.json`

```json
{
  "name": "@monorepo/shared-ui",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "dev": "vite build --watch"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^5.0.0"
  }
}

```

### B. Component & Export (`packages/shared-ui/src/Button.tsx`)

```tsx
import React from 'react';

export interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 20px',
      backgroundColor: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

```

```typescript
// packages/shared-ui/src/index.ts
export * from './Button';

```

### C. `packages/shared-ui/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SharedUI',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});

```

---

## 4. Package 2: Remote MFE (`apps/checkout-mfe`)

### A. `apps/checkout-mfe/package.json`

Link `@monorepo/shared-ui` using pnpm workspace protocol (`workspace:*`):

```json
{
  "name": "checkout-mfe",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 3001"
  },
  "dependencies": {
    "@monorepo/shared-ui": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@module-federation/vite": "^1.0.0",
    "@types/react": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}

```

### B. `apps/checkout-mfe/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'checkout_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './CheckoutFlow': './src/CheckoutFlow.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 3001,
    origin: 'http://localhost:3001',
  },
  build: {
    target: 'chrome89',
  },
});

```

### C. `apps/checkout-mfe/src/CheckoutFlow.tsx`

Uses the shared button from `@monorepo/shared-ui`:

```tsx
import React from 'react';
import { Button } from '@monorepo/shared-ui';

export default function CheckoutFlow() {
  return (
    <div style={{ padding: '1.5rem', border: '2px dashed #10b981', borderRadius: '8px' }}>
      <h3>Checkout MFE (Remote Module)</h3>
      <p>Items in cart: 3</p>
      <Button label="Complete Purchase" onClick={() => alert('Order Placed!')} />
    </div>
  );
}

```

---

## 5. Package 3: Host Shell (`apps/host-shell`)

### A. `apps/host-shell/package.json`

```json
{
  "name": "host-shell",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 3000"
  },
  "dependencies": {
    "@monorepo/shared-ui": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@module-federation/vite": "^1.0.0",
    "@types/react": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}

```

### B. `apps/host-shell/vite.config.ts`

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const checkoutUrl = env.VITE_CHECKOUT_URL || 'http://localhost:3001/remoteEntry.js';

  return {
    plugins: [
      react(),
      federation({
        name: 'host_shell',
        remotes: {
          checkout_mfe: {
            type: 'module',
            name: 'checkout_mfe',
            entry: checkoutUrl,
          },
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
        },
      }),
    ],
    server: {
      port: 3000,
    },
    build: {
      target: 'chrome89',
    },
  };
});

```

### C. TypeScript Remote Declaration (`apps/host-shell/src/remotes.d.ts`)

```typescript
declare module 'checkout_mfe/CheckoutFlow' {
  const CheckoutFlow: React.ComponentType;
  export default CheckoutFlow;
}

```

### D. `apps/host-shell/src/App.tsx`

Consumes both local `@monorepo/shared-ui` and federated `checkout_mfe/CheckoutFlow`:

```tsx
import React, { lazy, Suspense } from 'react';
import { Button } from '@monorepo/shared-ui';

// Lazy load federated remote
const CheckoutFlow = lazy(() => import('checkout_mfe/CheckoutFlow'));

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Host Application Shell</h1>
      <Button label="Host Local Button" onClick={() => console.log('Host clicked')} />

      <hr style={{ margin: '2rem 0' }} />

      <Suspense fallback={<div>Loading Remote Checkout MFE...</div>}>
        <CheckoutFlow />
      </Suspense>
    </div>
  );
}

```

---

## 6. How to Run the Monorepo

1. **Install dependencies across all workspace packages:**

```bash
pnpm install

```

1. **Build the Shared UI library first:**

```bash
pnpm --filter @monorepo/shared-ui build

```

1. **Start apps concurrently:**

```bash
pnpm dev

```

* Remote MFE launches on `http://localhost:3001`
* Host Shell launches on `http://localhost:3000`

---

## Key Monorepo Best Practices with pnpm & Vite

1. **Workspace Links (`workspace:*`):** Using `workspace:*` in `package.json` guarantees that pnpm links local packages via symlinks rather than fetching published NPM packages.
2. **`shared-ui` Watch Mode:** During development, run `pnpm --filter shared-ui dev` (which runs `vite build --watch`) so changes in your UI library instantly trigger hot updates in the Host and Remote apps.
3. **Singleton Enforcement:** The `shared: { react: { singleton: true } }` declaration in both Vite configs prevents multiple React instances from loading into memory when linking local workspace packages and remote apps.
