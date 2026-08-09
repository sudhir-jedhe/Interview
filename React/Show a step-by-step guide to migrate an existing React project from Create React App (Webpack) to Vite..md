Migrating from **Create React App (CRA)** to **Vite** significantly reduces cold server startup times and provides instantaneous Hot Module Replacement (HMR).

Here is a step-by-step guide to migrating your React project.

---

### Step 1: Remove CRA Dependencies

Uninstall `react-scripts` and install `vite` alongside `@vitejs/plugin-react` as development dependencies.

```bash
npm uninstall react-scripts
npm install -D vite @vitejs/plugin-react

```

---

### Step 2: Update `package.json` Scripts

Replace the `react-scripts` commands in your `package.json` with Vite's CLI commands.

```json
// package.json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}

```

---

### Step 3: Move and Update `index.html`

Vite treats `index.html` as the main entry point to your application rather than a static template asset.

1. **Move `index.html**` from the `public/` directory to the **root directory** of your project (where `package.json` resides).
2. **Remove `%PUBLIC_URL%` placeholders** from all asset paths (e.g., replace `%PUBLIC_URL%/favicon.ico` with `/favicon.ico`).
3. **Add the entry script tag** inside the `<body>` element pointing directly to your entry file (e.g., `/src/index.jsx` or `/src/main.tsx`):

```html
<!-- index.html (Root folder) -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My React App</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- Add entry script tag below -->
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>

```

---

### Step 4: Create `vite.config.js`

Create a `vite.config.js` (or `vite.config.ts`) file in the root directory:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Matches CRA default port
    open: true, // Automatically open browser on start
  },
});

```

---

### Step 5: Rename JSX Files (Strict Requirement)

Vite uses `esbuild` for fast compilation. Unlike CRA, Vite requires any file containing JSX syntax to have a `.jsx` or `.tsx` extension instead of `.js` or `.ts`.

* Rename files containing JSX (like `App.js` or `index.js`) to `App.jsx` or `index.jsx`.

---

### Step 6: Update Environment Variables

CRA uses the `REACT_APP_` prefix, while Vite uses `VITE_`.

1. **Rename environment keys in your `.env` files:**

```text
# Old (CRA)
REACT_APP_API_URL=https://api.example.com

# New (Vite)
VITE_API_URL=https://api.example.com

```

1. **Update variable access in code:**
Replace `process.env.REACT_APP_*` with `import.meta.env.VITE_*`.

```javascript
// Old
const url = process.env.REACT_APP_API_URL;

// New
const url = import.meta.env.VITE_API_URL;

```

---

### Step 7: (Optional) Configure Path Aliases & SVG Imports

#### If you used Absolute Imports (`src/components/...`)

Add alias resolution in `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});

```

#### If you import SVGs as React Components (`import { ReactComponent as Logo } from './logo.svg'`)

Install `vite-plugin-svgr`:

```bash
npm install -D vite-plugin-svgr

```

Then add it to `vite.config.js`:

```javascript
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
});

```

---

### Step 8: Test and Run

Start your new dev server:

```bash
npm run dev

```

Build the production bundle to verify the setup:

```bash
npm run build

```
