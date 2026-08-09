To load remote Micro-Frontend (MFE) URLs dynamically at runtime from an API endpoint (e.g., `/api/v1/mfe-manifest`), you cannot use static `remotes` declarations inside `vite.config.ts`. Instead, you use the **`@module-federation/enhanced`** runtime API (specifically `init` and `loadRemote`), which allows you to fetch remote URLs dynamically during app initialization before rendering React.

---

### Step 1: Install `@module-federation/enhanced`

Install the official Module Federation Enhanced package in your Host Shell:

```bash
pnpm add @module-federation/enhanced

```

---

### Step 2: Simplify `vite.config.ts` in Host Shell

Remove the hardcoded `remotes` object from your `vite.config.ts`. The plugin only needs to declare the container name and shared singletons:

```typescript
// apps/host-shell/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_shell',
      remotes: {}, // 👈 Leave empty! We will register remotes at runtime via API
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
});

```

---

### Step 3: Create a Dynamic Remote Loader Utility

Create a utility service (`src/services/mfeLoader.ts`) that fetches the manifest from your backend API and initializes Module Federation dynamically using `init()`:

```typescript
// apps/host-shell/src/services/mfeLoader.ts
import { init, loadRemote } from '@module-federation/enhanced/runtime';
import React from 'react';

interface MfeManifestResponse {
  [key: string]: {
    name: string;
    entry: string; // e.g. "http://localhost:3001/remoteEntry.js"
  };
}

let isInitialized = false;

// 1. Fetch remote URLs from API and initialize Module Federation Runtime
export const initializeDynamicRemotes = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    // Fetch MFE URLs dynamically from your API
    const response = await fetch('/api/v1/mfe-manifest');
    const manifest: MfeManifestResponse = await response.json();

    // Map manifest API structure to Module Federation remote specs
    const remotes = Object.values(manifest).map((mfe) => ({
      name: mfe.name,
      entry: mfe.entry,
      type: 'module' as const,
    }));

    // Initialize Module Federation at runtime
    init({
      name: 'host_shell',
      remotes,
    });

    isInitialized = true;
  } catch (error) {
    console.error('Failed to load MFE manifest from API:', error);
    throw error;
  }
};

// 2. Dynamic Component Helper that wraps loadRemote in React.lazy
export function loadDynamicRemoteComponent<T = React.ComponentType<any>>(
  remoteName: string,
  exposedModule: string
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    // Ensure manifest is fetched before trying to import remote component
    await initializeDynamicRemotes();
    
    // Dynamically load exposed module from runtime
    const module = await loadRemote<T>(`${remoteName}/${exposedModule}`);
    
    if (!module) {
      throw new Error(`Failed to load module ${exposedModule} from remote ${remoteName}`);
    }

    return module;
  });
}

```

---

### Step 4: Sample API Manifest Response

Your backend endpoint (`/api/v1/mfe-manifest`) should return a JSON response mapping feature flags or tenant settings to remote URLs:

```json
{
  "checkout": {
    "name": "checkout_mfe",
    "entry": "https://cdn.example.com/checkout/v2/remoteEntry.js"
  },
  "userProfile": {
    "name": "profile_mfe",
    "entry": "https://cdn.example.com/profile/v1/remoteEntry.js"
  }
}

```

---

### Step 5: Consume Dynamic Remotes in React Components

Now consume the dynamic remote inside React using `loadDynamicRemoteComponent` wrapped in `<Suspense>`:

```tsx
// apps/host-shell/src/App.tsx
import React, { Suspense } from 'react';
import { loadDynamicRemoteComponent } from './services/mfeLoader';

// Pass (remoteName, exposedModule) dynamically
const DynamicCheckout = loadDynamicRemoteComponent('checkout_mfe', 'CheckoutFlow');
const DynamicUserProfile = loadDynamicRemoteComponent('profile_mfe', 'UserProfile');

export default function App() {
  return (
    <div className="host-container">
      <h1>Host Shell (Dynamic Runtime MFEs)</h1>

      <main>
        <Suspense fallback={<div>Loading Dynamic Checkout...</div>}>
          <DynamicCheckout />
        </Suspense>

        <hr style={{ margin: '2rem 0' }} />

        <Suspense fallback={<div>Loading Dynamic Profile...</div>}>
          <DynamicUserProfile />
        </Suspense>
      </main>
    </div>
  );
}

```

---

### Step 6: TypeScript Declaration for Dynamic Imports

Add type declarations in your `remotes.d.ts` file so TypeScript doesn't throw errors:

```typescript
// apps/host-shell/src/remotes.d.ts
declare module '@module-federation/enhanced/runtime' {
  export function init(config: any): void;
  export function loadRemote<T = any>(remoteSpec: string): Promise<T>;
}

```

---

### Why This Runtime Strategy is Essential for White-Labeling & CDNs

1. **Zero Host Rebuilds:** You can deploy a new version of `checkout_mfe` to a new CDN URL, update the database/API record, and all users will instantly receive the updated remote without needing a rebuild or redeployment of the Host Shell.
2. **Tenant/Role-Based Routing:** Your API can return completely different remote URLs or hide specific MFEs based on the logged-in user's role or tenant subscription (`tenantId`).
3. **Environment Flexibility:** Dev, Staging, and Production host builds share the exact same JavaScript binary—they simply query their environment-specific API endpoint to resolve MFE locations.
