Setting up the **React Compiler** requires a modern React build setup (such as **Vite**, **Next.js**, or a custom **Babel** pipeline) running **React 19**.

Here is a complete, step-by-step guide to installing, configuring, and verifying the compiler in your project.

---

## Step 1: Install Dependencies & Run the Health Check

Before enabling the compiler, run the official React Compiler health check tool to verify that your codebase adheres to the **Rules of React** and is compatible:

```bash
npx react-compiler-healthcheck@latest

```

Next, install the official compiler Babel plugin and eslint plugin:

```bash
# npm
npm install -D babel-plugin-react-compiler@latest eslint-plugin-react-compiler@latest

# pnpm
pnpm add -D babel-plugin-react-compiler@latest eslint-plugin-react-compiler@latest

# yarn
yarn add -D babel-plugin-react-compiler@latest eslint-plugin-react-compiler@latest

```

---

## Step 2: Configure Build Tools

Choose your build setup below:

### Option A: Vite (`vite.config.ts`)

Update your `vite.config.ts` to include `babel-plugin-react-compiler` inside `@vitejs/plugin-react`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});

```

---

### Option B: Next.js (`next.config.mjs`)

Next.js has built-in, first-class support for the React Compiler. Enable it in your `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;

```

---

### Option C: Custom Babel Configuration (`babel.config.js` / `.babelrc`)

If you use a custom Webpack or Rollup setup with Babel, add the plugin to your Babel configuration:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', { target: '19' }]
  ],
};

```

---

## Step 3: Configure ESLint Rules (Recommended)

The React Compiler relies on your code following the Rules of React. Add the `eslint-plugin-react-compiler` to catch potential violations in your editor before build time:

### For ESLint Flat Config (`eslint.config.js`)

```javascript
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
];

```

### For Legacy `.eslintrc.js`

```javascript
module.exports = {
  plugins: ['eslint-plugin-react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
};

```

---

## Step 4: Verify the Compiler is Working

To confirm that the React Compiler is actively optimizing your components:

1. Install the latest **React Developer Tools** browser extension in Chrome or Firefox.
2. Open DevTools and navigate to the **⚛️ Components** tab.
3. Look for components in the tree that have a **`Memo ✨`** badge next to their name.

```
▼ <App>
    ▼ <Dashboard>
        <UserList> ✨ Memo
        <Sidebar> ✨ Memo

```

The **`✨ Memo`** badge indicates that the React Compiler auto-memoized that component and its JSX outputs at build time.

---

## Advanced Options: Opt-In / Opt-Out Directives

If you are migrating a large existing codebase and want to enable or disable compilation for specific components, you can use directives:

### Opting Out a Specific Component

If a legacy component breaks or mutates state directly, disable the compiler for that component using `"use no memo"`:

```tsx
function LegacyComponent({ data }) {
  "use no memo"; // Tells React Compiler to skip this function
  
  // Legacy or non-pure logic here...
  return <div>{data.val}</div>;
}

```

### Opt-In Mode (Gated Rollout)

You can configure the compiler in `opt-in` mode in your Babel config, so it only compiles components marked with `"use memo"`:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', { compilationMode: 'annotation' }]
  ],
};

```

```tsx
function SpecificComponent() {
  "use memo"; // Only this component will be compiled
  return <div>Optimized!</div>;
}

```

The **React Compiler** (initially developed under the codename *React Forget*) is an optimizing, build-time compiler created by the React team. Its primary job is to **automatically memoize component state, function references, and JSX render trees**, eliminating the need for developers to manually write `useMemo`, `useCallback`, or `React.memo`.

---

## 1. The Core Problem It Solves

Historically, React components re-rendered their entire subtree whenever a parent's state changed unless you manually optimized them:

```tsx
// ❌ Manual Optimization (React 18 & older)
function ProductList({ products, query, onSelect }) {
  // 1. Manual useMemo for expensive filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.name.includes(query));
  }, [products, query]);

  // 2. Manual useCallback for stable function reference
  const handleSelect = useCallback(
    (id) => {
      onSelect(id);
    },
    [onSelect]
  );

  return <List items={filteredProducts} onItemClick={handleSelect} />;
}

```

### Problems with Manual Memoization

* **Developer Friction:** Deciding *what* to memoize adds mental tax.
* **Stale Closure Bugs:** Missing dependencies causes subtle bugs; extra dependencies break caching.
* **Coarse Granularity:** Manual hooks only memoize individual values, not the actual JSX render steps.

---

## 2. How the React Compiler Works

With the compiler enabled, you write plain, idiomatic JavaScript and React code. The compiler analyzes the data flow and transforms it into fine-grained reactive caches at build time.

### You Write Clean Code

```tsx
// ✅ Clean, standard React code
function ProductList({ products, query, onSelect }) {
  const filteredProducts = products.filter((p) => p.name.includes(query));

  const handleSelect = (id) => {
    onSelect(id);
  };

  return <List items={filteredProducts} onItemClick={handleSelect} />;
}

```

### What the Compiler Outputs (Conceptual Mental Model)

```js
// ⚙️ Compiled Output (Simplified)
function ProductList(props) {
  const $ = useMemoCache(8); // Allocates internal cache slots
  const { products, query, onSelect } = props;

  // 1. Auto-memoizes calculation
  let filteredProducts;
  if ($[0] !== products || $[1] !== query) {
    filteredProducts = products.filter((p) => p.name.includes(query));
    $[0] = products;
    $[1] = query;
    $[2] = filteredProducts;
  } else {
    filteredProducts = $[2];
  }

  // 2. Auto-memoizes callback
  let handleSelect;
  if ($[3] !== onSelect) {
    handleSelect = (id) => { onSelect(id); };
    $[3] = onSelect;
    $[4] = handleSelect;
  } else {
    handleSelect = $[4];
  }

  // 3. Auto-memoizes JSX tree!
  let jsx;
  if ($[5] !== filteredProducts || $[6] !== handleSelect) {
    jsx = <List items={filteredProducts} onItemClick={handleSelect} />;
    $[5] = filteredProducts;
    $[6] = handleSelect;
    $[7] = jsx;
  } else {
    jsx = $[7];
  }

  return jsx;
}

```

---

## 3. Quick Setup Guide

### 1. Install Plugin

```bash
npm install -D babel-plugin-react-compiler eslint-plugin-react-compiler

```

### 2. Configure Build Tool

#### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});

```

#### Next.js (`next.config.mjs`)

```javascript
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};
export default nextConfig;

```

---

## 4. Key Rules to Follow

For the compiler to safely optimize your components, your code must strictly adhere to the **Rules of React**:

1. **Components must be pure:** Given the same props and state, they must return the same JSX.
2. **Never mutate props or state objects directly:** Always use immutable updates (e.g., `setItems(prev => [...prev, newItem])`).
3. **No side effects in render:** Keep DOM mutations, network calls, and timers inside event handlers or `useEffect`.

> **Bypassing the compiler:** If a specific legacy component breaks under compilation, you can add `"use no memo";` at the top of the function to opt out.

---

## Comparison Matrix

| Metric           | Manual Memoization (`useMemo` / `useCallback`)            | React Compiler                                           |
| ---------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| **Boilerplate**  | High (`useMemo`, `useCallback`, `React.memo`).            | **Zero** (Standard JS).                                  |
| **Bug Risk**     | High (stale closure bugs from invalid dependency arrays). | **Zero** (Dependencies inferred via static analysis).    |
| **Scope**        | Coarse (Manual variables or entire components).           | **Fine-grained** (Individual expressions and JSX nodes). |
| **Runtime Cost** | Checks hooks and dependency arrays during render.         | Optimized index-based cache lookup (`useMemoCache`).     |
