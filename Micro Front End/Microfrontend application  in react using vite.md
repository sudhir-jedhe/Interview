Building a **Micro-Frontend (MFE)** architecture in React using **Vite** leverages Native ES Modules (ESM) to deliver fast development startup times, instant Hot Module Replacement (HMR), and efficient production builds via Rollup.

The standard way to implement Module Federation in Vite is using the **`@module-federation/vite`** plugin.

---

### Project Structure (Monorepo setup using pnpm/npm workspaces)

```text
my-mfe-project/
├── packages/
│   └── shared-ui/         # Shared UI components & design system
├── apps/
│   ├── host-app/          # Shell / Container Application (Port 3000)
│   └── remote-app/        # Independent Remote MFE (Port 3001)
└── package.json

```

---

### Step 1: Install Dependencies

In both `host-app` and `remote-app`, install `@module-federation/vite`:

```bash
npm install -D @module-federation/vite

```

---

### Step 2: Configure the Remote Application (`apps/remote-app/vite.config.ts`)

The Remote MFE exposes specific components (e.g., `Header`, `Button`, or entire pages like `Dashboard`) and shares core packages like React to prevent duplicate library instances.

```typescript
// apps/remote-app/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/components/Header.tsx',
        './UserProfile': './src/components/UserProfile.tsx',
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
    target: 'chrome89', // Target modern browsers for top-level await support
  },
});

```

#### The Exposed Component (`apps/remote-app/src/components/Header.tsx`):

```tsx
import React from 'react';

export default function Header({ title }: { title: string }) {
  return (
    <header style={{ padding: '1rem', background: '#2563eb', color: '#fff' }}>
      <h2>{title} (Rendered from Remote MFE)</h2>
    </header>
  );
}

```

---

### Step 3: Configure the Host Application (`apps/host-app/vite.config.ts`)

The Host (Shell) app registers remote entry points so it can load components across the network at runtime.

```typescript
// apps/host-app/vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const remoteUrl = env.VITE_REMOTE_APP_URL || 'http://localhost:3001/remoteEntry.js';

  return {
    plugins: [
      react(),
      federation({
        name: 'host_app',
        remotes: {
          remote_app: {
            type: 'module',
            name: 'remote_app',
            entry: remoteUrl,
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

---

### Step 4: Add TypeScript Declarations in Host App

Because the TypeScript compiler in `host-app` doesn't natively know about remote imports, declare the remote module in a `.d.ts` file.

```typescript
// apps/host-app/src/remotes.d.ts
declare module 'remote_app/Header' {
  const Header: React.ComponentType<{ title: string }>;
  export default Header;
}

declare module 'remote_app/UserProfile' {
  const UserProfile: React.ComponentType;
  export default UserProfile;
}

```

---

### Step 5: Consume the Remote Component in Host App

Use `React.lazy` and `<Suspense>` to load the remote module dynamically.

```tsx
// apps/host-app/src/App.tsx
import React, { lazy, Suspense } from 'react';

// Dynamically import component from Remote MFE
const RemoteHeader = lazy(() => import('remote_app/Header'));

export default function App() {
  return (
    <div className="host-container">
      <h1>Host Application Shell</h1>

      {/* Render Remote Component */}
      <Suspense fallback={<div>Loading Remote Header...</div>}>
        <RemoteHeader title="Welcome to Micro-Frontend Architecture" />
      </Suspense>

      <main style={{ padding: '2rem' }}>
        <p>This section is rendered locally by the Host app.</p>
      </main>
    </div>
  );
}

```

---

### Step 6: Running & Testing the Architecture

1. **Start the Remote App:**
```bash
cd apps/remote-app
npm run dev

```


*(Running on `http://localhost:3001`)*
2. **Start the Host App:**
```bash
cd apps/host-app
npm run dev

```


*(Running on `http://localhost:3000`)*
3. Open `http://localhost:3000` in your browser. The Host shell will fetch `http://localhost:3001/remoteEntry.js` and render `RemoteHeader` seamlessly.

---

### Key Best Practices

1. **`singleton: true` in `shared`:** Always ensure `react` and `react-dom` are declared as singletons to prevent state corruption or hooks errors caused by multiple copies of React running simultaneously.
2. **Target Compatibility:** Set `build.target: 'chrome89'` (or higher) in `vite.config.ts` so Vite enables top-level `await` support, which Module Federation requires during asset resolution.
3. **Independent Deployments:** Each Remote application can be built (`npm run build`) and deployed to its own S3 bucket or CDN independently without rebuilding or redeploying the Host shell.
