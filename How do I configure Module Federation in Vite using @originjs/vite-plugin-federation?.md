To configure Module Federation in Vite using `@originjs/vite-plugin-federation`, you set up two separate applications: a **Remote** (which exposes components or utilities) and a **Host** (which consumes the exposed modules).

---

### Step 1: Install the Plugin in Both Projects

Run this in both your Host and Remote directories:

```bash
npm install @originjs/vite-plugin-federation --save-dev

```

---

### Step 2: Configure the Remote Application (The Exposer)

The Remote app exposes components for other applications to use and generates an entry file (typically `remoteEntry.js`).

#### `remote/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      // Modules to expose
      exposes: {
        './Button': './src/components/Button.tsx',
        './Header': './src/components/Header.tsx',
      },
      // Shared libraries to avoid loading multiple instances
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    // Required: set target to ESNext or modern browser to support top-level await
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5001, // Run Remote on port 5001
    cors: true, // Enable CORS so Host can fetch remoteEntry.js
  },
  preview: {
    port: 5001,
    cors: true,
  },
});

```

#### Expose a Component (`remote/src/components/Button.tsx`)

```tsx
import React from 'react';

export interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        backgroundColor: '#7c3aed',
        color: '#fff',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {label} (from Remote)
    </button>
  );
};

export default Button;

```

---

### Step 3: Configure the Host Application (The Consumer)

The Host defines the URL where the Remote's `remoteEntry.js` is hosted and specifies matching shared dependencies.

#### `host/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        // Points to the Remote app's entry file
        remoteApp: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
  },
  server: {
    port: 5000, // Run Host on port 5000
  },
});

```

---

### Step 4: Add TypeScript Declarations in Host (Optional but Recommended)

If using TypeScript, the Host will throw a type error when importing from `remoteApp/Button` because the file does not exist locally.

Create `host/src/declarations.d.ts`:

```typescript
declare module 'remoteApp/Button' {
  import { ComponentType } from 'react';
  
  export interface ButtonProps {
    label: string;
    onClick?: () => void;
  }
  
  export const Button: ComponentType<ButtonProps>;
  export default Button;
}

```

---

### Step 5: Consume the Remote Component in Host

Use React's `lazy` and `Suspense` to dynamically load the federated module:

#### `host/src/App.tsx`

```tsx
import React, { Suspense, lazy } from 'react';

// Dynamic import of the remote component
const RemoteButton = lazy(() => import('remoteApp/Button'));

export function App() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>Host Application</h1>
      <p>This is rendered in the Host shell.</p>

      <div style={{ marginTop: '16px', padding: '16px', border: '1px dashed #ccc' }}>
        <h3>Federated Remote Component:</h3>
        <Suspense fallback={<div>Loading Remote Button...</div>}>
          <RemoteButton
            label="Click Me"
            onClick={() => alert('Clicked remote button inside host!')}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default App;

```

---

### Step 6: Running in Development vs. Production

`@originjs/vite-plugin-federation` works best in production builds because Vite development mode serves native unbundled ES modules, whereas Module Federation relies on chunk graphs created at build time.

#### Workflow to Test

1. **Build & Preview the Remote:**

```bash
cd remote
npm run build
npm run preview # Starts server at http://localhost:5001

```

1. **Run the Host:**

```bash
cd host
npm run dev     # Starts server at http://localhost:5000

```

1. Open `http://localhost:5000` in your browser. The Host will fetch `remoteEntry.js` from port `5001` and render the button seamlessly.

---

### Key Configuration Options & Gotchas

| Setting                  | Recommendation                        | Why                                                                                                  |
| ------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `build.target: 'esnext'` | **Required** in both apps             | Module Federation uses top-level `await` under the hood to resolve remotes before initialization.    |
| `cors: true`             | **Required** on Remote server         | Browsers block cross-origin script fetching for `remoteEntry.js` without CORS headers.               |
| `shared`                 | `['react', 'react-dom']`              | Prevents multiple versions of React from running simultaneously (avoids "Invalid Hook Call" errors). |
| CSS Handling             | `build.cssCodeSplit: false` on Remote | Ensures styles associated with exposed components are injected into the single remote bundle.        |
